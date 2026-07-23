import React from 'react';

// 全站共用的區塊／頁面標題：teal 小標 → 標題 → teal 短線 → 灰色副標。
// size='md' 給首頁區塊，size='lg' 給頁面層級的頁首（如 /teachers）。
type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  size?: 'md' | 'lg';
  /** 頁面層級的頁首用 'h1'，首頁區塊用預設的 'h2'。 */
  as?: 'h1' | 'h2';
  className?: string;
};

const SectionHeading = ({ eyebrow, title, subtitle, size = 'md', as: Tag = 'h2', className = '' }: Props) => {
  const titleSize = size === 'lg' ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl';

  return (
    <div className={`flex flex-col items-center text-center gap-2 ${className}`}>
      <p className="text-sm font-semibold tracking-widest text-teal-600 md:text-base">
        {eyebrow}
      </p>
      <Tag className={`font-bold text-gray-900 ${titleSize}`}>{title}</Tag>
      <span className="w-12 h-1 rounded-full bg-teal-600" />
      {subtitle && (
        <p className="max-w-md text-base text-gray-600 md:text-lg">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeading;
