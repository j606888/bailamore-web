'use client'

// ⚠️ 已停用：課表頁改用 src/components/courses/schedule/（寫死資料）。
// 本檔保留 SchedulePeriodView 型別與 DB 串接邏輯，供日後重新接回後台時參考。

import React, { useEffect, useMemo, useRef, useState } from 'react';

const WEEKDAY_FULL = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

export type CourseSlotView = {
  startTime: string // "14:00"
  endTime: string   // "15:00"
  name: string
  cardType: string | null
}

export type SchedulePeriodView = {
  id: string
  date: string // ISO string（由 server 序列化）
  courses: CourseSlotView[]
}

const isSalsa = (name: string) => name.toLowerCase().includes('salsa')

export default function Schedule({ periods }: { periods: SchedulePeriodView[] }) {
  const ref = useRef<HTMLDivElement>(null)

  const periodDates = useMemo(() =>
    periods.map(p => ({ ...p, dateObj: new Date(p.date) })),
    [periods]
  )

  const now = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const defaultIndex = useMemo(() => {
    if (periodDates.length === 0) return 0
    const i = periodDates.findIndex(({ dateObj }) => dateObj >= now)
    return i === -1 ? periodDates.length - 1 : i
  }, [periodDates, now])

  const [selected, setSelected] = useState(defaultIndex)

  // periods 變動時，重設選取索引避免越界
  useEffect(() => {
    setSelected(defaultIndex)
  }, [defaultIndex])

  useEffect(() => {
    const el = ref.current?.querySelector<HTMLElement>('[data-active="true"]')
    el?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [selected])

  if (periodDates.length === 0) {
    return (
      <div className='bg-gray-100 min-h-[60vh] flex items-center justify-center'>
        <p className='text-gray-400'>目前尚未公布課表，敬請期待。</p>
      </div>
    )
  }

  const activeDate = periodDates[Math.min(selected, periodDates.length - 1)]
  const isPast = activeDate.dateObj < now

  return (
    <div className='bg-gray-100 min-h-[60vh]'>
      <div className='max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8'>
        <div className='flex flex-col md:flex-row gap-4 md:gap-5 md:items-start'>

          {/* Date Selector */}
          <aside className='w-full md:w-48 flex-shrink-0'>
            <div className='bg-white rounded-2xl p-4 shadow-sm border border-gray-100'>
              <p className='text-[11px] font-bold text-teal-600 uppercase tracking-widest mb-3'>上課日期</p>
              <div
                ref={ref}
                className='flex md:flex-col gap-2 overflow-x-auto pb-1 md:pb-0 md:overflow-visible'
              >
                {periodDates.map(({ id, dateObj }, i) => {
                  const isActive = i === selected
                  const past = dateObj < now
                  return (
                    <button
                      key={id}
                      data-active={isActive}
                      onClick={() => setSelected(i)}
                      className={`flex-shrink-0 min-w-[68px] md:min-w-0 rounded-xl text-center md:text-left transition-all cursor-pointer
                        flex flex-col md:flex-row items-center gap-0.5 md:gap-3 px-3 py-2.5 md:w-full
                        ${isActive
                          ? 'bg-teal-600 text-white shadow-md'
                          : past
                          ? 'text-gray-300 hover:bg-gray-50'
                          : 'text-gray-700 hover:bg-teal-50 hover:text-teal-700'
                        }`}
                    >
                      <div className='md:text-left text-center'>
                        <p className={`text-[10px] font-semibold leading-none ${isActive ? 'text-teal-100' : 'text-gray-400'}`}>
                          {dateObj.getMonth() + 1}月
                        </p>
                        <p className='text-2xl font-bold leading-tight'>{dateObj.getDate()}</p>
                      </div>
                      <div className='md:text-left text-center'>
                        <p className={`text-xs ${isActive ? 'text-teal-100' : 'text-gray-400'}`}>
                          {WEEKDAY_FULL[dateObj.getDay()]}
                        </p>
                        {past && (
                          <p className={`text-[10px] ${isActive ? 'text-teal-200' : 'text-gray-300'}`}>已結束</p>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </aside>

          {/* Course Timeline */}
          <main className='flex-1 min-w-0 w-full'>
            <div className='bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100'>
              {/* Header */}
              <div className='flex items-start justify-between mb-5'>
                <div>
                  <p className='text-[11px] font-bold text-teal-600 uppercase tracking-widest'>每週日課表</p>
                  <p className='text-lg font-semibold text-gray-900 mt-1'>
                    {activeDate.dateObj.getMonth() + 1}月{activeDate.dateObj.getDate()}日
                    <span className='ml-2 text-sm font-normal text-gray-400'>
                      {WEEKDAY_FULL[activeDate.dateObj.getDay()]}
                    </span>
                  </p>
                </div>
                {isPast && (
                  <span className='text-xs bg-gray-100 text-gray-400 px-2.5 py-1 rounded-full mt-1 flex-shrink-0'>
                    已結束
                  </span>
                )}
              </div>

              {/* Timeline */}
              {activeDate.courses.length === 0 ? (
                <p className='text-sm text-gray-400 py-6 text-center'>本日尚無課程安排。</p>
              ) : (
                <div className='relative'>
                  <div className='absolute left-[6px] top-5 bottom-5 w-0.5 bg-gray-100 rounded-full' />
                  <div className='space-y-3'>
                    {activeDate.courses.map(({ startTime, endTime, name, cardType }, idx) => {
                      const salsa = isSalsa(name)
                      const isBeginner = cardType?.includes('初階')

                      return (
                        <div key={idx} className='relative flex gap-4 items-start'>
                          {/* Timeline dot */}
                          <div className={`w-3.5 h-3.5 rounded-full flex-shrink-0 mt-[15px] z-10 ring-2 ring-white
                            ${salsa ? 'bg-amber-400' : 'bg-teal-500'}`}
                          />

                          {/* Course card */}
                          <div className={`flex-1 rounded-xl border px-4 py-3.5 transition-colors
                            ${salsa
                              ? 'border-amber-100 bg-amber-50/50'
                              : 'border-teal-100 bg-teal-50/40'
                            }`}
                          >
                            <div className='flex items-start justify-between gap-3 flex-wrap'>
                              <div>
                                <p className='font-semibold text-gray-900 text-base'>{name}</p>
                                <p className='text-sm text-gray-500 mt-0.5'>
                                  {startTime}
                                  <span className='text-gray-300 mx-1.5'>—</span>
                                  {endTime}
                                </p>
                              </div>
                              {cardType && (
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0
                                  ${isBeginner
                                    ? 'bg-sky-100 text-sky-700'
                                    : 'bg-orange-100 text-orange-700'
                                  }`}
                                >
                                  {cardType}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </main>

        </div>
      </div>
    </div>
  )
}
