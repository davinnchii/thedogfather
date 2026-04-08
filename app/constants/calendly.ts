/**
 * Calendly integration – uses API key (server-side).
 * Set CALENDLY_API_TOKEN or CALENDLY_API_KEY in .env.local (no NEXT_PUBLIC).
 * Event types and scheduling URL are fetched from /api/calendly/event-types.
 */

export interface CalendlyEventTypePublic {
  uri: string;
  slug: string;
  name: string;
  schedulingUrl: string;
  duration: number;
}

export interface CalendlyConfigPublic {
  schedulingUrl: string;
  eventTypes: CalendlyEventTypePublic[];
}
