<script setup lang="ts">
import { onMounted, ref, computed, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProviderStore } from "@/stores/provider";
import { showToast } from "vant";
import type { PickerConfirmEventParams } from "vant";

const PROTOCOL_OPTIONS = [
  { text: "OpenAI 兼容", value: "OPENAI_COMPATIBLE" },
  { text: "Anthropic", value: "ANTHROPIC" },
  { text: "Google Gemini", value: "GOOGLE_GEMINI" },
  { text: "Ollama", value: "OLLAMA" },
];

const AUTH_OPTIONS = [
  { text: "API Key", value: "API_KEY" },
  { text: "Bearer Token", value: "BEARER_TOKEN" },
  { text: "OAuth", value: "OAUTH" },
  { text: "无", value: "NONE" },
];

const route = useRoute();
const router = useRouter();
const store = useProviderStore();

const providerId = computed(() => route.params.id as string || "");
const isEditMode = computed(() => !!providerId.value && route.path.includes("/edit"));

const form = reactive({
  name: "",
  baseUrl: "",
  protocol: "OPENAI_COMPATIBLE",
  authType: "API_KEY",
  apiKeyEncrypted: "",
  isEnabled: true,
});

const hasStoredKey = ref(false);

const saving = ref(false);
const loading = ref(false);
const formRef = ref(null);
const showProtocolPicker = ref(false);
const showAuthPicker = ref(false);

onMounted(async () => {
  if (isEditMode.value) {
    loading.value = true;
    const data = await store.fetchProvider(providerId.value);
    if (data) {
      form.name = data.name;
      form.baseUrl = data.baseUrl;
      form.protocol = data.protocol;
      form.authType = data.authType;
      form.isEnabled = data.isEnabled;
      hasStoredKey.value = !!data.hasApiKey;
    }
    loading.value = false;
  }
});

function goBack() {
  if (isEditMode.value) {
    router.push("/workspace/settings/providers/" + providerId.value);
  } else {
    router.push("/workspace/settings/providers");
  }
}

async function onSubmit() {
  if (!form.name.trim()) { showToast("请输入供应商名称"); return; }
  if (!form.baseUrl.trim()) { showToast("请输入 Base URL"); return; }
  try { new URL(form.baseUrl.trim()); } catch { showToast("Base URL 格式无效"); return; }

  saving.value = true;
  try {
    if (isEditMode.value) {
      await store.updateProvider(providerId.value, {
        name: form.name.trim(),
        baseUrl: form.baseUrl.trim(),
        protocol: form.protocol,
        authType: form.authType,
        isEnabled: form.isEnabled,
        apiKeyEncrypted: form.apiKeyEncrypted || undefined,
      });
      showToast("供应商更新成功");
      router.replace("/workspace/settings/providers/" + providerId.value);
    } else {
      const result = await store.createProvider({
        name: form.name.trim(),
        baseUrl: form.baseUrl.trim(),
        protocol: form.protocol,
        authType: form.authType,
        apiKeyEncrypted: form.apiKeyEncrypted || undefined,
      });
      showToast("供应商创建成功");
      if (result && result.id) {
        router.replace("/workspace/settings/providers/" + result.id);
      } else {
        router.replace("/workspace/settings/providers");
      }
    }
  } finally {
    saving.value = false;
  }
}

function onProtocolConfirm({ selectedValues }: PickerConfirmEventParams) {
  form.protocol = selectedValues[0] as string;
  showProtocolPicker.value = false;
}

function onAuthConfirm({ selectedValues }: PickerConfirmEventParams) {
  form.authType = selectedValues[0] as string;
  showAuthPicker.value = false;
}
</script>

