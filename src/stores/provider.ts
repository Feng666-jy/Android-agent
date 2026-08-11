import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { providerAPI, type Provider, type CreateProviderDTO, type UpdateProviderDTO } from "@/api/provider";
import { showToast, showDialog } from "vant";

interface HealthInfo {
  status: string;
  latencyMs: number;
  errorMessage?: string;
}

export const useProviderStore = defineStore("provider", () => {
  const providers = ref<Provider[]>([]);
  const currentProvider = ref<Provider | null>(null);
  const loading = ref(false);
  const healthChecking = ref(false);
  const healthMap = ref<Map<string, HealthInfo>>(new Map());

  const enabledProviders = computed(() =>
    providers.value.filter((p) => p.isEnabled)
  );

  const sortedProviders = computed(() =>
    [...providers.value].sort((a, b) => a.sortOrder - b.sortOrder)
  );

  async function fetchProviders(includeDisabled = false) {
    loading.value = true;
    try {
      const res = await providerAPI.getAll(includeDisabled);
      providers.value = res.data || [];
    } catch {
      showToast("加载供应商失败");
    } finally {
      loading.value = false;
    }
  }

  async function fetchProvider(id: string) {
    loading.value = true;
    try {
      const res = await providerAPI.getById(id);
      currentProvider.value = res.data;
      return res.data;
    } catch {
      showToast("加载供应商详情失败");
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function createProvider(data: CreateProviderDTO) {
    try {
      const res = await providerAPI.create(data);
      providers.value.push(res.data);
      showToast("供应商创建成功");
      return res.data;
    } catch (error: any) {
      showToast(error.message || "创建失败");
      return null;
    }
  }

  async function updateProvider(id: string, data: UpdateProviderDTO) {
    try {
      const res = await providerAPI.update(id, data);
      const idx = providers.value.findIndex((p) => p.id === id);
      if (idx !== -1) {
        providers.value[idx] = res.data;
      }
      showToast("供应商更新成功");
      return res.data;
    } catch (error: any) {
      showToast(error.message || "更新失败");
      return null;
    }
  }

  async function deleteProvider(id: string) {
    try {
      await showDialog({
        title: "确认删除",
        message: "删除供应商将同时删除其下所有模型，确定继续？",
        confirmButtonText: "删除",
        confirmButtonColor: "#ee0a24",
      });
      await providerAPI.remove(id);
      providers.value = providers.value.filter((p) => p.id !== id);
      showToast("供应商已删除");
    } catch {
      /* cancelled */
    }
  }

  async function runHealthCheck(id: string) {
    healthChecking.value = true;
    try {
      const res = await providerAPI.healthCheck(id);
      healthMap.value.set(id, res.data);
      return res.data;
    } catch {
      showToast("健康检查失败");
      return null;
    } finally {
      healthChecking.value = false;
    }
  }

  async function runHealthCheckAll() {
    healthChecking.value = true;
    try {
      const res = await providerAPI.healthCheckAll();
      res.data?.forEach((item) => {
        healthMap.value.set(item.providerId, {
          status: item.status,
          latencyMs: item.latencyMs,
          errorMessage: item.errorMessage,
        });
      });
    } catch {
      showToast("批量健康检查失败");
    } finally {
      healthChecking.value = false;
    }
  }

  function getHealth(id: string): HealthInfo | undefined {
    return healthMap.value.get(id);
  }

  async function discoverModels(id: string) {
    try {
      const res = await providerAPI.discover(id);
      return res.data;
    } catch {
      showToast("获取上游模型失败");
      return null;
    }
  }

  async function importModels(id: string, modelNames: string[]) {
    try {
      const res = await providerAPI.importModels(id, modelNames);
      return res.data;
    } catch {
      showToast("导入模型失败");
      return null;
    }
  }

  return {
    providers,
    currentProvider,
    loading,
    healthChecking,
    healthMap,
    enabledProviders,
    sortedProviders,
    fetchProviders,
    fetchProvider,
    createProvider,
    updateProvider,
    deleteProvider,
    runHealthCheck,
    runHealthCheckAll,
    getHealth,
    discoverModels,
    importModels,
  };
});