import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.androidagent.app',
  appName: 'Android Agent',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  },
  plugins: {
    // 设备桥插件：WSS 长连接配置（运行时通过 JS 传入，这里仅占位）
    DeviceBridge: {}
  }
}

export default config