<template>
  <div class="provider-form">
    <header class="provider-form__header">
      <button class="provider-form__back" aria-label="返回" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <h1 class="provider-form__title">{{ isEditMode ? "编辑供应商" : "添加供应商" }}</h1>
      <button class="provider-form__save" :disabled="saving" @click="onSubmit">
        {{ saving ? "保存中..." : "保存" }}
      </button>
    </header>

    <main class="provider-form__content">
      <div v-if="loading" class="provider-form__loading">
        <div class="provider-form__skeleton" v-for="n in 5" :key="n"></div>
      </div>
      <van-form v-else ref="formRef" class="provider-form__form">
        <van-cell-group inset>
          <van-field
            v-model="form.name" name="name" label="名称"
            placeholder="输入供应商名称" required
            :rules="[{ required: true, message: '请输入名称' }]"
          />
          <van-field
            v-model="form.baseUrl" name="baseUrl" label="Base URL"
            placeholder="https://api.example.com/v1" required
            :rules="[{ required: true, message: '请输入 Base URL' }]"
          />
          <van-field
            :model-value="PROTOCOL_OPTIONS.find(o => o.value === form.protocol)?.text || form.protocol"
            is-link readonly name="protocol" label="协议类型" placeholder="选择协议"
            @click="showProtocolPicker = true"
          />
          <van-field
            :model-value="AUTH_OPTIONS.find(o => o.value === form.authType)?.text || form.authType"
            is-link readonly name="authType" label="认证方式" placeholder="选择认证方式"
            @click="showAuthPicker = true"
          />
          <van-field
            v-model="form.apiKeyEncrypted" name="apiKey" label="API Key"
            :placeholder="hasStoredKey ? '已保存，留空表示不修改' : '输入 API Key'"
            type="password" autocomplete="off"
          />
          <van-field name="isEnabled" label="启用">
            <template #input>
              <van-switch v-model="form.isEnabled" />
            </template>
          </van-field>
        </van-cell-group>
      </van-form>
      <div class="provider-form__footer">
        <button class="provider-form__submit" :disabled="saving" @click="onSubmit">
          {{ saving ? "保存中..." : (isEditMode ? "保存修改" : "创建供应商") }}
        </button>
      </div>
    </main>

    <van-popup v-model:show="showProtocolPicker" position="bottom" round>
      <van-picker :columns="PROTOCOL_OPTIONS" @confirm="onProtocolConfirm" @cancel="showProtocolPicker = false" />
    </van-popup>
    <van-popup v-model:show="showAuthPicker" position="bottom" round>
      <van-picker :columns="AUTH_OPTIONS" @confirm="onAuthConfirm" @cancel="showAuthPicker = false" />
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/ai-tokens" as *;

.provider-form {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: $ai-bg;
  overflow: hidden;

  &__header {
    display: flex; align-items: center; gap: 12px;
    padding: 16px; border-bottom: 1px solid rgba(0, 0, 0, 0.06); flex-shrink: 0;
  }
  &__back { width: 32px; height: 32px; border-radius: $ai-radius-full; border: none; background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; color: $ai-text-primary; flex-shrink: 0; }
  &__title { flex: 1; margin: 0; font-size: $ai-font-size-title; font-weight: $ai-font-weight-title; color: $ai-text-primary; }
  &__save { padding: 6px 16px; border-radius: $ai-radius-full; border: none; background: $ai-text-primary; color: $ai-card-bg; font-size: $ai-font-size-aux; font-weight: $ai-font-weight-button; cursor: pointer; &:disabled { opacity: 0.5; cursor: not-allowed; } }
  &__content { flex: 1; overflow-y: auto; padding: 16px 0; }
  &__loading { display: flex; flex-direction: column; gap: 12px; padding: 0 16px; }
  &__skeleton { height: 50px; border-radius: $ai-radius-medium; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
  &__form { margin-bottom: 16px; }
  &__footer { padding: 0 16px; }
  &__submit { width: 100%; padding: 14px; border-radius: $ai-radius-small; border: none; background: $ai-text-primary; color: $ai-card-bg; font-size: $ai-font-size-button; font-weight: $ai-font-weight-button; cursor: pointer; transition: opacity 0.2s; &:disabled { opacity: 0.5; cursor: not-allowed; } &:active { opacity: 0.85; } }
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
