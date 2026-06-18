import type { NextAuthConfig } from 'next-auth'

// Edge-safe 設定：不可 import Prisma / bcrypt（middleware 在 edge runtime 執行）。
// 真正的帳密驗證（authorize）放在 src/auth.ts。
export const authConfig = {
  // 自架 / 非 Vercel 環境需信任 host（Vercel 上會自動處理）
  trustHost: true,
  pages: {
    signIn: '/admin/login',
  },
  session: { strategy: 'jwt' },
  providers: [], // 在 src/auth.ts 補上 Credentials provider
  callbacks: {
    // 保護 /admin/*（登入頁除外）
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const { pathname } = nextUrl
      const isOnAdmin = pathname.startsWith('/admin')
      const isOnLogin = pathname === '/admin/login'

      if (isOnLogin) {
        // 已登入就不要再停在登入頁
        if (isLoggedIn) return Response.redirect(new URL('/admin', nextUrl))
        return true
      }
      if (isOnAdmin) return isLoggedIn // 未登入 → 自動導向 signIn 頁
      return true
    },
  },
} satisfies NextAuthConfig
