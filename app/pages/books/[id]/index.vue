<script setup lang="ts">
import books from '~/data/catalog.json'
const route = useRoute()
const book = books.find(item=>item.id===route.params.id)
if (!book) throw createError({statusCode:404,statusMessage:'Book not found'})
const resume = ref(book.chapters[0]!.path)
const progress = ref(false)
onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(`books-progress:${book.id}`) || 'null')
    if (book.chapters.some(chapter=>chapter.path===saved?.path)) { resume.value=saved.path; progress.value=true }
  } catch {}
})
useHead({title:`${book.title} · Books`})
</script>
<template>
  <main v-if="book" class="book-detail">
    <NuxtLink to="/" class="back-link">← 书库</NuxtLink>
    <section class="book-hero"><div class="detail-cover"><img v-if="book.cover" :src="book.cover" :alt="book.title"></div><div><p class="eyebrow">{{ book.series || '我的藏书' }}</p><h1>{{ book.title }}</h1><p class="book-author">{{ book.author }}</p><p class="book-meta">{{ book.year }} · {{ book.chapters.length }} 节</p><NuxtLink :to="resume" class="read-button">{{ progress ? '继续阅读' : '开始阅读' }}</NuxtLink></div></section>
    <section class="contents"><h2>目录</h2><NuxtLink v-for="(chapter,index) in book.chapters" :key="chapter.path" :to="chapter.path"><span>{{ chapter.title }}</span><span class="chapter-number">{{ String(index+1).padStart(2,'0') }}</span></NuxtLink></section>
  </main>
</template>
