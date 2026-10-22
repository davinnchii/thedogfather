import type { Metadata } from "next";
import BookingClient from "./BookingClient";

export const metadata: Metadata = {
  title: "Bestill time",
  description:
    "Bestill time hos The Dogfather i Skien – book hundelufting, dagpass, døgnpass eller trening direkte i kalenderen.",
  alternates: {
    canonical: "/booking",
  },
  openGraph: {
    title: "Bestill time | The Dogfather",
    description:
      "Book hundelufting, dagpass, døgnpass eller trening direkte i kalenderen.",
    url: "/booking",
  },
};

export default function BookingPage() {
  return <BookingClient />;
}
