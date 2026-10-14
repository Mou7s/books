export function useReaderSettings() {
  const theme = useState('reader-theme', () => 'white')
  const fontSize = useState('reader-font-size', () => 20)
  const savedTheme = useCookie<string>('reader-theme', { maxAge:31536000 })
  const savedFont = useCookie<number>('reader-font-size', { maxAge:31536000 })
  onMounted(() => {
    if (['white','night'].includes(savedTheme.value)) theme.value = savedTheme.value
    if (Number(savedFont.value) >= 16 && Number(savedFont.value) <= 28) fontSize.value = Number(savedFont.value)
  })
  function setTheme(value: string) { theme.value = value; savedTheme.value = value }
  function changeFont(step: number) { fontSize.value = Math.max(16,Math.min(28,fontSize.value+step)); savedFont.value = fontSize.value }
  return { theme, fontSize, setTheme, changeFont }
}
