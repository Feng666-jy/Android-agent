package com.androidagent.app.vision

import android.content.Context
import android.content.SharedPreferences
import com.androidagent.app.a11y.AndroidAccessibilityService
import org.json.JSONObject

/**
 * Vision 工具执行器（T26）— 截图（MediaProjection）+ 坐标操作（vision_do）。
 *
 * vision_do 的坐标手势在 Android 上最终复用无障碍手势通道
 * （dispatchGesture），因此需要 a11y 服务开启；channel=DEBUGGER 预留
 * 未来 adb/root 注入通道。
 */
class VisionExecutor(
    private val ctx: Context,
    private val activity: android.app.Activity?,
    private val prefs: SharedPreferences
) {

    fun execute(tool: String, args: JSONObject, channel: String): Result<Any> = try {
        when (tool) {
            "take_screenshot" -> takeScreenshot()
            "vision_do" -> visionDo(args, channel)
            else -> Result.failure(Exception("unknown vision tool: $tool"))
        }
    } catch (e: Exception) {
        Result.failure(e)
    }

    private fun takeScreenshot(): Result<Any> {
        if (!ScreenshotEngine.isRunning) {
            return Result.failure(
                Exception("Vision 通道未授权：请先在前端调用 requestMediaProjection 授权截图权限")
            )
        }
        val shot = ScreenshotEngine.capture(ctx)
            ?: return Result.failure(Exception("截图失败：无可用帧（屏幕可能已关闭）"))
        return Result.success(shot)
    }

    private fun visionDo(args: JSONObject, channel: String): Result<Any> {
        val action = args.optString("action", "tap")
        val service = AndroidAccessibilityService.instance
            ?: return Result.failure(Exception("坐标操作需要无障碍服务：请在系统设置 → 无障碍中开启「Android Agent 无障碍」"))

        val out = JSONObject()
        when (action) {
            "tap" -> {
                val x = args.optInt("x", -1)
                val y = args.optInt("y", -1)
                if (x < 0 || y < 0) return Result.failure(Exception("tap 需要 x/y 坐标"))
                out.put("ok", service.tap(x, y))
            }
            "swipe" -> {
                val x = args.optInt("x", -1)
                val y = args.optInt("y", -1)
                val x2 = args.optInt("x2", -1)
                val y2 = args.optInt("y2", -1)
                if (x < 0 || y < 0 || x2 < 0 || y2 < 0) {
                    return Result.failure(Exception("swipe 需要 x/y/x2/y2 坐标"))
                }
                out.put("ok", service.swipe(null, x, y, x2, y2, args.optInt("duration", 300)))
            }
            "back" -> out.put("ok", service.back())
            "text" -> {
                val text = args.optString("text")
                if (text.isEmpty()) return Result.failure(Exception("text 需要输入内容"))
                out.put("ok", service.input(text))
            }
            else -> return Result.failure(Exception("unknown vision action: $action"))
        }
        if (!out.optBoolean("ok")) return Result.failure(Exception("操作执行失败"))
        return Result.success(out)
    }
}
