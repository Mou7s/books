<script setup lang="ts">
import books from '~/data/catalog.json'
const search = ref('')
const filtered = computed(() => books.filter(book => `${book.title} ${book.author}`.toLowerCase().includes(search.value.trim().toLowerCase())))
</script>
<template>
  <UContainer class="py-10">
    <div class="book-shelf">
      <p class="text-sm text-muted mb-3">我的阅读书架</p>
      <h1 class="reader-title text-4xl mb-4">书架</h1>
      <p class="text-muted mb-8">{{ books.length }} 本书 · 按章节阅读 EPUB 原文</p>
      <UInput v-model="search" icon="i-lucide-search" placeholder="搜索书名或作者" aria-label="搜索书名或作者" class="w-full max-w-md mb-8" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article v-for="book in filtered" :key="book.id" class="book-card">
          <NuxtLink :to="`/books/${book.id}`" class="book-cover-link"><img v-if="book.cover" :src="book.cover" :alt="book.title" width="100" height="150" class="book-cover"><span v-else class="book-cover-placeholder">◇</span></NuxtLink>
          <div class="min-w-0"><NuxtLink :to="`/books/${book.id}`" class="reader-title text-xl font-semibold">{{ book.title }}</NuxtLink><p class="text-sm text-muted mt-2">{{ book.author }} · {{ book.year }}</p><p class="text-sm text-muted mt-3">{{ book.chapters.length }} 节原文</p><UButton :to="`/books/${book.id}`" size="sm" color="neutral" variant="soft" class="mt-5">查看目录</UButton></div>
        </article>
      </div>
      <p v-if="!filtered.length" class="text-muted py-8">没有找到匹配的书。</p>
    </div>
  </UContainer>
</template>
