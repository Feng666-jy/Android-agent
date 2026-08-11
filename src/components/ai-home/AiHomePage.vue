<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import TopBar from "@/components/ai-home/TopBar.vue";
import BottomCard from "@/components/ai-home/BottomCard.vue";
import AgentRunPanel from "@/components/ai-home/AgentRunPanel.vue";
import AgentRunPanelV2 from "@/components/ai-home/AgentRunPanelV2.vue";
import { useModelStore } from "@/stores/model";
import { useConversationStore } from "@/stores/conversation";
import type { AiModel } from "@/types";

const currentTab = ref<"work" | "code">("work");
const modelStore = useModelStore();
const conversationStore = useConversationStore();
const runPanel = ref<InstanceType<typeof AgentRunPanel> | null>(null);
const runPanelV2 = ref<InstanceType<typeof AgentRunPanelV2> | null>(null);
const useV2 = ref(false);

const models = computed(() => modelStore.models as AiModel[]);
const selectedModel = ref<AiModel | null>(modelStore.defaultModel);

onMounted(async () => {
  if (modelStore.models.length === 0) {
    await modelStore.fetchModels({ page: 1, pageSize: 50 });
  }
  if (!selectedModel.value) {
    selectedModel.value = modelStore.defaultModel;
  }
  // 恢复当前会话：切页 / 重启回来时仍显示上次的 Agent 会话
  const current = conversationStore.currentConversation;
  if (current && runPanel.value) {
    await runPanel.value.loadRun(current.id);
    const m = models.value.find((x) => String(x.id) === current.modelId);
    if (m) selectedModel.value = m;
  }
});

function bindModel(m: AiModel) {
  selectedModel.value = m;
}

function handleSend(value: string) {
  if (!selectedModel.value) {
    import("vant").then(({ showToast }) => showToast("请先在设置中配置并选择模型"));
    return;
  }
  const active = useV2.value ? runPanelV2.value : runPanel.value;
  active?.start(value, String(selectedModel.value.id));
}

function handleRunDone(payload: { runId: string; task: string; modelId: string }) {
  conversationStore.createConversation(payload.runId, payload.task, payload.modelId);
}
</script>

<template>
  <div class="page">
    <TopBar
      :current-tab="currentTab"
      @update:current-tab="currentTab = $event"
    />
    <main class="content">
      <AgentRunPanel ref="runPanel" @done="handleRunDone" />
    </main>
    <BottomCard :mode="currentTab" @send="handleSend" @select-model="bindModel" />
  </div>
</template>

<style lang="scss">
@use "@/styles/ai-tokens" as *;

.page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 18px $ai-padding-horizontal $ai-padding-horizontal;
  background: $ai-bg;
  overflow: hidden;
  font-family: $ai-font-family;
  overscroll-behavior: none;
}

.engine-switch {
  display: flex;
  gap: 8px;
  padding: 4px 2px 10px;

  &__item {
    font-size: 12px;
    color: #969799;
    background: #f2f3f5;
    border-radius: 999px;
    padding: 4px 14px;
    cursor: pointer;
    user-select: none;

    &--active {
      color: #fff;
      background: #1989fa;
    }
  }
}

.content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  position: relative;
}
</style>

