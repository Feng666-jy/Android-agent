<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { agentAPI, makeClientRunId } from "@/api/agent";
import type { AgentRunResult, ChatMessage, PendingApproval } from "@/api/agent";
import { showToast } from "vant";

const emit = defineEmits<{
  done: [payload: { runId: string; task: string; modelId: string; status: string }];
}>();

type RunPhase = "idle" | "running" | "done" | "error";

const phase = ref<RunPhase>("idle");
const task = ref("");
const result = ref<AgentRunResult | null>(null);
const errorMessage = ref("");
const approvals = ref<PendingApproval[]>([]);
const showApprovalModal = ref(false);
const runningApprovalIds = ref<Set<string>>(new Set());

let lastModelId = "";
let abortCtrl: AbortController | null = null;
let pollTimer: ReturnType<typeof setInterval> | null = null;
let polling = false;

const pendingApprovals = computed(() => approvals.value.filter((a) => a.status === "pending"));

function clearPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
  polling = false;
}

function stop() {
  clearPolling();
  abortCtrl?.abort();
  showApprovalModal.value = false;
}

async function pollApprovals(runId: string) {
  if (polling) return;
  polling = true;
  try {
    const res = await agentAPI.pendingApprovals(runId);
    if (res.code === 0) {
      approvals.value = res.data || [];
      const hasPending = approvals.value.some((a) => a.status === "pending");
      if (hasPending && phase.value === "running") {
        showApprovalModal.value = true;
      }
    }
  } catch {
    /* 轮询失败忽略，下一轮重试 */
  } finally {
    polling = false;
  }
}

async function start(newTask: string, modelId: string) {
  if (!modelId) {
    showToast("请先在设置中选择模型");
    return;
  }
  stop();
  lastModelId = modelId;
  task.value = newTask;
  phase.value = "running";
  result.value = null;
  errorMessage.value = "";
  approvals.value = [];
  showApprovalModal.value = false;

  const runId = makeClientRunId();
  abortCtrl = new AbortController();

  pollApprovals(runId);
  pollTimer = setInterval(() => pollApprovals(runId), 1500);

  try {
    const res = await agentAPI.run(
      {
        modelId,
        task: newTask,
        clientRunId: runId,
        permission: { default: "allow", tools: { write_file: "ask", edit_file: "ask", run_command: "ask" } },
      },
      abortCtrl.signal
    );
    clearPolling();
    showApprovalModal.value = false;
    if (res.code === 0) {
      const { runId: _runId, ...rest } = res.data as any;
      result.value = rest as AgentRunResult;
      phase.value = "done";
      errorMessage.value = rest.state?.error || rest.error || "";
      emit("done", { runId: _runId, task: newTask, modelId, status: rest.status });
    }
  } catch (err: any) {
    clearPolling();
    showApprovalModal.value = false;
    if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") {
      phase.value = "done";
      result.value = { status: "cancelled", result: "已取消", error: null, iterations: 0, toolCalls: 0, tokens: { inputTokens: 0, outputTokens: 0, totalTokens: 0 }, usageByIteration: [], state: { status: "cancelled", messages: [], toolHistory: [] } };
      emit("done", { runId, task: newTask, modelId, status: "cancelled" });
      return;
    }
    phase.value = "error";
    errorMessage.value = err?.message || "任务执行失败";
  }
}

function safeParse(s: string | null | undefined): Record<string, unknown> {
  if (!s) return {};
  try { return JSON.parse(s); } catch { return {}; }
}

/** 从历史记录恢复（只读查看该 run 的消息/工具/状态） */
async function loadRun(runId: string): Promise<boolean> {
  stop();
  try {
    const res = await agentAPI.detail(runId);
    if (res.code !== 0) {
      showToast("恢复会话失败");
      return false;
    }
    const d = res.data;
    const toolHistory = (d.toolCalls || []).map((tc) => ({
      id: tc.toolCallId || tc.id,
      name: tc.name,
      arguments: safeParse(tc.argumentsJson),
      ok: tc.ok,
      output: tc.output ?? "",
      durationMs: tc.durationMs,
    }));
    const messages: ChatMessage[] = (d.messages || []).map((m) => ({
      role: m.role as ChatMessage["role"],
      content: m.content,
      toolCallId: m.toolCallId,
      toolCalls: m.toolCallsJson ? (safeParse(m.toolCallsJson) as any) : undefined,
    }));
    lastModelId = d.modelId;
    task.value = d.task;
    result.value = {
      status: d.status,
      result: d.result,
      error: d.error,
      iterations: d.iterations,
      toolCalls: d.toolCallCount,
      tokens: { inputTokens: d.tokenInput, outputTokens: d.tokenOutput, totalTokens: d.tokenTotal },
      usageByIteration: (d.tokenEvents || []).map((e) => ({
        inputTokens: e.inputTokens,
        outputTokens: e.outputTokens,
        cachedTokens: e.cachedTokens,
        totalTokens: e.totalTokens,
      })),
      state: { status: d.status, error: d.error, messages, toolHistory },
    };
    phase.value = "done";
    errorMessage.value = d.error || "";
    return true;
  } catch {
    showToast("恢复会话失败");
    return false;
  }
}

