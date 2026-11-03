import React from 'react';
import { ExternalLink } from 'lucide-react';

const projects = [
  {
    name: 'E-World Service',
    url: 'https://e-worldservice.vercel.app/'
  },
  {
    name: 'Kaliyattamukku Bus Time',
    url: 'https://kaliyattamukku-bus-time-8xp1.vercel.app/'
  }
];

export const MyProjectsSection: React.FC = () => (
  <section id="my-projects" className="py-16 sm:py-20 bg-[#080B10]">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
          Selected work
        </p>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
          My Projects
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((project) => (
          <article
            key={project.name}
            className="gradient-border-card rounded-xl p-5 sm:p-6 flex items-center justify-between gap-4"
          >
            <h3 className="font-heading text-base sm:text-lg font-semibold text-white">
              {project.name}
            </h3>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/60 px-3 py-2 text-xs font-semibold text-cyan-300 transition-colors hover:bg-cyan-500 hover:text-slate-950"
            >
              Live Website
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </article>
        ))}
      </div>
    </div>
  </section>
);
