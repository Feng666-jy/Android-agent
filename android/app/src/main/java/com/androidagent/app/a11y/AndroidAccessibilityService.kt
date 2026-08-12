package com.androidagent.app.a11y

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.GestureDescription
import android.graphics.Path
import android.graphics.Rect
import android.os.Build
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import org.json.JSONArray
import org.json.JSONObject

/**
 * 无障碍服务（T24）— 系统级 UI 控制通道
 *
 * 能力：
 *  - 当前活跃窗口 UI 树序列化（T25：节点层级/文本/类名/bounds）
 *  - 按文本查找节点
 *  - 点击 / 输入 / 滑动 / 返回（GestureDescription + performAction）
 */
class AndroidAccessibilityService : AccessibilityService() {

    companion object {
        @Volatile
        var instance: AndroidAccessibilityService? = null
            private set
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        instance = this
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {}

    override fun onInterrupt() {}

    override fun onDestroy() {
        instance = null
        super.onDestroy()
    }

    /** 序列化当前根节点 UI 树（最大深度 12、节点上限 300，防爆炸） */
    fun dumpUiTree(): JSONObject {
        val root = rootInActiveWindow ?: throw IllegalStateException("no active window")
        return serializeNode(root, 0, 0)
    }

    private fun serializeNode(node: AccessibilityNodeInfo, depth: Int, counter: Int): JSONObject {
        val out = JSONObject()
        val rect = Rect()
        node.getBoundsInScreen(rect)
        out.put("id", counter)
        out.put("depth", depth)
        out.put("cls", node.className?.toString() ?: "")
        out.put("text", node.text?.toString() ?: "")
        out.put("desc", node.contentDescription?.toString() ?: "")
        out.put("pkg", node.packageName?.toString() ?: "")
        out.put("clickable", node.isClickable)
        out.put("focusable", node.isFocusable)
        out.put("checked", node.isChecked)
        out.put("bounds", JSONArray().put(rect.left).put(rect.top).put(rect.right).put(rect.bottom))
        if (depth < 12 && counter < 300) {
            val children = JSONArray()
            var idx = 0
            var nextCounter = counter + 1
            for (i in 0 until node.childCount) {
                val child = node.getChild(i) ?: continue
                val childNode = serializeNode(child, depth + 1, nextCounter)
                children.put(childNode)
                nextCounter = childNode.optInt("id") + 1
                idx++
                if (idx > 50) break
            }
            out.put("children", children)
        } else {
            out.put("children", JSONArray())
        }
        return out
    }

    /** 按文本/正则查找节点，返回首个匹配（含 bounds 中心坐标） */
    fun findNode(text: String?, regex: String?, index: Int): JSONObject? {
        val root = rootInActiveWindow ?: return null
        val pattern = regex?.let { runCatching { java.util.regex.Pattern.compile(it) }.getOrNull() }
        val candidates = mutableListOf<JSONObject>()
        val matches = mutableListOf<AccessibilityNodeInfo>()
        collectMatches(root, text, pattern, matches)
        if (matches.isEmpty()) return null
        val target = matches.getOrNull(index.coerceAtLeast(0)) ?: matches[0]
        val rect = Rect()
        target.getBoundsInScreen(rect)
        val out = JSONObject()
        out.put("text", target.text?.toString() ?: "")
        out.put("bounds", JSONArray().put(rect.left).put(rect.top).put(rect.right).put(rect.bottom))
        out.put("center", JSONArray().put((rect.left + rect.right) / 2).put((rect.top + rect.bottom) / 2))
        candidates.add(out)
        return out
    }

    private fun collectMatches(
        node: AccessibilityNodeInfo,
        text: String?,
        pattern: java.util.regex.Pattern?,
        out: MutableList<AccessibilityNodeInfo>
    ) {
        if (out.size >= 50) return
        val nodeText = node.text?.toString() ?: ""
        if (text != null && nodeText.contains(text)) out.add(node)
        else if (pattern != null && pattern.matcher(nodeText).find()) out.add(node)
        for (i in 0 until node.childCount) {
            node.getChild(i)?.let { collectMatches(it, text, pattern, out) }
        }
    }

    /** 点击：按文本找节点（performAction CLICK）或直接坐标（dispatchGesture） */
    fun click(text: String?, x: Int?, y: Int?): Boolean {
        if (text != null) {
            val node = findNodeByText(text) ?: return false
            return node.performAction(AccessibilityNodeInfo.ACTION_CLICK)
        }
        if (x != null && y != null) return tap(x, y)
        return false
    }

    private fun findNodeByText(text: String): AccessibilityNodeInfo? {
        val root = rootInActiveWindow ?: return null
        val found = mutableListOf<AccessibilityNodeInfo>()
        collectMatches(root, text, null, found)
        return found.firstOrNull()
    }

    fun tap(x: Int, y: Int): Boolean = dispatchGesture(gesture(gesturePath(x, y, x, y, 60L)), null, null)

    /** 输入文本：先 focus，再 ACTION_SET_TEXT */
    fun input(text: String): Boolean {
        val root = rootInActiveWindow ?: return false
        val focus = findFocus(AccessibilityNodeInfo.FOCUS_INPUT)
            ?: findEditable(root)
            ?: return false
        if (!focus.isFocused) focus.performAction(AccessibilityNodeInfo.ACTION_FOCUS)
        val args = android.os.Bundle().apply { putCharSequence(AccessibilityNodeInfo.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE, text) }
        return focus.performAction(AccessibilityNodeInfo.ACTION_SET_TEXT, args)
    }

    private fun findEditable(root: AccessibilityNodeInfo): AccessibilityNodeInfo? {
        if (root.isEditable) return root
        for (i in 0 until root.childCount) {
            root.getChild(i)?.let { findEditable(it) }?.let { return it }
        }
        return null
    }

    /** 滑动：方向或起止坐标 */
    fun swipe(direction: String?, x1: Int?, y1: Int?, x2: Int?, y2: Int?, durationMs: Int): Boolean {
        val rect = Rect()
        val root = rootInActiveWindow ?: return false
        root.getBoundsInScreen(rect)
        val duration = durationMs.coerceIn(50, 2000).toLong()
        val (sx1, sy1, sx2, sy2) = when (direction) {
            "up" -> intArrayOf(rect.centerX(), rect.bottom - 50, rect.centerX(), rect.top + 50)
            "down" -> intArrayOf(rect.centerX(), rect.top + 50, rect.centerX(), rect.bottom - 50)
            "left" -> intArrayOf(rect.right - 50, rect.centerY(), rect.left + 50, rect.centerY())
            "right" -> intArrayOf(rect.left + 50, rect.centerY(), rect.right - 50, rect.centerY())
            else -> intArrayOf(x1 ?: rect.centerX(), y1 ?: rect.centerY(), x2 ?: rect.centerX(), y2 ?: rect.centerY())
        }
        return dispatchGesture(gesture(gesturePath(sx1, sy1, sx2, sy2, duration)), null, null)
    }

    fun back(): Boolean = performGlobalAction(GLOBAL_ACTION_BACK)

    private fun gesture(stroke: GestureDescription.StrokeDescription): GestureDescription =
        GestureDescription.Builder().addStroke(stroke).build()

    private fun gesturePath(x1: Int, y1: Int, x2: Int, y2: Int, duration: Long): GestureDescription.StrokeDescription {
        val path = Path().apply { moveTo(x1.toFloat(), y1.toFloat()); lineTo(x2.toFloat(), y2.toFloat()) }
        return GestureDescription.StrokeDescription(path, 0, duration)
    }
}
