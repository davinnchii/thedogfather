"use client";

import { ReactNode } from "react";
import SectionWrapper from "../SectionWrapper";
import ScrollAnimation from "../ScrollAnimation";

interface TrackedSectionProps {
  sectionId: string;
  onInViewChange: (sectionId: string, inView: boolean) => void;
  children: ReactNode;
  /** If set, wraps children in ScrollAnimation with this delay */
  scrollAnimation?: { delay?: number };
}

/**
 * Wraps a section with viewport tracking (for nav) and optional scroll-in animation.
 * Use on the home page to keep JSX readable.
 */
export default function TrackedSection({
  sectionId,
  onInViewChange,
  children,
  scrollAnimation,
}: TrackedSectionProps) {
  const content = scrollAnimation ? (
    <ScrollAnimation delay={scrollAnimation.delay ?? 0.1}>
      {children}
    </ScrollAnimation>
  ) : (
    children
  );

  return (
    <SectionWrapper sectionId={sectionId} onInViewChange={onInViewChange}>
      {content}
    </SectionWrapper>
  );
}
