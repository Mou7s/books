<script setup lang="ts">
import pages from '~/data/bilingual.json'
type Block = { separator?: boolean; en?: string; zh?: string }
const route = useRoute()
const { locale } = useDocusI18n()
const preference = useCookie<string>('books-reading-mode', { default: () => 'single', maxAge: 31536000, sameSite: 'lax' })
const mounted = ref(false)
onMounted(() => { mounted.value = true })
const blocks = computed(() => (pages as Record<string, Block[]>)[route.path.replace(/^\/(en|zh-cn)/, '').replace(/\/$/, '')])
const bilingual = computed(() => mounted.value && !!blocks.value && (route.query.view === 'bilingual' || (route.query.view !== 'single' && preference.value === 'bilingual')))
</script>
<template>
  <div class="reader-body">
    <div v-if="bilingual" class="bilingual-text">
      <template v-for="(block, index) in blocks" :key="index">
        <hr v-if="block.separator">
        <div v-else class="bilingual-pair">
          <div class="bilingual-en" lang="en" v-html="block.en" />
          <div class="bilingual-zh" lang="zh-CN" v-html="block.zh" />
        </div>
      </template>
    </div>
    <template v-else><slot /></template>
    <p v-if="!blocks && mounted && preference === 'bilingual'" class="translation-unavailable">{{ locale === 'zh-cn' ? '本章暂无中文译文，当前显示英文原文。' : 'Chinese translation is not available for this chapter yet.' }}</p>
  </div>
</template>
