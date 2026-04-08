import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  id?: string;
  /** Section background and padding; default: py-20 px-4 */
  className?: string;
}

export default function Section({
  children,
  id,
  className = "py-20 px-4",
}: SectionProps) {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  );
}
