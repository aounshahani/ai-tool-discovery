// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// // Assuming these are your SVG/Div components. 
// // If they are not transparent, they might cover content. 
// // I have placed them with z-0 and content with z-10.
// import {
//     LeftSideHeroFaintBox,
//     RightSideHeroFaintBox,
//     CentralFaintOrangeBox,
//     TallSectionFaintBox,
//     RotatedCurvedBorder,
//     RightCrescentBorder
// } from './BorderDesign';

// // --- Reusable Components ---

// const ToolCard = ({ tool }) => (
//     <div className="group relative bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
//         {/* Badges */}
//         <div className="w-full flex justify-between absolute top-3 px-3 z-10">
//             <div className="bg-gray-800 text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-1">
//                 {tool.rating} <span>⭐</span>
//             </div>
//             <div className="bg-gray-800 text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-1">
//                 👍 {tool.users}
//             </div>
//         </div>

//         {/* Image Area */}
//         <div className="w-full h-32 bg-gray-50 rounded-xl mt-8 mb-4 flex items-center justify-center relative overflow-hidden">
//             <img
//                 src={tool.image}
//                 alt={tool.name}
//                 className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-500"
//                 onError={(e) => e.target.src = 'https://placehold.co/150x150/orange/white?text=Tool'}
//             />
//             <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-sm">
//                 👍
//             </div>
//         </div>

//         {/* Text */}
//         <h5 className="font-bold text-gray-900 text-sm mb-1 text-center">{tool.name}</h5>
//         <p className="text-xs text-[#FF541F] text-center line-clamp-2">{tool.description}</p>
//     </div>
// );

// const PricingCard = ({ plan, price, features, isPro }) => (
//     <div className={`relative p-8 rounded-2xl border flex flex-col h-full transition-transform duration-300 
//         ${isPro
//             ? 'bg-[#1B1B1C] border-[#FF541F] z-10 lg:scale-110 shadow-[0_0_40px_rgba(255,84,31,0.3)]'
//             : 'bg-[#1B1B1C] border-white/10 lg:hover:scale-105'
//         }`}>

//         <h3 className={`text-2xl font-normal mb-2 ${isPro ? 'text-[#FF541F]' : 'text-white'}`}>
//             {plan}
//         </h3>
//         <p className="text-gray-400 text-sm mb-6">Everything you need to supercharge your productivity.</p>

//         <div className="flex items-baseline gap-1 mb-6">
//             <span className="text-4xl font-normal text-white">{price}</span>
//             <span className="text-gray-500 text-sm">/ month</span>
//             {isPro && <span className="ml-2 bg-[#FF541F] text-white text-[10px] px-2 py-0.5 rounded-full">-20%</span>}
//         </div>

//         <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-6" />

//         <div className="flex-grow">
//             <h4 className="text-gray-400 text-sm mb-4">Included features</h4>
//             <ul className="space-y-3 mb-8">
//                 {features.map((feature, i) => (
//                     <li key={i} className="flex items-start gap-3 text-sm">
//                         <span className={isPro ? "text-[#FF541F]" : "text-white"}>✓</span>
//                         <span className="text-gray-300 font-light">{feature}</span>
//                     </li>
//                 ))}
//             </ul>
//         </div>

//         <button className={`w-full py-3 rounded-lg text-sm font-medium transition-colors 
//             ${isPro
//                 ? 'bg-[#FF541F] text-white hover:bg-[#ff6a35]'
//                 : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
//             }`}>
//             Subscribe &gt;
//         </button>
//     </div>
// );

// // --- Main Page ---

// const LandingPage = () => {
//     const navigate = useNavigate();
//     const [openFAQ, setOpenFAQ] = useState(null);

//     const toggleFAQ = (index) => setOpenFAQ(openFAQ === index ? null : index);

//     // Data (Simplified for brevity, keeping structure)
//     const toolCategories = [
//         {
//             title: "Automation tools",
//             tools: Array(5).fill({ name: "Workflow Automation", rating: "4.1", users: "19K", description: "Eliminate repetitive manual tasks", image: "https://placehold.co/150" })
//         },
//         {
//             title: "Productivity tools",
//             tools: Array(5).fill({ name: "Notion", rating: "4.8", users: "100K", description: "All-in-one workspace", image: "https://placehold.co/150" })
//         },
//         // ... Add other categories here
//     ];

//     const faqData = [
//         { question: "What is this platform used for?", answer: "It's an AI-powered design assistant..." },
//         { question: "What happens if I hit my free generation limit?", answer: "You will be prompted to upgrade..." },
//         { question: "Do I need tools experience to use it?", answer: "No, it is beginner friendly." },
//         { question: "Can I collaborate with my team?", answer: "Yes, on the Team plan." },
//         { question: "Is it really free to use?", answer: "Yes, we have a generous free tier." },
//     ];

//     return (
//         <div className="min-h-screen bg-white font-sans overflow-x-hidden text-gray-900 selection:bg-[#FF541F] selection:text-white">

//             {/* Navigation */}
//             <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
//                 <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
//                     <div className="text-2xl font-bold tracking-tight">
//                         DISCOVER <span className="text-[#FF541F]">AI</span>
//                     </div>

//                     <div className="hidden md:flex gap-8 items-center">
//                         {['Home', 'All tools', 'Contact us', 'About us', 'Subscriptions'].map((item, i) => (
//                             <a key={i} href="#" className={`text-sm font-medium transition-colors ${i === 0 ? 'text-[#FF541F] border-b-2 border-[#FF541F]' : 'text-gray-600 hover:text-[#FF541F]'}`}>
//                                 {item}
//                             </a>
//                         ))}
//                     </div>

//                     <div className="flex gap-3">
//                         <button onClick={() => navigate('/login')} className="px-5 py-2 bg-[#FF541F] text-white rounded-lg text-sm font-medium hover:bg-[#e0481a] transition">
//                             Login
//                         </button>
//                         <button onClick={() => navigate('/register')} className="px-5 py-2 border border-gray-300 text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
//                             Sign up
//                         </button>
//                     </div>
//                 </div>
//             </nav>

//             {/* Hero Section */}
//             <section className="relative pt-32 pb-20 px-6 overflow-hidden">
//                 {/* Decorative Borders (Absolute) */}
//                 <div className="absolute inset-0 pointer-events-none flex justify-between max-w-[1400px] mx-auto opacity-50">
//                     <LeftSideHeroFaintBox />
//                     <CentralFaintOrangeBox />
//                     <RightSideHeroFaintBox />
//                 </div>

//                 <div className="max-w-5xl mx-auto text-center relative z-10">
//                     {/* Reviews Badge */}
//                     <div className="inline-flex items-center gap-3 px-5 py-2 bg-orange-50/50 border border-orange-100 rounded-full mb-8 backdrop-blur-sm">
//                         <div className="flex -space-x-2">
//                             {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white" />)}
//                         </div>
//                         <div className="text-left">
//                             <div className="text-[#FF541F] text-xs tracking-widest">★★★★★</div>
//                             <div className="text-xs font-medium text-[#FF541F]">115+ happy users</div>
//                         </div>
//                     </div>

//                     <h1 className="text-6xl md:text-8xl font-normal text-gray-900 mb-8 leading-tight">
//                         Discover <span className="text-[#FF541F]">Smarter</span><br />
//                         Build Faster.
//                     </h1>

//                     <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 font-light">
//                         Discover the right AI solutions faster. Our platform curates, organizes, and simplifies the <span className="text-[#FF541F]">AI landscape</span> so you can focus on scaling.
//                     </p>

//                     <div className="flex justify-center gap-4 mb-20">
//                         <button className="px-8 py-3 bg-[#FF541F] text-white rounded-xl text-lg font-medium hover:shadow-lg hover:shadow-orange-500/30 transition">
//                             Get Started
//                         </button>
//                         <button className="px-8 py-3 border border-gray-900 text-gray-900 rounded-xl text-lg font-medium hover:bg-gray-50 transition">
//                             See Details
//                         </button>
//                     </div>

//                     <h2 className="text-4xl md:text-5xl font-normal text-gray-900 mb-6">
//                         Built for Builders Driven by <span className="text-[#FF541F]">AI</span>
//                     </h2>
//                     <p className="text-gray-600 max-w-2xl mx-auto">
//                         Unlock the full potential of your creativity with our AI-powered design assistant.
//                     </p>
//                 </div>
//             </section>

//             {/* Tools Section */}
//             <section className="py-20 px-6 relative">
//                 <div className="absolute inset-0 pointer-events-none overflow-hidden">
//                     {/* Pass styles to your border components to position them if needed */}
//                     <div className="absolute left-0 top-0"><TallSectionFaintBox side="left" /></div>
//                     <div className="absolute right-0 top-0"><TallSectionFaintBox side="right" /></div>
//                 </div>

//                 <div className="max-w-7xl mx-auto relative z-10">
//                     <h3 className="text-4xl font-normal text-gray-900 mb-16">
//                         Start exploring here <span className="text-[#FF541F]">👇</span>
//                     </h3>

//                     <div className="space-y-20">
//                         {toolCategories.map((cat, idx) => (
//                             <div key={idx}>
//                                 <div className="flex items-center gap-4 mb-8">
//                                     <h4 className="text-3xl text-[#FF541F] font-normal">{cat.title}</h4>
//                                     <div className="h-px bg-gray-200 flex-grow"></div>
//                                 </div>
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
//                                     {cat.tools.map((tool, tIdx) => (
//                                         <ToolCard key={tIdx} tool={tool} />
//                                     ))}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* Pricing Section */}
//             <section className="py-24 px-6 relative overflow-hidden">
//                 <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-20">
//                     <RotatedCurvedBorder />
//                 </div>

//                 <div className="max-w-7xl mx-auto relative z-10">
//                     <div className="text-center mb-16 max-w-3xl mx-auto">
//                         <h2 className="text-5xl font-normal text-gray-900 mb-6">
//                             Choose the <span className="text-[#FF541F]">Plan</span> That's Right
//                         </h2>
//                         <p className="text-lg text-gray-600">
//                             Giving you access to essential features. Upgrade to <span className="text-[#FF541F]">Pro</span> to unlock powerful AI capabilities.
//                         </p>
//                     </div>

//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-0 items-center max-w-5xl mx-auto">
//                         {/* Free Plan */}
//                         <div className="h-auto lg:h-[500px] rounded-2xl lg:rounded-r-none lg:rounded-l-2xl border border-r-0 border-white/10 bg-[#1B1B1C]">
//                             <PricingCard
//                                 plan="Free"
//                                 price="$0"
//                                 features={['100 hours /month', 'Low-res downloads', 'Basic style presets']}
//                             />
//                         </div>

//                         {/* Pro Plan */}
//                         <div className="h-auto">
//                             <PricingCard
//                                 plan="Pro"
//                                 price="$17"
//                                 isPro={true}
//                                 features={['10,000 hours /month', 'Enigma AI', 'High-res downloads', 'Multiple screens']}
//                             />
//                         </div>

//                         {/* Team Plan */}
//                         <div className="h-auto lg:h-[500px] rounded-2xl lg:rounded-l-none lg:rounded-r-2xl border border-l-0 border-white/10 bg-[#1B1B1C]">
//                             <PricingCard
//                                 plan="Team"
//                                 price="$37"
//                                 features={['Everything in Free', 'Unlimited hours', 'Priority support']}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* FAQ Section */}
//             <section className="py-24 px-6 relative">
//                 <div className="absolute right-0 top-0 pointer-events-none opacity-30">
//                     <RightCrescentBorder />
//                 </div>

//                 {/* Red Blur Background Effect */}
//                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF541F] rounded-full blur-[150px] opacity-5 pointer-events-none" />

