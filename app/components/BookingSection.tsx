"use client";

import { Section, Container, SectionTitle, Button } from "./ui";

interface BookingSectionProps {
  onBookTimeClick: () => void;
}

export default function BookingSection({ onBookTimeClick }: BookingSectionProps) {
  return (
    <Section id="booking" className="py-20 px-4 bg-surface">
      <Container size="2xl" className="text-center">
        <SectionTitle size="sm" className="mb-4">
          Bestill time
        </SectionTitle>
        <p className="text-lg text-on-surface-secondary mb-8">
          Fyll ut forespørselsskjemaet over først og send det inn. Når du har
          sendt forespørselen, kan du bestille time hos oss her.
        </p>
        <Button onClick={onBookTimeClick}>
          Bestill time via Calendly
        </Button>
      </Container>
    </Section>
  );
}
