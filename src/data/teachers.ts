// 老師資料的單一資料來源（原本存於 DB，已改為靜態檔維護）。
// 新增/編輯老師只要改這個陣列；欄位對齊原 Prisma Teacher model。

export interface Teacher {
  slug: string; // 網址用，例如 /teachers/sean
  name: string;
  title?: string; // 職稱小字，例如 "Baila'more創辦人"
  imageUrl: string; // /public 下的路徑或外部 URL
  instagram?: string; // IG 帳號（不含 @）
  skills: string[]; // 專長標籤
  courses: string[]; // 授課項目
  description: string[]; // 多段簡介
  videos: string[]; // YouTube embed 連結，或 Vercel Blob 影片檔
  sortOrder: number; // 列表排序（小的在前，第一位為首頁大卡）
  published: boolean;
}

export const TEACHERS: Teacher[] = [
  {
    slug: 'sean',
    name: 'Sean',
    title: "Baila'more創辦人",
    imageUrl: '/teachers/Sean.jpg',
    instagram: 'baila_moredancestudio',
    skills: ['Bachata', 'Salsa', 'Zouk'],
    courses: ['Bachata Lv1', 'Bachata Lv2', 'Bachata 進階'],
    description: [
      'Sean 擁有二年的拉丁舞教學與表演經驗，專精於 Salsa 與 Bachata，風格融合熱情、音樂性與舞台魅力。曾多次參與國內外拉丁舞活動與工作坊，不僅擁有紮實的技術基礎，更擅長引導學員掌握節奏與身體表達。',
      "他創辦 Baila'more 拉丁社交舞學校，致力於推廣「愛跳舞、多跳舞」的理念，讓每位舞者在歡樂中找到自信與自由。Sean 教學風格親切細膩，擅長拆解動作，激發學員的學習熱情與音樂感，無論是初學者或進階者都能有所收穫。",
      '舞蹈對 Sean 而言不只是技藝，更是連結人與人之間的橋樑，歡迎一起進入這個充滿熱情與愛的舞蹈世界！',
    ],
    videos: [
      'https://www.youtube.com/embed/TdRV1NkV4Pg?si=MYwpQG-1ZlcPu1QD',
      'https://www.youtube.com/embed/AE5NriBseoY?si=5u75-CtAGmvwPtVn',
    ],
    sortOrder: 0,
    published: true,
  },
  // ⬇️ 以下三位的完整資料原本在 DB、目前已遺失；僅保留可還原的 name/圖片/課程。
  //    bio（description）、skills、instagram、videos 為佔位，請之後補上。
  {
    slug: 'dingding',
    name: '丁丁',
    imageUrl: '/teachers/dingding.jpg',
    skills: [],
    courses: ['Bachata Lv1'],
    description: ['（老師簡介即將更新）'], // TODO: 補上丁丁的簡介
    videos: [],
    sortOrder: 1,
    published: true,
  },
  {
    slug: 'charlene',
    name: 'Charlene',
    imageUrl: '/teachers/Charlene.jpg',
    skills: [],
    courses: ['Bachata Lv1'],
    description: ['（老師簡介即將更新）'], // TODO: 補上 Charlene 的簡介
    videos: [],
    sortOrder: 2,
    published: true,
  },
  {
    slug: 'nini',
    name: 'Nini',
    imageUrl: '/teachers/Nini.png',
    skills: [],
    courses: ['單人 Salsa'],
    description: ['（老師簡介即將更新）'], // TODO: 補上 Nini 的簡介
    videos: [],
    sortOrder: 3,
    published: true,
  },
];

// 以下 helper 對齊原 src/lib/queries.ts 的同名函式，讓頁面改動最小。

export function getPublishedTeachers(): Teacher[] {
  return TEACHERS.filter((t) => t.published).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getPublishedTeacherSlugs(): { slug: string }[] {
  return getPublishedTeachers().map((t) => ({ slug: t.slug }));
}

export function getTeacherBySlug(slug: string): Teacher | undefined {
  return TEACHERS.find((t) => t.slug === slug);
}
