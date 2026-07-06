<script setup lang="ts">
import { ref, computed } from "vue";
import type { AiModel } from "@/types";
import { modelsAPI } from "@/api/models";
import ModelDropdown from "./ModelDropdown.vue";

const props = defineProps<{
  provider: "deepseek" | "claude" | "chatgpt";
  label: string;
}>();

const emit = defineEmits<{
  open: [];
}>();

const models = ref<AiModel[]>([]);
const selectedModel = ref<AiModel | null>(null);
const visible = ref(false);
const loading = ref(false);
const buttonRef = ref<HTMLElement | null>(null);

const displayLabel = computed(() => {
  return selectedModel.value ? selectedModel.value.displayName : props.label;
});

async function toggle() {
  if (visible.value) {
    visible.value = false;
    return;
  }
  await loadModels();
  visible.value = true;
  emit("open");
}

async function loadModels() {
  if (models.value.length > 0) return;
  loading.value = true;
  try {
    let res;
    if (props.provider === "deepseek") {
      res = await modelsAPI.getDeepSeekModels();
    } else if (props.provider === "claude") {
      res = await modelsAPI.getClaudeModels();
    } else {
      res = await modelsAPI.getChatGPTModels();
    }
    models.value = res.data || [];
  } catch (_error) {
    models.value = [];
  } finally {
    loading.value = false;
  }
}

function handleSelect(model: AiModel) {
  selectedModel.value = model;
  visible.value = false;
}

function handleClose() {
  visible.value = false;
}

defineExpose({
  close: () => {
    visible.value = false;
  }
});
</script>

<template>
  <div class="model-selector">
    <button
      ref="buttonRef"
      class="model-selector__btn"
      :class="{ 'model-selector__btn--active': visible }"
      :aria-label="'Select ' + label"
      @click.stop="toggle"
    >
      <span class="model-selector__label">{{ displayLabel }}</span>
      <svg
        class="model-selector__arrow"
        :class="{ 'model-selector__arrow--up': visible }"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
    <ModelDropdown
      :models="models"
      :selected-model="selectedModel"
      :visible="visible"
      :trigger-el="buttonRef"
      @select="handleSelect"
      @close="handleClose"
    />
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/ai-tokens" as *;

.model-selector {
  position: relative;
  flex: 1 1 0;
  min-width: 0;

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: 100%;
    height: $ai-button-height;
    padding: 0 $ai-space-2;
    background: $ai-button-bg;
    border: none;
    border-radius: $ai-radius-full;
    box-shadow: $ai-shadow-button;
    cursor: pointer;
    transition: transform 0.2s ease;
    color: $ai-text-primary;
    font-family: $ai-font-family;
    font-size: $ai-font-size-button;
    font-weight: $ai-font-weight-button;
    letter-spacing: $ai-letter-spacing;
    white-space: nowrap;
    overflow: hidden;

    &:hover {
      transform: translateY(-1px);
    }

    &:active {
      transform: scale(0.97);
    }

    &--active {
      box-shadow: 0 0 0 1.5px rgba(0, 0, 0, 0.08);
    }
  }

  &__label {
    line-height: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__arrow {
    flex-shrink: 0;
    width: 12px;
    height: 12px;
    transition: transform 0.2s ease;

    &--up {
      transform: rotate(180deg);
    }
  }
}
</style>