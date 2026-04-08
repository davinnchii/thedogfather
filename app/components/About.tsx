"use client";

import { useState } from "react";
import { Section, Container, SectionTitle, PillLink } from "./ui";

interface AboutSection {
  heading: string;
  paragraphs: string[];
  linkToServices?: boolean;
}

interface AboutProps {
  title?: string;
  logo?: string;
  sections: AboutSection[];
  signature?: string;
  id?: string;
}

export default function About({
  title = "Om The Dogfather",
  sections,
  signature,
  id = "qualifications",
}: AboutProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <Section
      id={id}
      className="relative py-14 md:py-16 px-4 overflow-hidden bg-surface-secondary"
    >
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, var(--primary) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, var(--primary) 0%, transparent 45%)`,
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-neutral-200/60 to-transparent" />

      <Container size="5xl" className="relative">
        <SectionTitle eyebrow="Bakgrunn & erfaring" divider className="mb-6">
          {title}
        </SectionTitle>

        {/* Logo card */}
        {/* {logo && (
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/20 to-primary-hover/10 rounded-xl blur-sm" />
              <div className="relative flex items-center justify-center h-20 w-36 sm:h-24 sm:w-40 bg-surface rounded-xl p-3 shadow-md border border-neutral-200/60">
                <Image
                  src={logo}
                  alt="Oslo Hundeskole"
                  width={160}
                  height={80}
                  className="object-contain max-h-12 w-auto opacity-90"
                />
              </div>
            </div>
          </div>
        )} */}

        {/* Mobile: vertical timeline (original). Md: domino layout */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 md:grid-rows-[repeat(6,auto)] md:gap-x-8 md:gap-y-1 md:items-start">
          {/* Vertical timeline line - mobile only */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-linear-to-b from-primary/30 via-primary/20 to-transparent md:hidden pointer-events-none" />

          {sections.map((section, index) => {
            const isLeft = index % 2 === 0;
            const pairIndex = Math.floor(index / 2);
            const isSideHighlighted = !isLeft && hoveredRow === pairIndex;
            const desktopRow = isLeft ? pairIndex * 2 + 1 : pairIndex * 2 + 2;
            const colClass = isLeft ? "md:col-start-1" : "md:col-start-2";
            const rowClass =
              desktopRow === 1
                ? "md:row-start-1"
                : desktopRow === 2
                  ? "md:row-start-2"
                  : desktopRow === 3
                    ? "md:row-start-3"
                    : desktopRow === 4
                      ? "md:row-start-4"
                      : desktopRow === 5
                        ? "md:row-start-5"
                        : "md:row-start-6";

            return (
              <div
                key={index}
                className={`flex gap-4 py-4 md:py-0 border-b border-neutral-200/50 last:border-b-0 md:border-b-0 ${colClass} ${rowClass}`}
                onMouseEnter={isLeft ? () => setHoveredRow(pairIndex) : undefined}
                onMouseLeave={isLeft ? () => setHoveredRow(null) : undefined}
              >
                {/* Timeline node - mobile only */}
                <div className="flex md:hidden shrink-0 w-12 justify-center pt-0.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface border border-primary/40 shadow-sm">
                    <span className="text-[10px] font-bold text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                <div
                  className={`flex-1 min-w-0 flex flex-col ${
                    isLeft
                      ? "bg-surface/80 rounded-xl px-4 py-3 shadow-md border border-neutral-200/50 md:py-6"
                      : `pl-4 border-l-2 border-l-primary/40 rounded-r-lg md:bg-primary/10 md:border-l-0 md:rounded-2xl md:border-2 md:border-primary/40 md:px-5 md:py-4 transition-colors duration-200 ${
                          isSideHighlighted
                            ? "md:bg-primary/20 md:border-primary/60"
                            : "md:bg-primary/10"
                        }`
                  }`}
                >
                  <h3 className="mb-1.5 flex items-baseline gap-2 text-lg sm:text-xl md:text-2xl font-bold text-on-surface">
                    <span className="hidden md:inline text-primary/70 font-mono text-xs md:text-sm">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {section.heading}
                  </h3>
                  <div className="space-y-1.5">
                    {section.paragraphs.map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className="text-base md:text-lg font-medium text-on-surface-secondary leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {section.linkToServices && (
                    <div className="mt-2">
                      <PillLink href="#services">
                        Se pris og tjenester
                      </PillLink>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Signature */}
        {signature && (
          <div className="mt-6 pt-4 border-t border-neutral-200/50">
            <p className="text-right">
              <span className="text-xl md:text-2xl font-semibold text-on-surface tracking-tight">
                {signature}
              </span>
              <span className="text-primary text-xl md:text-2xl font-light">.</span>
            </p>
          </div>
        )}
      </Container>
    </Section>
  );
}
