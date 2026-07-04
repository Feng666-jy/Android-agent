<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/stores/user"
import DefaultLayout from "@/layouts/DefaultLayout.vue"
import GlassCard from "@/components/GlassCard.vue"
import { showToast, showDialog } from "vant"

const router = useRouter()
const userStore = useUserStore()

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return "Good Morning"
  if (hour < 18) return "Good Afternoon"
  return "Good Evening"
})

const stats = [
  { label: "Projects", value: "12", icon: "📁", color: "#1989fa" },
  { label: "Tasks", value: "48", icon: "✅", color: "#07c160" },
  { label: "Team", value: "6", icon: "👥", color: "#ff976a" },
  { label: "Active", value: "3", icon: "⚡", color: "#ee0a24" }
]

const quickActions = [
  { label: "New Project", icon: "➕", action: () => showToast("Create new project") },
  { label: "AI Chat", icon: "🤖", action: () => showToast("Open AI assistant") },
  { label: "Settings", icon: "⚙️", action: () => showToast("Open settings") }
]

onMounted(() => {
  if (userStore.isLoggedIn && !userStore.userInfo) {
    userStore.fetchUserInfo()
  }
})

async function handleLogout() {
  try {
    await showDialog({ title: "Logout", message: "Are you sure you want to logout?" })
    userStore.logout()
    router.push("/login")
  } catch {
    /* cancelled */
  }
}
</script>

<template>
  <DefaultLayout title="Home">
    <div class="home">
      <div class="home__greeting">
        <div class="home__avatar">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="24" fill="#1989fa" opacity="0.2" />
            <circle cx="24" cy="18" r="6" fill="#1989fa" />
            <path d="M12 38c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="#1989fa" />
          </svg>
        </div>
        <div class="home__greeting-text">
          <h2>{{ greeting }}, {{ userStore.userInfo?.username || "User" }}</h2>
          <p>{{ userStore.userInfo?.email || "Loading..." }}</p>
        </div>
        <button class="home__logout" @click="handleLogout">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>

      <div class="home__stats">
        <GlassCard v-for="stat in stats" :key="stat.label" :hover="true" class="home__stat-item" padding="16px" radius="12px">
          <div class="home__stat-icon" :style="{ background: stat.color + '20' }">{{ stat.icon }}</div>
          <div class="home__stat-value">{{ stat.value }}</div>
          <div class="home__stat-label">{{ stat.label }}</div>
        </GlassCard>
      </div>

      <div class="home__section">
        <h3 class="section-title">Quick Actions</h3>
        <div class="home__actions">
          <GlassCard v-for="action in quickActions" :key="action.label" :hover="true" class="home__action-item" padding="20px" radius="14px">
            <div class="home__action-content" @click="action.action">
              <span class="home__action-icon">{{ action.icon }}</span>
              <span class="home__action-label">{{ action.label }}</span>
            </div>
          </GlassCard>
        </div>
      </div>

      <div class="home__section">
        <h3 class="section-title">Recent Activity</h3>
        <GlassCard padding="16px" radius="12px">
          <div class="home__activity-list">
            <div class="home__activity-item">
              <div class="home__activity-dot" style="background: #1989fa" />
              <div class="home__activity-text">
                <strong>Project initialized</strong>
                <p>Android Agent project scaffold created</p>
              </div>
              <span class="home__activity-time">Now</span>
            </div>
            <div class="home__activity-item">
              <div class="home__activity-dot" style="background: #07c160" />
              <div class="home__activity-text">
                <strong>System ready</strong>
                <p>All modules are operational</p>
              </div>
              <span class="home__activity-time">1m ago</span>
            </div>
            <div class="home__activity-item">
              <div class="home__activity-dot" style="background: #ff976a" />
              <div class="home__activity-text">
                <strong>Welcome</strong>
                <p>Welcome to the platform!</p>
              </div>
              <span class="home__activity-time">5m ago</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  </DefaultLayout>
</template>

<style lang="scss" scoped>
@use "@/styles/variables" as *;
@use "@/styles/mixins" as *;

.home {
  padding-bottom: 20px;

  &__greeting {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    padding: 4px 0;

    h2 { font-size: 20px; font-weight: 700; line-height: 1.3; }
    p { font-size: 13px; color: $text-color-secondary; margin-top: 2px; }
  }

  &__avatar { flex-shrink: 0; }

  &__logout {
    margin-left: auto;
    background: none;
    border: none;
    cursor: pointer;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $text-color-secondary;
    transition: all $transition-fast;

    &:hover { background-color: rgba(0, 0, 0, 0.05); color: $danger-color; }
  }

  &__stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px; }
  &__stat-item { text-align: center; }

  &__stat-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; margin: 0 auto 8px;
  }

  &__stat-value { font-size: 22px; font-weight: 700; line-height: 1.2; }
  &__stat-label { font-size: 12px; color: $text-color-secondary; margin-top: 2px; }

  &__section { margin-bottom: 24px; }
  &__actions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }

  &__action-content {
    display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer;
  }

  &__action-icon { font-size: 24px; }
  &__action-label { font-size: 13px; font-weight: 500; }

  &__activity-list { display: flex; flex-direction: column; gap: 16px; }
  &__activity-item { display: flex; align-items: flex-start; gap: 12px; }

  &__activity-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }

  &__activity-text {
    flex: 1; min-width: 0;
    strong { font-size: 14px; font-weight: 600; display: block; }
    p { font-size: 12px; color: $text-color-secondary; margin-top: 2px; @include ellipsis; }
  }

  &__activity-time { font-size: 12px; color: $text-color-light; flex-shrink: 0; }
}
</style>