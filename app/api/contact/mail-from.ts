/** Resend sending subdomain (verified in Resend as send.thedogfather.no). */
export const MAIL_SEND_DOMAIN = "send.thedogfather.no";

export const DEFAULT_MAIL_FROM = `The Dogfather <kontakt@${MAIL_SEND_DOMAIN}>`;

/** Verified envelope From for Resend / SMTP (override with EMAIL_FROM). */
export function resolveMailFrom(): string {
  return (
    process.env.EMAIL_FROM?.trim() ||
    process.env.EMAIL_USER?.trim() ||
    DEFAULT_MAIL_FROM
  );
}
