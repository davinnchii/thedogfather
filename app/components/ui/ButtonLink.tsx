import Link from "next/link";
import { ReactNode } from "react";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  /** Full-width block style */
  block?: boolean;
  /** Mint hover effect (scale corners); default true */
  hoverEffect?: boolean;
  className?: string;
}

export default function ButtonLink({
  href,
  children,
  block = true,
  hoverEffect = true,
  className = "",
}: ButtonLinkProps) {
  const base =
    "relative py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border font-semibold overflow-hidden group text-center bg-services-card border-services-card text-white";

  return (
    <Link
      href={href}
      className={`${base} ${block ? "block w-full" : "inline-block"} ${className}`.trim()}
    >
      {hoverEffect ? (
        <>
          <span className="relative z-10 block">{children}</span>
          <span className="absolute inset-0 bg-primary-hover transform scale-0 group-hover:scale-100 origin-bottom-left transition-transform duration-300 ease-out" />
          <span className="absolute inset-0 bg-primary-hover transform scale-0 group-hover:scale-100 origin-top-right transition-transform duration-300 ease-out" />
          <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 font-semibold">
            {children}
          </span>
        </>
      ) : (
        <span className="relative z-10 block">{children}</span>
      )}
    </Link>
  );
}
