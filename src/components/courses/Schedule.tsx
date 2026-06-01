'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { COURSE_PERIODS, COURSES } from '@/data/schedule';

const WEEKDAY_FULL = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

const parseDate = (s: string) => {
  const [y, m, d] = s.split('/').map(Number)
  return new Date(y, m - 1, d)
}

const isSalsa = (name: string) => name.toLowerCase().includes('salsa')

export default function Schedule() {
  const ref = useRef<HTMLDivElement>(null)

  const periodDates = useMemo(() =>
    COURSE_PERIODS.map(raw => ({ raw, date: parseDate(raw) })),
    []
  )

  const now = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const defaultIndex = useMemo(() => {
    const i = periodDates.findIndex(({ date }) => date >= now)
    return i === -1 ? periodDates.length - 1 : i
  }, [periodDates, now])

  const [selected, setSelected] = useState(defaultIndex)

  useEffect(() => {
    const el = ref.current?.querySelector<HTMLElement>('[data-active="true"]')
    el?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [selected])

  const activeDate = periodDates[selected]
  const isPast = activeDate.date < now

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
                {periodDates.map(({ raw, date }, i) => {
                  const isActive = i === selected
                  const past = date < now
                  return (
                    <button
                      key={raw}
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
                          {date.getMonth() + 1}月
                        </p>
                        <p className='text-2xl font-bold leading-tight'>{date.getDate()}</p>
                      </div>
                      <div className='md:text-left text-center'>
                        <p className={`text-xs ${isActive ? 'text-teal-100' : 'text-gray-400'}`}>
                          {WEEKDAY_FULL[date.getDay()]}
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
                    {activeDate.date.getMonth() + 1}月{activeDate.date.getDate()}日
                    <span className='ml-2 text-sm font-normal text-gray-400'>
                      {WEEKDAY_FULL[activeDate.date.getDay()]}
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
              <div className='relative'>
                <div className='absolute left-[6px] top-5 bottom-5 w-0.5 bg-gray-100 rounded-full' />
                <div className='space-y-3'>
                  {COURSES.map(({ time, name, card }, idx) => {
                    const [start, end] = time.split(' - ')
                    const salsa = isSalsa(name)
                    const isBeginner = card?.includes('初階')

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
                                {start}
                                <span className='text-gray-300 mx-1.5'>—</span>
                                {end}
                              </p>
                            </div>
                            {card && (
                              <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0
                                ${isBeginner
                                  ? 'bg-sky-100 text-sky-700'
                                  : 'bg-orange-100 text-orange-700'
                                }`}
                              >
                                {card}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </main>

        </div>
      </div>
    </div>
  )
}
