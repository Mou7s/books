<script setup lang="ts">
import books from '~/data/library.json'
const { locale, localePath } = useDocusI18n()
const chinese = computed(() => locale.value === 'zh-cn')
const route = useRoute()
const book = computed(() => books.find(item => item.id === route.path.split('/books/')[1]?.split('/')[0]))
const first = computed(() => book.value?.chapters[locale.value as 'en' | 'zh-cn']?.[0]?.path || book.value?.chapters.en[0]?.path)
</script>
<template>
  <div v-if="book" class="flex items-start gap-6 mb-8">
    <img v-if="book.cover" :src="book.cover" :alt="book.title.en" width="120" height="180" class="w-24 sm:w-32 rounded-md shadow-lg" />
    <div class="pt-1">
      <p v-if="book.series" class="text-xs tracking-widest uppercase text-primary mb-3">{{ book.series[locale as 'en' | 'zh-cn'] }}</p>
      <p class="reader-title text-2xl mb-2">{{ book.author }}</p>
      <p class="text-muted mb-5">{{ book.year }} · {{ book.chapters.en.length }} {{ chinese ? '节原文' : 'original sections' }} · {{ book.chapters['zh-cn'].length }} {{ chinese ? '节译文' : 'translated sections' }}</p>
      <div class="flex flex-wrap gap-2">
        <UButton :to="first" icon="i-lucide-book-open" color="primary">{{ chinese ? '开始阅读' : 'Begin reading' }}</UButton>
        <UButton v-if="book.firstBilingual" :to="`${book.firstBilingual}?view=bilingual`" color="neutral" variant="soft">{{ chinese ? '双语阅读' : 'Bilingual' }}</UButton>
        <UButton :to="localePath('/')" color="neutral" variant="ghost">{{ chinese ? '返回书架' : 'Bookshelf' }}</UButton>
      </div>
    </div>
  </div>
</template>
