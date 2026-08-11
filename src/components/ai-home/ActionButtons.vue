<script setup lang="ts">
import { ref } from "vue";
import type { ComponentPublicInstance } from "vue";
import ModelSelector from "@/components/ModelSelector/ModelSelector.vue";
import type { AiModel } from "@/types";

const emit = defineEmits<{
  select: [model: AiModel];
}>();

const selectors = ref<InstanceType<typeof ModelSelector>[]>([]);

function registerRef(el: Element | ComponentPublicInstance | null, index: number) {
  if (!el || el instanceof Element) return;
  selectors.value[index] = el as InstanceType<typeof ModelSelector>;
}

function closeAllExcept(index: number) {
  selectors.value.forEach((sel, i) => {
    if (i !== index && sel) sel.close();
  });
}
</script>

<template>
  <div class="action-buttons" role="group" aria-label="AI model selection">
    <ModelSelector
      :ref="(el) => registerRef(el, 0)"
      provider="deepseek"
      label="DeepSeek"
      @open="closeAllExcept(0)"
      @select="emit('select', $event)"
    />
    <ModelSelector
      :ref="(el) => registerRef(el, 1)"
      provider="claude"
      label="Claude"
      @open="closeAllExcept(1)"
      @select="emit('select', $event)"
    />
    <ModelSelector
      :ref="(el) => registerRef(el, 2)"
      provider="chatgpt"
      label="ChatGPT"
      @open="closeAllExcept(2)"
      @select="emit('select', $event)"
    />
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/ai-tokens" as *;

.action-buttons {
  display: flex;
  gap: $ai-space-1;
  width: 100%;
  min-width: 0;
}
</style>