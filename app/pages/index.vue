<script setup lang="ts">
definePageMeta({ alias: ['/zh-cn','/en'] })
const route = useRoute()
const { data: page } = await useAsyncData('bookshelf',()=>queryCollection('landing').path('/').first())
onMounted(()=> {if(route.path!=='/') navigateTo('/',{replace:true})})
useHead({title:'书架'})
</script>
<template><ContentRenderer v-if="page" :value="page" /></template>
