// Hero Section Data
export const heroData = {
  title: "Will Smith",
  description: "The Dogfather",
  ctaText: "Send forespørsel",
  backgroundImage: "/hero.jpg",
  backgroundImageMobile: "/hero_mobile.jpg",
  // Valgfritt `href` per logo: intern sti ("/…") eller ekstern URL (https://…)
  sponsors: [
    { src: "/pet_xl.png", alt: "PetXL", href: "https://www.petxl.no/vare-butikker/petxl-skien" },
    { src: "/vet_xl.png", alt: "VetXL", href: "https://www.vetxl.no/klinikker/skien" },
    { src: "/lykke.png", alt: "Lykke kafe", href: "https://www.lykkekafe.no/" },
    { src: "/pelskalr.png", alt: "Pelsklar AS", href: "https://www.pelsklar.no/" },
  ],
};

// Gallery Section Data – items are loaded from public/gallery folder via GET /api/gallery
export const galleryData = {
  items: [] as Array<{ id: string; image?: string; video?: string; title: string }>,
  // Forsiden: 5 bilder + 1 video (6 elementer) i hovedgalleriet
  maxFeatured: 6,
  showMoreHref: "/gallery",
};

// Services Section Data
export const servicesData = {
  services: [
    {
      id: "hundelufting",
      title: "Hundelufting",
      description:
        "Etter avtale kan jeg låse meg inn mens eier er på jobb. Lufter hunden i nærmiljøet. Perfekt løsning for eiere som jobber og trenger at hunden får luft og bevegelse i løpet av dagen.",
      image: "/gallery/6.jpg",
      price: "350 kr",
      targetAudience:
        "Ideal for eiere som jobber og trenger at hunden får luft og bevegelse i løpet av dagen. Perfekt for hunder som trenger regelmessig mosjon og som kan være alene hjemme.",
      benefits: [
        "Hunden får nødvendig bevegelse og luft i løpet av dagen",
        "Fleksibel løsning - jeg låser meg inn etter avtale",
        "Inkluderer kjøring til og fra oppdrag",
        "Rabatt for 2 hunder fra samme husstand",
        "Trygg og pålitelig service",
      ],
      faq: [
        {
          question: "Hvor lenge varer en hundelufting?",
          answer:
            "En hundelufting varer 45 minutter og inkluderer kjøring til og fra oppdraget.",
        },
        {
          question: "Hvordan fungerer det med innlåsing?",
          answer:
            "Etter avtale kan jeg låse meg inn mens eier er på jobb. Dette avtales på forhånd for å sikre trygghet og tillit.",
        },
        {
          question: "Hva koster det for 2 hunder?",
          answer:
            "For 2 hunder fra samme husstand koster det 450 kr for 45 minutter inkludert kjøring.",
        },
        {
          question: "Hvor langt i nærmiljøet lufter du hunden?",
          answer:
            "Jeg lufter hunden i nærmiljøet rundt hjemmet. Ruten tilpasses hundenes behov og kondisjon.",
        },
      ],
      details: [
        {
          title: "45 minutter lufting",
          description:
            "Inkluderer kjøring til og fra oppdraget.",
        },
        {
          title: "Fleksibel innlåsing",
          description:
            "Etter avtale kan jeg låse meg inn mens eier er på jobb.",
        },
        {
          title: "Rabatt for flere hunder",
          description:
            "2 hunder fra samme husstand får pris på 450 kr.",
        },
      ],
    },
    {
      id: "dagpass",
      title: "Dagpass",
      description:
        "Dagpass hvor hunden får omsorg og oppmerksomhet mens eier er borte. Fleksibel tidslengde tilpasset ditt behov.",
      image: "/gallery/7.jpg",
      price: "350 kr",
      targetAudience:
        "Perfekt for eiere som trenger dagpass for hunden sin, enten det er noen timer eller hele dagen. Ideelt for hunder som trenger mer oppmerksomhet og omsorg enn ved vanlig hundelufting.",
      benefits: [
        "Fleksibel tidslengde - fra noen timer til hele dagen",
        "Hunden får omsorg og oppmerksomhet mens du er borte",
        "Tydelige priser basert på tidslengde",
        "Rabatt for 2 hunder fra samme husstand",
        "Trygg og pålitelig omsorg",
      ],
      faq: [
        {
          question: "Hvor lenge kan hunden være på dagpass?",
          answer:
            "Dagpass kan vare opptil 4 timer for 350 kr. Utover 4 timer legges det til 100 kr per påbegynte time.",
        },
        {
          question: "Hva inkluderer dagpass?",
          answer:
            "Dagpass inkluderer omsorg, oppmerksomhet, og tilsyn med hunden mens eier er borte. Tidslengden tilpasses ditt behov.",
        },
        {
          question: "Hva koster det for 2 hunder?",
          answer:
            "For 2 hunder fra samme husstand koster dagpass 550 kr, uavhengig av tidslengde (opptil 4 timer).",
        },
        {
          question: "Hvordan beregnes tillegg for timer over 4 timer?",
          answer:
            "Utover 4 timer legges det til 100 kr per påbegynte time. For eksempel: 5 timer koster 350 kr + 100 kr = 450 kr.",
        },
      ],
      details: [
        {
          title: "Opptil 4 timer",
          description:
            "Standard dagpass på opptil 4 timer for 350 kr.",
        },
        {
          title: "Fleksibel forlengelse",
          description:
            "Utover 4 timer legges det til 100 kr per påbegynte time.",
        },
        {
          title: "Rabatt for flere hunder",
          description:
            "2 hunder fra samme husstand får pris på 550 kr.",
        },
      ],
    },
    {
      id: "dognpass",
      title: "Døgnpass – hjemmebasert",
      description:
        "Hunden bor i mitt hjem og får full omsorg døgnet rundt. Må kunne omgåes min 2 år gamle Border Collie Krutt. Nordic Nature-fôr inkludert.",
      image: "/dognpass.jpg",
      price: "650 kr",
      priceNote:
        "650 kr per døgn. Ved flere døgn betales døgnpris per døgn. Kun timer etter siste døgn: 100 kr per time. 2 hunder samme husstand: 1.100 kr per døgn.",
      targetAudience:
        "Perfekt for eiere som skal bort i lengre perioder og ønsker at hunden skal bo i et hjemmemiljø. Hunden må kunne omgåes andre hunder, spesielt min 2 år gamle Border Collie Krutt.",
      benefits: [
        "Hunden bor i hjemmemiljø i stedet for kennel",
        "Full omsorg døgnet rundt",
        "Nordic Nature-fôr inkludert",
        "Et norsk premiumfôr med høy kvalitet, rikt på protein og omega-3 – for sunn og aktiv hund.",
        "Sosialisering med min Border Collie Krutt",
        "Timepris (100 kr) gjelder kun timer etter siste avtalte døgn",
      ],
      faq: [
        {
          question: "Hvor lenge kan hunden bo hos deg?",
          answer:
            "Du betaler døgnpris per døgn. Timer utover siste avtalte døgn faktureres med 100 kr per time.",
        },
        {
          question: "Kan flere hunder bo hos deg samtidig?",
          answer:
            "Kun én hund om gangen om de ikke kommer fra samme husstand. Hunder fra samme husstand kan bo sammen.",
        },
        {
          question: "Hva betyr det at hunden må kunne omgåes Krutt?",
          answer:
            "Hunden må kunne omgåes min 2 år gamle Border Collie Krutt, da hun også bor i hjemmet mitt. Dette sikrer trygg og positiv sosialisering.",
        },
        {
          question: "Hva inkluderer prisen?",
          answer:
            "Prisen inkluderer omsorg, opphold, og Nordic Nature-fôr. For 2 hunder fra samme husstand koster det 1.100 kr per døgn.",
        },
        {
          question: "Hvordan beregnes tillegg for timer over siste døgn?",
          answer:
            "Kun timer etter siste avtalte døgn: 100 kr per time. Eksempel: 26 timer (ett døgn + 2 timer) blir 650 kr + 200 kr = 850 kr.",
        },
      ],
      details: [
        {
          title: "Hjemmebasert omsorg",
          description:
            "Hunden bor i mitt hjem og får full omsorg døgnet rundt.",
        },
        {
          title: "Fôr er inkludert i prisen",
          description:
            "Nordic Nature hundefor er laget i Norge med norske råvarer.Du trenger ikke bekymre deg for mat.",
        },
        {
          title: "Sosialisering",
          description:
            "Hunden får mulighet til å omgåes min Border Collie Krutt i et trygt miljø.",
        },
      ],
    },
    {
      id: "hundetrening",
      title: "Privat hundetrening",
      description:
        "Privat hundetrening i ulike miljøer. Ute i miljøer i nærheten av treningslokale, innendørs treningslokale på 150 kvm, eller ute i 70 kvm inngjerdet bakgård sentrumsnært i Skien.",
      image: "/gallery/12.jpg",
      price: "650 kr",
      priceNote: "60 minutter",
      targetAudience:
        "Perfekt for eiere som ønsker personlig tilpasset trening for hunden sin. Ideelt for hunder som trenger spesialisert oppfølging eller eiere som ønsker å lære sammen med hunden sin.",
      benefits: [
        "Personlig tilpasset trening",
        "Fleksible treningslokaler - ute, innendørs, eller hjemme hos deg",
        "150 kvm innendørs treningslokale",
        "70 kvm inngjerdet bakgård sentrumsnært i Skien",
        "Mulighet for trening i ulike miljøer",
      ],
      faq: [
        {
          question: "Hvor lenge varer en treningsøkt?",
          answer:
            "En treningsøkt varer 60 minutter og koster 650 kr.",
        },
        {
          question: "Hvor kan treningen foregå?",
          answer:
            "Treningen kan foregå ute i miljøer i nærheten av treningslokale, innendørs i 150 kvm treningslokale, eller ute i 70 kvm inngjerdet bakgård sentrumsnært i Skien.",
        },
        {
          question: "Kan jeg få trening hjemme hos meg?",
          answer:
            "Ja, jeg tilbyr også trening hjemme hos kunde. Dette koster 650 kr + 150 kr for kjøring og reisetid i Skien/Porsgrunn.",
        },
        {
          question: "Hva slags trening tilbyr du?",
          answer:
            "Jeg tilbyr privat hundetrening tilpasset ditt og hundens behov. Treningen kan fokusere på grunnleggende lydighet, atferd, eller spesifikke utfordringer.",
        },
      ],
      details: [
        {
          title: "Innendørs treningslokale",
          description:
            "150 kvm treningslokale for trening innendørs uavhengig av vær.",
        },
        {
          title: "Utendørs områder",
          description:
            "70 kvm inngjerdet bakgård sentrumsnært i Skien, eller ute i miljøer i nærheten av treningslokale.",
        },
        {
          title: "Hjemmetrening",
          description:
            "Mulighet for trening hjemme hos deg med tillegg for kjøring og reisetid i Skien/Porsgrunn.",
        },
      ],
    },
  ],
  /** Vises rett under «Mine tjenester» på prislisten */
  seasonalAddendum: {
    title: "Tillegg – røde dager og høysesong",
    intro: "Sommer (uke 26–32) regnes som høysesong.",
    blocks: [
      {
        heading: "Røde dager og skoleferier",
        lines: [
          "+100 kr per døgn for døgnpass",
          "+50 kr for dagpass og hundelufting",
        ],
      },
      {
        heading: "Jul, nyttår og påske",
        lines: ["+200 kr per døgn for døgnpass"],
      },
    ],
    footnote:
      "Tillegg gjelder per døgn, uavhengig av om det er én eller to hunder fra samme husstand.",
  },
};

