<script setup lang="ts">
const { locale, locales, switchLocalePath } = useDocusI18n()
const route = useRoute()
function destination(code: string) {
  const supportedChinesePage = route.path === '/en' || route.path === '/en/' || ['/read/title-epigraphs', '/read/1-sorpen'].some(path => route.path.endsWith(path))
  return code === 'zh-cn' && !supportedChinesePage ? '/zh-cn' : switchLocalePath(code) || `/${code}`
}
</script>
<template>
  <UPopover :content="{ align: 'end' }">
    <UButton icon="i-lucide-languages" color="neutral" variant="ghost" :aria-label="locale === 'zh-cn' ? '切换语言' : 'Switch language'" />
    <template #content>
      <nav class="flex flex-col p-1" aria-label="Language">
        <NuxtLink v-for="item in locales" :key="item.code" :to="destination(item.code)" class="rounded px-3 py-2 text-sm hover:bg-muted" :aria-current="locale === item.code ? 'true' : undefined">{{ item.name }}</NuxtLink>
      </nav>
    </template>
  </UPopover>
</template>
