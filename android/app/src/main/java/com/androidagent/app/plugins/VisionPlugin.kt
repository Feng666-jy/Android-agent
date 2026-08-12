package com.androidagent.app.plugins

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.media.projection.MediaProjectionManager
import com.androidagent.app.vision.ScreenshotEngine
import com.androidagent.app.vision.ScreenshotForegroundService
import com.androidagent.app.vision.VisionExecutor
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

/**
 * Vision 插件（T26）— MediaProjection 授权 + 截图 + 坐标操作。
 *
 * 授权流程：
 *  1. requestPermission() → 系统弹窗（屏幕录制授权）
 *  2. 用户同意 → 启动 ScreenshotForegroundService（MediaProjection 前台服务）
 *  3. takeScreenshot() / visionDo() 即可使用
 *
 * Android 14+ 授权 token 一次性：服务停止后需重新授权。
 */
@CapacitorPlugin(name = "Vision")
class VisionPlugin : Plugin() {

    private val prefs: SharedPreferences by lazy {
        context.getSharedPreferences("device_bridge", Context.MODE_PRIVATE)
    }
    private var pendingCall: PluginCall? = null

    @PluginMethod
    fun requestPermission(call: PluginCall) {
        val activity = activity ?: run { call.reject("no activity"); return }
        val mpm = context.getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
        if (pendingCall != null) {
            call.reject("授权请求进行中")
            return
        }
        pendingCall = call
        activity.startActivityForResult(mpm.createScreenCaptureIntent(), REQUEST_MEDIA_PROJECTION)
    }

    @PluginMethod
    fun hasPermission(call: PluginCall) {
        val granted = ScreenshotEngine.isRunning || prefs.getBoolean("media_projection_granted", false)
        call.resolve(JSObject().put("granted", granted))
    }

    @PluginMethod
    fun stopProjection(call: PluginCall) {
        ScreenshotForegroundService.stop(context)
        prefs.edit().putBoolean("media_projection_granted", false).apply()
        call.resolve()
    }

    @PluginMethod
    fun takeScreenshot(call: PluginCall) {
        if (!ScreenshotEngine.isRunning) {
            call.reject("Vision 通道未授权：请先调用 requestPermission")
            return
        }
        val shot = ScreenshotEngine.capture(context)
        if (shot == null) {
            call.reject("截图失败：无可用帧")
        } else {
            call.resolve(
                JSObject()
                    .put("path", shot.optString("path"))
                    .put("width", shot.optInt("width"))
                    .put("height", shot.optInt("height"))
            )
        }
    }

    @PluginMethod
    fun visionDo(call: PluginCall) {
        val args = call.getObject("args") ?: JSObject()
        val channel = call.getString("channel") ?: "A11Y"
        val result = VisionExecutor(context, activity, prefs).execute("vision_do", args, channel)
        if (result.isSuccess) {
            call.resolve(JSObject().put("ok", true).put("output", result.getOrNull()))
        } else {
            call.reject(result.exceptionOrNull()?.message ?: "unknown error")
        }
    }

    override fun handleOnActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.handleOnActivityResult(requestCode, resultCode, data)
        if (requestCode != REQUEST_MEDIA_PROJECTION) return
        val call = pendingCall
        pendingCall = null
        if (resultCode == Activity.RESULT_OK && data != null) {
            prefs.edit().putBoolean("media_projection_granted", true).apply()
            ScreenshotForegroundService.start(context, resultCode, data)
            call?.resolve(JSObject().put("granted", true))
        } else {
            prefs.edit().putBoolean("media_projection_granted", false).apply()
            call?.reject("用户拒绝截图授权")
        }
    }

    companion object {
        private const val REQUEST_MEDIA_PROJECTION = 4001
    }
}