// About / Om meg Section Data (replaces certifications)
export const aboutData = {
  title: "Om The Dogfather",
  logo: "/ohs_logo.png",
  sections: [
    {
      heading: "Faglig bakgrunn",
      paragraphs: [
        "Jeg er utdannet hundetrener og hundeinstruktør ved Oslo Hundeskole.",
        "Jeg har også jobbet som instruktør og gruppeleder under Oslo Hundeskoles Barn og Hund-sommerleir. Gjennom dette arbeidet har jeg fått bred erfaring med ulike hunder, personligheter og behov – og ikke minst viktigheten av å skape trygghet i samspill mellom hund og menneske.",
      ],
    },
    {
      heading: "Hund har vært en naturlig del av livet mitt",
      paragraphs: [
        "For meg handler dette om omsorg, ansvar og ekte engasjement.",
      ],
    },
    {
      heading: "Hundelufting, dagpass, døgnpass og hundetrening",
      paragraphs: [
        "Jeg tilbyr hundelufting, dagpass, hjemmebasert døgnpass og hundetrening.",
        "Hundelufting er en stor del av hverdagen min. Jeg kan etter avtale komme hjem til deg mens du er på jobb, låse meg inn og lufte hunden i dens eget nærområde. Turene tilpasses den enkelte hund – både tempo, lengde og behov.",
        "Dagpass og døgnpass foregår i rolige og trygge omgivelser. På døgnpass bor hunden inne sammen med meg og min Border Collie på 2 år, Krutt. Den blir en del av hverdagen i et hjemlig miljø med trygghet, nærhet og tilstedeværelse.",
        "Hundetrening tilbys som privat veiledning, med fokus på forståelse, samarbeid og trygg utvikling.",
      ],
      linkToServices: true,
    },
    {
      heading: "Målet mitt",
      paragraphs: [
        "Målet mitt er at du skal kunne levere hunden din med god samvittighet og vite at den er godt ivaretatt.",
      ],
    },
    {
      heading: "Gode rammer – inne og ute",
      paragraphs: [
        "Jeg disponerer et innendørs treningslokale i Skien sentrum på 150 kvm, med et inngjerdet uteområde på 70 kvm i direkte tilknytning. Dette gir trygge rammer for aktivitet, lek og tilpasset trening – uansett vær.",
        "Jeg bor i tillegg nær flotte turområder med grus, gress og asfalt, og kjører jevnlig hundene ut i skog og mark for varierte turer. Aktiviteten tilpasses alltid den enkelte hund – både fysisk og mentalt.",
      ],
    },
    {
      heading: "Sikkerhet i alle ledd",
      paragraphs: [
        "Sikkerhet har høy prioritet hos meg.",
        "All transport skjer i svenske kræsjtestede MIMsafe Variocage-bur eller med kræsjtestet MIMsafe bilsele.",
        "For å sikre et trygt miljø må alle hunder være vaksinert og forsikret for at jeg skal kunne ta dem imot.",
      ],
    },
  ],
  signature: "Will",
};

