<script setup lang="ts">
/**
 * AgentRunPanel V2 — SSE 实时进度面板（T12）
 * 与 v1 AgentRunPanel 相同的对外接口：start(task, modelId) / loadRun(runId) / clear() / @done
 * 差异：异步创建运行（202）→ EventSource 订阅事件流 → 实时渲染计划/步骤/工具调用，
 *       支持暂停/恢复/取消与审批弹窗（审批落库 approvals 表）。
 */
import { computed, onBeforeUnmount, ref } from "vue";
import { showToast } from "vant";
import {
  agentV2API,
  subscribeRunEvents,
  type AgentEventV2,
  type AgentPlanV2,
  type ApprovalRecordV2,
  type RunStatusV2,
} from "@/api/agent-v2";

const emit = defineEmits<{
  done: [payload: { runId: string; task: string; modelId: string; status: string }];
}>();

type PanelPhase = "idle" | "running" | "done" | "error";

const phase = ref<PanelPhase>("idle");
const task = ref("");
const runId = ref("");
const status = ref<RunStatusV2>("queued");
const plan = ref<AgentPlanV2 | null>(null);
const steps = ref<Array<{ kind: string; title: string; ts: string; ok?: boolean }>>([]);
const result = ref("");
const errorMessage = ref("");
const approvals = ref<ApprovalRecordV2[]>([]);
const showApprovalModal = ref(false);

let lastModelId = "";
let unsubscribe: (() => void) | null = null;

const pendingApprovals = computed(() => approvals.value.filter((a) => a.status === "pending"));
const isRunning = computed(() => ["queued", "planning", "running"].includes(status.value));
const isPaused = computed(() => status.value === "paused");

function closeStream() {
  unsubscribe?.();
  unsubscribe = null;
}

function finalize(evt: AgentEventV2) {
  status.value = evt.type === "run.completed" ? "completed" : evt.type === "run.failed" ? "failed" : evt.type === "run.cancelled" ? "cancelled" : "budget_exceeded";
  result.value = String(evt.data?.result ?? evt.data?.error ?? "");
  errorMessage.value = String(evt.data?.error ?? "");
  phase.value = "done";
  closeStream();
  emit("done", { runId: runId.value, task: task.value, modelId: lastModelId, status: status.value });
}

function onEvent(evt: AgentEventV2) {
  const d = evt.data ?? {};
  switch (evt.type) {
    case "run.status":
      status.value = d.status as RunStatusV2;
      break;
    case "plan.generated": {
      plan.value = d.plan as AgentPlanV2;
      break;
    }
    case "step.started":
      steps.value.push({ kind: String(d.kind ?? "act"), title: String(d.title ?? `第 ${d.seq} 步`), ts: evt.ts, ok: undefined });
      break;
    case "step.completed":
    case "step.failed":
      steps.value.push({ kind: String(d.kind ?? "act"), title: String(d.title ?? d.summary ?? ""), ts: evt.ts, ok: evt.type === "step.completed" });
      break;
    case "tool.started":
      steps.value.push({ kind: "tool", title: `🔧 ${d.name}(${formatArgs(d.arguments)})`, ts: evt.ts });
      break;
    case "tool.completed":
      steps.value.push({ kind: "tool", title: `${d.ok ? "✅" : "❌"} ${d.name} (${d.durationMs}ms)`, ts: evt.ts, ok: Boolean(d.ok) });
      break;
    case "approval.requested":
      void refreshApprovals();
      break;
    case "run.completed":
    case "run.failed":
    case "run.cancelled":
    case "run.budget_exceeded":
      finalize(evt);
      break;
    case "error":
      errorMessage.value = String(d.message ?? "");
      break;
    default:
      break;
  }
}

async function refreshApprovals() {
  try {
    const res = await agentV2API.approvals(runId.value);
    if (res.code === 0) {
      approvals.value = res.data || [];
      if (approvals.value.some((a) => a.status === "pending")) {
        showApprovalModal.value = true;
      }
    }
  } catch {
    /* 忽略 */
  }
}

