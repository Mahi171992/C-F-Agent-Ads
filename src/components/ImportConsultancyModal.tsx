import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  CheckCircle2, 
  MessageCircle, 
  FileCheck, 
  Calculator, 
  ShieldCheck, 
  ListChecks, 
  Search, 
  FileText,
  AlertCircle,
  CreditCard,
  User,
  Phone,
  Building,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { RateSettings, Lead } from '../types';
import { 
  generateLeadId, 
  generateRefId, 
  saveLead 
} from '../services/storage';

interface ImportConsultancyModalProps {
  isOpen: boolean;
  onClose: () => void;
  rateSettings: RateSettings;
  onLeadCreated: (lead: Lead) => void;
}

export const ImportConsultancyModal: React.FC<ImportConsultancyModalProps> = ({
  isOpen,
  onClose,
  rateSettings,
  onLeadCreated,
}) => {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('General Goods');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');

  // Selected topics
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'hs_code',
    'customs_valuation',
  ]);

  // Payment details for HS Code / Minimum Value (200 BDT)
  const [trxId, setTrxId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad'>('bKash');

  // Customer Contact Fields (Required at end)
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [companyName, setCompanyName] = useState('');

  // View state
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [createdLead, setCreatedLead] = useState<Lead | null>(null);
  const [errors, setErrors] = useState<{
    productName?: string;
    customerName?: string;
    customerMobile?: string;
    topics?: string;
  }>({});

  if (!isOpen) return null;

  const topicsConfig = [
    { 
      id: 'hs_code', 
      label: 'Exact 8-Digit HS Code Determination (এইচএস কোড নির্ধারণ)',
      badge: 'Expert Analysis • ৳200 Fee',
      isPaid: true
    },
    { 
      id: 'customs_valuation', 
      label: 'Customs Minimum Assessment Value & Duty Calculation (কাস্টমস নির্ধারিত মিনিমাম ভ্যালু ও ট্যাক্স শিট)',
      badge: 'Expert Analysis • ৳200 Fee',
      isPaid: true
    },
    { 
      id: 'bsti_noc', 
      label: 'BSTI / NOC / BTRC / Drug Administration Required Permissions (সার্টিফিকেট ও অনুমোদন যাচাই)',
      badge: 'AI Instant Analysis',
      isPaid: false
    },
    { 
      id: 'ipo_rules', 
      label: 'Import Policy Order (IPO) restrictions & Banned Cargo Check (আমদানি নীতি আদেশ ও নিষিদ্ধ পণ্যের শর্ত)',
      badge: 'AI Instant Analysis',
      isPaid: false
    },
    { 
      id: 'lc_docs', 
      label: 'L/C & Mandatory Customs Documentation Checklist (এলসি ও শিপিং ডকুমেন্টস গাইড)',
      badge: 'AI Instant Analysis',
      isPaid: false
    },
  ];

  const isPaidTopicSelected = selectedTopics.includes('hs_code') || selectedTopics.includes('customs_valuation');

  const toggleTopic = (id: string) => {
    if (selectedTopics.includes(id)) {
      if (selectedTopics.length === 1) return; // keep at least 1
      setSelectedTopics(selectedTopics.filter((t) => t !== id));
    } else {
      setSelectedTopics([...selectedTopics, id]);
    }
  };

  // Instant AI regulatory analyzer based on product name
  const generateRegulatoryInsights = (pName: string) => {
    const text = (pName || '').toLowerCase();
    const insights: {
      categoryDetected: string;
      bstiStatus: string;
      nocStatus: string;
      customsNotes: string;
      documentsRequired: string[];
    } = {
      categoryDetected: 'General Commercial Cargo',
      bstiStatus: 'Standard commercial item (BSTI mandatory certification may not apply if not in 229 listed products).',
      nocStatus: 'Standard Ministry of Commerce Import Policy applies.',
      customsNotes: 'Subject to standard customs examination, Valuation Database assessment, and physical inspection.',
      documentsRequired: ['Commercial Invoice', 'Packing List', 'Letter of Credit (L/C) / TT copy', 'Country of Origin (COO)'],
    };

    if (text.includes('light') || text.includes('led') || text.includes('wire') || text.includes('cable') || text.includes('fan') || text.includes('switch')) {
      insights.categoryDetected = 'Electrical & Electronic Goods';
      insights.bstiStatus = '⚠️ BSTI Mandatory Clearance: Cables, switches, LED lamps require BSTI NOC before customs release.';
      insights.nocStatus = 'Standard technical specification sheet and catalog required.';
      insights.customsNotes = 'Valuation based on per-piece (PCS) or weight whichever is higher as per NBR valuation database.';
      insights.documentsRequired.push('BSTI Test Certificate / NOC', 'Technical Specification Catalog');
    } else if (text.includes('phone') || text.includes('telecom') || text.includes('wifi') || text.includes('wireless') || text.includes('bluetooth') || text.includes('radio') || text.includes('gps')) {
      insights.categoryDetected = 'Telecommunication & Wireless Equipment';
      insights.bstiStatus = 'Not under BSTI, but strictly regulated by BTRC.';
      insights.nocStatus = '⚠️ BTRC NOC Mandatory: Type approval / Import permit must be obtained from BTRC prior to release.';
      insights.customsNotes = 'High customs scrutiny on IMEI/MAC registration.';
      insights.documentsRequired.push('BTRC Import Permit / NOC', 'Manufacturer Compliance Certificate');
    } else if (text.includes('cosmetic') || text.includes('cream') || text.includes('lotion') || text.includes('shampoo') || text.includes('perfume') || text.includes('soap')) {
      insights.categoryDetected = 'Cosmetics & Toiletries';
      insights.bstiStatus = '⚠️ BSTI Compulsory: Skin creams, soaps, and shampoos require mandatory BSTI clearance and laboratory test.';
      insights.nocStatus = 'Ingredients list with chemical breakdown required.';
      insights.customsNotes = 'Minimum Assessment Value (Customs Tariff Value) strictly enforced per KG or per bottle.';
      insights.documentsRequired.push('BSTI Certificate of Conformity', 'Ingredients Certificate', 'Certificate of Analysis (COA)');
    } else if (text.includes('medicine') || text.includes('drug') || text.includes('supplement') || text.includes('vitamin') || text.includes('medical')) {
      insights.categoryDetected = 'Pharmaceutical & Medical Consumables';
      insights.bstiStatus = 'Regulated by Directorate General of Drug Administration (DGDA).';
      insights.nocStatus = '⚠️ DGDA Block List / Recipe Approval: Prior import approval from Drug Administration is mandatory.';
      insights.customsNotes = 'Duty exemption may apply for life-saving raw materials with DGDA recommendation.';
      insights.documentsRequired.push('DGDA Block List Approval', 'GMP Certificate', 'Batch Release Certificate');
    } else if (text.includes('food') || text.includes('fruit') || text.includes('chocolate') || text.includes('oil') || text.includes('snack') || text.includes('candy')) {
      insights.categoryDetected = 'Food & Agro Products';
      insights.bstiStatus = '⚠️ BSTI Certificate & Bangladesh Atomic Energy Commission (BAEC) Radiation Certificate required.';
      insights.nocStatus = 'Plant Quarantine / Animal Quarantine clearance at port of arrival.';
      insights.customsNotes = 'Must have minimum 60% shelf life remaining at the time of customs assessment.';
      insights.documentsRequired.push('BSTI Quality Certificate', 'Radioactivity Testing Report (BAEC)', 'Phytosanitary Certificate');
    }

    return insights;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: {
      productName?: string;
      customerName?: string;
      customerMobile?: string;
      topics?: string;
    } = {};

    if (!productName.trim()) {
      newErrors.productName = 'Please enter Product Name. (পণ্যের নাম দিন)';
    }

    if (selectedTopics.length === 0) {
      newErrors.topics = 'Please select at least one topic. (একটি টপিক নির্বাচন করুন)';
    }

    if (!customerName.trim()) {
      newErrors.customerName = 'Please enter your name. (আপনার নাম দিন)';
    }

    if (!customerMobile.trim()) {
      newErrors.customerMobile = 'Please enter your Mobile/WhatsApp number. (মোবাইল নম্বর দিন)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const refId = generateRefId('SBC-CNS');
    const leadId = generateLeadId();

    const selectedTopicLabels = selectedTopics.map(
      (id) => topicsConfig.find((t) => t.id === id)?.label || id
    );

    const newLead: Lead = {
      id: leadId,
      createdAt: new Date().toISOString(),
      serviceType: 'Import Consultancy',
      productName: productName.trim(),
      consultancyTopics: selectedTopicLabels,
      applicableRate: isPaidTopicSelected ? 200 : 0,
      estimatedCargoCharge: isPaidTopicSelected ? 200 : 0,
      trxId: trxId.trim() || undefined,
      additionalDetails: `Category: ${category}, Value: ${estimatedValue || 'N/A'}, TrxID: ${trxId || 'Pending'}, Notes: ${additionalDetails}`,
      name: customerName.trim(),
      mobile: customerMobile.trim(),
      companyName: companyName.trim() || undefined,
      preferredContactMethod: 'WhatsApp',
      leadSource: 'Landing Page',
      estimateRefId: refId,
      status: 'New',
      adminNotes: `Client inquiring on: ${selectedTopicLabels.join('; ')}. Payment TrxID: ${trxId || 'None'}`,
    };

    saveLead(newLead);
    onLeadCreated(newLead);
    setCreatedLead(newLead);
    setStep('result');
  };

  const handleReset = () => {
    setProductName('');
    setEstimatedValue('');
    setAdditionalDetails('');
    setTrxId('');
    setStep('form');
    setErrors({});
  };

  const insights = generateRegulatoryInsights(productName);

  const getWhatsAppMessage = () => {
    const topicLabels = selectedTopics.map((id) => {
      const item = topicsConfig.find((t) => t.id === id);
      return item ? `• ${item.label}` : id;
    }).join('\n');

    return `Hello C&F Agent (Customs Consultancy Desk),

I need professional Import Customs & Tariff Consultancy:

• Ref ID: ${createdLead?.estimateRefId || 'SBC-CNS'}
• Product Name: ${productName}
• Category: ${category}
${estimatedValue ? `• Invoice / Target Value: $${estimatedValue} USD\n` : ''}
Inquiry Topics:
${topicLabels}

${isPaidTopicSelected ? `• HS Code Assessment Fee: ৳200 via ${paymentMethod}\n• Payment TrxID: ${trxId || 'Will send screenshot'}\n` : ''}
• Client: ${customerName}
• Mobile: ${customerMobile}
${companyName ? `• Company: ${companyName}\n` : ''}
Please verify the NBR Minimum Assessment Value, HS Code, and provide the official duty assessment sheet.

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
            <div className="w-9 h-9 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Import Consultancy & Tariff
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-500 text-white">
                  Expert C&F Desk
                </span>
              </div>
              <p className="text-xs text-purple-300 font-medium">
                HS Code • Customs Minimum Value • BSTI & IPO Rules
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
              
              {/* Introduction Banner */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-xs sm:text-sm text-purple-950 flex items-start justify-between">
                <div>
                  <span className="font-bold block text-purple-950">
                    আমদানি সংক্রান্ত তথ্যের জন্য আপনার পণ্যের নাম ও কাঙ্ক্ষিত বিষয় সিলেক্ট করুন
                  </span>
                  <span className="text-xs text-purple-800 block mt-1">
                    কাস্টমস অনুমোদিত সিএন্ডএফ কনসালট্যান্ট ও এআই রেগুলেটরি অ্যানালাইসিস এর সমন্বয়ে তাৎক্ষণিক দিকনির্দেশনা পান।
                  </span>
                </div>
                <Sparkles className="w-5 h-5 text-purple-600 shrink-0 ml-2 mt-0.5" />
              </div>

              {/* 1. Product Name & Estimated Value */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8">
                  <label htmlFor="cns-product-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Product Name (পণ্যের নাম) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="cns-product-name"
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => {
                      setProductName(e.target.value);
                      if (errors.productName) setErrors({ ...errors, productName: undefined });
                    }}
                    placeholder="যেমন: LED Strip Light, Face Wash, Solar Inverter, Machinery"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none ${
                      errors.productName ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300 focus:border-purple-500 bg-white'
                    }`}
                  />
                  {errors.productName && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{errors.productName}</p>
                  )}
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="cns-invoice-val" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Invoice Value ($ USD) <span className="text-slate-400 font-normal">(ঐচ্ছিক)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="cns-invoice-val"
                      type="number"
                      value={estimatedValue}
                      onChange={(e) => setEstimatedValue(e.target.value)}
                      placeholder="e.g. 5000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm pr-10 focus:outline-none focus:border-purple-500 bg-white"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">USD</span>
                  </div>
                </div>
              </div>

              {/* 2. Topic Checklist ("ki ki jante chay") */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                  কী কী জানতে চান নির্বাচন করুন: <span className="text-rose-500">*</span>
                </label>

                <div className="space-y-2.5">
                  {topicsConfig.map((item) => {
                    const isSelected = selectedTopics.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleTopic(item.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-colors flex items-start justify-between ${
                          isSelected
                            ? 'border-purple-500 bg-purple-50/80 ring-2 ring-purple-500/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start space-x-2.5">
                          <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border shrink-0 ${
                            isSelected ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block leading-snug">
                              {item.label}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                          item.isPaid 
                            ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}>
                          {item.badge}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. HS Code & Minimum Value Payment Notice (200 BDT via bKash / Nagad) */}
              {isPaidTopicSelected && (
                <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-4 text-amber-950 space-y-3">
                  <div className="flex items-start space-x-2.5">
                    <CreditCard className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed">
                      <strong className="font-bold text-sm text-amber-950 block mb-1">
                        এইচএস কোড ও কাস্টমস মিনিমাম অ্যাসেসমেন্ট ভ্যালু সংক্রান্ত নিয়ম:
                      </strong>
                      এইচএস কোড এবং কাস্টমস নির্ধারিত মিনিমাম ট্যারিফ ভ্যালু বাংলাদেশ কাস্টমস অ্যাসেসমেন্ট ডাটাবেজ ও এনবিআরের স্থায়ী আদেশের ওপর নির্ভর করে যা একজন লাইসেন্সপ্রাপ্ত সিএন্ডএফ এক্সপার্ট কর্তৃক ভেরিফাই করতে হয়।
                      <p className="mt-1 font-bold text-amber-900">
                        অফিসিয়াল নিয়ম অনুযায়ী প্রতি এইচএস কোডের সঠিক মিনিমাম ভ্যালু ও ডিউটি ট্যাক্স শিট পেতে ২০০ টাকা বিকাশ পার্সোনাল অথবা নগদ পার্সোনাল-এ Send Money করে ট্রানজেকশন আইডি দিন।
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-amber-300 text-xs flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] text-slate-500 block font-semibold">bKash / Nagad Personal Number</span>
                      <span className="text-sm font-black text-slate-900 tracking-wider">01842-000000</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bKash')}
                        className={`px-3 py-1 rounded text-xs font-bold ${
                          paymentMethod === 'bKash' ? 'bg-pink-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        bKash
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Nagad')}
                        className={`px-3 py-1 rounded text-xs font-bold ${
                          paymentMethod === 'Nagad' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        Nagad
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cns-trxid" className="block text-xs font-semibold text-amber-950 mb-1">
                      Transaction ID (TrxID) / স্ক্রিনশট রেফারেন্স <span className="text-slate-500 font-normal">(পাঠিয়ে থাকলে লিখুন অথবা হোয়াটসঅ্যাপে পাঠান)</span>
                    </label>
                    <input
                      id="cns-trxid"
                      type="text"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="e.g. 9J8A7K2D1"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-amber-300 bg-white focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>
              )}

              {/* 4. Customer Contact Details (Mandatory at end) */}
              <div className="bg-slate-100/80 border-2 border-purple-400/80 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center">
                    <User className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
                    আপনার যোগাযোগের তথ্য (অফিসিয়াল পরামর্শের জন্য)
                  </span>
                  <span className="text-[11px] font-bold text-rose-600">আবশ্যক *</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="cns-customer-name" className="block text-xs font-semibold text-slate-700 mb-1">
                      আপনার নাম (Customer Name) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="cns-customer-name"
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => {
                          setCustomerName(e.target.value);
                          if (errors.customerName) setErrors({ ...errors, customerName: undefined });
                        }}
                        placeholder="আপনার পূর্ণ নাম"
                        className={`w-full pl-8 pr-3 py-2 text-xs rounded-lg border transition-colors focus:outline-none ${
                          errors.customerName ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300 focus:border-purple-500 bg-white'
                        }`}
                      />
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                    {errors.customerName && (
                      <p className="text-[11px] text-rose-600 mt-0.5">{errors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="cns-customer-mobile" className="block text-xs font-semibold text-slate-700 mb-1">
                      মোবাইল / WhatsApp নম্বর <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="cns-customer-mobile"
                        type="tel"
                        required
                        value={customerMobile}
                        onChange={(e) => {
                          setCustomerMobile(e.target.value);
                          if (errors.customerMobile) setErrors({ ...errors, customerMobile: undefined });
                        }}
                        placeholder="017... / 018..."
                        className={`w-full pl-8 pr-3 py-2 text-xs rounded-lg border transition-colors focus:outline-none ${
                          errors.customerMobile ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300 focus:border-purple-500 bg-white'
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
                  <label htmlFor="cns-company" className="block text-xs font-semibold text-slate-700 mb-1">
                    প্রতিষ্ঠানের নাম (Company Name) <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="cns-company"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="ব্যবসায়িক প্রতিষ্ঠানের নাম"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-500 bg-white"
                    />
                    <Building className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-600 hover:to-purple-700 text-white font-black text-sm sm:text-base shadow-lg transition-colors"
              >
                <HelpCircle className="w-5 h-5 mr-2" />
                <span>Get Quick Estimate & Consultancy Analysis</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>

            </form>
          ) : (
            /* RESULT SCREEN */
            <div className="space-y-6">
              
              {/* Report Header Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 border border-slate-800 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                    <FileCheck className="w-7 h-7 text-purple-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wide">
                      C&amp;F AGENT • CUSTOMS DESK
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      ইমপোর্ট কনসালটেন্সি ও ট্যারিফ সামারি
                    </h3>
                  </div>
                </div>

                {/* Inquiry Overview */}
                <div className="bg-slate-800/90 rounded-xl p-4 border border-slate-700 text-xs space-y-2">
                  <div className="flex justify-between border-b border-slate-700 pb-2">
                    <span className="text-slate-400">Product Name:</span>
                    <strong className="text-white text-sm">{productName}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-700 pb-2">
                    <span className="text-slate-400">Detected Category:</span>
                    <strong className="text-purple-300">{insights.categoryDetected}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Client:</span>
                    <span className="text-slate-200">{customerName} ({customerMobile})</span>
                  </div>
                </div>

                {/* AI INSTANT REGULATORY INSIGHTS */}
                <div className="bg-slate-800/70 border border-purple-500/30 rounded-xl p-4 space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center space-x-2 text-purple-400 font-bold">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Regulatory Analysis for {productName}:</span>
                  </div>
                  
                  <div className="p-2.5 bg-slate-900/80 rounded-lg space-y-1.5">
                    <div className="font-semibold text-slate-200">BSTI / Quality Certification:</div>
                    <p className="text-slate-400">{insights.bstiStatus}</p>
                  </div>

                  <div className="p-2.5 bg-slate-900/80 rounded-lg space-y-1.5">
                    <div className="font-semibold text-slate-200">Regulatory Approvals & Import Policy:</div>
                    <p className="text-slate-400">{insights.nocStatus}</p>
                  </div>

                  <div className="p-2.5 bg-slate-900/80 rounded-lg space-y-1.5">
                    <div className="font-semibold text-slate-200">Required Customs Clearance Documents:</div>
                    <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                      {insights.documentsRequired.map((doc, idx) => (
                        <li key={idx}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* HS Code & Minimum Value status */}
                {isPaidTopicSelected && (
                  <div className="bg-amber-950/70 border border-amber-500/40 rounded-xl p-4 text-xs text-amber-200 space-y-2">
                    <div className="flex items-center space-x-2 font-bold text-amber-400">
                      <CreditCard className="w-4 h-4" />
                      <span>HS Code & Customs Minimum Value Verification Desk</span>
                    </div>
                    <p className="leading-relaxed">
                      আপনার নির্বাচিত HS Code এবং কাস্টমস নির্ধারিত মিনিমাম ভ্যালুর (Customs Assessment Database Value) জন্য আমাদের সিনিয়র সিএন্ডএফ এক্সপার্ট বিস্তারিত রিপোর্ট প্রস্তুত করছেন।
                    </p>
                    <div className="bg-amber-900/40 p-2.5 rounded-lg border border-amber-700/50">
                      <span>ফি স্ট্যাটাস: <strong>৳২০০ (টাকা)</strong> {trxId ? `• TrxID: ${trxId}` : '• হোয়াটসঅ্যাপে স্ক্রিনশট বা TrxID পাঠান'}</span>
                    </div>
                  </div>
                )}

                {/* Ref IDs */}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800 gap-2">
                  <span>Ref ID: <strong className="text-slate-200 font-mono">{createdLead?.estimateRefId}</strong></span>
                  <span>Lead: <strong className="text-purple-400 font-mono">{createdLead?.id}</strong></span>
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
                  <span>Send Inquiry to C&F Consultant on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-300 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
                  <span>Inquire Another Product</span>
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-5 sm:px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Licensed Customs C&F Agent #1048/BD • Chittagong & Dhaka Customs House</span>
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
