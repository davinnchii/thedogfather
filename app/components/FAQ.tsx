"use client";

import { useState } from "react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQProps {
  title?: string;
  items: FAQItem[];
  id?: string;
}

export default function FAQ({
  title = "Ofte stilte spørsmål",
  items,
  id = "faq",
}: FAQProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id={id} className="py-20 px-4 bg-primary-hover/20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          {title}
        </h2>
        <div className="space-y-4">
          {items.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className={`border border-primary-hover/30 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${
                  isExpanded ? "bg-muted/10" : "bg-white/90"
                }`}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className={`w-full flex items-center justify-between p-6 text-left transition-colors ${
                    isExpanded
                      ? "bg-muted/10 hover:bg-muted/15"
                      : "bg-white/90 hover:bg-muted/10"
                  }`}
                >
                  <span
                    className={`text-lg font-semibold pr-4 ${
                      isExpanded ? "text-white/90" : "text-on-surface"
                    }`}
                  >
                    {item.question}
                  </span>
                  <span
                    className={`flex-shrink-0 transform transition-transform duration-300 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isExpanded
                      ? "max-h-[500px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div
                    className={`px-6 pb-6 pt-0 ${
                      isExpanded ? "bg-muted/10" : "bg-white/90"
                    }`}
                  >
                    <p
                      className={`leading-relaxed ${
                        isExpanded ? "text-white/90" : "text-on-surface"
                      }`}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