async function decideApproval(a: ApprovalRecordV2, decision: "approve" | "reject") {
  try {
    const res = decision === "approve" ? await agentV2API.approve(a.id) : await agentV2API.reject(a.id);
    if (res.code === 0) {
      a.status = decision === "approve" ? "approved" : "rejected";
      showToast(decision === "approve" ? "已批准" : "已拒绝");
      if (!approvals.value.some((x) => x.status === "pending")) {
        showApprovalModal.value = false;
      }
    }
  } catch {
    showToast("审批操作失败");
  }
}

async function start(newTask: string, modelId: string) {
  if (!modelId) {
    showToast("请先在设置中选择模型");
    return;
  }
  clear();
  lastModelId = modelId;
  task.value = newTask;
  phase.value = "running";
  status.value = "queued";

  try {
    const res = await agentV2API.createRun({
      modelId,
      task: newTask,
      permission: { default: "allow", tools: { write_file: "ask", edit_file: "ask", run_command: "ask" } },
    });
    if (res.code !== 0) {
      phase.value = "error";
      errorMessage.value = res.message || "创建运行失败";
      return;
    }
    runId.value = res.data.runId;
    status.value = res.data.status;
    unsubscribe = subscribeRunEvents(runId.value, { onEvent });
  } catch (err: any) {
    phase.value = "error";
    errorMessage.value = err?.message || "任务执行失败";
  }
}

function pause() {
  if (!runId.value) return;
  agentV2API.pause(runId.value).then((res) => {
    if (res.code === 0) status.value = "paused";
  });
}

function resume() {
  if (!runId.value) return;
  agentV2API.resume(runId.value).then((res) => {
    if (res.code === 0) status.value = "running";
  });
}

function cancel() {
  if (!runId.value) return;
  agentV2API.cancel(runId.value).then((res) => {
    if (res.code === 0) status.value = "cancelled";
    closeStream();
  });
}

/** 从历史恢复（只读） */
async function loadRun(id: string): Promise<boolean> {
  clear();
  try {
    const res = await agentV2API.getRun(id);
    if (res.code !== 0) {
      showToast("恢复会话失败");
      return false;
    }
    const d = res.data;
    runId.value = d.id;
    task.value = d.task;
    lastModelId = d.modelId;
    status.value = d.status;
    if (d.plan) plan.value = d.plan;
    if (d.steps) {
      steps.value = (d.steps || []).map((s: any) => ({
        kind: s.kind,
        title: s.input ? String(s.input).slice(0, 120) : s.kind,
        ts: s.createdAt,
        ok: s.status === "done",
      }));
    }
    result.value = d.result ?? "";
    errorMessage.value = d.error ?? "";
    phase.value = "done";
    return true;
  } catch {
    showToast("恢复会话失败");
    return false;
  }
}

function clear() {
  closeStream();
  phase.value = "idle";
  runId.value = "";
  task.value = "";
  status.value = "queued";
  plan.value = null;
  steps.value = [];
  result.value = "";
  errorMessage.value = "";
  approvals.value = [];
  showApprovalModal.value = false;
}

function formatArgs(args: unknown): string {
  try {
    return JSON.stringify(args);
  } catch {
    return String(args);
  }
}

function statusText(s: RunStatusV2): string {
  const map: Record<string, string> = {
    queued: "排队中",
    planning: "规划中",
    running: "执行中",
    paused: "已暂停",
    completed: "已完成",
    failed: "失败",
    cancelled: "已取消",
    budget_exceeded: "超出预算",
  };
  return map[s] ?? s;
}

function statusColor(s: RunStatusV2): string {
  const map: Record<string, string> = {
    queued: "#969799",
    planning: "#1989fa",
    running: "#1989fa",
    paused: "#ff976a",
    completed: "#07c160",
    failed: "#ee0a24",
    cancelled: "#969799",
    budget_exceeded: "#ff976a",
  };
  return map[s] ?? "#969799";
}

