import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

const variantClasses = {
  primary:
    "px-8 py-4 bg-surface-dark hover:bg-muted text-primary rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl",
  secondary:
    "px-6 py-3 rounded-full font-semibold transition-all border border-neutral-200/50 bg-surface hover:bg-neutral-100",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`${variantClasses[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
