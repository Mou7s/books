export type ReadingMode = 'single' | 'bilingual'

export function useReadingMode() {
  const mode = useState<ReadingMode>('books-reading-mode', () => 'single')
  const preference = useCookie<ReadingMode>('books-reading-mode', { default: () => 'single', maxAge: 31536000, sameSite: 'lax' })
  function setMode(value: ReadingMode) {
    mode.value = value
    preference.value = value
  }
  return { mode, preference, setMode }
}
