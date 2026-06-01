'use client'

import React from 'react';
import { PRICING_TIERS } from '@/data/pricing';

const tagClasses = {
  sky: 'bg-sky-100 text-sky-700',
  orange: 'bg-orange-100 text-orange-700',
} as const;

export default function Pricing() {
  return (
    <div className='px-3 py-6 md:px-6 bg-gray-100 flex flex-col gap-3 md:gap-6'>
      {PRICING_TIERS.map((tier) => (
        <div key={tier.title} className='flex flex-col rounded-lg overflow-hidden md:max-w-xl shadow-sm'>
          <div className='bg-teal-600 px-4 py-3 flex flex-col text-white'>
            <p className='font-bold text-lg'>{tier.title}</p>
            <p className='text-sm'>{tier.subtitle}</p>
          </div>
          <div className='flex flex-col px-4 py-4 gap-4 bg-white'>
            <div className='flex flex-col gap-1.5'>
              <p className='text-xs text-gray-400 font-medium'>適用課程</p>
              <div className='flex flex-wrap gap-1.5'>
                {tier.applicableCourses.map((tag) => (
                  <span key={tag.name} className={`text-xs font-medium px-2.5 py-1 rounded-full ${tagClasses[tag.colorScheme]}`}>
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
            {tier.options.map((option) => (
              <React.Fragment key={option.name}>
                <hr />
                <Course name={option.name} price={option.price} />
              </React.Fragment>
            ))}
          </div>
          <div className='bg-[#EAF5F4] px-3 py-3'>
            <p className='text-sm'>{tier.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const Course = ({ name, price }: { name: string; price: number }) => (
  <div className='flex justify-between items-center'>
    <div className='text-base font-bold'>{name}</div>
    <span className='text-base font-bold'>${price}</span>
  </div>
)
