'use client'

import React, { useEffect, useMemo, useRef } from 'react';

const COURSE_PERIODS = [
  '2026/03/08',
  '2026/03/15',
  '2026/04/12',
  '2026/04/26',
  '2026/05/10',
  '2026/05/24',
]

type CourseData = {
  time: string
  name: string
  card?: string
}

const COURSES: CourseData[] = [
  {
    time: '14:00 - 15:00',
    name: 'Bachata 進階',
    card: '進階課卡',
  },
  {
    time: '15:00 - 16:00',
    name: 'Bachata Lv1',
    card: '初階課卡',
  },
  {
    time: '16:00 - 17:00',
    name: 'Bachata Lv2',
    card: '進階課卡',
  },
  {
    time: '17:00 - 18:00',
    name: 'Salsa Lv1',
    card: '初階課卡',
  }
]

const WEEKDAY_MAP = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

const parseDate = (dateString: string) => {
  const [year, month, day] = dateString.split('/').map(Number)
  return new Date(year, month - 1, day)
}

export default function Schedule() {
  const periodListRef = useRef<HTMLDivElement>(null)
  const periodDates = useMemo(() => COURSE_PERIODS.map((dateString) => ({
    raw: dateString,
    date: parseDate(dateString),
  })), [])
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const upcomingIndex = periodDates.findIndex(({ date }) => date >= now)
  const activePeriodIndex = upcomingIndex === -1 ? periodDates.length - 1 : upcomingIndex

  const yearLabel = Array.from(new Set(periodDates.map(({ date }) => date.getFullYear()))).join(' / ')

  useEffect(() => {
    const periodContainer = periodListRef.current
    if (!periodContainer) return

    const activeCard = periodContainer.querySelector<HTMLElement>('[data-period-card-active="true"]')
    if (!activeCard) return

    activeCard.scrollIntoView({ inline: 'start', block: 'nearest' })
  }, [activePeriodIndex])

  return (
    <div className='px-3 py-6 md:px-6 bg-gray-100 text-[#162834]'>
      <div className=' w-full max-w-2xl flex flex-col gap-5'>
        <div className='bg-white rounded-2xl p-4 md:p-6 flex flex-col gap-4'>
          <div className='flex items-center justify-between gap-3'>
            <p className='text-base md:text-lg tracking-wide font-semibold text-[#0c6b63] uppercase'>UPCOMING SUNDAYS</p>
            <p className='text-xs md:text-sm text-[#7a7a7a] font-medium'>{yearLabel}</p>
          </div>
          <div ref={periodListRef} className='-ml-2 pl-2 flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory'>
            {periodDates.map(({ raw, date }, index) => {
              const isActive = index === activePeriodIndex

              return (
                <PeriodCard
                  key={raw}
                  isActive={isActive}
                  month={`${date.getMonth() + 1}月`}
                  day={date.getDate()}
                  weekDay={WEEKDAY_MAP[date.getDay()]}
                />
              )
            })}
          </div>
        </div>

        {COURSES.map(({ time, name, card }) => (
          <CourseCard key={`${time}-${name}`} time={time} name={name} card={card} />
        ))}
      </div>
    </div >
  );
}

const PeriodCard = ({ month, day, weekDay, isActive }: { month: string, day: number, weekDay: string, isActive: boolean }) => {
  return (
    <div
      data-period-card-active={isActive}
      className={`min-w-[80px] rounded-3xl px-4 py-4 text-center flex flex-col items-center ${isActive ? 'bg-[#0f7f75] text-white shadow-md' : 'bg-[#f1f3f4] text-[#7a7a7a]'
        } snap-start`}
    >
      <p className='text-xs font-semibold'>{month}</p>
      <p className='text-4xl leading-none font-semibold mt-1'>{day}</p>
      <p className='text-xs mt-1'>{weekDay}</p>
    </div>
  )
}

const CourseCard = ({ time, name, card }: CourseData) => {
  const [startTime, endTime] = time.split(' - ')
  const isBeginner = card?.includes('初階')

  return (
    <div className='bg-white rounded-2xl px-4 py-5 md:px-6 md:py-6 shadow-[0_1px_6px_rgba(0,0,0,0.05)]'>
      <div className='flex items-start gap-4 md:gap-6'>
        <div className='w-[72px] flex-shrink-0 flex flex-col items-center text-[#1f2a30] font-medium'>
          <p className='text-xl md:text-2xl leading-none'>{startTime}</p>
          <div className='h-10 md:h-12 w-px bg-[#e3e3e3] my-2' />
          <p className='text-xl md:text-2xl leading-none text-[#6b7280]'>{endTime}</p>
        </div>
        <div className='flex-1 min-w-0 flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-3 pt-0.5'>
          <p className='text-xl md:text-2xl leading-snug font-semibold text-[#111827] break-words'>{name}</p>
          {card && (
            <span className={`w-fit px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap ${isBeginner ? 'bg-[#d9e8f7] text-[#4f5e6f]' : 'bg-[#f8d8c8] text-[#7a5d52]'
              }`}>
              {card}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}