//                 <div className="max-w-4xl mx-auto relative z-10">
//                     <h2 className="text-5xl text-center font-normal text-gray-900 mb-16">
//                         Frequently <span className="text-[#FF541F]">Asked</span> Questions
//                     </h2>

//                     <div className="space-y-4">
//                         {faqData.map((faq, index) => (
//                             <div key={index} className="border-b border-gray-200">
//                                 <button
//                                     onClick={() => toggleFAQ(index)}
//                                     className="w-full flex justify-between items-center py-6 text-left hover:bg-gray-50/50 transition-colors"
//                                 >
//                                     <span className="text-2xl font-normal text-gray-900">
//                                         {faq.question.split(' ').map((word, i) =>
//                                             ['platform', 'limit', 'tools', 'team', 'free'].some(k => word.toLowerCase().includes(k))
//                                                 ? <span key={i} className="text-[#FF541F]">{word} </span>
//                                                 : word + ' '
//                                         )}
//                                     </span>
//                                     <span className={`text-2xl text-[#FF541F] transition-transform duration-300 ${openFAQ === index ? 'rotate-180' : ''}`}>
//                                         ▼
//                                     </span>
//                                 </button>
//                                 <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFAQ === index ? 'max-h-48 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
//                                     <p className="text-gray-600 text-lg leading-relaxed font-light">
//                                         {faq.answer}
//                                     </p>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* CTA Section */}
//             <section className="py-20 px-6">
//                 <div className="max-w-6xl mx-auto rounded-[40px] p-20 text-center relative overflow-hidden">
//                     {/* Radial Gradient Background */}
//                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-100/80 via-transparent to-transparent opacity-80" />

//                     <div className="relative z-10">
//                         <h2 className="text-6xl font-normal text-gray-900 mb-6">Ready to Think Smarter?</h2>
//                         <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
//                             Whether you're a freelancer, a team, or a growing agency—our tools adapt to your workflow.
//                         </p>
//                         <button className="px-10 py-4 bg-[#FF541F] text-white rounded-xl text-xl font-medium hover:bg-[#e0481a] transition shadow-lg shadow-orange-500/20">
//                             Get Started →
//                         </button>
//                     </div>
//                 </div>
//             </section>

//             {/* Footer */}
//             <footer className="bg-gray-50 pt-20 pb-10 px-6 border-t border-gray-200">
//                 <div className="max-w-7xl mx-auto">
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
//                         <div className="col-span-1 md:col-span-1">
//                             <h4 className="text-2xl font-normal mb-6 text-gray-900">About Us</h4>
//                             <p className="text-gray-500 leading-relaxed font-light">
//                                 We simplify AI by bringing the best tools together—helping you discover, compare, and adopt solutions.
//                             </p>
//                         </div>

//                         <div>
//                             <h4 className="text-xl text-[#FF541F] mb-6">Useful Links</h4>
//                             <ul className="space-y-4 text-gray-500 font-light">
//                                 {['About', 'All tools', 'About us', 'Contact us'].map(l => <li key={l}><a href="#" className="hover:text-[#FF541F] transition">{l}</a></li>)}
//                             </ul>
//                         </div>

//                         <div>
//                             <h4 className="text-xl text-[#FF541F] mb-6">Help</h4>
//                             <ul className="space-y-4 text-gray-500 font-light">
//                                 {['Customer Support', 'Terms & Conditions', 'Privacy Policy', 'Contact Us'].map(l => <li key={l}><a href="#" className="hover:text-[#FF541F] transition">{l}</a></li>)}
//                             </ul>
//                         </div>

//                         <div>
//                             <h4 className="text-xl text-[#FF541F] mb-6">Connect With Us</h4>
//                             <ul className="space-y-4 text-gray-500 font-light">
//                                 <li>Pakistan, Islamabad, I-9/3<br />java chowk, street# 05</li>
//                                 <li>+92 329 966 0890</li>
//                                 <li>discovery_ai@mail.com</li>
//                             </ul>
//                         </div>
//                     </div>

//                     <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
//                         <p className="text-[#FF541F] text-sm">© 2025 All Right Reserved.</p>
//                         <div className="flex gap-4">
//                             {['f', 'in', 'G', 'yt'].map((icon, i) => (
//                                 <div key={i} className="w-10 h-10 border border-[#FF541F] text-[#FF541F] rounded-full flex items-center justify-center hover:bg-[#FF541F] hover:text-white transition cursor-pointer font-bold">
//                                     {icon}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </footer>
//         </div>
//     );
// };

// export default LandingPage;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// // --- 1. Recreated Border Components (to ensure they appear) ---

// const HeroCornerBorder = ({ position }) => {
//     const isLeft = position === 'left';
//     return (
//         <div className={`absolute top-0 ${isLeft ? 'left-0' : 'right-0'} w-100 h-64 pointer-events-none opacity-60`}>
//             {/* Vertical Line */}
//             <div className={`absolute top-0 ${isLeft ? 'left-0' : 'right-0'} w-px h-full bg-gradient-to-b from-[#FF541F]/50 to-transparent`} />
//             {/* Horizontal Line */}
//             <div className={`absolute top-0 ${isLeft ? 'left-0' : 'right-0'} h-px w-full bg-gradient-to-r from-[#FF541F]/50 to-transparent ${!isLeft && 'transform rotate-180'}`} />
//             {/* Corner Decoration */}
//             <div className={`absolute top-0 ${isLeft ? 'left-0' : 'right-0'} w-4 h-4 border-t-2 ${isLeft ? 'border-l-2 left-0' : 'border-r-2 right-0'} border-[#FF541F]`} />
//         </div>
//     );
// };

// const TallSideBorder = () => (
//     <div className="absolute inset-y-0 w-px bg-[#FF541F]/20 h-full" />
// );

// const PricingCurvedBackground = () => (
//     <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 1440 800" fill="none">
//         <path d="M-100 400 Q 720 800 1540 400" stroke="#FF541F" strokeWidth="1.5" strokeOpacity="0.3" fill="none" />
//     </svg>
// );

// // --- 2. Data Configuration ---

// const toolCategories = [
//     {
//         title: "Automation tools",
//         tools: [
//             { name: "Automation Anywhere", rating: "4.5", users: "19K", description: "Automates tasks and workflows", image: "https://placehold.co/150x150/orange/white?text=AA" },
//             { name: "Zapier", rating: "4.7", users: "50K", description: "Connect your apps and automate workflows", image: "https://placehold.co/150x150/orange/white?text=Zapier" },
//             { name: "UiPath", rating: "4.6", users: "30K", description: "Robotic Process Automation", image: "https://placehold.co/150x150/orange/white?text=UiPath" },
//             { name: "Make", rating: "4.5", users: "25K", description: "Visual platform to design workflows", image: "https://placehold.co/150x150/orange/white?text=Make" },
//             { name: "Monday.com", rating: "4.4", users: "40K", description: "Work OS for teams", image: "https://placehold.co/150x150/orange/white?text=Monday" },
//         ]
//     },
//     {
//         title: "Productivity tools",
//         tools: [
//             { name: "Notion", rating: "4.8", users: "100K", description: "All-in-one workspace", image: "https://placehold.co/150x150/orange/white?text=Notion" },
//             { name: "Asana", rating: "4.6", users: "80K", description: "Work management platform", image: "https://placehold.co/150x150/orange/white?text=Asana" },
//             { name: "Trello", rating: "4.5", users: "75K", description: "Collaboration tool for teams", image: "https://placehold.co/150x150/orange/white?text=Trello" },
//             { name: "Slack", rating: "4.7", users: "120K", description: "Team communication hub", image: "https://placehold.co/150x150/orange/white?text=Slack" },
//             { name: "ClickUp", rating: "4.6", users: "60K", description: "Everything app for work", image: "https://placehold.co/150x150/orange/white?text=ClickUp" },
//         ]
//     },
//     // Added minimal placeholders to simulate the long list in your design
//     { title: "Creativity tools", tools: Array(5).fill({ name: "Figma", rating: "4.9", users: "200K", description: "Design anything", image: "https://placehold.co/150x150/orange/white?text=Figma" }) },
//     { title: "Business tools", tools: Array(5).fill({ name: "Salesforce", rating: "4.5", users: "110K", description: "CRM platform", image: "https://placehold.co/150x150/orange/white?text=SF" }) },
//     { title: "Educational tools", tools: Array(5).fill({ name: "Coursera", rating: "4.7", users: "130K", description: "Online courses", image: "https://placehold.co/150x150/orange/white?text=Edu" }) },
// ];

// // --- 3. Sub-Components ---

// const ToolCard = ({ tool }) => (
//     <div className="group relative bg-white border border-gray-200 rounded-xl p-3 flex flex-col items-center hover:shadow-lg transition-all duration-300 h-full">
//         {/* Badges */}
//         <div className="w-full flex justify-between absolute top-2 px-2 z-10">
//             <div className="bg-[#374151] text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
//                 {tool.rating} <span>⭐</span>
//             </div>
//             <div className="bg-[#374151] text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center">
//                 {tool.users}
//             </div>
//         </div>

//         {/* Image Container */}
//         <div className="w-full aspect-square bg-gray-50 rounded-lg mt-6 mb-3 flex items-center justify-center relative overflow-hidden">
//             <img
//                 src={tool.image}
//                 alt={tool.name}
//                 className="w-3/4 h-3/4 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
//             />
//             <div className="absolute bottom-1 right-1 bg-white border border-gray-200 rounded-full p-1 shadow-sm w-6 h-6 flex items-center justify-center">
//                 <span className="text-[10px]">👍</span>
//             </div>
//         </div>

//         {/* Text */}
//         <h5 className="font-bold text-gray-900 text-sm mb-1 text-center leading-tight">{tool.name}</h5>
//         <p className="text-[11px] text-[#FF541F] text-center line-clamp-2 leading-tight">{tool.description}</p>
//     </div>
// );

// const LandingPage = () => {
//     const navigate = useNavigate();
//     const [openFAQ, setOpenFAQ] = useState(null);
//     const toggleFAQ = (index) => setOpenFAQ(openFAQ === index ? null : index);

//     return (
//         <div className="min-h-screen bg-white font-sans overflow-x-hidden text-gray-900">

//             {/* --- Navigation --- */}
//             <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
//                 <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
//                     <div className="text-2xl font-bold tracking-tight">
//                         DISCOVER <span className="text-[#FF541F]">AI</span>
//                     </div>
//                     <div className="hidden md:flex gap-10 items-center">
//                         {['Home', 'All tools', 'Contact us', 'About us', 'Subscriptions'].map((item, i) => (
//                             <a key={i} href="#" className={`text-sm font-medium transition-colors ${i === 0 ? 'text-[#FF541F] border-b-2 border-[#FF541F] pb-1' : 'text-gray-600 hover:text-[#FF541F]'}`}>
//                                 {item}
//                             </a>
//                         ))}
//                     </div>
//                     <div className="flex gap-3">
//                         <button onClick={() => navigate('/login')} className="px-6 py-2 bg-[#FF541F] text-white rounded-lg text-sm font-medium hover:bg-[#e0481a] transition">Login</button>
//                         <button onClick={() => navigate('/register')} className="px-6 py-2 border border-gray-300 text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Sign up</button>
//                     </div>
//                 </div>
//             </nav>

//             {/* --- Hero Section --- */}
//             <section className="relative pt-36 pb-20 px-6">
//                 {/* Hero Borders */}
//                 <div className="absolute top-32 left-4 md:left-12 z-0"><HeroCornerBorder position="left" /></div>
//                 <div className="absolute top-32 right-4 md:right-12 z-0"><HeroCornerBorder position="right" /></div>

