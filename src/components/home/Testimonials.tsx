'use client';

import { useEffect, useState } from 'react';
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
    name: 'Dora',
    title: '核心沒力的跳舞小白',
    image: '/testimonials/dora.png',
    content: [
      '前年第一次接觸bachata時感受到跳舞時的快樂氛圍，開始學習以後才體驗到"會跳舞"的快樂！',
      '從不太敢跳，到現在可以自在地在舞會裡接受邀舞，最大的關鍵就是——老師的教學真的很給力！課程安排循序漸進，老師會調整步調一起學習，面對學生的問題也有問必答。',
      // '學習以後可以跟同學一起去party跟夜店high，生活中的大確幸就是開始上課學跳舞了！'
    ],
  },
  {
    id: 2,
    name: '丁丁',
    title: '莫名入坑的工程師',
    image: '/testimonials/ding.png',
    content: [
      '因為我哥的介紹來試試看這個酷東西，結果發現意外的好玩。',
      '從剛開始只能站在舞池角落看大家跳到現在可以整場舞會無中斷的享受真的變有成就感的！',
      '希望之後有更多朋友可以一起來參加~'
    ],
  },
  {
    id: 3,
    name: 'Nora',
    title: '和男友一起來上課的女友',
    image: '/testimonials/nora.jpg',
    content: [
      '原本抱持陪男友上課的心態，結果發現在party上跟很多leader跳舞超好玩，0基礎也可以很開心。',
      '很幸運可以在台南找到長期上課進修的教室，老師們都很細心還很幽默^^推推'
    ],
  },

  {
    id: 4,
    name: 'Emma',
    title: '更擅長跳夜店舞的女子',
    image: '/testimonials/emma.png',
    content: [
      '在一次的派對上不小心入坑Bachata、Salsa後，我的世界從此變得好不一樣，是跳舞帶我找回了我自己，讓我想起了自己小時候是多麼喜歡跳舞。',
      '在每一次的卡關都讓我更認識自己的身體，每一次突破瓶頸後發現自己真的做得到的成就感也讓我好滿足，可以活在自己的熱愛裡是多麼美妙的一件事，也因為跳舞讓我認識了一群很棒的朋友們~真的超幸福的~'
    ],
  },
];

const Testimonial = ({ testimonial }: { testimonial: TestimonialType }) => {
  return (
    <div className="bg-white border-1 rounded-sm border-gray-200 p-6 min-w-[300px] max-w-md h-[500px] md:w-[430px]">
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
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const resetInterval = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    const newInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    setIntervalId(newInterval);
  };

  useEffect(() => {
    resetInterval();
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
    if (intervalId) {
      clearInterval(intervalId);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const touchDiff = touchStart - touchEnd;
    const threshold = 50; // minimum distance for swipe

    if (touchDiff > threshold) {
      // Swipe left
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    } else if (touchDiff < -threshold) {
      // Swipe right
      setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    }
    
    setIsDragging(false);
    resetInterval();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
    setIsDragging(true);
    if (intervalId) {
      clearInterval(intervalId);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTouchEnd(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const touchDiff = touchStart - touchEnd;
    const threshold = 50;

    if (touchDiff > threshold) {
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    } else if (touchDiff < -threshold) {
      setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    }
    
    setIsDragging(false);
    resetInterval();
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    resetInterval();
  };

  return (
    <section className="py-8 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center md:text-3xl md:mb-8">
          學生心得
        </h2>
        
        {/* Mobile Slider */}
        <div className="relative overflow-hidden md:hidden">
          <div 
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="w-full flex-shrink-0 flex justify-center items-center">
                <Testimonial testimonial={testimonial} />
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-2 rounded-full transition-all duration-300 ease-in-out cursor-pointer ${
                  index === currentIndex ? 'bg-teal-600 w-6' : 'bg-gray-300 w-2 hover:w-4'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:flex md:flex-wrap md:justify-center gap-6 md:max-w-4xl md:mx-auto">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="flex justify-center">
              <Testimonial testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 