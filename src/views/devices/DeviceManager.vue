<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { showToast } from 'vant'
import { DeviceBridge, isCapacitorNative } from '@/capacitor/device-bridge'
import { devicesAPI, type DeviceRecord } from '@/api/devices'

const isNative = ref(false)
const connecting = ref(false)
const connected = ref(false)
const myDeviceId = ref('')
const statusText = ref('未连接')

const serverUrl = ref('')
const token = ref('')
const loginForm = ref({ username: '', password: '' })
const gettingToken = ref(false)

const devices = ref<DeviceRecord[]>([])
const loadingDevices = ref(false)
const errorMsg = ref('')

onMounted(async () => {
  isNative.value = isCapacitorNative()
  if (!isNative.value) {
    statusText.value = '浏览器环境：原生桥不可用，仅可预览设备列表'
  }
  await loadDevices()
})

async function loadDevices() {
  loadingDevices.value = true
  errorMsg.value = ''
  try {
    const res = await devicesAPI.list()
    devices.value = [...(res.data?.online ?? []), ...(res.data?.offline ?? [])]
  } catch (e) {
    errorMsg.value = (e as Error).message || '设备列表加载失败'
  } finally {
    loadingDevices.value = false
  }
}

async function fetchToken() {
  if (!serverUrl.value.trim()) {
    showToast('请先填写服务器地址（ws://电脑IP:3000）')
    return
  }
  if (!loginForm.value.username || !loginForm.value.password) {
    showToast('请输入用户名和密码')
    return
  }
  gettingToken.value = true
  try {
    // 手机端 WebView 的 axios baseURL 指向手机自身（/api 相对路径），
    // 这里直连用户填写的 serverUrl（ws:// → http://）完成登录。
    let httpBase = serverUrl.value.trim().replace(/\/+$/, '')
    httpBase = httpBase.replace(/^ws:\/\//, 'http://').replace(/^wss:\/\//, 'https://')
    const res = await fetch(`${httpBase}/api/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: loginForm.value.username,
        password: loginForm.value.password
      })
    })
    const data = await res.json()
    if (!res.ok || data.code !== 0) throw new Error(data.message || `登录失败 (HTTP ${res.status})`)
    token.value = data.data.token
    showToast('Token 已获取')
  } catch (e) {
    showToast((e as Error).message || '登录失败')
  } finally {
    gettingToken.value = false
  }
}

function normalizeServerUrl(raw: string): string {
  const url = raw.trim().replace(/\/+$/, '')
  if (url.startsWith('http://')) return 'ws://' + url.slice('http://'.length)
  if (url.startsWith('https://')) return 'wss://' + url.slice('https://'.length)
  return url
}

async function connect() {
  if (!serverUrl.value.trim()) {
    showToast('请先填写服务器地址（ws://电脑IP:3000）')
    return
  }
  if (!isNative.value) {
    showToast('请在手机 App 内操作（浏览器无法调用原生桥）')
    return
  }
  if (!token.value.trim()) {
    showToast('请先获取或粘贴 Token')
    return
  }
  connecting.value = true
  errorMsg.value = ''
  try {
    const res = await DeviceBridge.connect({
      serverUrl: normalizeServerUrl(serverUrl.value),
      token: token.value.trim()
    })
    connected.value = true
    myDeviceId.value = res.deviceId
    statusText.value = '已连接'
    showToast('设备已连接')
    await loadDevices()
  } catch (e) {
    errorMsg.value = (e as Error).message || '连接失败'
    showToast('连接失败')
  } finally {
    connecting.value = false
  }
}

async function disconnect() {
  if (!isNative.value) return
  try {
    await DeviceBridge.disconnect()
    connected.value = false
    statusText.value = '已断开'
    showToast('已断开')
  } catch (e) {
    errorMsg.value = (e as Error).message || '断开失败'
  }
}

const capLabels: Record<string, string> = {
  native: 'Native 工具',
  a11y: '无障碍',
  vision: '截图'
}

function capState(d: DeviceRecord, key: string): string {
  return d.capabilities?.[key] ? '已启用' : '未启用'
}
</script>

<template>
  <div class="device-manager">
    <header class="device-manager__header">
      <h1 class="device-manager__title">设备连接</h1>
      <button class="device-manager__btn-icon" aria-label="刷新设备列表" @click="loadDevices">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
      </button>
    </header>

    <div v-if="errorMsg" class="device-manager__error">{{ errorMsg }}</div>

    <div class="device-manager__env" :class="isNative ? 'is-native' : 'is-web'">
      {{ isNative ? '📱 Capacitor 原生环境（可连接）' : '🌐 浏览器环境（仅预览，原生桥不可用）' }}
    </div>

    <!-- ==================== 连接表单 ==================== -->
    <div class="device-manager__card">
      <div class="device-manager__card-title">连接服务器</div>
      <input
        v-model="serverUrl"
        class="device-manager__input"
        placeholder="ws://192.168.1.100:3000（改为你电脑的局域网 IP）"
      />
      <div class="device-manager__form-row">
        <input
          v-model="token"
          class="device-manager__input"
          placeholder="JWT Token（登录后获取）"
          type="password"
        />
      </div>
      <div class="device-manager__card-actions">
        <button class="device-manager__btn-primary" :disabled="connecting" @click="connect">
          {{ connecting ? '连接中...' : connected ? '重新连接' : '连接设备' }}
        </button>
        <button v-if="connected" class="device-manager__btn-danger" @click="disconnect">
          断开
        </button>
      </div>
      <div v-if="connected" class="device-manager__status is-ok">
        {{ statusText }} · Device ID: {{ myDeviceId }}
      </div>
    </div>

    <!-- ==================== 获取 Token ==================== -->
    <div class="device-manager__card">
      <div class="device-manager__card-title">获取 Token（电脑同账号登录）</div>
      <div class="device-manager__form-row">
        <input
          v-model="loginForm.username"
          class="device-manager__input"
          placeholder="用户名"
          maxlength="30"
        />
        <input
          v-model="loginForm.password"
          class="device-manager__input"
          placeholder="密码"
          type="password"
          maxlength="50"
        />
      </div>
      <button class="device-manager__btn-ghost" :disabled="gettingToken" @click="fetchToken">
        {{ gettingToken ? '获取中...' : '获取 Token 并填入' }}
      </button>
    </div>

    <!-- ==================== 设备列表 ==================== -->
    <div class="device-manager__card">
      <div class="device-manager__card-title">设备列表（后端视角）</div>
      <div v-if="loadingDevices" class="device-manager__loading">加载中...</div>
      <ul v-else class="device-manager__list">
        <li v-for="d in devices" :key="d.id" class="device-manager__item">
          <div class="device-manager__item-main">
            <div class="device-manager__item-title">
              {{ d.model || '未知设备' }}
              <span
                class="device-manager__badge"
                :class="d.status === 'online' ? 'is-online' : 'is-offline'"
              >
                {{ d.status === 'online' ? '在线' : '离线' }}
              </span>
            </div>
            <div class="device-manager__item-desc">
              {{ d.deviceId }} · {{ d.platform }} · v{{ d.appVersion }}
            </div>
            <div class="device-manager__item-caps">
              <span
                v-for="(label, key) in capLabels"
                :key="key"
                class="device-manager__cap"
                :class="{ 'is-on': d.capabilities?.[key] }"
              >
                {{ label }}:{{ capState(d, key) }}
              </span>
            </div>
          </div>
        </li>
      </ul>
      <div v-if="!devices.length && !loadingDevices" class="device-manager__empty">
        暂无设备。手机 App 连接后这里会出现在线设备。
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/ai-tokens' as *;

.device-manager {
  width: 100%;
  min-height: 100%;
  padding: 16px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  &__title {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    color: $ai-text-primary;
  }

  &__btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: $ai-radius-small;
    background: $ai-card-bg;
    color: $ai-text-secondary;
    cursor: pointer;
    box-shadow: $ai-shadow-card;

    &:active {
      transform: scale(0.95);
    }
  }

  &__error {
    margin-bottom: 12px;
    padding: 10px 12px;
    border-radius: $ai-radius-small;
    background: rgba(229, 57, 53, 0.1);
    color: #e53935;
    font-size: 13px;
  }

  &__env {
    margin-bottom: 12px;
    padding: 10px 14px;
    border-radius: $ai-radius-small;
    font-size: 13px;
    font-weight: 600;

    &.is-native {
      background: rgba(52, 168, 83, 0.1);
      color: #34a853;
    }

    &.is-web {
      background: rgba(0, 0, 0, 0.05);
      color: $ai-text-secondary;
    }
  }

  &__card {
    margin-bottom: 12px;
    padding: 14px 16px;
    border-radius: $ai-radius-medium;
    background: $ai-card-bg;
    box-shadow: $ai-shadow-card;

    &-title {
      margin-bottom: 10px;
      font-size: 15px;
      font-weight: 600;
      color: $ai-text-primary;
    }

    &-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 10px;
    }
  }

  &__form-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__input {
    width: 100%;
    padding: 9px 12px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: $ai-radius-small;
    background: $ai-card-bg;
    color: $ai-text-primary;
    font-size: 14px;
    box-sizing: border-box;
    margin-bottom: 8px;
  }

  &__btn-primary {
    padding: 8px 16px;
    border: none;
    border-radius: $ai-radius-small;
    background: #4f46e5;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__btn-ghost {
    padding: 8px 14px;
    border: none;
    border-radius: $ai-radius-small;
    background: rgba(0, 0, 0, 0.05);
    color: $ai-text-primary;
    font-size: 14px;
    cursor: pointer;
  }

  &__btn-danger {
    padding: 8px 16px;
    border: 1px solid rgba(229, 57, 53, 0.4);
    border-radius: $ai-radius-small;
    background: transparent;
    color: #e53935;
    font-size: 14px;
    cursor: pointer;
  }

  &__status {
    margin-top: 10px;
    font-size: 13px;
    color: $ai-text-secondary;

    &.is-ok {
      color: #34a853;
      font-weight: 600;
    }
  }

  &__loading {
    padding: 16px 0;
    text-align: center;
    color: $ai-text-secondary;
  }

  &__empty {
    padding: 16px 0;
    text-align: center;
    color: $ai-text-secondary;
    font-size: 13px;
  }

  &__list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__item {
    padding: 12px 0;

    & + & {
      border-top: 1px solid rgba(0, 0, 0, 0.04);
    }

    &-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      font-weight: 600;
      color: $ai-text-primary;
    }

    &-desc {
      margin-top: 3px;
      font-size: 12px;
      color: $ai-text-secondary;
    }

    &-caps {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 6px;
    }
  }

  &__cap {
    padding: 2px 8px;
    border-radius: $ai-radius-full;
    font-size: 11px;
    background: rgba(0, 0, 0, 0.05);
    color: $ai-text-secondary;

    &.is-on {
      background: rgba(52, 168, 83, 0.12);
      color: #34a853;
    }
  }

  &__badge {
    padding: 2px 8px;
    border-radius: $ai-radius-full;
    font-size: 11px;
    font-weight: 600;

    &.is-online {
      background: rgba(52, 168, 83, 0.12);
      color: #34a853;
    }

    &.is-offline {
      background: rgba(0, 0, 0, 0.06);
      color: $ai-text-secondary;
    }
  }
}
</style>
