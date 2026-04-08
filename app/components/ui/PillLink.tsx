import Link from "next/link";
import { ReactNode } from "react";

interface PillLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export default function PillLink({
  href,
  children,
  className = "",
}: PillLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-primary-subtle bg-primary-subtle-hover text-primary font-semibold transition-colors border border-primary-subtle ${className}`.trim()}
    >
      {children}
      <svg
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </Link>
  );
}
