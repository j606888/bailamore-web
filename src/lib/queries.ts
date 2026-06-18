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

// ---- 後台用（含未發佈）----

export function getAllTeachers() {
  return prisma.teacher.findMany({ orderBy: { sortOrder: 'asc' } })
}

export function getTeacherById(id: string) {
  return prisma.teacher.findUnique({ where: { id } })
}
