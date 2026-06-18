'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

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
        <p className="text-gray-600 mb-2">{testimonial.title}</p>
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-teal-600/10 text-teal-700 mb-4">{testimonial.danceStyle} 學員</span>
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