import Link from "next/link";
import Logo from "../../components/Logo";
import { resolveVippsReturnView } from "@/app/lib/vipps/returnStatus";
import type { VippsReturnView } from "@/app/lib/vipps/returnStatus";
import { footerData } from "@/app/constants/data";

export const metadata = {
  title: "Tilbake fra Vipps | The Dogfather",
  description: "Status etter Vipps-betaling.",
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ ref?: string }>;
};

function titleAndBody(view: VippsReturnView): {
  title: string;
  subtitle: string;
  body: string;
  tone: "ok" | "warn" | "err" | "neutral";
} {
  switch (view.kind) {
    case "no_ref":
      return {
        title: "Tilbake fra Vipps",
        subtitle: "Vipps",
        body: "Det mangler en betalingsreferanse i lenken. Gå til forsiden og start Vipps-betaling derfra om du skal betale.",
        tone: "neutral",
      };
    case "invalid_ref":
      return {
        title: "Ugyldig betalingslenke",
        subtitle: "Vipps",
        body: "Lenken ser ikke ut til å være gyldig. Bruk Vipps-knappen på siden vår, eller ta kontakt om du trenger hjelp.",
        tone: "err",
      };
    case "unconfigured":
      return {
        title: "Kunne ikke sjekke betaling",
        subtitle: "Vipps",
        body: "Serveren er ikke satt opp til å hente betalingsstatus. Ta kontakt dersom du lurer på om betalingen gikk gjennom.",
        tone: "warn",
      };
    case "not_found":
      return {
        title: "Fant ikke betalingen",
        subtitle: "Vipps",
        body: "Vi finner ingen betaling med denne referansen. Har du gått via en gammel lenke? Start gjerne en ny betaling fra forsiden.",
        tone: "warn",
      };
    case "lookup_error":
      return {
        title: "Kunne ikke hente status",
        subtitle: "Vipps",
        body: "Vi fikk ikke sjekket betalingen hos Vipps akkurat nå. Sjekk gjerne betalingsoversikten i Vipps-appen, eller ta kontakt med oss.",
        tone: "warn",
      };
    case "success":
      return {
        title: "Betalingen er godkjent",
        subtitle: "Vipps",
        body:
          "Takk! Betalingen er godkjent i Vipps. Hvis noe var galt, ta kontakt – oppgi gjerne referansen under.",
        tone: "ok",
      };
    case "incomplete":
      return {
        title: "Betalingen er ikke fullført",
        subtitle: "Vipps",
        body:
          "Beløpet er ikke trukket ennå. Fullfør i Vipps-appen om den fortsatt er åpen, eller gå til forsiden og prøv Vipps på nytt når du er klar.",
        tone: "warn",
      };
    case "failed": {
      const bodyByReason: Record<typeof view.reason, string> = {
        aborted:
          "Det ser ut som du avbrøt betalingen. Ingen beløp er trukket. Du kan når som helst prøve igjen fra forsiden.",
        expired:
          "Betalingsforespørselen er utløpt. Ingen beløp er trukket. Start gjerne en ny betaling når det passer.",
        cancelled:
          "Betalingen ble kansellert. Ingen beløp er trukket. Ta kontakt hvis du mener noe gikk galt.",
        terminated:
          "Denne betalingen ble stoppet. Ingen beløp er trukket. Start gjerne en ny betaling fra forsiden om du skal betale.",
        other:
          "Betalingen ble ikke gjennomført. Ingen beløp skal være trukket. Prøv igjen senere, eller ta kontakt.",
      };
      return {
        title: "Betalingen gikk ikke gjennom",
        subtitle: "Vipps",
        body: bodyByReason[view.reason],
        tone: "err",
      };
    }
    default: {
      const _exhaustive: never = view;
      return _exhaustive;
    }
  }
}

function showReference(view: VippsReturnView, ref: string | undefined) {
  if (!ref) return null;
  if (view.kind === "invalid_ref") return null;
  return true;
}

export default async function VippsReturnPage({ searchParams }: PageProps) {
  const { ref } = await searchParams;
  const view = await resolveVippsReturnView(ref);
  const { title, subtitle, body, tone } = titleAndBody(view);

  const borderClass =
    tone === "ok"
      ? "border-primary-300"
      : tone === "err"
        ? "border-red-200/80"
        : tone === "warn"
          ? "border-amber-200/80"
          : "border-primary-300";

  return (
    <main className="min-h-screen bg-surface text-on-surface">
      <section className="px-4 py-8 md:py-12">
        <div
          className={`max-w-lg mx-auto rounded-3xl border ${borderClass} bg-surface shadow-[0_18px_45px_rgba(0,0,0,0.08)] px-6 py-10 md:px-10 md:py-12 text-center`}
        >
          <div className="mb-6 flex items-center justify-center">
            <Logo
              href="/"
              width={360}
              height={180}
              alt="The DogFather-logo"
              className="object-contain"
              linkClassName="flex items-center hover:opacity-90 transition-opacity"
            />
          </div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted mb-3">
            {subtitle}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            {title}
          </h1>
          <p className="text-muted text-base leading-relaxed mb-6">{body}</p>
          {showReference(view, ref) ? (
            <p className="text-sm text-foreground/70 break-all mb-6">
              <span className="text-muted">Referanse: </span>
              {ref}
            </p>
          ) : null}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-primary-hover transition-colors"
            >
              Til forsiden
            </Link>
            <a
              href={`mailto:${footerData.email}`}
              className="inline-flex items-center justify-center rounded-full border border-primary-300 bg-transparent px-6 py-3 text-base font-semibold text-foreground hover:bg-primary-15/50 transition-colors"
            >
              Kontakt oss
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
