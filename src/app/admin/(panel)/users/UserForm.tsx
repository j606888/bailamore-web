'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Field, inputClass, FormError } from '@/components/admin/form'
import { saveUser, type UserFormState } from './actions'

type UserInput = {
  id: string
  name: string
  email: string
}

export default function UserForm({ user }: { user?: UserInput }) {
  const isEdit = !!user
  const [state, formAction, pending] = useActionState<UserFormState, FormData>(
    saveUser,
    undefined,
  )

  return (
    <form action={formAction} className="max-w-2xl flex flex-col gap-5">
      {user && <input type="hidden" name="id" value={user.id} />}

      <Field label="名稱" htmlFor="name" required>
        <input
          id="name"
          name="name"
          defaultValue={user?.name}
          required
          className={inputClass}
          placeholder="Sean"
        />
      </Field>

      <Field label="Email" htmlFor="email" required hint="作為登入帳號，不可與其他帳號重複">
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={user?.email}
          required
          className={inputClass}
          placeholder="someone@example.com"
        />
      </Field>

      <Field
        label={isEdit ? '新密碼' : '密碼'}
        htmlFor="password"
        required={!isEdit}
        hint={isEdit ? '至少 8 個字元。若不修改密碼請留空。' : '至少 8 個字元'}
      >
        <input
          id="password"
          name="password"
          type="password"
          required={!isEdit}
          autoComplete="new-password"
          className={inputClass}
          placeholder={isEdit ? '留空＝不變更' : '••••••••'}
        />
      </Field>

      <FormError message={state?.error} />

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? '儲存中…' : '儲存'}
        </Button>
        <Link href="/admin/users" className="text-sm text-gray-500 hover:text-gray-700">
          取消
        </Link>
      </div>
    </form>
  )
}
