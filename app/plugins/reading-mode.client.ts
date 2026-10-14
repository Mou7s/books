export default defineNuxtPlugin((app) => {
  const route = useRoute()
  const { preference, setMode } = useReadingMode()
  // Apply after hydration so remembered settings do not change prerendered markup.
  app.hook('app:mounted', () => {
    setMode(preference.value === 'bilingual' ? 'bilingual' : 'single')
    watch(() => route.query.view, (view) => {
      if (view === 'single' || view === 'bilingual') setMode(view)
    }, { immediate: true })
  })
})
