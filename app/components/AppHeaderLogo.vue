<script setup lang="ts">
const { locale } = useDocusI18n()
</script>
<template><span class="reader-title"><span class="reader-mark" aria-hidden="true" />{{ locale === 'zh-cn' ? '书架' : 'Books' }}</span></template>