// Kept for any legacy imports (e.g. qualificationsData)
export const certificationsData = {
  benefits: [] as Array<{ type: "instruktor" | "coach"; titles: string[]; description: string; logo: string }>,
};

// News Section Data (kept for backward compatibility)
export const newsData = {
  articles: [
    {
      id: "1",
      publication: "Telemarksavisa",
      date: "September 26, 2023",
      headline: "Will er byens «Dogfather»: – Jeg har dogmobil også",
      excerpt:
        "Will Smith (59) fikk så mange henvendelser om å hjelpe andre som hadde hund at han til slutt bestemte seg for å utdanne seg som hundetrener og hundeinstruktør. Mens utdannelsen pågår, opererer han som hundelufter under navnet «The DogFather».",
      fullText:
        "Will Smith (59) fikk så mange henvendelser om å hjelpe andre som hadde hund at han til slutt bestemte seg for å utdanne seg som hundetrener og hundeinstruktør. Mens utdannelsen pågår, opererer han som hundelufter under navnet «The DogFather».",
      image: "/article2.jpg",
      link: "https://www.ta.no/will-er-byens-dogfather-jeg-har-dogmobil-ogsa/s/5-50-1736689?flexToken=eyJpZCI6IjUtNTAtMTczNjY4OSIsImRhdGUiOiIyMDI2LTAxLTE5IiwidHlwZSI6ImdpZnQifQ.BLMHUmqJVuhfw-cGVLOo8uL-Uq0lKuEsh6dMpOzxb8Q",
    },
    {
      id: "2",
      publication: "Telemarksavisa",
      date: "July 17, 2024",
      headline:
        "Will Smith er hundetrener og helt i hundre: – De er god terapi for meg",
      excerpt:
        "Han kaller seg The Dogfather og er både massør, dj og hundelufter. Nå har han også gått på kurs for å bli hundetrener. – Med min diagnose er de firbeinte god terapi, sier Will Smith.",
      fullText:
        "Han kaller seg The Dogfather og er både massør, dj og hundelufter. Nå har han også gått på kurs for å bli hundetrener. – Med min diagnose er de firbeinte god terapi, sier Will Smith.",
      image: "/article1.jpg",
      link: "https://www.ta.no/will-smith-er-hundetrener-og-helt-i-hundre-de-er-god-terapi-for-meg/s/5-50-1915287?flexToken=eyJpZCI6IjUtNTAtMTkxNTI4NyIsImRhdGUiOiIyMDI2LTAxLTE5IiwidHlwZSI6ImdpZnQifQ.YR6R9uOAxjICtsvAJu--RIY5tgkVzCv63qxvxp7kdu4",
    },
  ],
};

