import type { Metadata } from "next";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Galleri",
  description:
    "Se bilder og video fra hverdagen hos The Dogfather i Skien – turer, lek, trening og rolige stunder med hundene.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Galleri | The Dogfather",
    description:
      "Bilder og video fra hverdagen med hundene – trygghet, struktur og god relasjon.",
    url: "/gallery",
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}
