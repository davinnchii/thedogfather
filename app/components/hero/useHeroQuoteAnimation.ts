"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";

/** Split-type + GSAP intro for the hero quote block (runs once on mount). */
export function useHeroQuoteAnimation(
  quoteRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const el = quoteRef.current;
    if (!el) return;

    const split = new SplitType(el, {
      types: "lines,words,chars",
      tagName: "span",
    });

    gsap.from(el.querySelectorAll(".word"), {
      opacity: 0.3,
      duration: 0.5,
      ease: "power3.in",
      stagger: 0.1,
    });

    const words = el.querySelectorAll(".word");
    gsap.set(words, { opacity: 0.3, color: "#ffffff" });
    gsap.to(words, {
      opacity: 1,
      duration: 0.5,
      ease: "power3.in",
      stagger: 0.1,
      delay: 0.3,
    });

    return () => {
      split.revert();
    };
  }, [quoteRef]);
}
