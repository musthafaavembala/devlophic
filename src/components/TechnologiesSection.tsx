import React from 'react';
import { TechCategory } from '../types';
import { Code, Database, Server, Cpu, Terminal, Shield } from 'lucide-react';

interface TechnologiesSectionProps {
  categories: TechCategory[];
}

export const TechnologiesSection: React.FC<TechnologiesSectionProps> = ({ categories }) => {
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'tech-frontend':
        return <Code className="w-5 h-5 text-cyan-400" />;
      case 'tech-backend':
        return <Server className="w-5 h-5 text-emerald-400" />;
      case 'tech-database':
        return <Database className="w-5 h-5 text-blue-400" />;
      case 'tech-infrastructure':
      default:
        return <Cpu className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <section id="technologies" className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="orb-glow w-[450px] h-[450px] -bottom-20 -left-20 bg-blue-600/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Terminal className="w-3.5 h-3.5" />
            <span>Our Technical Expertise</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-5">
            Technologies & <span className="gradient-text">Frameworks</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Devlophic builds websites using modern, industry-standard stacks. We select the ideal architectural tools to guarantee peak load speeds, rigorous data security, and seamless maintainability.
          </p>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="gradient-border-card rounded-2xl p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center">
                  {getCategoryIcon(cat.id)}
                </div>
                <div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-white">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400">{cat.description}</p>
                </div>
              </div>

              {/* Technologies within Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                {cat.technologies.map((tech, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900/90 border border-white/5 hover:border-cyan-500/30 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                        {tech.name}
                      </span>
                      {tech.tag && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
                          {tech.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {tech.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
