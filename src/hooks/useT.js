import { useSelector } from 'react-redux'
import { translations } from '../i18n/translations'

export function useT() {
  const lang = useSelector((s) => s.lang.current)
  return { t: translations[lang], lang }
}