//                 <div className="max-w-5xl mx-auto text-center relative z-10">
//                     {/* Review Badge */}
//                     <div className="inline-flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-orange-50 to-white border border-orange-100 rounded-full mb-10 shadow-sm">
//                         <div className="flex -space-x-3">
//                             {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 border-2 border-white" />)}
//                         </div>
//                         <div className="text-left leading-none">
//                             <div className="text-[#FF541F] text-xs tracking-widest mb-1">★★★★★</div>
//                             <div className="text-xs font-bold text-[#FF541F]">115+ happy users</div>
//                         </div>
//                     </div>

//                     <h1 className="text-6xl md:text-8xl font-normal text-gray-900 mb-8 leading-[1.1]">
//                         Discover <span className="text-[#FF541F]">Smarter</span><br />
//                         Build Faster.
//                     </h1>

//                     <p className="text-xl text-gray-500 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
//                         Discover the right AI solutions faster. Our platform curates, organizes,
//                         and simplifies the <span className="text-[#FF541F] font-medium">AI landscape</span> so you can focus on scaling.
//                     </p>

//                     <div className="flex flex-col sm:flex-row justify-center gap-5 mb-24">
//                         <button className="px-10 py-3.5 bg-[#FF541F] text-white rounded-xl text-lg font-medium shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition transform hover:-translate-y-0.5">
//                             Get Started
//                         </button>
//                         <button className="px-10 py-3.5 border border-gray-300 text-gray-900 rounded-xl text-lg font-medium hover:bg-gray-50 transition">
//                             See Details
//                         </button>
//                     </div>

//                     <h2 className="text-4xl md:text-6xl font-normal text-gray-900 mb-4">
//                         Built for Builders Driven by <span className="text-[#FF541F]">AI</span>
//                     </h2>
//                     <p className="text-lg text-gray-500 max-w-2xl mx-auto">
//                         Unlock the full potential of your creativity with our <span className="text-[#FF541F]">AI-powered</span> design assistant.
//                     </p>
//                 </div>
//             </section>

//             {/* --- Tools Section --- */}
//             <section className="py-16 px-6 md:px-12 relative">
//                 <div className="max-w-[1400px] mx-auto relative">
//                     {/* Long Vertical Side Borders (The FaintBox simulation) */}
//                     <div className="absolute top-0 bottom-0 left-0"><TallSideBorder /></div>
//                     <div className="absolute top-0 bottom-0 right-0"><TallSideBorder /></div>

//                     <div className="px-4 md:px-10">
//                         <h3 className="text-4xl font-normal text-gray-900 mb-16">
//                             Start exploring here <span className="text-[#FF541F]">👇</span>
//                         </h3>

//                         {toolCategories.map((cat, idx) => (
//                             <div key={idx} className="mb-16">
//                                 <div className="flex items-center gap-6 mb-8">
//                                     <h4 className="text-3xl text-[#FF541F] font-normal whitespace-nowrap">{cat.title}</h4>
//                                     {/* Horizontal Divider line */}
//                                     <div className="h-px bg-[#FF541F]/20 flex-grow"></div>
//                                 </div>

//                                 {/* 5 Column Grid to match design */}
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
//                                     {cat.tools.map((tool, tIdx) => (
//                                         <ToolCard key={tIdx} tool={tool} />
//                                     ))}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* --- Pricing Section --- */}
//             <section className="py-24 px-6 relative overflow-hidden">
//                 <PricingCurvedBackground />

//                 <div className="max-w-7xl mx-auto relative z-10">
//                     <div className="text-center mb-20 max-w-3xl mx-auto">
//                         <h2 className="text-6xl font-normal text-gray-900 mb-6">
//                             Choose the <span className="text-[#FF541F]">Plan</span> That's Right
//                         </h2>
//                         <p className="text-xl text-gray-600 font-light">
//                             Upgrade to the <span className="text-[#FF541F] font-medium">Pro Plan</span> to unlock powerful AI capabilities.
//                         </p>
//                     </div>

//                     <div className="flex flex-col lg:flex-row items-center justify-center gap-0 max-w-6xl mx-auto">

//                         {/* Free Plan */}
//                         <div className="w-full lg:w-1/3 bg-[#1B1B1C] p-10 rounded-t-2xl lg:rounded-tr-none lg:rounded-l-3xl border border-white/10 h-auto lg:h-[520px] flex flex-col justify-between">
//                             <div>
//                                 <h3 className="text-xl text-white font-medium mb-2">Free</h3>
//                                 <p className="text-gray-400 text-sm mb-6">Essential features for starters.</p>
//                                 <div className="text-5xl text-white font-normal mb-8">$0<span className="text-lg text-gray-500 ml-2">/ mo</span></div>
//                                 <div className="h-px bg-gray-700 mb-6"></div>
//                                 <ul className="space-y-3 text-gray-300 text-sm font-light">
//                                     {['100 hours /month', 'Low-res downloads', 'Basic presets'].map(f => (
//                                         <li key={f} className="flex gap-3"><span>✓</span> {f}</li>
//                                     ))}
//                                 </ul>
//                             </div>
//                             <button className="w-full py-3 mt-8 rounded-lg bg-white/5 text-white border border-white/10 hover:bg-white/10 transition">Subscribe &gt;</button>
//                         </div>

//                         {/* Pro Plan (Highlighted) */}
//                         <div className="w-full lg:w-1/3 bg-[#1B1B1C] p-10 rounded-2xl border-2 border-[#FF541F] relative z-20 transform lg:scale-110 shadow-[0_0_60px_rgba(255,84,31,0.4)] h-auto lg:h-[600px] flex flex-col justify-between">
//                             <div>
//                                 <h3 className="text-3xl text-[#FF541F] font-medium mb-2">Pro</h3>
//                                 <p className="text-gray-400 text-sm mb-6">Unlock personal productivity.</p>
//                                 <div className="flex items-baseline mb-8">
//                                     <span className="text-5xl text-white font-normal">$17</span>
//                                     <span className="text-lg text-gray-500 ml-2">/ mo</span>
//                                     <span className="ml-3 bg-[#FF541F] text-white text-[10px] font-bold px-2 py-1 rounded-full">-20%</span>
//                                 </div>
//                                 <div className="h-px bg-gray-700 mb-6"></div>
//                                 <ul className="space-y-4 text-gray-300 text-sm font-light">
//                                     {['10,000 hours /month', 'Enigma AI Access', 'High-res downloads', 'Multiple screens'].map(f => (
//                                         <li key={f} className="flex gap-3"><span className="text-[#FF541F]">✓</span> {f}</li>
//                                     ))}
//                                 </ul>
//                             </div>
//                             <button className="w-full py-4 mt-8 rounded-lg bg-[#FF541F] text-white font-medium hover:bg-[#e0481a] transition shadow-lg shadow-orange-500/40">Subscribe &gt;</button>
//                         </div>

//                         {/* Team Plan */}
//                         <div className="w-full lg:w-1/3 bg-[#1B1B1C] p-10 rounded-b-2xl lg:rounded-bl-none lg:rounded-r-3xl border border-white/10 h-auto lg:h-[520px] flex flex-col justify-between">
//                             <div>
//                                 <h3 className="text-xl text-white font-medium mb-2">Team</h3>
//                                 <p className="text-gray-400 text-sm mb-6">Supercharge your team.</p>
//                                 <div className="flex items-baseline mb-8">
//                                     <span className="text-5xl text-white font-normal">$37</span>
//                                     <span className="text-lg text-gray-500 ml-2">/ mo</span>
//                                     <span className="ml-3 bg-[#FF541F] text-white text-[10px] font-bold px-2 py-1 rounded-full">-20%</span>
//                                 </div>
//                                 <div className="h-px bg-gray-700 mb-6"></div>
//                                 <ul className="space-y-3 text-gray-300 text-sm font-light">
//                                     {['Everything in Free', 'Unlimited hours', 'Shared Quicklinks', 'Priority support'].map(f => (
//                                         <li key={f} className="flex gap-3"><span>✓</span> {f}</li>
//                                     ))}
//                                 </ul>
//                             </div>
//                             <button className="w-full py-3 mt-8 rounded-lg bg-white/5 text-white border border-white/10 hover:bg-white/10 transition">Subscribe &gt;</button>
//                         </div>

//                     </div>
//                 </div>
//             </section>

//             {/* --- FAQ Section --- */}
//             <section className="py-24 px-6 relative">
//                 <div className="max-w-4xl mx-auto relative z-10">
//                     <div className="text-center mb-16">
//                         <h2 className="text-5xl font-normal text-gray-900 mb-6">
//                             Frequently <span className="text-[#FF541F]">Asked</span> Questions
//                         </h2>
//                         <p className="text-xl text-gray-600 font-light">
//                             Got questions? We've got <span className="text-[#FF541F]">answers</span>.
//                         </p>
//                     </div>

//                     <div className="space-y-2">
//                         {[
//                             { q: "What is this platform used for?", a: "It's an AI-powered design assistant..." },
//                             { q: "What happens if I hit my free generation limit?", a: "You will be prompted to upgrade..." },
//                             { q: "Do I need tools experience to use it?", a: "No, it's user friendly." },
//                             { q: "Can I collaborate with my team?", a: "Yes, via the Team plan." },
//                             { q: "Is it really free to use?", a: "Yes, absolutely." }
//                         ].map((item, index) => (
//                             <div key={index} className="border-b border-gray-200">
//                                 <button onClick={() => toggleFAQ(index)} className="w-full flex justify-between items-center py-6 text-left group">
//                                     <span className="text-2xl font-normal text-gray-900 group-hover:text-[#FF541F] transition-colors">{item.q}</span>
//                                     <span className={`text-[#FF541F] text-2xl transition-transform duration-300 ${openFAQ === index ? 'rotate-180' : ''}`}>▼</span>
//                                 </button>
//                                 <div className={`overflow-hidden transition-all duration-300 ${openFAQ === index ? 'max-h-40 pb-6' : 'max-h-0'}`}>
//                                     <p className="text-gray-600 text-lg font-light leading-relaxed">{item.a}</p>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* --- CTA Section (Fixed Gradient) --- */}
//             <section className="py-20 px-6">
//                 <div className="max-w-[1200px] mx-auto relative rounded-[40px] overflow-hidden p-20 text-center border border-white/20">
//                     {/* EXACT GRADIENT FROM FIGMA */}
//                     <div
//                         className="absolute inset-0 z-0"
//                         style={{
//                             background: 'radial-gradient(50% 60% at 50% 40%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 84, 31, 0.32) 25%, rgba(247, 175, 153, 0.4) 36%, rgba(255, 84, 31, 0.4) 50%, rgba(0, 0, 0, 0) 100%)',
//                             backgroundColor: '#FFF' // Fallback/Base
//                         }}
//                     />

//                     <div className="relative z-10">
//                         <h2 className="text-6xl font-normal text-gray-900 mb-6">Ready to Think Smarter?</h2>
//                         <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 font-light">
//                             Whether you're a freelancer, a team, or a growing agency—our tools adapt to your workflow.
//                         </p>
//                         <button className="px-12 py-4 bg-[#FF541F] text-white rounded-xl text-xl font-medium hover:bg-[#e0481a] transition shadow-xl shadow-orange-500/30">
//                             Get Started →
//                         </button>
//                     </div>
//                 </div>
//             </section>

//             {/* --- Footer --- */}
//             <footer className="bg-gray-50 pt-20 pb-10 px-6 border-t border-gray-200">
//                 <div className="max-w-7xl mx-auto">
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
//                         <div className="col-span-1">
//                             <h4 className="text-3xl font-normal mb-6">About Us</h4>
//                             <p className="text-gray-500 leading-relaxed font-light text-lg">
//                                 We simplify AI by bringing the best tools together—helping you discover, compare, and adopt solutions.
//                             </p>
//                         </div>

