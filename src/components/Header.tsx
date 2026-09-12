import React from 'react';
import { ShieldCheck, MessageCircle, Phone, Mail, Lock, Plane, Calculator, Sparkles, FileCheck } from 'lucide-react';
import { RateSettings } from '../types';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  onOpenCalculator: () => void;
  onOpenAdmin: () => void;
  onOpenMediaKit?: () => void;
  rateSettings: RateSettings;
  leadsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCalculator,
  onOpenAdmin,
  onOpenMediaKit,
  rateSettings,
  leadsCount,
}) => {
  const cleanPhone = rateSettings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-800 text-white shadow-md">
      {/* Top emergency / quick contact strip */}
      <div className="bg-slate-950 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center text-amber-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Gov't Licensed Customs C&F Agent #1048/BD
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-300">
              China & Hong Kong → Bangladesh Direct Clearance & Door Delivery
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href={`mailto:${rateSettings.email}`}
              className="hidden md:inline-flex items-center text-slate-300 hover:text-amber-400 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 mr-1 text-amber-400" />
              <span>{rateSettings.email}</span>
            </a>
            <span className="hidden md:inline text-slate-700">|</span>
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-emerald-400 hover:text-emerald-300 transition-colors font-bold"
            >
              <MessageCircle className="w-3.5 h-3.5 mr-1" />
              <span>WhatsApp: {rateSettings.whatsappNumber}</span>
            </a>
            {onOpenMediaKit && (
              <button
                onClick={onOpenMediaKit}
                className="hidden lg:inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded text-[11px] font-semibold border border-amber-500/30"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                <span>Logo & Brand Kit</span>
              </button>
            )}
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center text-slate-300 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded text-xs border border-slate-700"
              title="Admin Portal (Lead CRM & Rates)"
            >
              <Lock className="w-3 h-3 mr-1 text-amber-400" />
              <span>Admin CRM</span>
              {leadsCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-full">
                  {leadsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Identity with Official Crest Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <BrandLogo size="md" variant="dark" />
          </div>

          {/* Nav Links & Action CTAs */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
            <a href="#services" className="hover:text-amber-400 transition-colors">
              আমাদের সার্ভিসসমূহ
            </a>
            <a href="#why-us" className="hover:text-amber-400 transition-colors">
              কেন সিএন্ডএফ এজেন্ট বিশ্বস্ত?
            </a>
            <a href="#contact" className="hover:text-amber-400 transition-colors">
              পোর্ট ও যোগাযোগ
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenCalculator}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <FileCheck className="w-4 h-4 mr-1.5" />
              <span>কাস্টমস ও কার্গো কোটেশন</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
