const isDark = ref(false)

export function useDarkMode() {
  function init() {
    if (!import.meta.client) return
    const stored = localStorage.getItem('darkMode')
    if (stored === 'true') {
      isDark.value = true
      document.documentElement.classList.add('dark')
    } else {
      isDark.value = false
      document.documentElement.classList.remove('dark')
    }
  }

  function toggle() {
    isDark.value = !isDark.value
    if (import.meta.client) {
      localStorage.setItem('darkMode', String(isDark.value))
      if (isDark.value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  return { isDark, init, toggle }
}
