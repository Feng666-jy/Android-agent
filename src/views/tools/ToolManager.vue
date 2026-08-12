<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import {
  toolsAPI,
  type ToolOverview,
  type ToolItem,
  type ToolPermissionRule,
  type ToolPermissionValue,
  type McpServerItem,
  type SkillItem,
  type ArgumentRule
} from '@/api/tools'

type TabKey = 'tools' | 'permissions' | 'mcp' | 'skills'
const activeTab = ref<TabKey>('tools')
const overview = ref<ToolOverview | null>(null)
const loading = ref(false)
const errorMsg = ref('')

// ---- 新增表单 ----
const showToolForm = ref(false)
const newTool = ref({ name: '', description: '', parametersJson: '' })

const showPermForm = ref(false)
const newPerm = ref<{
  scope: 'global' | 'user' | 'agent'
  toolName: string
  permission: ToolPermissionValue
  rulePath: string
  ruleOperator: ArgumentRule['operator']
  ruleValue: string
  rulePermission: 'ask' | 'deny'
}>({
  scope: 'user',
  toolName: '',
  permission: 'ask',
  rulePath: '',
  ruleOperator: 'contains',
  ruleValue: '',
  rulePermission: 'ask'
})

const showMcpForm = ref(false)
const newMcp = ref({
  name: '',
  url: '',
  transport: 'sse' as 'sse' | 'streamable-http',
  headersJson: ''
})

const showSkillForm = ref(false)
const newSkill = ref({ name: '', description: '', content: '', version: '1.0.0' })

const testingServerId = ref<string | null>(null)
const testResult = ref<{ serverId: string; text: string; ok: boolean } | null>(null)

const sourceLabel: Record<string, string> = {
  builtin: '内置',
  custom: '自定义',
  mcp: 'MCP',
  skill: 'Skill'
}

const permissionLabel: Record<string, string> = {
  allow: '允许',
  ask: '需审批',
  deny: '禁止'
}

const scopeLabel: Record<string, string> = {
  global: '全局',
  user: '用户',
  agent: 'Agent'
}

