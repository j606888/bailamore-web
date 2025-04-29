import { LINKS } from '@/constants/links'

const Footer = () => {
  return (
    <footer className="bg-gray-700 text-gray-300">
      <div className="px-4 flex items-center justify-between p-4 gap-4 md:max-w-7xl md:mx-auto md:h-[64px]">
        <div className="flex justify-center items-center gap-4">
          <span className="hidden md:block text-sm">追蹤我們</span>
          <a href={LINKS.LINE} target="_blank" rel="noopener noreferrer">
            <img src="/icons/line.svg" alt="line" className="w-6 h-6" />
          </a>
          <a href="https://www.instagram.com/baila_moredancestudio" target="_blank" rel="noopener noreferrer">
            <img src="/icons/instagram.svg" alt="instagram" className="w-6 h-6" />
          </a>
          <span className="hidden md:block text-sm ml-12">台南市北區長北街71號</span>
        </div>
        <div className="text-center text-sm">
          Baila&apos;more © 2025 Copyright
        </div>
      </div>
    </footer>
  );
};

export default Footer; 