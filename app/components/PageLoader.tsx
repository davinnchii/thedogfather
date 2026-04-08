"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "./Loader";

interface PageLoaderProps {
  children: React.ReactNode;
}

/** Only above-the-fold assets that affect first paint. Below-fold images load lazily and are cached for repeat visits. */
const CRITICAL_IMAGE_SRCS = ["/hero.jpg", "/loader.gif", "/logo.svg"];

export default function PageLoader({ children }: PageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const lastProgressRef = useRef(0);
  const scrollLockRef = useRef<string | null>(null);

  const setProgressOnce = (value: number) => {
    const next = Math.min(100, Math.max(0, Math.round(value)));
    if (next !== lastProgressRef.current) {
      lastProgressRef.current = next;
      setProgress(next);
    }
  };

  useEffect(() => {
    let loadedCount = 0;
    const totalImages = CRITICAL_IMAGE_SRCS.length;
    let imagesComplete = false;
    let loadFired = false;
    let fontsReady = false;

    const checkReady = () => {
      if (!imagesComplete || !loadFired || !fontsReady) return;
      setProgressOnce(100);
      setIsLoading(false);
    };

    const checkAllLoaded = () => {
      loadedCount++;
      const imageProgress = (loadedCount / totalImages) * 70;
      setProgressOnce(10 + imageProgress);
      if (loadedCount === totalImages && !imagesComplete) {
        imagesComplete = true;
        checkReady();
      }
    };

    // Preload critical images (no artificial delay; when cached this finishes immediately)
    CRITICAL_IMAGE_SRCS.forEach((src) => {
      const img = new Image();
      img.onload = checkAllLoaded;
      img.onerror = checkAllLoaded;
      img.src = src;
    });
    setProgressOnce(10);

    // Fonts
    document.fonts.ready.then(() => {
      fontsReady = true;
      setProgressOnce(85);
      checkReady();
    });

    // Window load (scripts, styles, other resources)
    const onLoad = () => {
      loadFired = true;
      setProgressOnce(95);
      checkReady();
    };
    if (document.readyState === "complete") {
      loadFired = true;
      setProgressOnce(95);
      checkReady();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    // Fallback: if something never fires (e.g. font/load edge case), hide loader after short timeout. No artificial minimum duration before that.
    const fallbackTimer = setTimeout(() => {
      setProgressOnce(100);
      setIsLoading(false);
    }, 1500);

    return () => {
      window.removeEventListener("load", onLoad);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Block scrolling while loader is visible; restore when hidden. No layout or style change to page content.
  useEffect(() => {
    if (isLoading) {
      scrollLockRef.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = scrollLockRef.current ?? "";
      scrollLockRef.current = null;
    }
    return () => {
      if (scrollLockRef.current !== null) {
        document.body.style.overflow = scrollLockRef.current;
        scrollLockRef.current = null;
      }
    };
  }, [isLoading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Loader progress={progress} />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