async function load() {
  loading.value = true
  errorMsg.value = ''
  try {
    const res = await toolsAPI.overview()
    if (res.code === 0) {
      overview.value = res.data
    } else {
      errorMsg.value = res.message || '加载失败'
    }
  } catch (e) {
    errorMsg.value = (e as Error).message || '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)

// ---- 工具 ----
const toolNameOptions = computed(() => {
  const names = new Set<string>()
  overview.value?.tools.forEach(t => names.add(t.name))
  overview.value?.permissions.forEach(p => names.add(p.toolName))
  return Array.from(names)
})

async function createTool() {
  if (!newTool.value.name.trim()) return
  try {
    await toolsAPI.createTool({
      name: newTool.value.name.trim(),
      description: newTool.value.description.trim(),
      parametersJson: newTool.value.parametersJson.trim() || '{}'
    })
    newTool.value = { name: '', description: '', parametersJson: '' }
    showToolForm.value = false
    await load()
  } catch (e) {
    errorMsg.value = (e as Error).message || '创建失败'
  }
}

async function toggleTool(item: ToolItem) {
  try {
    await toolsAPI.toggleTool(item.id)
    item.enabled = !item.enabled
  } catch (e) {
    errorMsg.value = (e as Error).message || '操作失败'
  }
}

async function deleteTool(item: ToolItem) {
  if (!window.confirm(`删除工具 ${item.name}？`)) return
  try {
    await toolsAPI.deleteTool(item.id)
    await load()
  } catch (e) {
    errorMsg.value = (e as Error).message || '删除失败'
  }
}

// ---- 权限 ----
function buildArgumentRules(): ArgumentRule[] | undefined {
  if (!newPerm.value.rulePath.trim()) return undefined
  return [
    {
      path: newPerm.value.rulePath.trim(),
      operator: newPerm.value.ruleOperator,
      value: newPerm.value.ruleValue.trim() || undefined,
      permission: newPerm.value.rulePermission
    }
  ]
}

async function upsertPermission() {
  if (!newPerm.value.toolName.trim()) return
  try {
    await toolsAPI.upsertPermission({
      scope: newPerm.value.scope,
      toolName: newPerm.value.toolName.trim(),
      permission: newPerm.value.permission,
      argumentRules: buildArgumentRules()
    })
    newPerm.value = {
      scope: 'user',
      toolName: '',
      permission: 'ask',
      rulePath: '',
      ruleOperator: 'contains',
      ruleValue: '',
      rulePermission: 'ask'
    }
    showPermForm.value = false
    await load()
  } catch (e) {
    errorMsg.value = (e as Error).message || '保存失败'
  }
}

async function deletePermission(rule: ToolPermissionRule) {
  if (!window.confirm(`删除 ${rule.toolName} 的 ${scopeLabel[rule.scope]} 权限规则？`)) return
  try {
    await toolsAPI.deletePermission(rule.id)
    await load()
  } catch (e) {
    errorMsg.value = (e as Error).message || '删除失败'
  }
}

// ---- MCP ----
async function createMcpServer() {
  if (!newMcp.value.name.trim() || !newMcp.value.url.trim()) return
  try {
    await toolsAPI.createMcpServer({
      name: newMcp.value.name.trim(),
      url: newMcp.value.url.trim(),
      transport: newMcp.value.transport,
      headersJson: newMcp.value.headersJson.trim() || '{}'
    })
    newMcp.value = { name: '', url: '', transport: 'sse', headersJson: '' }
    showMcpForm.value = false
    await load()
  } catch (e) {
    errorMsg.value = (e as Error).message || '创建失败'
  }
}

async function deleteMcpServer(item: McpServerItem) {
  if (!window.confirm(`删除 MCP Server ${item.name}？`)) return
  try {
    await toolsAPI.deleteMcpServer(item.id)
    await load()
  } catch (e) {
    errorMsg.value = (e as Error).message || '删除失败'
  }
}

async function testMcpServer(item: McpServerItem) {
  testingServerId.value = item.id
  testResult.value = null
  try {
    const res = await toolsAPI.testMcpServer(item.id)
    const tools = res.data?.tools ?? []
    testResult.value = {
      serverId: item.id,
      ok: true,
      text: `连接成功，发现 ${tools.length} 个工具${tools.length ? '：' + tools.map(t => t.name).join(', ') : ''}`
    }
  } catch (e) {
    testResult.value = { serverId: item.id, ok: false, text: (e as Error).message || '连接失败' }
  } finally {
    testingServerId.value = null
  }
}

// ---- Skill ----
async function createSkill() {
  if (!newSkill.value.name.trim()) return
  try {
    await toolsAPI.createSkill({
      name: newSkill.value.name.trim(),
      description: newSkill.value.description.trim(),
      content: newSkill.value.content,
      version: newSkill.value.version.trim() || '1.0.0'
    })
    newSkill.value = { name: '', description: '', content: '', version: '1.0.0' }
    showSkillForm.value = false
    await load()
  } catch (e) {
    errorMsg.value = (e as Error).message || '创建失败'
  }
}

async function deleteSkill(item: SkillItem) {
  if (!window.confirm(`删除 Skill ${item.name}？`)) return
  try {
    await toolsAPI.deleteSkill(item.id)
    await load()
  } catch (e) {
    errorMsg.value = (e as Error).message || '删除失败'
  }
}

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'tools', label: '工具' },
  { key: 'permissions', label: '权限' },
  { key: 'mcp', label: 'MCP' },
  { key: 'skills', label: 'Skill' }
]
</script>

