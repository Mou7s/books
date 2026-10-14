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
  <UCard v-if="book" variant="subtle" class="mb-8" :ui="{ body: 'flex items-start gap-6 sm:gap-8' }">
    <img v-if="book.cover" :src="book.cover" :alt="book.title" width="120" height="180" class="w-24 sm:w-32 rounded object-cover shadow-sm">
    <div class="pt-1"><p v-if="book.series" class="text-sm text-muted mb-3">{{ book.series }}</p><p class="text-muted mb-5">{{ book.year }} · {{ book.chapters.length }} 个章节</p><div class="flex flex-wrap gap-2"><UButton :to="savedPath || book.chapters[0]?.path" icon="i-lucide-book-open" color="primary">{{ savedPath ? '继续阅读' : '开始阅读' }}</UButton><UButton to="/" color="neutral" variant="ghost">返回书架</UButton></div></div>
  </UCard>
</template>
