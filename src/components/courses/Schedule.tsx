'use client'

import React from 'react';
import UserIcon from '../icons/UserIcon';


export default function Schedule() {
  return (
    <div className='px-3 py-6 md:px-6 bg-gray-100'>
      <div className='flex flex-col rounded-lg overflow-hidden md:max-w-xl'>
        <div className='bg-[#162834] px-4 py-5 flex flex-col gap-2.5 text-white text-sm'>
          <p className='font-bold'>本期課程時間</p>
          <p>3/30（日）、4/13（日）、4/20（日）、5/4（日）、5/11（日）、5/25（日）</p>
        </div>
        <TimeSlot time='14:00 - 14:50' />
        <div className='flex flex-col px-4 py-4 gap-4 bg-white'>
          <Course classRoom='A' name='Salsa Lv1' teacher='Angus' />
          <hr />
          <Course classRoom='B' name='Lady Style' teacher='Kathy' />
        </div>
        <TimeSlot time='15:00 - 15:50' />
        <div className='flex flex-col px-4 py-4 gap-4 bg-white'>
          <Course classRoom='A' name='Bachata Lv1' teacher='Sean' />
          <hr />
          <Course classRoom='B' name='Salsa Lv2' teacher='Angus' />
        </div>
        <TimeSlot time='16:00 - 16:50' />
        <div className='flex flex-col px-4 py-4 gap-4 bg-white'>
          <Course classRoom='A' name='Bachata Lv2' teacher='Sean & Kathy' />
        </div>
        <TimeSlot time='17:00 - 17:50' />
        <div className='flex flex-col px-4 py-4 gap-4 bg-white'>
          <Course classRoom='A' name='Bachata 中階' teacher='Sean & Kathy' />
        </div>
      </div>
    </div>
  );
}

const TimeSlot = ({ time }: { time: string }) => {
  return (
    <div className='bg-gray-200 px-4 py-3 text-[#162834] text-sm flex items-center gap-2'>
      <img src='/icons/clock.svg' alt='clock' className='w-4 h-4' />
      <p className='font-bold'>{time}</p>
    </div>
  )
}

const Course = ({ classRoom, name, teacher }: { classRoom: 'A' | 'B', name: string, teacher: string }) => {
  const bgColor = classRoom === 'A' ? 'bg-teal-600' : 'bg-sky-600';
  return (
    <div className='flex justify-between items-center'>
      <div className='flex gap-2.5 items-center'>
        <div className={`px-3 py-2 ${bgColor} text-white text-sm rounded-full`}>{classRoom}教室</div>
        <div className='text-base font-bold'>{name}</div>
      </div>
      <div className='flex gap-1 text-[#666666] items-center'>
        <UserIcon />
        <span className='text-sm'>{teacher}</span>
      </div>
    </div>
  )
}