"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Section,
  Container,
  SectionTitle,
  Card,
  ButtonLink,
  Price,
} from "./ui";

interface ServiceDetail {
  title: string;
  description: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  price?: string;
  priceNote?: string;
  details: ServiceDetail[];
}

interface SeasonalAddendum {
  title: string;
  intro: string;
  blocks: Array<{ heading: string; lines: string[] }>;
  footnote: string;
}

interface ServicesProps {
  title?: string;
  services: Service[];
  id?: string;
  seasonalAddendum?: SeasonalAddendum;
}

const bgVariant = "bg-services-card border-services-card";

function SeasonalAddendumBlock({ addendum }: { addendum: SeasonalAddendum }) {
  return (
    <div className="rounded-lg border border-white/15 bg-black/25 px-4 py-3 md:px-5 md:py-4 shadow-md shadow-black/30">
      <h3 className="text-sm font-bold text-white mb-1.5">{addendum.title}</h3>
      <p className="text-sm text-white-90 leading-snug mb-2">{addendum.intro}</p>
      <div className="text-sm text-white-90 leading-relaxed space-y-1">
        {addendum.blocks.map((block) => (
          <p key={block.heading}>
            <span className="font-semibold text-highlight">{block.heading}:</span>{" "}
            {block.lines.join("; ")}.
          </p>
        ))}
      </div>
      <p className="text-xs text-white-90 mt-2 leading-snug">{addendum.footnote}</p>
    </div>
  );
}

export default function Services({
  title = "Mine tjenester",
  services,
  id = "services",
  seasonalAddendum
}: ServicesProps) {

  return (
    <Section id={id} className="py-20 px-4 bg-dark">
      <Container>
        <SectionTitle className="mb-8 text-white">{title}</SectionTitle>

        {seasonalAddendum && (
          <motion.div
            initial={{ y: 30 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.35,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{ willChange: "transform" }}
            className="mx-auto mb-10 lg:mb-12 max-w-3xl"
          >
            <SeasonalAddendumBlock addendum={seasonalAddendum} />
          </motion.div>
        )}

        <div className="space-y-24">
          {services.map((service, index) => {
            const isEven = index % 2 === 1;
            return (
              <motion.div
                key={service.id}
                initial={{ y: 30 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.05,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                style={{ willChange: "transform" }}
                className={`flex flex-col ${isEven ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 items-start`}
              >
                <div className="w-full lg:w-1/2 lg:sticky lg:top-24">
                  <div
                    className="relative aspect-video rounded-lg overflow-hidden shadow-lg border-2 border-services-image bg-services-card"
                  >
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      loading="lazy"
                      className="object-cover"
                    />
                  </div>
                </div>

                <Card
                  variant="mint"
                  className={`w-full lg:w-1/2 p-6 md:p-8 border-2 ${bgVariant}`}
                >
                  <div className="mb-4">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                      {service.title}
                    </h3>
                    {service.price && (
                      <Price
                        amount={service.price}
                        note={service.priceNote}
                      />
                    )}
                  </div>
                  <p className="text-white-90 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {service.details.length > 0 && (
                    <div className="space-y-3 mb-6">
                      {service.details.map((detail, idx) => (
                        <Card key={idx} variant="mintDetail">
                          <h4 className="font-semibold text-highlight mb-2">
                            {detail.title}
                          </h4>
                          <p className="text-white-80 text-sm">
                            {detail.description}
                          </p>
                        </Card>
                      ))}
                    </div>
                  )}

                  <ButtonLink href={`/services/${service.id}`}>
                    Se fullstendige detaljer
                  </ButtonLink>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
