export interface ServiceItem {
  id: string;
  title: string;
  badge: string;
  description: string;
  features: string[];
  recommendedFor: string;
  featured?: boolean;
}

export interface TechCategory {
  id: string;
  name: string;
  description: string;
  technologies: {
    name: string;
    description: string;
    tag?: string;
  }[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'Business Website' | 'Portfolio Website' | 'Landing Page' | 'E-commerce' | 'Custom Website' | string;
  shortDescription: string;
  fullDescription: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  externalUrl?: string;
  imageUrl: string;
  featured: boolean;
  order: number;
}

export interface SocialLinks {
  instagram: string;
  whatsapp: string;
  github: string;
  linkedin: string;
  twitter: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  whatsapp: string;
  whatsappDirectUrl: string;
}

export interface CompanyAbout {
  title: string;
  headline: string;
  overview: string;
  approach: string;
  corePillars: {
    title: string;
    description: string;
  }[];
}

export interface WebsiteContent {
  brandName: string;
  tagline: string;
  heroHeading: string;
  heroSubheading: string;
  about: CompanyAbout;
  contact: ContactInfo;
  socials: SocialLinks;
  services: ServiceItem[];
  technologies: TechCategory[];
  projects: ProjectItem[];
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  serviceCategory: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'contacted';
}
