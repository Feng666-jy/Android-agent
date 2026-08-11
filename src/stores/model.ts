import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { modelManageAPI, type ModelListParams, type ModelGroup } from "@/api/models";
import type { AiModel } from "@/types";
import { showToast, showDialog } from "vant";

export const useModelStore = defineStore("model", () => {
  // ---- State ----
  const models = ref<AiModel[]>([]);
  const groups = ref<ModelGroup[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const searchQuery = ref("");
  const activeGroupId = ref<string | null | undefined>(undefined);
  const sortBy = ref<"default" | "name" | "created" | "usage" | "favorite">("default");

  // ---- Getters ----
  const favorites = computed(() =>
    models.value.filter((m) => m.isFavorite)
  );

  const defaultModel = computed(() =>
    models.value.find((m) => m.isDefault) || null
  );

  const filteredModels = computed(() => {
    let result = models.value;
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      result = result.filter(
        (m) =>
          m.displayName?.toLowerCase().includes(q) ||
          m.modelName?.toLowerCase().includes(q)
      );
    }
    return result;
  });

  const groupedModels = computed(() => {
    const map = new Map<string, AiModel[]>();
    groups.value.forEach((g) => map.set(g.id, []));
    map.set("__ungrouped__", []);
    models.value.forEach((m) => {
      const gid = m.groupId || "__ungrouped__";
      if (!map.has(gid)) map.set("__ungrouped__", []);
      map.get(gid)!.push(m);
    });
    return map;
  });

  // ---- Actions ----

  async function fetchModels(params?: ModelListParams) {
    loading.value = true;
    try {
      const res = await modelManageAPI.list({
        search: searchQuery.value || undefined,
        groupId: activeGroupId.value,
        sort: sortBy.value,
        ...params,
      });
      if (res.code === 0 && res.data) {
        models.value = res.data.models;
        total.value = res.data.total;
      }
    } catch {
      showToast("加载模型失败");
    } finally {
      loading.value = false;
    }
  }

  async function fetchGroups() {
    try {
      const res = await modelManageAPI.listGroups();
      if (res.code === 0) {
        groups.value = res.data || [];
      }
    } catch {
      showToast("加载分组失败");
    }
  }

  async function toggleFavorite(id: string) {
    try {
      const res = await modelManageAPI.toggleFavorite(id);
      if (res.code === 0) {
        const idx = models.value.findIndex((m) => m.id === id);
        if (idx !== -1) {
          models.value[idx].isFavorite = res.data.isFavorite;
        }
        showToast(res.data.isFavorite ? "已收藏" : "已取消收藏");
      }
    } catch {
      showToast("操作失败");
    }
  }

  async function setDefault(id: string) {
    try {
      const res = await modelManageAPI.setDefault(id);
      if (res.code === 0) {
        models.value.forEach((m) => {
          m.isDefault = m.id === id;
        });
        showToast("已设为默认模型");
      }
    } catch {
      showToast("设置失败");
    }
  }

  async function createGroup(data: { name: string; description?: string; icon?: string; color?: string }) {
    try {
      const res = await modelManageAPI.createGroup(data);
      if (res.code === 0) {
        groups.value.push(res.data);
        showToast("分组创建成功");
        return res.data;
      }
    } catch (error: any) {
      showToast(error.message || "创建失败");
    }
    return null;
  }

  async function deleteGroup(id: string) {
    try {
      await showDialog({
        title: "确认删除",
        message: "删除分组后，原分组下的模型将移至未分组。确定继续？",
        confirmButtonText: "删除",
        confirmButtonColor: "#ee0a24",
      });
      await modelManageAPI.deleteGroup(id);
      groups.value = groups.value.filter((g) => g.id !== id);
      models.value.forEach((m: any) => {
        if (m.groupId === id) m.groupId = null;
      });
      showToast("分组已删除");
    } catch {
      /* cancelled */
    }
  }

  async function moveToGroup(modelIds: string[], groupId: string | null) {
    try {
      const res = await modelManageAPI.moveToGroup(modelIds, groupId);
      if (res.code === 0) {
        models.value.forEach((m: any) => {
          if (modelIds.includes(m.id)) m.groupId = groupId;
        });
        showToast(`已移动 ${res.data.updated} 个模型`);
      }
    } catch {
      showToast("移动失败");
    }
  }

  function setSearch(q: string) {
    searchQuery.value = q;
  }

  function setSort(sort: "default" | "name" | "created" | "usage" | "favorite") {
    sortBy.value = sort;
  }

  function setActiveGroup(groupId: string | null | undefined) {
    activeGroupId.value = groupId;
  }

  return {
    // state
    models,
    groups,
    total,
    loading,
    searchQuery,
    activeGroupId,
    sortBy,
    // getters
    favorites,
    defaultModel,
    filteredModels,
    groupedModels,
    // actions
    fetchModels,
    fetchGroups,
    toggleFavorite,
    setDefault,
    createGroup,
    deleteGroup,
    moveToGroup,
    setSearch,
    setSort,
    setActiveGroup,
  };
});