//                         {/* Links sections omitted for brevity, same structure as previous */}
//                         <div>
//                             <h4 className="text-xl font-normal text-[#FF541F] mb-6">Useful Links</h4>
//                             <ul className="space-y-3 text-gray-500 text-lg font-light">
//                                 <li>About</li><li>All tools</li><li>Contact us</li>
//                             </ul>
//                         </div>
//                         <div>
//                             <h4 className="text-xl font-normal text-[#FF541F] mb-6">Help</h4>
//                             <ul className="space-y-3 text-gray-500 text-lg font-light">
//                                 <li>Support</li><li>Terms</li><li>Privacy</li>
//                             </ul>
//                         </div>
//                         <div>
//                             <h4 className="text-xl font-normal text-[#FF541F] mb-6">Connect With Us</h4>
//                             <ul className="space-y-3 text-gray-500 text-lg font-light">
//                                 <li>Islamabad, Pakistan</li>
//                                 <li>+92 329 966 0890</li>
//                                 <li>discovery_ai@mail.com</li>
//                             </ul>
//                         </div>
//                     </div>

//                     <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
//                         <p className="text-[#FF541F]">© 2025 All Right Reserved.</p>
//                         <div className="flex gap-4">
//                             {['f', 'in', 'G', 'yt'].map((icon, i) => (
//                                 <div key={i} className="w-10 h-10 border-2 border-[#FF541F] text-[#FF541F] rounded-full flex items-center justify-center hover:bg-[#FF541F] hover:text-white transition cursor-pointer font-bold">
//                                     {icon}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </footer>
//         </div>
//     );
// };

// export default LandingPage;


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// // Import the modified borders
// import {
//     LeftSideHeroFaintBox,
//     RightSideHeroFaintBox,
//     CentralFaintOrangeBox,
//     TallSectionFaintBox,
//     RotatedCurvedBorder,
//     RightCrescentBorder
// } from './BorderDesign';

// // --- Tool Card Component ---
// const ToolCard = ({ tool }) => (
//     <div className="group relative bg-white border border-gray-200 rounded-xl p-3 flex flex-col items-center hover:shadow-lg transition-all duration-300 h-full z-10">
//         {/* Badges */}
//         <div className="w-full flex justify-between absolute top-2 px-2 z-20">
//             <div className="bg-[#374151] text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
//                 {tool.rating} <span>⭐</span>
//             </div>
//             <div className="bg-[#374151] text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center">
//                 {tool.users}
//             </div>
//         </div>

//         {/* Image Container */}
//         <div className="w-full aspect-square bg-gray-50 rounded-lg mt-6 mb-3 flex items-center justify-center relative overflow-hidden">
//             <img 
//                 src={tool.image} 
//                 alt={tool.name} 
//                 className="w-3/4 h-3/4 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
//                 onError={(e) => e.target.src = 'https://placehold.co/150x150/orange/white?text=Tool'}
//             />
//             <div className="absolute bottom-1 right-1 bg-white border border-gray-200 rounded-full p-1 shadow-sm w-6 h-6 flex items-center justify-center">
//                 <span className="text-[10px]">👍</span>
//             </div>
//         </div>

//         {/* Text */}
//         <h5 className="font-bold text-gray-900 text-sm mb-1 text-center leading-tight">{tool.name}</h5>
//         <p className="text-[11px] text-[#FF541F] text-center line-clamp-2 leading-tight">{tool.description}</p>
//     </div>
// );

// // --- Main Component ---
// const LandingPage = () => {
//     const navigate = useNavigate();
//     const [openFAQ, setOpenFAQ] = useState(null);
//     const toggleFAQ = (index) => setOpenFAQ(openFAQ === index ? null : index);

//     // --- Data Setup (5 items per category to match design) ---
//     const toolCategories = [
//         {
//             title: "Automation tools",
//             tools: [
//                 { name: "Automation Anywhere", rating: "4.5", users: "19K", description: "Automates tasks and workflows", image: "https://placehold.co/150/orange/white?text=AA" },
//                 { name: "Zapier", rating: "4.7", users: "50K", description: "Connect your apps and automate workflows", image: "https://placehold.co/150/orange/white?text=Zapier" },
//                 { name: "UiPath", rating: "4.6", users: "30K", description: "Robotic Process Automation", image: "https://placehold.co/150/orange/white?text=UiPath" },
//                 { name: "Make", rating: "4.5", users: "25K", description: "Visual platform to design workflows", image: "https://placehold.co/150/orange/white?text=Make" },
//                 { name: "Monday.com", rating: "4.4", users: "40K", description: "Work OS for teams", image: "https://placehold.co/150/orange/white?text=Monday" },
//             ]
//         },
//         {
//             title: "Productivity tools",
//             tools: [
//                 { name: "Notion", rating: "4.8", users: "100K", description: "All-in-one workspace", image: "https://placehold.co/150/orange/white?text=Notion" },
//                 { name: "Asana", rating: "4.6", users: "80K", description: "Work management platform", image: "https://placehold.co/150/orange/white?text=Asana" },
//                 { name: "Trello", rating: "4.5", users: "75K", description: "Collaboration tool for teams", image: "https://placehold.co/150/orange/white?text=Trello" },
//                 { name: "Slack", rating: "4.7", users: "120K", description: "Team communication hub", image: "https://placehold.co/150/orange/white?text=Slack" },
//                 { name: "ClickUp", rating: "4.6", users: "60K", description: "Everything app for work", image: "https://placehold.co/150/orange/white?text=ClickUp" },
//             ]
//         },
//         {
//             title: "Creativity tools",
//             tools: [
//                 { name: "Canva", rating: "4.9", users: "200K", description: "Design anything", image: "https://placehold.co/150/orange/white?text=Canva" },
//                 { name: "Figma", rating: "4.8", users: "150K", description: "Collaborative interface design", image: "https://placehold.co/150/orange/white?text=Figma" },
//                 { name: "Adobe CC", rating: "4.7", users: "180K", description: "Creative apps and services", image: "https://placehold.co/150/orange/white?text=Adobe" },
//                 { name: "Midjourney", rating: "4.6", users: "90K", description: "AI image generation", image: "https://placehold.co/150/orange/white?text=Midjourney" },
//                 { name: "DALL-E", rating: "4.5", users: "85K", description: "Create images from text", image: "https://placehold.co/150/orange/white?text=DALL-E" },
//             ]
//         },
//         {
//             title: "Business tools",
//             tools: [
//                 { name: "Salesforce", rating: "4.5", users: "110K", description: "CRM platform", image: "https://placehold.co/150/orange/white?text=Salesforce" },
//                 { name: "HubSpot", rating: "4.6", users: "95K", description: "Marketing automation", image: "https://placehold.co/150/orange/white?text=HubSpot" },
//                 { name: "QuickBooks", rating: "4.4", users: "70K", description: "Accounting software", image: "https://placehold.co/150/orange/white?text=QB" },
//                 { name: "Stripe", rating: "4.7", users: "105K", description: "Online payment processing", image: "https://placehold.co/150/orange/white?text=Stripe" },
//                 { name: "Mailchimp", rating: "4.5", users: "88K", description: "Email marketing platform", image: "https://placehold.co/150/orange/white?text=Mailchimp" },
//             ]
//         },
//         {
//             title: "Educational tools",
//             tools: [
//                 { name: "Coursera", rating: "4.7", users: "130K", description: "Online courses", image: "https://placehold.co/150/orange/white?text=Coursera" },
//                 { name: "Khan Academy", rating: "4.8", users: "140K", description: "Free education for anyone", image: "https://placehold.co/150/orange/white?text=Khan" },
//                 { name: "Duolingo", rating: "4.6", users: "160K", description: "Language learning app", image: "https://placehold.co/150/orange/white?text=Duolingo" },
//                 { name: "Udemy", rating: "4.5", users: "125K", description: "Online learning marketplace", image: "https://placehold.co/150/orange/white?text=Udemy" },
//                 { name: "edX", rating: "4.6", users: "100K", description: "University-level courses", image: "https://placehold.co/150/orange/white?text=edX" },
//             ]
//         },
//     ];

//     return (
//         <div className="min-h-screen bg-white font-sans overflow-x-hidden text-gray-900">

//             {/* Navigation */}
//             <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
//                 <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
//                     <div className="text-2xl font-bold tracking-tight">
//                         DISCOVER <span className="text-[#FF541F]">AI</span>
//                     </div>
//                     <div className="hidden md:flex gap-10 items-center">
//                         {['Home', 'All tools', 'Contact us', 'About us', 'Subscriptions'].map((item, i) => (
//                             <a key={i} href="#" className={`text-sm font-medium transition-colors ${i === 0 ? 'text-[#FF541F] border-b-2 border-[#FF541F] pb-1' : 'text-gray-600 hover:text-[#FF541F]'}`}>
//                                 {item}
//                             </a>
//                         ))}
//                     </div>
//                     <div className="flex gap-3">
//                         <button onClick={() => navigate('/login')} className="px-6 py-2 bg-[#FF541F] text-white rounded-lg text-sm font-medium hover:bg-[#e0481a] transition">Login</button>
//                         <button onClick={() => navigate('/register')} className="px-6 py-2 border border-gray-300 text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Sign up</button>
//                     </div>
//                 </div>
//             </nav>

//             {/* Hero Section */}
//             <section className="relative pt-36 pb-20 px-6">
//                 <div className="absolute inset-0 max-w-[1400px] mx-auto h-full pointer-events-none">
//                     {/* PLACED IMPORTED BORDERS HERE */}
//                     <LeftSideHeroFaintBox />
//                     <CentralFaintOrangeBox />
//                     <RightSideHeroFaintBox />
//                 </div>

//                 <div className="max-w-5xl mx-auto text-center relative z-10">
//                     <div className="inline-flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-orange-50 to-white border border-orange-100 rounded-full mb-10 shadow-sm">
//                         <div className="flex -space-x-3">
//                             {[1,2,3,4,5].map(i => <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 border-2 border-white" />)}
//                         </div>
//                         <div className="text-left leading-none">
//                             <div className="text-[#FF541F] text-xs tracking-widest mb-1">★★★★★</div>
//                             <div className="text-xs font-bold text-[#FF541F]">115+ happy users</div>
//                         </div>
//                     </div>

//                     <h1 className="text-6xl md:text-8xl font-normal text-gray-900 mb-8 leading-[1.1]">
//                         Discover <span className="text-[#FF541F]">Smarter</span><br />
//                         Build Faster.
//                     </h1>

//                     <p className="text-xl text-gray-500 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
//                         Discover the right AI solutions faster. Our platform curates, organizes, 
//                         and simplifies the <span className="text-[#FF541F] font-medium">AI landscape</span> so you can focus on scaling.
//                     </p>

//                     <div className="flex flex-col sm:flex-row justify-center gap-5 mb-24">
//                         <button className="px-10 py-3.5 bg-[#FF541F] text-white rounded-xl text-lg font-medium shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition transform hover:-translate-y-0.5">Get Started</button>
//                         <button className="px-10 py-3.5 border border-gray-300 text-gray-900 rounded-xl text-lg font-medium hover:bg-gray-50 transition">See Details</button>
//                     </div>

//                     <h2 className="text-4xl md:text-6xl font-normal text-gray-900 mb-4">
//                         Built for Builders Driven by <span className="text-[#FF541F]">AI</span>
//                     </h2>
//                     <p className="text-lg text-gray-500 max-w-2xl mx-auto">
//                         Unlock the full potential of your creativity with our <span className="text-[#FF541F]">AI-powered</span> design assistant.
//                     </p>
//                 </div>
//             </section>

