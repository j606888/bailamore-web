import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// ---- 價格初始資料（原 src/data/pricing.ts；Phase 2 後改由後台維護）----
const PRICING_TIERS = [
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

// ---- 課程表初始資料（原 src/data/schedule.ts；Phase 1 後改由後台維護）----
const COURSE_PERIODS = [
  '2026/06/07',
  '2026/06/14',
  '2026/06/28',
  '2026/07/05',
  '2026/07/19',
  '2026/07/26',
]

const COURSES: { time: string; name: string; card?: string }[] = [
  { time: '14:00 - 15:00', name: 'Bachata 進階', card: '進階課卡' },
  { time: '15:00 - 16:00', name: 'Bachata Lv1', card: '初階課卡' },
  { time: '16:00 - 17:00', name: 'Bachata Lv2', card: '進階課卡' },
  { time: '17:00 - 18:00', name: 'Salsa Lv1', card: '初階課卡' },
]

// ---- 師資初始資料（原 src/data/teachers.ts；Phase 1 後改由後台維護）----
const TEACHERS: Record<
  string,
  {
    name: string
    title?: string
    image: string
    skills: string[]
    instagram?: string
    courses: string[]
    description: string[]
    videos: string[]
  }
> = {
  sean: {
    name: 'Sean',
    title: "Baila'more創辦人",
    image: '/teachers/Sean.jpg',
    skills: ['Bachata', 'Salsa', 'Zouk'],
    instagram: 'baila_moredancestudio',
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
  },
}

// 將 "2026/06/07" 轉成 Date（本地時區當天）
const parseDate = (s: string) => {
  const [y, m, d] = s.split('/').map(Number)
  return new Date(y, m - 1, d)
}

// ---- 學生推薦（原 src/components/home/Testimonials.tsx）----
const TESTIMONIALS = [
  {
    name: 'Dora',
    title: '核心沒力的跳舞小白',
    imageUrl: '/testimonials/dora.png',
    danceStyle: 'Bachata',
    content: [
      '前年第一次接觸 Bachata 時感受到跳舞時的快樂氛圍，開始學習以後才體驗到「會跳舞」的快樂！',
      '從不太敢跳，到現在可以自在地在舞會裡接受邀舞，最大的關鍵就是——老師的教學真的很給力！課程安排循序漸進，老師會調整步調一起學習，面對學生的問題也有問必答。',
    ],
  },
  {
    name: '丁丁',
    title: '莫名入坑的工程師',
    imageUrl: '/testimonials/ding.png',
    danceStyle: 'Bachata & Salsa',
    content: [
      '因為我哥的介紹來試試看這個酷東西，結果發現意外的好玩。',
      '從剛開始只能站在舞池角落看大家跳到現在可以整場舞會無中斷的享受真的變有成就感的！',
      '希望之後有更多朋友可以一起來參加~',
    ],
  },
  {
    name: 'Nora',
    title: '和男友一起來上課的女友',
    imageUrl: '/testimonials/nora.jpg',
    danceStyle: 'Bachata & Salsa',
    content: [
      '原本抱持陪男友上課的心態，結果發現在party上跟很多leader跳舞超好玩，0基礎也可以很開心。',
      '很幸運可以在台南找到長期上課進修的教室，老師們都很細心還很幽默^^推推',
    ],
  },
  {
    name: 'Emma',
    title: '更擅長跳夜店舞的女子',
    imageUrl: '/testimonials/emma.png',
    danceStyle: 'Bachata & Salsa',
    content: [
      '在一次的派對上不小心入坑Bachata、Salsa後，我的世界從此變得好不一樣，是跳舞帶我找回了我自己，讓我想起了自己小時候是多麼喜歡跳舞。',
      '在每一次的卡關都讓我更認識自己的身體，每一次突破瓶頸後發現自己真的做得到的成就感也讓我好滿足，可以活在自己的熱愛裡是多麼美妙的一件事，也因為跳舞讓我認識了一群很棒的朋友們~真的超幸福的~',
    ],
  },
]

// ---- FAQ（原 src/components/home/FAQ.tsx，JSX 連結 → Markdown）----
const LINE_URL = 'https://line.me/R/ti/p/@bailamore' // 對照 src/constants/links.ts，部署前請確認
const FAQS = [
  {
    question: '如何報名課程',
    answer:
      '加入 [Line 官方帳號](LINE)，直接私訊 Sean 即可。\n\n如果想要先體驗的話也可以直接在課程時間來到教室。',
  },
  {
    question: '沒有舞蹈經驗可以嗎？',
    answer: '當然可以！不管什麼年齡或是有無經驗都非常適合來學習 Bachata & Salsa。',
  },
  {
    question: '沒有舞伴可以嗎？',
    answer: '可以的！上課中舞伴是會不斷輪替的不用擔心沒有人可以練習。',
  },
  {
    question: '關於課程選擇',
    answer:
      '如果沒有上過類似的課程的新手會建議從 LV1 的課程開始，等到覺得熟練之後再踏入 LV2 的大門。\n\n瞭解更多請參考[課程資訊](/courses)',
  },
  {
    question: '關於課程費用',
    answer:
      '我們採用課卡的方式，每次購買一張課卡可以使用 6 次。\n\n如果要單次上課的話也是可以的，詳情請參考[課程資訊](/courses?tab=pricing)',
  },
  {
    question: '上課需要穿什麼？',
    answer:
      '穿著舒適、方便活動的服裝即可，沒有嚴格限制。\n\n鞋子建議穿有跟的舞鞋或是底部較平滑的室內鞋，避免厚底球鞋，以免影響腳步練習。如果沒有舞鞋，第一次來穿一般平底鞋也完全沒問題。',
  },
  {
    question: '大概多久能學會？',
    answer:
      '一般來說，上了幾堂 LV1 課程後就能掌握基本步伐，跟著音樂跳出基本感覺。\n\n社交舞沒有真正的「學完」，每次跳都會有新的體會。重要的是享受過程，很多學員從第一堂課就開始享受跳舞的樂趣！',
  },
  {
    question: '課程地點在哪裡？如何前往？',
    answer:
      '上課地點在台南市，詳細地址與地圖請參考[地點頁面](/location)。\n\n有任何交通上的問題歡迎直接透過 LINE 詢問。',
  },
]

// 將 answer 內的 (LINE) 佔位替換成實際網址
const resolveLinks = (s: string) => s.replace('(LINE)', `(${LINE_URL})`)

const HERO_VIDEO_URL =
  'https://ikhr8fc3iglih52q.public.blob.vercel-storage.com/Bailamore%20Studio%20-%20Demo%20Video.mp4'

async function main() {
  console.log('🌱 開始 seed…')

  // 1) 管理員帳號
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@bailamore.local'
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'changeme123'
  const passwordHash = await bcrypt.hash(password, 10)
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: 'Admin', passwordHash },
  })
  console.log(`  ✓ 管理員帳號：${email}（密碼：${password}）`)

  // 2) 課程表：每個日期先塞同一份 COURSES
  await prisma.courseSlot.deleteMany()
  await prisma.schedulePeriod.deleteMany()
  for (const raw of COURSE_PERIODS) {
    await prisma.schedulePeriod.create({
      data: {
        date: parseDate(raw),
        courses: {
          create: COURSES.map((c, i) => {
            const [startTime, endTime] = c.time.split(' - ')
            return {
              startTime,
              endTime,
              name: c.name,
              cardType: c.card ?? null,
              sortOrder: i,
            }
          }),
        },
      },
    })
  }
  console.log(`  ✓ 課程表：${COURSE_PERIODS.length} 個日期`)

  // 3) 師資
  await prisma.teacher.deleteMany()
  let teacherOrder = 0
  for (const [slug, t] of Object.entries(TEACHERS)) {
    await prisma.teacher.create({
      data: {
        slug,
        name: t.name,
        title: t.title ?? null,
        imageUrl: t.image,
        instagram: t.instagram ?? null,
        skills: t.skills,
        courses: t.courses,
        description: t.description,
        videos: t.videos,
        sortOrder: teacherOrder++,
      },
    })
  }
  console.log(`  ✓ 師資：${Object.keys(TEACHERS).length} 位`)

  // 4) 學生推薦
  await prisma.testimonial.deleteMany()
  await prisma.testimonial.createMany({
    data: TESTIMONIALS.map((t, i) => ({ ...t, sortOrder: i })),
  })
  console.log(`  ✓ 學生推薦：${TESTIMONIALS.length} 則`)

  // 5) 價格
  await prisma.pricingTier.deleteMany()
  await prisma.pricingTier.createMany({
    data: PRICING_TIERS.map((p, i) => ({
      title: p.title,
      subtitle: p.subtitle,
      note: p.note,
      applicableCourses: p.applicableCourses,
      options: p.options,
      sortOrder: i,
      published: true,
    })),
  })
  console.log(`  ✓ 價格：${PRICING_TIERS.length} 個方案`)

  // 6) FAQ
  await prisma.faq.deleteMany()
  await prisma.faq.createMany({
    data: FAQS.map((f, i) => ({
      question: f.question,
      answer: resolveLinks(f.answer),
      sortOrder: i,
    })),
  })
  console.log(`  ✓ FAQ：${FAQS.length} 則`)

  // 7) 全站設定
  await prisma.siteSetting.upsert({
    where: { key: 'hero_video_url' },
    update: { value: HERO_VIDEO_URL },
    create: { key: 'hero_video_url', value: HERO_VIDEO_URL },
  })
  console.log('  ✓ 首頁影片網址')

  console.log('✅ seed 完成')
}

main()
  .catch((e) => {
    console.error('❌ seed 失敗', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
