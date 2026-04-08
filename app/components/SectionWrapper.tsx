"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface SectionWrapperProps {
  children: React.ReactNode;
  sectionId: string;
  onInViewChange: (sectionId: string, inView: boolean) => void;
  rootMargin?: string;
}

export default function SectionWrapper({
  children,
  sectionId,
  onInViewChange,
  rootMargin = "-5% 0px -40% 0px",
}: SectionWrapperProps) {
  const { ref, inView } = useInView({
    rootMargin,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView) {
      onInViewChange(sectionId, true);
    }
  }, [inView, sectionId, onInViewChange]);

  return (
    <div ref={ref} data-section-id={sectionId}>
      {children}
    </div>
  );
}

