'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Quote } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

type TestimonialType = {
  id: string;
  name: string;
  title: string;
  image: string;
  content: string[];
  danceStyle: string;
};

const Testimonial = ({ testimonial }: { testimonial: TestimonialType }) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl p-6 min-w-[300px] max-w-md ring-1 ring-gray-200 shadow-sm transition-shadow duration-200 hover:shadow-md md:w-[430px] md:p-8">
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 relative mb-4">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            fill
            sizes="96px"
            className="rounded-full object-cover ring-4 ring-teal-600/15"
          />
        </div>
        <h3 className="text-xl font-bold text-gray-900">{testimonial.name}</h3>
        <p className="text-sm text-gray-500">{testimonial.title}</p>
        <span className="mt-3 text-xs font-medium px-3 py-1 rounded-full bg-teal-600/10 text-teal-700">{testimonial.danceStyle} 學員</span>
      </div>
      {/* 引號當作心得段落的起點，內文改左對齊以利長段閱讀 */}
      <Quote className="mt-6 mb-3 shrink-0 text-teal-600/25 fill-teal-600/25" size={28} />
      <div className="space-y-3 text-left text-sm text-gray-700 leading-relaxed md:text-base">
        {testimonial.content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

const Testimonials = ({ testimonials }: { testimonials: TestimonialType[] }) => {
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
        <SectionHeading
          eyebrow="真實學員回饋"
          title="學生心得"
          subtitle="從不敢下場，到自在享受每一支舞"
          className="mb-8 md:mb-12"
        />

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