// Qualifications Section Data (combines Certifications and News)
export const qualificationsData = {
  certifications: certificationsData.benefits,
  articles: newsData.articles,
};

// Testimonials Section Data
// You can use reviews from the API (GOOGLE_PLACE_ID + GOOGLE_PLACES_API_KEY) or
// add them manually here (name, content, rating; optional image URL for a small rounded avatar).
export const testimonialsData = {
  testimonials: [
    {
      id: "1",
      name: "Jorunn Haugen",
      content:
        "Rex er veldig fornøyd med å være med Will på turer. Han har også bodd hos Will mange ganger. Samtidig har Will tatt på seg frivillige oppgaver som vektkontroll og alt det innebærer. Han kan også møte opp på kort varsel.",
      rating: 5,
      image: "/avatars/jorunn.jpg"
    },
    {
      id: "2",
      name: "Danny Twang",
      content:
        "Vi har brukt Will til både å passe Rolf og hjelpe med trening/dressur. Veldig trygg, kunnskapsrik og flink til å lese hunder. Vi har fått konkrete råd som fungerer i hverdagen, samt gode anbefalinger om utstyr som passer hunden vår. Føler oss alltid trygge når Rolf er der. Anbefales på det sterkeste!",
      rating: 5,
    },
  ],
};

// FAQ Section Data
export const faqData = {
  items: [
    {
      id: "1",
      question: "Når bør jeg begynne å trene hunden min?",
      answer:
        "Valper kan begynne med grunnleggende trening allerede fra 8 ukers alder. Tidlig trening og sosialisering er avgjørende for å utvikle en godt oppdratt voksen hund. Vi tilbyr spesialiserte valpeprogrammer tilpasset unge hunder.",
    },
    {
      id: "2",
      question: "Hvor lang tid tar treningen?",
      answer:
        "Treningsvarighet varierer avhengig av program og hundens individuelle behov. Grunnleggende lydighet tar vanligvis 6–8 uker, mens videre trening kan ta lengre tid. Vi gir tilpassede tidslinjer under det første møtet.",
    },
    {
      id: "3",
      question: "Tilbyr dere trening hjemme hos meg?",
      answer:
        "Ja, vi tilbyr både trening hjemme hos deg og i treningslokale. Hjemmetrening kan være gunstig for hunder som er mer komfortable i eget miljø, eller for å jobbe med atferd knyttet til hjemmet.",
    },
    {
      id: "4",
      question: "Hvilke metoder bruker dere?",
      answer:
        "Vi bruker positiv forsterkning basert på vitenskapelig forskning. Tilnærmingen vår fokuserer på å belønne ønsket atferd i stedet for å straffe uønsket atferd, og skaper en positiv læringsopplevelse for hunden din.",
    },
    {
      id: "5",
      question: "Kan jeg være med og se på treningsøktene?",
      answer:
        "Absolutt! Vi oppfordrer til at eieren er med og observerer. Vi mener det er viktig at eieren forstår treningsprosessen, slik at dere kan fortsette å styrke atferden hjemme.",
    },
  ],
};

