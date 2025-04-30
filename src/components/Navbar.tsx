'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LINKS } from '@/constants/links'
import Image from 'next/image';
import { Button } from './ui/button';

const NAV_LINKS = [
  { name: '課程資訊', href: '/courses' },
  { name: '師資介紹', href: '/teachers' },
  { name: '教室資訊', href: '/location' },
  // { name: '活動', href: '/events', disabled: true },
  // { name: '課程紀錄', href: '/record', disabled: true },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="mx-auto px-4 md:px-6">
        <div className="flex justify-between h-16">
          <div className="flex items-center flex-auto">
            <Link href="/" className="flex-shrink-0 flex flex-col items-start">
              <Image src="/Logo.svg" alt="Logo" width={138} height={38} />
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4 md:flex-wrap">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
            <Link href={LINKS.LINE} target="_blank" rel="noopener noreferrer">
              <Button className="ml-2 cursor-pointer">
                <Image
                  src="/icons/line.svg"
                  alt="line"
                  width={24}
                  height={24}
                />
                立即報名
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
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

      {/* Mobile Navigation */}
      <div
        className={`${isMenuOpen
          ? 'max-h-[300px] opacity-100'
          : 'max-h-0 opacity-0'
          } overflow-hidden transition-all duration-300 ease-in md:hidden`}
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
          <Link href={LINKS.LINE} target="_blank" rel="noopener noreferrer">
            <Button className="mt-3">
              <Image
                src="/icons/line.svg"
                alt="line"
                width={24}
                height={24}
              />
              立即報名
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 