"use client";

import Link from "next/link";
import Logo from "./Logo";

interface FooterProps {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  phone?: string;
  email?: string;
  address?: string;
  googleMapsUrl?: string;
  id?: string;
}

export default function Footer({
  facebook,
  instagram,
  tiktok,
  phone,
  email,
  address,
  googleMapsUrl,
  id = "footer",
}: FooterProps) {
  return (
    <footer
      id={id}
      className="bg-footer text-footer-text py-8 px-4 relative"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Three Column Layout */}
        <div className="flex flex-col md:flex-row flex-wrap gap-6 md:gap-4 lg:gap-6 mb-6 items-center justify-center md:justify-around">
          {/* Column 1: Logo */}
          <div className="flex flex-col items-center md:items-start">
            <Logo
              width={300}
              height={200}
              alt="The Dogfather Logo"
              className="object-contain brightness-0 invert"
            />
          </div>

          {/* Column 2: Contact Info with Map */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold text-white mb-3 leading-tight">
              Kontakt meg
            </h3>
            <div className="space-y-2 text-white/90 mb-3 text-sm">
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                  <span>{phone}</span>
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                  <span>{email}</span>
                </a>
              )}
              {address && (
                <a href={googleMapsUrl ?? "#"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5 shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{address}</span>
                </a>
              )}
            </div>
            
            {/* Map */}

          </div>

          {/* Column 3: Social Links with Slogan */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold text-white mb-1">
              Følg meg
            </h3>
            <p className="text-white/70 mb-3 text-xs text-center md:text-left">
              Følg meg på sosiale medier
            </p>
            <div className="flex items-center gap-3">
            {facebook && (
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 transition-colors text-white hover:text-primary"
                aria-label="Facebook"
              >
                <svg
                    className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            )}
            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-white/15 hover:bg-primary transition-all text-white hover:text-white"
                aria-label="Instagram"
              >
                <svg
                    className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            )}
            {tiktok && (
              <a
                href={tiktok}
                target="_blank"
                rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 transition-colors text-white hover:text-primary"
                aria-label="TikTok"
              >
                <svg
                    className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-white/20 text-center text-white/80 text-xs space-y-1">
          <p>&copy; {new Date().getFullYear()} Alle rettigheter reservert.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <Link
              href="/vilkar"
              className="text-white/90 hover:text-primary transition-colors underline"
            >
              Vilkår og betingelser
            </Link>

          </div>
          <p className="text-white/80 mt-2">
            Nettside av{" "}
            <a
              href="https://ivanzayko.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-semibold hover:text-primary transition-colors underline"
            >
              ivanzayko.dev
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
