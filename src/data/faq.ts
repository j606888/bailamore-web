// 常見問題的單一資料來源（原本存於 DB，已改為靜態檔維護）。
// answer 為 Markdown，可含連結；欄位對齊原 Prisma Faq model。

export interface Faq {
  id: string; // React key 用的穩定字串
  question: string;
  answer: string; // Markdown
  sortOrder: number;
  published: boolean;
}

export const FAQS: Faq[] = [
  {
    id: 'no-experience',
    question: '沒有舞蹈經驗可以嗎？',
    answer: '當然可以！不管什麼年齡或是有無經驗都非常適合來學習 Bachata & Salsa。',
    sortOrder: 1,
    published: true,
  },
  {
    id: 'no-partner',
    question: '沒有舞伴可以嗎？',
    answer: '可以的！上課中舞伴是會不斷輪替的不用擔心沒有人可以練習。',
    sortOrder: 2,
    published: true,
  },
  {
    id: 'how-long-to-learn',
    question: '大概多久能學會？',
    answer:
      '一般來說，上了幾堂 LV1 課程後就能掌握基本步伐，跟著音樂跳出基本感覺。\n\n社交舞沒有真正的「學完」，每次跳都會有新的體會。重要的是享受過程，很多學員從第一堂課就開始享受跳舞的樂趣！',
    sortOrder: 6,
    published: true,
  },
  {
    id: 'course-selection',
    question: '關於課程選擇',
    answer:
      '如果沒有上過類似的課程的新手會建議從 LV1 的課程開始，等到覺得熟練之後再踏入 LV2 的大門。\n\n瞭解更多請參考[課程資訊](/courses)',
    sortOrder: 3,
    published: true,
  },
  {
    id: 'course-fee',
    question: '關於課程費用',
    answer:
      '我們採用課卡的方式，每次購買一張課卡可以使用 6 次。\n\n如果要單次上課的話也是可以的，詳情請參考[課程資訊](/courses?tab=pricing)',
    sortOrder: 4,
    published: true,
  },
  
];

export function getPublishedFaqs(): Faq[] {
  return FAQS.filter((f) => f.published).sort((a, b) => a.sortOrder - b.sortOrder);
}
