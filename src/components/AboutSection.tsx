import React from 'react';
import { CompanyAbout } from '../types';
import { ShieldCheck, Zap, Target, Sparkles, CheckCircle2 } from 'lucide-react';

interface AboutSectionProps {
  about: CompanyAbout;
  brandName: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ about, brandName }) => {
  const getPillarIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <Zap className="w-5 h-5 text-cyan-400" />;
      case 1:
        return <Target className="w-5 h-5 text-emerald-400" />;
      case 2:
        return <Sparkles className="w-5 h-5 text-blue-400" />;
      case 3:
      default:
        return <CheckCircle2 className="w-5 h-5 text-cyan-300" />;
    }
  };

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="orb-glow w-[500px] h-[500px] top-1/2 -left-32 bg-blue-600/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Brand Identity Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="relative group mb-8">
              {/* Outer Gradient Ring */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500" />
              
              {/* Logo Card */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-[#080B10] border border-cyan-500/30 p-6 flex flex-col items-center justify-center shadow-2xl">
                <img
                  src="/devlophiclogo.jpeg"
                  alt={`${brandName} Official Logo`}
                  className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Devlophic Brand Philosophy</span>
            </div>

            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mb-4">
              We Build Websites That Mean Business
            </h3>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              At Devlophic, we view website development through a lens of engineering precision and strategic business growth. We do not use bloated multi-purpose themes or sluggish page builders—we build modern, custom-coded web architectures that load instantly and convert visitors into clients.
            </p>

            <div className="w-full grid grid-cols-2 gap-3 pt-4 border-t border-white/10 text-left">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="text-cyan-400 font-heading font-extrabold text-lg">100%</div>
                <div className="text-xs text-slate-400 font-medium">Bespoke Web Code</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="text-emerald-400 font-heading font-extrabold text-lg">&lt; 1.0s</div>
                <div className="text-xs text-slate-400 font-medium">Target Load Speed</div>
              </div>
            </div>
          </div>

          {/* Right Column: About Details & Core Pillars */}
          <div className="lg:col-span-7">
            <div className="mb-8">
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 block mb-2">
                Company Profile
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
                About <span className="gradient-text">{brandName}</span>
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-4">
                {about.overview}
              </p>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                {about.approach}
              </p>
            </div>

            {/* Core Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {about.corePillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/70 border border-white/5 hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center mb-3">
                    {getPillarIcon(idx)}
                  </div>
                  <h4 className="font-heading text-base font-bold text-white mb-1.5">
                    {pillar.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
