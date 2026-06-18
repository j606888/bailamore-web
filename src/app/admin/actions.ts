'use server'

import { AuthError } from 'next-auth'
import { signIn, signOut } from '@/auth'

export type LoginState = { error?: string } | undefined

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/admin',
    })
  } catch (error) {
    // signIn 成功時會丟出 redirect，需讓它繼續往上拋
    if (error instanceof AuthError) {
      return { error: '帳號或密碼錯誤' }
    }
    throw error
  }
}

export async function logout() {
  await signOut({ redirectTo: '/admin/login' })
}
