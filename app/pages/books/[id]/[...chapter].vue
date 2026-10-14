<script setup lang="ts">
import books from '~/data/catalog.json'
const route = useRoute()
const book = books.find(item=>item.id===route.params.id)
const key = Array.isArray(route.params.chapter) ? route.params.chapter.join('/') : String(route.params.chapter)
const index = book?.chapters.findIndex(item=>item.key===key) ?? -1
if (!book || index<0) throw createError({statusCode:404,statusMessage:'Chapter not found'})
const loaders = import.meta.glob('../../../data/chapters/**/*.json')
const loader = loaders[`../../../data/chapters/${book.id}/${key.replaceAll('/','--')}.json`]
if (!loader) throw createError({statusCode:404,statusMessage:'Chapter not found'})
const { data: chapter } = await useAsyncData(route.path, async()=> (await loader() as {default:{title:string,html:string}}).default)
const settings = ref(false)
const { theme, fontSize, setTheme, changeFont } = useReaderSettings()
const chapterIndex = index
const readingPath = book.chapters[index]!.path
let saveProgress: (() => void) | undefined
onBeforeUnmount(() => { if(saveProgress) { saveProgress(); window.removeEventListener('scroll',saveProgress) } })
onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(`books-progress:${book.id}`) || 'null')
    if(saved?.path===readingPath && Number(saved.scroll)>0) window.scrollTo(0,Number(saved.scroll))
  } catch {}
  const save=()=> { try { localStorage.setItem(`books-progress:${book.id}`,JSON.stringify({path:readingPath,scroll:window.scrollY})) } catch {} }
  saveProgress=save
  save()
  window.addEventListener('scroll',save,{passive:true})
})
useHead({title:`${book.chapters[index]!.title} · ${book.title}`})
</script>
<template>
  <div v-if="book && chapter" class="reading-view">
    <header class="reader-toolbar"><NuxtLink :to="`/books/${book.id}`" aria-label="返回目录">← 目录</NuxtLink><span class="toolbar-title">{{ book.title }}</span><button type="button" class="settings-toggle" :aria-expanded="settings" @click="settings=!settings" aria-label="阅读设置">Aa</button></header>
    <section v-if="settings" class="reader-settings" aria-label="阅读设置"><div><button @click="changeFont(-2)" :disabled="fontSize<=16" aria-label="缩小字号">A−</button><span>{{ fontSize }}</span><button @click="changeFont(2)" :disabled="fontSize>=28" aria-label="放大字号">A＋</button></div><div class="theme-options"><button v-for="item in [{id:'white',name:'白色'},{id:'paper',name:'纸张'},{id:'night',name:'夜间'}]" :key="item.id" :aria-pressed="theme===item.id" @click="setTheme(item.id)">{{ item.name }}</button></div></section>
    <main class="reading-paper" :style="{fontSize:fontSize+'px'}"><p class="reading-chapter-label">{{ chapter.title }}</p><article class="original-text" lang="en" v-html="chapter.html" /><nav class="chapter-nav" aria-label="章节导航"><NuxtLink v-if="chapterIndex>0" :to="book.chapters[chapterIndex-1]!.path">← 上一节</NuxtLink><span>{{ chapterIndex+1 }} / {{ book.chapters.length }}</span><NuxtLink v-if="chapterIndex<book.chapters.length-1" :to="book.chapters[chapterIndex+1]!.path">下一节 →</NuxtLink></nav></main>
  </div>
</template>
