"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StaggerAnimationProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const getItemVariants = () => {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.21, 1.11, 0.81, 0.99] as [number, number, number, number],
      },
    },
  };
};

export default function StaggerAnimation({
  children,
  className = "",
  staggerDelay = 0,
}: StaggerAnimationProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={className}
      style={{ transitionDelay: `${staggerDelay}s` }}
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div key={index} variants={getItemVariants()}>
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={getItemVariants()}>
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}
