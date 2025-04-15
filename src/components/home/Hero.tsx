import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  return (
    <div className="relative h-[320px] md:h-[480px] lg:h-[640px]">
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
            <h1 className="font-poppins text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 md:mb-4">
              第一次跳舞，就從這裡開始
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-4 md:mb-8 max-w-2xl">
              沒舞伴、沒經驗都沒關係，來試一次 Bachata，說不定你會愛上。
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4">
              <Link 
                href="/register" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 md:py-3 md:px-8 rounded-lg transition duration-300"
              >
                立即報名
              </Link>
              <Link 
                href="/courses" 
                className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-2 px-6 md:py-3 md:px-8 rounded-lg transition duration-300"
              >
                課程介紹
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 