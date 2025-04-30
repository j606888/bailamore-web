import Image from 'next/image'
import { Button } from '../ui/button'
import Link from 'next/link';
import { LINKS } from '@/constants/links'

const Hero = () => {
  return (
    <div className="px-5 py-10 flex flex-col items-center justify-center gap-6 md:flex-row md:gap-6 md:max-w-7xl md:mx-auto">
      <div className="flex flex-col items-center justify-center gap-4 md:w-[420px] md:items-start md:flex-shrink-0">
        <h1 className="font-poppins text-2xl font-bold mb-1 md:text-5xl">
          第一次跳舞，<br className="hidden md:block" />就從這裡開始
        </h1>
        <p className="text-base max-w-2xl text-center md:text-left md:text-md">
          沒舞伴、沒經驗都沒關係，來試一次<br className='md:hidden' />Bachata，說不定你會愛上。
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href={LINKS.LINE} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="hover:cursor-pointer">
              <Image
                src="/icons/line.svg"
                alt="line"
                width={24}
                height={24}
            />
            立即報名
            </Button>
          </Link>
          <Link href="/courses">
            <Button className='hover:cursor-pointer' size="lg" variant="outline">課程資訊</Button>
          </Link>
        </div>
      </div>
      <picture>
        <source srcSet="/images/hero-large.jpg" media="(min-width: 640px)" />
        <img
          src="/images/hero.jpg"
          alt="Dance class background"
          className="object-cover w-full rounded-xl"
          loading="lazy"
          width={1200}
          height={800}
        />
      </picture>
    </div>
  )
}

export default Hero 