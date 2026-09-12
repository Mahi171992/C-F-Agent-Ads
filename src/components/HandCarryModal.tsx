import React, { useState } from 'react';
import { 
  X, 
  Briefcase, 
  Clock, 
  Zap, 
  CheckCircle2, 
  MessageCircle, 
  Plane, 
  Scale, 
  ShieldAlert, 
  FileText,
  AlertTriangle,
  User,
  Phone,
  Building,
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { RateSettings, Lead } from '../types';
import { 
  generateLeadId, 
  generateRefId, 
  saveLead 
} from '../services/storage';

interface HandCarryModalProps {
  isOpen: boolean;
  onClose: () => void;
  rateSettings: RateSettings;
  onLeadCreated: (lead: Lead) => void;
  onSwitchToAirD2D?: () => void;
}

export type HandCarryRoute = 'ChinaToBD' | 'BDToChina';

export const HandCarryModal: React.FC<HandCarryModalProps> = ({
  isOpen,
  onClose,
  rateSettings,
  onLeadCreated,
  onSwitchToAirD2D,
}) => {
  // 1. Route selection
  const [route, setRoute] = useState<HandCarryRoute>('ChinaToBD');

  // 2. Cargo details
  const [productName, setProductName] = useState('');
  const [weight, setWeight] = useState('5');
  const [urgencyReason, setUrgencyReason] = useState('Urgent Sample / Production Line Spare Parts');

  // 3. Restricted goods question
  const [hasRestrictedGoods, setHasRestrictedGoods] = useState<'no' | 'yes'>('no');

  // 4. Customer info (at end)
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [companyName, setCompanyName] = useState('');

  // Step: 'form' | 'result'
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [createdLead, setCreatedLead] = useState<Lead | null>(null);
  const [errors, setErrors] = useState<{
    productName?: string;
    customerName?: string;
    customerMobile?: string;
  }>({});

  if (!isOpen) return null;

  const numericWeight = parseFloat(weight) || 1;
  const baseFee = rateSettings.handCarryBaseFee || 35000;
  const perKgFee = rateSettings.handCarryPerKgRate || 1800;
  const estimatedTotal = Math.round(baseFee + numericWeight * perKgFee);

  const departureHub = route === 'ChinaToBD' ? 'Guangzhou (CAN), China' : 'Dhaka (DAC), Bangladesh';
  const destinationHub = route === 'ChinaToBD' ? 'Dhaka (DAC), Bangladesh' : 'Guangzhou (CAN), China';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (hasRestrictedGoods === 'yes') {
      return; // blocked by restricted goods
    }

    const newErrors: {
      productName?: string;
      customerName?: string;
      customerMobile?: string;
    } = {};

    if (!productName.trim()) {
      newErrors.productName = 'Please enter product name. (পণ্যের নাম লিখুন)';
    }

    if (!customerName.trim()) {
      newErrors.customerName = 'Please enter your name. (আপনার নাম লিখুন)';
    }

    if (!customerMobile.trim()) {
      newErrors.customerMobile = 'Please enter your Mobile/WhatsApp number. (মোবাইল নম্বর লিখুন)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const refId = generateRefId('SBC-HND');
    const leadId = generateLeadId();

    const newLead: Lead = {
      id: leadId,
      createdAt: new Date().toISOString(),
      serviceType: 'Hand Carry Cargo',
      productName: productName.trim(),
      approximateWeight: numericWeight,
      applicableRate: perKgFee,
      estimatedCargoCharge: estimatedTotal,
      urgency: '1 Day Express (Next Flight)',
      transitTimeOption: '1 Day (24h Courier)',
      additionalDetails: `Route: ${departureHub} → ${destinationHub}, Reason: ${urgencyReason}`,
      name: customerName.trim(),
      mobile: customerMobile.trim(),
      companyName: companyName.trim() || undefined,
      preferredContactMethod: 'WhatsApp',
      leadSource: 'Landing Page',
      estimateRefId: refId,
      status: 'New',
      adminNotes: `Hand Carry 1-Day request: ${departureHub} to ${destinationHub}, ${numericWeight} KG`,
    };

    saveLead(newLead);
    onLeadCreated(newLead);
    setCreatedLead(newLead);
    setStep('result');
  };

  const handleReset = () => {
    setProductName('');
    setWeight('5');
    setHasRestrictedGoods('no');
    setStep('form');
    setErrors({});
  };

  const getWhatsAppMessage = () => {
    return `Hello C&F Agent,

I require urgent Hand Carry Cargo (On-board courier) service:

• Ref ID: ${createdLead?.estimateRefId || 'SBC-HND'}
• Route: ${departureHub} → ${destinationHub}
• Transit Time: 1 Day Express
• Product: ${productName}
• Weight: ${weight} KG
• Purpose / Reason: ${urgencyReason}
• Estimated Cost: ${rateSettings.currencySymbol}${estimatedTotal.toLocaleString()}
• Customer Name: ${customerName}
• Mobile / WhatsApp: ${customerMobile}
${companyName ? `• Company: ${companyName}\n` : ''}
Please verify courier flight availability and immediate airport/warehouse handover instructions.

Thank you.`;
  };

  const cleanPhone = rateSettings.whatsappNumber.replace(/[^0-9]/g, '');
  const whatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(getWhatsAppMessage())}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Hand Carry Express Cargo
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500 text-slate-950">
                  On-Board Courier
                </span>
              </div>
              <p className="text-xs text-amber-400 font-medium">
                Personal Passenger Accompany • Same Day / Next Flight Out
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* TRANSIT TIME PROMINENT HIGHLIGHT */}
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-4 text-slate-950 shadow-md flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-950/10 flex items-center justify-center font-black">
                    <Zap className="w-6 h-6 text-slate-950" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider block">Super Fast Express</span>
                    <span className="text-base sm:text-lg font-black block">
                      ⚡ Transit Time: Only 1 Day (Same Day / 24 Hours)
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold bg-slate-950 text-amber-400 px-2.5 py-1 rounded-full hidden sm:inline-block">
                  Next Flight
                </span>
              </div>

              {/* 1. ROUTE SELECTION (China to BD vs BD to China) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                  ১. শিপমেন্ট রুট সিলেক্ট করুন <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRoute('ChinaToBD')}
                    className={`p-3.5 rounded-xl border text-left transition-colors ${
                      route === 'ChinaToBD'
                        ? 'border-amber-500 bg-amber-50/90 ring-2 ring-amber-500/20 text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">🇨🇳 China → 🇧🇩 Bangladesh</span>
                      {route === 'ChinaToBD' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                    </div>
                    <span className="text-xs font-bold text-amber-700 block mt-1">
                      Departure: Guangzhou (CAN) → Dhaka (DAC)
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">ফ্যাক্টরি স্যাম্পল বা জরুরি স্পেয়ার পার্টস</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRoute('BDToChina')}
                    className={`p-3.5 rounded-xl border text-left transition-colors ${
                      route === 'BDToChina'
                        ? 'border-amber-500 bg-amber-50/90 ring-2 ring-amber-500/20 text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">🇧🇩 Bangladesh → 🇨🇳 China</span>
                      {route === 'BDToChina' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                    </div>
                    <span className="text-xs font-bold text-amber-700 block mt-1">
                      Departure: Dhaka (DAC) → Guangzhou (CAN)
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">গার্মেন্টস মাস্টার স্যাম্পল ও ডকুমেন্টস</span>
                  </button>
                </div>
              </div>

              {/* Departure Hub Note & WhatsApp Address Notice */}
              <div className="bg-slate-100 rounded-xl p-3 text-xs text-slate-700 border border-slate-200">
                <span className="font-bold text-slate-900 block">
                  Departure Hub: {departureHub}
                </span>
                <span className="text-[11px] text-slate-600 block mt-0.5">
                  📍 ওয়্যারহাউস বা এয়ারপোর্ট হ্যান্ডওভারের পূর্ণাঙ্গ ঠিকানার জন্য আমাদের সাথে যোগাযোগ করুন; তাৎক্ষণিক সম্পূর্ণ ঠিকানা ও অন-বোর্ড কুরিয়ার কনটাক্ট প্রদান করা হবে।
                </span>
              </div>

              {/* 2. PROHIBITED / RESTRICTED CARGO CHECK */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                  ২. পণ্যটিতে কি Battery, Liquid, Gas, Magnet বা কোনো নিষিদ্ধ উপাদান আছে? <span className="text-rose-500">*</span>
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setHasRestrictedGoods('no')}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      hasRestrictedGoods === 'no'
                        ? 'border-emerald-500 bg-emerald-50/90 ring-2 ring-emerald-500/20 text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">না (সম্পূর্ণ নিরাপদ / জেনারেল পণ্য)</span>
                      {hasRestrictedGoods === 'no' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      কোনো ব্যাটারি, লিকুইড, ম্যাগনেট বা গ্যাস নেই
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHasRestrictedGoods('yes')}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      hasRestrictedGoods === 'yes'
                        ? 'border-rose-500 bg-rose-50/90 ring-2 ring-rose-500/20 text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-900">হ্যাঁ (ব্যাটারি / লিকুইড / গ্যাস / ম্যাগনেট)</span>
                      {hasRestrictedGoods === 'yes' && <AlertTriangle className="w-4 h-4 text-rose-600" />}
                    </div>
                    <span className="text-[11px] text-rose-600 block mt-1">
                      রেস্ট্রিক্টেড আইটেম অন্তর্ভুক্ত
                    </span>
                  </button>
                </div>

                {/* DECLINE MESSAGE IF RESTRICTED ITEM IS SELECTED */}
                {hasRestrictedGoods === 'yes' && (
                  <div className="mt-3.5 bg-rose-50 border-2 border-rose-400 rounded-xl p-4 text-rose-950 space-y-2">
                    <div className="flex items-start space-x-2.5">
                      <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <div className="text-xs leading-relaxed">
                        <strong className="font-bold block text-rose-900 text-sm mb-1">
                          We are sorry Dear!
                        </strong>
                        এয়ারলাইন্সের আন্তর্জাতিক বিমান নিরাপত্তা ও যাত্রীবাহী কেবিন ব্যাগেজ নিয়মাবলী (IATA Dangerous Goods Regulations) অনুযায়ী ব্যাটারি, লিকুইড, ম্যাগনেট, গ্যাস কিংবা রেস্ট্রিক্টেড কোনো পণ্য হ্যান্ড ক্যারি সার্ভিসে বহন করা সম্পূর্ণ নিষিদ্ধ।
                        <p className="mt-1 text-rose-800 font-medium">
                          এই ধরনের পণ্যের জন্য অনুগ্রহ করে আমাদের <strong>Air D2D Hong Kong</strong> স্পেশাল কার্গো সার্ভিস ব্যবহার করুন।
                        </p>
                      </div>
                    </div>

                    {onSwitchToAirD2D && (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onSwitchToAirD2D();
                          }}
                          className="inline-flex items-center px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow transition-colors"
                        >
                          <span>Switch to Air D2D Hong Kong Route</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 3. PRODUCT DESCRIPTION & WEIGHT (Disabled if restricted) */}
              {hasRestrictedGoods === 'no' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-8">
                      <label htmlFor="hc-product-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Product Description (পণ্যের বিবরণ) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="hc-product-name"
                        type="text"
                        required
                        value={productName}
                        onChange={(e) => {
                          setProductName(e.target.value);
                          if (errors.productName) setErrors({ ...errors, productName: undefined });
                        }}
                        placeholder="যেমন: Urgent Garment Sample, Machine Gear, Medical Device PCB"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none ${
                          errors.productName ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300 focus:border-amber-500 bg-white'
                        }`}
                      />
                      {errors.productName && (
                        <p className="text-xs text-rose-600 mt-1 font-medium">{errors.productName}</p>
                      )}
                    </div>

                    <div className="sm:col-span-4">
                      <label htmlFor="hc-weight" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Weight (ওজন) <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="hc-weight"
                          type="number"
                          step="0.5"
                          min="0.5"
                          max="30"
                          required
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm pr-10 focus:outline-none focus:border-amber-500 bg-white"
                        />
                        <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">KG</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="hc-reason" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Urgency / Purpose (প্রয়োজনীয়তার কারণ)
                    </label>
                    <input
                      id="hc-reason"
                      type="text"
                      value={urgencyReason}
                      onChange={(e) => setUrgencyReason(e.target.value)}
                      placeholder="e.g. Production Line Breakdown / Buyer Meeting Tomorrow"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 bg-white"
                    />
                  </div>

                  {/* 4. CUSTOMER CONTACT DETAILS (Required at End) */}
                  <div className="bg-slate-100/80 border-2 border-amber-400/80 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center">
                        <User className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                        আপনার যোগাযোগের তথ্য (কুরিয়ার বুকিং ও কনফার্মেশনের জন্য)
                      </span>
                      <span className="text-[11px] font-bold text-rose-600">আবশ্যক *</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="hc-customer-name" className="block text-xs font-semibold text-slate-700 mb-1">
                          আপনার নাম (Customer Name) <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            id="hc-customer-name"
                            type="text"
                            required
                            value={customerName}
                            onChange={(e) => {
                              setCustomerName(e.target.value);
                              if (errors.customerName) setErrors({ ...errors, customerName: undefined });
                            }}
                            placeholder="আপনার পূর্ণ নাম"
                            className={`w-full pl-8 pr-3 py-2 text-xs rounded-lg border transition-colors focus:outline-none ${
                              errors.customerName ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300 focus:border-amber-500 bg-white'
                            }`}
                          />
                          <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        </div>
                        {errors.customerName && (
                          <p className="text-[11px] text-rose-600 mt-0.5">{errors.customerName}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="hc-customer-mobile" className="block text-xs font-semibold text-slate-700 mb-1">
                          মোবাইল / WhatsApp নম্বর <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            id="hc-customer-mobile"
                            type="tel"
                            required
                            value={customerMobile}
                            onChange={(e) => {
                              setCustomerMobile(e.target.value);
                              if (errors.customerMobile) setErrors({ ...errors, customerMobile: undefined });
                            }}
                            placeholder="017... / 018..."
                            className={`w-full pl-8 pr-3 py-2 text-xs rounded-lg border transition-colors focus:outline-none ${
                              errors.customerMobile ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300 focus:border-amber-500 bg-white'
                            }`}
                          />
                          <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        </div>
                        {errors.customerMobile && (
                          <p className="text-[11px] text-rose-600 mt-0.5">{errors.customerMobile}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="hc-customer-company" className="block text-xs font-semibold text-slate-700 mb-1">
                        প্রতিষ্ঠানের নাম (Company Name) <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <input
                          id="hc-customer-company"
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="কোম্পানির নাম"
                          className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 bg-white"
                        />
                        <Building className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      </div>
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm sm:text-base shadow-lg transition-colors"
                  >
                    <Briefcase className="w-5 h-5 mr-2" />
                    <span>Get Quick Estimate & Courier Handover</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </>
              )}

            </form>
          ) : (
            /* RESULT SCREEN */
            <div className="space-y-6">
              
              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 border border-slate-800 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <CheckCircle2 className="w-7 h-7 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                      C&amp;F AGENT • HAND CARRY DESK
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      হ্যান্ড ক্যারি কার্গো কোটেশন
                    </h3>
                  </div>
                </div>

                {/* Professional Message with Result */}
                <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 text-xs text-slate-200 leading-relaxed">
                  <p className="font-semibold text-white mb-1">
                    সম্মানিত গ্রাহক, আপনার হ্যান্ড ক্যারি কার্গো অনুরোধটি সফলভাবে গ্রহণ করা হয়েছে।
                  </p>
                  আমাদের ডেডিকেটেড অন-বোর্ড কুরিয়ার টিম প্রতিদিন গুয়াংজু এবং ঢাকা বিমানবন্দরে ফ্লাইট ট্রানজিটের জন্য প্রস্তুত থাকে। ২৪ ঘণ্টার মধ্যে জরুরি পণ্য হ্যান্ডওভারের সম্পূর্ণ প্রক্রিয়া নিশ্চিত করতে নিচের বাটনে ক্লিক করে আমাদের স্পেশালিস্টের সাথে সরাসরি যুক্ত হোন।
                </div>

                {/* Route & Pricing Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700">
                    <span className="text-slate-400 block font-medium">Route</span>
                    <span className="text-sm font-bold text-white block mt-0.5">
                      {route === 'ChinaToBD' ? 'CAN → DAC' : 'DAC → CAN'}
                    </span>
                  </div>

                  <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700">
                    <span className="text-slate-400 block font-medium">Transit Time</span>
                    <span className="text-sm font-bold text-amber-400 block mt-0.5">
                      1 Day Express
                    </span>
                  </div>

                  <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700">
                    <span className="text-slate-400 block font-medium">Product</span>
                    <span className="text-sm font-bold text-white block mt-0.5 truncate" title={productName}>
                      {productName}
                    </span>
                  </div>

                  <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700">
                    <span className="text-slate-400 block font-medium">Weight</span>
                    <span className="text-sm font-bold text-white block mt-0.5">
                      {weight} KG
                    </span>
                  </div>
                </div>

                {/* Charge Calculation */}
                <div className="bg-slate-800/90 border-2 border-amber-500 rounded-2xl p-4 text-center">
                  <span className="text-xs uppercase tracking-widest font-black text-amber-400 block mb-1">
                    Approximate Hand Carry Total
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-white">
                    {rateSettings.currencySymbol}{estimatedTotal.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-slate-300 block mt-1">
                    (Passenger Air Ticket & Visa Base + {rateSettings.currencySymbol}{perKgFee}/KG Cargo Handling)
                  </span>
                </div>

                {/* Ref & Customer */}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800 gap-2">
                  <span>Ref ID: <strong className="text-slate-200 font-mono">{createdLead?.estimateRefId}</strong></span>
                  <span>Lead: <strong className="text-amber-400 font-mono">{createdLead?.id}</strong></span>
                  <span>Client: <strong className="text-slate-200">{customerName} ({customerMobile})</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base shadow-lg transition-colors"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  <span>Confirm Handover & Flight Details on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-300 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
                  <span>Calculate Another Hand Carry</span>
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-5 sm:px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Flight Hubs: Guangzhou Baiyun (CAN) ⇄ Dhaka Shahjalal (DAC)</span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-semibold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