/** 清空工作区，回到待命态 */
function clear() {
  stop();
  phase.value = "idle";
  task.value = "";
  result.value = null;
  errorMessage.value = "";
  approvals.value = [];
}

async function decideApproval(a: PendingApproval, decision: "approve" | "reject") {
  if (runningApprovalIds.value.has(a.id)) return;
  runningApprovalIds.value.add(a.id);
  try {
    const res = decision === "approve" ? await agentAPI.approve(a.id) : await agentAPI.reject(a.id);
    if (res.code === 0) {
      a.status = decision === "approve" ? "approved" : "rejected";
      showToast(decision === "approve" ? "已批准" : "已拒绝");
      if (abortCtrl && phase.value === "running") {
        const runId = a.runId;
        pollApprovals(runId);
      }
    }
  } catch {
    showToast("操作失败");
  } finally {
    runningApprovalIds.value.delete(a.id);
  }
}

function closeApprovalModal() {
  if (pendingApprovals.value.length === 0) showApprovalModal.value = false;
}

function formatArgs(args: Record<string, unknown>): string {
  try {
    return JSON.stringify(args, null, 2);
  } catch {
    return String(args);
  }
}

function rerun() {
  if (!lastModelId) {
    showToast("请先在设置中选择模型");
    return;
  }
  start(task.value, lastModelId);
}

function statusColor(s: string): string {
  switch (s) {
    case "completed": return "#07c160";
    case "failed": return "#ee0a24";
    case "budget_exceeded": return "#ff976a";
    case "cancelled": return "#969799";
    default: return "#1989fa";
  }
}

function statusText(s: string): string {
  switch (s) {
    case "completed": return "已完成";
    case "failed": return "失败";
    case "budget_exceeded": return "超出预算";
    case "cancelled": return "已取消";
    default: return "运行中";
  }
}

function prettyTime(): string {
  return new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
}

onBeforeUnmount(stop);

defineExpose({ start, loadRun, clear });
</script>

