import React, { useState, useEffect } from 'react';
import { WebsiteContent } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { TechnologiesSection } from './components/TechnologiesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { MyProjectsSection } from './components/MyProjectsSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectDemo } from './components/ProjectDemo';

// Fallback initial content in case API is temporarily waiting
const fallbackContent: WebsiteContent = {
  brandName: "Devlophic",
  tagline: "High-Performance Website Development for Forward-Thinking Brands",
  heroHeading: "We Build Fast, High-Converting Websites That Grow Your Business",
  heroSubheading: "",
  about: {
    title: "About Devlophic",
    headline: "Engineering Digital Excellence for Ambitious Companies",
    overview: "Devlophic is a dedicated freelance website development company focused on delivering custom, high-impact web solutions. We specialize exclusively in building digital flagships—from high-converting marketing landing pages to full-scale e-commerce stores and custom business web applications.",
    approach: "We believe a great website is more than just clean aesthetics: it is your business's most valuable asset. That is why our development process couples precision engineering with modern architectural standards, ensuring lightning-quick load speeds, seamless responsiveness across all screen sizes, and intuitive user experiences.",
    corePillars: [
      {
        title: "Performance First",
        description: "Optimized Core Web Vitals, sub-second load times, and clean semantic code for peak efficiency."
      },
      {
        title: "Conversion-Focused",
        description: "Strategically structured layouts, persuasive call-to-actions, and friction-free user journeys."
      },
      {
        title: "Modern Architecture",
        description: "Crafted with cutting-edge tech stacks (React, Next.js, Node.js, Tailwind CSS) for scalability."
      },
      {
        title: "Dedicated Craftsmanship",
        description: "Meticulous attention to typography, responsive layouts, motion polish, and brand alignment."
      }
    ]
  },
  contact: {
    email: "devlophic@gmail.com",
    phone: "7306614242",
    whatsapp: "7306614242",
    whatsappDirectUrl: "https://wa.me/917306614242"
  },
  socials: {
    instagram: "https://instagram.com/devlophic",
    whatsapp: "https://wa.me/917306614242",
    github: "https://github.com/devlophic",
    linkedin: "https://linkedin.com/company/devlophic",
    twitter: "https://x.com/devlophic"
  },
  services: [
    {
      id: "srv-business",
      title: "Business Websites",
      badge: "Corporate & Enterprise",
      description: "Authoritative, elegant, and trust-building web platforms engineered to communicate your business value, capture qualified leads, and establish market leadership.",
      features: [
        "Executive brand positioning & tailored layouts",
        "Interactive services & case study showcases",
        "Lead capture forms & CRM integrations",
        "Enterprise-grade security & SEO foundations"
      ],
      recommendedFor: "Consultancies, Agencies, B2B Companies, Professional Firms",
      featured: true
    },
    {
      id: "srv-portfolio",
      title: "Portfolio Websites",
      badge: "Creative & Agency",
      description: "Visually captivating, interactive portfolio platforms designed to present creative work, agency credentials, and production catalogs with fluid motion.",
      features: [
        "Fluid media galleries & interactive case studies",
        "Custom subtle animations & micro-interactions",
        "Responsive grid architectures & dark/light aesthetics",
        "Frictionless client inquiry pathways"
      ],
      recommendedFor: "Studios, Creators, Architects, Freelancers, Production Houses",
      featured: true
    },
    {
      id: "srv-landing",
      title: "Landing Page Websites",
      badge: "High Conversion",
      description: "Hyper-focused, conversion-optimized landing pages engineered for product launches, paid ad campaigns, SaaS waitlists, and lead acquisition.",
      features: [
        "Persuasive visual storytelling & sales hierarchy",
        "A/B test ready modular architecture",
        "Sub-second load times for peak ad ROI",
        "Direct analytics, pixel & lead funnel hookups"
      ],
      recommendedFor: "SaaS Launches, Marketing Campaigns, Product Drops, Event Registrations",
      featured: true
    },
    {
      id: "srv-ecommerce",
      title: "E-commerce Websites",
      badge: "Storefronts & Sales",
      description: "High-performing digital storefronts with seamless product discovery, secure checkout workflows, automated inventory sync, and conversion-optimized carts.",
      features: [
        "Stripe, PayPal, UPI & multi-gateway integrations",
        "Fast product filtering, search & cart management",
        "Mobile-first checkout with high conversion rate",
        "Order management & automated invoice generation"
      ],
      recommendedFor: "D2C Brands, Retail Boutiques, Digital Product Creators, Merch Stores",
      featured: true
    },
    {
      id: "srv-custom",
      title: "Custom Websites",
      badge: "Bespoke Web Solutions",
      description: "Tailored web applications and bespoke web platforms crafted to fit unique business workflows, client portals, real-time dashboards, and proprietary systems.",
      features: [
        "Custom frontend & backend fullstack architecture",
        "Dynamic databases, auth flows & user dashboards",
        "Third-party API integrations & automated workflows",
        "Scalable cloud deployment & automated CI/CD"
      ],
      recommendedFor: "Tech Startups, Proprietary Platforms, Membership Hubs, Internal Portals",
      featured: true
    }
  ],
  technologies: [
    {
      id: "tech-frontend",
      name: "Frontend Development",
      description: "Blazing fast, responsive user interfaces built with modern component architectures.",
      technologies: [
        { name: "React.js", description: "Modern component-based interactive interfaces", tag: "Core" },
        { name: "Next.js", description: "Server-side rendering, SSR & hybrid static generation", tag: "Production" },
        { name: "TypeScript", description: "Type-safe robust frontend codebases", tag: "Standard" },
        { name: "Tailwind CSS", description: "Design systems with modern utility-first CSS", tag: "Styling" },
        { name: "Framer Motion", description: "Fluid animations and micro-interactions", tag: "Motion" },
        { name: "HTML5 / Modern CSS", description: "Semantic web standards and responsive layouts", tag: "Foundation" }
      ]
    },
    {
      id: "tech-backend",
      name: "Backend & APIs",
      description: "Secure, performant server architecture and scalable data pipelines.",
      technologies: [
        { name: "Node.js", description: "High-throughput asynchronous JavaScript runtime", tag: "Runtime" },
        { name: "Express.js", description: "Lightweight and robust REST API framework", tag: "Framework" },
        { name: "RESTful APIs", description: "Standardized, well-documented endpoints", tag: "Architecture" },
        { name: "Authentication (JWT / OAuth)", description: "Secure session and token management", tag: "Security" },
        { name: "Payment Gateways", description: "Stripe, Razorpay, PayPal, and UPI checkout", tag: "Payments" }
      ]
    },
    {
      id: "tech-database",
      name: "Databases & Storage",
      description: "Reliable data persistence, relational modeling, and lightning-fast caching.",
      technologies: [
        { name: "PostgreSQL", description: "Robust relational data modeling and querying", tag: "Relational" },
        { name: "MongoDB", description: "Flexible document-based NoSQL storage", tag: "NoSQL" },
        { name: "Supabase / SQLite", description: "Rapid serverless and embedded data solutions", tag: "Data Engine" },
        { name: "Cloud Storage", description: "Asset distribution with CDN integration", tag: "Assets" }
      ]
    },
    {
      id: "tech-infrastructure",
      name: "Infrastructure & Optimization",
      description: "Continuous deployment, global edge delivery, and web performance benchmarking.",
      technologies: [
        { name: "Vercel / Netlify", description: "Global edge CDN and serverless deployments", tag: "Hosting" },
        { name: "Docker & Cloud VMs", description: "Containerized reproducible application environments", tag: "DevOps" },
        { name: "Git & GitHub", description: "Version control and collaborative code pipelines", tag: "Workflow" },
        { name: "Lighthouse & Core Web Vitals", description: "90+ performance, accessibility and SEO scores", tag: "Quality" }
      ]
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "Apex Nexus Corporate Platform",
      category: "Business Website",
      shortDescription: "Enterprise corporate platform with custom service showcases, lead generation funnels, and executive branding.",
      fullDescription: "A comprehensive business platform engineered for high-growth enterprises. Features dynamic service catalogs, interactive ROI calculators, high-conversion contact pathways, and seamless responsive design.",
      tags: ["React", "TypeScript", "Tailwind CSS", "Node.js", "SEO Optimized"],
      liveUrl: "/demo/apex-nexus",
      githubUrl: "https://github.com/devlophic/apex-nexus-web",
      externalUrl: "https://devlophic.com",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
      featured: true,
      order: 1
    },
    {
      id: "proj-2",
      title: "Velox Studio Showcase",
      category: "Portfolio Website",
      shortDescription: "Interactive creative portfolio website featuring smooth transitions, fluid video reels, and case studies.",
      fullDescription: "Bespoke digital portfolio engineered for design studios and creative agencies. Highlights include dynamic portfolio filters, fluid lightbox galleries, dark-mode first aesthetic, and frictionless client inquiry capture.",
      tags: ["Next.js", "Tailwind CSS", "Framer Motion", "Responsive Design"],
      liveUrl: "/demo/velox-studio",
      githubUrl: "https://github.com/devlophic/velox-portfolio",
      externalUrl: "https://devlophic.com",
      imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
      featured: true,
      order: 2
    },
    {
      id: "proj-3",
      title: "NovaPay SaaS Landing Engine",
      category: "Landing Page",
      shortDescription: "Ultra-fast, high-converting product landing page with interactive pricing calculators and signup flow.",
      fullDescription: "Engineered specifically for conversion optimization. Delivers 98+ Google Lighthouse scores, modular testimonial carousels, dynamic pricing toggle, and integrated email waitlist capture.",
      tags: ["React", "Tailwind CSS", "Analytics", "Sub-Second Load"],
      liveUrl: "/demo/novapay",
      githubUrl: "https://github.com/devlophic/novapay-landing",
      externalUrl: "https://devlophic.com",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
      featured: true,
      order: 3
    },
    {
      id: "proj-4",
      title: "LuxeVibe Headless Storefront",
      category: "E-commerce",
      shortDescription: "Modern headless e-commerce store with rapid product filtering, instant cart drawer, and Stripe checkout.",
      fullDescription: "A high-conversion digital storefront built for modern direct-to-consumer sales. Includes instant client-side cart updates, secure multi-currency payment checkout, automated stock alerts, and lightning-fast product pages.",
      tags: ["React", "Node.js", "Stripe API", "Tailwind CSS", "E-commerce"],
      liveUrl: "/demo/luxevibe",
      githubUrl: "https://github.com/devlophic/luxevibe-commerce",
      externalUrl: "https://devlophic.com",
      imageUrl: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1200&auto=format&fit=crop",
      featured: true,
      order: 4
    },
    {
      id: "proj-5",
      title: "Synapse Client Web Portal",
      category: "Custom Website",
      shortDescription: "Bespoke full-stack web application with role-based client dashboard, automated scheduling, and reporting.",
      fullDescription: "Tailored custom web solution built to replace manual administrative workflows. Includes secure authenticated client dashboards, real-time project milestone tracking, document exchange, and automated email notifications.",
      tags: ["TypeScript", "React", "Express.js", "REST API", "Auth"],
      liveUrl: "/demo/synapse-portal",
      githubUrl: "https://github.com/devlophic/synapse-portal",
      externalUrl: "https://devlophic.com",
      imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop",
      featured: false,
      order: 5
    },
    {
      id: "proj-6",
      title: "E-World Service",
      category: "Business Website",
      shortDescription: "Online platform for E-World Service.",
      fullDescription: "A live web project for E-World Service, available at e-worldservice.vercel.app.",
      tags: ["Web Service", "Responsive Design"],
      liveUrl: "https://e-worldservice.vercel.app",
      githubUrl: "",
      externalUrl: "https://e-worldservice.vercel.app",
      imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
      featured: false,
      order: 6
    },
    {
      id: "proj-7",
      title: "Kaliyattamukku Bus Time",
      category: "Custom Website",
      shortDescription: "Bus time information for the Kaliyattamukku area.",
      fullDescription: "A live bus time information project for Kaliyattamukku, available at kaliyattamukku-bus-time-8xp1.vercel.app.",
      tags: ["Bus Schedule", "Travel Information", "Responsive Design"],
      liveUrl: "https://kaliyattamukku-bus-time-8xp1.vercel.app/",
      githubUrl: "",
      externalUrl: "https://kaliyattamukku-bus-time-8xp1.vercel.app/",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=1200&auto=format&fit=crop",
      featured: false,
      order: 7
    }
  ]
};

