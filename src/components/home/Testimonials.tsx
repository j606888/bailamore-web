'use client';

import { useState } from 'react';
import Image from 'next/image';

type TestimonialType = {
  id: number;
  name: string;
  title: string;
  image: string;
  content: string[];
};

const testimonials: TestimonialType[] = [
  {
    id: 1,
    name: '丁丁',
    title: '莫名入坑的工程師',
    image: '/testimonials/ding.png',
    content: [
      '因為我哥的介紹來試試看這個酷東西，結果發現意外的好玩。',
      '從剛開始只能站在舞池角落看大家跳到現在可以整場舞會無中斷的享受真的變有成就感的！',
      '希望台南可以有更多朋友一起來玩~'
    ],
  },
  {
    id: 2,
    name: 'Nora',
    title: '和男友一起來上課的女友',
    image: '/testimonials/nora.jpg',
    content: [
      '原本抱持陪男友上課的心態，結果發現在party上跟很多leader跳舞超好玩，0基礎也可以很開心。',
      '很幸運可以在台南找到長期上課進修的教室，老師們都很細心還很幽默^^推推'
    ],
  },
  {
    id: 3,
    name: 'Dora',
    title: '核心沒力的跳舞小白',
    image: '/testimonials/dora.png',
    content: [
      '前年第一次接觸bachata時感受到跳舞時的快樂氛圍，開始學習以後才體驗到“會跳舞“的快樂！',
      '從不太敢跳，到現在可以自在地在舞會裡接受邀舞，最大的關鍵就是——老師的教學真的很給力！課程安排循序漸進，老師會調整步調一起學習，面對學生的問題也有問必答。',
      '學習以後可以跟同學一起去party跟夜店high，生活中的大確幸就是開始上課學跳舞了！'
    ],
  },
];

const Testimonial = ({ testimonial }: { testimonial: TestimonialType }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl mx-auto  min-h-[480px]">
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 relative mb-4">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{testimonial.name}</h3>
        <p className="text-gray-600 mb-6">{testimonial.title}</p>
        <div className="space-y-4 text-center">
          {testimonial.content.map((paragraph, index) => (
            <p key={index} className="text-gray-700">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          學生心得
        </h2>
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Previous testimonial"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Next testimonial"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Testimonial */}
          <div className="transition-opacity duration-300">
            <Testimonial testimonial={testimonials[currentIndex]} />
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-gray-800' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 