<template>
  <div class="run-panel">
    <!-- 空状态 -->
    <div v-if="phase === 'idle'" class="run-panel__empty">
      <div class="run-panel__empty-icon">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a10 10 0 109.95 9h-2.02a8 8 0 11-7.93-7V2z" />
          <path d="M12 2v8l5 3" />
        </svg>
      </div>
      <p class="run-panel__empty-title">Agent 待命</p>
      <p class="run-panel__empty-sub">输入任务让 Agent 在沙盒中自动执行，涉及敏感操作时需你的批准</p>
    </div>

    <!-- 运行中 -->
    <div v-else-if="phase === 'running'" class="run-panel__running">
      <div class="run-panel__spinner" />
      <div class="run-panel__running-body">
        <p class="run-panel__task">{{ task }}</p>
        <p class="run-panel__hint">
          运行中，等待模型响应
          <span v-if="pendingApprovals.length" class="run-panel__hint--ask">（{{ pendingApprovals.length }} 个操作待批准）</span>
        </p>
      </div>
      <button class="run-panel__stop" @click="stop">停止</button>
    </div>

    <!-- 结果 -->
    <div v-else-if="phase === 'done' && result" class="run-panel__result">
      <div class="run-panel__result-head">
        <span class="run-panel__badge" :style="{ background: statusColor(result.status) }">
          {{ statusText(result.status) }}
        </span>
        <span class="run-panel__time">{{ prettyTime() }}</span>
      </div>
      <div class="run-panel__stats">
        <div class="run-panel__stat">
          <span class="run-panel__stat-num">{{ result.iterations }}</span>
          <span class="run-panel__stat-label">轮次</span>
        </div>
        <div class="run-panel__stat">
          <span class="run-panel__stat-num">{{ result.toolCalls }}</span>
          <span class="run-panel__stat-label">工具调用</span>
        </div>
        <div class="run-panel__stat">
          <span class="run-panel__stat-num">{{ result.tokens.totalTokens }}</span>
          <span class="run-panel__stat-label">Tokens</span>
        </div>
      </div>
      <div v-if="errorMessage" class="run-panel__error">
        <p class="run-panel__error-title">执行出错</p>
        <p class="run-panel__error-msg">{{ errorMessage }}</p>
      </div>
      <div v-if="result.result" class="run-panel__output">{{ result.result }}</div>
      <div v-if="result.state.toolHistory.length" class="run-panel__tools">
        <p class="run-panel__tools-title">工具执行记录</p>
        <div v-for="t in result.state.toolHistory" :key="t.id" class="run-panel__tool">
          <div class="run-panel__tool-row">
            <code class="run-panel__tool-name">{{ t.name }}</code>
            <span class="run-panel__tool-ok" :class="t.ok ? 'run-panel__tool-ok--pass' : 'run-panel__tool-ok--fail'">
              {{ t.ok ? "成功" : "失败" }}
            </span>
            <span class="run-panel__tool-ms">{{ t.durationMs }}ms</span>
          </div>
          <div class="run-panel__tool-detail">
            <code>{{ formatArgs(t.arguments) }}</code>
          </div>
        </div>
      </div>
      <button class="run-panel__again" @click="rerun">再次运行</button>
    </div>

    <!-- 错误 -->
    <div v-else-if="phase === 'error'" class="run-panel__error">
      <p class="run-panel__error-title">任务失败</p>
      <p class="run-panel__error-msg">{{ errorMessage }}</p>
    </div>

    <!-- 审批弹窗 -->
    <div v-if="showApprovalModal" class="approval-overlay" @click.self="closeApprovalModal">
      <div class="approval-modal">
        <div class="approval-modal__head">
          <p class="approval-modal__title">操作需要批准</p>
          <p class="approval-modal__sub">Agent 请求执行以下操作</p>
        </div>
        <div class="approval-modal__list">
          <div v-for="a in pendingApprovals" :key="a.id" class="approval-item">
            <div class="approval-item__head">
              <code class="approval-item__name">{{ a.toolName }}</code>
              <span class="approval-item__badge">待批准</span>
            </div>
            <pre class="approval-item__args">{{ formatArgs(a.arguments) }}</pre>
            <div class="approval-item__actions">
              <button class="approval-item__btn approval-item__btn--reject" :disabled="runningApprovalIds.has(a.id)" @click="decideApproval(a, 'reject')">拒绝</button>
              <button class="approval-item__btn approval-item__btn--approve" :disabled="runningApprovalIds.has(a.id)" @click="decideApproval(a, 'approve')">批准</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/ai-tokens" as *;

