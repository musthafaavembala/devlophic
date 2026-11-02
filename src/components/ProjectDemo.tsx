import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleDollarSign,
  Menu,
  Plus,
  ShoppingBag,
  Sparkles,
  TrendingUp
} from 'lucide-react';

const demoProjects: Record<string, { name: string }> = {
  'apex-nexus': { name: 'Apex Nexus' },
  'velox-studio': { name: 'VELOX' },
  novapay: { name: 'NovaPay' },
  luxevibe: { name: 'LuxeVibe' },
  'synapse-portal': { name: 'synapse' }
};

const galleryItems = [
  { title: 'Form & Function', category: 'Branding', color: 'from-rose-200 to-orange-100' },
  { title: 'Quiet Spaces', category: 'Interiors', color: 'from-amber-100 to-stone-300' },
  { title: 'New Rituals', category: 'Campaigns', color: 'from-violet-200 to-indigo-300' },
  { title: 'Soft Geometry', category: 'Branding', color: 'from-lime-200 to-emerald-300' },
  { title: 'Open House', category: 'Interiors', color: 'from-sky-200 to-blue-300' },
  { title: 'Objects in Motion', category: 'Campaigns', color: 'from-pink-200 to-fuchsia-300' }
];

const shopItems = [
  { name: 'Arc Table Light', type: 'Lighting', price: 189, icon: '◉', color: 'bg-amber-100' },
  { name: 'Forma Lounge Chair', type: 'Furniture', price: 649, icon: '▰', color: 'bg-stone-200' },
  { name: 'Ripple Glass Set', type: 'Objects', price: 48, icon: '◌', color: 'bg-sky-100' },
  { name: 'Sculpted Side Table', type: 'Furniture', price: 320, icon: '◒', color: 'bg-rose-100' }
];

interface ProjectDemoProps {
  slug: string;
}

