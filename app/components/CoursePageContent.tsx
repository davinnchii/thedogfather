import Link from "next/link";
import { Container, SectionTitle } from "./ui";
import SponsorsStrip, { type SponsorItem } from "./SponsorsStrip";

export interface CourseSection {
  heading: string;
  paragraphs?: string[];
  listItems?: string[];
}

export interface CoursePracticalRow {
  label: string;
  value: string;
}

export interface CoursePageData {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  tagline?: string;
  badge?: string;
  intro: string[];
  sections: CourseSection[];
  partners?: SponsorItem[];
  practicalInfo?: CoursePracticalRow[];
  price?: string;
  signup?: {
    heading: string;
    paragraphs: string[];
  };
}

interface CoursePageContentProps {
  course: CoursePageData;
}

function CourseCard({
  heading,
  children,
  index,
}: {
  heading: string;
  children: React.ReactNode;
  index?: number;
}) {
  return (
    <article className="rounded-xl border border-neutral-200/60 bg-surface/80 px-5 py-6 md:px-8 md:py-8 shadow-md">
      <h2 className="mb-4 flex items-baseline gap-2 text-xl md:text-2xl font-bold text-on-surface">
        {index !== undefined && (
          <span className="text-primary/70 font-mono text-xs md:text-sm">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        {heading}
      </h2>
      {children}
    </article>
  );
}

export default function CoursePageContent({ course }: CoursePageContentProps) {
  return (
    <section className="relative py-12 md:py-16 px-4 overflow-hidden bg-surface-secondary">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, var(--primary) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, var(--primary) 0%, transparent 45%)`,
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-neutral-200/60 to-transparent" />

      <Container size="5xl" className="relative">
        <SectionTitle eyebrow={course.eyebrow ?? "Kurs"} divider className="mb-4">
          {course.title}
        </SectionTitle>

        {(course.subtitle || course.tagline || course.badge) && (
          <div className="mb-10 text-center space-y-2">
            {course.subtitle && (
              <p className="text-lg md:text-xl font-semibold text-on-surface">
                {course.subtitle}
              </p>
            )}
            {course.tagline && (
              <p className="text-base md:text-lg font-medium text-primary tracking-wide">
                {course.tagline}
              </p>
            )}
            {course.badge && (
              <p className="text-lg md:text-xl font-bold text-on-surface">
                {course.badge}
              </p>
            )}
          </div>
        )}

        {course.intro.length > 0 && (
          <div className="mb-8 md:mb-10 rounded-xl border border-neutral-200/60 bg-surface/80 px-5 py-6 md:px-8 md:py-8 shadow-md space-y-3">
            {course.intro.map((paragraph, index) => (
              <p
                key={index}
                className="text-base md:text-lg font-medium text-on-surface-secondary leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        )}

        <div className="space-y-8 md:space-y-10">
          {course.sections.map((section, index) => (
            <CourseCard key={section.heading} heading={section.heading} index={index}>
              {section.paragraphs && section.paragraphs.length > 0 && (
                <div className="space-y-3 mb-4 last:mb-0">
                  {section.paragraphs.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className="text-base md:text-lg font-medium text-on-surface-secondary leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
              {section.listItems && section.listItems.length > 0 && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 list-disc list-outside pl-5 text-base md:text-lg font-medium text-on-surface-secondary">
                  {section.listItems.map((item) => (
                    <li key={item} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </CourseCard>
          ))}

          {course.partners && course.partners.length > 0 && (
            <CourseCard heading="Samarbeidspartnere">
              <p className="mb-5 text-base md:text-lg font-medium text-on-surface-secondary leading-relaxed">
                Alle kursdeltakere får et eget rabattkort med fordeler hos:
              </p>
              <SponsorsStrip sponsors={course.partners} variant="surface" />
            </CourseCard>
          )}

          {course.practicalInfo && course.practicalInfo.length > 0 && (
            <CourseCard heading="Praktisk informasjon">
              <dl className="space-y-3">
                {course.practicalInfo.map((row) => (
                  <div
                    key={row.label}
                    className="flex flex-col sm:flex-row sm:gap-4 border-b border-neutral-200/50 pb-3 last:border-b-0 last:pb-0"
                  >
                    <dt className="sm:w-44 shrink-0 font-semibold text-on-surface">
                      {row.label}
                    </dt>
                    <dd className="text-base md:text-lg font-medium text-on-surface-secondary leading-relaxed">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
              {course.price && (
                <p className="mt-6 pt-5 border-t border-neutral-200/60 text-xl md:text-2xl font-bold text-primary">
                  Pris: {course.price}
                </p>
              )}
            </CourseCard>
          )}

          {course.signup && (
            <CourseCard heading={course.signup.heading}>
              <div className="space-y-3">
                {course.signup.paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-base md:text-lg font-medium text-on-surface-secondary leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm md:text-base font-semibold text-on-primary hover:bg-primary/90 transition-colors"
                >
                  Send forespørsel
                </Link>
              </div>
            </CourseCard>
          )}
        </div>
      </Container>
    </section>
  );
}