.run-panel {
  min-height: 100%;
  padding: $ai-space-2 $ai-space-1;

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px $ai-space-2;
    text-align: center;

    &-icon {
      width: 72px;
      height: 72px;
      border-radius: $ai-radius-large;
      background: $ai-input-bg;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $ai-text-secondary;
      margin-bottom: $ai-space-3;
    }

    &-title {
      margin: 0 0 8px;
      font-family: $ai-font-family;
      font-size: $ai-font-size-title;
      font-weight: $ai-font-weight-title;
      color: $ai-text-primary;
    }

    &-sub {
      margin: 0;
      font-family: $ai-font-family;
      font-size: $ai-font-size-aux;
      color: $ai-text-placeholder;
      max-width: 260px;
      line-height: 1.6;
    }
  }

  &__running {
    display: flex;
    align-items: center;
    gap: $ai-space-2;
    padding: $ai-space-3 $ai-space-2;
    background: $ai-card-bg;
    border-radius: $ai-radius-medium;
    box-shadow: $ai-shadow-card;

    &-body {
      flex: 1;
      min-width: 0;
    }
  }

  &__spinner {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    border: 2.5px solid rgba(0, 0, 0, 0.08);
    border-top-color: $ai-text-primary;
    border-radius: 50%;
    animation: run-spin 0.8s linear infinite;
  }

  &__task {
    margin: 0 0 4px;
    font-family: $ai-font-family;
    font-size: $ai-font-size-body;
    font-weight: $ai-font-weight-body;
    color: $ai-text-primary;
    word-break: break-word;
  }

  &__hint {
    margin: 0;
    font-family: $ai-font-family;
    font-size: $ai-font-size-aux;
    color: $ai-text-secondary;

    &--ask {
      color: #ff976a;
    }
  }

  &__stop {
    flex-shrink: 0;
    padding: 6px 14px;
    border-radius: $ai-radius-full;
    border: 1px solid rgba(238, 10, 36, 0.25);
    background: transparent;
    color: #ee0a24;
    font-size: 13px;
    cursor: pointer;
  }

  &__result {
    display: flex;
    flex-direction: column;
    gap: $ai-space-2;

    &-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  &__badge {
    padding: 3px 10px;
    border-radius: $ai-radius-full;
    color: #fff;
    font-size: 12px;
    font-weight: 500;
  }

  &__time {
    font-size: 12px;
    color: $ai-text-placeholder;
  }

  &__stats {
    display: flex;
    gap: 8px;
  }

  &__stat {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: $ai-space-2;
    background: $ai-card-bg;
    border-radius: $ai-radius-small;
    box-shadow: $ai-shadow-card;

    &-num {
      font-family: $ai-font-family;
      font-size: 20px;
      font-weight: 600;
      color: $ai-text-primary;
    }

    &-label {
      font-size: 11px;
      color: $ai-text-secondary;
    }
  }

  &__output {
    padding: $ai-space-2;
    background: $ai-input-bg;
    border-radius: $ai-radius-small;
    font-family: $ai-font-family;
    font-size: $ai-font-size-body;
    line-height: 1.7;
    color: $ai-text-primary;
    white-space: pre-wrap;
    word-break: break-word;
  }

  &__tools {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &-title {
      margin: 0;
      font-size: 13px;
      font-weight: 500;
      color: $ai-text-secondary;
    }
  }

  &__tool {
    background: $ai-card-bg;
    border-radius: $ai-radius-small;
    padding: $ai-space-1 $ai-space-2;
    box-shadow: $ai-shadow-card;

    &-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    &-name {
      font-family: $ai-font-family-mono, monospace;
      font-size: 13px;
      color: $ai-text-primary;
    }

    &-ok {
      margin-left: auto;
      font-size: 11px;
      font-weight: 500;

      &--pass { color: #07c160; }
      &--fail { color: #ee0a24; }
    }

    &-ms {
      font-size: 11px;
      color: $ai-text-placeholder;
    }

    &-detail {
      margin-top: 6px;
      padding-top: 6px;
      border-top: 1px solid rgba(0, 0, 0, 0.04);
      overflow-x: auto;

      code {
        font-family: $ai-font-family-mono, monospace;
        font-size: 12px;
        color: $ai-text-secondary;
        white-space: pre-wrap;
        word-break: break-all;
      }
    }
  }

  &__again {
    align-self: flex-start;
    padding: 8px 20px;
    border-radius: $ai-radius-full;
    border: none;
    background: $ai-text-primary;
    color: $ai-card-bg;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
  }

  &__error {
    padding: $ai-space-3 $ai-space-2;
    background: rgba(238, 10, 36, 0.04);
    border-radius: $ai-radius-medium;

    &-title {
      margin: 0 0 6px;
      font-size: $ai-font-size-body;
      font-weight: 600;
      color: #ee0a24;
    }

    &-msg {
      margin: 0;
      font-size: 13px;
      color: $ai-text-secondary;
      word-break: break-word;
    }
  }
}

.approval-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.approval-modal {
  width: 100%;
  max-height: 72vh;
  overflow-y: auto;
  background: #fff;
  border-radius: $ai-bottom-card-radius $ai-bottom-card-radius 0 0;
  padding: $ai-space-3 $ai-space-2 calc(#{$ai-space-2} + 12px);

  &__head {
    margin-bottom: $ai-space-2;
  }

  &__title {
    margin: 0 0 4px;
    font-family: $ai-font-family;
    font-size: 17px;
    font-weight: 600;
    color: $ai-text-primary;
  }

  &__sub {
    margin: 0;
    font-size: 13px;
    color: $ai-text-secondary;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: $ai-space-1;
  }
}

.approval-item {
  background: $ai-input-bg;
  border-radius: $ai-radius-small;
  padding: $ai-space-1 $ai-space-2;

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  &__name {
    font-family: $ai-font-family-mono, monospace;
    font-size: 14px;
    color: $ai-text-primary;
  }

  &__badge {
    padding: 2px 8px;
    border-radius: $ai-radius-full;
    background: rgba(255, 151, 106, 0.15);
    color: #ff976a;
    font-size: 11px;
    font-weight: 500;
    flex-shrink: 0;
  }

  &__args {
    margin: 8px 0 0;
    padding: 8px;
    background: #fff;
    border-radius: 8px;
    font-family: $ai-font-family-mono, monospace;
    font-size: 12px;
    color: $ai-text-secondary;
    white-space: pre-wrap;
    word-break: break-all;
    max-height: 140px;
    overflow-y: auto;
  }

  &__actions {
    display: flex;
    gap: 8px;
    margin-top: $ai-space-1;
  }

  &__btn {
    flex: 1;
    padding: 10px 0;
    border-radius: $ai-radius-full;
    border: none;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
    }

    &--reject {
      background: $ai-input-bg;
      color: $ai-text-primary;
    }

    &--approve {
      background: $ai-text-primary;
      color: #fff;
    }
  }
}

@keyframes run-spin {
  to { transform: rotate(360deg); }
}
</style>
