<template>
  <div class="language-switch">
    <button 
      v-if="currentLang !== 'zh'" 
      @click="switchLang('zh')"
      class="lang-btn"
      :class="{ active: currentLang === 'zh' }"
    >中</button>
    <button 
      v-if="currentLang !== 'en'" 
      @click="switchLang('en')"
      class="lang-btn"
      :class="{ active: currentLang === 'en' }"
    >EN</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()
const currentLang = ref('zh')

onMounted(() => {
  // Auto-detect language from browser
  const browserLang = navigator.language || navigator.userLanguage
  const detectedLang = browserLang.startsWith('en') ? 'en' : 'zh'
  currentLang.value = detectedLang
})

function switchLang(lang) {
  const path = window.location.pathname
  // Replace language segment in path
  let newPath = path.replace(/\/(zh|en)\//, `/${lang}/`)
  // Handle root paths
  if (path === '/' || path === '/claude-code/' || path === '/codex/' || path === '/amazon/') {
    newPath = `/${lang}/`
  }
  window.location.href = newPath
}
</script>

<style scoped>
.language-switch {
  display: flex;
  gap: 4px;
  align-items: center;
}
.lang-btn {
  padding: 4px 8px;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.lang-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.lang-btn.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}
</style>
