export const MOCK_CLIENTS = [
  { id: 1, clientId: 'CLI-1001', name: 'Riya Sen', mobile: '9876543210', email: 'riya@example.com', city: 'Mumbai', plan: 'Gold Plan', events: 12, status: 'Active' },
  { id: 2, clientId: 'CLI-1002', name: 'Arjun Kapoor', mobile: '9876543211', email: 'arjun@example.com', city: 'Delhi', plan: 'Silver Plan', events: 5, status: 'Active' },
  { id: 3, clientId: 'CLI-1003', name: 'Sanya Malhotra', mobile: '9876543212', email: 'sanya@example.com', city: 'Bangalore', plan: 'Platinum Plan', events: 18, status: 'Inactive' },
  { id: 4, clientId: 'CLI-1004', name: 'Varun Dhawan', mobile: '9876543213', email: 'varun@example.com', city: 'Chennai', plan: 'Gold Plan', events: 8, status: 'Active' },
  { id: 5, clientId: 'CLI-1005', name: 'Kiara Advani', mobile: '9876543214', email: 'kiara@example.com', city: 'Hyderabad', plan: 'Silver Plan', events: 3, status: 'Active' },
  { id: 6, clientId: 'CLI-1006', name: 'Kartik Aaryan', mobile: '9876543215', email: 'kartik@example.com', city: 'Pune', plan: 'Not Subscribed', events: 0, status: 'Active' },
];

export const MOCK_STAFF = [
  { id: 1, empId: 'EMP-5001', name: 'Sankalp Deshpande', designation: 'Event Manager', email: 'sankalp@example.com', mobile: '9988776655', doj: '15 Jan 2024', loginAccess: true, status: 'Active' },
];

export const MOCK_PAYMENTS = [
  { id: 1, orderId: 'ORD-123456', eventId: 'EVT-789', clientId: 'CLI-1001', clientName: 'Riya Sen', type: 'Online', date: '05 Apr 2026', transactionId: 'TXN-998877', status: 'Paid', paidAmount: 50000, vendorDiscount: 2000, referralDiscount: 1000 },
];

export const MOCK_PAGES = [
  { id: 13, name: "Return Policy",     template: "Default",        createdAt: "2026-02-26", status: "Published" },
  { id: 12, name: "Coming Soon",      template: "Without layout", createdAt: "2026-02-26", status: "Published" },
  { id: 11, name: "Shipping",         template: "Default",        createdAt: "2026-02-26", status: "Published" },
  { id: 10, name: "Careers",          template: "Default",        createdAt: "2026-02-26", status: "Published" },
  { id: 9,  name: "Our Story",        template: "Default",        createdAt: "2026-02-26", status: "Published" },
  { id: 8,  name: "Cookie Policy",    template: "Default",        createdAt: "2026-02-26", status: "Published" },
  { id: 7,  name: "FAQs",             template: "Default",        createdAt: "2026-02-26", status: "Published" },
  { id: 6,  name: "Contact",          template: "Full width",     createdAt: "2026-02-26", status: "Published" },
  { id: 5,  name: "Blog — Blog Page", template: "Full width",     createdAt: "2026-02-26", status: "Published" },
  { id: 4,  name: "Coupons",          template: "Full width",     createdAt: "2026-02-26", status: "Published" },
];

