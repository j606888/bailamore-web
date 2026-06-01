type CourseTag = {
  name: string
  colorScheme: 'sky' | 'orange'
}

type PricingOption = {
  name: string
  price: number
}

export type PricingTier = {
  title: string
  subtitle: string
  applicableCourses: CourseTag[]
  options: PricingOption[]
  note: string
}

export const PRICING_TIERS: PricingTier[] = [
  {
    title: 'Lv1 課程',
    subtitle: '適合初學者的基礎課程',
    applicableCourses: [
      { name: 'Bachata Lv1', colorScheme: 'sky' },
      { name: 'Salsa Lv1', colorScheme: 'sky' },
    ],
    options: [
      { name: '單堂體驗', price: 300 },
      { name: '6堂課程', price: 1700 },
    ],
    note: '*可插班，沒使用完畢可用於下一期',
  },
  {
    title: 'Lv2, 進階課程',
    subtitle: '進階技巧與舞步',
    applicableCourses: [
      { name: 'Bachata 進階', colorScheme: 'orange' },
      { name: 'Bachata Lv2', colorScheme: 'orange' },
    ],
    options: [
      { name: '單堂體驗', price: 350 },
      { name: '6堂課程', price: 2000 },
    ],
    note: '*可插班，沒使用完畢可用於下一期',
  },
]
