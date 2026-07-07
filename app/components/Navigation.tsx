"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface NavLink {
  label: string;
  href: string;
  openInNewTab?: boolean;
  /** Shorter label on medium desktop when space is tight */
  compactLabel?: string;
}

interface NavigationProps {
  activeSection?: string;
  withLogo?: boolean;
}

const NAV_LINKS: NavLink[] = [
  { label: "Pris & tjenester", href: "/#services" },
  { label: "Valpekurs", href: "/valpekurs" },
  { label: "Grunnkurs", href: "/grunnkurs" },
  { label: "Vilkår", href: "/vilkar" },
  { label: "Om meg", href: "/#qualifications" },
  {
    label: "Utdanning og kompetanse",
    compactLabel: "Utdanning",
    href: "/utdanning",
  },
  { label: "Galleri", href: "/#gallery" },
];

const DESKTOP_LINK_CLASS =
  "shrink-0 whitespace-nowrap px-2 py-1.5 lg:px-2.5 text-[11px] lg:text-xs xl:text-sm 2xl:text-base font-semibold rounded-lg transition-colors";

export default function Navigation({ activeSection = "", withLogo = true }: NavigationProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [pastHero, setPastHero] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastPastHeroRef = useRef(false);

  // On home, hide nav while at the very top (hero).
  // This prevents flicker when `activeSection` lags behind fast scroll gestures.
  const showNav = !isHome ? true : !isAtTop;

  // Ensure body scroll is enabled on mount
  useEffect(() => {
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
  }, []);

  // Track scroll only on home: update nav visibility when past hero (only when value changes to reduce re-renders)
  useEffect(() => {
    if (!isHome) return;
    const handleScroll = () => {
      const scrollY = window.scrollY || 0;
      const viewportHeight = window.innerHeight || 0;
      const nowAtTop = scrollY < 8;
      const nowPastHero = scrollY > viewportHeight * 0.85;

      setIsAtTop(nowAtTop);

      if (nowPastHero !== lastPastHeroRef.current) {
        lastPastHeroRef.current = nowPastHero;
        setPastHero(nowPastHero);
        if (!nowPastHero) setIsMobileMenuOpen(false);
      }

      // Safety: when user returns to top quickly, reset the mobile UI.
      if (nowAtTop) {
        lastPastHeroRef.current = false;
        setPastHero(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // Close mobile menu when viewport becomes desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      // Cleanup on unmount
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const scrollToHash = useCallback((href: string) => {
    const targetId = href.replace(/^#/, "").replace("/", "");
    if (!targetId) return;
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `${window.location.pathname}${href}`);
    }
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent, href: string) => {
      if (!href.startsWith("#")) return;

      e.preventDefault();

      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        setTimeout(() => scrollToHash(href), 150);
      } else {
        scrollToHash(href);
      }
    },
    [isMobileMenuOpen, scrollToHash],
  );

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <>
      {showNav && (
        <nav
          className={`hidden md:fixed sm:block top-0 left-0 right-0 z-[100] transition-all duration-300 ${showNav
            ? "bg-surface shadow-md"
            : "shadow-md backdrop-blur-sm"
            }`}
          style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-5 xl:px-6 relative flex items-center justify-end min-h-[4.5rem] lg:min-h-[5.5rem] xl:min-h-[6rem] py-2">
            {/* Logo – absolute so size doesn't affect nav link layout */}
            {withLogo && (
              <Link
                href="/"
                className="absolute left-3 sm:left-4 lg:left-5 xl:left-6 top-1/2 -translate-y-1/2 z-10 flex items-center transition-opacity hover:opacity-80"
                aria-label="Til forsiden"
              >
                <Image
                  src="/nav_logo.png"
                  alt="The Dogfather"
                  width={250}
                  height={100}
                  className="object-contain h-14 md:h-16 lg:h-20 xl:h-24 2xl:h-28 w-auto"
                  priority
                />
              </Link>
            )}
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center justify-end shrink-0">
              <div className="flex flex-nowrap items-center gap-1 lg:gap-1.5 xl:gap-2 2xl:gap-3">
                {NAV_LINKS.map((link) => {
                  const sectionId = link.href.replace("#", "").replace("/", "");
                  const isRoutePage =
                    link.href.startsWith("/") && !link.href.includes("#");
                  const isActive =
                    !link.openInNewTab &&
                    (isRoutePage
                      ? pathname === link.href
                      : activeSection === sectionId);
                  const linkClass = `${DESKTOP_LINK_CLASS} ${isActive
                    ? "text-primary border-primary"
                    : showNav
                      ? "text-on-primary hover:text-primary hover:bg-neutral-100/80"
                      : "text-white hover:text-white/90 hover:bg-white/10"
                    }`;

                  const linkLabel = link.compactLabel ? (
                    <>
                      <span className="xl:hidden">{link.compactLabel}</span>
                      <span className="hidden xl:inline">{link.label}</span>
                    </>
                  ) : (
                    link.label
                  );

                  if (link.openInNewTab) {
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                      >
                        {linkLabel}
                      </a>
                    );
                  }

                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={linkClass}
                    >
                      {linkLabel}
                    </a>
                  );
                })}

                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, "#contact")}
                  className={`ml-1 lg:ml-2 shrink-0 whitespace-nowrap px-3 lg:px-4 xl:px-5 py-1.5 lg:py-2 text-[11px] lg:text-xs xl:text-sm 2xl:text-base rounded-full font-semibold transition-all relative overflow-hidden group ${showNav
                    ? "bg-primary text-on-primary hover:bg-primary/90"
                    : "bg-white text-on-primary"
                    }`}
                >
                  <span className="relative z-10">Bestill time</span>
                  {!showNav && (
                    <>
                      <span className="absolute inset-0 bg-primary transform scale-0 group-hover:scale-100 origin-bottom-left transition-transform duration-300 ease-out"></span>
                      <span className="absolute inset-0 bg-primary transform scale-0 group-hover:scale-100 origin-top-right transition-transform duration-300 ease-out"></span>
                      <span className="absolute inset-0 flex items-center justify-center text-on-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 font-semibold">
                        Bestill time
                      </span>
                    </>
                  )}
                </a>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Mobile Menu Button - Fixed at bottom on mobile, outside nav container */}
      {showNav && (
        <button
          onClick={toggleMobileMenu}
          className={`md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 sm:w-1/4 w-1/2 max-w-sm px-5 h-14 flex items-center justify-between gap-3 z-[100] transition-all rounded-full shadow-lg ${isMobileMenuOpen
            ? "bg-transparent border-primary border text-primary-200"
            : showNav
              ? "bg-surface text-on-primary"
              : "bg-white/90 text-on-primary backdrop-blur-sm"
            }`}
          aria-label="Åpne meny"
        >
          <span className="sr-only">Toggle menu</span>
          {withLogo && (
            <div className="flex items-center">
              <Image
                src="/nav_logo.png"
                alt="The Dogfather"
                width={120}
                height={48}
                className="object-contain h-10 w-auto"
                priority
              />
            </div>
          )}
          <div className="relative w-6 h-6">
            {/* Hamburger lines */}
            <span
              className={`absolute top-0 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2.5" : ""
                }`}
            />
            <span
              className={`absolute top-2.5 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
            />
            <span
              className={`absolute top-5 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2.5" : ""
                }`}
            />
          </div>
        </button>
      )}

      {/* Mobile Menu Overlay */}
      {showNav && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Menu Sidebar */}
      {showNav && (
        <aside
          className={`fixed top-0 right-0 h-full w-full z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          style={{
            backgroundColor: "#F1ECE4",
            backgroundImage: "linear-gradient(to bottom, #F1ECE4, #F5F3F0)",
          }}
        >
          <div className="h-full flex flex-col p-6 pt-18 gap-10">
            {withLogo && (
              <div className="mb-0">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center transition-opacity hover:opacity-80"
                  aria-label="Til forsiden"
                >
                  <Image
                    src="/nav_logo.png"
                    alt="The Dogfather"
                    width={200}
                    height={100}
                    className="object-contain h-auto w-auto"
                    priority
                  />
                </Link>
                <div className="mt-3 h-px w-full bg-primary/70" />
              </div>
            )}
            <div className="flex flex-col space-y-3">
              {NAV_LINKS.map((link, index) => {
                const sectionId = link.href.replace("#", "").replace("/", "");
                const isRoutePage =
                  link.href.startsWith("/") && !link.href.includes("#");
                const isActive =
                  !link.openInNewTab &&
                  (isRoutePage
                    ? pathname === link.href
                    : activeSection === sectionId);
                const baseClass = `px-5 py-4 text-xl font-semibold rounded-xl transition-all duration-500 ease-out ${isMobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  } ${isActive
                    ? "text-primary bg-white shadow-sm"
                    : "text-on-primary hover:bg-white/80 hover:text-primary"
                  }`;

                if (link.openInNewTab) {
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={baseClass}
                      style={{
                        transitionDelay: isMobileMenuOpen ? `${150 + index * 100}ms` : "0ms",
                      }}
                    >
                      {link.label}
                    </a>
                  );
                }

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={baseClass}
                    style={{
                      transitionDelay: isMobileMenuOpen ? `${150 + index * 100}ms` : "0ms",
                    }}
                  >
                    {link.label}
                  </a>
                );
              })}
              {/* Contact Button - Hidden when in hero section */}
              {activeSection !== "hero" && (
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    setTimeout(() => scrollToHash("#contact"), 150);
                  }}
                  className={`mt-4 px-6 py-4 text-lg font-semibold rounded-full bg-primary text-on-primary hover:bg-primary/90 transition-all duration-500 ease-out text-center shadow-md inline-block ${isMobileMenuOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4"
                    }`}
                  style={{
                    transitionDelay: isMobileMenuOpen ? `${150 + NAV_LINKS.length * 100}ms` : "0ms",
                  }}
                >
                  Kontakt
                </a>
              )}
            </div>
          </div>
        </aside >
      )
      }

      {/* Scroll to top button - mobile only */}
      {pastHero && !isMobileMenuOpen && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="md:hidden fixed bottom-4 right-4 z-[90] h-10 w-10 rounded-full bg-primary text-on-primary shadow-lg flex items-center justify-center border border-primary/80"
          aria-label="Til toppen"
        >
          <span className="sr-only">Til toppen</span>
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </>
  );
}
