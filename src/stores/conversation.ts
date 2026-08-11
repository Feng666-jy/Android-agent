import { defineStore } from "pinia";
import { ref } from "vue";
import { agentAPI } from "@/api/agent";
import type { AgentRunsPage } from "@/api/agent";

/**
 * 会话 Store（Conversation）
 *
 * 工作区会话生命周期 + 持久化：
 * - 当前会话（currentConversation）持久化到 localStorage，切换页面 / 重启应用可恢复
 * - 轻量索引 conversations 记录最近打开的任务，移除时同步
 * - 权威数据（消息/工具/token）来自后端 agent run 详情
 */

const CURRENT_KEY = "agent.current_conversation";
const INDEX_KEY = "agent.conversations";
const INDEX_MAX = 50;

export interface Conversation {
  /** Agent run id */
  id: string;
  /** 任务文本（作为会话标题） */
  title: string;
  modelId: string;
  status: "active" | "completed";
  createdAt: number;
  updatedAt: number;
}

export interface SearchResults extends AgentRunsPage {}

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* 存储不可用时静默降级为内存态 */
  }
}

function isConversation(v: unknown): v is Conversation {
  return !!v && typeof v === "object" && typeof (v as any).id === "string" && typeof (v as any).title === "string";
}

export const useConversationStore = defineStore("conversation", () => {
  const currentConversation = ref<Conversation | null>(readJson<Conversation>(CURRENT_KEY) && isConversation(readJson(CURRENT_KEY)) ? (readJson(CURRENT_KEY) as Conversation) : null);
  const conversations = ref<Conversation[]>([]);

  const storedIndex = readJson<Conversation[]>(INDEX_KEY);
  if (Array.isArray(storedIndex)) {
    conversations.value = storedIndex.filter(isConversation);
  }

  function persist(): void {
    writeJson(CURRENT_KEY, currentConversation.value);
    writeJson(INDEX_KEY, conversations.value);
  }

  /** 服务端已完成的历史任务 → 恢复为当前会话（只读查看模式） */
  function restore(runId: string, title: string, modelId: string, status: "active" | "completed" = "completed"): Conversation {
    const now = Date.now();
    const conv: Conversation = { id: runId, title, modelId, status, createdAt: now, updatedAt: now };
    currentConversation.value = conv;
    upsertIndex(conv);
    persist();
    return conv;
  }

  /** Agent run 完成后记录为当前会话 */
  function createConversation(runId: string, title: string, modelId: string): Conversation {
    const now = Date.now();
    const conv: Conversation = { id: runId, title, modelId, status: "active", createdAt: now, updatedAt: now };
    currentConversation.value = conv;
    upsertIndex(conv);
    persist();
    return conv;
  }

  /** 会话完成（run 结束） */
  function markCompleted(): void {
    const c = currentConversation.value;
    if (c) {
      c.status = "completed";
      c.updatedAt = Date.now();
      persist();
    }
  }

  /** 新建对话：清空当前会话，回到空工作区 */
  function newConversation(): void {
    currentConversation.value = null;
    persist();
  }

  /** 删除会话（同时从索引移除） */
  function deleteConversation(runId: string): void {
    conversations.value = conversations.value.filter((c) => c.id !== runId);
    if (currentConversation.value?.id === runId) {
      currentConversation.value = null;
    }
    persist();
  }

  /** 触达索引（列表浏览时同步标题/模型/时间） */
  function touchConversation(runId: string, title: string, modelId: string): void {
    const now = Date.now();
    const found = conversations.value.find((c) => c.id === runId);
    if (found) {
      found.title = title;
      found.modelId = modelId;
      found.updatedAt = now;
    } else {
      upsertIndex({ id: runId, title, modelId, status: "completed", createdAt: now, updatedAt: now });
    }
    persist();
  }

  /** 本地索引搜索（标题 / 模型） */
  function searchLocal(q: string): Conversation[] {
    const kw = q.trim().toLowerCase();
    if (!kw) return conversations.value;
    return conversations.value.filter(
      (c) => c.title.toLowerCase().includes(kw) || c.modelId.toLowerCase().includes(kw)
    );
  }

  /** 远程搜索（标题 + 消息内容，权威） */
  async function searchConversation(q: string, page = 1, pageSize = 20): Promise<SearchResults> {
    const res = await agentAPI.history(page, pageSize, q);
    return res.code === 0 ? res.data : { list: [], total: 0, page: 1, pageSize };
  }

  function upsertIndex(conv: Conversation): void {
    const idx = conversations.value.findIndex((c) => c.id === conv.id);
    if (idx !== -1) {
      conversations.value[idx] = { ...conversations.value[idx], ...conv };
    } else {
      conversations.value = [conv, ...conversations.value].slice(0, INDEX_MAX);
    }
  }

  return {
    currentConversation,
    conversations,
    restore,
    createConversation,
    markCompleted,
    newConversation,
    deleteConversation,
    touchConversation,
    searchLocal,
    searchConversation,
    persist,
  };
});