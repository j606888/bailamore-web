'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, inputClass, FormError } from '@/components/admin/form'
import { savePricingTier, type PricingFormState } from './actions'

export type CourseTag = { name: string; colorScheme: 'sky' | 'orange' }
export type PricingOption = { name: string; price: number }

export type PricingTierInput = {
  id: string
  title: string
  subtitle: string
  note: string
  applicableCourses: CourseTag[]
  options: PricingOption[]
  published: boolean
}

export default function PricingForm({ tier }: { tier?: PricingTierInput }) {
  const [state, formAction, pending] = useActionState<PricingFormState, FormData>(
    savePricingTier,
    undefined,
  )

  const [courses, setCourses] = useState<CourseTag[]>(
    tier?.applicableCourses ?? [{ name: '', colorScheme: 'sky' }],
  )
  // 價格以字串管理，方便編輯空白；送出前由後端轉數字
  const [options, setOptions] = useState<{ name: string; price: string }[]>(
    tier?.options.map((o) => ({ name: o.name, price: String(o.price) })) ?? [
      { name: '', price: '' },
    ],
  )

  const updateCourse = (i: number, patch: Partial<CourseTag>) =>
    setCourses((prev) => prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c)))
  const removeCourse = (i: number) =>
    setCourses((prev) => prev.filter((_, idx) => idx !== i))
  const addCourse = () =>
    setCourses((prev) => [...prev, { name: '', colorScheme: 'sky' }])

  const updateOption = (i: number, patch: Partial<{ name: string; price: string }>) =>
    setOptions((prev) => prev.map((o, idx) => (idx === i ? { ...o, ...patch } : o)))
  const removeOption = (i: number) =>
    setOptions((prev) => prev.filter((_, idx) => idx !== i))
  const addOption = () => setOptions((prev) => [...prev, { name: '', price: '' }])

  // 提交用：過濾空白項
  const coursesJson = JSON.stringify(
    courses.filter((c) => c.name.trim()).map((c) => ({ name: c.name.trim(), colorScheme: c.colorScheme })),
  )
  const optionsJson = JSON.stringify(
    options
      .filter((o) => o.name.trim())
      .map((o) => ({ name: o.name.trim(), price: Number(o.price) || 0 })),
  )

  const selectClass = inputClass + ' max-w-[7rem]'

  return (
    <form action={formAction} className="max-w-2xl flex flex-col gap-5">
      {tier && <input type="hidden" name="id" value={tier.id} />}
      <input type="hidden" name="applicableCourses" value={coursesJson} />
      <input type="hidden" name="options" value={optionsJson} />

      <Field label="方案標題" htmlFor="title" required hint="例：Lv1 課程">
        <input id="title" name="title" defaultValue={tier?.title} required className={inputClass} />
      </Field>

      <Field label="方案副標" htmlFor="subtitle" required hint="例：適合初學者的基礎課程">
        <input id="subtitle" name="subtitle" defaultValue={tier?.subtitle} required className={inputClass} />
      </Field>

      {/* 適用課程標籤 */}
      <Field label="適用課程" hint="顯示為彩色標籤；藍色（sky）通常用於初階、橘色（orange）用於進階">
        <div className="flex flex-col gap-2">
          {courses.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={c.name}
                onChange={(e) => updateCourse(i, { name: e.target.value })}
                placeholder="課程名稱，例：Bachata Lv1"
                className={inputClass}
              />
              <select
                value={c.colorScheme}
                onChange={(e) => updateCourse(i, { colorScheme: e.target.value as 'sky' | 'orange' })}
                className={selectClass}
              >
                <option value="sky">藍色</option>
                <option value="orange">橘色</option>
              </select>
              <button
                type="button"
                onClick={() => removeCourse(i)}
                className="p-2 rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors flex-shrink-0"
                title="移除"
                aria-label="移除課程標籤"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" className="self-start" onClick={addCourse}>
            <Plus size={14} />
            新增課程標籤
          </Button>
        </div>
      </Field>

      {/* 方案 options */}
      <Field label="方案內容" required hint="每列一個方案：名稱 + 價格（數字）">
        <div className="flex flex-col gap-2">
          {options.map((o, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={o.name}
                onChange={(e) => updateOption(i, { name: e.target.value })}
                placeholder="名稱，例：單堂體驗"
                className={inputClass}
              />
              <div className="relative flex-shrink-0">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
                <input
                  type="number"
                  min={0}
                  value={o.price}
                  onChange={(e) => updateOption(i, { price: e.target.value })}
                  placeholder="300"
                  className={inputClass + ' pl-6 max-w-[8rem]'}
                />
              </div>
              <button
                type="button"
                onClick={() => removeOption(i)}
                className="p-2 rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors flex-shrink-0"
                title="移除"
                aria-label="移除方案"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" className="self-start" onClick={addOption}>
            <Plus size={14} />
            新增方案
          </Button>
        </div>
      </Field>

      <Field label="備註" htmlFor="note" required hint="顯示於卡片底部，例：*可插班，沒使用完畢可用於下一期">
        <input id="note" name="note" defaultValue={tier?.note} required className={inputClass} />
      </Field>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" name="published" defaultChecked={tier?.published ?? true} className="w-4 h-4 accent-teal-600" />
        發佈（顯示於前台）
      </label>

      <FormError message={state?.error} />

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? '儲存中…' : '儲存'}
        </Button>
        <Link href="/admin/pricing" className="text-sm text-gray-500 hover:text-gray-700">
          取消
        </Link>
      </div>
    </form>
  )
}
