# Contact Form Backend (Email Only)

This project implements a production-ready **Next.js API Route** to handle contact form submissions.
The backend validates input, prevents spam, and sends email notifications.
No database or admin dashboard is included.

---

## Tech Stack

- Next.js (App Router)
- TypeScript
- Node.js runtime
- SMTP or email API (via environment variables)

---

## API Endpoint

**Method**
POST

markdown
Copy code

**Route**
/api/contact

arduino
Copy code

**File Location**
app/api/contact/route.ts

css
Copy code

**Content-Type**
application/json

yaml
Copy code

---

## Request Body

### Required Fields

```json
{
  "name": "string",
  "email": "string",
  "phone": "string"
}
Optional Fields
json
Copy code
{
  "questions": {
    "key": "value"
  },
  "message": "string",
  "companyName": "string"
}
Field Notes
questions must accept dynamic key/value pairs

message may be empty or omitted

companyName is a honeypot field used for spam prevention

Validation Rules
name

required

minimum 2 characters

maximum 100 characters

email

required

must be a valid email address

phone

required

minimum 5 characters

maximum 30 characters

message

optional

maximum 3000 characters

questions

optional

must be an object if provided

Additional rules:

Trim all string values

Reject requests with missing or invalid required fields

Return HTTP 400 for validation errors

Spam Protection
Honeypot
If companyName exists and is not empty:

Return HTTP 200 OK

Do not send email

Rate Limiting
Maximum 5 requests per IP per hour

Use in-memory or lightweight rate limiting

If limit is exceeded, return HTTP 429

Email Sending
Environment Variables
env
Copy code
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
EMAIL_TO=
Secrets must not be hardcoded.

Email Content
Subject

sql
Copy code
New contact request
Body must include

Name

Email

Phone

Questions (formatted as key: value list)

Message (if provided)

Submission timestamp (UTC)

IP address

User agent

Email format may be plain text or HTML.

Optional Auto-Reply
Send a confirmation email to the user

Static message (e.g. “Thanks for reaching out”)

Must not block the main request flow

API Responses
Success
json
Copy code
{
  "success": true
}
Validation Error
json
Copy code
{
  "success": false,
  "error": "Validation error message"
}
Rate Limit Error
json
Copy code
{
  "success": false,
  "error": "Too many requests"
}
Non-Functional Requirements
Use async/await

Graceful error handling

No database usage

No frontend/UI code

Clean, modular, readable code

Production-ready implementation

Acceptance Criteria
Valid submissions successfully send email

Invalid input is rejected with proper errors

Spam submissions are silently ignored

Rate limiting works as expected

Endpoint is compatible with Next.js App Router