<script setup lang="ts">
const route = useRoute()
const path = route.path
const id = path.split('/books/')[1]?.split('/')[0]
function save() { try { if(id) localStorage.setItem(`books-progress:${id}`,JSON.stringify({path,scroll:window.scrollY})) } catch {} }
onMounted(()=> {
  try {
    const saved = JSON.parse(localStorage.getItem(`books-progress:${id}`)||'null')
    if(saved?.path===path && Number(saved.scroll)>0) window.scrollTo(0,Number(saved.scroll))
  } catch {}
  save()
  window.addEventListener('scroll',save,{passive:true})
})
onBeforeUnmount(()=> {save(); window.removeEventListener('scroll',save)})
</script>
<template><div class="reader-body"><slot /></div></template>
