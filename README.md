## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Under Construction Mode

The site includes an under construction mode that can be controlled via an environment variable.

### Setup

Create a `.env.local` file in the root directory and add:

```bash
NEXT_PUBLIC_UNDER_CONSTRUCTION=true
```

You can use `.env.example` as a starting point.

### Usage

- **Enable under construction mode**: Set `NEXT_PUBLIC_UNDER_CONSTRUCTION=true`
- **Disable under construction mode**: Set `NEXT_PUBLIC_UNDER_CONSTRUCTION=false` or remove the variable

When enabled, the site will display:
- An under construction banner at the top
- A notice in the info section
- Updated page metadata indicating the site is under construction

The under construction components are located in `app/components/UnderConstruction.tsx` and can be customized as needed.

## Calendly booking

Booking bruker Calendly API med **API-token** (ikke brukernavn). Du kan bruke:

- **Forsiden**: «Book time»-knappen åpner booking i en popup.
- **Egen side**: [/booking](/booking) – velg type avtale og book der.

### Oppsett

1. Opprett konto på [Calendly](https://calendly.com) og opprett de event types du ønsker (f.eks. Førstegangsmøte, Hundelufting, Dagpass, Døgnpass, Individuell hundetrening).

2. Generer et **Personal Access Token**:
   - Logg inn på Calendly → Integrations → API & Webhooks → «Get a token now» / «Generate new token»
   - Kopier tokenet (vises bare én gang).

3. I `.env.local` (token skal **ikke** være `NEXT_PUBLIC_` – det er kun på server):

```bash
CALENDLY_API_TOKEN=ditt-token-her
```

Du kan også bruke `CALENDLY_API_KEY` som variabelnavn. Event types og scheduling-URL hentes automatisk fra Calendly API.

## Google-anmeldelser (testimonials)

Anmeldelses-seksjonen kan hente ekte Google-anmeldelser via Google Places API.

### Oppsett

1. Aktiver [Places API (New)](https://console.cloud.google.com/apis/library/places-backend.googleapis.com) i Google Cloud og opprett en API-nøkkel.
2. Finn **Place ID** for bedriften (f.eks. via [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id) eller søk i Google Maps og bruk nettverk-fanen for å finne `ChIJ...` i API-kall).
3. I `.env.local`:

```bash
GOOGLE_PLACE_ID=ChIJ...
GOOGLE_PLACES_API_KEY=din-api-nøkkel
```

Uten disse variablene vises ingen Google-anmeldelser; siden bruker da evt. statisk fallback-data fra `testimonialsData` i `app/constants/data.ts`.

## Security notes

- Never commit `.env.local` (it’s ignored via `.gitignore`).
- Treat `RESEND_API_KEY`, `CALENDLY_API_TOKEN`, `GOOGLE_PLACES_API_KEY`, and `VERCEL_OIDC_TOKEN` as secrets and rotate them if they’re ever exposed.

## License

MIT (see `LICENSE`).
