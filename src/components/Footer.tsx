import React from 'react';
import { ShieldCheck, Phone, Mail, MapPin, MessageCircle, Clock, Plane, Facebook, CheckCircle2 } from 'lucide-react';
import { RateSettings } from '../types';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onOpenCalculator: () => void;
  onOpenAdmin: () => void;
  onOpenMediaKit?: () => void;
  rateSettings: RateSettings;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenCalculator,
  onOpenAdmin,
  onOpenMediaKit,
  rateSettings,
}) => {
  const cleanPhone = rateSettings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <footer id="contact" className="bg-slate-950 text-slate-400 border-t border-slate-800">
      {/* Upper CTA Banner - Persuasive Conversion Hook */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <span className="text-xs uppercase tracking-wider font-extrabold text-amber-400 flex items-center justify-center md:justify-start gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              লাইসেন্সপ্রাপ্ত কাস্টমস সিএন্ডএফ এজেন্টের সাথে সরাসরি যোগাযোগ
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              আপনার কনসাইনমেন্টের জন্য সেরা স্পেশাল রেট ও কাস্টমস এসেসমেন্ট নিন
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              পণ্য আটক বা অনাকাঙ্ক্ষিত জরিমানার কোনো ঝুঁকি নেই — আমরা সরাসরি ঢাকা এয়ারপোর্ট ও চট্টগ্রাম পোর্টে নিজস্ব টিমে সম্পূর্ণ দায়িত্ব নিই।
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hello C&F Agent,\nI need commercial customs clearance & cargo delivery for my goods.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 flex items-center transition-all hover:scale-[1.02]"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              <span>WhatsApp: {rateSettings.whatsappNumber}</span>
            </a>

            <button
              onClick={onOpenCalculator}
              className="px-5 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              কাস্টমস কোটেশন রিকোয়েস্ট
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Offices */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          
          {/* Col 1: About & Official C&F Credentials */}
          <div className="space-y-4">
            <div className="flex items-center">
              <BrandLogo size="md" variant="dark" />
            </div>

            <p className="text-xs leading-relaxed text-slate-400">
              গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত লাইসেন্সপ্রাপ্ত কাস্টমস ক্লিয়ারিং অ্যান্ড ফরোয়ার্ডিং (C&F) এজেন্ট। চায়না ও হংকং থেকে এয়ার ও সি কার্গো সরাসরি আপনার গোডাউনে ডেলিভারি।
            </p>

            <div className="space-y-1.5 pt-1 text-xs">
              <div className="inline-flex items-center text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-amber-400" />
                Gov't License #1048/BD
              </div>
              <div className="text-[11px] text-slate-400 block">
                Member: Dhaka Customs Agents Association (DACFAA)
              </div>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              লজিস্টিকস ও কাস্টমস সার্ভিস
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <a 
                  href="#services" 
                  className="hover:text-amber-400 transition-colors flex items-center font-bold text-amber-400"
                >
                  Customs Clearing (DAC, CTG, Benapole)
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-amber-400 transition-colors">
                  China & HK Air D2D Cargo (3-5 Days)
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-amber-400 transition-colors">
                  Sea D2D Cargo (LCL / FCL Container)
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-amber-400 transition-colors">
                  Supplier Payment (1688 / WeChat / Alipay)
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-amber-400 transition-colors">
                  Hand Carry Super Express (24-48 Hours)
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-amber-400 transition-colors">
                  Import Policy & HS Code Advisory Desk
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Registered Offices & Port Locations */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              কাস্টমস ও অফিস লোকেশন
            </h5>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">হেড অফিস — ঢাকা</strong>
                  <span>Motijheel Commercial Area, Dhaka-1000, Bangladesh</span>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">এয়ারপোর্ট কার্গো অফিস (DAC)</strong>
                  <span>Cargo Village, Hazrat Shahjalal Int'l Airport, Dhaka</span>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">চট্টগ্রাম কাস্টমস পোর্ট অফিস</strong>
                  <span>Agrabad Commercial Area, Chattogram Custom House</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Direct Contact, Email & Facebook */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              অফিশিয়াল যোগাযোগ
            </h5>
            <div className="space-y-2.5 text-xs">
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-emerald-400 hover:text-emerald-300 font-bold"
              >
                <MessageCircle className="w-4 h-4 mr-2 shrink-0" />
                <span>হোয়াটসঅ্যাপ: {rateSettings.whatsappNumber}</span>
              </a>

              <a
                href={`tel:${rateSettings.whatsappNumber}`}
                className="flex items-center text-slate-200 hover:text-white font-medium"
              >
                <Phone className="w-4 h-4 mr-2 text-amber-400 shrink-0" />
                <span>হটলাইন: {rateSettings.whatsappNumber}</span>
              </a>

              <a
                href={`mailto:${rateSettings.email}`}
                className="flex items-center text-slate-300 hover:text-amber-400"
              >
                <Mail className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                <span>ইমেইল: {rateSettings.email}</span>
              </a>

              <div className="flex items-center text-blue-400 pt-1">
                <Facebook className="w-4 h-4 mr-2 text-blue-400 shrink-0" />
                <span className="font-semibold">{rateSettings.facebookPage}</span>
              </div>

              <div className="flex items-center text-slate-400 text-[11px] pt-1">
                <Clock className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
                <span>২৪/৭ ডেডিকেটেড অপারেশনস ডেস্ক</span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800 flex flex-wrap gap-3">
              {onOpenMediaKit && (
                <button
                  onClick={onOpenMediaKit}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center font-semibold"
                >
                  <span>লোগো ও ফেসবুক মিডিয়া কিট</span>
                </button>
              )}
              <button
                onClick={onOpenAdmin}
                className="text-xs text-slate-400 hover:text-amber-400 flex items-center font-medium transition-colors"
              >
                <span>স্টাফ ও সিআরএম অ্যাডমিন পোর্টাল</span>
              </button>
            </div>
          </div>

        </div>

        {/* Legal disclaimer & Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>
            © {new Date().getFullYear()} {rateSettings.companyName}. সর্বস্বত্ব সংরক্ষিত। বাংলাদেশ কাস্টমস লাইসেন্সপ্রাপ্ত ক্লিয়ারিং অ্যান্ড ফরোয়ার্ডিং (C&F) এজেন্ট।
          </p>
          <p className="text-right text-[10px] text-slate-500 max-w-md">
            আমদানিকৃত পণ্যের প্রযোজ্য শুল্ক ও চার্জ কাস্টমস হাউসের অফিসিয়াল অ্যাসেসমেন্ট এবং পণ্যের প্রকৃত ও ভলিউম্যাট্রিক ওজনের উপর নির্ধারিত হয়।
          </p>
        </div>
      </div>
    </footer>
  );
};
