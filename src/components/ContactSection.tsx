import React, { useState } from 'react';
import { WebsiteContent } from '../types';
import {
  Mail,
  Phone,
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import { InstagramIcon } from './Icons';

interface ContactSectionProps {
  content: WebsiteContent;
  selectedServicePreset?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  content,
  selectedServicePreset
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceCategory: selectedServicePreset || 'Business Website',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionWarning, setSubmissionWarning] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Sync selected service if changed from outside
  React.useEffect(() => {
    if (selectedServicePreset) {
      setFormData((prev) => ({ ...prev, serviceCategory: selectedServicePreset }));
    }
  }, [selectedServicePreset]);

  const handleCopy = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setSubmissionWarning(null);

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const category = formData.serviceCategory.trim();
    const message = formData.message.trim();

    if (!name || !email || !phone || !category || !message) {
      setError('Please complete your name, email, WhatsApp number, category, and message.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const configuredWhatsAppNumber = [
      content.contact.whatsappDirectUrl,
      content.socials.whatsapp
    ].map((url) => url.match(/^https:\/\/(?:www\.)?wa\.me\/(\d{8,15})(?:[/?#]|$)/i)?.[1])
      .find(Boolean);

    if (!configuredWhatsAppNumber) {
      setError('WhatsApp is not configured. Please contact us by email instead.');
      return;
    }

    const whatsappMessage = [
      'New Project Enquiry',
      `Name: ${name}`,
      `Gmail: ${email}`,
      `Category: ${category}`,
      `Message: ${message}`
    ].join('\n');
    const enquiryWhatsAppUrl = `https://wa.me/${configuredWhatsAppNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    setLoading(true);

    let whatsappWindow: Window | null;
    try {
      whatsappWindow = window.open(enquiryWhatsAppUrl, '_blank');
      if (whatsappWindow) {
        whatsappWindow.opener = null;
      }
    } catch (openError) {
      console.error('Could not open WhatsApp enquiry:', openError);
      setWhatsappUrl(enquiryWhatsAppUrl);
      setError('We could not open WhatsApp automatically. Use the button below to open your pre-filled enquiry.');
      setLoading(false);
      return;
    }

    if (!whatsappWindow) {
      setWhatsappUrl(enquiryWhatsAppUrl);
      setError('Your browser blocked the WhatsApp window. Use the button below to open your pre-filled enquiry.');
      setLoading(false);
      return;
    }
    setWhatsappUrl(enquiryWhatsAppUrl);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          name,
          email,
          phone,
          serviceCategory: category,
          message
        })
      });

      const contentType = response.headers.get('content-type') || '';
      let data: any = null;

      if (contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch {
          data = null;
        }
      }

      if (!response.ok) {
        const errorMsg = data?.error || 'Unable to submit enquiry right now. Please reach out to us directly via WhatsApp or Email below.';
        throw new Error(errorMsg);
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Contact submission error:', err);
      setSubmissionWarning(
        'WhatsApp was opened, but we could not save a copy of your enquiry to our dashboard. Please send it in WhatsApp to complete your enquiry.'
      );
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const whatsAppDirectUrl = content.contact.whatsappDirectUrl || content.socials.whatsapp;

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#07090e]">
      {/* Background Neon Orbs */}
      <div className="orb-glow w-[500px] h-[500px] -bottom-40 right-10 bg-emerald-500/10 pointer-events-none" />
      <div className="orb-glow w-[400px] h-[400px] top-10 -left-20 bg-cyan-500/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Start A Conversation</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-5">
            Let's Build Your <span className="gradient-text">Website</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Ready to bring your website vision to reality? Reach out directly via WhatsApp or submit a project inquiry below. We respond promptly with an architectural scope and pricing estimate.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Direct Contact Info */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="font-heading text-xl font-bold text-white mb-2">
                Direct Communication Channels
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Connect directly with the Devlophic team. We prioritize clear, agile freelance collaboration with no middleman delays.
              </p>

              {/* Email Card */}
              <div className="gradient-border-card p-5 rounded-2xl flex items-center justify-between group">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Email Inquiries
                    </span>
                    <a
                      href={`mailto:${content.contact.email}`}
                      className="text-sm font-semibold text-white hover:text-cyan-300 transition-colors"
                    >
                      {content.contact.email}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(content.contact.email, 'email')}
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Copy Email"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* WhatsApp & Call Card */}
              <div className="gradient-border-card p-5 rounded-2xl flex items-center justify-between group">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      WhatsApp & Call
                    </span>
                    <a
                      href={`tel:${content.contact.phone}`}
                      className="text-sm font-semibold text-white hover:text-emerald-300 transition-colors"
                    >
                      {content.contact.phone}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(content.contact.phone, 'phone')}
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Copy Number"
                >
                  {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Instagram Card */}
              {content.socials.instagram && (
                <a
                  href={content.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gradient-border-card p-5 rounded-2xl flex items-center justify-between group hover:border-pink-500/40"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-pink-950/60 border border-pink-500/30 flex items-center justify-center text-pink-400">
                      <InstagramIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Official Instagram
                      </span>
                      <span className="text-sm font-semibold text-white group-hover:text-pink-300 transition-colors">
                        @devlophic
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-pink-300 transition-colors" />
                </a>
              )}
            </div>

            {/* Direct WhatsApp Callout Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-500/30">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
                <MessageCircle className="w-4 h-4" />
                <span>Instant Consultation on WhatsApp</span>
              </div>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Have an urgent website requirement or want to discuss a live quote right now? Chat with us directly on WhatsApp.
              </p>
              <a
                href={whatsAppDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="gradient-border-card p-6 sm:p-8 rounded-2xl">
              <h3 className="font-heading text-2xl font-bold text-white mb-2">
                Request a Website Development Quote
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mb-6">
                Tell us about your brand and website requirements. We will analyze your needs and provide a clear project plan.
              </p>

              {submitted ? (
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center mb-4 text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-heading text-2xl font-bold text-white mb-2">
                    WhatsApp Opened
                  </h4>
                  <p className="text-slate-300 text-sm max-w-md mb-6">
                    Your enquiry is ready in WhatsApp. Review the details and tap Send there to deliver it to Devlophic.
                  </p>
                  {submissionWarning && (
                    <p className="text-amber-300 text-xs max-w-md mb-5" role="status">
                      {submissionWarning}
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={whatsappUrl || whatsAppDirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Reopen WhatsApp Enquiry</span>
                    </a>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setSubmissionWarning(null);
                        setWhatsappUrl(null);
                        setFormData({
                          name: '',
                          email: '',
                          phone: '',
                          serviceCategory: 'Business Website',
                          message: ''
                        });
                      }}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs space-y-2.5">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                      <div className="pt-1 flex flex-wrap items-center gap-2">
                        {whatsappUrl && (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/30 border border-emerald-400/40 text-emerald-300 hover:text-white hover:bg-emerald-600/50 font-semibold text-[11px] transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Open WhatsApp Enquiry</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Your Name / Company Name *
                      </label>
                      <input
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="e.g. Alex Vance or Nexus Corp"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder="e.g. +91 9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Website Development Category *
                      </label>
                      <select
                        required
                        value={formData.serviceCategory}
                        onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                      >
                        <option value="Business Website">Business Website</option>
                        <option value="Portfolio Website">Portfolio Website</option>
                        <option value="Landing Page Website">Landing Page Website</option>
                        <option value="E-commerce Website">E-commerce Website</option>
                        <option value="Custom Website">Custom Website</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Project Scope & Goals *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please describe your website goals, target audience, any reference websites you like, or special features needed..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full gradient-glow-btn py-3.5 px-6 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Submitting Inquiry...</span>
                    ) : (
                      <>
                        <span>Submit Project Inquiry</span>
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
