const Footer = () => {
  return (
    <footer className="bg-gray-700 text-gray-300">
      <div className="px-4 flex flex-col items-center p-4 gap-4">
        <div className="flex justify-center items-center gap-4">
          <img src="/icons/line.svg" alt="line" className="w-6 h-6" />
          <img src="/icons/instagram.svg" alt="instagram" className="w-6 h-6" />
        </div>
        <div className="text-center text-sm">
          Baila&apos;more @ 2025. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer; 