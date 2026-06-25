import { cn } from '@/lib/utils';
import { PRICE_PLANS, THEMES, type PricePlan, type PriceTier } from './data';

export default function PricingBoard() {
  return (
    <div className="bg-[#faf0e1]">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-8 md:gap-10 md:px-6 md:py-12">
        <div className="flex flex-col">
          <h2 className="font-poppins text-2xl font-bold text-[#2d3a5e] md:text-3xl">
            課程費用
          </h2>
          <p className="mt-1 text-sm text-gray-600 md:text-base">
            顏色對應課表：找到你上的課，就能對到方案。
          </p>
        </div>
        {PRICE_PLANS.map((plan) => (
          <PlanSection key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}

function PlanSection({ plan }: { plan: PricePlan }) {
  return (
    <section
      id={plan.id}
      className="scroll-mt-20 overflow-hidden rounded-3xl bg-white shadow-sm"
    >
      {/* 標頭：方案名 + 適用課程彩色 chip */}
      <div className="flex flex-col gap-2 px-5 py-4 md:px-6 md:py-5">
        <h3 className="font-poppins text-xl font-bold text-[#2d3a5e] md:text-2xl">
          {plan.name}
        </h3>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-gray-400">適用</span>
          {plan.chips.map((chip) => (
            <span
              key={chip.label}
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-bold text-white',
                THEMES[chip.theme].accentBg
              )}
            >
              {chip.label}
            </span>
          ))}
        </div>
      </div>

      {/* 價目 tiers */}
      <div className="flex flex-col gap-3 px-5 pb-5 md:px-6 md:pb-6">
        {plan.tiers.map((tier) => (
          <TierCard key={tier.title} tier={tier} />
        ))}
      </div>

      {/* note */}
      {plan.note && (
        <div className="bg-[#EAF5F4] px-5 py-3 md:px-6">
          <p className="text-sm text-[#2d3a5e]">{plan.note}</p>
        </div>
      )}
    </section>
  );
}

function TierCard({ tier }: { tier: PriceTier }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
      <div className="flex flex-col">
        <p className="text-lg font-bold text-[#2d3a5e]">{tier.title}</p>
        {tier.subtitle && (
          <p className="text-sm text-gray-500">{tier.subtitle}</p>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1.5">
        <p className="text-xs font-medium text-gray-400">適用課程</p>
        <div className="flex flex-wrap gap-1.5">
          {tier.courses.map((c) => (
            <span
              key={c.name}
              className={cn(
                'rounded-full border border-current bg-white px-2.5 py-1 text-xs font-medium',
                THEMES[c.theme].accentText
              )}
            >
              {c.name}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {tier.options.map((option) => (
          <div
            key={option.name}
            className="flex items-center justify-between border-t border-gray-200 pt-2"
          >
            <span className="text-base font-bold text-[#2d3a5e]">
              {option.name}
            </span>
            <span className="text-base font-bold text-[#2d3a5e]">
              ${option.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