// Education / Utdanning og kompetanse Page Data
export const educationData = {
  title: "Utdanning og kompetanse",
  eyebrow: "Faglig bakgrunn",
  sections: [
    {
      heading: "Hundetrener og instruktørutdanning",
      paragraphs: [
        "Utdanningen omfatter blant annet valpens utvikling, rasekunnskap, etologi, ernæring, helse, førstehjelp, lover og regler, hundens språk og signaler, praktisk trening, aggresjon, test av hund, genetikk samt teoretisk og praktisk eksamen.",
      ],
      diplomas: [
        {
          src: "/utdanning/diploma2.jpg",
          alt: "Diplom fra Oslo Hundeskole – hundetrener og instruktørutdanning",
          title: "Hundetrener- og instruktørutdanning – Oslo Hundeskole",
          description:
            "Gjennomført hundetrener- og instruktørutdanning ved Oslo Hundeskole med bestått teoretisk og praktisk eksamen.",
        },
      ],
    },
    {
      heading: "Videreutdanning",
      paragraphs: [],
      diplomas: [
        {
          src: "/utdanning/diploma1.jpg",
          alt: "Kursbevis – Problemhund hos Rune Moens Hundesenter",
          title: "Problemhund – mentalitet, påvirkninger og rehabilitering",
          description:
            "6-timers fagkurs hos Rune Moens Hundesenter med fokus på forståelse av problematferd og rehabilitering.",
        },
      ],
    },
    {
      heading: "Kontinuerlig faglig utvikling",
      paragraphs: [
        "Jeg legger stor vekt på å holde meg faglig oppdatert gjennom kurs, videreutdanning og praktisk erfaring.",
      ],
    },
  ],
};

