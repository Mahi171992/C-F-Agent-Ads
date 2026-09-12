import React from 'react';
import { 
  Plane, 
  Ship, 
  ShieldCheck, 
  HelpCircle, 
  Briefcase, 
  MessageCircle, 
  Calculator, 
  ArrowRight, 
  Check, 
  Coins, 
  Zap, 
  Award, 
  FileCheck,
  Building2,
  Sparkles
} from 'lucide-react';
import { RateSettings } from '../types';

interface ServicesSectionProps {
  onOpenAirEstimate: () => void;
  onOpenSeaEstimate: () => void;
  onOpenSupplierPayment: () => void;
  onOpenHandCarry: () => void;
  onOpenImportConsultancy: () => void;
  onOpenCustomsClearing: () => void;
  rateSettings: RateSettings;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenAirEstimate,
  onOpenSeaEstimate,
  onOpenSupplierPayment,
  onOpenHandCarry,
  onOpenImportConsultancy,
  onOpenCustomsClearing,
  rateSettings,
}) => {
  const cleanPhone = rateSettings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <section id="services" className="py-12 sm:py-20 bg-slate-100/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-800 bg-amber-100/90 px-3.5 py-1.5 rounded-full border border-amber-300 inline-flex items-center gap-1.5 shadow-xs">
            <Award className="w-4 h-4 text-amber-600" />
            বাংলাদেশ সরকার অনুমোদিত লাইসেন্সপ্রাপ্ত কাস্টমস সিএন্ডএফ ও কার্গো সেবা
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 mt-3 tracking-tight">
            আমদানিকারকদের জন্য ওয়ান-স্টপ কাস্টমস ও আন্তর্জাতিক লজিস্টিকস সলিউশন
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed">
            লাইসেন্সপ্রাপ্ত সিএন্ডএফ এজেন্ট হিসেবে চায়না ও হংকং থেকে কারখানা পিকআপ, ওয়্যারহাউজ হ্যান্ডলিং, বন্দর কাস্টমস ছাড়পত্র এবং বাংলাদেশের যেকোনো জেলায় ডোর-টু-ডোর ডেলিভারির পূর্ণ নিশ্চয়তা।
          </p>
        </div>

        {/* Services Grid (All 6 Services with Uniform Colored Top Header & Thematic Pictures) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* 1. CUSTOMS CLEARING (C&F) */}
          <div className="bg-white rounded-2xl border-2 border-emerald-500 shadow-lg hover:shadow-xl overflow-hidden flex flex-col justify-between relative transform transition-all hover:-translate-y-1">
            {/* Top Color Header Bar */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 sm:px-5 py-3 text-white font-black text-xs uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1.5 shrink-0" />
                কোর সিএন্ডএফ সার্ভিস
              </span>
              <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                কাস্টমস ক্লিয়ারেন্স
              </span>
            </div>

            {/* Thematic Service Image */}
            <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80" 
                alt="Customs Port Clearing" 
                className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-white">
                <span className="text-xs font-bold bg-emerald-600/90 backdrop-blur px-2 py-0.5 rounded shadow">
                  ঢাকা এয়ারপোর্ট • চট্টগ্রাম পোর্ট • বেনাপোল
                </span>
                <span className="text-[11px] text-emerald-200 font-semibold">
                  ১০০% লিগ্যাল অ্যাসেসমেন্ট
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                    Customs Clearing (C&F)
                  </h3>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <FileCheck className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">
                  বিমানবন্দর ও সমুদ্রবন্দর কাস্টমস ছাড়পত্র
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  হযরত শাহজালাল আন্তর্জাতিক বিমানবন্দর, চট্টগ্রাম সমুদ্র বন্দর ও বেনাপোল ল্যান্ড পোর্টে শতভাগ আইনি উপায়ে কাস্টমস ছাড়পত্র। কুরিয়ার মুড (DHL/FedEx/UPS), এয়ারফ্রেইট ও এফসিএল/এলসিএল কনটেইনারের বিল অব এন্ট্রি (B/E) সাবমিশন ও দ্রুততম ডেলিভারি অর্ডার (DO)।
                </p>

                {/* Trust Metrics Box */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 mb-4 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-semibold">ক্লিয়ারেন্স স্পিড:</span>
                    <span className="font-extrabold text-emerald-800">সর্বোচ্চ অগ্রাধিকার ভিত্তিতে রিলিজ</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-semibold">নিরাপত্তা নিশ্চয়তা:</span>
                    <span className="font-extrabold text-slate-900">আইনি ও নিরাপদ খালাস</span>
                  </div>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-700 mb-5">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                    <span>কাস্টমস ডিক্লেয়ারেশন ও অ্যাসেসমেন্ট নোটিশ যাচাই</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                    <span>ল্যাব টেস্ট, বিএসটিআই ও বিটিআরসি এনওসি সমন্বয়</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                    <span>কোনো অনাকাঙ্ক্ষিত পোর্ট জরিমানা বা ডেমারেজ নয়</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={onOpenCustomsClearing}
                  className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] min-h-[44px]"
                >
                  <FileCheck className="w-4 h-4 mr-2" />
                  <span>কাস্টমস ক্লিয়ারেন্স আবেদন ও কোটেশন</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>

                <a
                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hello C&F Agent,\nI need customs clearance for my consignment at Dhaka Airport / Chittagong Port.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs border border-slate-800 transition-colors min-h-[42px]"
                >
                  <MessageCircle className="w-4 h-4 mr-1.5 text-emerald-400" />
                  <span>কাস্টমস ডেস্কে সরাসরি কথা বলুন</span>
                </a>
              </div>
            </div>
          </div>

          {/* 2. CHINA & HK AIR D2D */}
          <div 
            id="air-d2d" 
            className="bg-white rounded-2xl border-2 border-amber-500 shadow-lg hover:shadow-xl overflow-hidden flex flex-col justify-between relative transform transition-all hover:-translate-y-1"
          >
            {/* Top Color Header Bar */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-4 sm:px-5 py-3 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center">
                <Plane className="w-4 h-4 mr-1.5 shrink-0" />
                Air Express • ৩-৫ দিনে ডেলিভারি
              </span>
              <span className="bg-slate-950 text-amber-400 px-2 py-0.5 rounded text-[10px] font-black">
                Direct Flights
              </span>
            </div>

            {/* Thematic Service Image */}
            <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=600&q=80" 
                alt="Air Cargo Freight" 
                className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-white">
                <span className="text-xs font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded shadow">
                  গুয়াংজু / শেনঝেন / ইইউ / হংকং → ঢাকা
                </span>
                <span className="text-[11px] text-amber-200 font-semibold">
                  কাস্টমস ও শুল্ক অন্তর্ভুক্ত
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                    China & HK Air D2D
                  </h3>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Plane className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">
                  দ্রুততম কমার্শিয়াল ডোর টু ডোর কার্গো
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  বাণিজ্যিক মালামালের দ্রুততম এয়ার কার্গো। চায়না ও হংকংয়ের নিজস্ব ওয়্যারহাউজে মালামাল গ্রহণ, ফ্রেইটার ফ্লাইটে সরাসরি ঢাকা আগমন, বিমানবন্দর কাস্টমস ক্লিয়ারেন্স এবং সরাসরি আপনার গোডাউনে পৌঁছানো।
                </p>

                {/* Trust Metrics Box */}
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 mb-4 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-semibold">কমার্শিয়াল রেট:</span>
                    <span className="font-extrabold text-amber-800">পণ্য ও ওজনের ভিত্তিতে স্পেশাল রেট</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-semibold">ট্রানজিট সময়:</span>
                    <span className="font-bold text-emerald-700">৩-৫ কার্যদিবস (সরাসরি ফ্লাইট)</span>
                  </div>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-700 mb-5">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-amber-600 mr-2 shrink-0" />
                    <span>এয়ারপোর্ট কাস্টমস শুল্ক ও হ্যান্ডলিং চার্জ অন্তর্ভুক্ত</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-amber-600 mr-2 shrink-0" />
                    <span>চায়না ও হংকং ওয়্যারহাউজে ফ্রি কার্গো রিসিভ ও রি-প্যাকিং</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-amber-600 mr-2 shrink-0" />
                    <span>পণ্যভেদে সঠিক রেট ও স্পেশাল ছাড়ের সুবিধা</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  id="btn-get-quick-estimate"
                  onClick={onOpenAirEstimate}
                  className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] min-h-[44px]"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  <span>পণ্য অনুযায়ী স্পেশাল রেট হিসাব করুন</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>

                <a
                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hello C&F Agent,\nI want to get a special Air D2D rate quote for my product.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs border border-slate-800 transition-colors min-h-[42px]"
                >
                  <MessageCircle className="w-4 h-4 mr-1.5 text-emerald-400" />
                  <span>হোয়াটসঅ্যাপে স্পেশাল রেট জানুন</span>
                </a>
              </div>
            </div>
          </div>

          {/* 3. SEA D2D CARGO (CONTAINER LCL/FCL) */}
          <div className="bg-white rounded-2xl border-2 border-blue-500 shadow-lg hover:shadow-xl overflow-hidden flex flex-col justify-between relative transform transition-all hover:-translate-y-1">
            {/* Top Color Header Bar */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-5 py-3 text-white font-black text-xs uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center">
                <Ship className="w-4 h-4 mr-1.5 shrink-0" />
                Sea Freight • চায়না পোর্ট → চট্টগ্রাম
              </span>
              <span className="bg-blue-950 text-blue-300 px-2 py-0.5 rounded text-[10px] font-bold">
                LCL / FCL
              </span>
            </div>

            {/* Thematic Service Image */}
            <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80" 
                alt="Sea Container Shipping" 
                className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-white">
                <span className="text-xs font-bold bg-blue-600 px-2 py-0.5 rounded shadow">
                  LCL (কিউবিক মিটার) ও FCL কন্টেইনার
                </span>
                <span className="text-[11px] text-blue-200 font-semibold">
                  ভারী পণ্যে সর্বোচ্চ সাশ্রয়ী
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                    Sea D2D Cargo (LCL / FCL)
                  </h3>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Ship className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">
                  ভারী ও বাণিজ্যিক পণ্যের সাশ্রয়ী শিপিং
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  মেশিনারি, কাঁচামাল, হার্ডওয়্যার ও বাল্ক মালামালের জন্য জাহাজে কন্টেইনার কার্গো। নিংবো, সাংহাই, গুয়াংজু থেকে চট্টগ্রাম পোর্ট কাস্টমস হয়ে আপনার ঠিকানায় সরাসরি ডেলিভারি।
                </p>

                {/* Trust Metrics Box */}
                <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 mb-4 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-semibold">শিপিং মেথড:</span>
                    <span className="font-extrabold text-blue-800">CBM ভিত্তিক LCL অথবা ২০/৪০' কন্টেইনার</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-semibold">চট্টগ্রাম পোর্ট ক্লিয়ারেন্স:</span>
                    <span className="font-bold text-slate-900">সম্পূর্ণ সিএন্ডএফ এজেন্সির তত্ত্বাবধানে</span>
                  </div>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-700 mb-5">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-blue-600 mr-2 shrink-0" />
                    <span>ভারী মেশিনারিজ ও ইন্ডাস্ট্রিয়াল কাঁচামালে সাশ্রয়ী</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-blue-600 mr-2 shrink-0" />
                    <span>সি পোর্ট কাস্টমস অ্যাসেসমেন্ট ও খালাস সম্পন্ন</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-blue-600 mr-2 shrink-0" />
                    <span>ফ্যাক্টরি প্রাঙ্গণে ট্রেলার / কাভার্ড ভ্যান ডেলিভারি</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={onOpenSeaEstimate}
                  className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] min-h-[44px]"
                >
                  <Ship className="w-4 h-4 mr-2" />
                  <span>সি কার্গো কোটেশন রিকোয়েস্ট</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>

                <a
                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hello C&F Agent,\nI want to inquire about Sea D2D container cargo.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs border border-slate-800 transition-colors min-h-[42px]"
                >
                  <MessageCircle className="w-4 h-4 mr-1.5 text-emerald-400" />
                  <span>সি ফ্রেইট ডেস্কে কথা বলুন</span>
                </a>
              </div>
            </div>
          </div>

          {/* 4. SUPPLIER PAYMENT SUPPORT (RMB/USD) */}
          <div className="bg-white rounded-2xl border-2 border-teal-500 shadow-lg hover:shadow-xl overflow-hidden flex flex-col justify-between relative transform transition-all hover:-translate-y-1">
            {/* Top Color Header Bar */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-4 sm:px-5 py-3 text-white font-black text-xs uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center">
                <Coins className="w-4 h-4 mr-1.5 shrink-0" />
                Cross-Border Payment • RMB / USD
              </span>
              <span className="bg-teal-950 text-teal-300 px-2 py-0.5 rounded text-[10px] font-bold">
                1688 / Alipay / TT
              </span>
            </div>

            {/* Thematic Service Image */}
            <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80" 
                alt="Cross Border Supplier Payment" 
                className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-white">
                <span className="text-xs font-bold bg-teal-600 px-2 py-0.5 rounded shadow">
                  1688 • WeChat Pay • Alipay • ব্যাংক TT
                </span>
                <span className="text-[11px] text-teal-200 font-semibold">
                  একই দিনে সেটেলমেন্ট
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                    Supplier Payment Support
                  </h3>
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                    <Coins className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-2">
                  চায়না ও গ্লোবাল সাপ্লায়ার পেমেন্ট সেটেলমেন্ট
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  1688, আলিবাবা বা চায়না ফ্যাক্টরির অ্যাকাউন্টে দ্রুত ও নিরাপদ RMB/USD পেমেন্ট ট্রান্সফার। অফিসিয়াল প্রফরমা কোটেশন এবং ব্যাংক ডিপোজিট ভেরিফিকেশনের মাধ্যমে নির্ভরযোগ্য লেনদেন।
                </p>

                {/* Trust Metrics Box */}
                <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-3 mb-4 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-semibold">সেটেলমেন্ট সময়:</span>
                    <span className="font-extrabold text-teal-800">সেম-ডে বা সর্বোচ্চ ২৪ ঘণ্টার মধ্যে নিষ্পত্তি</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-semibold">সাপোর্ট চ্যানেল:</span>
                    <span className="font-bold text-slate-900">চায়না ব্যাংক, আলিপে ও উইচ্যাট পে</span>
                  </div>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-700 mb-5">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-teal-600 mr-2 shrink-0" />
                    <span>চায়না সাপ্লায়ারের ব্যাংক অ্যাকাউন্টে সরাসরি ট্রান্সফার</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-teal-600 mr-2 shrink-0" />
                    <span>অফিশিয়াল সিএন্ডএফ প্যাডে প্রফর্মা কোটেশন ও রশিদ</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-teal-600 mr-2 shrink-0" />
                    <span>বাংলাদেশি ব্যাংকে নিরাপদ ডিপোজিট নিশ্চিতকরণ</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={onOpenSupplierPayment}
                  className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] min-h-[44px]"
                >
                  <Coins className="w-4 h-4 mr-2" />
                  <span>পেমেন্ট হিসাব ও প্যাড তৈরি করুন</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>

                <a
                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hello C&F Agent,\nI need urgent RMB / USD payment support for my China supplier.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs border border-slate-800 transition-colors min-h-[42px]"
                >
                  <MessageCircle className="w-4 h-4 mr-1.5 text-emerald-400" />
                  <span>পেমেন্ট ডেস্কে সরাসরি কথা বলুন</span>
                </a>
              </div>
            </div>
          </div>

          {/* 5. HAND CARRY SUPER EXPRESS */}
          <div className="bg-white rounded-2xl border-2 border-rose-500 shadow-lg hover:shadow-xl overflow-hidden flex flex-col justify-between relative transform transition-all hover:-translate-y-1">
            {/* Top Color Header Bar */}
            <div className="bg-gradient-to-r from-rose-600 to-rose-700 px-4 sm:px-5 py-3 text-white font-black text-xs uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center">
                <Briefcase className="w-4 h-4 mr-1.5 shrink-0" />
                On-Board Express • ২৪-৪৮ ঘণ্টা
              </span>
              <span className="bg-rose-950 text-rose-300 px-2 py-0.5 rounded text-[10px] font-bold">
                Flyer Courier
              </span>
            </div>

            {/* Thematic Service Image */}
            <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=600&q=80" 
                alt="Hand Carry Courier Baggage" 
                className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-white">
                <span className="text-xs font-bold bg-rose-600 px-2 py-0.5 rounded shadow">
                  অন-বোর্ড ব্যক্তিগত কুরিয়ার এসকর্ট
                </span>
                <span className="text-[11px] text-rose-200 font-semibold">
                  ২৪–৪৮ ঘণ্টায় জরুরি ডেলিভারি
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                    Hand Carry Super Express
                  </h3>
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                    <Briefcase className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-xs font-bold text-rose-700 uppercase tracking-wide mb-2 flex items-center">
                  <Zap className="w-3.5 h-3.5 mr-1 text-rose-500 shrink-0" />
                  ২৪-৪৮ ঘণ্টার ইমার্জেন্সি স্যাম্পল ও পার্টস
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  ফ্যাক্টরির উৎপাদন সচল রাখতে জরুরি মেশিনারি পার্টস, জরুরি স্যাম্পল বা অনুমোদিত সেনসিটিভ পণ্য অন-বোর্ড কুরিয়ারের মাধ্যমে সরাসরি ফ্লাইটে ঢাকা বিমানবন্দরে নিয়ে আসা হয়।
                </p>

                {/* Trust Metrics Box */}
                <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3 mb-4 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-semibold">ডেলিভারি গতি:</span>
                    <span className="font-extrabold text-rose-700">পরবর্তী সরাসরি ফ্লাইটে ব্যক্তিগত এসকর্ট</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-semibold">হ্যান্ডওভার:</span>
                    <span className="font-bold text-slate-900">২৪–৪৮ ঘণ্টার মধ্যে নিশ্চিত ডেলিভারি</span>
                  </div>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-700 mb-5">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-rose-600 mr-2 shrink-0" />
                    <span>জিরো ফ্যাক্টরি ডাউনটাইম ও ১০০% সেফটি নিশ্চয়তা</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-rose-600 mr-2 shrink-0" />
                    <span>হাই-ভ্যালু প্রোডাক্ট ও আর্জেন্ট প্রোটোটাইপ হ্যান্ডলিং</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-rose-600 mr-2 shrink-0" />
                    <span>ঢাকা বিমানবন্দরে দ্রুততম রিসিভ ও ডেলিভারি</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={onOpenHandCarry}
                  className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] min-h-[44px]"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  <span>হ্যান্ড ক্যারি কোটেশন রিকোয়েস্ট</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>

                <a
                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hello C&F Agent,\nI have an emergency shipment that requires 24-48 hr Hand Carry Cargo to Dhaka.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs border border-slate-800 transition-colors min-h-[42px]"
                >
                  <MessageCircle className="w-4 h-4 mr-1.5 text-emerald-400" />
                  <span>ইমার্জেন্সি হ্যান্ড ক্যারি হটলাইন</span>
                </a>
              </div>
            </div>
          </div>

          {/* 6. IMPORT CONSULTANCY & TARIFF DESK */}
          <div className="bg-white rounded-2xl border-2 border-purple-500 shadow-lg hover:shadow-xl overflow-hidden flex flex-col justify-between relative transform transition-all hover:-translate-y-1">
            {/* Top Color Header Bar */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 sm:px-5 py-3 text-white font-black text-xs uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center">
                <HelpCircle className="w-4 h-4 mr-1.5 shrink-0" />
                Customs Advisory • HS Code & Tariff
              </span>
              <span className="bg-purple-950 text-purple-300 px-2 py-0.5 rounded text-[10px] font-bold">
                NBR Schedule
              </span>
            </div>

            {/* Thematic Service Image */}
            <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80" 
                alt="Import Consultancy Documents" 
                className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-white">
                <span className="text-xs font-bold bg-purple-600 px-2 py-0.5 rounded shadow">
                  ৮-ডিজিট HS Code ও কাস্টমস ডিউটি
                </span>
                <span className="text-[11px] text-purple-200 font-semibold">
                  আইনি উপায়ে কর সাশ্রয়
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                    Import Consultancy & Tariff Desk
                  </h3>
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-2">
                  ৮-ডিজিট HS Code ও কাস্টমস শুল্ক মূল্যায়ন
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  সঠিক এইচএস কোড নির্ধারণ, জাতীয় রাজস্ব বোর্ডের (NBR) ট্যারিফ শিডিউল ও কাস্টমস মিনিমাম অ্যাসেসমেন্ট ভ্যালু যাচাই, বিএসটিআই/বিটিআরসি এনওসি এবং আমদানি নীতি আদেশের (IPO) কমপ্লায়েন্স গাইডেন্স।
                </p>

                {/* Trust Metrics Box */}
                <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-3 mb-4 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-semibold">ট্যারিফ ডেটাবেজ:</span>
                    <span className="font-extrabold text-purple-800">NBR ট্যারিফ ও রুলস অনুযায়ী চেক</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-semibold">পরামর্শক:</span>
                    <span className="font-bold text-slate-900">লাইসেন্সপ্রাপ্ত কাস্টমস বিশেষজ্ঞ টিম</span>
                  </div>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-700 mb-5">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-purple-600 mr-2 shrink-0" />
                    <span>ভুল এইচএস কোডের কারণে কাস্টমস জরিমানা এড়ান</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-purple-600 mr-2 shrink-0" />
                    <span>আইনি উপায়ে সর্বনিম্ন কাস্টমস শুল্ক পরিশোধের পরামর্শ</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-purple-600 mr-2 shrink-0" />
                    <span>এলসি (L/C) ও শিপিং ডকুমেন্টস প্রাক-যাচাই</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={onOpenImportConsultancy}
                  className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] min-h-[44px]"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  <span>ট্যারিফ ও এইচএস কোড পরামর্শ নিন</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>

                <a
                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hello C&F Agent,\nI need import consultancy, HS Code determination & customs duty advisory.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs border border-slate-800 transition-colors min-h-[42px]"
                >
                  <MessageCircle className="w-4 h-4 mr-1.5 text-emerald-400" />
                  <span>সিনিয়র সিএন্ডএফ কনসালট্যান্ট</span>
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
