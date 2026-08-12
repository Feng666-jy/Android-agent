package com.androidagent.app.plugins

import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import org.json.JSONArray

/**
 * Native 工具插件（T23）— 前端 JS 直调入口（不经 WSS）。
 * 供 Web UI 测试 / 授权引导使用；Agent 运行时统一走 Device Bridge。
 */
@CapacitorPlugin(name = "NativeTool")
class NativeToolPlugin : Plugin() {

    @PluginMethod
    fun execute(call: PluginCall) {
        val tool = call.getString("tool") ?: run { call.reject("tool required"); return }
        val args = call.getObject("args") ?: JSObject()
        val result = NativeToolExecutor(context, activity).execute(tool, args)
        if (result.isSuccess) {
            call.resolve(JSObject().put("ok", true).put("output", result.getOrNull()))
        } else {
            call.reject(result.exceptionOrNull()?.message ?: "unknown error")
        }
    }

    @PluginMethod
    fun listTools(call: PluginCall) {
        val arr = JSONArray()
        for (t in listOf("battery", "launch_app", "send_notification", "list_files")) arr.put(t)
        call.resolve(JSObject().put("tools", arr))
    }
}
