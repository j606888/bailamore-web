export type CourseData = {
  time: string
  name: string
  card?: string
}

export const COURSE_PERIODS = [
  '2026/06/07',
  '2026/06/14',
  '2026/06/28',
  '2026/07/05',
  '2026/07/19',
  '2026/07/26',
]

export const COURSES: CourseData[] = [
  { time: '14:00 - 15:00', name: 'Bachata 進階', card: '進階課卡' },
  { time: '15:00 - 16:00', name: 'Bachata Lv1', card: '初階課卡' },
  { time: '16:00 - 17:00', name: 'Bachata Lv2', card: '進階課卡' },
  { time: '17:00 - 18:00', name: 'Salsa Lv1', card: '初階課卡' },
]
