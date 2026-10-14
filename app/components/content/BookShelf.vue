<script setup lang="ts">
import books from '~/data/library.json'
const { locale } = useDocusI18n()
const chinese = computed(() => locale.value === 'zh-cn')
const search = ref('')
const filtered = computed(() => books.filter(book => `${book.title.en} ${book.title['zh-cn']} ${book.author}`.toLowerCase().includes(search.value.trim().toLowerCase())))
</script>
<template>
  <div class="book-shelf">
    <p class="text-sm text-muted mb-3">{{ chinese ? '我的阅读书架' : 'My reading library' }}</p>
    <h1 class="reader-title text-4xl mb-4">{{ chinese ? '书架' : 'Bookshelf' }}</h1>
    <p class="text-muted mb-8">{{ chinese ? '原文、译文与双语对照，按自己的节奏阅读。' : 'Read originals, translations and bilingual editions at your own pace.' }}</p>
    <UInput v-model="search" icon="i-lucide-search" :placeholder="chinese ? '搜索书名或作者' : 'Search books or authors'" :aria-label="chinese ? '搜索书名或作者' : 'Search books or authors'" class="w-full max-w-md mb-8" />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <article v-for="book in filtered" :key="book.id" class="book-card">
        <NuxtLink :to="`/${locale}/books/${book.id}`" class="book-cover-link">
          <img v-if="book.cover" :src="book.cover" :alt="book.title.en" width="100" height="150" class="book-cover" />
          <span v-else class="book-cover-placeholder" aria-hidden="true">◇</span>
        </NuxtLink>
        <div class="min-w-0">
          <NuxtLink :to="`/${locale}/books/${book.id}`" class="reader-title text-xl font-semibold">{{ book.title[locale as 'en' | 'zh-cn'] || book.title.en }}</NuxtLink>
          <p class="text-sm text-muted mt-2">{{ book.author }}<span v-if="book.year"> · {{ book.year }}</span></p>
          <p class="text-sm text-muted mt-3">{{ book.chapters.en.length }} {{ chinese ? '节原文' : 'original sections' }} · {{ book.chapters['zh-cn'].length }} {{ chinese ? '节译文' : 'translated sections' }}</p>
          <div class="flex flex-wrap gap-2 mt-5">
            <UButton :to="`/${locale}/books/${book.id}`" size="sm" color="neutral" variant="soft">{{ chinese ? '查看目录' : 'Contents' }}</UButton>
            <UButton v-if="book.firstBilingual" :to="`${book.firstBilingual}?view=bilingual`" size="sm" color="neutral" variant="ghost">{{ chinese ? '双语阅读' : 'Bilingual' }}</UButton>
          </div>
        </div>
      </article>
    </div>
    <p v-if="!filtered.length" class="text-muted py-8">{{ chinese ? '没有找到匹配的书。' : 'No matching books.' }}</p>
  </div>
</template>
