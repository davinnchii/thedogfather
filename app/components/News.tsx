"use client";

import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import ArticleCard from "./ArticleCard";

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

interface NewsProps {
  title?: string;
  articles: Article[];
  id?: string;
}

export default function News({
  title = "I media",
  articles,
  id,
}: NewsProps) {
  const [expandedArticles, setExpandedArticles] = useState<Set<string>>(
    new Set(),
  );
  const articlesSwiperRef = useRef<SwiperType | undefined>(undefined);

  const toggleArticle = (articleId: string) => {
    const newExpanded = new Set(expandedArticles);
    if (newExpanded.has(articleId)) {
      newExpanded.delete(articleId);
    } else {
      newExpanded.add(articleId);
    }
    setExpandedArticles(newExpanded);
  };

  if (articles.length === 0) {
    return null;
  }

  return (
    <section {...(id && { id })} className="py-20 px-4 bg-surface-secondary">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-on-surface">
          {title}
        </h2>

        {articles.length === 2 ? (
          // Show 2 articles side by side without carousel
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onToggle={toggleArticle}
                isExpanded={expandedArticles.has(article.id)}
              />
            ))}
          </div>
        ) : (
          // Carousel for 3+ articles
          <div className="relative overflow-x-hidden md:overflow-visible">
            {/* Custom Prev Button */}
            <button
              onClick={() => articlesSwiperRef.current?.slidePrev()}
              className="custom-swiper-button custom-swiper-button-prev"
              aria-label="Forrige lysbilde"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{
                delay: 6000,
                disableOnInteraction: false,
              }}
              onBeforeInit={(swiper) => {
                articlesSwiperRef.current = swiper;
              }}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                },
              }}
              className="articles-swiper-compact"
            >
              {articles.map((article) => (
                <SwiperSlide key={article.id}>
                  <ArticleCard
                    article={article}
                    onToggle={toggleArticle}
                    isExpanded={expandedArticles.has(article.id)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Next Button */}
            <button
              onClick={() => articlesSwiperRef.current?.slideNext()}
              className="custom-swiper-button custom-swiper-button-next"
              aria-label="Neste lysbilde"
            >
              <svg
                className="w-5 h-5"
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
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
