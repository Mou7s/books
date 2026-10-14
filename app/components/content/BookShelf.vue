<script setup lang="ts">
import books from '~/data/catalog.json'
const search = ref('')
const filtered = computed(() => books.filter(book => `${book.title} ${book.author}`.toLowerCase().includes(search.value.trim().toLowerCase())))
</script>
<template>
  <UContainer class="py-8 sm:py-12 lg:py-16">
    <UPageHeader title="书架" description="收藏书籍，随时开始阅读。" :ui="{ title: 'text-3xl sm:text-4xl', description: 'text-base sm:text-lg' }">
      <template #links><UBadge color="neutral" variant="subtle" size="lg">{{ books.length }} 本书</UBadge></template>
    </UPageHeader>
    <div class="flex items-center justify-between gap-4 py-6 sm:py-8">
      <h2 class="text-sm font-medium text-toned">全部书籍</h2>
      <UInput v-model="search" icon="i-lucide-search" placeholder="搜索书名或作者" aria-label="搜索书名或作者" class="w-56 sm:w-72" />
    </div>
    <UPageGrid class="lg:grid-cols-3">
      <UPageCard v-for="book in filtered" :key="book.id" :to="`/books/${book.id}`" :title="book.title" :description="book.author" variant="outline" :ui="{ container: 'gap-5', title: 'text-lg', description: 'text-sm' }">
        <template #header><div class="flex items-center gap-5">
          <img v-if="book.cover" :src="book.cover" :alt="book.title" width="96" height="144" class="h-36 w-24 shrink-0 rounded object-cover shadow-sm" loading="lazy">
          <UIcon v-else name="i-lucide-book-open" class="size-12 text-muted" />
          <div class="space-y-2 text-sm text-muted"><p v-if="book.year">{{ book.year }}</p><p>{{ book.chapters.length }} 个章节</p><UBadge color="neutral" variant="subtle">EPUB 原文</UBadge></div>
        </div></template>
        <template #footer><span class="flex items-center gap-2 text-sm font-medium text-primary">打开书籍 <UIcon name="i-lucide-arrow-right" class="size-4" /></span></template>
      </UPageCard>
    </UPageGrid>
    <UEmpty v-if="!filtered.length" icon="i-lucide-search" title="没有找到书籍" description="试试其他书名或作者。" class="my-8" />
  </UContainer>
</template>
