import React, { useState } from 'react';
import { ServiceItem } from '../types';
import {
  Briefcase,
  Layers,
  Rocket,
  ShoppingCart,
  Cpu,
  Check,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectServiceForQuote?: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectServiceForQuote
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Service category icon mapper
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'srv-business':
        return <Briefcase className="w-6 h-6 text-cyan-400" />;
      case 'srv-portfolio':
        return <Layers className="w-6 h-6 text-blue-400" />;
      case 'srv-landing':
        return <Rocket className="w-6 h-6 text-emerald-400" />;
      case 'srv-ecommerce':
        return <ShoppingCart className="w-6 h-6 text-cyan-300" />;
      case 'srv-custom':
      default:
        return <Cpu className="w-6 h-6 text-emerald-300" />;
    }
  };

  const filteredServices =
    activeCategory === 'all'
      ? services
      : services.filter((s) => s.id === activeCategory);

  const handleInquire = (serviceTitle: string) => {
    if (onSelectServiceForQuote) {
      onSelectServiceForQuote(serviceTitle);
    }
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-24 relative overflow-hidden bg-[#0a0e17]/60">
      {/* Background Decorative Blur */}
      <div className="orb-glow w-[500px] h-[500px] top-1/3 -right-40 bg-cyan-600/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Dedicated Website Development</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-5">
            Website Development <span className="gradient-text">Services</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Devlophic specializes strictly in high-performance website development. Whether you need a corporate presence, a high-converting landing page, or a bespoke web application, we engineer every project from the ground up.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              activeCategory === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/80 border border-white/10 text-slate-400 hover:text-white hover:border-white/20'
            }`}
          >
            All Website Categories ({services.length})
          </button>
          {services.map((srv) => (
            <button
              key={srv.id}
              onClick={() => setActiveCategory(srv.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeCategory === srv.id
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900/80 border border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              {srv.title}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="gradient-border-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between group hover:border-cyan-400/40"
            >
              <div>
                {/* Header / Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center group-hover:scale-105 group-hover:border-cyan-400/50 transition-all duration-300">
                    {getCategoryIcon(service.id)}
                  </div>
                  <span className="text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
                    {service.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Features List */}
                <div className="space-y-2.5 mb-6 pt-4 border-t border-white/5">
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block mb-2">
                    Key Deliverables
                  </span>
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-emerald-400" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer / Action */}
              <div className="pt-6 border-t border-white/5 mt-auto">
                <div className="text-[11px] text-slate-400 mb-4">
                  <strong className="text-slate-300 font-medium">Recommended for: </strong>
                  {service.recommendedFor}
                </div>
                <button
                  onClick={() => handleInquire(service.title)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white hover:bg-cyan-950/40 transition-all flex items-center justify-center gap-2 group/btn"
                >
                  <span>Build a {service.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