onBeforeUnmount(closeStream);

defineExpose({ start, loadRun, clear });
</script>

<template>
  <div class="run-panel-v2">
    <!-- 空状态 -->
    <div v-if="phase === 'idle'" class="rp2-empty">
      <div class="rp2-empty-icon">🤖</div>
      <p class="rp2-empty-title">Agent V2 待命</p>
      <p class="rp2-empty-sub">异步运行 + 实时事件流：规划 → 执行 → 观察 → 总结，可暂停/恢复/取消</p>
    </div>

    <!-- 运行中 -->
    <div v-else-if="phase === 'running'" class="rp2-running">
      <div class="rp2-head">
        <span class="rp2-badge" :style="{ background: statusColor(status) }">{{ statusText(status) }}</span>
        <span class="rp2-task">{{ task }}</span>
        <div class="rp2-controls">
          <button v-if="!isPaused && isRunning" class="rp2-btn" @click="pause">暂停</button>
          <button v-if="isPaused" class="rp2-btn" @click="resume">恢复</button>
          <button class="rp2-btn rp2-btn--danger" @click="cancel">取消</button>
        </div>
      </div>

      <!-- 计划 -->
      <div v-if="plan" class="rp2-section">
        <p class="rp2-section-title">📋 计划：{{ plan.goal }}</p>
        <ol class="rp2-plan">
          <li v-for="s in plan.steps" :key="s.seq" class="rp2-plan-item">
            {{ s.seq }}. {{ s.title }}
            <span v-if="s.toolHint" class="rp2-plan-hint">[{{ s.toolHint }}]</span>
          </li>
        </ol>
      </div>

      <!-- 步骤流 -->
      <div v-if="steps.length" class="rp2-section">
        <p class="rp2-section-title">⚡ 实时步骤</p>
        <ul class="rp2-steps">
          <li v-for="(s, i) in steps" :key="i" class="rp2-step" :class="{ 'rp2-step--ok': s.ok === true, 'rp2-step--fail': s.ok === false }">
            <span class="rp2-step-kind">{{ s.kind }}</span>
            <span class="rp2-step-title">{{ s.title }}</span>
          </li>
        </ul>
      </div>
      <p v-else class="rp2-hint">等待模型响应…</p>
    </div>

    <!-- 结果 -->
    <div v-else-if="phase === 'done'" class="rp2-done">
      <div class="rp2-head">
        <span class="rp2-badge" :style="{ background: statusColor(status) }">{{ statusText(status) }}</span>
        <span class="rp2-task">{{ task }}</span>
      </div>
      <div v-if="plan" class="rp2-section">
        <p class="rp2-section-title">📋 计划：{{ plan.goal }}</p>
      </div>
      <div v-if="steps.length" class="rp2-section">
        <p class="rp2-section-title">⚡ 执行步骤（{{ steps.length }}）</p>
        <ul class="rp2-steps">
          <li v-for="(s, i) in steps" :key="i" class="rp2-step" :class="{ 'rp2-step--ok': s.ok === true, 'rp2-step--fail': s.ok === false }">
            <span class="rp2-step-kind">{{ s.kind }}</span>
            <span class="rp2-step-title">{{ s.title }}</span>
          </li>
        </ul>
      </div>
      <div v-if="result" class="rp2-result">{{ result }}</div>
      <div v-if="errorMessage" class="rp2-error">{{ errorMessage }}</div>
    </div>

    <!-- 错误 -->
    <div v-else class="rp2-error-panel">
      <p class="rp2-error">{{ errorMessage || "未知错误" }}</p>
    </div>

    <!-- 审批弹窗 -->
    <div v-if="showApprovalModal" class="rp2-modal-mask" @click.self="showApprovalModal = false">
      <div class="rp2-modal">
        <p class="rp2-modal-title">🔐 等待批准</p>
        <div v-for="a in pendingApprovals" :key="a.id" class="rp2-modal-item">
          <p class="rp2-modal-tool">{{ a.toolName }}</p>
          <pre class="rp2-modal-args">{{ a.argumentsJson }}</pre>
          <div class="rp2-modal-actions">
            <button class="rp2-btn rp2-btn--danger" @click="decideApproval(a, 'reject')">拒绝</button>
            <button class="rp2-btn rp2-btn--primary" @click="decideApproval(a, 'approve')">批准</button>
          </div>
        </div>
        <p v-if="!pendingApprovals.length" class="rp2-hint">暂无待审批项</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/ai-tokens" as *;

