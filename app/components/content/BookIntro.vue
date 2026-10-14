<script setup lang="ts">
import books from '~/data/catalog.json'
const route = useRoute()
const book = computed(() => books.find(item=>item.id===route.path.split('/books/')[1]?.split('/')[0]))
const savedPath = ref('')
onMounted(()=> {
  try {
    const saved=JSON.parse(localStorage.getItem(`books-progress:${book.value?.id}`)||'null')
    if(book.value?.chapters.some(chapter=>chapter.path===saved?.path)) savedPath.value=saved.path
  } catch {}
})
</script>
<template>
  <div v-if="book" class="flex items-start gap-6 mb-8">
    <img v-if="book.cover" :src="book.cover" :alt="book.title" width="120" height="180" class="w-24 sm:w-32 rounded-md shadow-lg">
    <div class="pt-1"><p v-if="book.series" class="text-xs tracking-widest uppercase text-primary mb-3">{{ book.series }}</p><p class="reader-title text-2xl mb-2">{{ book.author }}</p><p class="text-muted mb-5">{{ book.year }} · {{ book.chapters.length }} 节原文</p><div class="flex flex-wrap gap-2"><UButton :to="savedPath || book.chapters[0]?.path" icon="i-lucide-book-open" color="primary">{{ savedPath ? '继续阅读' : '开始阅读' }}</UButton><UButton to="/" color="neutral" variant="ghost">返回书架</UButton></div></div>
  </div>
</template>
