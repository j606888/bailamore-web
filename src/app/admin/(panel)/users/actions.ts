'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export type UserFormState = { error?: string } | undefined

const baseSchema = z.object({
  name: z.string().trim().min(1, '請填寫名稱'),
  email: z.string().trim().toLowerCase().email('請填寫有效的 Email'),
})

export async function saveUser(
  _prevState: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  const id = (formData.get('id') as string) || null

  const parsed = baseSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? '欄位格式有誤' }
  }

  const password = (formData.get('password') as string) ?? ''
  // 新增一定要密碼；編輯時留空代表不改密碼
  if (!id && password.length < 8) {
    return { error: '密碼至少需 8 個字元' }
  }
  if (id && password.length > 0 && password.length < 8) {
    return { error: '密碼至少需 8 個字元（若不修改密碼請留空）' }
  }

  try {
    if (id) {
      const data: Prisma.UserUpdateInput = {
        name: parsed.data.name,
        email: parsed.data.email,
      }
      if (password.length > 0) {
        data.passwordHash = await bcrypt.hash(password, 10)
      }
      await prisma.user.update({ where: { id }, data })
    } else {
      await prisma.user.create({
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          passwordHash: await bcrypt.hash(password, 10),
        },
      })
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return { error: '此 Email 已被使用' }
    }
    console.error('saveUser failed', e)
    return { error: '儲存失敗，請稍後再試' }
  }

  revalidatePath('/admin/users')
  redirect('/admin/users')
}

export async function deleteUser(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return

  const session = await auth()
  const target = await prisma.user.findUnique({ where: { id } })
  if (!target) return

  // 不能刪除自己（也確保至少留下目前登入的帳號）
  if (session?.user?.email && target.email === session.user.email) return

  // 保險：不可刪到一個都不剩
  const count = await prisma.user.count()
  if (count <= 1) return

  await prisma.user.delete({ where: { id } })
  revalidatePath('/admin/users')
}
