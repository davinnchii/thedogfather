# Contact Form Backend (Email Only)

This project includes a **Next.js App Router API route** for contact form submissions.

- Validates and sanitizes input
- Adds basic spam protection (honeypot + rate limiting)
- Sends notification email + optional auto-reply
- No database / dashboard

---

## Tech Stack

- Next.js (App Router)
- TypeScript
- Node.js runtime
- SMTP or email API (via environment variables)

---

## API Endpoint

**Method**: `POST`  
**Route**: `/api/contact`  
**File**: `app/api/contact/route.ts`  
**Content-Type**: `application/json`

---

## Request Body

### Required Fields

```json
{
  "name": "string",
  "email": "string",
  "phone": "string"
}
```

### Optional Fields

```json
{
  "questions": {
    "key": "value"
  },
  "message": "string",
  "companyName": "string"
}
```

### Field Notes

- `questions` can contain dynamic key/value pairs
- `message` may be empty or omitted
- `companyName` is a honeypot field used for spam prevention

---

## Validation Rules (Summary)

- **name**: required, 2–100 chars
- **email**: required, must be valid format
- **phone**: required, 5–30 chars
- **message**: optional, max 3000 chars
- **questions**: optional, must be an object if provided
- All string values are trimmed
- Validation errors return **HTTP 400**

---

## Spam Protection

### Honeypot

If `companyName` exists and is non-empty:

- Return **HTTP 200**
- Do **not** send email

### Rate limiting

- Max **5 requests per IP per hour**
- If exceeded, returns **HTTP 429**

---

## Email Sending

Configuration is **only** via environment variables. Do not hardcode secrets.

### Environment variables (SMTP)

- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`
- `EMAIL_TO`

### Environment variables (Resend)

Sending uses the Resend subdomain **send.thedogfather.no** (not the root domain).

- `RESEND_API_KEY`
- `EMAIL_TO` — inbox that receives form notifications (e.g. `will@thedogfather.no`)
- `EMAIL_FROM` (optional) — defaults to `The Dogfather <kontakt@send.thedogfather.no>`

**Development:** With `RESEND_API_KEY` + `EMAIL_TO` in `.env.local`, `POST /api/contact` calls Resend (same as production). Without credentials, the API validates and returns success without sending. Set `CONTACT_MOCK_EMAIL=true` to force the no-send behavior.

---

## API Responses

### Success

```json
{
  "success": true
}
```

### Validation Error

```json
{
  "success": false,
  "error": "Validation error message"
}
```

### Rate Limit Error

```json
{
  "success": false,
  "error": "Too many requests"
}
```