package com.androidagent.app.vision

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import androidx.core.app.ServiceCompat

/**
 * 截图前台服务（T26）— MediaProjection 必须在前台服务中运行。
 *
 * 启动方式：ScreenshotForegroundService.start(context, resultCode, data)
 *  - resultCode/data 来自 MediaProjectionManager.createScreenCaptureIntent() 的
 *    ActivityResult（Activity.RESULT_OK + Intent data）
 *
 * 服务常驻直到显式 stop（ScreenshotEngine 持有全部投影资源）。
 */
class ScreenshotForegroundService : Service() {

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val resultCode = intent?.getIntExtra(EXTRA_RESULT_CODE, 0) ?: 0
        val data = if (Build.VERSION.SDK_INT >= 33) {
            intent?.getParcelableExtra(EXTRA_DATA, Intent::class.java)
        } else {
            @Suppress("DEPRECATION")
            intent?.getParcelableExtra(EXTRA_DATA)
        }

        startForegroundCompat()

        if (resultCode != 0 && data != null) {
            ScreenshotEngine.start(this, resultCode, data)
        }
        // 常驻：直到 stop() / onDestroy（由 VisionPlugin 或引擎停止时触发）
        return START_STICKY
    }

    override fun onDestroy() {
        ScreenshotEngine.stop()
        super.onDestroy()
    }

    private fun startForegroundCompat() {
        val channelId = "agent_vision"
        val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (Build.VERSION.SDK_INT >= 26) {
            nm.createNotificationChannel(
                NotificationChannel(channelId, "Agent Vision", NotificationManager.IMPORTANCE_LOW)
            )
        }
        val notification = Notification.Builder(this, channelId)
            .setSmallIcon(android.R.drawable.ic_menu_camera)
            .setContentTitle("Android Agent")
            .setContentText("屏幕截图通道运行中")
            .setOngoing(true)
            .build()
        if (Build.VERSION.SDK_INT >= 34) {
            ServiceCompat.startForeground(
                this, NOTIFICATION_ID, notification,
                ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PROJECTION
            )
        } else {
            ServiceCompat.startForeground(this, NOTIFICATION_ID, notification, 0)
        }
    }

    companion object {
        private const val NOTIFICATION_ID = 1001
        const val EXTRA_RESULT_CODE = "result_code"
        const val EXTRA_DATA = "result_data"
        const val ACTION_START = "com.androidagent.app.vision.START"
        const val ACTION_STOP = "com.androidagent.app.vision.STOP"

        /** 启动截图服务（API 26+ 使用 startForegroundService，需 5s 内 startForeground） */
        fun start(context: Context, resultCode: Int, data: Intent) {
            val intent = Intent(context, ScreenshotForegroundService::class.java)
                .setAction(ACTION_START)
                .putExtra(EXTRA_RESULT_CODE, resultCode)
                .putExtra(EXTRA_DATA, data)
            if (Build.VERSION.SDK_INT >= 26) {
                context.startForegroundService(intent)
            } else {
                context.startService(intent)
            }
        }

        /** 停止截图服务并释放 MediaProjection */
        fun stop(context: Context) {
            context.stopService(Intent(context, ScreenshotForegroundService::class.java))
        }
    }
}
