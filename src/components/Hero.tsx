import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  MessageCircle, 
  Phone, 
  Mail, 
  Plane, 
  Ship, 
  Coins, 
  Briefcase, 
  HelpCircle, 
  FileCheck, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Warehouse, 
  Award,
  ChevronRight
} from 'lucide-react';
import { RateSettings } from '../types';
import { BrandLogo } from './BrandLogo';

interface HeroProps {
  onOpenAirEstimate: () => void;
  onOpenSeaEstimate: () => void;
  onOpenSupplierPayment: () => void;
  onOpenHandCarry: () => void;
  onOpenImportConsultancy: () => void;
  onOpenCustomsClearing: () => void;
  onOpenMediaKit?: () => void;
  rateSettings: RateSettings;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenAirEstimate,
  onOpenSeaEstimate,
  onOpenSupplierPayment,
  onOpenHandCarry,
  onOpenImportConsultancy,
  onOpenCustomsClearing,
  onOpenMediaKit,
  rateSettings,
}) => {
  const cleanPhone = rateSettings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden py-10 lg:py-16 border-b border-slate-800">
      {/* Background ambient lighting effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(30,58,138,0.25),transparent_60%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Trust Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-6 border-b border-slate-800/80 text-xs">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Government Licensed Customs C&F Agent #1048/BD</span>
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-300 font-medium">
              National Board of Revenue (NBR) Accredited
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`mailto:${rateSettings.email}`}
              className="text-slate-300 hover:text-amber-400 flex items-center gap-1 transition-colors text-xs"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{rateSettings.email}</span>
            </a>
            <span className="text-slate-600">|</span>
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{rateSettings.whatsappNumber}</span>
            </a>
          </div>
        </div>

        {/* Main Grid: Headline & Value Proposition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column (7 cols): High-Impact Marketing Copy & Value Drivers */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Title & Badge */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-amber-400 text-xs font-semibold">
                <Award className="w-3.5 h-3.5" />
                <span>Official Customs Brokerage & International Freight Forwarder</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-white">
                আপনার আমদানিকৃত পণ্যের{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                  ১০০% নিরাপদ কাস্টমস ক্লিয়ারেন্স
                </span>{' '}
                ও ডোর-টু-ডোর ডেলিভারি
              </h1>
            </div>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              <strong className="text-white font-bold">{rateSettings.companyName}</strong> delivers your commercial goods from China and Hong Kong directly to your warehouse or factory in Bangladesh. Customs clearance, airport handling, and door delivery completely taken care of.
            </p>

            {/* High-Converting Value Pillars (Rates HIDDEN as instructed, replaced with high-trust terms) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-slate-800/80 border border-amber-500/20 rounded-xl p-3.5 hover:border-amber-400/40 transition-all">
                <span className="text-amber-400 text-xs font-bold block mb-1">কাস্টমস ক্লিয়ারেন্স গ্যারান্টি</span>
                <span className="text-sm font-black text-white block">১০০% লিগ্যাল অ্যাসেসমেন্ট</span>
                <span className="text-[11px] text-slate-400 block mt-1">ঢাকা বিমানবন্দর, চট্টগ্রাম পোর্ট ও বেনাপোল</span>
              </div>

              <div className="bg-slate-800/80 border border-amber-500/20 rounded-xl p-3.5 hover:border-amber-400/40 transition-all">
                <span className="text-emerald-400 text-xs font-bold block mb-1">কনফিডেনশিয়াল স্পেশাল রেট</span>
                <span className="text-sm font-black text-white block">সর্বনিম্ন কমার্শিয়াল চার্জ</span>
                <span className="text-[11px] text-slate-400 block mt-1">পণ্য ও ভলিউম অনুযায়ী সেরা অফার</span>
              </div>

              <div className="bg-slate-800/80 border border-amber-500/20 rounded-xl p-3.5 hover:border-amber-400/40 transition-all">
                <span className="text-sky-400 text-xs font-bold block mb-1">সুপারফাস্ট কার্গো ফ্লাইট</span>
                <span className="text-sm font-black text-white block">৩-৫ দিনে ডোর ডেলিভারি</span>
                <span className="text-[11px] text-slate-400 block mt-1">৬৪ জেলায় নিজস্ব নেটওয়ার্কে পৌঁছানো</span>
              </div>
            </div>

            {/* Core Services Interactive Launcher Grid (Replaces old simple 2 buttons) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  আমাদের বিশেষজ্ঞ সার্ভিসসমূহ (ক্লিক করে তাৎক্ষণিক কোটেশন নিন)
                </span>
                {onOpenMediaKit && (
                  <button
                    onClick={onOpenMediaKit}
                    className="text-[11px] text-slate-400 hover:text-amber-400 font-medium underline flex items-center gap-1"
                  >
                    <span>অফিশিয়াল লোগো ও ফেসবুক মিডিয়া কিট</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {/* Service 1: Customs Clearing */}
                <button
                  onClick={onOpenCustomsClearing}
                  className="flex flex-col items-start text-left p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-amber-400/50 transition-all group cursor-pointer shadow-sm"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white group-hover:text-amber-300">Customs Clearing (C&F)</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">ঢাকা এয়ারপোর্ট ও চট্টগ্রাম পোর্ট</span>
                </button>

                {/* Service 2: Air D2D Cargo */}
                <button
                  onClick={onOpenAirEstimate}
                  className="flex flex-col items-start text-left p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-amber-400/50 transition-all group cursor-pointer shadow-sm"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
                    <Plane className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white group-hover:text-amber-300">China & HK Air D2D</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">৩-৫ দিনে ডোর টু ডোর কার্গো</span>
                </button>

                {/* Service 3: Sea D2D Cargo */}
                <button
                  onClick={onOpenSeaEstimate}
                  className="flex flex-col items-start text-left p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-amber-400/50 transition-all group cursor-pointer shadow-sm"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2 group-hover:scale-110 transition-transform">
                    <Ship className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white group-hover:text-amber-300">Sea D2D Cargo (LCL/FCL)</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">ভারী ও বাণিজ্যিক পণ্যে সাশ্রয়ী</span>
                </button>

                {/* Service 4: Supplier Payment */}
                <button
                  onClick={onOpenSupplierPayment}
                  className="flex flex-col items-start text-left p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-amber-400/50 transition-all group cursor-pointer shadow-sm"
                >
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-2 group-hover:scale-110 transition-transform">
                    <Coins className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white group-hover:text-amber-300">Supplier Payment Support</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">1688 / WeChat / Alipay / TT</span>
                </button>

                {/* Service 5: Hand Carry Super Express */}
                <button
                  onClick={onOpenHandCarry}
                  className="flex flex-col items-start text-left p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-amber-400/50 transition-all group cursor-pointer shadow-sm"
                >
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-2 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white group-hover:text-amber-300">Hand Carry Express</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">২৪-৪৮ ঘণ্টার ইমার্জেন্সি স্যাম্পল</span>
                </button>

                {/* Service 6: Import Consultancy */}
                <button
                  onClick={onOpenImportConsultancy}
                  className="flex flex-col items-start text-left p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-amber-400/50 transition-all group cursor-pointer shadow-sm"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-2 group-hover:scale-110 transition-transform">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white group-hover:text-amber-300">Import & Tariff Desk</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">HS কোড ও কাস্টমস ডিউটি যাচাই</span>
                </button>
              </div>
            </div>

            {/* Direct Action Hotline & WhatsApp Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hello C&F Agent (Licensed Customs Clearing & Forwarding),\nI want to discuss commercial cargo shipment & customs clearance to Bangladesh.\nProduct Details:")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.01]"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                <span>সরাসরি হোয়াটসঅ্যাপে কথা বলুন ({rateSettings.whatsappNumber})</span>
              </a>

              <a
                href={`tel:${rateSettings.whatsappNumber}`}
                className="inline-flex items-center justify-center px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-colors"
              >
                <Phone className="w-4 h-4 mr-2 text-amber-400" />
                <span>কল করুন: {rateSettings.whatsappNumber}</span>
              </a>
            </div>

            {/* Trust footer line */}
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>আমরা কোনো হিডেন চার্জ বা মধ্যস্থতাকারী ফি নেই না। শতভাগ আইনি উপায়ে ছাড়পত্র নিশ্চিত করি।</span>
            </div>

          </div>

          {/* Right Column (5 cols): Official C&F Profile & Trust Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/95 border border-slate-700/90 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur relative">
              
              {/* Profile Card Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-5">
                <div className="flex items-center space-x-3">
                  <BrandLogo size="md" variant="dark" showSubtitle={false} />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-400 block">
                      OFFICIAL C&F PROFILE
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white uppercase">
                      {rateSettings.companyName}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      Facebook Page: {rateSettings.facebookPage}
                    </p>
                  </div>
                </div>

                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              {/* High-Converting Marketing Highlights for Importers */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                
                <div className="flex items-start space-x-3 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-bold block">সরকার অনুমোদিত লাইসেন্সপ্রাপ্ত সিএন্ডএফ এজেন্ট:</strong>
                    <span className="text-slate-400 text-xs">ঢাকা এয়ারপোর্ট (DAC), চট্টগ্রাম সমুদ্র বন্দর (CTG) ও বেনাপোল ল্যান্ড পোর্টে নিজস্ব দক্ষ ক্লিয়ারিং টিম।</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                  <Warehouse className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-bold block">চায়না গুয়াংজু ও ইইউ ওয়্যারহাউজ সুবিধা:</strong>
                    <span className="text-slate-400 text-xs">ফ্রি কার্গো রিসিভ, বারকোড ট্র্যাকিং, কোয়ালিটি চেকিং ও সুরক্ষিত ড্রপশিপিং ব্যবস্থা।</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-bold block">সরাসরি ডেডিকেটেড কার্গো ফ্লাইট ও এক্সপ্রেস শিডিউল:</strong>
                    <span className="text-slate-400 text-xs">সপ্তাহে ৪টি সরাসরি ফ্লাইট — কোনো থার্ড পার্টি বিলম্ব ছাড়া সরাসরি ঢাকায় মালামাল আগমন।</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-bold block">জিরো সিজার গ্যারান্টি ও ট্রান্সপারেন্ট ডিল:</strong>
                    <span className="text-slate-400 text-xs">এইচএস কোড ও কাস্টমস নিয়মানুযায়ী নিখুঁত এসেসমেন্ট — কোনো অনাকাঙ্ক্ষিত জরিমানা নেই।</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-bold block">৬৪ জেলায় হোম/ফ্যাক্টরি ডোর ডেলিভারি:</strong>
                    <span className="text-slate-400 text-xs">ঢাকা, চট্টগ্রাম, সিলেট, বগুড়া, খুলনা, রাজশাহী সহ দেশের প্রতিটি প্রান্তে দ্রুত ডেলিভারি।</span>
                  </div>
                </div>

              </div>

              {/* Direct Contact & Verification Strip */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <span className="flex items-center text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block mr-1.5 animate-pulse" />
                  ২৪/৭ লাইসেন্সড ডেস্কে সরাসরি কল বা মেসেজ দিন
                </span>
                <span className="text-amber-400 font-bold">
                  {rateSettings.whatsappNumber}
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
