import Logo from "../components/Logo";

export const metadata = {
  title: "Salgsvilkår | The Dogfather",
  description:
    "Les salgsvilkår for The Dogfather – vaksine og forsikring, avbestilling, betaling, transport, angrerett, reklamasjon og kontaktinformasjon.",
};

export default function VilkarPage() {
  return (
    <main className="min-h-screen bg-surface text-on-surface">
      <section className="px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto rounded-3xl border border-primary-300 bg-surface shadow-[0_18px_45px_rgba(0,0,0,0.08)] px-4 py-10 md:px-10 md:py-12">
          <div className="max-w-3xl mx-auto">
          <header className="mb-10 md:mb-12">
            <div className="mb-6 flex items-center justify-center">
              <Logo
                href="/"
                width={400}
                height={200}
                alt="The DogFather-logo"
                className="object-contain"
                linkClassName="flex items-center hover:opacity-90 transition-opacity"
              />
            </div>
            <div className="text-center md:text-left">
            <p className="text-sm uppercase tracking-[0.2em] text-muted mb-3">
              The DogFather
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Salgsvilkår
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted max-w-2xl">
              Under finner du vilkår som gjelder for kjøp av tjenester hos The Dogfather.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <span className="hidden md:inline text-muted">•</span>
              <a
                href="/vilkar.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-primary-300 bg-primary-15 px-4 py-2 text-sm font-medium text-foreground hover:bg-primary-25 hover:border-primary-400 transition-colors hover:bg-primary-hover hover:text-white"
              >
                <span>Last ned som PDF</span>
              </a>
            </div>
            </div>
          </header>

          <div className="space-y-8 text-sm md:text-base leading-relaxed bg-surface-dark/5 rounded-2xl border border-neutral-200/70 px-5 py-6 md:px-8 md:py-8 shadow-sm">
            <section>
              <p className="text-sm uppercase tracking-[0.2em] text-muted mb-2">
                Salgsvilkår – The Dogfather
              </p>
              <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                Vilkår før opphold
              </h2>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                1. Vaksine og forsikring
              </h2>
              <p>
                Kun vaksinerte og forsikrede hunder tas imot. Eier må kunne
                fremvise vaksinasjonsbok og forsikringsbevis før opphold.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                2. Løpetid
              </h2>
              <p>Tisper i løpetid tas ikke imot for opphold.</p>
              <p className="mt-2">
                Dersom løpetid oppstår under oppholdet, kan eier bli bedt om å hente hunden. Avbrutt opphold refunderes ikke.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                3. Parter
              </h2>
              <p className="mb-3">
                Selger er The Dogfather v/ Will Smith, organisasjonsnummer 987 653 299.
              </p>
              <div className="space-y-2">
                <div>
                  <p className="font-semibold text-foreground">Registrert adresse</p>
                  <p>Blekebakkvegen 20, 3725 Skien</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Driftsadresse</p>
                  <p>Nedre Hjellegate 18, 3724 Skien</p>
                </div>
                <div className="pt-1 text-sm text-muted space-y-1">
                  <p>
                    E‑post:{" "}
                    <a
                      href="mailto:will@thedogfather.no"
                      className="underline hover:text-primary"
                    >
                      will@thedogfather.no
                    </a>
                  </p>
                  <p>Telefon: +47 97 41 54 14</p>
                  <p>
                    Nettside:{" "}
                    <a
                      href="https://thedogfather.no"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-primary"
                    >
                      thedogfather.no
                    </a>
                  </p>
                </div>
              </div>
              <p className="mt-3">Kjøper er den personen som foretar bestillingen.</p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                4. Tjenester
              </h2>
              <p className="mb-3">The Dogfather tilbyr tjenester innen:</p>
              <ul className="list-disc list-outside pl-5 space-y-1">
                <li>Dagspass</li>
                <li>Døgnpass</li>
                <li>Hundelufting</li>
                <li>Kurs og trening</li>
                <li>Transport av hund</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                5. Priser
              </h2>
              <p className="mb-4">
                Alle priser fremgår av nettsiden og oppgis i norske kroner (NOK).
              </p>

              <div className="rounded-xl border border-white/15 bg-black/15 px-4 py-4">
                <h3 className="text-base font-semibold text-foreground mb-2">
                  Tillegg – røde dager og høysesong
                </h3>
                <p className="text-muted mb-3">
                  Sommer (uke 26–32) regnes som høysesong.
                </p>
                <div className="space-y-3">
                  <p>
                    <span className="font-semibold text-foreground">Røde dager og skoleferier:</span>{" "}
                    +100 kr per døgn for døgnpass; +50 kr for dagpass og hundelufting.
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Jul, nyttår og påske:</span>{" "}
                    +200 kr per døgn for døgnpass.
                  </p>
                </div>
                <p className="mt-3 text-sm text-muted">
                  Tillegg gjelder per døgn, uavhengig av om det er én eller to hunder fra samme husstand.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                6. Betaling
              </h2>
              <p className="mb-3">
                Betaling skjer før oppstart av avtalt tjeneste, og kan gjennomføres via Vipps eller bankoverføring.
              </p>
              <p className="mb-3">
                Bestillingen anses som bekreftet først når betaling er mottatt.
              </p>
              <p>
                Ved manglende betaling forbeholder The Dogfather seg retten til å avlyse avtalen.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                7. Levering av tjeneste
              </h2>
              <p className="mb-3">
                Tjenesten anses levert når avtalt hundepass, kurs eller annen tjeneste er gjennomført i henhold til avtale.
              </p>
              <p>Tidspunkt for levering avtales på forhånd.</p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                8. Avbestilling og endring
              </h2>
              <p className="mb-3">Avbestilling er kostnadsfri innen følgende frister:</p>
              <ul className="list-disc list-outside pl-5 space-y-1 mb-3">
                <li>Privattime (hundetrening): senest 48 timer før avtalt oppstart.</li>
                <li>Hundelufting: senest 48 timer før avtalt oppstart.</li>
                <li>Dagpass: senest 48 timer før avtalt oppstart.</li>
                <li>Døgnpass: senest 72 timer før avtalt oppstart.</li>
                <li>Kurs: senest 14 dager før kursstart.</li>
              </ul>
              <p className="mb-3">
                Ved avbestilling etter gjeldende frist faktureres avtalt pris. Dette gjelder også ved sykdom, da tiden eller plassen er reservert.
              </p>
              <p className="mb-3">
                Ved manglende oppmøte («no-show») faktureres avtalt pris i sin helhet.
              </p>
              <p className="mb-3">
                Endringer i bestillingen må avtales innen samme frister som gjelder for avbestilling.
              </p>
              <p className="mb-1 font-semibold text-foreground">For kurs gjelder i tillegg:</p>
              <p>
                Ved avbestilling mindre enn 14 dager før kursstart refunderes ikke kursavgiften. Dersom plassen blir fylt av en annen deltaker, kan kursavgiften etter avtale overføres til et senere kurs.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                9. Transport
              </h2>
              <p className="mb-3">
                Henting og levering innen Skien og Porsgrunn kan avtales mot et tillegg på kr 100 tur/retur.
              </p>
              <p className="mb-3">
                All transport skjer i krasjtestet MIMsafe Variocage-bur eller med krasjtestet MIMsafe Allsafe-sikkerhetssele, testet i henhold til ISO 27955:2010.
              </p>
              <p className="mb-3">Hundens sikkerhet under transport har høyeste prioritet.</p>
              <p>
                The Dogfather forbeholder seg retten til å avvise transport dersom det vurderes som uforsvarlig.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                10. Angrerett
              </h2>
              <p className="mb-3">
                For tjenester som gjelder pass av hund, bortfaller angreretten når tjenesten er påbegynt.
              </p>
              <p>
                Ved bestilling samtykker kunden til at tjenesten kan starte før angrefristen utløper.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                11. Reklamasjon
              </h2>
              <p className="mb-3">
                Dersom kunden mener det foreligger en mangel ved tjenesten, må dette meldes til The Dogfather så snart som mulig.
              </p>
              <p>Henvendelser behandles fortløpende.</p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                12. Konfliktløsning
              </h2>
              <p className="mb-3">Eventuelle tvister skal søkes løst i minnelighet.</p>
              <p>
                Dersom dette ikke lykkes, kan saken bringes inn for Forbrukertilsynet eller behandles i henhold til norsk lov.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                13. Bestilling og kontakt
              </h2>
              <p className="mb-3">
                Forespørsler og bestillinger skjer via e‑post eller annet avtalt system.
              </p>
              <p className="mb-3">
                Bestillingen er bindende når den er bekreftet og betaling er mottatt.
              </p>
              <p className="mb-6">
                Ta gjerne kontakt dersom du har spørsmål om vilkårene eller ønsker å avtale et opphold.
              </p>

              <div className="text-sm text-muted space-y-1">
                <p>Med vennlig hilsen</p>
                <p className="font-semibold text-foreground">Will – The Dogfather</p>
              </div>
            </section>
          </div>
          </div>
        </div>
      </section>
    </main>
  );
}

