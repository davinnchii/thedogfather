"use client";

import { useState } from "react";
import ArticleCard from "./ArticleCard";
import HeroImage from "./HeroImage";
import { newsData } from "../constants/data";

export default function UnderConstruction() {
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
    <>
      {/* Under Construction Banner */}
      <div className="bg-primary-hover-80 text-on-primary-80 backdrop-blur-webkit py-1.5 px-4 text-center">
        <p className="text-xs sm:text-base font-semibold uppercase tracking-wide">
          🚧 Under oppussing – vi jobber med noe bra! 🚧
        </p>
      </div>

      {/* Hero Image Section */}
      <section className="relative w-full aspect-4/3 md:aspect-video flex items-center justify-center">
        <HeroImage src="/hero.jpg" alt="Will Smith - The Dogfather" />

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <div className="max-w-xl mx-auto">
            <h3 className="text-base sm:text-xl md:text-2xl lg:text-3xl text-on-inverse/90 mb-2 font-medium mt-8 italic [text-shadow:1px_1px_4px_rgba(0,0,0,0.5)]">
              &ldquo;Hos meg er hunden en del av hverdagen – ikke satt til side.<br />
              Små grupper. Tydelige rammer.&rdquo;
            </h3>
            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-on-inverse mb-6 text-right mr-4 mt-4 [text-shadow:1px_1px_4px_rgba(0,0,0,0.5)]">Will Smith</p>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg sm:text-xl text-on-surface-secondary max-w-2xl mx-auto leading-relaxed mb-4">
            Hundetrener og hundeinstruktør
          </p>
          <p className="text-base sm:text-lg text-on-surface-tertiary max-w-2xl mx-auto leading-relaxed">
            Will Smith (59) fikk så mange henvendelser om å hjelpe andre som hadde hund at han til slutt bestemte seg for å utdanne seg som hundetrener og hundeinstruktør. Mens utdannelsen pågår, opererer han som hundelufter under navnet «The DogFather».
          </p>

          {/* Under Construction Notice */}
          <div className="mt-8 p-6 bg-surface-secondary rounded-lg border-2 border-dashed border-primary/30">
            <p className="text-on-surface-secondary">
              <span className="font-semibold text-primary">Merk:</span> Full nettside kommer snart. Sjekk ut artiklene under i mellomtiden!
            </p>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-16 px-4 bg-surface-secondary">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 text-on-surface">
            Artikler om The Dogfather
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {newsData.articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onToggle={toggleArticle}
                isExpanded={expandedArticles.has(article.id)}
                textColorClass="text-on-surface"
                textSecondaryClass="text-on-surface-secondary"
                textTertiaryClass="text-on-surface-tertiary"
                bgClass="bg-surface"
                borderClass="border-divider-medium"
                publicationBadgeClass="text-primary bg-primary/20"
                linkColorClass="text-primary hover:text-primary/80"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

