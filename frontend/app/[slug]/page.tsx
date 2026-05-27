import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Phone, Mail, ChevronRight, MessageSquare } from 'lucide-react';

// ─── Page Content Registry ────────────────────────────────────────────────────

type PageSection = { heading: string; body: string };

type PageContent = {
  title: string;
  subtitle: string;
  description: string;
  sections: PageSection[];
};

const pages: Record<string, PageContent> = {
  contact: {
    title: 'Contact Us',
    subtitle: 'We are here to help',
    description:
      'Have a question, feedback, or need assistance with an order? Our team is always ready to help you.',
    sections: [],
  },
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Quick answers to common questions',
    description:
      'Find answers to the most common questions about our products, shipping, returns, and more.',
    sections: [
      {
        heading: 'How do I place an order?',
        body: 'Browse our collections, select your desired item, choose your specifications, and click "Add to Cart". Proceed to checkout to complete your purchase.',
      },
      {
        heading: 'What payment methods do you accept?',
        body: 'We accept all major credit/debit cards, UPI payments (PhonePe, Google Pay, Paytm), net banking, and cash on delivery for select pincodes.',
      },
      {
        heading: 'How long does delivery take?',
        body: 'Standard delivery takes 7–14 business days. Express delivery (where available) takes 3–5 business days. Custom orders may take 3–6 weeks.',
      },
      {
        heading: 'Can I track my order?',
        body: 'Yes! Once your order is shipped, you will receive a tracking link via SMS and email. You can also check your order status under Settings → Order History.',
      },
      {
        heading: 'Do you offer assembly services?',
        body: 'Yes, we offer professional assembly services in major cities including Chennai, Bengaluru, Mumbai, Delhi, and Hyderabad. Assembly fees may apply.',
      },
      {
        heading: 'What is your return policy?',
        body: 'We accept returns within 7 days of delivery for items in original condition. Custom-made or assembled furniture is non-returnable. Contact us to initiate a return.',
      },
      {
        heading: 'Are the product colors accurate?',
        body: 'We strive to represent colors as accurately as possible. However, slight variations may occur due to screen settings and photography lighting. Physical swatches are available on request.',
      },
      {
        heading: 'Do you offer EMI or financing?',
        body: 'Yes, we offer 0% EMI on purchases above ₹15,000 through major credit cards and select buy-now-pay-later services. Options are shown during checkout.',
      },
    ],
  },
  shipping: {
    title: 'Shipping & Delivery',
    subtitle: 'Fast, safe, and reliable delivery across India',
    description:
      'We partner with trusted logistics providers to ensure your furniture arrives safely and on time.',
    sections: [
      {
        heading: 'Delivery Timelines',
        body: 'Standard delivery: 7–14 business days. Express delivery (select cities): 3–5 business days. Custom or handcrafted pieces: 3–6 weeks from order confirmation.',
      },
      {
        heading: 'Shipping Charges',
        body: 'Free shipping on all orders above ₹10,000. For orders below ₹10,000, a flat shipping fee of ₹499 applies. Express delivery charges are shown at checkout.',
      },
      {
        heading: 'Delivery Areas',
        body: 'We deliver pan-India including all major cities and most tier-2 and tier-3 cities. Some remote locations may have extended delivery timelines. Enter your PIN code at checkout to check availability.',
      },
      {
        heading: 'Large Item Delivery',
        body: 'For large furniture items (beds, sofas, wardrobes), our specialized delivery team will contact you 24 hours before delivery to schedule a convenient time slot.',
      },
      {
        heading: 'Tracking Your Order',
        body: 'Once your order is dispatched, you will receive an SMS and email with your tracking number. Use the link provided or visit your order history page to track in real-time.',
      },
      {
        heading: 'Damaged Deliveries',
        body: 'Please inspect your order at delivery. If the item is damaged, refuse delivery and notify us immediately at info@advik.com or call +91 94719 83191. We will arrange a replacement.',
      },
    ],
  },
  returns: {
    title: 'Returns & Exchanges',
    subtitle: 'Hassle-free returns within 7 days',
    description:
      'We want you to love every piece. If something is not right, we make it easy to return or exchange.',
    sections: [
      {
        heading: 'Return Eligibility',
        body: 'Items must be returned within 7 days of delivery in their original condition — unused, unassembled (where applicable), and with original packaging intact. Custom-made and personalized items are non-returnable.',
      },
      {
        heading: 'How to Initiate a Return',
        body: 'Contact our customer support at info@advik.com or call +91 94719 83191 with your order number. Our team will guide you through the process and schedule a pickup within 2–3 business days.',
      },
      {
        heading: 'Refund Process',
        body: 'Once we receive and inspect the returned item, your refund will be processed within 5–7 business days to your original payment method. UPI and bank transfers are completed within 3 business days.',
      },
      {
        heading: 'Exchange Policy',
        body: 'Exchanges are accepted for size, color, or model variations (subject to availability). The price difference, if any, will be collected or refunded accordingly.',
      },
      {
        heading: 'Non-Returnable Items',
        body: 'Custom-made furniture, assembled items, floor samples, and clearance sale items are not eligible for return. This will be clearly noted at the time of purchase.',
      },
    ],
  },
  warranty: {
    title: 'Warranty Information',
    subtitle: 'Built to last, backed by our promise',
    description:
      'Every Advik Furniture piece is crafted with premium materials and carries our manufacturer\'s warranty.',
    sections: [
      {
        heading: 'Standard Warranty Coverage',
        body: 'All Advik Furniture products come with a 1-year manufacturer\'s warranty against defects in materials and workmanship from the date of delivery.',
      },
      {
        heading: 'Extended Warranty',
        body: 'Select furniture categories — including sofas, beds, and dining sets — carry an extended 3-year structural warranty. Check the product page for specific warranty terms.',
      },
      {
        heading: 'What is Covered',
        body: 'The warranty covers manufacturing defects, structural issues, joint failures, upholstery stitching defects, and hardware failures under normal use conditions.',
      },
      {
        heading: 'What is Not Covered',
        body: 'The warranty does not cover damage from misuse, accidents, improper assembly, normal wear and tear, fading due to sunlight exposure, or unauthorized modifications.',
      },
      {
        heading: 'How to Claim Warranty',
        body: 'To claim warranty, email info@advik.com with your order number, description of the issue, and photos. Our quality team will assess and respond within 2 business days.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'Your privacy is our commitment',
    description:
      'Last updated: May 2026. This Privacy Policy explains how Advik Furniture and Interior collects, uses, and protects your personal information.',
    sections: [
      {
        heading: '1. Information We Collect',
        body: 'We collect information you provide when creating an account, placing an order, or contacting us — including name, email, phone number, delivery addresses, and payment information. We also collect usage data through analytics.',
      },
      {
        heading: '2. How We Use Your Information',
        body: 'Your information is used to process orders, deliver products, send order updates, personalize your shopping experience, and communicate promotions (with your consent). We do not sell your data to third parties.',
      },
      {
        heading: '3. Data Security',
        body: 'We implement industry-standard security measures including SSL encryption, secure payment gateways, and restricted access controls. Your payment details are never stored on our servers.',
      },
      {
        heading: '4. Cookies',
        body: 'We use cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can manage cookie preferences through your browser settings.',
      },
      {
        heading: '5. Third-Party Services',
        body: 'We use trusted third-party services including payment processors, logistics partners, and analytics providers. These parties have access to your information only as necessary to perform their functions.',
      },
      {
        heading: '6. Your Rights',
        body: 'You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at info@advik.com. We will respond within 30 days.',
      },
      {
        heading: '7. Contact',
        body: 'For privacy-related queries, contact us at info@advik.com or write to us at 663A, Thandal Kazhani, G.N.T Road, Puzhal Redhills, Chennai - 600066.',
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    subtitle: 'Please read these terms carefully',
    description:
      'Last updated: May 2026. By using the Advik Furniture website, you agree to these Terms of Service.',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        body: 'By accessing or using our website and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.',
      },
      {
        heading: '2. Use of the Website',
        body: 'You agree to use this website only for lawful purposes. You must not use our site to transmit harmful content, infringe intellectual property rights, or engage in fraudulent activities.',
      },
      {
        heading: '3. Product Information',
        body: 'We strive to present accurate product descriptions, pricing, and images. However, we reserve the right to correct any errors and to cancel orders placed at incorrect prices.',
      },
      {
        heading: '4. Orders and Payment',
        body: 'An order confirmation does not constitute acceptance of the order. We reserve the right to cancel or refuse any order. All prices are in Indian Rupees (INR) and include applicable taxes unless stated otherwise.',
      },
      {
        heading: '5. Intellectual Property',
        body: 'All content on this website — including product images, descriptions, logos, and designs — is the intellectual property of Advik Furniture and Interior and is protected by applicable copyright laws.',
      },
      {
        heading: '6. Limitation of Liability',
        body: 'Advik Furniture shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our maximum liability is limited to the purchase price of the product in question.',
      },
      {
        heading: '7. Governing Law',
        body: 'These terms are governed by the laws of India and the state of Tamil Nadu. Any disputes shall be subject to the exclusive jurisdiction of the courts of Chennai, Tamil Nadu.',
      },
      {
        heading: '8. Changes to Terms',
        body: 'We may update these terms from time to time. Continued use of our website after changes constitutes acceptance of the revised terms.',
      },
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    subtitle: 'How we use cookies to improve your experience',
    description:
      'Last updated: May 2026. This policy explains what cookies are, how Advik Furniture uses them, and your choices.',
    sections: [
      {
        heading: 'What Are Cookies?',
        body: 'Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, shopping cart contents, and improve overall user experience.',
      },
      {
        heading: 'Essential Cookies',
        body: 'These are required for the website to function properly. They include session tokens, authentication states, and shopping cart data. These cannot be disabled without affecting site functionality.',
      },
      {
        heading: 'Performance Cookies',
        body: 'We use analytics cookies (such as Vercel Analytics) to understand how visitors interact with our website. This helps us improve performance and user experience.',
      },
      {
        heading: 'Preference Cookies',
        body: 'These cookies remember your settings such as theme preference (dark/light mode), delivery location (PIN code), and language preferences.',
      },
      {
        heading: 'Marketing Cookies',
        body: 'We may use marketing cookies to show you relevant advertisements. These are only placed with your explicit consent and can be withdrawn at any time.',
      },
      {
        heading: 'Managing Cookies',
        body: 'You can control and delete cookies through your browser settings. Note that disabling cookies may affect some features of our website. Most browsers allow you to block third-party cookies while keeping essential ones.',
      },
    ],
  },
};

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) return { title: 'Not Found' };
  return {
    title: page.title,
    description: page.description,
  };
}

