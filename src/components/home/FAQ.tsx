'use client';

import { useState } from 'react';
import { LINKS } from '@/constants/links';

type FAQItem = {
  id: number;
  question: string;
  answer: string[];
};

const faqs: FAQItem[] = [
  {
    id: 1,
    question: '如何報名課程',
    answer: [
      `加入 <a class="text-teal-600 underline" href=${LINKS.LINE} target="_blank" rel="noopener noreferrer">Line 官方帳號</a>，直接私訊 Sean 即可。`,
      '如果想要先體驗的話也可以直接在課程時間來到教室。'
    ],
  },
  {
    id: 2,
    question: '沒有舞蹈經驗可以嗎？',
    answer: [
      '當然可以！不管什麼年齡或是有無經驗都非常適合來學習 Bachata & Salsa。'
    ],
  },
  {
    id: 3,
    question: '沒有舞伴可以嗎？',
    answer: [
      '可以的！上課中舞伴是會不斷輪替的不用擔心沒有人可以練習。'
    ],
  },
  {
    id: 4,
    question: '關於課程選擇',
    answer: [
      '如果沒有上過類似的課程的新手會建議從 LV1 的課程開始，等到覺得熟練之後再踏入 LV2 的大門。',
      `瞭解更多請參考<a class="text-teal-600 underline" href=${LINKS.COURSES} rel="noopener noreferrer">課程資訊</a>`,
    ],
  },
  {
    id: 5,
    question: '關於課程費用',
    answer: [
      '我們採用課卡的方式，每次購買一張課卡可以使用 6 次。',
      `如果要單次上課的話也是可以的，詳情請參考<a class="text-teal-600 underline" href=${LINKS.PRICING} rel="noopener noreferrer">課程資訊</a>`
    ],
  },
];

const FAQItem = ({ faq, isOpen, onToggle }: { 
  faq: FAQItem; 
  isOpen: boolean; 
  onToggle: () => void;
}) => {
  return (
    <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
      <button
        className="w-full px-6 py-4 flex justify-between items-center text-left hover:cursor-pointer"
        onClick={onToggle}
      >
        <span className="text-lg font-medium text-gray-900">{faq.question}</span>
        <span className="ml-6 flex-shrink-0">
          {isOpen ? (
            <svg className="h-6 w-6 text-gray-500 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          ) : (
            <svg className="h-6 w-6 text-gray-500 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )}
        </span>
      </button>
      <div 
        className={`grid transition-all duration-200 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-5">
            {faq.answer.map((paragraph, index) => (
              <p key={index} className="text-gray-700 mb-2 last:mb-0" dangerouslySetInnerHTML={{ __html: paragraph }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [openIds, setOpenIds] = useState<Set<number>>(new Set([]));

  const toggleFAQ = (id: number) => {
    setOpenIds(prev => {
      const newIds = new Set(prev);
      if (newIds.has(id)) {
        newIds.delete(id);
      } else {
        newIds.add(id);
      }
      return newIds;
    });
  };

  return (
    <section className="py-8 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          常見 Q&A
        </h2>
        <div className="flex flex-col gap-4">
          {faqs.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isOpen={openIds.has(faq.id)}
              onToggle={() => toggleFAQ(faq.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ; 