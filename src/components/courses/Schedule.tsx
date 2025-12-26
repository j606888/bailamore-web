'use client'

import React from 'react';
import UserIcon from '../icons/UserIcon';

export default function Schedule() {
  return (
    <div className='px-3 py-6 md:px-6 bg-gray-100'>
      <div className='flex flex-col rounded-lg overflow-hidden md:max-w-xl'>
        <div className='bg-[#162834] px-4 py-5 flex flex-col gap-2.5 text-white text-sm'>
          <p className='font-bold'>本期課程時間</p>
          <p>1/11（日）、1/18（日）、1/25（日）、2/1（日）、2/8（日）、3/1（日）</p>
        </div>
        <TimeSlot time='14:00 - 15:00' />
        <div className='flex flex-col px-4 py-4 gap-4 bg-white'>
          <Course name='Bachata 進階' teacher='Sean & Kathy' />
        </div>
        <TimeSlot time='15:00 - 16:00' />
        <div className='flex flex-col px-4 py-4 gap-4 bg-white'>
          <Course name='Bachata Lv1' teacher='Sean & Kathy' />
        </div>
        <TimeSlot time='16:00 - 17:00' />
        <div className='flex flex-col px-4 py-4 gap-4 bg-white'>
          <Course name='練習時間' />
        </div>
        <TimeSlot time='17:00 - 18:00' />
        <div className='flex flex-col px-4 py-4 gap-4 bg-white'>
          <Course name='Bachata Lv2' teacher='Sean & Kathy' />
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

const Course = ({ name, teacher }: { name: string, teacher?: string }) => {
  return (
    <div className='flex justify-between items-center'>
      <div className='flex gap-2.5 items-center'>
        <div className='text-base font-bold'>{name}</div>
      </div>
      {teacher && ( 
        <div className='flex gap-1 text-[#666666] items-center'>
          <UserIcon />
          <span className='text-sm'>{teacher}</span>
        </div>
      )}
    </div>
  )
}