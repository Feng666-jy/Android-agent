package com.androidagent.app.a11y

import org.json.JSONObject

/**
 * A11y 工具执行器（T25）— 把 JSON 命令翻译为 AndroidAccessibilityService 操作。
 * 命令来自 Device Bridge（WSS）或前端 JS（AccessibilityPlugin）。
 */
object AccessibilityExecutor {

    fun execute(tool: String, args: JSONObject): Result<Any> {
        val service = AndroidAccessibilityService.instance
            ?: return Result.failure(Exception("无障碍服务未启用：请在系统设置 → 无障碍中开启「Android Agent 无障碍」"))
        return try {
        when (tool) {
            "get_ui_tree" -> Result.success(service.dumpUiTree())

            "ui_find" -> {
                val found = service.findNode(
                    args.optString("text").ifEmpty { null },
                    args.optString("regex").ifEmpty { null },
                    args.optInt("index", 0)
                )
                if (found == null) Result.failure(Exception("未找到匹配节点"))
                else Result.success(found)
            }

            "ui_click" -> {
                val text = args.optString("text").ifEmpty { null }
                val x = if (args.has("x") && !args.isNull("x")) args.optInt("x") else null
                val y = if (args.has("y") && !args.isNull("y")) args.optInt("y") else null
                if (text == null && (x == null || y == null)) {
                    Result.failure(Exception("ui_click 需要 text 或 x/y 坐标"))
                } else if (service.click(text, x, y)) {
                    Result.success(JSONObject().put("clicked", true))
                } else {
                    Result.failure(Exception("点击失败：节点不存在或坐标无效"))
                }
            }

            "ui_input" -> {
                val text = args.optString("text")
                if (text.isEmpty()) Result.failure(Exception("ui_input 需要 text"))
                else if (service.input(text)) Result.success(JSONObject().put("typed", text.length))
                else Result.failure(Exception("输入失败：未找到可输入焦点"))
            }

            "ui_swipe" -> {
                val direction = args.optString("direction").ifEmpty { null }
                val ok = service.swipe(
                    direction,
                    if (args.has("x1") && !args.isNull("x1")) args.optInt("x1") else null,
                    if (args.has("y1") && !args.isNull("y1")) args.optInt("y1") else null,
                    if (args.has("x2") && !args.isNull("x2")) args.optInt("x2") else null,
                    if (args.has("y2") && !args.isNull("y2")) args.optInt("y2") else null,
                    args.optInt("duration", 300)
                )
                if (ok) Result.success(JSONObject().put("swiped", true))
                else Result.failure(Exception("滑动失败"))
            }

            "ui_back" -> {
                if (service.back()) Result.success(JSONObject().put("back", true))
                else Result.failure(Exception("返回失败"))
            }

            else -> Result.failure(Exception("unknown a11y tool: $tool"))
        }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
