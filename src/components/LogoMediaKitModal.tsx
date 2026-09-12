import React, { useState } from 'react';
import { X, Download, Copy, Check, ShieldCheck, Facebook, Sparkles } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface LogoMediaKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber: string;
  email: string;
}

export const LogoMediaKitModal: React.FC<LogoMediaKitModalProps> = ({
  isOpen,
  onClose,
  whatsappNumber,
  email,
}) => {
  const [copied, setCopied] = useState(false);
  const [bioCopied, setBioCopied] = useState(false);

  if (!isOpen) return null;

  const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A"/>
      <stop offset="50%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>
  </defs>
  <rect width="500" height="500" rx="60" fill="url(#bgGrad)"/>
  <polygon points="250,50 430,150 430,350 250,450 70,350 70,150" stroke="url(#gold)" stroke-width="12" fill="#0B132B" stroke-linejoin="round"/>
  <circle cx="250" cy="180" r="22" stroke="url(#gold)" stroke-width="10" fill="none"/>
  <path d="M250 202 L250 330 M180 290 C 180 360, 320 360, 320 290" stroke="url(#gold)" stroke-width="12" stroke-linecap="round"/>
  <line x1="190" y1="230" x2="310" y2="230" stroke="url(#gold)" stroke-width="10" stroke-linecap="round"/>
  <text x="250" y="310" text-anchor="middle" fill="url(#gold)" font-size="60" font-weight="900" font-family="Arial, sans-serif">C&amp;F</text>
  <text x="250" y="405" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="bold" font-family="Arial, sans-serif" letter-spacing="4">CUSTOMS &amp; FORWARDING</text>
  <text x="250" y="425" text-anchor="middle" fill="#F59E0B" font-size="13" font-weight="bold" font-family="Arial, sans-serif" letter-spacing="3">LICENSED C&amp;F AGENT #1048/BD</text>
</svg>`;

  const handleCopySvg = () => {
    navigator.clipboard.writeText(svgCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadSvg = () => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cnf-agent-logo.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyBio = () => {
    navigator.clipboard.writeText(
      `C&F AGENT - Government Licensed Customs C&F Agent (#1048/BD).\nDelivering commercial air & sea cargo from China & Hong Kong directly to your doorstep in Bangladesh.\n100% Legal Customs Clearance at Dhaka Airport (DAC), Chittagong Port (CTG), and Benapole Land Port.\nWhatsApp: ${whatsappNumber} | Email: ${email}`
    );
    setBioCopied(true);
    setTimeout(() => setBioCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5 sm:p-8 text-white my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-amber-400">
              Official Digital Media Kit
            </span>
            <h3 className="text-xl font-black text-white">
              C&amp;F AGENT Logo &amp; Branding
            </h3>
          </div>
        </div>

        {/* Logo Visual Presentation */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <BrandLogo size="xl" variant="dark" />
            <div className="mt-3 text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" /> Official Government Licensed C&amp;F Design
              </p>
              <p>Gold &amp; Navy Prestige Palette: Royal Gold (#F59E0B) + Deep Navy (#0F172A)</p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 w-full sm:w-auto shrink-0">
            <button
              onClick={handleDownloadSvg}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Vector SVG</span>
            </button>

            <button
              onClick={handleCopySvg}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy SVG Vector Code'}</span>
            </button>
          </div>
        </div>

        {/* Facebook Page Setup Guide */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Facebook className="w-4 h-4 text-blue-400" />
            Facebook C&amp;F Agent Page Configuration Recommendations
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5">
              <span className="text-slate-400 block text-[11px] font-semibold mb-1">Recommended Page Name:</span>
              <strong className="text-white text-sm block">C&amp;F Agent - Customs Clearing &amp; Forwarding</strong>
              <span className="text-amber-400 text-[10px] block mt-1">Category: Cargo &amp; Freight Company / Customs Broker</span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5">
              <span className="text-slate-400 block text-[11px] font-semibold mb-1">Contact Details to Put on Page:</span>
              <div className="text-slate-200 font-mono text-xs space-y-0.5">
                <div>WhatsApp: <strong className="text-emerald-400">{whatsappNumber}</strong></div>
                <div>Email: <strong className="text-amber-300">{email}</strong></div>
              </div>
            </div>
          </div>

          {/* Facebook Bio / About Text */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300">Facebook Page About / Bio Copy:</span>
              <button
                onClick={handleCopyBio}
                className="text-[11px] text-amber-400 hover:text-amber-300 underline font-medium"
              >
                {bioCopied ? 'Copied!' : 'Copy Bio'}
              </button>
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "C&amp;F AGENT — বাংলাদেশ সরকার অনুমোদিত লাইসেন্সপ্রাপ্ত কাস্টমস সিএন্ডএফ এজেন্ট। চায়না ও হংকং থেকে এয়ার ও সি কার্গো সরাসরি আপনার গোডাউনে ডেলিভারি। ঢাকা এয়ারপোর্ট, চট্টগ্রাম পোর্ট ও বেনাপোলে ১০০% নিরাপদ কাস্টমস ক্লিয়ারেন্স। কোনো হিডেন চার্জ বা জব্ধ হওয়ার ঝুঁকি নেই।"
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
          >
            Close Media Kit
          </button>
        </div>
      </div>
    </div>
  );
};