.run-panel-v2 {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  min-height: 100%;
}

.rp2-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 0;
  color: #969799;
  text-align: center;
  gap: 8px;

  &-icon {
    font-size: 40px;
  }
  &-title {
    font-size: 16px;
    font-weight: 600;
    color: #323233;
  }
  &-sub {
    font-size: 12px;
    max-width: 260px;
    line-height: 1.6;
  }
}

.rp2-head {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.rp2-badge {
  color: #fff;
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 999px;
  white-space: nowrap;
}

.rp2-task {
  font-size: 14px;
  font-weight: 600;
  color: #323233;
  flex: 1;
  min-width: 120px;
  word-break: break-all;
}

.rp2-controls {
  display: flex;
  gap: 8px;
}

.rp2-btn {
  border: none;
  border-radius: 6px;
  padding: 5px 14px;
  font-size: 12px;
  color: #1989fa;
  background: rgba(25, 137, 250, 0.1);
  cursor: pointer;

  &--primary {
    color: #fff;
    background: #1989fa;
  }
  &--danger {
    color: #ee0a24;
    background: rgba(238, 10, 36, 0.08);
  }
}

.rp2-section {
  background: #fff;
  border: 1px solid #ebedf0;
  border-radius: 10px;
  padding: 12px;

  &-title {
    font-size: 13px;
    font-weight: 600;
    color: #323233;
    margin-bottom: 8px;
  }
}

.rp2-plan {
  margin: 0;
  padding-left: 18px;
  font-size: 12px;
  color: #646566;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &-item {
    line-height: 1.5;
  }
  &-hint {
    color: #1989fa;
    font-size: 11px;
  }
}

.rp2-steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 260px;
  overflow-y: auto;
}

.rp2-step {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #646566;
  align-items: baseline;

  &-kind {
    flex-shrink: 0;
    font-size: 10px;
    padding: 1px 6px;
    border-radius: 4px;
    background: #f2f3f5;
    color: #969799;
    text-transform: uppercase;
  }
  &-title {
    word-break: break-all;
    line-height: 1.5;
  }
  &--ok .rp2-step-kind {
    background: rgba(7, 193, 96, 0.12);
    color: #07c160;
  }
  &--fail .rp2-step-kind {
    background: rgba(238, 10, 36, 0.1);
    color: #ee0a24;
  }
}

.rp2-hint {
  font-size: 12px;
  color: #969799;
}

.rp2-result {
  background: #f7f8fa;
  border-radius: 10px;
  padding: 12px;
  font-size: 13px;
  line-height: 1.7;
  color: #323233;
  white-space: pre-wrap;
  word-break: break-all;
}

.rp2-error {
  color: #ee0a24;
  font-size: 13px;
  white-space: pre-wrap;
}

.rp2-error-panel {
  padding: 24px 0;
  text-align: center;
}

.rp2-modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 24px;
}

.rp2-modal {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  width: 100%;
  max-width: 420px;
  max-height: 70vh;
  overflow-y: auto;

  &-title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  &-item {
    border: 1px solid #ebedf0;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 10px;
  }
  &-tool {
    font-size: 13px;
    font-weight: 600;
    color: #323233;
  }
  &-args {
    font-size: 11px;
    background: #f7f8fa;
    border-radius: 6px;
    padding: 8px;
    overflow-x: auto;
    margin: 8px 0;
  }
  &-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
}
</style>

