import React from 'react';
import { WebsiteContent } from '../types';
import { ArrowRight, CheckCircle2, Sparkles, MessageCircle, Code2, Zap, Layout } from 'lucide-react';

interface HeroProps {
  content: WebsiteContent;
}

export const Hero: React.FC<HeroProps> = ({ content }) => {
  const heroSubheading = content.heroSubheading.startsWith(
    'Devlophic is a premier freelance website development studio.'
  ) ? '' : content.heroSubheading;

  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* Background Neon Orbs */}
      <div className="orb-glow w-[500px] h-[500px] -top-40 left-1/2 -translate-x-1/2 bg-cyan-500/20" />
      <div className="orb-glow w-[400px] h-[400px] top-60 -left-20 bg-blue-600/15" />
      <div className="orb-glow w-[450px] h-[450px] top-80 -right-20 bg-emerald-500/15" />

      {/* Subtle Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Logo Badge & Brand Tag */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md mb-8 shadow-inner shadow-cyan-500/10 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <img
              src="/devlophiclogo.jpeg"
              alt="Devlophic"
              className="w-5 h-5 rounded-md object-contain"
            />
            <span className="text-xs uppercase font-bold tracking-widest text-cyan-300">
              Devlophic &bull; Official Website Development
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </div>

          {/* Main Heading */}
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
            We Build Websites That{' '}
            <span className="gradient-text block sm:inline">
              Elevate Your Business
            </span>
          </h1>

          {/* Subheading */}
          {heroSubheading && (
            <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed mb-10 max-w-2xl">
              {heroSubheading}
            </p>
          )}

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-14">
            <a
              href="#projects"
              className="w-full sm:w-auto gradient-glow-btn px-8 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 group"
            >
              <span>Explore Our Work</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href={`https://wa.me/91${content.contact.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20Devlophic,%20I'm%20interested%20in%20building%20a%20website%20for%20my%20business.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto gradient-outline-btn px-7 py-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Discuss on WhatsApp</span>
            </a>
          </div>

          {/* Feature Pillars Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full text-left">
            <div className="gradient-border-card p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-1.5">
                <Layout className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Website Exclusive</h4>
              </div>
              <p className="text-xs text-slate-400">100% dedicated to high-performance website development.</p>
            </div>

            <div className="gradient-border-card p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-1.5">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Custom Built</h4>
              </div>
              <p className="text-xs text-slate-400">Tailored codebases with zero bloat and clean architecture.</p>
            </div>

            <div className="gradient-border-card p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-1.5">
                <Zap className="w-4 h-4 text-blue-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Peak Speed</h4>
              </div>
              <p className="text-xs text-slate-400">Sub-second load times and 90+ Core Web Vitals standard.</p>
            </div>

            <div className="gradient-border-card p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Direct Access</h4>
              </div>
              <p className="text-xs text-slate-400">Direct freelance collaboration via WhatsApp & Email.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
