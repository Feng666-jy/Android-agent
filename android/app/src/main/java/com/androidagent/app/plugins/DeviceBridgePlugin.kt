package com.androidagent.app.plugins

import android.content.Context
import android.content.SharedPreferences
import android.util.Base64
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import okhttp3.WebSocket
import okhttp3.WebSocketListener
import okio.ByteString
import com.androidagent.app.vision.VisionExecutor
import org.json.JSONArray
import org.json.JSONObject
import java.security.MessageDigest
import java.util.UUID
import java.util.concurrent.TimeUnit

/**
 * Device Bridge 插件 — 端侧 WSS 长连接（T22）
 *
 * 职责：
 *  - connect(serverUrl, token)：建立 WSS（/ws/device?token=..&deviceId=..）
 *  - 注册 hello（设备信息 + 能力位 native/a11y/vision）
 *  - 心跳 30s + 服务端 ping/pong
 *  - 收到 command → 按 kind 分发到 Native/A11y/Vision 执行器 → command_result 回发
 */
@CapacitorPlugin(name = "DeviceBridge")
class DeviceBridgePlugin : Plugin() {

    private var ws: WebSocket? = null
    private val scope = CoroutineScope(Dispatchers.Default)
    private val prefs: SharedPreferences by lazy {
        context.getSharedPreferences("device_bridge", Context.MODE_PRIVATE)
    }

    /** 设备唯一 ID：Android ID 哈希（跨重装稳定由厂商决定，此处用 Settings.Secure.ANDROID_ID） */
    private fun deviceId(): String {
        val cached = prefs.getString("device_id", null)
        if (cached != null) return cached
        val androidId = android.provider.Settings.Secure.getString(
            context.contentResolver, android.provider.Settings.Secure.ANDROID_ID
        ) ?: UUID.randomUUID().toString()
        val digest = MessageDigest.getInstance("SHA-256").digest(androidId.toByteArray())
        val hash = Base64.encodeToString(digest, Base64.NO_WRAP or Base64.URL_SAFE)
            .replace("=", "").take(24)
        prefs.edit().putString("device_id", hash).apply()
        return hash
    }

    private fun capabilities(): JSONObject {
        val caps = JSONObject()
        caps.put("native", true)
        caps.put("a11y", com.androidagent.app.a11y.AndroidAccessibilityService.instance != null)
        caps.put("vision", prefs.getBoolean("media_projection_granted", false))
        return caps
    }

    @PluginMethod
    fun connect(call: PluginCall) {
        val serverUrl = call.getString("serverUrl") ?: run { call.reject("serverUrl required"); return }
        val token = call.getString("token") ?: run { call.reject("token required"); return }

        val url = serverUrl.trimEnd('/') + "/ws/device?token=" + java.net.URLEncoder.encode(token, "UTF-8") +
                "&deviceId=" + deviceId()
        val client = OkHttpClient.Builder()
            .pingInterval(20, TimeUnit.SECONDS)
            .connectTimeout(15, TimeUnit.SECONDS)
            .build()
        val request = Request.Builder().url(url).build()
        ws = client.newWebSocket(request, object : WebSocketListener() {
            override fun onOpen(webSocket: WebSocket, response: Response) {
                sendHello()
                call.resolve(JSObject().put("connected", true).put("deviceId", deviceId()))
            }

            override fun onMessage(webSocket: WebSocket, text: String) {
                handleServerMessage(text)
            }

            override fun onMessage(webSocket: WebSocket, bytes: ByteString) {}

            override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
                call.reject("connect failed: ${t.message}", t)
                scheduleReconnect(serverUrl, token)
            }

            override fun onClosed(webSocket: WebSocket, code: Int, reason: String) {
                if (code != 4001 && code != 4003) scheduleReconnect(serverUrl, token)
            }
        })
    }

    @PluginMethod
    fun disconnect(call: PluginCall) {
        ws?.close(1000, "user disconnect")
        ws = null
        call.resolve()
    }

    @PluginMethod
    fun getDeviceId(call: PluginCall) {
        call.resolve(JSObject().put("deviceId", deviceId()))
    }

    // ---------------------------------------------------------------------

    private fun sendHello() {
        val payload = JSONObject()
        payload.put("deviceId", deviceId())
        payload.put("platform", "android")
        payload.put("model", android.os.Build.MODEL)
        payload.put("osVersion", android.os.Build.VERSION.RELEASE)
        payload.put("appVersion", appVersion())
        payload.put("capabilities", capabilities())
        send(JSONObject().put("type", "hello").put("deviceId", deviceId()).put("ts", now()).put("payload", payload))
    }

    private fun appVersion(): String =
        try {
            context.packageManager.getPackageInfo(context.packageName, 0).versionName ?: "1.0.0"
        } catch (e: Exception) {
            "1.0.0"
        }

    private fun handleServerMessage(text: String) {
        val msg = try { JSONObject(text) } catch (e: Exception) { return }
        when (msg.optString("type")) {
            "command" -> dispatchCommand(msg)
            "ping" -> send(JSONObject().put("type", "heartbeat").put("deviceId", deviceId()).put("ts", now()))
            "hello_ack" -> Unit
        }
    }

    private fun dispatchCommand(cmd: JSONObject) {
        val id = cmd.optString("id")
        val kind = cmd.optString("kind")
        val tool = cmd.optString("tool")
        val args = cmd.optJSONObject("args") ?: JSONObject()
        val channel = cmd.optString("channel", "STANDARD")

        scope.launch {
            val result = withContext(Dispatchers.Main) {
                val activity = activity
                when (kind) {
                    "native" -> NativeToolExecutor(context, activity).execute(tool, args)
                    "a11y" -> com.androidagent.app.a11y.AccessibilityExecutor.execute(tool, args)
                    "vision" -> VisionExecutor(context, activity, prefs).execute(tool, args, channel)
                    else -> Result.failure(Exception("unknown kind: $kind"))
                }
            }
            val payload = JSONObject()
            payload.put("id", id)
            if (result.isSuccess) {
                val out = result.getOrNull()
                payload.put("ok", true)
                payload.put("output", out ?: JSONObject())
            } else {
                payload.put("ok", false)
                payload.put("error", result.exceptionOrNull()?.message ?: "unknown error")
            }
            send(JSONObject().put("type", "command_result").put("deviceId", deviceId()).put("ts", now()).put("payload", payload))
        }
    }

    private var reconnectAttempt = 0
    private fun scheduleReconnect(serverUrl: String, token: String) {
        val delay = (1000L shl minOf(reconnectAttempt, 5)).coerceAtMost(30_000L)
        reconnectAttempt++
        scope.launch {
            kotlinx.coroutines.delay(delay)
            if (ws == null) {
                val call = PluginCall(JSObject().put("serverUrl", serverUrl).put("token", token), "connect", "", null)
                connect(call)
            }
        }
    }

    private fun send(text: String) {
        ws?.send(text)
    }

    private fun now(): String = java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", java.util.Locale.US)
        .apply { timeZone = java.util.TimeZone.getTimeZone("UTC") }.format(java.util.Date())
}

