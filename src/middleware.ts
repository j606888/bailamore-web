import NextAuth from 'next-auth'
import { authConfig } from '@/auth.config'

// 用 edge-safe 的 authConfig 建立 middleware（不含 Prisma/bcrypt）
export const { auth: middleware } = NextAuth(authConfig)

export const config = {
  // 只攔 /admin 區段；其餘前台與靜態資源不經過 middleware
  matcher: ['/admin/:path*'],
}
