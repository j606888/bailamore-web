'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { ChevronUp, ChevronDown, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, inputClass, FormError } from '@/components/admin/form'
import { savePeriod, type ScheduleFormState } from './actions'

type Row = {
  startTime: string
  endTime: string
  name: string
  cardType: string
}

const CARD_OPTIONS = ['', '初階課卡', '進階課卡']

export default function PeriodEditor({
  id,
  date,
  slots,
}: {
  id: string
  date: string
  slots: Row[]
}) {
  const [state, formAction, pending] = useActionState<ScheduleFormState, FormData>(
    savePeriod,
    undefined,
  )
  const [rows, setRows] = useState<Row[]>(slots)

  const update = (i: number, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))
  const remove = (i: number) => setRows((rs) => rs.filter((_, idx) => idx !== i))
  const add = () =>
    setRows((rs) => [...rs, { startTime: '', endTime: '', name: '', cardType: '' }])
  const move = (i: number, dir: -1 | 1) =>
    setRows((rs) => {
      const j = i + dir
      if (j < 0 || j >= rs.length) return rs
      const copy = [...rs]
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
      return copy
    })

  return (
    <form action={formAction} className="max-w-3xl flex flex-col gap-6">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="slots" value={JSON.stringify(rows)} />

      <Field label="上課日期" htmlFor="date" required>
        <input id="date" name="date" type="date" defaultValue={date} required className={`${inputClass} max-w-[200px]`} />
      </Field>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">當日課程</p>
          <Button type="button" variant="outline" size="sm" onClick={add}>
            <Plus size={14} />
            新增一堂
          </Button>
        </div>

        {rows.length === 0 ? (
          <p className="text-sm text-gray-400 border border-dashed border-gray-300 rounded-lg px-4 py-6 text-center">
            尚無課程，點「新增一堂」開始。
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {/* 表頭（桌面） */}
            <div className="hidden md:grid grid-cols-[80px_80px_1fr_120px_auto] gap-2 px-1 text-xs text-gray-400">
              <span>開始</span>
              <span>結束</span>
              <span>課程名稱</span>
              <span>課卡</span>
              <span></span>
            </div>
            {rows.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-2 md:grid-cols-[80px_80px_1fr_120px_auto] gap-2 items-center bg-white border border-gray-200 rounded-lg p-2"
              >
                <input
                  type="time"
                  value={row.startTime}
                  onChange={(e) => update(i, { startTime: e.target.value })}
                  className={inputClass}
                  aria-label="開始時間"
                />
                <input
                  type="time"
                  value={row.endTime}
                  onChange={(e) => update(i, { endTime: e.target.value })}
                  className={inputClass}
                  aria-label="結束時間"
                />
                <input
                  type="text"
                  value={row.name}
                  onChange={(e) => update(i, { name: e.target.value })}
                  placeholder="Bachata Lv1"
                  className={`${inputClass} col-span-2 md:col-span-1`}
                  aria-label="課程名稱"
                />
                <select
                  value={row.cardType}
                  onChange={(e) => update(i, { cardType: e.target.value })}
                  className={inputClass}
                  aria-label="課卡類型"
                >
                  {CARD_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt === '' ? '無' : opt}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-0.5 justify-end col-span-2 md:col-span-1">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30" title="上移">
                    <ChevronUp size={16} />
                  </button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === rows.length - 1} className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30" title="下移">
                    <ChevronDown size={16} />
                  </button>
                  <button type="button" onClick={() => remove(i)} className="p-1.5 rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600" title="刪除">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FormError message={state?.error} />

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? '儲存中…' : '儲存'}
        </Button>
        <Link href="/admin/schedule" className="text-sm text-gray-500 hover:text-gray-700">
          取消
        </Link>
      </div>
    </form>
  )
}
