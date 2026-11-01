import React, { useState, useEffect } from 'react';
import {
  WebsiteContent,
  ProjectItem,
  ServiceItem,
  TechCategory,
  ContactSubmission
} from '../types';
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Terminal,
  FolderGit2,
  Share2,
  Inbox,
  Lock,
  Save,
  LogOut,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
  Upload,
  MessageSquare,
  Mail,
  Phone
} from 'lucide-react';
import { GithubIcon } from './Icons';

interface AdminDashboardProps {
  initialContent: WebsiteContent;
  token: string;
  onLogout: () => void;
  onContentUpdated: (newContent: WebsiteContent) => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  initialContent,
  token,
  onLogout,
  onContentUpdated,
  onClose
}) => {
  const [content, setContent] = useState<WebsiteContent>(initialContent);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'brand' | 'services' | 'technologies' | 'projects' | 'contact' | 'inquiries' | 'security'
  >('overview');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Inquiries state
  const [inquiries, setInquiries] = useState<ContactSubmission[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Project editing state
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch inquiries on mount
  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const res = await fetch('/api/submissions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error('Failed to load inquiries', err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const handleSaveContent = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(content)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save changes');
      }

      onContentUpdated(data.content);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.message || 'Error saving content');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'New passwords do not match.', isError: true });
      return;
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Password update failed');
      }

      setPasswordMsg({ text: 'Password successfully updated!', isError: false });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMsg({ text: err.message, isError: true });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setEditingProject({
        ...editingProject,
        imageUrl: data.url
      });
    } catch (err: any) {
      alert(`Image upload error: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProjectModal = () => {
    if (!editingProject) return;

    let updatedProjects = [...content.projects];
    if (isNewProject) {
      updatedProjects.unshift(editingProject);
    } else {
      updatedProjects = updatedProjects.map((p) =>
        p.id === editingProject.id ? editingProject : p
      );
    }

    const updatedContent = { ...content, projects: updatedProjects };
    setContent(updatedContent);
    setEditingProject(null);
    setIsNewProject(false);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const updated = content.projects.filter((p) => p.id !== id);
      setContent({ ...content, projects: updated });
    }
  };

  const handleUpdateInquiryStatus = async (id: string, status: 'unread' | 'read' | 'contacted') => {
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setInquiries(
          inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07090e] text-slate-100 flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-200">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0a0e17] border-b md:border-b-0 md:border-r border-white/10 flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden p-[2px] bg-gradient-to-tr from-blue-600 via-cyan-400 to-emerald-400">
              <div className="w-full h-full bg-[#080B10] rounded-[10px] overflow-hidden flex items-center justify-center">
                <img
                  src="/devlophiclogo.jpeg"
                  alt="Devlophic Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div>
              <span className="font-heading font-extrabold text-lg text-white block">
                Devlophic
              </span>
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                Admin Control
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-400 hover:text-white"
            title="View Live Site"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview & Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('brand')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'brand'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Company & About</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'services'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Website Services (5)</span>
          </button>

          <button
            onClick={() => setActiveTab('technologies')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'technologies'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Technologies Stack</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'projects'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Portfolio Projects ({content.projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'contact'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Contact & Socials</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'inquiries'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <Inbox className="w-4 h-4" />
              <span>Inquiries</span>
            </div>
            {inquiries.filter((i) => i.status === 'unread').length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500 text-slate-950">
                {inquiries.filter((i) => i.status === 'unread').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'security'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Security & Password</span>
          </button>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={handleSaveContent}
            disabled={saving}
            className="w-full gradient-glow-btn py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save All Changes'}</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full py-2 px-4 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-red-400 hover:border-red-500/30 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#07090e]">
        {/* Top bar with alert feedback */}
        <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0a0e17]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h2 className="font-heading text-lg font-bold text-white capitalize">
              {activeTab === 'brand'
                ? 'Company Brand & About Devlophic'
                : activeTab === 'services'
                ? 'Website Development Services'
                : activeTab === 'technologies'
                ? 'Technologies & Expertise'
                : activeTab === 'projects'
                ? 'Projects & Portfolio Management'
                : activeTab === 'contact'
                ? 'Contact & Social Media Settings'
                : activeTab === 'inquiries'
                ? 'Client Quote Inquiries'
                : activeTab === 'security'
                ? 'Security & Access Credentials'
                : 'Admin Overview'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Changes saved successfully</span>
              </span>
            )}
            {saveError && (
              <span className="text-xs text-red-400 font-semibold flex items-center gap-1.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4" />
                <span>{saveError}</span>
              </span>
            )}
            <button
              onClick={handleSaveContent}
              disabled={saving}
              className="gradient-glow-btn px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white text-xs font-medium"
            >
              Close
            </button>
          </div>
        </header>

        {/* Tab View Body */}
        <div className="flex-1 overflow-y-auto p-6 max-w-6xl w-full mx-auto space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="gradient-border-card p-5 rounded-2xl">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Client Inquiries
                  </span>
                  <div className="font-heading text-3xl font-extrabold text-white">
                    {inquiries.length}
                  </div>
                  <span className="text-xs text-cyan-400 font-medium">
                    {inquiries.filter((i) => i.status === 'unread').length} unread
                  </span>
                </div>

                <div className="gradient-border-card p-5 rounded-2xl">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Live Projects
                  </span>
                  <div className="font-heading text-3xl font-extrabold text-white">
                    {content.projects.length}
                  </div>
                  <span className="text-xs text-emerald-400 font-medium">
                    {content.projects.filter((p) => p.featured).length} featured
                  </span>
                </div>

                <div className="gradient-border-card p-5 rounded-2xl">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Website Services
                  </span>
                  <div className="font-heading text-3xl font-extrabold text-white">
                    {content.services.length}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    100% Web Dev Focus
                  </span>
                </div>

                <div className="gradient-border-card p-5 rounded-2xl">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Contact WhatsApp
                  </span>
                  <div className="font-heading text-lg font-bold text-emerald-400 truncate">
                    {content.contact.whatsapp}
                  </div>
                  <span className="text-xs text-slate-400 truncate block">
                    {content.contact.email}
                  </span>
                </div>
              </div>

              {/* Business Identity Summary Card */}
              <div className="gradient-border-card p-6 rounded-2xl space-y-4">
                <h3 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                  <span>Devlophic Official Business Configuration</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    Verified
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                    <span className="font-bold text-white block">Official Brand Name:</span>
                    <span>{content.brandName}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                    <span className="font-bold text-white block">Business Model:</span>
                    <span>Freelance Website Development Studio</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                    <span className="font-bold text-white block">Contact Email:</span>
                    <span className="text-cyan-300">{content.contact.email}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                    <span className="font-bold text-white block">WhatsApp / Phone:</span>
                    <span className="text-emerald-300">{content.contact.phone}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="px-4 py-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold hover:bg-cyan-500 hover:text-black transition-all"
                  >
                    Manage Projects & Live Demo URLs
                  </button>
                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 text-xs font-semibold hover:text-white transition-all"
                  >
                    View Recent Quote Requests ({inquiries.length})
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMPANY & ABOUT */}
          {activeTab === 'brand' && (
            <div className="space-y-6">
              <div className="gradient-border-card p-6 rounded-2xl space-y-5">
                <h3 className="font-heading text-lg font-bold text-white">
                  Brand & Hero Messaging
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Brand Name (Fixed as Devlophic)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={content.brandName}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/50 border border-white/10 text-slate-400 text-sm cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={content.tagline}
                    onChange={(e) => setContent({ ...content, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Hero Section Headline
                  </label>
                  <input
                    type="text"
                    value={content.heroHeading}
                    onChange={(e) => setContent({ ...content, heroHeading: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Hero Section Subheading
                  </label>
                  <textarea
                    rows={3}
                    value={content.heroSubheading}
                    onChange={(e) => setContent({ ...content, heroSubheading: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* About Devlophic */}
              <div className="gradient-border-card p-6 rounded-2xl space-y-5">
                <h3 className="font-heading text-lg font-bold text-white">
                  About Devlophic Section
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={content.about.title}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        about: { ...content.about, title: e.target.value }
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Company Overview
                  </label>
                  <textarea
                    rows={4}
                    value={content.about.overview}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        about: { ...content.about, overview: e.target.value }
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Development Approach
                  </label>
                  <textarea
                    rows={4}
                    value={content.about.approach}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        about: { ...content.about, approach: e.target.value }
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WEBSITE SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300">
                <strong>Business Scope Rule:</strong> Devlophic provides exclusively Website Development services. You can configure and edit all 5 website development categories below.
              </div>

              {content.services.map((service, index) => (
                <div key={service.id} className="gradient-border-card p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-md bg-white/5 text-cyan-400">
                      Category #{index + 1}
                    </span>
                    <input
                      type="text"
                      placeholder="Badge"
                      value={service.badge}
                      onChange={(e) => {
                        const updated = [...content.services];
                        updated[index].badge = e.target.value;
                        setContent({ ...content, services: updated });
                      }}
                      className="px-3 py-1 rounded-lg bg-slate-900 border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Category Title
                      </label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) => {
                          const updated = [...content.services];
                          updated[index].title = e.target.value;
                          setContent({ ...content, services: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Recommended For
                      </label>
                      <input
                        type="text"
                        value={service.recommendedFor}
                        onChange={(e) => {
                          const updated = [...content.services];
                          updated[index].recommendedFor = e.target.value;
                          setContent({ ...content, services: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={service.description}
                      onChange={(e) => {
                        const updated = [...content.services];
                        updated[index].description = e.target.value;
                        setContent({ ...content, services: updated });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Key Deliverables (one per line)
                    </label>
                    <textarea
                      rows={4}
                      value={service.features.join('\n')}
                      onChange={(e) => {
                        const updated = [...content.services];
                        updated[index].features = e.target.value.split('\n').filter((f) => f.trim() !== '');
                        setContent({ ...content, services: updated });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: TECHNOLOGIES */}
          {activeTab === 'technologies' && (
            <div className="space-y-6">
              {content.technologies.map((category, catIdx) => (
                <div key={category.id} className="gradient-border-card p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading text-lg font-bold text-white">
                      {category.name}
                    </h4>
                    <span className="text-xs text-slate-400">
                      {category.technologies.length} skills listed
                    </span>
                  </div>

                  <div className="space-y-3">
                    {category.technologies.map((tech, techIdx) => (
                      <div
                        key={techIdx}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-3 rounded-xl bg-slate-900/90 border border-white/5 items-center"
                      >
                        <div className="sm:col-span-4">
                          <input
                            type="text"
                            value={tech.name}
                            onChange={(e) => {
                              const updated = [...content.technologies];
                              updated[catIdx].technologies[techIdx].name = e.target.value;
                              setContent({ ...content, technologies: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-xs text-white"
                          />
                        </div>
                        <div className="sm:col-span-6">
                          <input
                            type="text"
                            value={tech.description}
                            onChange={(e) => {
                              const updated = [...content.technologies];
                              updated[catIdx].technologies[techIdx].description = e.target.value;
                              setContent({ ...content, technologies: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-xs text-white"
                          />
                        </div>
                        <div className="sm:col-span-2 flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Tag"
                            value={tech.tag || ''}
                            onChange={(e) => {
                              const updated = [...content.technologies];
                              updated[catIdx].technologies[techIdx].tag = e.target.value;
                              setContent({ ...content, technologies: updated });
                            }}
                            className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-[10px] text-cyan-300"
                          />
                          <button
                            onClick={() => {
                              const updated = [...content.technologies];
                              updated[catIdx].technologies.splice(techIdx, 1);
                              setContent({ ...content, technologies: updated });
                            }}
                            className="p-1.5 rounded-lg bg-red-950 text-red-400 hover:bg-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      const updated = [...content.technologies];
                      updated[catIdx].technologies.push({
                        name: 'New Technology',
                        description: 'High-performance web stack tool',
                        tag: 'Modern'
                      });
                      setContent({ ...content, technologies: updated });
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Technology to {category.name}</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: PROJECTS MANAGEMENT */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-xl font-bold text-white">
                    Projects Showcase
                  </h3>
                  <p className="text-xs text-slate-400">
                    Add, edit, or configure Live Demo, GitHub, and external URLs for website portfolio builds.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingProject({
                      id: `proj-${Date.now()}`,
                      title: 'New Website Project',
                      category: 'Business Website',
                      shortDescription: 'Project overview and highlights.',
                      fullDescription: 'Detailed architectural walkthrough of the project.',
                      tags: ['React', 'TypeScript', 'Tailwind CSS'],
                      liveUrl: 'https://',
                      githubUrl: 'https://github.com/',
                      externalUrl: '',
                      imageUrl: '/devlophiclogo.jpeg',
                      featured: false,
                      order: content.projects.length + 1
                    });
                    setIsNewProject(true);
                  }}
                  className="gradient-glow-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Project</span>
                </button>
              </div>

              {/* Projects List */}
              <div className="grid grid-cols-1 gap-4">
                {content.projects.map((project) => (
                  <div
                    key={project.id}
                    className="gradient-border-card p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 rounded-xl bg-slate-950 overflow-hidden shrink-0 border border-white/10">
                        <img
                          src={project.imageUrl || '/devlophiclogo.jpeg'}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-heading font-bold text-base text-white">
                            {project.title}
                          </h4>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                            {project.category}
                          </span>
                          {project.featured && (
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1">
                          {project.shortDescription}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-slate-900 border border-white/10 text-cyan-400 hover:text-cyan-300"
                          title="Open Live Demo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
                          title="Open GitHub"
                        >
                          <GithubIcon className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => {
                          setEditingProject({ ...project });
                          setIsNewProject(false);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-black text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-2 rounded-lg bg-red-950/60 border border-red-500/30 text-red-400 hover:bg-red-900 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: CONTACT & SOCIALS */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-300">
                <strong>Location Privacy Standard:</strong> As specified, no physical address, city, or location is displayed on Devlophic to maintain a location-independent freelance business presence.
              </div>

              <div className="gradient-border-card p-6 rounded-2xl space-y-4">
                <h3 className="font-heading text-lg font-bold text-white">
                  Direct Contact Channels
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Business Email Address *
                    </label>
                    <input
                      type="email"
                      value={content.contact.email}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contact: { ...content.contact, email: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      WhatsApp / Contact Phone Number *
                    </label>
                    <input
                      type="text"
                      value={content.contact.phone}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contact: {
                            ...content.contact,
                            phone: e.target.value,
                            whatsapp: e.target.value
                          }
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              <div className="gradient-border-card p-6 rounded-2xl space-y-4">
                <h3 className="font-heading text-lg font-bold text-white">
                  Social Media Links (Editable)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Instagram Profile URL
                    </label>
                    <input
                      type="url"
                      value={content.socials.instagram}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          socials: { ...content.socials, instagram: e.target.value }
                        })
                      }
                      placeholder="https://instagram.com/devlophic"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      WhatsApp Link (Custom URL or wa.me)
                    </label>
                    <input
                      type="url"
                      value={content.socials.whatsapp}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          socials: { ...content.socials, whatsapp: e.target.value }
                        })
                      }
                      placeholder="https://wa.me/917306614242"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      GitHub Organization / Profile URL
                    </label>
                    <input
                      type="url"
                      value={content.socials.github}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          socials: { ...content.socials, github: e.target.value }
                        })
                      }
                      placeholder="https://github.com/devlophic"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      LinkedIn Page URL
                    </label>
                    <input
                      type="url"
                      value={content.socials.linkedin}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          socials: { ...content.socials, linkedin: e.target.value }
                        })
                      }
                      placeholder="https://linkedin.com/company/devlophic"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-xl font-bold text-white">
                  Client Quote Requests ({inquiries.length})
                </h3>
                <button
                  onClick={fetchInquiries}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-slate-300 hover:text-white"
                >
                  Refresh
                </button>
              </div>

              {loadingInquiries ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  Loading inquiries...
                </div>
              ) : inquiries.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm gradient-border-card rounded-2xl">
                  No inquiries received yet. New submissions from the contact form will appear here.
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className={`gradient-border-card p-5 rounded-2xl space-y-3 ${
                        inq.status === 'unread' ? 'border-cyan-500/50 bg-cyan-950/20' : ''
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-bold text-white text-base">
                              {inq.name}
                            </span>
                            <span
                              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                inq.status === 'unread'
                                  ? 'bg-cyan-500 text-slate-950'
                                  : inq.status === 'contacted'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-white/10 text-slate-400'
                              }`}
                            >
                              {inq.status}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400">
                            Submitted on {new Date(inq.createdAt).toLocaleDateString()} at{' '}
                            {new Date(inq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Status switcher */}
                        <div className="flex items-center gap-2">
                          <select
                            value={inq.status}
                            onChange={(e) =>
                              handleUpdateInquiryStatus(
                                inq.id,
                                e.target.value as 'unread' | 'read' | 'contacted'
                              )
                            }
                            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-xs text-slate-300"
                          >
                            <option value="unread">Unread</option>
                            <option value="read">Mark Read</option>
                            <option value="contacted">Contacted</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Mail className="w-3.5 h-3.5 text-cyan-400" />
                          <a href={`mailto:${inq.email}`} className="hover:underline">
                            {inq.email}
                          </a>
                        </div>
                        {inq.phone && (
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Phone className="w-3.5 h-3.5 text-emerald-400" />
                            <a href={`tel:${inq.phone}`} className="hover:underline">
                              {inq.phone}
                            </a>
                          </div>
                        )}
                        <div className="text-slate-400">
                          <strong className="text-slate-300">Category: </strong>
                          {inq.serviceCategory}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-950/70 text-xs text-slate-200 leading-relaxed">
                        {inq.message}
                      </div>

                      {/* Quick Reply Actions */}
                      <div className="pt-2 flex flex-wrap items-center gap-2">
                        <a
                          href={`mailto:${inq.email}?subject=Devlophic%20Website%20Development%20Inquiry%20Response&body=Hi%20${encodeURIComponent(
                            inq.name
                          )},%0A%0AThank%20you%20for%20reaching%20out%20to%20Devlophic%20regarding%20your%20${encodeURIComponent(
                            inq.serviceCategory
                          )}%20project...`}
                          className="px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500 hover:text-black text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Reply via Email</span>
                        </a>

                        {inq.phone && (
                          <a
                            href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(
                              inq.name
                            )},%20this%20is%20Devlophic%20following%20up%20on%20your%20website%20development%20inquiry.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500 hover:text-black text-xs font-semibold flex items-center gap-1.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Reply via WhatsApp</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-xl">
              <div className="gradient-border-card p-6 rounded-2xl space-y-4">
                <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <span>Update Admin Master Password</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Secure your admin dashboard. Passwords must be at least 8 characters long.
                </p>

                {passwordMsg && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                      passwordMsg.isError
                        ? 'bg-red-950/70 border border-red-500/30 text-red-300'
                        : 'bg-emerald-950/70 border border-emerald-500/30 text-emerald-300'
                    }`}
                  >
                    {passwordMsg.isError ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>{passwordMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="gradient-glow-btn px-6 py-2.5 rounded-xl text-xs font-bold"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* PROJECT EDIT / ADD MODAL */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="gradient-border-card bg-[#0b0f19] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-heading text-xl font-bold text-white">
                {isNewProject ? 'Add New Website Project' : 'Edit Project Details'}
              </h3>
              <button
                onClick={() => setEditingProject(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Website Development Category *
                </label>
                <select
                  value={editingProject.category}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      category: e.target.value
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                >
                  <option value="Business Website">Business Website</option>
                  <option value="Portfolio Website">Portfolio Website</option>
                  <option value="Landing Page">Landing Page</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Custom Website">Custom Website</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Short Description (Card view)
              </label>
              <textarea
                rows={2}
                value={editingProject.shortDescription}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, shortDescription: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Description (Modal walkthrough)
              </label>
              <textarea
                rows={3}
                value={editingProject.fullDescription}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, fullDescription: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Live Demo URL
                </label>
                <input
                  type="url"
                  placeholder="https://client-demo.com"
                  value={editingProject.liveUrl}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, liveUrl: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  GitHub Code URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/devlophic/..."
                  value={editingProject.githubUrl}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, githubUrl: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  External Reference / Case Study URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={editingProject.externalUrl || ''}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, externalUrl: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tech Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="React, TypeScript, Tailwind CSS"
                  value={editingProject.tags.join(', ')}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Image URL & Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Project Image URL or Upload
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingProject.imageUrl}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, imageUrl: e.target.value })
                  }
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  placeholder="https://... or /devlophiclogo.jpeg"
                />
                <label className="px-4 py-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-black text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-all">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Featured toggle */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="featuredCheck"
                checked={editingProject.featured}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, featured: e.target.checked })
                }
                className="w-4 h-4 rounded bg-slate-900 border-white/20 text-cyan-500 focus:ring-0"
              />
              <label htmlFor="featuredCheck" className="text-xs font-semibold text-slate-300">
                Mark as Featured Project on homepage
              </label>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={() => setEditingProject(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProjectModal}
                className="gradient-glow-btn px-6 py-2 rounded-xl text-xs font-bold"
              >
                Apply Project Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
