// 課表日期工具。
// 業主在台灣，課表以「日曆日」為準，因此以 Asia/Taipei 時區格式化，
// 並把使用者輸入的日期存成當日 UTC 正午（在各時區渲染都落在同一個日曆日，最穩健）。

const TZ = 'Asia/Taipei'

// "2026-06-07" → Date（當日 UTC 正午）
export function parseDateInput(s: string): Date {
  return new Date(`${s}T12:00:00.000Z`)
}

// Date → "2026-06-07"（Asia/Taipei 視角）
export function toDateInputValue(d: Date): string {
  // en-CA 產生 YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

const WEEKDAY = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

// Date → "2026/06/07（星期日）"（Asia/Taipei 視角）
export function formatDateDisplay(d: Date): string {
  const ymd = toDateInputValue(d).replace(/-/g, '/')
  const weekday = new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short' }).format(d)
  const map: Record<string, string> = {
    Sun: WEEKDAY[0], Mon: WEEKDAY[1], Tue: WEEKDAY[2], Wed: WEEKDAY[3],
    Thu: WEEKDAY[4], Fri: WEEKDAY[5], Sat: WEEKDAY[6],
  }
  return `${ymd}（${map[weekday] ?? ''}）`
}
