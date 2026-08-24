import DefaultTheme from 'vitepress/theme'
import './styles.css'
import './custom.css'

// 根据当前 URL 自动给 <html> 设置 data-course 属性
// 确保课程简介页的主题色 CSS 变量能正确作用于全局
const COURSE_PATHS: Record<string, string> = {
  '/claude-code/': 'claude-code',
  '/codex/': 'codex',
  '/amazon/': 'amazon',
  '/super-opc/': 'super-opc',
}

function setCourseAttr() {
  if (typeof window === 'undefined') return
  const path = window.location.pathname
  for (const [prefix, course] of Object.entries(COURSE_PATHS)) {
    if (path.startsWith(prefix)) {
      document.documentElement.setAttribute('data-course', course)
      return
    }
  }
}

// 页面加载后立即执行，避免 FOUC
setCourseAttr()

export default DefaultTheme
