<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount } from "vue";
import type { AiModel } from "@/types";
import ModelItem from "./ModelItem.vue";
import ModelEmpty from "./ModelEmpty.vue";

const props = defineProps<{
  models: AiModel[];
  selectedModel: AiModel | null;
  visible: boolean;
  triggerEl: HTMLElement | null;
}>();

const emit = defineEmits<{
  select: [model: AiModel];
  close: [];
}>();

const panelRef = ref<HTMLElement | null>(null);

function handleSelect(model: AiModel) {
  emit("select", model);
}

function handleClickOutside(e: MouseEvent) {
  if (!props.visible) return;
  const target = e.target as Node;
  if (panelRef.value && panelRef.value.contains(target)) return;
  if (props.triggerEl && props.triggerEl.contains(target)) return;
  emit("close");
}

watch(
  () => props.visible,
  async (val) => {
    if (val) {
      await nextTick();
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
  }
);

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <Transition name="dropdown">
    <div
      v-if="visible"
      ref="panelRef"
      class="model-dropdown"
    >
      <div class="model-dropdown__list">
        <ModelItem
          v-for="model in models"
          :key="model.id"
          :model="model"
          :selected="selectedModel?.id === model.id"
          @select="handleSelect"
        />
        <ModelEmpty v-if="models.length === 0" />
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
@use "@/styles/ai-tokens" as *;

.model-dropdown {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  min-width: 180px;
  max-width: 260px;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  background: $ai-card-bg;
  border-radius: $ai-bottom-card-radius;
  box-shadow: $ai-shadow-card;
  padding: 12px;
  z-index: 1000;
  overflow: hidden;

  &__list {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    padding: 4px;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.12);
      border-radius: $ai-radius-full;

      &:hover {
        background: rgba(0, 0, 0, 0.2);
      }
    }
  }
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 220ms ease-out, transform 220ms ease-out;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(6px) scale(0.98);
}
</style>