//             {/* Tools Section */}
//             <section className="py-16 px-6 md:px-12 relative">
//                 <div className="max-w-[1400px] mx-auto relative">
//                     {/* SIDE BORDERS IMPORTED HERE */}
//                     <TallSectionFaintBox side="left" />
//                     <TallSectionFaintBox side="right" />

//                     <div className="px-4 md:px-20">
//                         <h3 className="text-4xl font-normal text-gray-900 mb-16">
//                             Start exploring here <span className="text-[#FF541F]">👇</span>
//                         </h3>

//                         {toolCategories.map((cat, idx) => (
//                             <div key={idx} className="mb-16">
//                                 <div className="flex items-center gap-6 mb-8">
//                                     <h4 className="text-3xl text-[#FF541F] font-normal whitespace-nowrap">{cat.title}</h4>
//                                     <div className="h-px bg-[#FF541F]/20 flex-grow"></div>
//                                 </div>

//                                 {/* Responsive Grid: 1 col mobile -> 2 sm -> 3 md -> 4 lg -> 5 xl (Matches image) */}
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
//                                     {cat.tools.map((tool, tIdx) => (
//                                         <ToolCard key={tIdx} tool={tool} />
//                                     ))}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* Pricing Section */}
//             <section className="py-24 px-6 relative overflow-hidden">
//                 <div className="max-w-7xl mx-auto relative z-10">
//                     {/* BORDER IMPORTED HERE */}
//                     <RotatedCurvedBorder />

//                     <div className="text-center mb-20 max-w-3xl mx-auto">
//                         <h2 className="text-6xl font-normal text-gray-900 mb-6">
//                             Choose the <span className="text-[#FF541F]">Plan</span> That's Right
//                         </h2>
//                         <p className="text-xl text-gray-600 font-light">
//                             Upgrade to the <span className="text-[#FF541F] font-medium">Pro Plan</span> to unlock powerful AI capabilities.
//                         </p>
//                     </div>

//                     <div className="flex flex-col lg:flex-row items-center justify-center gap-0 max-w-6xl mx-auto">
//                         {/* Free Plan */}
//                         <div className="w-full lg:w-1/3 bg-[#1B1B1C] p-10 rounded-t-2xl lg:rounded-tr-none lg:rounded-l-3xl border border-white/10 h-auto lg:h-[520px] flex flex-col justify-between">
//                             <div>
//                                 <h3 className="text-xl text-white font-medium mb-2">Free</h3>
//                                 <p className="text-gray-400 text-sm mb-6">Essential features for starters.</p>
//                                 <div className="text-5xl text-white font-normal mb-8">$0<span className="text-lg text-gray-500 ml-2">/ mo</span></div>
//                                 <div className="h-px bg-gray-700 mb-6"></div>
//                                 <ul className="space-y-3 text-gray-300 text-sm font-light">
//                                     {['100 hours /month', 'Low-res downloads', 'Basic presets'].map(f => (
//                                         <li key={f} className="flex gap-3"><span>✓</span> {f}</li>
//                                     ))}
//                                 </ul>
//                             </div>
//                             <button className="w-full py-3 mt-8 rounded-lg bg-white/5 text-white border border-white/10 hover:bg-white/10 transition">Subscribe &gt;</button>
//                         </div>

//                         {/* Pro Plan */}
//                         <div className="w-full lg:w-1/3 bg-[#1B1B1C] p-10 rounded-2xl border-2 border-[#FF541F] relative z-20 transform lg:scale-110 shadow-[0_0_60px_rgba(255,84,31,0.4)] h-auto lg:h-[600px] flex flex-col justify-between">
//                             <div>
//                                 <h3 className="text-3xl text-[#FF541F] font-medium mb-2">Pro</h3>
//                                 <p className="text-gray-400 text-sm mb-6">Unlock personal productivity.</p>
//                                 <div className="flex items-baseline mb-8">
//                                     <span className="text-5xl text-white font-normal">$17</span>
//                                     <span className="text-lg text-gray-500 ml-2">/ mo</span>
//                                     <span className="ml-3 bg-[#FF541F] text-white text-[10px] font-bold px-2 py-1 rounded-full">-20%</span>
//                                 </div>
//                                 <div className="h-px bg-gray-700 mb-6"></div>
//                                 <ul className="space-y-4 text-gray-300 text-sm font-light">
//                                     {['10,000 hours /month', 'Enigma AI Access', 'High-res downloads', 'Multiple screens'].map(f => (
//                                         <li key={f} className="flex gap-3"><span className="text-[#FF541F]">✓</span> {f}</li>
//                                     ))}
//                                 </ul>
//                             </div>
//                             <button className="w-full py-4 mt-8 rounded-lg bg-[#FF541F] text-white font-medium hover:bg-[#e0481a] transition shadow-lg shadow-orange-500/40">Subscribe &gt;</button>
//                         </div>

//                         {/* Team Plan */}
//                         <div className="w-full lg:w-1/3 bg-[#1B1B1C] p-10 rounded-b-2xl lg:rounded-bl-none lg:rounded-r-3xl border border-white/10 h-auto lg:h-[520px] flex flex-col justify-between">
//                             <div>
//                                 <h3 className="text-xl text-white font-medium mb-2">Team</h3>
//                                 <p className="text-gray-400 text-sm mb-6">Supercharge your team.</p>
//                                 <div className="flex items-baseline mb-8">
//                                     <span className="text-5xl text-white font-normal">$37</span>
//                                     <span className="text-lg text-gray-500 ml-2">/ mo</span>
//                                     <span className="ml-3 bg-[#FF541F] text-white text-[10px] font-bold px-2 py-1 rounded-full">-20%</span>
//                                 </div>
//                                 <div className="h-px bg-gray-700 mb-6"></div>
//                                 <ul className="space-y-3 text-gray-300 text-sm font-light">
//                                     {['Everything in Free', 'Unlimited hours', 'Shared Quicklinks', 'Priority support'].map(f => (
//                                         <li key={f} className="flex gap-3"><span>✓</span> {f}</li>
//                                     ))}
//                                 </ul>
//                             </div>
//                             <button className="w-full py-3 mt-8 rounded-lg bg-white/5 text-white border border-white/10 hover:bg-white/10 transition">Subscribe &gt;</button>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* FAQ Section */}
//             <section className="py-24 px-6 relative">
//                 <div className="max-w-4xl mx-auto relative z-10">
//                     {/* BORDER IMPORTED HERE */}
//                     <RightCrescentBorder />

//                     <div className="text-center mb-16">
//                         <h2 className="text-5xl font-normal text-gray-900 mb-6">
//                             Frequently <span className="text-[#FF541F]">Asked</span> Questions
//                         </h2>
//                         <p className="text-xl text-gray-600 font-light">Got questions? We've got <span className="text-[#FF541F]">answers</span>.</p>
//                     </div>

//                     <div className="space-y-2">
//                         {[
//                             {q: "What is this platform used for?", a: "It's an AI-powered design assistant that helps you generate, customize, and export creative assets in seconds."},
//                             {q: "What happens if I hit my free generation limit?", a: "You will be prompted to upgrade your plan to continue generating. Alternatively, you can wait for your limit to reset."},
//                             {q: "Do I need tools experience to use it?", a: "No, our platform is designed to be user-friendly for both beginners and experienced professionals."},
//                             {q: "Can I collaborate with my team?", a: "Yes, our Team plan offers features specifically designed for team collaboration and shared workspaces."},
//                             {q: "Is it really free to use?", a: "Yes, we offer a Free plan with essential features to get you started."}
//                         ].map((item, index) => (
//                             <div key={index} className="border-b border-gray-200">
//                                 <button onClick={() => toggleFAQ(index)} className="w-full flex justify-between items-center py-6 text-left group">
//                                     <span className="text-2xl font-normal text-gray-900 group-hover:text-[#FF541F] transition-colors">{item.q}</span>
//                                     <span className={`text-[#FF541F] text-2xl transition-transform duration-300 ${openFAQ === index ? 'rotate-180' : ''}`}>▼</span>
//                                 </button>
//                                 <div className={`overflow-hidden transition-all duration-300 ${openFAQ === index ? 'max-h-40 pb-6' : 'max-h-0'}`}>
//                                     <p className="text-gray-600 text-lg font-light leading-relaxed">{item.a}</p>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* CTA Section with Exact Gradient */}
//             <section className="py-20 px-6">
//                 <div className="max-w-[1300px] mx-auto relative rounded-[40px] overflow-hidden py-24 text-center border border-white/20">
//                     {/* EXACT GRADIENT FROM FIGMA CSS */}
//                     <div 
//                         className="absolute inset-0 z-0"
//                         style={{
//                             background: 'radial-gradient(50% 60% at 50% 32.8%, rgba(255, 255, 255, 0.4) 7.35%, rgba(255, 84, 31, 0.32) 24.23%, rgba(247, 175, 153, 0.4) 36%, rgba(255, 84, 31, 0.4) 49.99%, rgba(0, 0, 0, 0) 100%)',
//                         }}
//                     />

//                     {/* Side borders for CTA if needed */}
//                     <div className="absolute left-0 top-0 h-full"><TallSectionFaintBox side="left" /></div>
//                     <div className="absolute right-0 top-0 h-full"><TallSectionFaintBox side="right" /></div>

//                     <div className="relative z-10">
//                         <h2 className="text-6xl font-normal text-gray-900 mb-6">Ready to Think Smarter?</h2>
//                         <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-10 font-light">
//                             Whether you're a freelancer, a team, or a growing agency—our tools adapt to your workflow. Design faster. Deliver better.
//                         </p>
//                         <button className="px-12 py-4 bg-[#FF541F] text-white rounded-xl text-xl font-medium hover:bg-[#e0481a] transition shadow-xl shadow-orange-500/30 flex items-center gap-2 mx-auto">
//                             Get Started <span className="text-sm">→</span>
//                         </button>
//                     </div>
//                 </div>
//             </section>

//             {/* Footer */}
//             <footer className="bg-gray-50 pt-20 pb-10 px-6 border-t border-gray-200">
//                 <div className="max-w-7xl mx-auto">
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
//                         <div className="col-span-1">
//                             <h4 className="text-3xl font-normal mb-6">About Us</h4>
//                             <p className="text-gray-500 leading-relaxed font-light text-lg">
//                                 We simplify AI by bringing the best tools together—helping you discover, compare, and adopt solutions.
//                             </p>
//                         </div>
//                         <div>
//                             <h4 className="text-xl font-normal text-[#FF541F] mb-6">Useful Links</h4>
//                             <ul className="space-y-3 text-gray-500 text-lg font-light">
//                                 <li>About</li><li>All tools</li><li>Contact us</li>
//                             </ul>
//                         </div>
//                         <div>
//                             <h4 className="text-xl font-normal text-[#FF541F] mb-6">Help</h4>
//                             <ul className="space-y-3 text-gray-500 text-lg font-light">
//                                 <li>Support</li><li>Terms</li><li>Privacy</li>
//                             </ul>
//                         </div>
//                         <div>
//                             <h4 className="text-xl font-normal text-[#FF541F] mb-6">Connect With Us</h4>
//                             <ul className="space-y-3 text-gray-500 text-lg font-light">
//                                 <li>Islamabad, Pakistan</li>
//                                 <li>+92 329 966 0890</li>
//                                 <li>discovery_ai@mail.com</li>
//                             </ul>
//                         </div>
//                     </div>
//                     <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
//                         <p className="text-[#FF541F]">© 2025 All Right Reserved.</p>
//                         <div className="flex gap-4">
//                             {['f', 'in', 'G', 'yt'].map((icon, i) => (
//                                 <div key={i} className="w-10 h-10 border-2 border-[#FF541F] text-[#FF541F] rounded-full flex items-center justify-center hover:bg-[#FF541F] hover:text-white transition cursor-pointer font-bold">
//                                     {icon}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </footer>
//         </div>
//     );
// };

