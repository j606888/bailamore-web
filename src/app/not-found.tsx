import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-6xl font-bold text-teal-600 font-poppins">404</p>
      <h1 className="text-2xl font-bold text-gray-900">找不到這個頁面</h1>
      <p className="text-gray-500 max-w-sm">
        你要找的頁面不存在，可能已被移除或連結有誤。
      </p>
      <Link href="/">
        <Button size="lg">回到首頁</Button>
      </Link>
    </div>
  );
}
