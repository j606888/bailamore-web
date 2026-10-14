'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { LINKS } from '@/constants/links'
import Image from 'next/image';
import IGIcon from '@/components/icons/IGIcon';
import { ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

// 主要連結：跟上課直接相關，桌機與手機都直接顯示。
const NAV_LINKS = [
  { name: '課程資訊', href: '/courses' },
  { name: '課程報名', href: LINKS.ENROLL },
  { name: '師資介紹', href: '/teachers' },
  { name: '教室資訊', href: '/location' },
  // { name: '活動', href: '/events', disabled: true },
  // { name: '課程紀錄', href: '/record', disabled: true },
];

// 次要連結：品牌相關，桌機收進「關於我們」下拉，手機放在選單底部的小字區。
const MORE_LABEL = '關於我們';
const MORE_LINKS = [
  { name: '品牌故事', href: '/story' },
  { name: '周邊商品', href: '/merch' },
  { name: '兩年回顧', href: '/journey' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setIsMoreOpen(false);
      }
    };

    const handleScroll = () => {
      setIsMenuOpen(false);
      setIsMoreOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50" ref={menuRef}>
      <div className="mx-auto px-4 md:px-6">
        <div className="flex justify-between h-16">
          <div className="flex items-center flex-auto">
            <Link href="/" className="flex-shrink-0 flex flex-col items-start">
              <Image
                src="/bailamore_green.svg"
                alt="Baila'more 拉丁舞教室"
                width={160}
                height={28}
                priority
                className="h-5 w-auto md:h-6"
              />
            </Link>
          </div>

          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
            {/* 滑鼠移入或點擊都會展開；group-hover 讓桌機不用點，state 讓觸控平板也打得開 */}
            <div className="relative group" onMouseLeave={() => setIsMoreOpen(false)}>
              <button
                type="button"
                onClick={() => setIsMoreOpen((open) => !open)}
                aria-expanded={isMoreOpen}
                aria-haspopup="true"
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer"
              >
                {MORE_LABEL}
                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div
                className={`${isMoreOpen ? 'visible opacity-100' : 'invisible opacity-0'} group-hover:visible group-hover:opacity-100 absolute right-0 top-full pt-2 transition-opacity duration-150`}
              >
                <div className="w-36 rounded-lg bg-white py-2 shadow-lg ring-1 ring-gray-200">
                  {MORE_LINKS.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMoreOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href={LINKS.INSTAGRAM_DM} target="_blank" rel="noopener noreferrer">
              <Button className="ml-2 cursor-pointer">
                <IGIcon className="w-6 h-6" color="#ffffff" />
                IG 私訊報名
              </Button>
            </Link>
          </div>
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded="false"
            >
              <Image src="/menu.svg" alt="Menu" width={24} height={24} />
            </button>
          </div>
        </div>
      </div>
      <div
        className={`${isMenuOpen
          ? 'max-h-[460px] opacity-100'
          : 'max-h-0 opacity-0'
          } overflow-hidden transition-all duration-300 ease-in lg:hidden`}
      >
        <div className="px-4 pt-2 pb-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`block px-1 py-2 text-base border-b border-gray-100 text-gray-800`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-1 pt-3 text-sm text-gray-500">
            <span className="text-xs text-gray-400">{MORE_LABEL}</span>
            {MORE_LINKS.map((link) => (
              <Link key={link.name} href={link.href} className="hover:text-gray-800" onClick={() => setIsMenuOpen(false)}>
                {link.name}
              </Link>
            ))}
          </div>
          <Link href={LINKS.INSTAGRAM_DM} target="_blank" rel="noopener noreferrer">
            <Button className="mt-3">
              <IGIcon className="w-6 h-6" color="#ffffff" />
              IG 私訊報名
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 