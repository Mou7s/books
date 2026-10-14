<script setup lang="ts">
import pages from '~/data/bilingual.json'
const { locale, locales, switchLocalePath } = useDocusI18n()
const route = useRoute()
const preference = useCookie<string>('books-reading-mode', { default: () => 'single', maxAge: 31536000, sameSite: 'lax' })
const translated = computed(() => Object.hasOwn(pages, route.path.replace(/^\/(en|zh-cn)/, '').replace(/\/$/, '')))
const bilingualPath = computed(() => translated.value ? route.path : '/zh-cn/read/title-epigraphs')
function destination(code: string) {
  const supportedChinesePage = route.path === '/en' || route.path === '/en/' || translated.value
  return code === 'zh-cn' && !supportedChinesePage ? '/zh-cn' : switchLocalePath(code) || `/${code}`
}
</script>
<template>
  <UPopover :content="{ align: 'end' }">
    <UButton icon="i-lucide-languages" color="neutral" variant="ghost" :aria-label="locale === 'zh-cn' ? '切换语言' : 'Switch language'" />
    <template #content>
      <nav class="flex flex-col p-1" aria-label="Language">
        <NuxtLink v-for="item in locales" :key="item.code" :to="{ path: destination(item.code).split('?')[0], query: { ...route.query, view: 'single' } }" class="rounded px-3 py-2 text-sm hover:bg-muted" @click="preference = 'single'">{{ item.name }}</NuxtLink>
        <NuxtLink :to="{ path: bilingualPath, query: { ...route.query, view: 'bilingual' } }" class="rounded px-3 py-2 text-sm hover:bg-muted" @click="preference = 'bilingual'">双语阅读 / Bilingual</NuxtLink>
      </nav>
    </template>
  </UPopover>
</template>
