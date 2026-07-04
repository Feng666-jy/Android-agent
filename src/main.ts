import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import Vant from 'vant'
import 'vant/lib/index.css'
import '@/styles/global.scss'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(Vant)

const themeStore = useThemeStore()
themeStore.init()

app.mount('#app')