<template>
  <div class="tool-manager">
    <header class="tool-manager__header">
      <h1 class="tool-manager__title">工具管理</h1>
      <button class="tool-manager__btn-icon" aria-label="刷新" @click="load">
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

    <nav class="tool-manager__tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tool-manager__tab"
        :class="{ 'is-active': activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </nav>

    <div v-if="errorMsg" class="tool-manager__error">{{ errorMsg }}</div>
    <div v-if="loading" class="tool-manager__loading">加载中...</div>

    <!-- ==================== 工具 ==================== -->
    <section v-if="activeTab === 'tools' && overview" class="tool-manager__panel">
      <div class="tool-manager__row-actions">
        <button class="tool-manager__btn-primary" @click="showToolForm = !showToolForm">
          {{ showToolForm ? '收起' : '+ 新建工具' }}
        </button>
      </div>

      <div v-if="showToolForm" class="tool-manager__form">
        <input
          v-model="newTool.name"
          class="tool-manager__input"
          placeholder="工具名（英文，如 weather_now）"
          maxlength="64"
        />
        <input
          v-model="newTool.description"
          class="tool-manager__input"
          placeholder="工具描述"
          maxlength="500"
        />
        <textarea
          v-model="newTool.parametersJson"
          class="tool-manager__textarea"
          placeholder='参数 JSON Schema（可选，默认 {"type":"object","properties":{}}）'
          rows="3"
        />
        <button class="tool-manager__btn-primary" @click="createTool">创建</button>
      </div>

      <ul class="tool-manager__list">
        <li v-for="item in overview.tools" :key="item.id" class="tool-manager__item">
          <div class="tool-manager__item-main">
            <div class="tool-manager__item-title">
              {{ item.name }}
              <span class="tool-manager__badge" :class="`is-${item.source}`">{{
                sourceLabel[item.source]
              }}</span>
            </div>
            <div class="tool-manager__item-desc">{{ item.description || '无描述' }}</div>
          </div>
          <div class="tool-manager__item-actions">
            <button
              class="tool-manager__switch"
              :class="{ 'is-on': item.enabled }"
              :aria-label="item.enabled ? '禁用' : '启用'"
              @click="toggleTool(item)"
            >
              <span class="tool-manager__switch-knob" />
            </button>
            <button
              v-if="item.source === 'custom'"
              class="tool-manager__btn-danger"
              aria-label="删除"
              @click="deleteTool(item)"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path
                  d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                />
              </svg>
            </button>
          </div>
        </li>
      </ul>
    </section>

    <!-- ==================== 权限 ==================== -->
    <section v-if="activeTab === 'permissions' && overview" class="tool-manager__panel">
      <div class="tool-manager__row-actions">
        <button class="tool-manager__btn-primary" @click="showPermForm = !showPermForm">
          {{ showPermForm ? '收起' : '+ 新增规则' }}
        </button>
      </div>

      <div v-if="showPermForm" class="tool-manager__form">
        <select v-model="newPerm.toolName" class="tool-manager__select">
          <option value="" disabled>选择工具</option>
          <option v-for="name in toolNameOptions" :key="name" :value="name">{{ name }}</option>
        </select>
        <div class="tool-manager__form-row">
          <select v-model="newPerm.scope" class="tool-manager__select">
            <option value="user">用户级</option>
            <option value="global">全局</option>
          </select>
          <select v-model="newPerm.permission" class="tool-manager__select">
            <option value="allow">允许</option>
            <option value="ask">需审批</option>
            <option value="deny">禁止</option>
          </select>
        </div>
        <div class="tool-manager__form-row">
          <input
            v-model="newPerm.rulePath"
            class="tool-manager__input"
            placeholder="参数路径（如 path，可选）"
          />
          <select v-model="newPerm.ruleOperator" class="tool-manager__select">
            <option value="contains">包含</option>
            <option value="eq">等于</option>
            <option value="regex">正则</option>
          </select>
        </div>
        <div class="tool-manager__form-row">
          <input
            v-model="newPerm.ruleValue"
            class="tool-manager__input"
            placeholder="匹配值（如 /etc）"
          />
          <select v-model="newPerm.rulePermission" class="tool-manager__select">
            <option value="ask">命中→需审批</option>
            <option value="deny">命中→禁止</option>
          </select>
        </div>
        <button class="tool-manager__btn-primary" @click="upsertPermission">保存规则</button>
      </div>

      <ul class="tool-manager__list">
        <li v-for="rule in overview.permissions" :key="rule.id" class="tool-manager__item">
          <div class="tool-manager__item-main">
            <div class="tool-manager__item-title">
              {{ rule.toolName }}
              <span class="tool-manager__badge">{{ scopeLabel[rule.scope] }}</span>
              <span class="tool-manager__badge" :class="`is-${rule.permission}`">{{
                permissionLabel[rule.permission]
              }}</span>
            </div>
            <div v-if="rule.argumentRules?.length" class="tool-manager__item-desc">
              参数规则：{{
                rule.argumentRules
                  .map(
                    r =>
                      `${r.path} ${r.operator} ${r.value ?? ''} → ${permissionLabel[r.permission]}`
                  )
                  .join('；')
              }}
            </div>
          </div>
          <button
            class="tool-manager__btn-danger"
            aria-label="删除规则"
            @click="deletePermission(rule)"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path
                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
              />
            </svg>
          </button>
        </li>
      </ul>
    </section>

    <!-- ==================== MCP ==================== -->
    <section v-if="activeTab === 'mcp' && overview" class="tool-manager__panel">
      <div class="tool-manager__row-actions">
        <button class="tool-manager__btn-primary" @click="showMcpForm = !showMcpForm">
          {{ showMcpForm ? '收起' : '+ 添加 MCP Server' }}
        </button>
      </div>

      <div v-if="showMcpForm" class="tool-manager__form">
        <input
          v-model="newMcp.name"
          class="tool-manager__input"
          placeholder="名称（如 weather-mcp）"
          maxlength="64"
        />
        <input
          v-model="newMcp.url"
          class="tool-manager__input"
          placeholder="SSE 地址（如 http://localhost:8080/sse）"
        />
        <select v-model="newMcp.transport" class="tool-manager__select">
          <option value="sse">SSE</option>
          <option value="streamable-http">streamable-http</option>
        </select>
        <input
          v-model="newMcp.headersJson"
          class="tool-manager__input"
          placeholder='请求头 JSON（可选，如 {"Authorization":"Bearer xxx"}）'
        />
        <button class="tool-manager__btn-primary" @click="createMcpServer">创建</button>
      </div>

      <ul class="tool-manager__list">
        <li v-for="item in overview.mcpServers" :key="item.id" class="tool-manager__item">
          <div class="tool-manager__item-main">
            <div class="tool-manager__item-title">
              {{ item.name }}
              <span class="tool-manager__badge" :class="`is-${item.status}`">{{
                item.status
              }}</span>
            </div>
            <div class="tool-manager__item-desc">{{ item.url }}</div>
            <div
              v-if="testResult && testResult.serverId === item.id"
              class="tool-manager__item-desc"
              :class="{ 'is-error': !testResult.ok }"
            >
              {{ testResult.text }}
            </div>
          </div>
          <div class="tool-manager__item-actions">
            <button
              class="tool-manager__btn-ghost"
              :disabled="testingServerId === item.id"
              @click="testMcpServer(item)"
            >
              {{ testingServerId === item.id ? '测试中' : '测试' }}
            </button>
            <button
              class="tool-manager__btn-danger"
              aria-label="删除"
              @click="deleteMcpServer(item)"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path
                  d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                />
              </svg>
            </button>
          </div>
        </li>
      </ul>
    </section>

    <!-- ==================== Skill ==================== -->
    <section v-if="activeTab === 'skills' && overview" class="tool-manager__panel">
      <div class="tool-manager__row-actions">
        <button class="tool-manager__btn-primary" @click="showSkillForm = !showSkillForm">
          {{ showSkillForm ? '收起' : '+ 新建 Skill' }}
        </button>
      </div>

      <div v-if="showSkillForm" class="tool-manager__form">
        <input
          v-model="newSkill.name"
          class="tool-manager__input"
          placeholder="Skill 名称（如 json-fixer）"
          maxlength="64"
        />
        <input
          v-model="newSkill.description"
          class="tool-manager__input"
          placeholder="一句话描述（注入 system prompt）"
          maxlength="500"
        />
        <textarea
          v-model="newSkill.content"
          class="tool-manager__textarea"
          placeholder="Skill 完整内容（Agent 通过 read_skill 按需读取）"
          rows="4"
        />
        <input
          v-model="newSkill.version"
          class="tool-manager__input"
          placeholder="版本（默认 1.0.0）"
          maxlength="32"
        />
        <button class="tool-manager__btn-primary" @click="createSkill">创建</button>
      </div>

      <ul class="tool-manager__list">
        <li v-for="item in overview.skills" :key="item.id" class="tool-manager__item">
          <div class="tool-manager__item-main">
            <div class="tool-manager__item-title">
              {{ item.name }}
              <span class="tool-manager__badge">v{{ item.version }}</span>
            </div>
            <div class="tool-manager__item-desc">{{ item.description || '无描述' }}</div>
          </div>
          <button class="tool-manager__btn-danger" aria-label="删除" @click="deleteSkill(item)">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path
                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
              />
            </svg>
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>

