package com.androidagent.app.vision

import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.PixelFormat
import android.hardware.display.DisplayManager
import android.hardware.display.VirtualDisplay
import android.media.ImageReader
import android.media.projection.MediaProjection
import android.media.projection.MediaProjectionManager
import android.os.Handler
import android.os.HandlerThread
import android.util.DisplayMetrics
import android.view.WindowManager
import org.json.JSONObject
import java.io.File
import java.io.FileOutputStream
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * 截图引擎（T26）— 持有 MediaProjection + ImageReader + VirtualDisplay 单例。
 *
 * 生命周期：
 *  - start()：由 ScreenshotForegroundService 在拿到用户授权结果后调用
 *  - capture()：任一时刻取最新一帧保存 PNG，返回 {path,width,height}
 *  - stop()：服务销毁 / MediaProjection 被系统回收时调用
 *
 * 注意：Android 14+ 的 MediaProjection 授权是一次性 token，每次重启服务
 * 都需要重新走用户授权（VisionPlugin.requestPermission）。
 */
object ScreenshotEngine {

    @Volatile private var mediaProjection: MediaProjection? = null
    @Volatile private var imageReader: ImageReader? = null
    @Volatile private var virtualDisplay: VirtualDisplay? = null
    @Volatile private var handlerThread: HandlerThread? = null
    @Volatile private var running = false

    private var width = 1080
    private var height = 1920
    private var densityDpi = 320

    val isRunning: Boolean get() = running

    /** 用授权结果启动投屏捕获（幂等：已运行则忽略） */
    fun start(context: Context, resultCode: Int, data: Intent) {
        if (running) return
        val mpm = context.getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
        val projection = mpm.getMediaProjection(resultCode, data) ?: return
        projection.registerCallback(object : MediaProjection.Callback() {
            override fun onStop() {
                // 系统回收（如用户停止投屏）→ 清理全部资源
                stop()
            }
        }, Handler(context.mainLooper))

        val wm = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager
        val metrics = DisplayMetrics()
        wm.defaultDisplay.getRealMetrics(metrics)
        width = metrics.widthPixels
        height = metrics.heightPixels
        densityDpi = metrics.densityDpi

        val thread = HandlerThread("agent-screenshot").apply { start() }
        handlerThread = thread
        val reader = ImageReader.newInstance(width, height, PixelFormat.RGBA_8888, 2)
        imageReader = reader
        virtualDisplay = projection.createVirtualDisplay(
            "agent-screenshot",
            width,
            height,
            densityDpi,
            DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR,
            reader.surface,
            null,
            Handler(thread.looper)
        )
        mediaProjection = projection
        running = true
    }

    /** 停止并释放全部资源 */
    fun stop() {
        running = false
        virtualDisplay?.release()
        virtualDisplay = null
        imageReader?.close()
        imageReader = null
        mediaProjection?.stop()
        mediaProjection = null
        handlerThread?.quitSafely()
        handlerThread = null
    }

    /** 截取最新一帧，保存到 filesDir/screenshots/，返回 {path,width,height}；无帧返回 null */
    fun capture(context: Context): JSONObject? {
        val reader = imageReader ?: return null
        val image = reader.acquireLatestImage() ?: return null
        try {
            val plane = image.planes[0]
            val pixelStride = plane.pixelStride
            val rowStride = plane.rowStride
            val rowPadding = rowStride - pixelStride * width
            val bitmap = Bitmap.createBitmap(
                width + rowPadding / pixelStride,
                height,
                Bitmap.Config.ARGB_8888
            )
            bitmap.copyPixelsFromBuffer(plane.buffer)
            val cropped = if (rowPadding > 0) {
                Bitmap.createBitmap(bitmap, 0, 0, width, height)
            } else {
                bitmap
            }

            val dir = File(context.filesDir, "screenshots").apply { mkdirs() }
            val name = "shot_" + SimpleDateFormat("yyyyMMdd_HHmmss_SSS", Locale.US).format(Date()) + ".png"
            val file = File(dir, name)
            FileOutputStream(file).use { cropped.compress(Bitmap.CompressFormat.PNG, 90, it) }

            val out = JSONObject()
            out.put("path", file.absolutePath)
            out.put("width", width)
            out.put("height", height)
            return out
        } catch (e: Exception) {
            return null
        } finally {
            image.close()
        }
    }
}
