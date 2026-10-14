<script setup lang="ts">
import books from '~/data/catalog.json'
const search = ref('')
const filtered = computed(() => books.filter(book => `${book.title} ${book.author}`.toLowerCase().includes(search.value.toLowerCase())))
useHead({title:'书库 · Books'})
</script>
<template>
  <main class="library">
    <header class="library-heading"><div><p class="eyebrow">BOOKS</p><h1>书库</h1></div><span class="book-count">{{ books.length }} 本书</span></header>
    <input v-model="search" class="library-search" placeholder="搜索书名或作者" aria-label="搜索书名或作者" type="search">
    <div class="shelf-grid">
      <NuxtLink v-for="book in filtered" :key="book.id" :to="`/books/${book.id}`" class="shelf-book">
        <div class="cover-wrap"><img v-if="book.cover" :src="book.cover" :alt="book.title"><div v-else class="cover-placeholder">{{ book.title }}</div></div>
        <h2>{{ book.title }}</h2><p>{{ book.author }}</p>
      </NuxtLink>
    </div>
    <p v-if="!filtered.length" class="empty-state">没有找到这本书。</p>
  </main>
</template>
