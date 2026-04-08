import { ReactNode } from "react";

interface SectionTitleProps {
  children: ReactNode;
  eyebrow?: string;
  divider?: boolean;
  /** Title size: default (lg), sm for smaller sections */
  size?: "sm" | "lg";
  className?: string;
}

const titleSizeClasses = {
  lg: "text-4xl md:text-5xl",
  sm: "text-3xl md:text-4xl",
};

export default function SectionTitle({
  children,
  eyebrow,
  divider = false,
  size = "lg",
  className = "",
}: SectionTitleProps) {
  return (
    <div className={`text-center mb-6 text-on-surface ${className}`.trim()}>
      {eyebrow && (
        <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.25em] text-primary mb-2">
          {eyebrow}
        </span>
      )}
      <h2 className={`${titleSizeClasses[size]} font-bold tracking-tight`}>
        {children}
      </h2>
      {divider && (
        <div className="mt-2 w-14 h-0.5 mx-auto rounded-full bg-primary/60" />
      )}
    </div>
  );
}
