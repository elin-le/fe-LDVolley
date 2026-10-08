import { useDispatch, useSelector } from 'react-redux'
import { setLang } from '../store/langSlice'

export default function LangSwitch() {
  const dispatch = useDispatch()
  const current = useSelector((s) => s.lang.current)
  return (
    <div role="group" aria-label="Language" className="flex overflow-hidden rounded-full border border-navy-900/30 font-num text-lg">
      {['vi', 'en'].map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => dispatch(setLang(code))}
          aria-pressed={current === code}
          className={`px-3 py-0.5 uppercase transition-colors ${current === code ? 'bg-navy-900 text-chalk' : 'text-navy-900/70 hover:text-navy-900'}`}
        >
          {code}
        </button>
      ))}
    </div>
  )
}