export const WEBSITE_CONTENT_PAGES = [
  {
    id: 1,
    name: "Our Clients",
    createdAt: "2026-04-01",
    description: "Showcase trusted partners and organizations who actively collaborate with our team.",
    content: `<div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
  <div class="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
    <div>
      <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl tracking-tight">
        Trusted by industry leaders
      </h2>
      <p class="mt-3 max-w-3xl text-lg text-gray-500">
        We proudly collaborate with innovative startups, global enterprises, and dedicated organizations to deliver memorable events and measurable impact worldwide.
      </p>
    </div>
    <div class="mt-8 grid grid-cols-2 gap-0.5 md:grid-cols-3 lg:mt-0 lg:grid-cols-2">
      <div class="col-span-1 flex justify-center py-8 px-8 bg-gray-50 rounded-tl-xl border border-gray-100">
        <span class="text-xl font-bold text-gray-400">Microsoft</span>
      </div>
      <div class="col-span-1 flex justify-center py-8 px-8 bg-gray-50 border border-gray-100">
        <span class="text-xl font-bold text-gray-400">Google</span>
      </div>
      <div class="col-span-1 flex justify-center py-8 px-8 bg-gray-50 border border-gray-100">
        <span class="text-xl font-bold text-gray-400">Spotify</span>
      </div>
      <div class="col-span-1 flex justify-center py-8 px-8 bg-gray-50 rounded-br-xl border border-gray-100">
        <span class="text-xl font-bold text-gray-400">Amazon</span>
      </div>
    </div>
  </div>
</div>`,
  },
  {
    id: 2,
    name: "Sponsor",
    createdAt: "2026-04-02",
    description: "Highlight premium sponsorship tiers, deep benefits, and visibility opportunities for partners.",
    content: `<div class="bg-white py-16">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center">
      <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl text-center">Partnership Opportunities</h2>
      <p class="mt-4 max-w-2xl text-xl text-gray-500 mx-auto text-center">Gain unmatched brand visibility and exclusive networking access.</p>
    </div>
    <div class="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-x-8">
      <div class="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
        <div class="flex-1">
          <h3 class="text-xl font-semibold text-gray-900">Silver</h3>
          <p class="mt-4 flex items-baseline text-gray-900">
            <span class="text-5xl font-extrabold tracking-tight">$5,000</span>
          </p>
          <ul role="list" class="mt-6 space-y-4 text-gray-500 text-sm">
            <li class="flex"><span class="mr-3 text-green-500">✓</span> Logo on marketing materials</li>
            <li class="flex"><span class="mr-3 text-green-500">✓</span> 2 VIP Access passes</li>
          </ul>
        </div>
      </div>
      <div class="relative p-8 bg-indigo-600 border border-indigo-600 rounded-2xl shadow-xl flex flex-col scale-105">
        <div class="flex-1">
          <h3 class="text-xl font-semibold text-white">Gold</h3>
          <p class="mt-4 flex items-baseline text-white">
            <span class="text-5xl font-extrabold tracking-tight">$15,000</span>
          </p>
          <ul role="list" class="mt-6 space-y-4 text-indigo-100 text-sm">
            <li class="flex"><span class="mr-3 text-white">✓</span> Prominent booth location</li>
            <li class="flex"><span class="mr-3 text-white">✓</span> Speaking opportunity</li>
            <li class="flex"><span class="mr-3 text-white">✓</span> 5 VIP Access passes</li>
          </ul>
        </div>
      </div>
      <div class="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
        <div class="flex-1">
          <h3 class="text-xl font-semibold text-gray-900">Platinum</h3>
          <p class="mt-4 flex items-baseline text-gray-900">
            <span class="text-5xl font-extrabold tracking-tight">$30,000</span>
          </p>
          <ul role="list" class="mt-6 space-y-4 text-gray-500 text-sm">
            <li class="flex"><span class="mr-3 text-green-500">✓</span> Title sponsor branding</li>
            <li class="flex"><span class="mr-3 text-green-500">✓</span> Keynote presentation</li>
            <li class="flex"><span class="mr-3 text-green-500">✓</span> Custom branding solutions</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>`,
  },
  {
    id: 3,
    name: "Gallery",
    createdAt: "2026-04-03",
    description: "Present high-fidelity event memories through curated photo grids.",
    content: `<div class="bg-gray-50 py-12">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h2 class="text-base font-semibold text-indigo-600 tracking-wide uppercase">Memories</h2>
      <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Event Highlights</p>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div class="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center h-48 border border-gray-300">
        <span class="text-gray-400 font-medium">Main Stage Presentation</span>
      </div>
      <div class="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center h-48 border border-gray-300">
        <span class="text-gray-400 font-medium">VIP Networking</span>
      </div>
      <div class="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center h-48 border border-gray-300">
        <span class="text-gray-400 font-medium">Award Ceremony</span>
      </div>
      <div class="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center h-48 border border-gray-300">
        <span class="text-gray-400 font-medium">After Party</span>
      </div>
      <div class="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center h-48 border border-gray-300">
        <span class="text-gray-400 font-medium">Booth Interactions</span>
      </div>
      <div class="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center h-48 border border-gray-300">
        <span class="text-gray-400 font-medium">Closing Speech</span>
      </div>
    </div>
  </div>
</div>`,
  },
  {
    id: 4,
    name: "Testimonial",
    createdAt: "2026-04-04",
    description: "Display exceptional client success stories and participant feedback dynamically.",
    content: `<section class="bg-white py-16 overflow-hidden">
  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="relative">
      <h2 class="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-10">Trusted by the Best</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <blockquote class="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm">
          <div class="text-xl font-medium text-gray-900 mb-6 italic">"Professional execution from planning to delivery. Their dedicated team went above and beyond to ensure our massive tech summit was completely seamless."</div>
          <footer class="flex items-center">
            <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-700">SJ</div>
            <div class="ml-4">
              <p class="text-base font-semibold text-gray-900">Sarah Jenkins</p>
              <p class="text-sm text-gray-500">VP of Operations, NovaTech Solutions</p>
            </div>
          </footer>
        </blockquote>
        <blockquote class="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm">
          <div class="text-xl font-medium text-gray-900 mb-6 italic">"Absolutely astounding attention to detail! The visual design phase and the rapid turnaround literally saved our global product launch event."</div>
          <footer class="flex items-center">
            <div class="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center font-bold text-teal-700">MR</div>
            <div class="ml-4">
              <p class="text-base font-semibold text-gray-900">Mark Reynolds</p>
              <p class="text-sm text-gray-500">Chief Marketing Officer, HyperDrive</p>
            </div>
          </footer>
        </blockquote>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: 5,
    name: "Blog",
    createdAt: "2026-04-05",
    description: "Share the absolute latest insights, modern trends, and event planning tips.",
    content: `<div class="bg-white pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
  <div class="relative max-w-7xl mx-auto">
    <div class="text-center">
      <h2 class="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">From the Blog</h2>
      <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
        Industry updates, operational insights, and behind-the-scenes event intelligence.
      </p>
    </div>
    <div class="mt-12 max-w-lg mx-auto grid gap-8 lg:grid-cols-3 lg:max-w-none">
      <div class="flex flex-col rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div class="flex-shrink-0 h-48 bg-indigo-100 flex items-center justify-center">
          <span class="text-indigo-400 font-bold tracking-widest uppercase">Tech Events</span>
        </div>
        <div class="flex-1 bg-white p-6 flex flex-col justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-indigo-600">Trends</p>
            <a href="#" class="block mt-2">
              <p class="text-xl font-semibold text-gray-900">Event Technology in 2026</p>
              <p class="mt-3 text-base text-gray-500">From hybrid augmented experiences to AI-powered personalization, discover how corporate event strategy is evolving rapidly.</p>
            </a>
          </div>
          <div class="mt-6 flex items-center">
            <p class="text-sm font-medium text-gray-900">April 5, 2026 &middot; 5 min read</p>
          </div>
        </div>
      </div>
      <div class="flex flex-col rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div class="flex-shrink-0 h-48 bg-teal-100 flex items-center justify-center">
          <span class="text-teal-400 font-bold tracking-widest uppercase">Networking</span>
        </div>
        <div class="flex-1 bg-white p-6 flex flex-col justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-teal-600">Strategy</p>
            <a href="#" class="block mt-2">
              <p class="text-xl font-semibold text-gray-900">Maximizing Sponsor ROI</p>
              <p class="mt-3 text-base text-gray-500">Key architectural models to organize networking booths to guarantee high-frequency interactions for sponsors.</p>
            </a>
          </div>
          <div class="mt-6 flex items-center">
            <p class="text-sm font-medium text-gray-900">March 28, 2026 &middot; 8 min read</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`,
  },
  {
    id: 6,
    name: "FAQ",
    createdAt: "2026-04-06",
    description: "Answer common overarching questions about booking, detailed planning, and fast response support.",
    content: `<div class="bg-gray-50">
  <div class="max-w-7xl mx-auto py-16 px-4 divide-y-2 divide-gray-200 sm:py-24 sm:px-6 lg:px-8">
    <h2 class="text-3xl font-extrabold text-gray-900 text-center uppercase tracking-tight">Frequently Asked Questions</h2>
    <div class="mt-6 pt-10">
      <dl class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12">
        <div>
          <dt class="text-lg leading-6 font-semibold text-gray-900">How early should I book logistics?</dt>
          <dd class="mt-2 text-base text-gray-500">We strongly recommend securing large scale venue dates between 8 to 12 weeks in advance to ensure our premium operational staffing capacity.</dd>
        </div>
        <div>
          <dt class="text-lg leading-6 font-semibold text-gray-900">Do you support custom integrated marketing packages?</dt>
          <dd class="mt-2 text-base text-gray-500">Yes, every digital and physical package can be fully customized from the ground up to match your precise brand parameters and budgetary limits.</dd>
        </div>
        <div>
          <dt class="text-lg leading-6 font-semibold text-gray-900">What happens in case of strict technological failures?</dt>
          <dd class="mt-2 text-base text-gray-500">We deploy a fully detached parallel backup system utilizing secure servers, and we keep redundant physical audio/visual hardware directly on site.</dd>
        </div>
        <div>
          <dt class="text-lg leading-6 font-semibold text-gray-900">Can we integrate our own independent applications?</dt>
          <dd class="mt-2 text-base text-gray-500">Absolutely. Our core APIs allow zero-friction bridging, ensuring attendees can use your flagship mobile resources seamlessly during our event framework.</dd>
        </div>
      </dl>
    </div>
  </div>
</div>`,
  },
  {
    id: 7,
    name: "Event Management",
    createdAt: "2026-04-09",
    description: "Professional end-to-end event planning and execution services tailored for corporate and private gatherings.",
    content: `<div class="bg-white py-12 md:py-20 px-6">
  <div class="max-w-[1200px] mx-auto font-sans">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
      <div>
        <h2 class="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
          Precision Planning, <br/><span class="text-blue-600">Flawless Execution</span>
        </h2>
        <p class="text-lg text-gray-600 leading-relaxed mb-8">
          From concept development to final applause, we handle every intricate detail of your event. Our team specializes in large-scale corporate conferences, product launches, and high-profile private galas.
        </p>
        <div class="grid grid-cols-2 gap-6">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div>
              <h4 class="font-bold text-gray-900">End-to-End</h4>
              <p class="text-sm text-gray-500">Every detail covered.</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0">
               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <h4 class="font-bold text-gray-900">Real-time Stats</h4>
              <p class="text-sm text-gray-500">Live analytics.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm overflow-hidden relative group">
         <div class="aspect-video bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400 font-bold tracking-widest uppercase">
            Planning Visual
         </div>
      </div>
    </div>

    <div class="text-center mb-16">
      <h3 class="text-3xl font-bold text-gray-900 mb-4">How We Work</h3>
      <p class="text-gray-500 max-w-2xl mx-auto">A systematic approach to ensuring your event goals are met with precision and creativity.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="p-8 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all group">
         <span class="text-4xl font-black text-blue-100 group-hover:text-blue-200 transition-colors">01</span>
         <h3 class="text-xl font-bold text-gray-900 mt-4 mb-3">Consultation</h3>
         <p class="text-gray-500 text-sm leading-relaxed">We begin by understanding your vision, target audience, and key objectives for the event.</p>
      </div>
      <div class="p-8 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all group">
         <span class="text-4xl font-black text-blue-100 group-hover:text-blue-200 transition-colors">02</span>
         <h3 class="text-xl font-bold text-gray-900 mt-4 mb-3">Conceptualization</h3>
         <p class="text-gray-500 text-sm leading-relaxed">Our designers create detailed storyboards and layouts to bring the planning phase to life visually.</p>
      </div>
      <div class="p-8 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all group">
         <span class="text-4xl font-black text-blue-100 group-hover:text-blue-200 transition-colors">03</span>
         <h3 class="text-xl font-bold text-gray-900 mt-4 mb-3">Operations</h3>
         <p class="text-gray-500 text-sm leading-relaxed">On the day, our command center ensures everything runs like clockwork with dedicated staff.</p>
      </div>
    </div>
  </div>
</div>`,
  },
  {
    id: 8,
    name: "Live Performances",
    createdAt: "2026-04-09",
    description: "Captivating entertainment solutions including concert production, theater shows, and bespoke artist management.",
    content: `<div class="bg-slate-950 py-20 px-6 text-white overflow-hidden font-sans">
  <div class="max-w-[1200px] mx-auto">
    <div class="text-center mb-20">
       <span class="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold tracking-widest uppercase mb-4 border border-blue-500/20">Entertainment Redefined</span>
       <h2 class="text-4xl md:text-6xl font-black tracking-tighter mb-6 italic">LIVE PERFORMANCES</h2>
       <p class="text-slate-400 max-w-2xl mx-auto text-lg">Bringing soul-stirring energy and world-class production to the stage. We curate unforgettable live experiences.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
      <div class="space-y-12">
        <div class="flex gap-6 items-start group">
          <div class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-2xl text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">01</div>
          <div>
            <h3 class="text-2xl font-bold mb-3">Concert Production</h3>
            <p class="text-slate-400 leading-relaxed">State-of-the-art lighting, sound engineering, and stage design for arena-scale musical events.</p>
          </div>
        </div>
        <div class="flex gap-6 items-start group">
          <div class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-2xl text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">02</div>
          <div>
            <h3 class="text-2xl font-bold mb-3">Theatrical Shows</h3>
            <p class="text-slate-400 leading-relaxed">Immersive drama and musical theater productions featuring top-tier directors and sets.</p>
          </div>
        </div>
        <div class="flex gap-6 items-start group">
          <div class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-2xl text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">03</div>
          <div>
            <h3 class="text-2xl font-bold mb-3">Artist Management</h3>
            <p class="text-slate-400 leading-relaxed">Dedicated representation for performers, musicians, and entertainers worldwide.</p>
          </div>
        </div>
      </div>
      <div class="relative">
        <div class="w-full h-full min-h-[400px] rounded-3xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-700 font-black text-2xl uppercase tracking-tighter overflow-hidden">
           <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
           Stage Experience
        </div>
      </div>
    </div>

    <div class="bg-white/5 border border-white/10 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8">
      <div>
        <h3 class="text-3xl font-bold mb-2 text-white">Book a Performance</h3>
        <p class="text-slate-400">Transform your event with world-class talent and production.</p>
      </div>
      <button class="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/10">
        Inquire Now
      </button>
    </div>
  </div>
</div>`,
  },
];

export const MOCK_TESTIMONIALS = [
  {
    id: "1",
    name: "Aman Gupta",
    eventName: "Tech Summit 2024",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    comment: "The team was incredible! They handled the entire tech summit with absolute perfection. Highly recommended for corporate events.",
    status: true
  },
  {
    id: "2",
    name: "Sneha Reddy",
    eventName: "Grand Wedding Gala",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    comment: "Words cannot describe how beautiful our wedding was. Every detail was meticulously planned and executed flawlessly.",
    status: true
  },
  {
    id: "3",
    name: "Vikram Malhotra",
    eventName: "Launch Party",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    comment: "Sleek, modern, and high-energy! The launch party was a huge hit with our clients. Thanks for the amazing work.",
    status: false
  }
];