/** Native 工具执行器（T23：battery / launch_app / send_notification / list_files） */
class NativeToolExecutor(
    private val ctx: Context,
    private val activity: android.app.Activity?
) {
    fun execute(tool: String, args: JSONObject): Result<Any> = try {
        when (tool) {
            "battery" -> battery()
            "launch_app" -> launchApp(args.optString("package"))
            "send_notification" -> sendNotification(args.optString("title"), args.optString("body"))
            "list_files" -> listFiles(args.optString("path", ""))
            else -> Result.failure(Exception("unknown native tool: $tool"))
        }
    } catch (e: Exception) {
        Result.failure(e)
    }

    private fun battery(): Result<Any> {
        val intent = ctx.registerReceiver(null, android.content.IntentFilter(android.content.Intent.ACTION_BATTERY_CHANGED))
        val level = intent?.getIntExtra(android.os.BatteryManager.EXTRA_LEVEL, -1) ?: -1
        val scale = intent?.getIntExtra(android.os.BatteryManager.EXTRA_SCALE, 100) ?: 100
        val status = intent?.getIntExtra(android.os.BatteryManager.EXTRA_STATUS, -1) ?: -1
        val charging = status == android.os.BatteryManager.BATTERY_STATUS_CHARGING ||
                status == android.os.BatteryManager.BATTERY_STATUS_FULL
        val out = JSONObject()
        out.put("level", if (scale > 0) level * 100 / scale else level)
        out.put("charging", charging)
        return Result.success(out)
    }

    private fun launchApp(pkg: String): Result<Any> {
        if (pkg.isBlank()) return Result.failure(Exception("package required"))
        val intent = ctx.packageManager.getLaunchIntentForPackage(pkg)
            ?: return Result.failure(Exception("app not installed: $pkg"))
        intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK)
        ctx.startActivity(intent)
        return Result.success(JSONObject().put("launched", pkg))
    }

    private fun sendNotification(title: String, body: String): Result<Any> {
        val channelId = "agent_notifications"
        val nm = ctx.getSystemService(Context.NOTIFICATION_SERVICE) as android.app.NotificationManager
        if (android.os.Build.VERSION.SDK_INT >= 26) {
            val channel = android.app.NotificationChannel(
                channelId, "Agent Notifications", android.app.NotificationManager.IMPORTANCE_DEFAULT
            )
            nm.createNotificationChannel(channel)
        }
        val notification = android.app.Notification.Builder(ctx, channelId)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(title)
            .setContentText(body)
            .setAutoCancel(true)
            .build()
        nm.notify(System.currentTimeMillis().toInt(), notification)
        return Result.success(JSONObject().put("sent", true))
    }

    private fun listFiles(path: String): Result<Any> {
        val base = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOWNLOADS)
        val dir = android.os.Environment.getExternalStorageDirectory()
        val target = if (path.isBlank()) dir else java.io.File(dir, path.trimStart('/'))
        if (!target.exists() || !target.isDirectory) return Result.failure(Exception("directory not found: $path"))
        val arr = JSONArray()
        target.listFiles()?.sortedBy { it.name }?.forEach { f ->
            val item = JSONObject()
            item.put("name", f.name)
            item.put("isDir", f.isDirectory)
            item.put("size", if (f.isFile) f.length() else 0)
            arr.put(item)
        }
        val out = JSONObject()
        out.put("path", target.absolutePath)
        out.put("entries", arr)
        return Result.success(out)
    }
}
