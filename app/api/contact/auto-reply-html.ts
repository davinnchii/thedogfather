/**
 * HTML body for auto-reply email. Logo is shown when baseUrl is set.
 * Set SITE_URL in .env.local (e.g. https://www.thedogfather.no) to enable the logo.
 */
export function getAutoReplyHtml(baseUrl: string | undefined): string {
  const logoSection = baseUrl
    ? `<p style="margin: 0 0 24px 0;"><img src="${baseUrl.replace(/\/$/, '')}/logo.svg" alt="The DogFather" width="160" height="96" style="display: block; max-width: 160px; height: auto;" /></p>`
    : '';

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #2C2A28; max-width: 560px; margin: 0 auto; padding: 24px;">
${logoSection}
<p>Hei,</p>

<p>Takk for at du tok kontakt med The DogFather.<br>Jeg setter pris på henvendelsen din og hjelper deg gjerne.</p>

<p>Jeg tilbyr Hundelufting, Dagpass, Døgnpass og privat timer/veiledning.</p>

<p>For at jeg skal kunne gi deg et best mulig og tilpasset svar, er det fint om du kan fortelle litt om:</p>
<ul>
<li>Hundens rase og alder</li>
<li>Hva du ønsker hjelp til</li>
<li>Hvor ofte og i hvilket område</li>
<li>Eventuelle utfordringer som atferd, stress, helse eller møte med andre hunder</li>
</ul>

<p>All informasjon behandles konfidensielt.</p>

<p>Jeg svarer på alle henvendelser innen 24 timer.</p>

<p>Ved akutte behov ber jeg om at du tar kontakt per telefon.</p>

<p>Vennlig hilsen<br><strong>Will</strong><br>The DogFather Skien<br>Telefon: 97 41 54 14<br><a href="mailto:will@thedogfather.no">will@thedogfather.no</a><br><a href="https://www.thedogfather.no">www.thedogfather.no</a></p>

<hr style="border: none; border-top: 1px solid #e3ddd2; margin: 24px 0;">
<p style="font-size: 14px; color: #56534a;">
<strong>Will Smith</strong><br>
The DogFather – Skien<br>
Nedre Hjellegate 18, 3724 Skien<br>
Telefon: +47 97 41 54 14<br>
<a href="mailto:will@thedogfather.no">will@thedogfather.no</a><br>
<a href="https://www.thedogfather.no">www.thedogfather.no</a><br>
Instagram: <a href="https://instagram.com/thedogfather_skien">@thedogfather_skien</a>
</p>
</body>
</html>`;
}
