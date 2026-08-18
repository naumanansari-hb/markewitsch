import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  Mail,
  Clock,
  ArrowRight,
  ClipboardList,
  Users,
  Euro,
} from "lucide-react";
import engineersImg from "../../../assets/markewitsch_engineers.jpg";
import logoImg from "../../../assets/markewitsch_logo.png";

interface LandingPageProps {
  onStartInquiry: (initialCraneId?: string, initialMode?: "direct" | "map") => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartInquiry }) => {
  const [activeTab, setActiveTab] = useState<"crane-finder" | "site-visit">("crane-finder");
  const [siteVisitForm, setSiteVisitForm] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    notes: "",
  });

  const siteVisitRef = useRef<HTMLDivElement>(null);
  const isClickScrolling = useRef(false);

  // Scroll listener and IntersectionObserver for responsive tab indicator
  useEffect(() => {
    const handleScroll = () => {
      if (isClickScrolling.current) return;
      const siteSection = document.getElementById("site-visit-section");
      if (siteSection) {
        const rect = siteSection.getBoundingClientRect();
        // If site visit section top is within top half of the screen
        if (rect.top <= window.innerHeight * 0.45) {
          setActiveTab("site-visit");
        } else {
          setActiveTab("crane-finder");
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSiteVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you! Your site visit request has been sent to our technical engineering team.");
    setSiteVisitForm({ fullName: "", company: "", email: "", phone: "", notes: "" });
  };

  const scrollToSiteVisit = () => {
    setActiveTab("site-visit");
    isClickScrolling.current = true;
    const el = document.getElementById("site-visit-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setTimeout(() => {
      isClickScrolling.current = false;
    }, 800);
  };

  const scrollToCraneFinder = () => {
    setActiveTab("crane-finder");
    isClickScrolling.current = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      isClickScrolling.current = false;
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-900 font-sans flex flex-col">
      {/* Header Bar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="cursor-pointer flex items-center py-1" onClick={scrollToCraneFinder}>
              <img
                src={logoImg}
                alt="Gebr Markewitsch Kran · Transport · Montage · Industrieservice"
                className="h-14 sm:h-16 md:h-18 w-auto object-contain"
              />
            </div>

            {/* Right Navigation */}
            <div className="flex items-center space-x-6 sm:space-x-8">
              {/* 2 Tabs with active red underline */}
              <div className="flex items-center space-x-6 relative">
                <button
                  type="button"
                  onClick={scrollToCraneFinder}
                  className={`relative py-3 text-xs font-bold transition-all ${
                    activeTab === "crane-finder"
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <span>Crane Finder</span>
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8102E] rounded-full transition-transform duration-300 ${
                      activeTab === "crane-finder" ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={scrollToSiteVisit}
                  className={`relative py-3 text-xs font-bold transition-all ${
                    activeTab === "site-visit"
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <span>Site Visit</span>
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8102E] rounded-full transition-transform duration-300 ${
                      activeTab === "site-visit" ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                    }`}
                  />
                </button>
              </div>

              <button
                type="button"
                onClick={() => onStartInquiry(undefined, "direct")}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-[#C8102E] text-white text-xs font-bold hover:bg-[#a60d25] transition-all shadow-2xs active:scale-98"
              >
                <span>Start crane inquiry</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1340px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Title Header */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            The right crane for every lift.
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl font-normal leading-relaxed">
            Fast, reliable crane recommendations and pricing guidance—<br className="hidden sm:inline" />
            backed by Markewitsch expertise.
          </p>
        </div>

        {/* Two Main Entry Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Quick crane suggestion (Direct Planner flow) */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-8 shadow-2xs hover:shadow-md transition-all flex items-center space-x-6">
            {/* Pink Icon Circle */}
            <div className="w-24 h-24 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0 p-4">
              <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none">
                <rect x="8" y="40" width="36" height="10" rx="2" fill="#FFFFFF" stroke="#374151" strokeWidth="2" />
                <circle cx="16" cy="52" r="4" fill="#111827" stroke="#374151" strokeWidth="2" />
                <circle cx="26" cy="52" r="4" fill="#111827" stroke="#374151" strokeWidth="2" />
                <circle cx="36" cy="52" r="4" fill="#111827" stroke="#374151" strokeWidth="2" />
                <line x1="8" y1="50" x2="4" y2="50" stroke="#C8102E" strokeWidth="2" />
                <line x1="44" y1="50" x2="48" y2="50" stroke="#C8102E" strokeWidth="2" />
                <line x1="16" y1="40" x2="52" y2="18" stroke="#C8102E" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="28" y1="33" x2="52" y2="18" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
                <line x1="52" y1="18" x2="52" y2="34" stroke="#374151" strokeWidth="1.5" strokeDasharray="2 2" />
                <rect x="48" y="34" width="8" height="12" fill="#FFFFFF" stroke="#C8102E" strokeWidth="2" rx="1" />
              </svg>
            </div>

            {/* Text & Button */}
            <div className="space-y-3 flex-1">
              <h2 className="text-xl font-bold text-gray-900">Quick crane suggestion</h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                Answer a few questions about your lift and get 3 tailored crane suggestions.
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => onStartInquiry(undefined, "direct")}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-[#C8102E] text-white text-xs font-bold hover:bg-[#a60d25] transition-all shadow-2xs active:scale-98"
                >
                  <span>Start crane inquiry</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Plan the lift on a map (Map Planner flow) */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-8 shadow-2xs hover:shadow-md transition-all flex items-center space-x-6">
            {/* Pink Icon Circle */}
            <div className="w-24 h-24 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0 p-4">
              <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none">
                <path d="M12 18L24 12L40 20L52 14V46L40 52L24 44L12 50V18Z" fill="#FFFFFF" stroke="#374151" strokeWidth="2" strokeLinejoin="round" />
                <line x1="24" y1="12" x2="24" y2="44" stroke="#D1D5DB" strokeWidth="1.5" />
                <line x1="40" y1="20" x2="40" y2="52" stroke="#D1D5DB" strokeWidth="1.5" />
                <path d="M32 16C27.5817 16 24 19.5817 24 24C24 31 32 38 32 38C32 38 40 31 40 24C40 19.5817 36.4183 16 32 16Z" fill="#C8102E" stroke="#990B21" strokeWidth="1.5" />
                <circle cx="32" cy="24" r="3" fill="#FFFFFF" />
              </svg>
            </div>

            {/* Text & Button */}
            <div className="space-y-3 flex-1">
              <h2 className="text-xl font-bold text-gray-900">Plan the lift on a map</h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                Use an interactive map to define your lift location and site conditions.
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => onStartInquiry(undefined, "map")}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-xs font-bold hover:bg-gray-50 transition-all shadow-2xs active:scale-98"
                >
                  <span>Open map planner</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Card: How crane inquiry works */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-8 shadow-2xs space-y-8">
          <h2 className="text-xl font-bold text-gray-900 text-center">
            How crane inquiry works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="hidden lg:block absolute top-10 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-gray-200 z-0" />

            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-3 relative z-10">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-[#C8102E]">
                  <ClipboardList className="w-7 h-7" />
                </div>
                <div className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-[#C8102E] text-white text-[11px] font-bold flex items-center justify-center shadow-2xs">
                  1
                </div>
              </div>
              <h3 className="text-sm font-bold text-gray-900">Provide lift details</h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">
                Share your lift requirements or plan on the map.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-3 relative z-10">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-[#C8102E]">
                  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="7" y="3" width="10" height="4" rx="1" fill="currentColor" opacity="0.2" />
                    <line x1="12" y1="7" x2="12" y2="12" />
                    <path d="M12 12C12 15 9 15 9 17.5C9 19.5 10.5 21 12.5 21C14.5 21 16 19.5 16 17.5" />
                  </svg>
                </div>
                <div className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-[#C8102E] text-white text-[11px] font-bold flex items-center justify-center shadow-2xs">
                  2
                </div>
              </div>
              <h3 className="text-sm font-bold text-gray-900">Get 3 crane suggestions</h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">
                We provide three suitable crane recommendations for your lift.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-3 relative z-10">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-[#C8102E]">
                  <Euro className="w-7 h-7" />
                </div>
                <div className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-[#C8102E] text-white text-[11px] font-bold flex items-center justify-center shadow-2xs">
                  3
                </div>
              </div>
              <h3 className="text-sm font-bold text-gray-900">See indicative pricing</h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">
                Receive transparent price ranges to plan your project with confidence.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center space-y-3 relative z-10">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-[#C8102E]">
                  <Users className="w-7 h-7" />
                </div>
                <div className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-[#C8102E] text-white text-[11px] font-bold flex items-center justify-center shadow-2xs">
                  4
                </div>
              </div>
              <h3 className="text-sm font-bold text-gray-900">Reviewed by our team</h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">
                Our experts review your inquiry and share a detailed quotation.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Card: Need expert advice? */}
        <div id="site-visit-section" ref={siteVisitRef} className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Half */}
            <div className="lg:col-span-5 p-8 relative flex flex-col justify-between overflow-hidden bg-slate-900 text-white min-h-[420px]">
              <img
                src={engineersImg}
                alt="Gebr Markewitsch Engineers"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />

              <div className="relative z-10 space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  Need expert advice? <br />
                  We're here to help.
                </h2>
                <p className="text-xs text-gray-300 leading-relaxed max-w-sm">
                  For complex lifts or on-site assessments, our team visits your location and supports you from planning to execution.
                </p>
              </div>

              <div className="relative z-10 space-y-2.5 pt-6 text-xs text-gray-200 font-medium">
                <div className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-[#C8102E] shrink-0" />
                  <a href="tel:+49232498760" className="hover:underline">+49 2324 9876-0</a>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-[#C8102E] shrink-0" />
                  <a href="mailto:info@markewitsch.de" className="hover:underline">info@markewitsch.de</a>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Clock className="w-4 h-4 text-[#C8102E] shrink-0" />
                  <span>Mon–Fri: 07:00 – 17:00 CET</span>
                </div>
              </div>
            </div>

            {/* Right Half: Form */}
            <div className="lg:col-span-7 p-8">
              <form onSubmit={handleSiteVisitSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full name <span className="text-[#C8102E]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={siteVisitForm.fullName}
                      onChange={(e) => setSiteVisitForm({ ...siteVisitForm, fullName: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C8102E] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Company <span className="text-[#C8102E]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={siteVisitForm.company}
                      onChange={(e) => setSiteVisitForm({ ...siteVisitForm, company: e.target.value })}
                      placeholder="Enter company name"
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C8102E] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email <span className="text-[#C8102E]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={siteVisitForm.email}
                      onChange={(e) => setSiteVisitForm({ ...siteVisitForm, email: e.target.value })}
                      placeholder="Enter your email"
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C8102E] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Phone <span className="text-[#C8102E]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={siteVisitForm.phone}
                      onChange={(e) => setSiteVisitForm({ ...siteVisitForm, phone: e.target.value })}
                      placeholder="Enter your phone number"
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C8102E] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Project / site notes <span className="text-[#C8102E]">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={siteVisitForm.notes}
                    onChange={(e) => setSiteVisitForm({ ...siteVisitForm, notes: e.target.value })}
                    placeholder="Tell us about your project, location, access, and any specific requirements..."
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C8102E] transition-colors resize-y"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-[#C8102E] text-white text-xs font-bold hover:bg-[#a60d25] transition-all shadow-2xs active:scale-98"
                  >
                    <span>Request site visit</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Bar */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-10">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div>© 2026 Gebr. Markewitsch GmbH</div>
          <div className="flex items-center space-x-4">
            <a href="#imprint" className="hover:text-gray-900 transition-colors">Imprint</a>
            <span className="text-red-500">•</span>
            <a href="#privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
            <span className="text-red-500">•</span>
            <a href="#terms" className="hover:text-gray-900 transition-colors">Terms &amp; Conditions</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
