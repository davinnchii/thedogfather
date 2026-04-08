"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface LoaderProps {
  progress?: number;
}

export default function Loader({ progress = 0 }: LoaderProps) {
  return (
    <div className="fixed inset-0 z-[9999] bg-primary flex flex-col items-center justify-center">
      <div className="w-full max-w-md px-8">
        {/* Dog Running Animation */}
        <div className="relative w-full h-48 mb-8 overflow-hidden">
          <motion.div
            className="absolute bottom-0"
            style={{
              left:
                progress === 0
                  ? "0px"
                  : `calc(${progress}% - ${(250 * progress) / 100}px)`,
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
          >
            <Image
              src="/loader.gif"
              alt="Laster"
              width={250}
              height={250}
              className="object-contain"
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          <div className="h-3 bg-white/30 rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full bg-on-primary rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-on-primary text-xl font-semibold text-center"
          >
            {Math.round(progress)}%
          </motion.p>
        </div>
      </div>
    </div>
  );
}
