import Image from 'next/image';
import Link from 'next/link';
import { LINKS } from '@/constants/links'

const Footer = () => {
  return (
    <footer className="bg-gray-700 text-gray-300">
      <div className="px-6 py-10 md:max-w-7xl md:mx-auto">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Image src="/Logo.svg" alt="Baila'more" width={120} height={40} className="brightness-0 invert" />
            <p className="text-sm text-gray-400">台南市的專業拉丁舞教室</p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">快速連結</h3>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/courses" className="hover:text-white transition-colors">課程資訊</Link>
              <Link href="/teachers" className="hover:text-white transition-colors">師資介紹</Link>
              <Link href="/location" className="hover:text-white transition-colors">教室資訊</Link>
              <Link href={LINKS.PRICING} className="hover:text-white transition-colors">課程費用</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">聯絡我們</h3>
            <div className="flex flex-col gap-2 text-sm">
              <a href={LINKS.LINE} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                <Image src="/icons/line.svg" alt="LINE" width={20} height={20} />
                LINE 報名 / 諮詢
              </a>
              <a href="https://www.instagram.com/baila_moredancestudio" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                <Image src="/icons/instagram.svg" alt="Instagram" width={20} height={20} />
                Instagram
              </a>
              <p className="text-gray-400 mt-1">台南市北區長北街71號</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-600 pt-6 text-center text-sm text-gray-500">
          Baila&apos;more © 2026 Copyright
        </div>
      </div>
    </footer>
  );
};

export default Footer;
