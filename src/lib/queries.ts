import { prisma } from '@/lib/prisma'

// 前台/後台共用的資料讀取層。
// 注意：回傳含 Date 的物件若要傳進 client component，請先在頁面序列化（toISOString）。

// ---- 課程表 ----

export function getSchedulePeriods() {
  return prisma.schedulePeriod.findMany({
    orderBy: { date: 'asc' },
    include: { courses: { orderBy: { sortOrder: 'asc' } } },
  })
}

export function getSchedulePeriod(id: string) {
  return prisma.schedulePeriod.findUnique({
    where: { id },
    include: { courses: { orderBy: { sortOrder: 'asc' } } },
  })
}

// ---- 師資 ----

export function getPublishedTeachers() {
  return prisma.teacher.findMany({
    where: { published: true },
    orderBy: { sortOrder: 'asc' },
  })
}

export function getPublishedTeacherSlugs() {
  return prisma.teacher.findMany({
    where: { published: true },
    select: { slug: true },
  })
}

export function getTeacherBySlug(slug: string) {
  return prisma.teacher.findUnique({ where: { slug } })
}

// ---- 學生推薦 ----

export function getPublishedTestimonials() {
  return prisma.testimonial.findMany({
    where: { published: true },
    orderBy: { sortOrder: 'asc' },
  })
}

// ---- 價格 ----

export function getPublishedPricingTiers() {
  return prisma.pricingTier.findMany({
    where: { published: true },
    orderBy: { sortOrder: 'asc' },
  })
}

// ---- 後台用（含未發佈）----

export function getAllTeachers() {
  return prisma.teacher.findMany({ orderBy: { sortOrder: 'asc' } })
}

export function getTeacherById(id: string) {
  return prisma.teacher.findUnique({ where: { id } })
}

export function getAllTestimonials() {
  return prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' } })
}

export function getTestimonialById(id: string) {
  return prisma.testimonial.findUnique({ where: { id } })
}

export function getAllPricingTiers() {
  return prisma.pricingTier.findMany({ orderBy: { sortOrder: 'asc' } })
}

export function getPricingTierById(id: string) {
  return prisma.pricingTier.findUnique({ where: { id } })
}

// ---- FAQ ----

export function getPublishedFaqs() {
  return prisma.faq.findMany({
    where: { published: true },
    orderBy: { sortOrder: 'asc' },
  })
}

export function getAllFaqs() {
  return prisma.faq.findMany({ orderBy: { sortOrder: 'asc' } })
}

export function getFaqById(id: string) {
  return prisma.faq.findUnique({ where: { id } })
}

// ---- 全站設定（單例 key-value）----

export async function getSiteSetting(key: string) {
  const row = await prisma.siteSetting.findUnique({ where: { key } })
  return row?.value ?? null
}

export function getHeroVideoUrl() {
  return getSiteSetting('hero_video_url')
}
