"use client";

import { useState } from "react";
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

interface PressArticlesProps {
  title?: string;
  articles: Article[];
  id?: string;
}

export default function PressArticles({
  title = "Artikler om The Dogfather",
  articles,
  id = "press",
}: PressArticlesProps) {
  const [expandedArticles, setExpandedArticles] = useState<Set<string>>(
    new Set(),
  );

  const toggleArticle = (articleId: string) => {
    const newExpanded = new Set(expandedArticles);
    if (newExpanded.has(articleId)) {
      newExpanded.delete(articleId);
    } else {
      newExpanded.add(articleId);
    }
    setExpandedArticles(newExpanded);
  };

  return (
    <section id={id} className="py-20 px-4 bg-surface-dark">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-white">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onToggle={toggleArticle}
              isExpanded={expandedArticles.has(article.id)}
              bgClass="bg-muted"
              borderClass="border-muted/30"
              publicationBadgeClass="text-primary bg-primary/20"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
