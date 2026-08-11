<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import TopBar from "@/components/ai-home/TopBar.vue";
import BottomCard from "@/components/ai-home/BottomCard.vue";
import AgentRunPanel from "@/components/ai-home/AgentRunPanel.vue";
import { useModelStore } from "@/stores/model";
import { useConversationStore } from "@/stores/conversation";
import type { AiModel } from "@/types";

const currentTab = ref<"work" | "code">("work");
const modelStore = useModelStore();
const conversationStore = useConversationStore();
const runPanel = ref<InstanceType<typeof AgentRunPanel> | null>(null);
const modelPickerOpen = ref(false);

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

function selectModel(m: AiModel) {
  selectedModel.value = m;
  modelPickerOpen.value = false;
}

function handleSend(value: string) {
  if (!selectedModel.value) {
    import("vant").then(({ showToast }) => showToast("请先在设置中配置并选择模型"));
    return;
  }
  runPanel.value?.start(value, String(selectedModel.value.id));
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
      <div class="model-select">
        <button class="model-select__chip" @click="modelPickerOpen = !modelPickerOpen">
          <span class="model-select__dot" />
          <span class="model-select__name">{{ selectedModel?.displayName || selectedModel?.modelName || "选择模型" }}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <div v-if="modelPickerOpen" class="model-select__menu" @click.self="modelPickerOpen = false">
          <button
            v-for="m in models"
            :key="m.id"
            class="model-select__item"
            :class="{ 'model-select__item--active': selectedModel?.id === m.id }"
            @click="selectModel(m)"
          >
            {{ m.displayName || m.modelName }}
          </button>
          <p v-if="models.length === 0" class="model-select__empty">暂无模型，请到「设置」中添加</p>
        </div>
      </div>
      <AgentRunPanel ref="runPanel" @done="handleRunDone" />
    </main>
    <BottomCard :mode="currentTab" @send="handleSend" />
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

.content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  position: relative;
}

.model-select {
  position: relative;
  display: inline-block;
  margin: 0 0 8px;

  &__chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: $ai-radius-full;
    border: none;
    background: $ai-card-bg;
    box-shadow: $ai-shadow-button;
    cursor: pointer;
    color: $ai-text-primary;
    font-family: $ai-font-family;
    font-size: 13px;
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #07c160;
  }

  &__menu {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    z-index: 20;
    min-width: 180px;
    max-height: 260px;
    overflow-y: auto;
    background: $ai-card-bg;
    border-radius: $ai-radius-small;
    box-shadow: $ai-shadow-card;
    padding: 6px;
  }

  &__item {
    display: block;
    width: 100%;
    padding: 9px 12px;
    border: none;
    border-radius: 10px;
    background: transparent;
    text-align: left;
    font-family: $ai-font-family;
    font-size: 13px;
    color: $ai-text-primary;
    cursor: pointer;

    &:hover {
      background: $ai-input-bg;
    }

    &--active {
      background: $ai-input-bg;
      font-weight: 500;
    }
  }

  &__empty {
    margin: 0;
    padding: 12px;
    font-size: 12px;
    color: $ai-text-placeholder;
    text-align: center;
  }
}
</style>
