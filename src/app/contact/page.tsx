import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const metadata = {
  title: "Contact Us | Mobile Connex Communications",
  description: "Get in touch with Mobile Connex Communications. Visit us in-store, WhatsApp, or send us a message.",
};

const CONTACT = [
  {
    icon: Phone,
    label: "Phone / WhatsApp",
    value: "+65 [Your Number]",
    href: "tel:+65",
    cta: "Call or WhatsApp us",
  },
  {
    icon: Mail,
    label: "Email",
    value: "mblcnxcommunications@gmail.com",
    href: "mailto:mblcnxcommunications@gmail.com",
    cta: "Send an email",
  },
  {
    icon: MapPin,
    label: "Store Address",
    value: "[Your Store Address], Singapore",
    href: "https://maps.google.com",
    cta: "Get directions",
  },
  {
    icon: Clock,
    label: "Opening Hours",
    value: "Mon – Sat: 11am – 8pm\nSun & PH: 12pm – 6pm",
    href: null,
    cta: null,
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14">

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-mcx-dark mb-3">Get in Touch</h1>
        <p className="text-mcx-gray max-w-md mx-auto">
          We&apos;re here to help. Visit us in-store, drop us a WhatsApp, or use the form below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Contact details */}
        <div className="flex flex-col gap-5">
          {CONTACT.map(({ icon: Icon, label, value, href, cta }) => (
            <div key={label} className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="p-2.5 rounded-lg bg-mcx-red-light shrink-0">
                <Icon size={18} className="text-mcx-red" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-mcx-gray mb-0.5">{label}</p>
                <p className="text-sm font-medium text-mcx-dark whitespace-pre-line">{value}</p>
                {href && cta && (
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="text-xs text-mcx-red font-semibold mt-1 inline-block hover:underline"
                  >
                    {cta} →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-mcx-dark mb-5">Send us a message</h2>
          <form
            action={`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "YOUR_FORM_ID"}`}
            method="POST"
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-mcx-dark mb-1.5">Name *</label>
                <input name="name" required placeholder="John Tan"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-mcx-red" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-mcx-dark mb-1.5">Phone</label>
                <input name="phone" placeholder="+65 9123 4567" type="tel"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-mcx-red" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-mcx-dark mb-1.5">Email *</label>
              <input name="email" required type="email" placeholder="john@email.com"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-mcx-red" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-mcx-dark mb-1.5">Subject</label>
              <select name="subject"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-mcx-red bg-white">
                <option>General enquiry</option>
                <option>Trade-in question</option>
                <option>Product availability</option>
                <option>After-sales support</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-mcx-dark mb-1.5">Message *</label>
              <textarea name="message" required rows={4} placeholder="How can we help?"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-mcx-red resize-none" />
            </div>
            <button type="submit"
              className="w-full py-3 rounded-lg bg-mcx-red text-white font-semibold text-sm hover:bg-mcx-red-dark transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
