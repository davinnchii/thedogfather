import { ReactNode } from "react";

type CardVariant = "surface" | "mint" | "mintDetail" | "mintCard";

const variantClasses: Record<CardVariant, string> = {
  surface:
    "bg-surface-80 rounded-xl shadow-md border border-neutral-200-50",
  mint:
    "bg-services-card border-services-card rounded-xl border-2 bg-services-card-hover transition-all duration-300 hover:shadow-lg",
  mintDetail:
    "bg-services-detail border-services-detail rounded-lg shadow-sm border p-4",
  mintCard:
    "bg-services-card border-services-card rounded-lg shadow-sm border",
};

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
}

export default function Card({
  children,
  variant = "surface",
  className = "",
}: CardProps) {
  return (
    <div
      className={`${variantClasses[variant]} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