// export default LandingPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Import Border Components and Pixel-Perfect Backgrounds ---
// NOTE: These components must be defined in your './BorderDesign' file.
// Using inline placeholder definitions for components imported from './BorderDesign'
const RoundedBoxBorder = () => <div className="absolute top-[2801px] left-[calc(50%-423.22px/2)] w-[423.22px] h-[226.26px] border-[23.45px] border-orange-400/50 rounded-[117px] rotate-90 z-0" style={{ transform: 'rotate(90deg)' }} />;
const LargeCircularBorder = () => <div className="absolute top-[3157px] right-[-339.49px] w-[445.49px] h-[445.49px] border-[23.45px] border-primary rounded-full z-0" />;
const FullHeightRoundedBorder = () => <div />;
const LeftSideHeroFaintBox = () => <div className="absolute w-[319px] h-[600px] left-[54px] top-[158px]  bg-primary/50 opacity-[0.35] rounded-xl z-0" />;
const RightSideHeroFaintBox = () => <div className="absolute w-[319px] h-[600.2px] left-[1068px] top-[158px]  bg-primary/50 opacity-[0.22] rounded-xl z-0" />;
const CentralFaintOrangeBox = () => <div className="absolute w-[319px] h-[553px] left-[561px] top-[158px]  bg-primary/50 opacity-[0.22] rounded-xl z-0" />;
const TallSectionFaintBox = ({ side, top, height }) => (
    <div className={`absolute w-[101px] h-[${height}px] ${side === 'left' ? 'left-[54px]' : 'left-[1284px]'} top-[${top}px] bg-primary/50 opacity-[0.35] rounded-xl z-0`} style={{ height: `${height}px`, top: `${top}px` }} />
);
const RotatedCurvedBorder = () => (
    <div className="absolute z-0 pointer-events-none" style={{
        boxSizing: 'border-box',
        width: '423.22px',
        height: '226.26px',
        left: '-220px',
        top: '3980px',
        border: '23.4471px solid #FF9777',
        borderRadius: '117.235px',
        transform: 'rotate(90deg)'
    }} />
);
const RightCrescentBorder = () => (
    <div className="absolute z-0 pointer-events-none" style={{
        boxSizing: 'border-box',
        width: '445.49px',
        height: '445.49px',
        right: '-380px',
        top: '4200px',
        border: '23.4471px solid #FF541F',
        borderRadius: '1172.35px',
    }} />
);

// --- Utility Constants (Mimicking CSS values for clarity) ---
const TEXT_ACCENT = 'text-primary';
const BG_ACCENT = 'bg-primary';
const TEXT_DARK = 'text-foreground';
const TEXT_MUTED = 'text-muted-foreground';

// --- Helper Components ---

/**
 * Renders a single tool card based on the Figma/design specifications.
 */
// const ToolCard = ({ tool }) => (
//     <div className="bg-white border border-border rounded-xl p-4 text-center shadow-lg transition duration-200"
//         style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.1)', background: '#F9F9F9', padding: '20px 15px' }}>

//         {/* Rating/User Buttons */}
//         <div className="flex justify-center items-center gap-2 mb-4">
//             <span className="bg-black/50 text-white text-[15px] font-bold px-2 py-0.5 rounded-md" style={{ padding: '4px 8px', borderRadius: '6px' }}>
//                 {tool.rating}
//             </span>
//             <span className="bg-black/50 text-white text-[15px] font-bold px-2 py-0.5 rounded-md" style={{ padding: '4px 8px', borderRadius: '6px' }}>
//                 {tool.users}
//             </span>
//             <div className="w-6 h-6 rounded-full bg-white border border-foreground shadow-md flex justify-center items-center">
//                 <span className="text-foreground text-sm">👍</span>
//             </div>
//         </div>

//         {/* Image Placeholder */}
//         <div className="w-[158px] h-[158px] bg-secondary border border-black/80 rounded-lg mx-auto mb-4" />

//         {/* Tool Name */}
//         <p className={`text-lg font-bold ${TEXT_DARK}`}>{tool.name}</p>

//         {/* Tool Description */}
//         <p className={`text-[14.4px] font-medium ${TEXT_ACCENT} mt-1`} style={{ lineHeight: '24px' }}>{tool.description}</p>

//         {/* Start Button */}
//         <button className={`${TEXT_ACCENT} text-sm font-semibold mt-4 py-1 px-4 border border-primary/20 rounded-full hover:bg-primary/5 transition`}>
//             start →
//         </button>
//     </div>
// );


const ToolCard = ({ tool }) => {
    // Helper function to create a unique, descriptive image URL
    // Replace this with actual image logic if toolCategoriesData included image URLs
    const getImagePlaceholderUrl = (toolName) => {
        // Simple sanitization for placeholder text (e.g., 'Automation tools' -> 'Automation')
        const shortName = toolName.split(' ')[0];
        // Using a service like placeholder.co for a dynamic text image
        return `https://placehold.co/158x158/F9F9F9/1F2937?text=${shortName}`;
    };

    return (
        <div className="bg-card border border-border rounded-xl p-4 text-center shadow-lg transition duration-200"
            style={{
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                background: '#F9F9F9',
                padding: '20px 15px',
                // Enforcing the width from your specs, though usually managed by the grid parent
                width: '160px',
            }}>

            {/* Rating/User Buttons */}
            <div className="flex justify-center items-center gap-2 mb-4">
                <span className="bg-black/50 text-white text-[15px] font-bold px-2 py-0.5 rounded-md" style={{ padding: '4px 8px', borderRadius: '6px' }}>
                    {tool.rating}
                </span>
                <span className="bg-black/50 text-white text-[15px] font-bold px-2 py-0.5 rounded-md" style={{ padding: '4px 8px', borderRadius: '6px' }}>
                    {tool.users}
                </span>
                <div className="w-6 h-6 rounded-full bg-white border border-foreground shadow-md flex justify-center items-center">
                    <span className="text-foreground text-sm">👍</span>
                </div>
            </div>

            {/* Image Placeholder */}
            {/* Using an <img> tag with a dynamic placeholder URL */}
            <img
                src={getImagePlaceholderUrl(tool.name)}
                alt={`${tool.name} icon`}
                className="w-[158px] h-[158px] border border-black/80 rounded-lg mx-auto mb-4 object-cover"
                style={{ width: '158px', height: '158px' }} // Enforcing explicit style
            />

            {/* Tool Name */}
            <p className={`text-lg font-bold ${TEXT_DARK}`}>{tool.name}</p>

            {/* Tool Description */}
            <p className={`text-[14.4px] font-medium ${TEXT_ACCENT} mt-1`} style={{ lineHeight: '24px' }}>{tool.description}</p>
        </div>
    );
};
/**
 * Renders a section containing a category title and multiple tool cards.
 */
const ToolsSection = ({ title, tools }) => (
    <div className="mb-14">
        {/* Title style: font-size: 26px; color: primary */}
        <h4 className={`text-[26px] font-normal mb-6 ${TEXT_ACCENT}`}>{title}</h4>

        {/* Tool grid layout (5 columns) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-7">
            {tools.map((tool, index) => (
                <ToolCard key={index} tool={tool} />
            ))}
        </div>

        {/* Line divider */}
        <div className="h-0.5 mt-8 w-full bg-black/10" />
    </div>
);

/**
 * Main Landing Page Component
 */
