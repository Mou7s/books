<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const route = useRoute()

const prefix = computed(() => route.path.match(/^\/books\/[^/]+/)?.[0])
function findBook(items: ContentNavigationItem[], path: string): ContentNavigationItem | undefined {
  for (const item of items) {
    if (item.path === path) return item
    const match = item.children && findBook(item.children, path)
    if (match) return match
  }
}
const chapters = computed(() => prefix.value ? findBook(navigation?.value || [], prefix.value)?.children || [] : [])
</script>
<template>
  <nav>
    <NuxtLink :to="'/'" class="block mb-5 text-sm text-muted">← 返回书架</NuxtLink>
    <NuxtLink v-if="prefix" :to="prefix" class="block mb-4 text-sm font-medium">本书目录</NuxtLink>
    <UContentNavigation v-if="chapters.length" :navigation="chapters" :collapsible="false" highlight />
  </nav>
</template>
