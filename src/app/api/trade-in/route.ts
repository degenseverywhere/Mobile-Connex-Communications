import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();

  const {
    condition, brand, model, storage, color,
    activation, setType,
    batteryHealth, overallCondition, screenCondition, exteriorCondition,
    name, email, phone, notes, estimatedValue,
  } = data;

  // Build a readable summary for the email
  const lines = [
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    ``,
    `Device: ${brand} ${model}`,
    `Storage: ${storage}`,
    color ? `Colour: ${color}` : null,
    `Condition type: ${condition === "new" ? "New" : "Used"}`,
    condition === "new" ? `Activation: ${activation}` : null,
    condition === "new" ? `Set type: ${setType}` : null,
    condition === "used" ? `Battery health: ${batteryHealth}%` : null,
    condition === "used" ? `Overall condition: ${overallCondition}` : null,
    condition === "used" ? `Screen: ${screenCondition}` : null,
    condition === "used" ? `Exterior: ${exteriorCondition}` : null,
    ``,
    `Estimated value: S$${estimatedValue}`,
    notes ? `Notes: ${notes}` : null,
  ].filter(Boolean).join("\n");

  // ── Send via email service ────────────────────────────────────────────────
  // Option A: Resend (add RESEND_API_KEY to Vercel env vars)
  if (process.env.RESEND_API_KEY) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Trade-In <noreply@mobileconnexcommunications.com>",
        to: ["mblcnxcommunications@gmail.com"],
        subject: `New Trade-In Request — ${brand} ${model} (S$${estimatedValue})`,
        text: lines,
      }),
    });
    return NextResponse.json({ ok: true });
  }

  // Option B: Formspree fallback (add FORMSPREE_ID to Vercel env vars)
  if (process.env.FORMSPREE_ID) {
    await fetch(`https://formspree.io/f/${process.env.FORMSPREE_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, _subject: `Trade-In: ${brand} ${model} — S$${estimatedValue}` }),
    });
    return NextResponse.json({ ok: true });
  }

  // Option C: Log to console (dev fallback — replace with a real service)
  console.log("[TRADE-IN LEAD]\n" + lines);
  return NextResponse.json({ ok: true });
}
