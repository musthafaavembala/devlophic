import React from 'react';
import { WebsiteContent } from '../types';
import {
  Mail,
  Phone,
  MessageCircle,
  ArrowUp,
  Shield
} from 'lucide-react';
import {
  FacebookBrandIcon,
  InstagramBrandIcon,
  LinkedInBrandIcon,
  TelegramBrandIcon,
  WhatsAppBrandIcon,
  XBrandIcon,
  YouTubeBrandIcon
} from './Icons';

interface FooterProps {
  content: WebsiteContent;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ content, onOpenAdmin }) => {
  const instagramUrl = content.socials.instagram;
  const whatsappUrl = content.socials.whatsapp || content.contact.whatsappDirectUrl ||
    `https://wa.me/91${content.contact.whatsapp.replace(/[^0-9]/g, '')}`;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#05070a] border-t border-white/10 pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/5">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden p-[2px] bg-gradient-to-tr from-blue-600 via-cyan-400 to-emerald-400">
                <div className="w-full h-full bg-[#080B10] rounded-[10px] overflow-hidden flex items-center justify-center">
                  <img
                    src="/devlophiclogo.jpeg"
                    alt="Devlophic Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <span className="font-heading font-extrabold text-2xl text-white tracking-tight">
                {content.brandName || 'Devlophic'}
              </span>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              {content.tagline ||
                'High-Performance Website Development for Forward-Thinking Brands. Engineered for speed, clean architecture, and measurable business growth.'}
            </p>

          </div>

          {/* Website Development Categories Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
              Website Solutions
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#services" className="hover:text-cyan-400 transition-colors">
                  Business Websites
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-cyan-400 transition-colors">
                  Portfolio Websites
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-cyan-400 transition-colors">
                  Landing Page Websites
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-cyan-400 transition-colors">
                  E-commerce Websites
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-cyan-400 transition-colors">
                  Custom Websites
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Contact Info */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
              Direct Contact
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a
                  href={`mailto:${content.contact.email}`}
                  className="hover:text-white transition-colors"
                >
                  {content.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`tel:${content.contact.phone}`}
                  className="hover:text-white transition-colors"
                >
                  +91 {content.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/91${content.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  Direct WhatsApp Chat
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} {content.brandName || 'Devlophic'}. All rights reserved.</span>
            <span>&bull;</span>
            <span className="text-slate-400">Official Website Development Studio</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-slate-500 hover:text-cyan-400 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 border border-white/5 text-slate-400 hover:text-white hover:border-white/20 transition-all"
              title="Scroll to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <section
          aria-labelledby="footer-social-heading"
          className="mt-10 border-t border-white/5 pt-8 text-center"
        >
          <h4
            id="footer-social-heading"
            className="mb-5 font-heading text-xs font-bold uppercase tracking-wider text-white"
          >
            Social Media
          </h4>
          <ul className="flex flex-wrap items-center justify-center gap-3">
            <li>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-pink-500/40 hover:text-pink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
              >
                <InstagramBrandIcon className="h-5 w-5" />
              </a>
            </li>
            <li>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                title="WhatsApp"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:text-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <WhatsAppBrandIcon className="h-5 w-5" />
              </a>
            </li>
            <li>
              <span
                role="img"
                aria-label="Facebook"
                title="Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-400"
              >
                <FacebookBrandIcon className="h-5 w-5" />
              </span>
            </li>
            <li>
              <span
                role="img"
                aria-label="X"
                title="X"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-400"
              >
                <XBrandIcon className="h-5 w-5" />
              </span>
            </li>
            <li>
              <span
                role="img"
                aria-label="YouTube"
                title="YouTube"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-400"
              >
                <YouTubeBrandIcon className="h-5 w-5" />
              </span>
            </li>
            <li>
              <span
                role="img"
                aria-label="Telegram"
                title="Telegram"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-400"
              >
                <TelegramBrandIcon className="h-5 w-5" />
              </span>
            </li>
            <li>
              <span
                role="img"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-400"
              >
                <LinkedInBrandIcon className="h-5 w-5" />
              </span>
            </li>
          </ul>
        </section>
      </div>
    </footer>
  );
};