// ─── Contact Section ──────────────────────────────────────────────────────────

function ContactSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      {/* Contact Info Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white mb-6">Get in Touch</h2>

        <a
          href="https://www.google.com/maps/place/Advik+Furniture+And+Interior/@13.1765737,80.1961679,17z"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-4 p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-400 dark:hover:border-stone-600 transition-all hover:shadow-md group"
        >
          <div className="p-2.5 rounded-lg bg-stone-100 dark:bg-stone-800 group-hover:bg-stone-200 dark:group-hover:bg-stone-700 transition-colors">
            <MapPin size={18} className="text-stone-600 dark:text-stone-300" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Address</p>
            <p className="text-sm text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
              663A, Thandal Kazhani, G.N.T Road,<br />Puzhal Redhills, Chennai - 600066
            </p>
          </div>
        </a>

        <a
          href="https://wa.me/919471983191"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-4 p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-400 dark:hover:border-stone-600 transition-all hover:shadow-md group"
        >
          <div className="p-2.5 rounded-lg bg-stone-100 dark:bg-stone-800 group-hover:bg-stone-200 dark:group-hover:bg-stone-700 transition-colors">
            <Phone size={18} className="text-stone-600 dark:text-stone-300" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Phone / WhatsApp</p>
            <p className="text-sm text-stone-700 dark:text-stone-300 font-medium">+91 94719 83191</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Monday – Saturday, 9am – 7pm IST</p>
          </div>
        </a>

        <a
          href="mailto:info@advik.com"
          className="flex items-start gap-4 p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-400 dark:hover:border-stone-600 transition-all hover:shadow-md group"
        >
          <div className="p-2.5 rounded-lg bg-stone-100 dark:bg-stone-800 group-hover:bg-stone-200 dark:group-hover:bg-stone-700 transition-colors">
            <Mail size={18} className="text-stone-600 dark:text-stone-300" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Email</p>
            <p className="text-sm text-stone-700 dark:text-stone-300 font-medium">info@advik.com</p>
            <p className="text-[11px] text-stone-400 mt-0.5">We respond within 24 hours</p>
          </div>
        </a>

        <a
          href="https://www.instagram.com/advik_furniture_and_interior/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-4 p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-400 dark:hover:border-stone-600 transition-all hover:shadow-md group"
        >
          <div className="p-2.5 rounded-lg bg-stone-100 dark:bg-stone-800 group-hover:bg-stone-200 dark:group-hover:bg-stone-700 transition-colors">
            <MessageSquare size={18} className="text-stone-600 dark:text-stone-300" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Social Media</p>
            <p className="text-sm text-stone-700 dark:text-stone-300 font-medium">Facebook · Instagram · Threads</p>
            <p className="text-[11px] text-stone-400 mt-0.5">@advik_furniture_and_interior</p>
          </div>
        </a>
      </div>

      {/* Google Maps Embed */}
      <div className="rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 min-h-80 h-full">
        <iframe
          title="Advik Furniture and Interior - Location Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3884.394!2d80.1961679!3d13.1765737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a527ba51a8c7c67%3A0xf3152980307d6e2f!2sAdvik%20Furniture%20And%20Interior!5e0!3m2!1sen!2sin!4v1"
          width="100%"
          height="100%"
          style={{ border: 0, minHeight: '320px' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default async function InfoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = pages[slug];

  if (!page) {
    notFound();
  }

  const isContact = slug === 'contact';
  const isFaq = slug === 'faq';

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 pt-32 pb-24">
      {/* Hero Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 mb-12">
        <div className="container mx-auto px-6 py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-6">
            <Link href="/" className="hover:text-stone-600 dark:hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight size={10} />
            <span className="text-stone-600 dark:text-stone-300">{page.title}</span>
          </nav>

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400 dark:text-stone-500 mb-3">
            {page.subtitle}
          </p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 dark:text-white tracking-tight mb-4">
            {page.title}
          </h1>
          <p className="text-stone-500 dark:text-stone-400 max-w-2xl text-sm md:text-base leading-relaxed">
            {page.description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6">
        {/* Contact page special layout */}
        {isContact && <ContactSection />}

        {/* FAQ accordion */}
        {isFaq && page.sections.length > 0 && (
          <div className="max-w-3xl mx-auto space-y-3">
            {page.sections.map((section, i) => (
              <details
                key={i}
                className="group border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-900 overflow-hidden"
              >
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                  <span className="text-sm font-bold text-stone-900 dark:text-white pr-4">
                    {section.heading}
                  </span>
                  <ChevronRight
                    size={16}
                    className="text-stone-400 shrink-0 transition-transform duration-200 group-open:rotate-90"
                  />
                </summary>
                <div className="px-6 pb-6">
                  <div className="h-px bg-stone-100 dark:bg-stone-800 mb-4" />
                  <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    {section.body}
                  </p>
                </div>
              </details>
            ))}
          </div>
        )}

        {/* All other pages: numbered sections */}
        {!isContact && !isFaq && page.sections.length > 0 && (
          <div className="max-w-3xl mx-auto space-y-6">
            {page.sections.map((section, i) => (
              <div
                key={i}
                className="p-6 md:p-8 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
              >
                <div className="flex items-start gap-4">
                  <span className="text-xs font-black text-stone-200 dark:text-stone-700 mt-1 shrink-0 font-sans min-w-[2rem]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h2 className="text-sm font-serif font-bold text-stone-900 dark:text-white mb-2">
                      {section.heading}
                    </h2>
                    <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                      {section.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Footer Banner */}
        <div className="max-w-3xl mx-auto mt-16 p-8 md:p-10 rounded-2xl bg-stone-900 dark:bg-stone-800 text-white text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">
            Still have questions?
          </p>
          <h2 className="text-2xl font-serif font-bold mb-4">We&apos;re here to help</h2>
          <p className="text-stone-400 text-sm mb-8 max-w-md mx-auto">
            Our customer support team is available Monday to Saturday, 9am – 7pm IST.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:info@advik.com"
              className="px-8 py-3 bg-white text-stone-900 font-bold text-xs uppercase tracking-widest rounded-full hover:bg-stone-200 transition-all active:scale-95"
            >
              Email Us
            </a>
            <a
              href="https://wa.me/919471983191"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-stone-600 text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-stone-800 transition-all active:scale-95"
            >
              WhatsApp Chat
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Pre-render all known slugs at build time
export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}
