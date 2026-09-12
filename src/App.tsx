import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Footer } from './components/Footer';
import { AirD2DEstimateModal } from './components/AirD2DEstimateModal';
import { SeaD2DModal } from './components/SeaD2DModal';
import { SupplierPaymentModal } from './components/SupplierPaymentModal';
import { HandCarryModal } from './components/HandCarryModal';
import { ImportConsultancyModal } from './components/ImportConsultancyModal';
import { CustomsClearingModal } from './components/CustomsClearingModal';
import { OfficialLetterheadPad, PadQuotationData } from './components/OfficialLetterheadPad';
import { AdminDashboard } from './components/AdminDashboard';
import { LogoMediaKitModal } from './components/LogoMediaKitModal';
import { RateSettings, Lead } from './types';
import { 
  getRateSettings, 
  saveRateSettings, 
  getLeads, 
  updateLead 
} from './services/storage';
import { 
  Plane, 
  ArrowRight, 
  Calculator, 
  MessageCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Coins, 
  FileCheck,
  Sparkles,
  Lock
} from 'lucide-react';

export default function App() {
  const [rateSettings, setRateSettings] = useState<RateSettings>(getRateSettings);
  const [leads, setLeads] = useState<Lead[]>([]);

  // Modals state
  const [isAirModalOpen, setIsAirModalOpen] = useState(false);
  const [isSeaModalOpen, setIsSeaModalOpen] = useState(false);
  const [isSupplierPaymentModalOpen, setIsSupplierPaymentModalOpen] = useState(false);
  const [isHandCarryModalOpen, setIsHandCarryModalOpen] = useState(false);
  const [isConsultancyModalOpen, setIsConsultancyModalOpen] = useState(false);
  const [isCustomsModalOpen, setIsCustomsModalOpen] = useState(false);
  const [isMediaKitOpen, setIsMediaKitOpen] = useState(false);
  
  // Official C&F Pad modal state
  const [letterheadData, setLetterheadData] = useState<PadQuotationData | null>(null);
  const [isLetterheadOpen, setIsLetterheadOpen] = useState(false);

  // Admin Dashboard
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    // Initial fetch of leads and rates
    setRateSettings(getRateSettings());
    setLeads(getLeads());
  }, []);

  const handleUpdateRates = (newSettings: RateSettings) => {
    setRateSettings(newSettings);
    saveRateSettings(newSettings);
  };

  const handleLeadCreated = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  const handleUpdateLead = (id: string, updates: Partial<Lead>) => {
    const updated = updateLead(id, updates);
    setLeads(updated);
  };

  const handleOpenPadFromQuotation = (data: PadQuotationData) => {
    setLetterheadData(data);
    setIsLetterheadOpen(true);
  };

  const cleanPhone = rateSettings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-500 selection:text-white">
      {/* Header with Navigation & Live Lead Count for Admin */}
      <Header
        onOpenCalculator={() => setIsAirModalOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenMediaKit={() => setIsMediaKitOpen(true)}
        rateSettings={rateSettings}
        leadsCount={leads.length}
      />

      {/* Main Page Body */}
      <main className="flex-1">
        {/* Hero Section with Official C&F Agent Profile & Service Grid */}
        <Hero
          onOpenAirEstimate={() => setIsAirModalOpen(true)}
          onOpenSeaEstimate={() => setIsSeaModalOpen(true)}
          onOpenSupplierPayment={() => setIsSupplierPaymentModalOpen(true)}
          onOpenHandCarry={() => setIsHandCarryModalOpen(true)}
          onOpenImportConsultancy={() => setIsConsultancyModalOpen(true)}
          onOpenCustomsClearing={() => setIsCustomsModalOpen(true)}
          onOpenMediaKit={() => setIsMediaKitOpen(true)}
          rateSettings={rateSettings}
        />

        {/* Quick Multi-Service Highlights Bar (High-Trust B2B Copy, Raw rates hidden) */}
        <div className="bg-slate-950 text-white py-3 px-4 shadow-sm border-y border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs sm:text-sm font-semibold gap-3">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="bg-amber-500 text-slate-950 text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full uppercase font-black tracking-wide">
                Gov't Licensed C&F
              </span>
              <span className="text-slate-300 text-xs sm:text-sm">
                ঢাকা ও চট্টগ্রাম কাস্টমস হাউস • চায়না ও হংকং নিজস্ব ওয়্যারহাউজ • পণ্যভেদে স্পেশাল রেট • ৬৪ জেলায় ডেলিভারি
              </span>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => setIsMediaKitOpen(true)}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center cursor-pointer text-xs"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                <span>লোগো ও মিডিয়া কিট</span>
              </button>
              <span className="text-slate-700">|</span>
              <button
                onClick={() => setIsCustomsModalOpen(true)}
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center cursor-pointer text-xs"
              >
                <FileCheck className="w-3.5 h-3.5 mr-1" />
                <span>কাস্টমস রিকোয়েস্ট</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* All Logistics & C&F Services with Dedicated Quick Estimate Triggers */}
        <ServicesSection
          onOpenAirEstimate={() => setIsAirModalOpen(true)}
          onOpenSeaEstimate={() => setIsSeaModalOpen(true)}
          onOpenSupplierPayment={() => setIsSupplierPaymentModalOpen(true)}
          onOpenHandCarry={() => setIsHandCarryModalOpen(true)}
          onOpenImportConsultancy={() => setIsConsultancyModalOpen(true)}
          onOpenCustomsClearing={() => setIsCustomsModalOpen(true)}
          rateSettings={rateSettings}
        />

        {/* In-Page Interactive Quick Action Strip (Persuasive B2B Terms) */}
        <section className="py-12 bg-slate-900 text-white relative overflow-hidden border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl relative">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-3 text-left">
                  <span className="text-amber-400 text-xs font-black uppercase tracking-wider flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-1.5" />
                    গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত সিএন্ডএফ লাইসেন্স #1048/BD
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    আপনার কনসাইনমেন্টের সঠিক কাস্টমস অ্যাসেসমেন্ট ও সেরা রেট নিন
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                    পণ্য আটকে যাওয়ার কোনো ঝুঁকি নেই। অভিজ্ঞ সিএন্ডএফ এজেন্টের মাধ্যমে চায়না ও হংকং থেকে এয়ার কার্গো, সি ফ্রেইট এবং সরাসরি সাপ্লায়ার পেমেন্ট সেটেল করুন শতভাগ আইনি উপায়ে।
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-300">
                    <span className="flex items-center text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4 mr-1.5 shrink-0" />
                      ১০০% নিরাপদ কাস্টমস ক্লিয়ারেন্স নিশ্চয়তা
                    </span>
                    <span className="flex items-center text-amber-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4 mr-1.5 shrink-0" />
                      পণ্য ও ওজনের ভিত্তিতে স্পেশাল কমার্শিয়াল রেট
                    </span>
                    <span className="flex items-center text-sky-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4 mr-1.5 shrink-0" />
                      সরাসরি ৩-৫ দিনের এয়ার কার্গো ফ্লাইট
                    </span>
                    <span className="flex items-center text-purple-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4 mr-1.5 shrink-0" />
                      অফিশিয়াল সিএন্ডএফ লেটারহেড প্যাড ডাউনলোড
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-3">
                  <button
                    id="btn-quick-estimate-banner"
                    onClick={() => setIsAirModalOpen(true)}
                    className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    <span>এয়ার কার্গো রেট হিসাব করুন</span>
                  </button>

                  <button
                    onClick={() => setIsCustomsModalOpen(true)}
                    className="w-full inline-flex items-center justify-center py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    <FileCheck className="w-4 h-4 mr-2" />
                    <span>কাস্টমস ক্লিয়ারেন্স কোটেশন</span>
                  </button>

                  <a
                    href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hello C&F Agent (Licensed Customs Clearing & Forwarding),\nI would like to discuss my commercial shipment and get an official rate quote.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs border border-slate-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 mr-2 text-emerald-400" />
                    <span>হোয়াটসঅ্যাপে সরাসরি যোগাযোগ</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Importers Trust C&F Agent */}
        <WhyChooseUs />
      </main>

      {/* Footer */}
      <Footer
        onOpenCalculator={() => setIsAirModalOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenMediaKit={() => setIsMediaKitOpen(true)}
        rateSettings={rateSettings}
      />

      {/* Floating Quick Action Widget for Mobile */}
      <div className="fixed bottom-4 right-4 z-30 flex items-center space-x-2 sm:hidden">
        <button
          onClick={() => setIsAirModalOpen(true)}
          className="flex items-center space-x-2 bg-amber-500 text-slate-950 font-black px-4 py-3 rounded-full shadow-2xl border-2 border-slate-900 text-xs active:scale-95"
        >
          <Calculator className="w-4 h-4" />
          <span>Quick Estimate</span>
        </button>

        <button
          onClick={() => setIsSupplierPaymentModalOpen(true)}
          className="w-12 h-12 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center shadow-2xl border-2 border-amber-400 active:scale-95"
          title="Supplier Payment"
        >
          <Coins className="w-5 h-5" />
        </button>

        <a
          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hello C&F Agent, I want to inquire about cargo & customs services.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-2xl border-2 border-white"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      </div>

      {/* 1. Air D2D Cargo Smart Estimate & Lead Collection Modal */}
      <AirD2DEstimateModal
        isOpen={isAirModalOpen}
        onClose={() => setIsAirModalOpen(false)}
        rateSettings={rateSettings}
        onLeadCreated={handleLeadCreated}
      />

      {/* 2. Sea D2D Cargo Quick Estimate Modal (CBM, Qty, Weight, WhatsApp auto message) */}
      <SeaD2DModal
        isOpen={isSeaModalOpen}
        onClose={() => setIsSeaModalOpen(false)}
        rateSettings={rateSettings}
        onLeadCreated={handleLeadCreated}
        onSwitchToConsultancy={() => {
          setIsSeaModalOpen(false);
          setIsConsultancyModalOpen(true);
        }}
      />

      {/* 3. Supplier Payment Modal (Direct RMB/USD Rate, Approx Total BDT, Official C&F Pad PDF Download) */}
      <SupplierPaymentModal
        isOpen={isSupplierPaymentModalOpen}
        onClose={() => setIsSupplierPaymentModalOpen(false)}
        rateSettings={rateSettings}
        onLeadCreated={handleLeadCreated}
        onOpenPad={handleOpenPadFromQuotation}
      />

      {/* 4. Hand Carry Cargo Modal (Query questions, express urgency, customer info at end) */}
      <HandCarryModal
        isOpen={isHandCarryModalOpen}
        onClose={() => setIsHandCarryModalOpen(false)}
        rateSettings={rateSettings}
        onLeadCreated={handleLeadCreated}
        onSwitchToAirD2D={() => {
          setIsHandCarryModalOpen(false);
          setIsAirModalOpen(true);
        }}
      />

      {/* 5. Import Consultancy Modal (Product details, what importer wants to know, customer info at end) */}
      <ImportConsultancyModal
        isOpen={isConsultancyModalOpen}
        onClose={() => setIsConsultancyModalOpen(false)}
        rateSettings={rateSettings}
        onLeadCreated={handleLeadCreated}
      />

      {/* 6. Customs Clearing Modal (C&F Agent Import & Export Clearance) */}
      <CustomsClearingModal
        isOpen={isCustomsModalOpen}
        onClose={() => setIsCustomsModalOpen(false)}
        rateSettings={rateSettings}
        onLeadCreated={handleLeadCreated}
      />

      {/* 7. Official C&F Agent Letterhead Quotation Pad (Print / PDF Download) */}
      {letterheadData && (
        <OfficialLetterheadPad
          isOpen={isLetterheadOpen}
          onClose={() => setIsLetterheadOpen(false)}
          data={letterheadData}
          rateSettings={rateSettings}
        />
      )}

      {/* 8. Logo & Brand Media Kit Modal */}
      <LogoMediaKitModal
        isOpen={isMediaKitOpen}
        onClose={() => setIsMediaKitOpen(false)}
        whatsappNumber={rateSettings.whatsappNumber}
        email={rateSettings.email}
      />

      {/* 9. Admin Dashboard & Rate Settings Portal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        leads={leads}
        onUpdateLead={handleUpdateLead}
        rateSettings={rateSettings}
        onSaveRateSettings={handleUpdateRates}
      />
    </div>
  );
}
