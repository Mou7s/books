<script setup lang="ts">
const { locale, localePath } = useDocusI18n()
const chinese = computed(() => locale.value === 'zh-cn')
</script>
<template>
  <div class="flex items-start gap-6 mb-8">
    <img src="/cover.jpg" alt="Consider Phlebas book cover" width="120" height="180" class="w-24 sm:w-32 rounded-md shadow-lg" />
    <div class="pt-1">
      <p class="text-xs tracking-widest uppercase text-primary mb-3">{{ chinese ? '文明系列 · 第一部' : 'The Culture · Book One' }}</p>
      <p class="reader-title text-2xl mb-2">Iain M. Banks</p>
      <p class="text-muted mb-5">{{ chinese ? '1987 · 中文试译' : '1987 · English edition' }}</p>
      <UButton :to="localePath('/read/title-epigraphs')" icon="i-lucide-book-open" color="primary">{{ chinese ? '开始阅读' : 'Begin reading' }}</UButton>
    </div>
  </div>
</template>