<style lang="scss">
@use '@/styles/ai-tokens' as *;

.tool-manager {
  padding: 4px 0 24px;
  font-family: $ai-font-family;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  &__title {
    font-size: $ai-font-size-title;
    font-weight: $ai-font-weight-title;
    color: $ai-text-primary;
    margin: 0;
  }

  &__btn-icon {
    width: $ai-back-button-size;
    height: $ai-back-button-size;
    border-radius: $ai-radius-full;
    border: none;
    background: $ai-card-bg;
    box-shadow: $ai-shadow-button;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: $ai-text-primary;
  }

  &__tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 14px;
    background: $ai-card-bg;
    border-radius: $ai-radius-small;
    padding: 4px;
  }

  &__tab {
    flex: 1;
    padding: 8px 0;
    border: none;
    border-radius: $ai-radius-small;
    background: transparent;
    color: $ai-text-secondary;
    font-size: $ai-font-size-aux;
    cursor: pointer;
    transition: all 0.2s ease;

    &.is-active {
      background: #4f46e5;
      color: #fff;
      font-weight: 600;
    }
  }

  &__error {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    padding: 10px 14px;
    border-radius: $ai-radius-small;
    margin-bottom: 12px;
    font-size: $ai-font-size-aux;
  }

  &__loading {
    color: $ai-text-secondary;
    font-size: $ai-font-size-aux;
    text-align: center;
    padding: 24px 0;
  }

  &__row-actions {
    margin-bottom: 12px;
  }

  &__btn-primary {
    padding: 8px 16px;
    border: none;
    border-radius: $ai-radius-full;
    background: #4f46e5;
    color: #fff;
    font-size: $ai-font-size-aux;
    cursor: pointer;
  }

  &__btn-danger {
    width: 30px;
    height: 30px;
    border: none;
    border-radius: $ai-radius-full;
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
  }

  &__btn-ghost {
    padding: 6px 12px;
    border: 1px solid $ai-border;
    border-radius: $ai-radius-full;
    background: transparent;
    color: $ai-text-secondary;
    font-size: $ai-font-size-aux;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: $ai-card-bg;
    border-radius: $ai-radius-small;
    padding: 14px;
    margin-bottom: 14px;
    box-shadow: $ai-shadow-card;
  }

  &__form-row {
    display: flex;
    gap: 10px;

    .tool-manager__input {
      flex: 1;
    }
  }

  &__input,
  &__textarea,
  &__select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid $ai-border;
    border-radius: $ai-radius-small;
    background: $ai-bg;
    color: $ai-text-primary;
    font-size: $ai-font-size-aux;
    font-family: $ai-font-family;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #4f46e5;
    }
  }

  &__textarea {
    resize: vertical;
    min-height: 60px;
  }

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 10px;
    background: $ai-card-bg;
    border-radius: $ai-radius-small;
    padding: 12px 14px;
    box-shadow: $ai-shadow-card;
  }

  &__item-main {
    flex: 1;
    min-width: 0;
  }

  &__item-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: $ai-font-size-body;
    font-weight: 600;
    color: $ai-text-primary;
    margin-bottom: 4px;
    flex-wrap: wrap;
  }

  &__item-desc {
    font-size: $ai-font-size-aux;
    color: $ai-text-secondary;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &.is-error {
      color: #ef4444;
      white-space: normal;
    }
  }

  &__badge {
    font-size: $ai-font-size-aux;
    padding: 2px 8px;
    border-radius: $ai-radius-full;
    background: $ai-bg;
    color: $ai-text-secondary;
    white-space: nowrap;

    &.is-builtin {
      color: #4f46e5;
      background: rgba(79, 70, 229, 0.1);
    }
    &.is-custom {
      color: #0891b2;
      background: rgba(8, 145, 178, 0.1);
    }
    &.is-mcp {
      color: #7c3aed;
      background: rgba(124, 58, 237, 0.1);
    }
    &.is-skill {
      color: #059669;
      background: rgba(5, 150, 105, 0.1);
    }
    &.is-allow {
      color: #059669;
      background: rgba(5, 150, 105, 0.1);
    }
    &.is-ask {
      color: #d97706;
      background: rgba(217, 119, 6, 0.1);
    }
    &.is-deny {
      color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
    }
    &.is-connected {
      color: #059669;
      background: rgba(5, 150, 105, 0.1);
    }
    &.is-error {
      color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
    }
    &.is-connecting {
      color: #d97706;
      background: rgba(217, 119, 6, 0.1);
    }
  }

  &__item-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  &__switch {
    position: relative;
    width: 40px;
    height: 22px;
    border-radius: 11px;
    border: none;
    background: $ai-border;
    cursor: pointer;
    transition: background 0.2s ease;

    &.is-on {
      background: #4f46e5;
    }
  }

  &__switch-knob {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #fff;
    transition: transform 0.2s ease;

    .is-on & {
      transform: translateX(18px);
    }
  }
}
</style>
