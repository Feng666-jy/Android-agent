package com.androidagent.app.plugins

import android.content.Intent
import android.provider.Settings
import com.androidagent.app.a11y.AccessibilityExecutor
import com.androidagent.app.a11y.AndroidAccessibilityService
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

/**
 * Accessibility 插件（T24/T25）— 无障碍服务状态查询 + 引导开启 + JS 直调执行。
 */
@CapacitorPlugin(name = "Accessibility")
class AccessibilityPlugin : Plugin() {

    @PluginMethod
    fun isEnabled(call: PluginCall) {
        call.resolve(JSObject().put("enabled", AndroidAccessibilityService.instance != null))
    }

    @PluginMethod
    fun openSettings(call: PluginCall) {
        try {
            val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(intent)
            call.resolve()
        } catch (e: Exception) {
            call.reject("open settings failed: ${e.message}")
        }
    }

    @PluginMethod
    fun execute(call: PluginCall) {
        val tool = call.getString("tool") ?: run { call.reject("tool required"); return }
        val args = call.getObject("args") ?: JSObject()
        val result = AccessibilityExecutor.execute(tool, args)
        if (result.isSuccess) {
            call.resolve(JSObject().put("ok", true).put("output", result.getOrNull()))
        } else {
            call.reject(result.exceptionOrNull()?.message ?: "unknown error")
        }
    }
}
