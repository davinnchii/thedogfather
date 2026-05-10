import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { AUTO_REPLY_SUBJECT, AUTO_REPLY_TEXT } from './auto-reply-text';
import { getAutoReplyHtml } from './auto-reply-html';

// Types
interface ContactRequestBody {
  name: string;
  email: string;
  phone: string;
  message?: string;
  questions?: Record<string, string>;
  companyName?: string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

function toSafeErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return "unknown";
}

// Rate limiting storage (in-memory)
const rateLimitMap = new Map<string, RateLimitEntry>();

// Rate limit configuration
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (entry.resetTime < now) {
      rateLimitMap.delete(ip);
    }
  }
}, 10 * 60 * 1000); // Clean up every 10 minutes

/**
 * Get client IP address from request
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIP || 'unknown';
  return ip.trim();
}

/**
 * Check rate limit for an IP address
 */
function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired one
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - entry.count };
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate and sanitize request body
 */
function validateRequestBody(body: unknown): { valid: boolean; error?: string; data?: ContactRequestBody } {
  // Check if body is an object
  if (!body || typeof body !== "object") {
    return { valid: false, error: 'Invalid request body' };
  }

  const raw = body as Record<string, unknown>;

  // Trim all string values
  const trimmed: ContactRequestBody = {
    name: typeof raw.name === "string" ? raw.name.trim() : "",
    email: typeof raw.email === "string" ? raw.email.trim() : "",
    phone: typeof raw.phone === "string" ? raw.phone.trim() : "",
    message:
      typeof raw.message === "string" ? raw.message.trim() : undefined,
    questions:
      typeof raw.questions === "object" &&
      raw.questions !== null &&
      !Array.isArray(raw.questions)
      ? (raw.questions as Record<string, string>)
      : undefined,
    companyName:
      typeof raw.companyName === "string"
        ? raw.companyName.trim()
        : undefined,
  };

  // Validate required fields
  if (!trimmed.name) {
    return { valid: false, error: 'Name is required' };
  }
  if (trimmed.name.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }
  if (trimmed.name.length > 100) {
    return { valid: false, error: 'Name must be at most 100 characters' };
  }

  if (!trimmed.email) {
    return { valid: false, error: 'Email is required' };
  }
  if (!isValidEmail(trimmed.email)) {
    return { valid: false, error: 'Invalid email address' };
  }

  if (!trimmed.phone) {
    return { valid: false, error: 'Phone is required' };
  }
  if (trimmed.phone.length < 5) {
    return { valid: false, error: 'Phone must be at least 5 characters' };
  }
  if (trimmed.phone.length > 30) {
    return { valid: false, error: 'Phone must be at most 30 characters' };
  }

  // Validate optional fields
  if (trimmed.message !== undefined && trimmed.message.length > 3000) {
    return { valid: false, error: 'Message must be at most 3000 characters' };
  }

  // Validate questions if provided
  if (trimmed.questions !== undefined) {
    for (const key in trimmed.questions) {
      if (typeof trimmed.questions[key] !== 'string') {
        return { valid: false, error: 'All question values must be strings' };
      }
    }
  }

  return { valid: true, data: trimmed };
}

function isResendConfigured(): boolean {
  return !!(process.env.RESEND_API_KEY && process.env.EMAIL_TO);
}

/**
 * Create email transporter
 */