// Valpekurs Page Data
export const valpekursData = {
  title: "Valpekurs",
  eyebrow: "Kurs",
  subtitle: "For valper fra 10 uker til 6 måneder",
  tagline: "Trygghet – Struktur – Relasjon",
  badge: "Maks 6 deltakere – alle skal bli sett",
  intro: [
    "Hos The DogFather trener vi i små grupper. Det gir god tid til individuell veiledning og oppfølging, slik at både du og valpen får best mulig utbytte av kurset.",
    "Målet med valpekurset er ikke å skape perfekte hunder, men å gi valp og eier en trygg og god start sammen.",
    "Valpetiden er en viktig periode i hundens liv. Erfaringene valpen får de første månedene, er med på å legge grunnlaget for en trygg, sosial og velfungerende voksen hund.",
    "På valpekurset lærer du hvordan du kan bygge et godt samarbeid med hunden din gjennom positive og belønningsbaserte treningsmetoder. Målet er å skape mestring, gode vaner og en sterk relasjon mellom hund og eier.",
    "Kurset passer for valper fra 10 uker til 6 måneder. Jeg anbefaler at valpen først får litt tid til å bli kjent med sitt nye hjem og sin nye familie før kursstart.",
  ],
  sections: [
    {
      heading: "På valpekurset jobber vi blant annet med",
      listItems: [
        "Kontakt og samarbeid",
        "Belønning og motivasjon",
        "Innkalling",
        "Gå pent i bånd",
        "Sitt og bli",
        "Hilsetrening",
        "Ro og selvkontroll",
        "Håndtering",
        "Sosialisering og miljøtrening",
        "Aktivisering og problemløsning",
      ],
    },
    {
      heading: "Kurset består av",
      listItems: [
        "1 teorikveld",
        "5 praksiskvelder",
        "Kursmappe med teori og nyttig informasjon",
        "Individuell veiledning gjennom hele kurset",
        "Rabattkort med fordeler hos The DogFather sine samarbeidspartnere",
      ],
      paragraphs: [
        "Etter hver kurskveld får du skriftlige hjemmeøvelser som gjør det enkelt å fortsette treningen hjemme frem til neste kurskveld.",
        "Hele familien er hjertelig velkommen til å delta. Barn fra ca. 12 år og oppover kan gjerne være med og delta aktivt i treningen.",
      ],
    },
  ],
  partners: heroData.sponsors,
  practicalInfo: [
    { label: "Kursstart", value: "24. august" },
    { label: "Oppbygging", value: "1 teorikveld og 5 praksiskvelder" },
    { label: "Tidspunkt", value: "Mandager og onsdager kl. 18.30" },
    { label: "Periode", value: "24. august–9. september" },
    {
      label: "Teorikveld",
      value:
        "Inntil 2 timer. Holdes hos Lykke Kafé, hvor vi får tilgang til en egen, skjermet del.",
    },
    {
      label: "Praksiskvelder",
      value:
        "60 minutter. Gjennomføres utendørs i Moflata skoles skolegård ved Skien fritidspark. Parkering: Skien Fritidspark.",
    },
  ],
  price: "2 450 kr",
  signup: {
    heading: "Påmelding",
    paragraphs: [
      "Påmelding skjer via «Send forespørsel»-skjemaet. I skjemaet velger man «Valpekurs» og fyller inn nødvendig informasjon.",
    ],
  },
};