export const ProjectDemo: React.FC<ProjectDemoProps> = ({ slug }) => {
  const project = demoProjects[slug];
  const [menuOpen, setMenuOpen] = useState(false);
  const [roiLeads, setRoiLeads] = useState(120);
  const [galleryFilter, setGalleryFilter] = useState('All');
  const [annualBilling, setAnnualBilling] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistJoined, setWaitlistJoined] = useState(false);
  const [shopFilter, setShopFilter] = useState('All');
  const [cart, setCart] = useState<string[]>([]);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  if (!project) {
    return (
      <main className="min-h-screen bg-slate-950 text-white grid place-items-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-3">Demo not found</h1>
          <a className="text-cyan-300 underline" href="/">Return to Devlophic</a>
        </div>
      </main>
    );
  }

  const projectSlug = slug;

  const header = (dark = false) => (
    <header className={`relative z-10 flex items-center justify-between px-5 sm:px-10 lg:px-16 py-5 ${dark ? 'text-white' : 'text-slate-900'}`}>
      <a href="/" className="inline-flex items-center gap-2 text-xs font-semibold opacity-70 hover:opacity-100" aria-label="Back to Devlophic">
        <ArrowLeft className="w-4 h-4" /> Devlophic
      </a>
      <a href={`/demo/${projectSlug}`} className="font-bold tracking-tight text-lg">{project.name}</a>
      <button onClick={() => setMenuOpen((open) => !open)} className="p-2 rounded-full hover:bg-black/5" aria-label="Toggle navigation">
        <Menu className="w-5 h-5" />
      </button>
      {menuOpen && (
        <nav className={`absolute right-5 top-16 min-w-44 rounded-xl border p-3 shadow-xl ${dark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
          <a className="block rounded-lg px-3 py-2 text-sm hover:bg-black/5" href="/">Back to portfolio</a>
          <a className="block rounded-lg px-3 py-2 text-sm hover:bg-black/5" href="#demo-content">Explore this demo</a>
        </nav>
      )}
    </header>
  );

  if (projectSlug === 'apex-nexus') {
    return (
      <main className="min-h-screen bg-white text-slate-900">
        {header()}
        <section id="demo-content" className="px-5 sm:px-10 lg:px-16 pt-16 pb-20 lg:pt-28 lg:pb-32">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.2em] text-teal-700 mb-6">Apex Nexus · Strategy & Advisory</p>
              <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight leading-[1.05]">Make your next move your <span className="text-teal-700">best one.</span></h1>
              <p className="mt-6 max-w-xl text-lg text-slate-600 leading-relaxed">Clear strategy for ambitious teams. We turn complex challenges into focused plans, measurable progress, and lasting growth.</p>
              <a href="#services" className="mt-8 inline-flex items-center gap-3 rounded-full bg-teal-800 px-6 py-3.5 text-white font-semibold hover:bg-teal-700">Explore our approach <ArrowRight className="w-4 h-4" /></a>
            </div>
            <div className="min-h-72 sm:min-h-96 rounded-[2rem] bg-gradient-to-br from-teal-100 via-cyan-50 to-amber-100 p-8 sm:p-12 flex items-end">
              <div className="w-full rounded-2xl bg-white/80 backdrop-blur p-6 shadow-lg">
                <p className="text-xs uppercase tracking-widest text-slate-500">The growth outlook</p>
                <div className="flex items-end justify-between mt-4">
                  <strong className="text-4xl">+34.8%</strong><TrendingUp className="w-8 h-8 text-teal-700" />
                </div>
                <div className="mt-5 h-2 rounded-full bg-slate-100"><div className="h-full w-3/4 rounded-full bg-teal-700" /></div>
              </div>
            </div>
          </div>
        </section>
        <section id="services" className="bg-slate-50 px-5 sm:px-10 lg:px-16 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
            <div>
              <p className="text-sm font-bold text-teal-700 uppercase tracking-widest">Built around your goals</p>
              <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight">A sharper path to sustainable growth.</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {['Business Strategy', 'Digital Transformation', 'Market Expansion', 'Growth Operations'].map((item, index) => (
                <article key={item} className="rounded-2xl bg-white p-6 border border-slate-200">
                  <span className="text-sm text-teal-700">0{index + 1}</span><h3 className="mt-6 font-semibold text-lg">{item}</h3>
                  <p className="mt-2 text-sm text-slate-600">Practical expertise and a clear plan, tailored to where your business is headed.</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="px-5 sm:px-10 lg:px-16 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto rounded-3xl bg-slate-900 text-white p-7 sm:p-12">
            <CircleDollarSign className="w-8 h-8 text-teal-300" />
            <h2 className="mt-5 text-3xl font-semibold">Estimate your opportunity</h2>
            <p className="mt-2 text-slate-300">Explore how a better-qualified lead funnel could change your monthly pipeline.</p>
            <label className="mt-8 block text-sm text-slate-300" htmlFor="apex-leads">Monthly enquiries: {roiLeads}</label>
            <input id="apex-leads" className="mt-3 w-full accent-teal-300" type="range" min="20" max="500" step="10" value={roiLeads} onChange={(event) => setRoiLeads(Number(event.target.value))} />
            <p className="mt-5 text-2xl font-semibold text-teal-200">{Math.round(roiLeads * 1.35)} potential qualified enquiries <span className="text-sm font-normal text-slate-300">with a 35% improvement</span></p>
          </div>
        </section>
        <DemoFooter name={project.name} />
      </main>
    );
  }

  if (projectSlug === 'velox-studio') {
    const categories = ['All', 'Branding', 'Interiors', 'Campaigns'];
    const filteredGallery = galleryItems.filter((item) => galleryFilter === 'All' || item.category === galleryFilter);
    return (
      <main className="min-h-screen bg-[#11120f] text-[#f5f5ee]">
        {header(true)}
        <section id="demo-content" className="px-5 sm:px-10 lg:px-16 pt-14 pb-16 sm:pt-24 sm:pb-24">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs uppercase tracking-[.35em] text-lime-300">Independent creative studio · Est. 2016</p>
            <h1 className="mt-7 max-w-5xl text-6xl sm:text-8xl lg:text-[9rem] leading-[.88] font-semibold tracking-[-.08em]">Ideas in<br /><span className="text-lime-300">motion.</span></h1>
            <div className="mt-10 sm:mt-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <p className="max-w-md text-slate-300 text-lg">We build identities, spaces, and digital experiences for a world that never stands still.</p>
              <a href="#work" className="inline-flex items-center gap-2 font-semibold hover:text-lime-300">Selected work <ArrowDown /></a>
            </div>
          </div>
        </section>
        <section id="work" className="px-5 sm:px-10 lg:px-16 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-7" aria-label="Filter portfolio">
              {categories.map((category) => <button key={category} onClick={() => setGalleryFilter(category)} className={`rounded-full px-4 py-2 text-sm transition-colors ${galleryFilter === category ? 'bg-lime-300 text-slate-950' : 'border border-white/20 text-white hover:border-lime-300'}`}>{category}</button>)}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGallery.map((item, index) => (
                <article key={item.title} className="group">
                  <div className={`aspect-[4/5] rounded-2xl bg-gradient-to-br ${item.color} p-5 flex items-end transition-transform group-hover:-translate-y-1`}>
                    <div className="w-full rounded-xl bg-black/10 backdrop-blur p-5 text-slate-900">
                      <span className="text-xs uppercase tracking-widest">{item.category} · 2025</span><h2 className="mt-2 text-2xl font-semibold">{item.title}</h2>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-400">Selected project 0{index + 1}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <DemoFooter name={project.name} dark />
      </main>
    );
  }

  if (projectSlug === 'novapay') {
    const plans = [
      { name: 'Starter', monthly: 0, description: 'For teams getting started with digital payments.' },
      { name: 'Scale', monthly: 29, description: 'For growing businesses ready to move faster.' },
      { name: 'Enterprise', monthly: 99, description: 'Flexible controls for payments at scale.' }
    ];
    return (
      <main className="min-h-screen bg-[#f7f7fb] text-slate-900">
        {header()}
        <section id="demo-content" className="relative overflow-hidden px-5 sm:px-10 lg:px-16 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="absolute -top-20 right-0 w-96 h-96 rounded-full bg-violet-200/50 blur-3xl pointer-events-none" />
          <div className="relative max-w-6xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm shadow-sm"><Sparkles className="w-4 h-4 text-violet-600" /> Payments for modern teams</span>
            <h1 className="mt-8 text-5xl sm:text-7xl font-semibold tracking-tight">Move money.<br /><span className="text-violet-600">Move forward.</span></h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">One clear platform to accept payments, understand your business, and help your customers pay with confidence.</p>
            <a href="#plans" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 font-semibold text-white hover:bg-violet-700">Explore plans <ArrowRight className="w-4 h-4" /></a>
            <div className="mx-auto mt-14 max-w-3xl rounded-3xl bg-slate-950 p-5 sm:p-8 text-left text-white shadow-2xl">
              <div className="flex items-center justify-between text-sm text-slate-400"><span>Revenue overview</span><span>Last 30 days</span></div>
              <div className="mt-5 flex items-end justify-between"><strong className="text-4xl sm:text-5xl">$48,294.00</strong><span className="text-emerald-300 text-sm">↗ 18.6%</span></div>
              <div className="mt-8 flex h-24 items-end gap-2">{[38, 55, 45, 70, 50, 82, 64, 95, 73, 100, 79, 88, 65, 92].map((height, index) => <div key={index} className="flex-1 rounded-t bg-gradient-to-t from-violet-800 to-violet-400" style={{ height: `${height}%` }} />)}</div>
            </div>
          </div>
        </section>
        <section id="plans" className="px-5 sm:px-10 lg:px-16 py-16 sm:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center"><h2 className="text-3xl sm:text-5xl font-semibold">Simple plans. No surprises.</h2><p className="mt-3 text-slate-600">Start free. Upgrade when you are ready.</p>
              <button onClick={() => setAnnualBilling((annual) => !annual)} className="mt-6 rounded-full bg-white p-1 shadow-sm" aria-label="Toggle annual billing">
                <span className={`inline-block rounded-full px-4 py-2 text-sm ${!annualBilling ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>Monthly</span><span className={`inline-block rounded-full px-4 py-2 text-sm ${annualBilling ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>Yearly −20%</span>
              </button>
            </div>
            <div className="mt-10 grid md:grid-cols-3 gap-5">
              {plans.map((plan) => <article key={plan.name} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                <h3 className="font-semibold text-xl">{plan.name}</h3><p className="mt-2 min-h-12 text-sm text-slate-600">{plan.description}</p>
                <p className="mt-6 text-4xl font-semibold">${annualBilling ? Math.round(plan.monthly * 0.8) : plan.monthly}<span className="text-sm font-normal text-slate-500"> / month</span></p>
                <button className="mt-6 w-full rounded-xl border border-slate-300 py-3 font-semibold hover:border-violet-500 hover:text-violet-700">Choose {plan.name}</button>
              </article>)}
            </div>
            <form className="mx-auto mt-14 max-w-xl text-center" onSubmit={(event) => { event.preventDefault(); if (waitlistEmail.trim()) setWaitlistJoined(true); }}>
              <h3 className="text-xl font-semibold">Get product updates</h3><div className="mt-4 flex gap-2">
                <input type="email" required value={waitlistEmail} onChange={(event) => { setWaitlistEmail(event.target.value); setWaitlistJoined(false); }} placeholder="you@company.com" className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3" />
                <button className="rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white">Join</button>
              </div>
              {waitlistJoined && <p className="mt-3 text-sm text-emerald-700" role="status">Thanks — you are on the demo update list.</p>}
            </form>
          </div>
        </section>
        <DemoFooter name={project.name} />
      </main>
    );
  }

  if (projectSlug === 'luxevibe') {
    const categories = ['All', 'Lighting', 'Furniture', 'Objects'];
    const visibleProducts = shopItems.filter((item) => shopFilter === 'All' || item.type === shopFilter);
    return (
      <main className="min-h-screen bg-[#fbf8f3] text-[#28241f]">
        {header()}
        <section id="demo-content" className="px-5 sm:px-10 lg:px-16 pt-12 pb-16 sm:pt-20">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_.9fr] gap-8 items-center">
            <div className="py-8 sm:py-12">
              <span className="text-xs uppercase tracking-[.25em] text-[#aa6844]">Design for everyday living</span>
              <h1 className="mt-5 text-5xl sm:text-7xl font-medium tracking-tight">Make room for <em className="font-normal">good things.</em></h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-stone-600">Thoughtful objects, honest materials, and timeless forms. Find pieces that make your everyday feel a little more considered.</p>
              <a href="#shop" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#28241f] px-6 py-3.5 text-white hover:bg-[#aa6844]">Explore the collection <ArrowRight className="w-4 h-4" /></a>
            </div>
            <div className="min-h-72 sm:min-h-[28rem] rounded-[2rem] bg-gradient-to-br from-[#ddc7ae] via-[#f2e7d8] to-[#a5a58e] flex items-center justify-center">
              <div className="relative w-48 h-56 sm:w-64 sm:h-72">
                <div className="absolute left-1/2 top-8 -translate-x-1/2 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-amber-50/80 shadow-xl" />
                <div className="absolute left-1/2 top-20 -translate-x-1/2 w-2 h-28 bg-stone-700/70" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 h-3 rounded-full bg-stone-700/70" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-52 h-2 rounded-full bg-black/10 blur" />
              </div>
            </div>
          </div>
        </section>
        <section id="shop" className="px-5 sm:px-10 lg:px-16 py-14 sm:py-20 border-t border-stone-200">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-between items-end gap-4">
              <div><p className="text-xs uppercase tracking-[.2em] text-[#aa6844]">The collection</p><h2 className="mt-2 text-3xl sm:text-4xl font-medium">Made to be lived with.</h2></div>
              <div className="flex flex-wrap gap-2">{categories.map((category) => <button key={category} onClick={() => setShopFilter(category)} className={`rounded-full border px-3 py-2 text-xs sm:text-sm ${shopFilter === category ? 'border-[#28241f] bg-[#28241f] text-white' : 'border-stone-300 hover:border-stone-600'}`}>{category}</button>)}</div>
            </div>
            <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {visibleProducts.map((item) => <article key={item.name}>
                <div className={`aspect-square rounded-2xl ${item.color} flex items-center justify-center text-6xl sm:text-8xl text-stone-500`}>{item.icon}</div>
                <div className="mt-3 flex justify-between gap-2"><div><h3 className="font-semibold text-sm sm:text-base">{item.name}</h3><p className="text-xs sm:text-sm text-stone-500">{item.type}</p></div><span className="text-sm">${item.price}</span></div>
                <button onClick={() => setCart((items) => [...items, item.name])} className="mt-3 w-full inline-flex justify-center items-center gap-2 rounded-xl border border-stone-300 py-2 text-sm hover:bg-[#28241f] hover:text-white"><Plus className="w-4 h-4" /> Add to bag</button>
              </article>)}
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm text-stone-600" role="status"><ShoppingBag className="w-4 h-4" /> {cart.length ? `${cart.length} ${cart.length === 1 ? 'item' : 'items'} in your bag` : 'Your bag is ready for something lovely.'}</p>
          </div>
        </section>
        <DemoFooter name={project.name} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0c1118] text-slate-100">
      {header(true)}
      {!workspaceOpen ? (
        <section id="demo-content" className="px-5 sm:px-10 lg:px-16 py-16 sm:py-28">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div><span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-200"><span className="w-2 h-2 rounded-full bg-emerald-300" /> Your projects, in sync</span>
              <h1 className="mt-7 text-5xl sm:text-7xl font-semibold tracking-tight">Good work.<br /><span className="text-emerald-300">Less busywork.</span></h1>
              <p className="mt-6 max-w-lg text-lg text-slate-400">A calm, secure space for teams and clients to keep every project, update, and next step together.</p>
              <button onClick={() => setWorkspaceOpen(true)} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-300 px-6 py-3.5 font-semibold text-slate-950 hover:bg-emerald-200">Explore workspace <ArrowRight className="w-4 h-4" /></button>
              <p className="mt-3 text-xs text-slate-500">Interactive product preview — no account or personal information required.</p>
            </div>
            <WorkspacePreview />
          </div>
        </section>
      ) : (
        <section id="demo-content" className="px-4 sm:px-8 lg:px-12 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
              <div><p className="text-sm text-slate-400">Tuesday, October 14</p><h1 className="text-2xl sm:text-3xl font-semibold mt-1">Good morning, Alex</h1></div>
              <button onClick={() => setWorkspaceOpen(false)} className="text-sm text-emerald-200 hover:text-white">Close preview</button>
            </div>
            <div className="grid lg:grid-cols-[220px_1fr] gap-5">
              <aside className="rounded-2xl border border-white/10 bg-white/[.03] p-4">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">Workspace</p>
                {['Overview', 'Projects', 'Files', 'Schedule'].map((item, index) => <div key={item} className={`rounded-lg px-3 py-2.5 text-sm ${index === 0 ? 'bg-emerald-300/10 text-emerald-200' : 'text-slate-400'}`}>{item}</div>)}
              </aside>
              <div className="space-y-5">
                <div className="grid sm:grid-cols-3 gap-4">{[['Active projects', '04'], ['Completed this month', '12'], ['Next milestone', 'Oct 18']].map(([label, value]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><p className="text-sm text-slate-400">{label}</p><p className="mt-3 text-2xl font-semibold">{value}</p></div>)}</div>
                <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5 sm:p-7">
                  <div className="flex justify-between gap-4"><div><p className="text-sm text-emerald-200">Website redesign</p><h2 className="mt-1 text-xl font-semibold">Northstar Studio</h2></div><span className="h-fit rounded-full bg-emerald-300/10 px-3 py-1 text-xs text-emerald-200">In progress</span></div>
                  <div className="mt-7 space-y-4">{[['Discovery & strategy', 'Complete'], ['Visual direction', 'Complete'], ['Development', 'In progress'], ['Launch & handoff', 'Upcoming']].map(([task, status], index) => <div key={task} className="flex items-center gap-3 border-t border-white/5 pt-4"><span className={`grid h-7 w-7 place-items-center rounded-full ${index < 2 ? 'bg-emerald-300 text-slate-950' : 'border border-white/20 text-slate-500'}`}>{index < 2 ? <Check className="w-4 h-4" /> : index + 1}</span><span className="flex-1 text-sm">{task}</span><span className="text-xs text-slate-400">{status}</span></div>)}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      <DemoFooter name={project.name} dark />
    </main>
  );
};

const ArrowDown = () => <ArrowUpRight className="w-4 h-4" />;

const WorkspacePreview = () => (
  <div className="rounded-3xl border border-white/10 bg-white/[.04] p-5 sm:p-7 shadow-2xl">
    <div className="flex items-center gap-2 border-b border-white/10 pb-4"><span className="w-2.5 h-2.5 bg-red-400 rounded-full" /><span className="w-2.5 h-2.5 bg-amber-300 rounded-full" /><span className="w-2.5 h-2.5 bg-emerald-300 rounded-full" /><span className="ml-auto text-xs text-slate-500">synapse workspace</span></div>
    <div className="mt-6 flex gap-4"><div className="hidden sm:block w-28 space-y-3">{['Overview', 'Projects', 'Schedule'].map((item) => <div key={item} className="h-2 rounded bg-white/10" />)}</div><div className="flex-1 space-y-3"><div className="h-16 rounded-xl bg-emerald-300/10 border border-emerald-300/10" /><div className="grid grid-cols-2 gap-3"><div className="h-24 rounded-xl bg-white/5" /><div className="h-24 rounded-xl bg-white/5" /></div><div className="h-28 rounded-xl bg-white/5" /></div></div>
  </div>
);

const DemoFooter: React.FC<{ name: string; dark?: boolean }> = ({ name, dark = false }) => (
  <footer className={`border-t px-5 sm:px-10 lg:px-16 py-7 ${dark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
      <span>{name} · Interactive project demo</span>
      <a href="/" className="inline-flex items-center gap-2 hover:opacity-70"><ArrowLeft className="w-4 h-4" /> Return to Devlophic</a>
    </div>
  </footer>
);