function createTransporter() {
  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !port || !user || !pass) {
    throw new Error('Email configuration is incomplete');
  }

  return nodemailer.createTransport({
    host,
    port: parseInt(port, 10),
    secure: port === '465', // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Format questions object as key: value list
 */
function formatQuestions(questions?: Record<string, string>): string {
  if (!questions || Object.keys(questions).length === 0) {
    return 'None';
  }

  return Object.entries(questions)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
}

/**
 * Create email body
 */
function createEmailBody(
  data: ContactRequestBody,
  ip: string,
  userAgent: string | null
): string {
  const timestamp = new Date().toISOString();
  const questionsText = formatQuestions(data.questions);

  return `New Contact Request

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}

Questions:
${questionsText}

${data.message ? `Message:\n${data.message}\n` : ''}
---
Submission Details:
Timestamp: ${timestamp} (UTC)
IP Address: ${ip}
User Agent: ${userAgent || 'Unknown'}
`;
}

/**
 * Transactional providers (Resend, typical SMTP) only allow sending from verified domains.
 * We cannot use the visitor's address as the envelope From — it would fail SPF/DMARC or be rejected.
 * Instead we put their name and email in the display-name part and keep Reply-To as their address.
 */
function sanitizeMailDisplayToken(s: string, max: number): string {
  return s.replace(/[\r\n\x00]/g, " ").replace(/["<>]/g, "'").trim().slice(0, max);
}

function extractAngleAddress(fromEnv: string): string {
  const trimmed = fromEnv.trim();
  const m = trimmed.match(/<([^>]+)>/);
  if (m) return m[1]!.trim();
  return trimmed;
}

/** Verified sender address from env, with visitor shown in the display name. */
function notificationFromHeader(data: ContactRequestBody): string {
  const baseFrom =
    process.env.EMAIL_FROM?.trim() ||
    process.env.EMAIL_USER?.trim() ||
    "onboarding@resend.dev";
  const address = extractAngleAddress(baseFrom);
  const label = sanitizeMailDisplayToken(`${data.name} (${data.email})`, 140);
  return `"${label}" <${address}>`;
}

function normalizeRecipientList(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Send email notification
 */
async function sendNotificationEmail(
  data: ContactRequestBody,
  ip: string,
  userAgent: string | null
): Promise<void> {
  const emailToRaw = process.env.EMAIL_TO?.trim();
  if (!emailToRaw) {
    throw new Error('EMAIL_TO is not configured');
  }
  const emailToList = normalizeRecipientList(emailToRaw);
  if (emailToList.length === 0) {
    throw new Error('EMAIL_TO is not configured');
  }

  const emailBody = createEmailBody(data, ip, userAgent);
  const subject = 'New contact request';
  const replyTo = data.email.trim();

  if (isResendConfigured()) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = notificationFromHeader(data);
    const { error } = await resend.emails.send({
      from,
      to: emailToList.length === 1 ? emailToList[0]! : emailToList,
      replyTo,
      subject,
      text: emailBody,
    });
    if (error) throw new Error(error.message);
    return;
  }

  const transporter = createTransporter();
  await transporter.sendMail({
    from: notificationFromHeader(data),
    to: emailToList.join(", "),
    replyTo,
    subject,
    text: emailBody,
  });
}

/**
 * Send auto-reply email to user
 */
async function sendAutoReply(data: ContactRequestBody): Promise<void> {
  try {
    if (isResendConfigured()) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';
      await resend.emails.send({
        from,
        to: data.email,
        subject: AUTO_REPLY_SUBJECT,
        text: AUTO_REPLY_TEXT,
        html: getAutoReplyHtml(process.env.SITE_URL),
      });
      return;
    }
    const transporter = createTransporter();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: data.email,
      subject: AUTO_REPLY_SUBJECT,
      text: AUTO_REPLY_TEXT,
      html: getAutoReplyHtml(process.env.SITE_URL),
    });
  } catch (error) {
    // Don't throw - auto-reply failure shouldn't block the main request
    console.error('Failed to send auto-reply:', toSafeErrorMessage(error));
  }
}

/**
 * POST handler for contact form
 */
export async function POST(request: NextRequest) {
  try {
    // Dev mock: validate but never send email, always return success
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
      let body;
      try {
        body = await request.json();
      } catch {
        return NextResponse.json(
          { success: false, error: 'Invalid JSON in request body' },
          { status: 400 }
        );
      }
      const validation = validateRequestBody(body);
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: validation.error || 'Validation failed' },
          { status: 400 }
        );
      }
      return NextResponse.json({ success: true });
    }

    // Get client IP and user agent
    const ip = getClientIP(request);
    const userAgent = request.headers.get('user-agent');

    // Check rate limit
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429 }
      );
    }

    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate request body
    const validation = validateRequestBody(body);
    if (!validation.valid || !validation.data) {
      return NextResponse.json(
        { success: false, error: validation.error || 'Validation failed' },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Honeypot check - if companyName is provided and not empty, silently ignore
    if (data.companyName && data.companyName.length > 0) {
      // Return success but don't send email
      return NextResponse.json({ success: true });
    }

    // Send notification email
    await sendNotificationEmail(data, ip, userAgent);

    // Send auto-reply (non-blocking)
    sendAutoReply(data).catch((error) => {
      console.error('Auto-reply failed:', toSafeErrorMessage(error));
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', toSafeErrorMessage(error));
    
    // Don't expose internal error details
    return NextResponse.json(
      { success: false, error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}

