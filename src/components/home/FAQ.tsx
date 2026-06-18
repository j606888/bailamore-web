'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type FAQItem = {
  id: string;
  question: string;
  answer: string; // Markdown
};

const FAQItem = ({ faq, isOpen, onToggle }: {
  faq: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
      <button
        className="w-full px-6 py-4 flex justify-between items-center text-left hover:cursor-pointer"
        onClick={onToggle}
      >
        <span className="text-lg font-medium text-gray-900">{faq.question}</span>
        <span className="ml-6 flex-shrink-0">
          {isOpen ? (
            <svg className="h-6 w-6 text-gray-500 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          ) : (
            <svg className="h-6 w-6 text-gray-500 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )}
        </span>
      </button>
      <div
        className={`grid transition-all duration-200 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-5">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ href, children }) => {
                  const external = !!href && /^https?:\/\//.test(href);
                  return (
                    <a
                      href={href}
                      className="text-teal-600 underline"
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {children}
                    </a>
                  );
                },
                p: ({ children }) => (
                  <p className="text-gray-700 mb-2 last:mb-0">{children}</p>
                ),
              }}
            >
              {faq.answer}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

const FAQ = ({ faqs }: { faqs: FAQItem[] }) => {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggleFAQ = (id: string) => {
    setOpenIds(prev => {
      const newIds = new Set(prev);
      if (newIds.has(id)) {
        newIds.delete(id);
      } else {
        newIds.add(id);
      }
      return newIds;
    });
  };

  return (
    <section className="py-8 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          常見 Q&A
        </h2>
        <div className="flex flex-col gap-4">
          {faqs.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isOpen={openIds.has(faq.id)}
              onToggle={() => toggleFAQ(faq.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
