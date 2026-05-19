import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const TOPIC_LABELS: Record<string, string> = {
  partnership: "Partnership",
  investment: "Investment",
  product: "Product (DisputeDesk)",
  press: "Press",
  general: "General inquiry",
};

const ALLOWED_TOPICS = new Set(Object.keys(TOPIC_LABELS));

const MAX = {
  name: 120,
  company: 160,
  email: 254,
  message: 4000,
} as const;

function env(name: string): string | undefined {
  const v = process.env[name]?.trim();
  return v || undefined;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= MAX.email;
}

function readBody(req: VercelRequest): Record<string, unknown> | null {
  if (req.body && typeof req.body === "object" && !Array.isArray(req.body)) {
    return req.body as Record<string, unknown>;
  }
  if (typeof req.body === "string" && req.body.trim()) {
    try {
      return JSON.parse(req.body) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
  return null;
}

function str(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const DEFAULT_INBOX = "info@veridorworks.com";

  const apiKey = env("RESEND_API_KEY");
  const from = env("EMAIL_FROM");
  const to = env("CONTACT_TO_EMAIL") ?? DEFAULT_INBOX;

  if (!apiKey || !from) {
    console.error("contact: missing RESEND_API_KEY or EMAIL_FROM");
    res.status(503).json({ error: "Contact form is not configured." });
    return;
  }

  const body = readBody(req);
  if (!body) {
    res.status(400).json({ error: "Invalid request body." });
    return;
  }

  // Honeypot — bots only
  if (str(body.website, 200)) {
    res.status(200).json({ ok: true });
    return;
  }

  const name = str(body.name, MAX.name);
  const company = str(body.company, MAX.company);
  const email = str(body.email, MAX.email);
  const topic = str(body.topic, 32);
  const message = str(body.message, MAX.message);

  if (!name || !email || !topic || !message) {
    res.status(400).json({ error: "Please fill in all required fields." });
    return;
  }

  if (!isValidEmail(email)) {
    res.status(400).json({ error: "Please enter a valid email address." });
    return;
  }

  if (!ALLOWED_TOPICS.has(topic)) {
    res.status(400).json({ error: "Please select a valid inquiry topic." });
    return;
  }

  const topicLabel = TOPIC_LABELS[topic] ?? topic;
  const subject = `[Veridor Works] ${topicLabel} — ${name}`;
  const companyLine = company
    ? `<tr><td style="padding:8px 12px;color:#5A646D;font-size:12px;text-transform:uppercase;letter-spacing:0.06em">Company</td><td style="padding:8px 12px">${escapeHtml(company)}</td></tr>`
    : "";

  const html = `
    <div style="font-family:Inter,Segoe UI,sans-serif;font-size:15px;line-height:1.55;color:#0C1216;max-width:560px">
      <p style="margin:0 0 20px">New inquiry from <strong>veridorworks.com</strong></p>
      <table style="border-collapse:collapse;width:100%;border:1px solid #EAE4D8">
        <tr><td style="padding:8px 12px;color:#5A646D;font-size:12px;text-transform:uppercase;letter-spacing:0.06em">Name</td><td style="padding:8px 12px">${escapeHtml(name)}</td></tr>
        <tr><td style="padding:8px 12px;color:#5A646D;font-size:12px;text-transform:uppercase;letter-spacing:0.06em">Email</td><td style="padding:8px 12px"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        ${companyLine}
        <tr><td style="padding:8px 12px;color:#5A646D;font-size:12px;text-transform:uppercase;letter-spacing:0.06em">Topic</td><td style="padding:8px 12px">${escapeHtml(topicLabel)}</td></tr>
      </table>
      <p style="margin:24px 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;color:#5A646D">Message</p>
      <div style="padding:16px;background:#F3EFE8;border-left:3px solid #A07F40;white-space:pre-wrap">${escapeHtml(message)}</div>
    </div>
  `;

  const text = [
    `New inquiry from veridorworks.com`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    company ? `Company: ${company}` : null,
    `Topic: ${topicLabel}`,
    ``,
    `Message:`,
    message,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject,
      html,
      text,
    });

    if (error) {
      console.error("contact: Resend error", error);
      res.status(502).json({ error: "Unable to send your message. Please try again later." });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("contact: unexpected error", err);
    res.status(500).json({ error: "Unable to send your message. Please try again later." });
  }
}
