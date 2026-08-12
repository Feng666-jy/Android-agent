const TOKEN_KEY = 'app_token'
const SERVER_BASE_KEY = 'server_base_url'
const THEME_KEY = 'app_theme'

export const storage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
  },

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY)
  },

  getServerBase(): string {
    return localStorage.getItem(SERVER_BASE_KEY) || ''
  },

  setServerBase(url: string): void {
    localStorage.setItem(SERVER_BASE_KEY, url)
  },

  getTheme(): string | null {
    return localStorage.getItem(THEME_KEY)
  },

  setTheme(theme: string): void {
    localStorage.setItem(THEME_KEY, theme)
  }
}
