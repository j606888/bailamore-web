import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../ui/button';

const Hero = () => {
  return (
    <>
      <div className="px-5 py-10 flex flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="font-poppins text-2xl font-bold mb-1">
            第一次跳舞，就從這裡開始
          </h1>
          <p className="text-sm max-w-2xl text-center">
            沒舞伴、沒經驗都沒關係，來試一次<br />Bachata，說不定你會愛上。
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg">
            <Image
                  src="/icons/line.svg"
                  alt="line"
                  width={24}
                  height={24}
                />
              立即報名</Button>
            <Button size="lg" variant="outline">課程介紹</Button>
          </div>
        </div>
          <Image
              src="/images/hero.jpg"
              alt="Dance class background"
              className="object-cover w-full rounded-xl"
              width={1200}
              height={800}
          />
      </div>
      <div className="relative h-[320px] md:h-[480px] lg:h-[640px] hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt="Dance class background"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-white max-w-3xl">
              <h1 className="font-poppins text-2xl font-bold mb-1 sm:text-5xl sm:mb-4">
                第一次跳舞，就從這裡開始
              </h1>
              <p className="text-sm max-w-2xl sm:text-lg">
                沒舞伴、沒經驗都沒關係，來試一次 Bachata，說不定你會愛上。
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link
                  href="/register"
                  className="hover:bg-sky-800 text-white py-2 px-6 md:py-3 md:px-8 rounded-lg transition duration-300 bg-primary-600"
                >
                  立即報名
                </Link>
                <Link
                  href="/courses"
                  className="border-1 border-white text-white hover:bg-gray-100 py-2 px-6 md:py-3 md:px-8 rounded-lg transition duration-300"
                >
                  課程介紹
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>

  );
};

export default Hero; 