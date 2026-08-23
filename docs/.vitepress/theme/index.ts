import DefaultTheme from 'vitepress/theme'
import './custom.css'

import LanguageSwitch from './LanguageSwitch.vue'

// Add language switch to layout
const OriginalTheme = DefaultTheme
const originalSetup = OriginalTheme.setup
OriginalTheme.setup = function(...args) {
  if (originalSetup) originalSetup(...args)
}

export default OriginalTheme