export function App() {
  const [content, setContent] = useState<WebsiteContent>(fallbackContent);
  const [selectedServicePreset, setSelectedServicePreset] = useState<string>('Business Website');
  const demoSlug = window.location.pathname.match(/^\/demo\/([^/]+)\/?$/)?.[1];

  useEffect(() => {
    // Fetch live content if backend is running, otherwise retain fallbackContent
    if (!window.location.pathname.match(/^\/demo\/[^/]+\/?$/)) {
      fetchContent();
    }
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          if (data && typeof data === 'object') {
            setContent(data);
          }
        }
      }
    } catch (err) {
      // Backend not running or static mode - keep default fallbackContent
    }
  };

  if (demoSlug) {
    return <ProjectDemo slug={demoSlug} />;
  }

  return (
    <div className="min-h-screen bg-[#080B10] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Navbar */}
      <Navbar content={content} />

      {/* Hero Section */}
      <main className="flex-grow">
        <Hero content={content} />

        {/* Website Development Services */}
        <ServicesSection
          services={content.services}
          onSelectServiceForQuote={(srvTitle) => setSelectedServicePreset(srvTitle)}
        />

        {/* Technical Expertise / Technologies */}
        <TechnologiesSection categories={content.technologies} />

        <MyProjectsSection />

        {/* Our Projects / Portfolio */}
        <ProjectsSection
          projects={content.projects.filter(
            (project) => project.id !== 'proj-6' && project.id !== 'proj-7'
          )}
        />

        {/* About Devlophic */}
        <AboutSection about={content.about} brandName={content.brandName} />

        {/* Contact Section */}
        <ContactSection
          content={content}
          selectedServicePreset={selectedServicePreset}
        />
      </main>

      {/* Footer */}
      <Footer content={content} />
    </div>
  );
}

export default App;