const LandingPage = () => {
    const navigate = useNavigate();
    const [openFAQ, setOpenFAQ] = useState(null);

    const LoginButtonHandler = () => navigate('/login');
    const SignupButtonHandler = () => navigate('/register');
    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    // --- Mock Data (As provided) ---
    const toolCategoriesData = [
        {
            title: "Automation tools",
            tools: [
                { name: "Automation tools", rating: "4.1", users: "19K", description: "Automates tasks and workflows" },
                { name: "Workflow Automation", rating: "4.1", users: "19K", description: "Eliminate repetitive manual tasks" },
                { name: "Process Optimization", rating: "4.1", users: "19K", description: "Streamline operations with intelligent systems" },
                { name: "AI Assistants", rating: "4.1", users: "19K", description: "Automate scheduling, communication" },
                { name: "Data handeling", rating: "4.1", users: "19K", description: "Auto-collect, clean, and organize information" },
            ]
        },
        {
            title: "Productivity tools",
            tools: [
                { name: "Productivity tools", rating: "4.4", users: "21K", description: "Helps you organize tasks and projects" },
                { name: "Workflow Automation", rating: "4.1", users: "19K", description: "Stay organized with smart to-do lists" },
                { name: "Collaboration Tools", rating: "4.1", users: "19K", description: "Work seamlessly across teams and projects" },
                { name: "Time Efficiency", rating: "4.1", users: "19K", description: "Prioritize tasks and minimize distractions." },
                { name: "Smart Integrations", rating: "4.1", users: "19K", description: "Connect apps and tools for smoother workflows" },
            ]
        },
        {
            title: "Creativity tools",
            tools: [
                { name: "Creativity tools", rating: "3.9", users: "18K", description: "Generates fresh ideas and designs" },
                { name: "Design Assistance", rating: "4.1", users: "19K", description: "Generate layouts, visuals, and design assets" },
                { name: "Content Generation", rating: "4.1", users: "19K", description: "Create blogs, copy, and social posts in seconds" },
                { name: "Brainstorming Tools", rating: "4.1", users: "19K", description: "Unlock fresh ideas and creative directions" },
                { name: "Multimedia Creation", rating: "4.1", users: "19K", description: "Produce AI-powered images & music" },
            ]
        },
        {
            title: "Business tools",
            tools: [
                { name: "Business tools", rating: "2.9", users: "17K", description: "Analyzes markets and trends" },
                { name: "Market Insights", rating: "2.9", users: "17K", description: "Analyze trends and customer behaviors" },
                { name: "Sales & Marketing", rating: "2.9", users: "17K", description: "Automate outreach, ads, and lead nurturing" },
                { name: "Decision Support", rating: "4.1", users: "19K", description: "Make smarter, data-driven choices" },
                { name: "Customer Engagement", rating: "4.1", users: "19K", description: "Enhance support with AI chatbots and tools" },
            ]
        },
        {
            title: "Educational tools",
            tools: [
                { name: "Educational tools", rating: "4.8", users: "29K", description: "Delivers personalized learning" },
                { name: "Learning Platforms", rating: "2.9", users: "17K", description: "Access personalized lessons and study aids" },
                { name: "AI Tutors", rating: "2.9", users: "17K", description: "Get instant help with explanations" },
                { name: "Skill Development", rating: "2.9", users: "17K", description: "Upskill in coding, design, and business" },
                { name: "Content Simplification", rating: "2.9", users: "17K", description: "Summarize and break down complex topics" },
            ]
        },
    ];

    const faqData = [
        {
            question: "What is this platform used for?",
            answer: "It’s an AI-powered design assistant that helps you generate, customize, and export creative assets in seconds—whether for personal projects, brand work, or commercial use.",
        },
        {
            question: "What happens if I hit my free generation limit?",
            answer: "You will be prompted to upgrade your plan to continue generating. Alternatively, you can wait for your limit to reset.",
        },
        {
            question: "Do I need tools experience to use it?",
            answer: "No, our platform is designed to be user-friendly for both beginners and experienced professionals.",
        },
        {
            question: "Can I collaborate with my team?",
            answer: "Yes, our Team plan offers features specifically designed for team collaboration and shared workspaces.",
        },
        {
            question: "Is it really free to use?",
            answer: "Yes, we offer a Free plan with essential features to get you started.",
        },
    ];

    return (
        // Increased container height to prevent clipping due to lower positioned sections (5800px)
        <div className="font-sans relative bg-background " style={{ width: '1460px', margin: '0 auto', height: '6200px' }}>

            {/* --- ABSOLUTE GLOBAL BACKGROUND ELEMENTS (Z-index 0) --- */}

            {/* Hero Section Background Faint Boxes (Top: 158px) */}
            <LeftSideHeroFaintBox />
            <CentralFaintOrangeBox />
            <RightSideHeroFaintBox />

            {/* Tools Section Tall Faint Boxes (Top: 989px, Height: 4000px) */}
            <TallSectionFaintBox side="left" top={989} height={2900} />
            <TallSectionFaintBox side="right" top={989} height={2900} />

            {/* Plans Section Rotated Curved Border (Top: 2801px) */}
            <RotatedCurvedBorder />

            {/* Plans/FAQ Right Crescent Border (Global Position) */}
            <RightCrescentBorder />

            {/* Ellipse 854 - Large Blurred Orange Circle (Top: 3157px) */}
            <div className="absolute z-0 pointer-events-none" style={{
                width: '940px', height: '983px', left: '745px', top: '3157px',
                background: 'conic-gradient(from 180deg at 50% 50%, #FB1E1E 0deg, #FA5424 84.77deg, #C22C00 183.8deg, #982300 271.91deg, #FB1E1E 360deg)',
                filter: 'blur(200px)', opacity: 0.1
            }} />

            {/* Bottom Tall Faint Boxes (Top: 4024px, Height: 1060px) */}
            <TallSectionFaintBox side="left" top={5000} height={1060} />
            <TallSectionFaintBox side="right" top={5000} height={1060} />
            {/* ----------------------------------------------------------------- */}

            {/* ## Navigation Bar */}
            <nav className="flex justify-between items-center bg-card top-0 px-8 py-5" // Removed left/transform styles
                style={{
                    width: '98%',
                    boxSizing: 'border-box'
                }}>
                {/* Logo */}
                <div className={`font-bold flex items-center gap-2 text-[21px] ${TEXT_DARK}`} style={{ fontWeight: '700' }}>
                    <div className="w-[25.04px] h-[25.04px] rounded-full border flex justify-center items-center text-xs font-bold"
                        style={{ borderColor: TEXT_ACCENT, color: TEXT_ACCENT, borderWidth: '2px' }}>
                        <span className='-mt-0.5' style={{ color: TEXT_ACCENT }}>⚛</span>
                    </div>
                    <span>DISCOVER </span>
                    <span className={TEXT_ACCENT}>AI</span>
                </div>

                {/* Links */}
                <div className="flex items-center gap-8">
                    <div className="flex flex-col items-center">
                        <a href="#" className={`font-normal pb-1 ${TEXT_ACCENT}`} style={{ fontSize: '22px' }}>Home</a>
                        <div className='w-full h-[2px] bg-primary' style={{ borderRadius: '1.5px' }}></div>
                    </div>
                    {['All tools', 'Contact us', 'About us', 'Subscriptions'].map((link, index) => (
                        <a key={index} href="#" className={`font-normal ${TEXT_DARK} hover:${TEXT_ACCENT} transition`} style={{ fontSize: '22px' }}>{link}</a>
                    ))}
                </div>

                {/* Auth Buttons */}
                <div className="flex gap-4 items-center">
                    <button className={`bg-card border ${TEXT_DARK} rounded-xl text-lg font-medium cursor-pointer hover:bg-secondary transition`}
                        onClick={LoginButtonHandler} style={{ padding: '15px 35px', borderWidth: '1px', borderRadius: '10px', borderColor: TEXT_DARK, fontSize: '20px' }}>Login</button>
                    <button className={`${BG_ACCENT} text-primary-foreground rounded-xl text-lg font-medium cursor-pointer hover:bg-primary/90 transition`}
                        onClick={SignupButtonHandler} style={{ padding: '15px 35px', borderRadius: '10px', fontSize: '20px' }}>Sign up</button>
                </div>
            </nav>

            {/* ## Hero Section */}
            <section className="absolute w-[1129px] bg-background rounded-xl z-10" style={{ left: '155px', top: '214px' }}>
                <div className="text-center w-full pt-[54px] pb-[70px]">

                    {/* User Reviews Badge */}
                    <div className="flex items-center justify-center gap-[13.2px] mb-8 mx-auto w-max"
                        style={{ padding: '15px 23.5px', background: 'rgba(255, 107, 59, 0.1)', border: '0.94px solid rgba(255, 255, 255, 0.15)', borderRadius: '50.89px' }}>

                        <div className="flex -space-x-2 overflow-hidden w-[151.84px] h-[45.33px] items-center justify-center">
                            {[1, 2, 3, 4, 5].map(i => (
                                <img key={i} src={`https://via.placeholder.com/30?text=U${i}`} alt={`User ${i}`}
                                    className="w-8 h-8 rounded-full ring-2 ring-white object-cover"
                                    style={{ width: '45.33px', height: '45.33px', margin: 0, marginLeft: i > 1 ? '-10px' : '0' }} />
                            ))}
                        </div>

                        <div className="flex flex-col h-[42.14px] items-start justify-center">
                            <div className="text-yellow-500 text-base flex">
                                <span className="text-[15.86px] h-[15.86px]">★★★★★</span>
                            </div>
                            <div className={`text-[16.8px] ${TEXT_ACCENT} font-normal`} style={{ letterSpacing: '-0.36px' }}>
                                115+ happy users
                            </div>
                        </div>
                    </div>

                    {/* Main Title */}
                    <h1 className={`${TEXT_DARK} font-normal text-[80px] leading-[88px] mb-4`} style={{ width: '1129px' }}>
                        Discover <span className={TEXT_ACCENT}>Smarter</span><br />Build Faster.
                    </h1>

                    {/* Description */}
                    <p className={`text-[22px] ${TEXT_MUTED} font-normal mx-auto mb-10`} style={{ width: '681px' }}>
                        Discover the right AI solutions faster. Our platform curates, organizes,
                        and simplifies the <span className={TEXT_ACCENT}>AI landscape</span> so you can focus on what matters—scaling smarter.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex justify-center gap-[23px]">
                        <button className={`${BG_ACCENT} py-2 text-primary-foreground rounded-xl text-[20px] font-normal cursor-pointer hover:bg-primary/90 transition`}
                            style={{ width: '180px', height: '50px', borderRadius: '10px' }}>
                            Get Started
                        </button>
                        <button className={`bg-card border py-2 ${TEXT_DARK} rounded-xl text-[20px] font-normal cursor-pointer hover:bg-secondary transition`}
                            style={{ width: '180px', height: '50px', borderWidth: '1px', borderRadius: '10px', borderColor: TEXT_DARK }}>
                            See Details
                        </button>
                    </div>

                    {/* Secondary Headline */}
                    <h2 className={`${TEXT_DARK} font-normal text-[64px] leading-[70px] mt-[100px] mb-2`}>Built for Builders Driven by <span className={TEXT_ACCENT}>AI</span></h2>

                    {/* Secondary Description */}
                    <p className={`${TEXT_MUTED} text-[18px] font-normal mx-auto`} style={{ width: '661px' }}>
                        Unlock the full potential of your creativity with our <span className={TEXT_ACCENT}>AI-powered</span> design assistant.
                        Discover smarter tools, explore fresh ideas, and design with confidence.
                    </p>
                </div>
            </section>

            {/* --- */}

            {/* ## Tools Section */}
            <section id="tools-section" className="absolute w-full px-20 z-10" style={{ left: '0px', top: '979px', padding: '0 174px' }}>
                <h3 className={`${TEXT_DARK} font-normal text-[38px] mb-12`} style={{ width: '822px' }}>
                    Start exploring here <span className={TEXT_ACCENT} role="img" aria-label="pointing finger">👇</span>
                </h3>

                {/* All Tool Categories */}
                {toolCategoriesData.map((category, index) => (
                    <ToolsSection key={index} title={category.title} tools={category.tools} />
                ))}
            </section>

            {/* --- */}

            {/* ## Pricing Plans Section */}
            {/* FINAL ADJUSTMENT: top: 3200px */}
            <section className="absolute w-[1199.34px] z-10" style={{ left: '120px', top: '3880px' }}>
                <div className="flex flex-col items-center gap-[45px]">
                    {/* Header */}
                    <div className="flex flex-col items-center gap-[20px] w-[780px]">
                        <h2 className={`${TEXT_DARK} font-normal text-[64px] leading-[77px] text-center`} style={{ width: '600px' }}>
                            Choose the <span className={TEXT_ACCENT}>Plan</span> That's Right for You
                        </h2>
                        <p className={`${TEXT_DARK} text-[20px] leading-[24px] text-center`} style={{ width: '780px' }}>
                            Giving you access to essential features and many creative tools. Upgrade to the <span className={TEXT_ACCENT}>Pro Plan</span> to unlock powerful <span className={TEXT_ACCENT}>AI capabilities</span>, cloud syncing, and a whole new level of creative freedom.
                        </p>
                    </div>

                    {/* Plan Cards Container */}
                    <div className="flex justify-center w-full gap-0">
                        {/* Free Plan Card */}
                        <div className="flex flex-col items-center p-[20px] gap-[35px] pro-plan-card "
                            style={{ width: '399.78px', height: '550px', borderRadius: '20px 0px 0px 20px', transform: 'scale(1)', color: '#CCCCCC' }}>
                            <div className="flex flex-col items-start gap-[24px] px-[32px] w-full">
                                <h3 className="text-[18px] text-white font-normal">Free</h3>
                                <p className="text-footer-text/75 leading-[24px]">Everything you need to supercharge your productivity.</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-[40px] text-white font-normal leading-[48px] tracking-[-0.04em]">$0</p>
                                    <span className="text-[16px] text-footer-text/75 leading-[24px] font-normal">/ month</span>
                                </div>
                            </div>
                            <div className="w-full h-px bg-white/20" style={{ background: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0) 100%)' }} />
                            <div className="flex flex-col items-start gap-[15px] px-[32px] w-full">
                                <h4 className="text-[16px] text-footer-text/75 font-normal">Included features</h4>
                                <ul className="flex flex-col gap-[14px] w-full">
                                    {['100 hours /month', 'Low-res downloads', 'Basic style presets', 'Limited customization options'].map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-[16px] text-footer-text/75 font-normal">
                                            <span className="text-white/80">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button className={`flex items-center px-5 py-[10px] gap-3 text-white rounded-lg font-normal text-[18px] transition hover:opacity-90`}
                                style={{
                                    background: '#c95b30ff', // Dark reddish-brown background color
                                    boxShadow: '0 0 10px rgba(255, 107, 59, 0.4), 0 0 20px rgba(255, 107, 59, 0.4)', // Orange glow
                                    border: '1px solid rgba(255, 107, 59, 0.4)', // Subtle edge definition
                                    borderRadius: '8px',
                                }}>
                                Subscribe &gt;
                            </button>
                        </div>

                        {/* Pro Plan Card - Highlighted */}
                        <div className="flex flex-col items-center p-[20px] gap-[35px] pro-plan-card border-[3px] border-primary z-20"
                            style={{ width: '400px', height: '623px', borderRadius: '20px', marginTop: '-45px', marginBottom: '-45px' }}>
                            <div className="flex flex-col items-start gap-[24px] px-[32px] w-full">
                                <h3 className={`${TEXT_ACCENT} text-[30px] font-normal leading-[36px]`}>Pro</h3>
                                <p className="text-[16px] text-footer-text/75 leading-[24px]">Unlock a new level of your personal productivity.</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-[40px] text-white font-normal leading-[48px] tracking-[-0.04em]">$17</p>
                                    <span className="text-[16px] text-footer-text/75 leading-[24px] font-normal">/ month</span>
                                    <span className={`${BG_ACCENT} text-white text-[12px] px-2 py-[5px] rounded-full`} style={{ borderRadius: '24px' }}>-20%</span>
                                </div>
                            </div>
                            <div className="w-full h-px bg-white/20" style={{ background: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0) 100%)' }} />
                            <div className="flex flex-col items-start gap-[15px] px-[32px] w-full">
                                <h4 className="text-[16px] text-footer-text/75 font-normal">Included features</h4>
                                <ul className="flex flex-col gap-[14px] w-full">
                                    {['10,000 hours /month (Free tools)', 'Enigma AI', '2,000 hours /month (Premium tools)', 'Multiple screens', '2 Mobile, 1 Desktop and 1 ipad'].map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-[16px] text-footer-text/75 font-normal">
                                            <span className={`${TEXT_ACCENT}`}>✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button className={`flex items-center px-5 py-[10px] gap-3 text-white rounded-lg font-normal text-[18px] transition hover:opacity-90`}
                                style={{
                                    background: '#c95b30ff', // Dark reddish-brown background color
                                    boxShadow: '0 0 10px rgba(255, 107, 59, 0.4), 0 0 20px rgba(255, 107, 59, 0.4)', // Orange glow
                                    border: '1px solid rgba(255, 107, 59, 0.4)', // Subtle edge definition
                                    borderRadius: '8px',
                                }}>
                                Subscribe &gt;
                            </button>
                        </div>

                        {/* Team Plan Card */}
                        <div className="flex flex-col items-center p-[20px] gap-[35px] pro-plan-card"
                            style={{ width: '399.78px', height: '550px', borderRadius: '0px 20px 20px 0px', transform: 'scale(1)', color: '#CCCCCC' }}>
                            <div className="flex flex-col items-start gap-[24px] px-[32px] w-full">
                                <h3 className="text-[18px] text-white font-normal">Team</h3>
                                <p className="text-footer-text/75 leading-[24px]">Everything you need to supercharge your productivity.</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-[40px] text-white font-normal leading-[48px] tracking-[-0.04em]">$37</p>
                                    <span className="text-[16px] text-footer-text/75 leading-[24px] font-normal">/ month</span>
                                    <span className={`${BG_ACCENT} text-white text-[12px] px-2 py-[5px] rounded-full`} style={{ borderRadius: '24px' }}>-20%</span>
                                </div>
                            </div>
                            <div className="w-full h-px bg-white/20" style={{ background: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0) 100%)' }} />
                            <div className="flex flex-col items-start gap-[15px] px-[32px] w-full">
                                <h4 className="text-[16px] text-footer-text/75 font-normal">Included features</h4>
                                <ul className="flex flex-col gap-[14px] w-full">
                                    {['Everything in Free', 'Unlimited hours /month ()', 'Unlimited Shared Quicklinks', 'Priority support'].map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-[16px] text-footer-text/75 font-normal">
                                            <span className="text-white/80">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button className={`flex items-center px-5 py-[10px] gap-3 text-white rounded-lg font-normal text-[18px] transition hover:opacity-90`}
                                style={{
                                    background: '#c95b30ff', // Dark reddish-brown background color
                                    boxShadow: '0 0 10px rgba(255, 107, 59, 0.4), 0 0 20px rgba(255, 107, 59, 0.4)', // Orange glow
                                    border: '1px solid rgba(255, 107, 59, 0.4)', // Subtle edge definition
                                    borderRadius: '8px',
                                }}>
                                Subscribe &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- */}

            {/* ## FAQ Section */}
            {/* FINAL ADJUSTMENT: top: 4100px */}
            <section className="absolute w-[891.99px] z-10" style={{ left: '274px', top: '4800px' }}>
                <div className="flex flex-col items-center gap-[76px]">
                    {/* Header */}
                    <div className="flex flex-col items-center gap-[29px] w-[830px]">
                        <h2 className={`${TEXT_DARK} font-normal text-[64px] leading-[77px] text-center`} style={{ width: '555.71px' }}>
                            Frequently <span className={TEXT_ACCENT}>Asked</span> Questions
                        </h2>
                        <p className={`${TEXT_DARK} text-[24px] leading-[29px] text-center`} style={{ width: '830px' }}>
                            Got questions? We've got <span className={TEXT_ACCENT}>answers</span>. Find everything you need to know about using our platform, <span className={TEXT_ACCENT}>plans</span>, and <span className={TEXT_ACCENT}>features</span>.
                        </p>
                    </div>

                    {/* FAQ-Content */}
                    <div className="w-full">
                        {faqData.map((item, index) => (
                            <div key={index}
                                className="border-b border-black/5"
                                style={{ borderBottom: '1.19px solid rgba(0, 0, 0, 0.1)' }}>
                                <div className="flex justify-between items-start cursor-pointer p-[23.85px] hover:bg-secondary transition" onClick={() => toggleFAQ(index)}>
                                    <div className={`${TEXT_DARK} text-[24px] font-normal leading-[29px] flex items-center`}>
                                        {/* Dynamic Span Replacement Logic */}
                                        {item.question.split(' ').map((word, i) => (
                                            <React.Fragment key={i}>
                                                {(word.includes('platform') || word.includes('limit') || word.includes('tools') || word.includes('collaborate') || word.includes('free')) ? (
                                                    <span className={TEXT_ACCENT}>
                                                        {word}
                                                    </span>
                                                ) : (
                                                    <span>{word}</span>
                                                )}
                                                {i < item.question.split(' ').length - 1 && <span>&nbsp;</span>}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                    <span className={`${TEXT_ACCENT} text-[28.62px] transition-transform duration-300 ${openFAQ === index ? 'rotate-180' : 'rotate-0'}`}>
                                        <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.155 11.232L14.31 18.387L21.465 11.232" stroke={openFAQ === index ? "#FF6B3B" : "#000000"} strokeWidth="1.78876" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </div>
                                {openFAQ === index && (
                                    <div className={`${TEXT_MUTED} text-[24px] font-normal leading-[24px] p-[23.85px] pt-0`} style={{ letterSpacing: '-0.059px' }}>
                                        {item.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- */}

            {/* ## Call to Action Section (CTA-Section) */}
            {/* FINAL ADJUSTMENT: top: 4950px */}
            <section className="absolute w-[1394px] h-[450.38px] z-10" style={{ left: 'calc(58% - 1394px/2)', top: '5600px' }}>
                {/* Background Gradient/Blur (Frame 1707480369) */}
                <div className="absolute inset-0 z-0"
                    style={{
                        left: '-45px', top: '0px', width: '1319px', height: '595px',
                        background: 'radial-gradient(50% 60% at 50% 32.8%, rgba(255, 255, 255, 0.4) 7.35%, rgba(255, 107, 59, 0.32) 24.23%, rgba(247, 175, 153, 0.4) 36%, rgba(255, 107, 59, 0.4) 49.99%, rgba(0, 0, 0, 0) 100%)',
                        borderRadius: '10px'
                    }} />

                {/* Content (Frame 1707480368) */}
                <div className="flex flex-col items-center gap-[35px] absolute w-[745px] h-[242px] z-10"
                    style={{ left: 'calc(45% - 745px/2)', top: '100px' }}>

                    <h2 className={`${TEXT_DARK} font-normal text-[64px] leading-[77px] text-center`} style={{ width: '789px' }}>
                        Ready to Think Smarter?
                    </h2>
                    <p className={`${TEXT_MUTED} text-[20px] leading-[22px] text-center`} style={{ width: '618px' }}>
                        Whether you’re a freelancer, a team, or a growing agency—our tools
                        adapt to your workflow. Design faster. Deliver better.
                    </p>
                    <button className={`${BG_ACCENT} text-white rounded-xl text-[20px] font-normal cursor-pointer hover:bg-primary/90 transition flex items-center justify-center gap-[12px]`}
                        style={{ padding: '15px 34px', width: '202px', height: '50px', borderRadius: '10px' }}>
                        Get Started →
                    </button>
                </div>
            </section>


            {/* --- */}

            {/* ## Footer */}
            {/* FINAL ADJUSTMENT: top: 5350px */}
            <footer className="absolute w-[1479px] h-[434px] bg-footer-bg pt-[66px] px-[101px] z-10" style={{ left: 'calc(50% - 1479px/2)', top: '6100px', color: '#CCCCCC' }}>
                <div className="grid grid-cols-4 gap-10 w-full">
                    {/* About Us (Content 1) */}
                    <div style={{ width: '307.34px' }}>
                        <h4 className={`${TEXT_DARK} font-normal text-[32px] mb-[15px]`} style={{ letterSpacing: '-0.95px', color: '#FFFFFF' }}>About Us</h4>
                        <p className={`text-footer-text text-[18px] leading-[27px] font-normal`}>
                            We simplify AI by bringing the best tools together—helping you discover, compare, and adopt solutions that drive smarter work and faster innovation.
                        </p>
                    </div>
                    {/* Useful Links (Content 2) */}
                    <div>
                        <h4 className={`${TEXT_ACCENT} font-normal text-[24px] mb-[23px]`} style={{ letterSpacing: '-0.47px' }}>Useful Links</h4>
                        <div className="flex flex-col gap-[15.27px]">
                            {['About', 'All tools', 'About us', 'Contact us'].map((link, i) => (
                                <a key={i} href="#" className={`text-footer-text text-[18px] leading-[27px] hover:${TEXT_ACCENT} transition`}>{link}</a>
                            ))}
                        </div>
                    </div>
                    {/* Help (Content 4) */}
                    <div>
                        <h4 className={`${TEXT_ACCENT} font-normal text-[24px] mb-[23px]`} style={{ letterSpacing: '-0.47px' }}>Help</h4>
                        <div className="flex flex-col gap-[15.27px]">
                            {['Customer Support', 'Terms & Conditions', 'Privacy Policy', 'Contact Us'].map((link, i) => (
                                <a key={i} href="#" className={`text-footer-text text-[18px] leading-[27px] hover:${TEXT_ACCENT} transition`}>{link}</a>
                            ))}
                        </div>
                    </div>
                    {/* Connect With Us (Content 3) */}
                    <div>
                        <h4 className={`${TEXT_ACCENT} font-normal text-[24px] mb-[23px]`} style={{ letterSpacing: '-0.47px' }}>Connect With Us</h4>
                        <div className="flex flex-col gap-[22.91px]">
                            <p className={`text-footer-text text-[18px] leading-[27px] font-normal`}>Pakistan, Islamabad, I-9/3 <br /> java chowk, street# 05</p>
                            <p className={`text-footer-text text-[18px] leading-[27px] font-normal`}>+92 329 966 0890</p>
                            <p className={`text-footer-text text-[18px] leading-[27px] font-normal`}>discovery_ai@mail.com</p>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="mt-[40px] pt-6 border-t border-primary/30 flex justify-between items-center" style={{ width: '1237px', borderColor: '#FF6B3B50' }}>
                    <p className={`${TEXT_ACCENT} text-[18px] leading-[27px] font-normal`}>© 2025 All Right Reserved.</p>
                    <div className="flex gap-[7.64px]">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-[30.54px] h-[30.54px] border border-primary rounded-full flex justify-center items-center text-sm text-primary hover:bg-primary hover:text-white transition cursor-pointer">
                                <span className='font-bold'>{i === 1 ? 'f' : i === 2 ? 'in' : i === 3 ? 'G' : 'yt'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;