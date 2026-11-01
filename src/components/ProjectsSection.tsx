import React, { useState } from 'react';
import { ProjectItem } from '../types';
import { ExternalLink, Eye, Sparkles, Filter, X, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from './Icons';

interface ProjectsSectionProps {
  projects: ProjectItem[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  const categories = [
    'All',
    'Business Website',
    'Portfolio Website',
    'Landing Page',
    'E-commerce',
    'Custom Website'
  ];

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-[#0a0e17]/70">
      {/* Background Lighting */}
      <div className="orb-glow w-[500px] h-[500px] top-1/4 -right-20 bg-cyan-600/10 pointer-events-none" />
      <div className="orb-glow w-[400px] h-[400px] bottom-10 -left-20 bg-emerald-600/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Work & Portfolio</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-5">
            Our <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            A curated showcase of website development projects engineered for performance, responsiveness, and brand impact. Every build is customized for maximum client results.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900/90 border border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="gradient-border-card rounded-2xl overflow-hidden flex flex-col group hover:border-cyan-400/40 transition-all duration-300"
            >
              {/* Project Image Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950 border-b border-white/5">
                <img
                  src={project.imageUrl || '/devlophiclogo.jpeg'}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback to logo or clean gradient if external image fails
                    (e.target as HTMLImageElement).src = '/devlophiclogo.jpeg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B10] via-transparent to-transparent opacity-80" />

                {/* Badges on Image */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-950/80 border border-white/10 text-cyan-300 backdrop-blur-md">
                    {project.category}
                  </span>
                  {project.featured && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 backdrop-blur-md">
                      Featured
                    </span>
                  )}
                </div>

                {/* Quick inspect button */}
                <button
                  onClick={() => setActiveModalProject(project)}
                  className="absolute bottom-3 right-3 p-2 rounded-xl bg-slate-900/80 border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md hover:bg-cyan-500 hover:text-black"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm line-clamp-3 mb-4 leading-relaxed">
                    {project.shortDescription}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Links */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-all flex items-center gap-1.5"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all flex items-center gap-1.5"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>Code</span>
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveModalProject(project)}
                    className="text-xs font-semibold text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                  >
                    <span>Overview</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="gradient-border-card bg-[#0d121d] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative">
            <button
              onClick={() => setActiveModalProject(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/9] rounded-xl overflow-hidden mb-6 bg-slate-950">
              <img
                src={activeModalProject.imageUrl || '/devlophiclogo.jpeg'}
                alt={activeModalProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                {activeModalProject.category}
              </span>
              {activeModalProject.featured && (
                <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                  Featured Build
                </span>
              )}
            </div>

            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mb-4">
              {activeModalProject.title}
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              {activeModalProject.fullDescription || activeModalProject.shortDescription}
            </p>

            <div className="mb-6">
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">
                Tech Stack & Libraries
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeModalProject.tags.map((t, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-lg bg-slate-900 border border-white/10 text-slate-200"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-wrap gap-3">
              {activeModalProject.liveUrl && (
                <a
                  href={activeModalProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gradient-glow-btn px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  <span>Launch Live Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {activeModalProject.githubUrl && (
                <a
                  href={activeModalProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gradient-outline-btn px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>View Repository</span>
                </a>
              )}
              {activeModalProject.externalUrl && (
                <a
                  href={activeModalProject.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl text-xs font-medium bg-slate-900 border border-white/10 text-slate-300 hover:text-white flex items-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>External Reference</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
