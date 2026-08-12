package com.androidagent.app

import android.os.Bundle
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        registerPlugin(com.androidagent.app.plugins.DeviceBridgePlugin::class.java)
        registerPlugin(com.androidagent.app.plugins.NativeToolPlugin::class.java)
        registerPlugin(com.androidagent.app.plugins.AccessibilityPlugin::class.java)
        registerPlugin(com.androidagent.app.plugins.VisionPlugin::class.java)
        super.onCreate(savedInstanceState)
    }
}
