'use client'

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Introduction from '@/components/courses/Introduction';
import ScheduleBoard from '@/components/courses/schedule/ScheduleBoard';
import PricingBoard from '@/components/courses/schedule/PricingBoard';

const TABS = [
  { label: '課表', query: 'schedule' },
  { label: '費用', query: 'pricing' },
  { label: '風格介紹', query: 'introduction' },
]

export default function CoursesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(TABS[0].query);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && TABS.some(tab => tab.query === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    } else {
      setActiveTab(TABS[0].query);
      router.push(`/courses?tab=${TABS[0].query}`);
    }
  }, [searchParams, router]);

  // 從課表卡的「查看費用 →」跳轉過來時（/courses?tab=pricing#plan-id），
  // 切到費用 tab 後把對應方案區塊捲入畫面。
  useEffect(() => {
    if (activeTab !== 'pricing') return;
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const timer = setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    router.push(`/courses?tab=${tab}`);
  };

  return (
    <>
      <div className="mx-auto py-10 flex flex-col items-center justify-center bg-gray-100 md:items-start md:px-6">
        <h1 className="font-poppins text-2xl font-bold">課程資訊</h1>
        <p className="font-poppins text-base">
          了解我們的舞蹈風格、課表時間和費用
        </p>
      </div>
      <div className="flex px-3 border-b border-[#E3E3E3] md:px-6">
        {TABS.map(tab => (
          <div
            key={tab.query}
            className={`px-4 py-4 relative hover:cursor-pointer ${tab.query === activeTab ? 'after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-teal-600' : ''}`}
            onClick={() => handleTabClick(tab.query)}
          >
            <div className={`text-sm md:text-base ${tab.query === activeTab ? 'text-teal-600 font-bold' : 'text-gray-600'}`}>{tab.label}</div>
          </div>
        ))}
      </div>
      {activeTab === 'introduction' && <Introduction />}
      {activeTab === 'schedule' && <ScheduleBoard />}
      {activeTab === 'pricing' && <PricingBoard />}
    </>
  );
}
