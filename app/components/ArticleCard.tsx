"use client";

import Image from "next/image";

interface Article {
  id: string;
  publication: string;
  date: string;
  headline: string;
  excerpt: string;
  fullText?: string;
  image?: string;
  link?: string;
}

interface ArticleCardProps {
  article: Article;
  onToggle?: (articleId: string) => void;
  isExpanded?: boolean;
  textColorClass?: string;
  textSecondaryClass?: string;
  textTertiaryClass?: string;
  bgClass?: string;
  borderClass?: string;
  publicationBadgeClass?: string;
  linkColorClass?: string;
}

export default function ArticleCard({
  article,
  onToggle,
  isExpanded = false,
  textColorClass = "text-white",
  textSecondaryClass = "text-white/90",
  textTertiaryClass = "text-white/70",
  bgClass = "bg-surface-dark",
  borderClass = "border-muted/30",
  publicationBadgeClass = "text-primary bg-primary/20",
  linkColorClass = "text-primary hover:text-white",
}: ArticleCardProps) {
  const handleToggle = () => {
    if (onToggle) {
      onToggle(article.id);
    }
  };

  // Hover: use light bg only when card is already light; otherwise keep dark hover so white text stays readable
  const isLightBackground =
    bgClass === "bg-surface" ||
    bgClass.includes("surface-secondary") ||
    (bgClass.includes("white") && !bgClass.includes("surface-dark"));
  const hoverBgClass = isLightBackground ? "hover:bg-surface-secondary" : "hover:bg-muted";

  return (
    <article
      className={`${bgClass} backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl ${hoverBgClass} transition-all duration-300 overflow-hidden group h-full flex flex-col border ${borderClass}`}
    >
      {article.image && (
        <div className="relative h-40 w-full overflow-hidden">
          <Image
            src={article.image}
            alt={article.headline}
            fill
            loading="lazy"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded ${publicationBadgeClass}`}
          >
            {article.publication}
          </span>
          <span className={`text-sm ${textTertiaryClass}`}>{article.date}</span>
        </div>
        <h4 className={`text-lg font-bold ${textColorClass} mb-3 line-clamp-2`}>
          {article.headline}
        </h4>
        <div className="flex-grow">
          <p
            className={`${textSecondaryClass} leading-relaxed mb-4 text-base ${isExpanded ? "" : "line-clamp-3"}`}
          >
            {isExpanded && article.fullText
              ? article.fullText
              : article.excerpt}
          </p>
        </div>
        <div
          className={`flex items-center justify-between mt-auto pt-4 border-t ${borderClass}`}
        >
          {article.link && (
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center font-semibold text-sm transition-colors ${linkColorClass}`}
            >
              Les mer
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          )}
          {article.fullText && onToggle && (
            <button
              onClick={handleToggle}
              className={`inline-flex items-center font-semibold text-sm transition-colors ml-auto ${linkColorClass}`}
            >
              {isExpanded ? "Vis mindre" : "Vis mer"}
              <svg
                className={`w-4 h-4 ml-2 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