// Grunnkurs Page Data
export const grunnkursData = {
  title: "Grunnkurs – unghund",
  eyebrow: "Kurs",
  subtitle: "For hunder fra 4–5 måneder med valpekurs, eller fra 6 måneder uten",
  tagline: "Trygghet – Struktur – Relasjon",
  badge: "Maks 6 deltakere – alle skal bli sett",
  intro: [
    "Hos The DogFather trener vi i små grupper. Det gir god tid til individuell veiledning og oppfølging, slik at både du og hunden din får best mulig utbytte av kurset.",
    "Målet med grunnkurset er ikke å skape perfekte hunder, men å gi hund og eier verktøy som skaper et godt samarbeid og fungerer i hverdagen.",
    "Unghundperioden kan være både spennende og utfordrende. Hunden blir mer selvstendig, tester grenser og påvirkes lettere av omgivelsene. På grunnkurset bygger vi videre på det valpen allerede har lært og utvikler ferdigheter som gjør hverdagen enklere for både hund og eier.",
    "Grunnkurset passer for hunder fra 4–5 måneder som har gjennomført valpekurs, eller fra 6 måneder for hunder uten tidligere valpekurs.",
    "Dette gjør at valper som starter valpekurs ved 10 ukers alder kan fortsette tidligere, samtidig som hunder uten valpekurs fortsatt starter fra 6 måneders alder.",
    "Jeg trener med positive og belønningsbaserte metoder, hvor fokus er på samarbeid, mestring og treningsglede. Målet er å styrke relasjonen mellom hund og eier og gi dere verktøy som varer livet ut.",
  ],
  sections: [
    {
      heading: "På grunnkurset jobber vi blant annet med",
      listItems: [
        "Kontakt og samarbeid",
        "Belønning og motivasjon",
        "Innkalling med økende forstyrrelser",
        "Gå pent i bånd",
        "Sitt, bli og selvkontroll",
        "Passering av mennesker og hunder",
        "Hverdagslydighet",
        "Håndtering",
        "Miljøtrening",
        "Aktivisering og problemløsning",
      ],
    },
    {
      heading: "Kurset består av",
      listItems: [
        "1 teorikveld",
        "5 praksiskvelder",
        "Kursmappe med teori og nyttig informasjon",
        "Individuell veiledning gjennom hele kurset",
        "Rabattkort med fordeler hos The DogFather sine samarbeidspartnere",
      ],
      paragraphs: [
        "Etter hver kurskveld får du skriftlige hjemmeøvelser som gjør det enkelt å fortsette treningen hjemme frem til neste kurskveld.",
        "Hele familien er hjertelig velkommen til å delta. Barn fra ca. 12 år og oppover kan gjerne være med og delta aktivt i treningen.",
      ],
    },
  ],
  partners: heroData.sponsors,
  practicalInfo: [
    { label: "Kursstart", value: "Info kommer" },
    { label: "Oppbygging", value: "1 teorikveld og 5 praksiskvelder" },
    { label: "Tidspunkt", value: "Mandager og onsdager kl. 18.30" },
    { label: "Periode", value: "Info kommer" },
    {
      label: "Teorikveld",
      value:
        "Inntil 2 timer. Holdes hos Lykke Kafé, hvor vi får tilgang til en egen, skjermet del.",
    },
    {
      label: "Praksiskvelder",
      value:
        "60 minutter. Gjennomføres utendørs i Moflata skoles skolegård ved Skien fritidspark. Parkering: Skien Fritidspark.",
    },
  ],
  price: "2 450 kr",
  signup: {
    heading: "Påmelding",
    paragraphs: [
      "Påmelding skjer via «Send forespørsel»-skjemaet. I skjemaet velger man «Grunnkurs» og fyller inn nødvendig informasjon.",
    ],
  },
};

// Footer Section Data
export const footerData = {
  facebook: "https://www.facebook.com/profile.php?id=61550517126976&mibextid=wwXIfr&rdid=hISnmbXmP0gKj17C",
  instagram: "https://www.instagram.com/thedogfatherskien/",
  tiktok: "https://tiktok.com/@willsmith57914",
  phone: "97 41 54 14",
  email: "will@thedogfather.no",
  address: "Nedre Hjellegate 18, 3724 Skien",
  /** Google Maps / business search URL for directions and reviews. Points to Google search for The DogFather Skien. */
  googleMapsUrl: "https://www.google.com/search?q=The+DogFather+Skien",
};
