import React, { useState, useRef } from 'react';
import { 
  X, 
  Plane, 
  AlertTriangle, 
  Calculator, 
  CheckCircle2, 
  ArrowRight, 
  MessageCircle, 
  Edit3, 
  RotateCcw, 
  UploadCloud, 
  FileText, 
  ShieldAlert, 
  User, 
  Phone, 
  Building,
  Info,
  Briefcase,
  Sparkles,
  Lock
} from 'lucide-react';
import { 
  ShippingOrigin, 
  ProductCategory, 
  RateSettings, 
  EstimateResult, 
  Lead 
} from '../types';
import { 
  checkRestrictedGoods, 
  generateRefId, 
  generateLeadId, 
  saveLead 
} from '../services/storage';
import { 
  classifyProductCompliance, 
  ProductComplianceResult 
} from '../services/productAiClassifier';

interface AirD2DEstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  rateSettings: RateSettings;
  onLeadCreated: (newLead: Lead) => void;
}

export type CargoNature = 'general' | 'battery_liquid_magnet' | 'brand_copy' | 'hand_carry_express' | 'other_country';

export const AirD2DEstimateModal: React.FC<AirD2DEstimateModalProps> = ({
  isOpen,
  onClose,
  rateSettings,
  onLeadCreated,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargo Nature & Route determination
  const [cargoNature, setCargoNature] = useState<CargoNature>('general');
  const [shippingFrom, setShippingFrom] = useState<ShippingOrigin>('China');
  const [otherCountryName, setOtherCountryName] = useState('');
  const [useHandCarry, setUseHandCarry] = useState(false);

  // Form states
  const [productName, setProductName] = useState('');
  const [weight, setWeight] = useState<string>('');
  const [productCategory, setProductCategory] = useState<ProductCategory>('General Goods');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);

  // Customer Contact Fields (Mandatory for Lead capture)
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [companyName, setCompanyName] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<{ 
    productName?: string; 
    weight?: string; 
    customerName?: string; 
    customerMobile?: string; 
  }>({});

  // View mode: 'form' | 'result'
  const [viewMode, setViewMode] = useState<'form' | 'result'>('form');
  const [estimateResult, setEstimateResult] = useState<EstimateResult | null>(null);
  const [savedLeadId, setSavedLeadId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Real-time AI Compliance evaluation (Prohibited vs Restricted vs Allowed)
  const compliance: ProductComplianceResult = classifyProductCompliance(productName, productCategory);

  // Real-time keyword check
  const combinedText = `${productName} ${additionalDetails} ${productCategory === 'Electronics' ? 'electronics' : ''}`;
  const restrictionCheck = checkRestrictedGoods(combinedText);

  // Handle cargo nature change and automatically set the appropriate route
  const handleCargoNatureChange = (nature: CargoNature) => {
    setCargoNature(nature);
    if (nature === 'general') {
      setShippingFrom('China');
      setUseHandCarry(false);
    } else if (nature === 'battery_liquid_magnet') {
      setShippingFrom('Hong Kong');
    } else if (nature === 'brand_copy') {
      setShippingFrom('Hong Kong');
    } else if (nature === 'hand_carry_express') {
      setShippingFrom('China');
      setUseHandCarry(true);
    } else if (nature === 'other_country') {
      setShippingFrom('Other Country');
      setUseHandCarry(false);
    }
  };

  // Calculate applicable rate taking into account Hand Carry vs Air D2D, and Sensitive Goods
  const isHandCarrySelected = useHandCarry || cargoNature === 'hand_carry_express';
  const isSensitiveCargo = cargoNature === 'battery_liquid_magnet' || cargoNature === 'brand_copy' || compliance.status === 'restricted';

  const getEffectiveRate = (): number => {
    if (isHandCarrySelected) {
      if (isSensitiveCargo) {
        return rateSettings.handCarrySensitiveRate || 2200;
      }
      return rateSettings.handCarryPerKgRate || 1800;
    }
    if (shippingFrom === 'China') return rateSettings.chinaRate;
    if (shippingFrom === 'Hong Kong') return rateSettings.hongKongRate;
    return rateSettings.chinaRate;
  };

  const handlePhotoUpload = (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Photo size should be less than 5MB');
      return;
    }
    setPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoUpload(e.dataTransfer.files[0]);
    }
  };

  // Form submission: Calculate My Estimate & Capture Lead
  const handleCalculateEstimate = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { 
      productName?: string; 
      weight?: string; 
      customerName?: string; 
      customerMobile?: string; 
    } = {};

    if (!productName.trim()) {
      newErrors.productName = 'Product name is required (পণ্যের নাম দিন)';
    }

    const numericWeight = parseFloat(weight);
    if (isNaN(numericWeight) || numericWeight <= 0) {
      newErrors.weight = 'Weight must be greater than 0 KG (সঠিক ওজন লিখুন)';
    }

    if (!customerName.trim()) {
      newErrors.customerName = 'Please enter your name (আপনার নাম দিন)';
    }

    if (!customerMobile.trim()) {
      newErrors.customerMobile = 'Please enter your Mobile/WhatsApp number (মোবাইল নম্বর দিন)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (compliance.isBlocked) {
      alert('সতর্কবার্তা: এই পণ্যটি বাংলাদেশ কাস্টমস আইন ও আন্তর্জাতিক বিমান নিরাপত্তা বিধিমালার আওতায় সম্পূর্ণ নিষিদ্ধ (Prohibited Goods)। এটি এয়ার কার্গো বা হ্যান্ড ক্যারি কোনো মাধ্যমেই আনা সম্ভব নয়।');
      return;
    }

    setErrors({});

    const currentRate = getEffectiveRate();
    const cargoCharge = Math.round(numericWeight * currentRate);
    const refId = generateRefId(isHandCarrySelected ? 'SBC-HC' : 'SBC-AIR');
    const leadId = generateLeadId();
    const activeServiceType = isHandCarrySelected ? 'Hand Carry Cargo' : 'Air D2D Cargo';

    const result: EstimateResult = {
      refId,
      serviceType: activeServiceType,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      shippingFrom,
      productName: productName.trim(),
      productCategory,
      weight: numericWeight,
      applicableRate: currentRate,
      estimatedCargoCharge: cargoCharge,
      additionalDetails: `Nature: ${cargoNature}, HandCarry: ${isHandCarrySelected ? 'YES (Hong Kong/China Express)' : 'NO'}, Details: ${additionalDetails.trim()}${otherCountryName ? `, Custom Origin: ${otherCountryName}` : ''}`,
      productPhoto: photoPreview || undefined,
      hasRestrictedKeywords: restrictionCheck.isRestricted || compliance.status === 'restricted',
      restrictedKeywordsFound: [...restrictionCheck.matched, ...(compliance.status === 'restricted' ? compliance.matchedKeywords : [])],
    };

    // Save lead immediately for Lead Collection
    const newLead: Lead = {
      id: leadId,
      createdAt: new Date().toISOString(),
      serviceType: activeServiceType,
      shippingFrom,
      productName: productName.trim(),
      productCategory,
      approximateWeight: numericWeight,
      applicableRate: currentRate,
      estimatedCargoCharge: cargoCharge,
      additionalDetails: `Nature: ${cargoNature}, HandCarry: ${isHandCarrySelected ? 'YES (Hong Kong/China Express)' : 'NO'}, Origin: ${shippingFrom}, Details: ${additionalDetails.trim()}`,
      productPhotoReference: photoName || undefined,
      name: customerName.trim(),
      mobile: customerMobile.trim(),
      companyName: companyName.trim() || undefined,
      preferredContactMethod: 'WhatsApp',
      leadSource: 'Landing Page',
      estimateRefId: refId,
      status: 'New',
      adminNotes: compliance.status === 'restricted'
        ? `Sensitive/Restricted alert: ${compliance.matchedKeywords.join(', ') || compliance.titleBengali}. HandCarry: ${isHandCarrySelected ? 'YES' : 'NO'}`
        : restrictionCheck.isRestricted 
        ? `Restricted alert: ${restrictionCheck.matched.join(', ')}` 
        : `Cargo Nature: ${cargoNature}`,
    };

    saveLead(newLead);
    onLeadCreated(newLead);
    setSavedLeadId(leadId);

    setEstimateResult(result);
    setViewMode('result');
  };

  const handleResetForm = () => {
    setProductName('');
    setWeight('');
    setAdditionalDetails('');
    setProductCategory('General Goods');
    setPhotoPreview(null);
    setPhotoName(null);
    setEstimateResult(null);
    setCargoNature('general');
    setShippingFrom('China');
    setUseHandCarry(false);
    setViewMode('form');
    setErrors({});
  };

  const formattedEstimateCharge = estimateResult 
    ? `${rateSettings.currencySymbol}${estimateResult.estimatedCargoCharge.toLocaleString()}`
    : '';

  // Generate WhatsApp message with all quotation details
  const getWhatsAppMessage = () => {
    if (!estimateResult) return '';
    return `Hello C&F Agent,

I want to confirm an official quotation for ${estimateResult.serviceType}:

• Ref ID: ${estimateResult.refId}
• Product Name: ${estimateResult.productName}
• Service Type: ${estimateResult.serviceType}${isHandCarrySelected ? ' (২৪-৪৮ ঘণ্টা এক্সপ্রেস ডেলিভারি)' : ''}
• Shipping Route: ${estimateResult.shippingFrom} → Bangladesh
• Gross Weight: ${estimateResult.weight} KG
• Rate Applied: ৳${estimateResult.applicableRate} / KG
• Estimated Total Charge: ${formattedEstimateCharge}
• Customer Name: ${customerName}
• Mobile / WhatsApp: ${customerMobile}
${companyName ? `• Company: ${companyName}\n` : ''}
Please verify the final rate, customs category, and provide warehouse/drop-off instructions in ${estimateResult.shippingFrom}.

Thank you.`;
  };

  const cleanPhone = rateSettings.whatsappNumber.replace(/[^0-9]/g, '');
  const whatsAppDirectUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(getWhatsAppMessage())}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  Air D2D Cargo
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500 text-slate-950">
                  Smart Estimate
                </span>
              </div>
              <p className="text-xs text-amber-400 font-medium">
                China / Hong Kong → Bangladesh Door Delivery
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

        {/* Modal Body with scrollable content */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
          
          {viewMode === 'form' ? (
            /* ========================================================================= */
            /* 1. SHIPMENT & CONTACT FORM                                                */
            /* ========================================================================= */
            <form onSubmit={handleCalculateEstimate} className="space-y-5">
              
              {/* Header Box in Bengali */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs sm:text-sm text-amber-950">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-amber-950 text-sm block">
                      আপনার পণ্যের তথ্য দিন এবং আনুমানিক শিপমেন্ট খরচ দেখুন।
                    </span>
                    <span className="text-xs text-amber-800 mt-1 block">
                      সঠিক রেট ও অফিশিয়াল কোটেশন পেতে পণ্যের তথ্যের সাথে আপনার নাম ও মোবাইল নম্বর দিন।
                    </span>
                  </div>
                  <Calculator className="w-5 h-5 text-amber-600 shrink-0 ml-3 mt-0.5" />
                </div>
              </div>

              {/* Hong Kong vs China Guidance Question (Customer Friendly Selection) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                  পণ্যটিতে কি Battery, Magnet, Liquid, Gas অথবা Brand Copy আছে? <span className="text-rose-500">*</span>
                </label>
                <p className="text-[11px] text-slate-600 mb-3">
                  (বিমানবন্দর নিরাপত্তা নিয়মানুযায়ী ব্যাটারি/লিকুইড পণ্য হংকং থেকে, সাধারণ পণ্য চায়না থেকে এবং জরুরি পণ্য অন-বোর্ড হ্যান্ড ক্যারিতে আসে)
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Option A: General Cargo */}
                  <button
                    type="button"
                    onClick={() => handleCargoNatureChange('general')}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      cargoNature === 'general' && !useHandCarry
                        ? 'border-amber-500 bg-amber-50/90 ring-2 ring-amber-500/20 text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">১. সাধারণ পণ্য (General Cargo)</span>
                      {cargoNature === 'general' && !useHandCarry && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1">ব্যাটারি, লিকুইড বা ম্যাগনেট নেই</span>
                    <span className="text-xs font-extrabold text-amber-700 block mt-1.5">
                      Mainland China Route • {rateSettings.currencySymbol}{rateSettings.chinaRate} / KG
                    </span>
                  </button>

                  {/* Option B: Battery / Magnet / Liquid / Gas */}
                  <button
                    type="button"
                    onClick={() => handleCargoNatureChange('battery_liquid_magnet')}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      cargoNature === 'battery_liquid_magnet'
                        ? 'border-amber-500 bg-amber-50/90 ring-2 ring-amber-500/20 text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">২. Battery, Liquid, Magnet, Gas</span>
                      {cargoNature === 'battery_liquid_magnet' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1">বাধ্যতামূলক হংকং ট্রানজিট রুট (অথবা হ্যান্ড ক্যারি)</span>
                    <span className="text-xs font-extrabold text-amber-700 block mt-1.5">
                      Hong Kong Route • {rateSettings.currencySymbol}{rateSettings.hongKongRate} / KG
                    </span>
                  </button>

                  {/* Option C: Brand Copy / Replica */}
                  <button
                    type="button"
                    onClick={() => handleCargoNatureChange('brand_copy')}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      cargoNature === 'brand_copy'
                        ? 'border-amber-500 bg-amber-50/90 ring-2 ring-amber-500/20 text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">৩. Brand Copy / মাস্টার কপি পণ্য</span>
                      {cargoNature === 'brand_copy' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1">হংকং স্পেশাল চ্যানেল (অথবা হ্যান্ড ক্যারি)</span>
                    <span className="text-xs font-extrabold text-amber-700 block mt-1.5">
                      Special Rate • {rateSettings.currencySymbol}{rateSettings.hongKongRate} / KG
                    </span>
                  </button>

                  {/* Option D: Hand Carry Express (24-48 Hours) */}
                  <button
                    type="button"
                    onClick={() => handleCargoNatureChange('hand_carry_express')}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      cargoNature === 'hand_carry_express' || (useHandCarry && cargoNature === 'general')
                        ? 'border-rose-500 bg-rose-50/90 ring-2 ring-rose-500/20 text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center">
                        <Briefcase className="w-3.5 h-3.5 mr-1 text-rose-600" />
                        ৪. হ্যান্ড ক্যারি সুপার এক্সপ্রেস
                      </span>
                      {(cargoNature === 'hand_carry_express' || (useHandCarry && cargoNature === 'general')) && (
                        <CheckCircle2 className="w-4 h-4 text-rose-600" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1">২৪-৪৮ ঘণ্টার দ্রুততম অন-বোর্ড কুরিয়ার সার্ভিস</span>
                    <span className="text-xs font-extrabold text-rose-700 block mt-1.5">
                      Express Courier • {rateSettings.currencySymbol}{rateSettings.handCarryPerKgRate || 1800} / KG
                    </span>
                  </button>

                  {/* Option E: Other Country */}
                  <button
                    type="button"
                    onClick={() => handleCargoNatureChange('other_country')}
                    className={`p-3 rounded-xl border text-left transition-colors sm:col-span-2 ${
                      cargoNature === 'other_country'
                        ? 'border-amber-500 bg-amber-50/90 ring-2 ring-amber-500/20 text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">৫. অন্য দেশ (Other Country)</span>
                      {cargoNature === 'other_country' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1">ভিয়েতনাম, দুবাই, থাইল্যান্ড, ভারত ইত্যাদি দেশ থেকে আমদানি</span>
                    <span className="text-xs font-semibold text-slate-700 block mt-1.5">
                      Custom Quote on Inquiry
                    </span>
                  </button>
                </div>

                {/* Sensitive Goods Hand Carry Upsell / Switcher */}
                {(cargoNature === 'battery_liquid_magnet' || cargoNature === 'brand_copy' || compliance.status === 'restricted') && (
                  <div className="mt-3 bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-rose-600 shrink-0" />
                        <span className="text-xs font-bold text-slate-900">
                          সংবেদনশীল পণ্যের হ্যান্ড ক্যারি সুযোগ (Hand Carry Super Express)
                        </span>
                      </div>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-200 text-rose-900">
                        রেট বেশি
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-relaxed">
                      ব্যাটারি, লিকুইড, ম্যাগনেট বা মাস্টার কপি পণ্য হলেও আমাদের ২৪-৪৮ ঘণ্টার হ্যান্ড ক্যারি অন-বোর্ড কুরিয়ারে আনা যাবে।
                    </p>
                    <label className="flex items-center space-x-2.5 p-2.5 bg-white border border-rose-300 rounded-lg cursor-pointer hover:bg-rose-50/40 transition-colors">
                      <input
                        type="checkbox"
                        checked={useHandCarry}
                        onChange={(e) => setUseHandCarry(e.target.checked)}
                        className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-rose-950 block">
                          হ্যান্ড ক্যারি সুপার এক্সপ্রেস বেছে নিন (২৪-৪৮ ঘণ্টা - অন-বোর্ড কুরিয়ার)
                        </span>
                        <span className="text-[11px] text-rose-700 font-semibold">
                          সংবেদনশীল পণ্যের হ্যান্ড ক্যারি রেট: ৳{rateSettings.handCarrySensitiveRate || 2200} / KG
                        </span>
                      </div>
                    </label>
                  </div>
                )}

                {cargoNature === 'other_country' && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={otherCountryName}
                      onChange={(e) => setOtherCountryName(e.target.value)}
                      placeholder="দেশের নাম লিখুন (যেমন: Vietnam, Dubai, Thailand)"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}
              </div>

              {/* Product Name & Weight */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-7">
                  <label htmlFor="air-product-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Product Name (পণ্যের নাম) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="air-product-name"
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => {
                      setProductName(e.target.value);
                      if (errors.productName) setErrors({ ...errors, productName: undefined });
                    }}
                    placeholder="যেমন: Drone, Vape, Battery, Garments, LED Light"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none ${
                      compliance.status === 'prohibited'
                        ? 'border-rose-400 bg-rose-50/40 text-rose-950'
                        : errors.productName
                        ? 'border-rose-300 bg-rose-50/30'
                        : 'border-slate-300 focus:border-amber-500 bg-white'
                    }`}
                  />
                  {errors.productName && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{errors.productName}</p>
                  )}

                  {/* AI Sentinel Live Status: Prohibited Warning */}
                  {compliance.status === 'prohibited' && (
                    <div className="mt-2.5 bg-rose-50 border-2 border-rose-500 rounded-xl p-3.5 space-y-1.5 shadow-sm">
                      <div className="flex items-center space-x-2 text-rose-900 font-black text-xs">
                        <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{compliance.titleBengali} (নিষিদ্ধ পণ্য শনাক্ত)</span>
                      </div>
                      <p className="text-[11px] text-rose-950 leading-relaxed font-bold">
                        {compliance.descriptionBengali}
                      </p>
                      <div className="text-[10px] text-rose-800 bg-rose-100/80 p-2 rounded border border-rose-200 font-medium">
                        <strong>আইনি বিধি:</strong> {compliance.legalNotice}
                      </div>
                    </div>
                  )}

                  {/* AI Sentinel Live Status: Restricted Warning */}
                  {compliance.status === 'restricted' && (
                    <div className="mt-2.5 bg-amber-50 border border-amber-400 rounded-xl p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 text-amber-900 font-bold text-xs">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>{compliance.titleBengali}</span>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                          সংবেদনশীল কার্গো
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-900 leading-relaxed">
                        {compliance.descriptionBengali}
                      </p>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-5">
                  <label htmlFor="air-weight" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Approximate Weight (ওজন) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="air-weight"
                      type="number"
                      step="any"
                      min="0.1"
                      required
                      value={weight}
                      onChange={(e) => {
                        setWeight(e.target.value);
                        if (errors.weight) setErrors({ ...errors, weight: undefined });
                      }}
                      placeholder="e.g. 50"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm pr-12 transition-colors focus:outline-none ${
                        errors.weight
                          ? 'border-rose-300 bg-rose-50/30'
                        : 'border-slate-300 focus:border-amber-500 bg-white'
                      }`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs font-bold text-slate-500">
                      KG
                    </div>
                  </div>
                  {errors.weight && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{errors.weight}</p>
                  )}
                </div>
              </div>

              {/* Product Category & Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="air-category" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Product Category <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <select
                    id="air-category"
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value as ProductCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="General Goods">General Goods (সাধারণ পণ্য)</option>
                    <option value="Electronics">Electronics (ইলেকট্রনিক্স)</option>
                    <option value="Garments / Textile">Garments / Textile (গার্মেন্টস / ফেব্রিক)</option>
                    <option value="Machinery / Spare Parts">Machinery / Spare Parts (মেশিনারি ও যন্ত্রাংশ)</option>
                    <option value="Other">Other (অন্যান্য)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="air-details" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Additional Details <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="air-details"
                    type="text"
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    placeholder="কার্টুন সংখ্যা, সাইজ বা কোনো বিশেষ নির্দেশ..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 bg-white"
                  />
                </div>
              </div>

              {/* Restricted Goods Detection Banner */}
              {restrictionCheck.isRestricted && (
                <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-3.5 text-xs text-amber-900">
                  <div className="flex items-start space-x-2.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-amber-950">Restricted Cargo Notice:</span>
                      ব্যাটারি, লিকুইড, ম্যাগনেট বা গ্যাসের পণ্য এয়ারলাইন্সের নিয়ম অনুযায়ী হংকং রুটে প্রসেস হবে।
                    </div>
                  </div>
                </div>
              )}

              {/* Rate Confirmation Notice: High value / PCS Duty warning */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-950">
                <div className="flex items-start space-x-2.5">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong className="font-bold block text-blue-900">
                      মালামাল প্রেরণের আগে অবশ্যই রেট ও ক্যাটাগরি নিশ্চিত করুন:
                    </strong>
                    এই ক্যালকুলেটর রেট শুধুমাত্র উল্লেখিত সাধারণ/স্ট্যান্ডার্ড পণ্যের জন্য প্রযোজ্য। দামি পণ্য (High-Value / Luxury items) কিংবা যে সমস্ত পণ্যের ওজন ছাড়াও পিস (PCS) অনুযায়ী শুল্ক/ট্যাক্স পরিশোধ করতে হয়, সেগুলোর রেট কিছুটা বেশি হতে পারে। ওয়্যারহাউসে মাল পাঠানোর পূর্বে অবশ্যই আমাদের টিমের সাথে ফাইনাল রেট নিশ্চিত করে নিবেন।
                  </div>
                </div>
              </div>

              {/* Product Photo Upload (Optional) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Product Photo <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-amber-400 rounded-xl p-3 text-center cursor-pointer transition-colors bg-slate-50"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handlePhotoUpload(e.target.files[0]);
                      }
                    }}
                  />
                  {photoPreview ? (
                    <div className="flex items-center justify-center space-x-3">
                      <img
                        src={photoPreview}
                        alt="Product preview"
                        className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <div className="text-left text-xs">
                        <span className="font-semibold text-slate-800 block truncate max-w-[200px]">
                          {photoName}
                        </span>
                        <span className="text-emerald-600 font-medium">Photo attached • Click to change</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2 text-xs text-slate-500 py-1">
                      <UploadCloud className="w-4 h-4 text-slate-400" />
                      <span>Click to attach photo (JPG/PNG - Optional)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* MANDATORY CUSTOMER CONTACT SECTION (Required for Lead Collection) */}
              <div className="bg-slate-100/80 border-2 border-amber-400/80 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center">
                    <User className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                    আপনার যোগাযোগের তথ্য (কোটেশন ও রেটের জন্য)
                  </span>
                  <span className="text-[11px] font-bold text-rose-600">আবশ্যক *</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="air-customer-name" className="block text-xs font-semibold text-slate-700 mb-1">
                      আপনার নাম (Customer Name) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="air-customer-name"
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
                    <label htmlFor="air-customer-mobile" className="block text-xs font-semibold text-slate-700 mb-1">
                      মোবাইল / WhatsApp নম্বর <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="air-customer-mobile"
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
                  <label htmlFor="air-customer-company" className="block text-xs font-semibold text-slate-700 mb-1">
                    প্রতিষ্ঠানের নাম (Company Name) <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="air-customer-company"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="ব্যবসায়িক প্রতিষ্ঠান বা কোম্পানির নাম"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 bg-white"
                    />
                    <Building className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>
              </div>

              {/* Submit CTA: Calculate Estimate & Save Lead */}
              <div className="pt-2">
                {compliance.status === 'prohibited' ? (
                  <div className="space-y-2.5">
                    <div className="w-full py-3.5 px-6 rounded-xl bg-rose-100 border-2 border-rose-500 text-rose-950 font-black text-center text-sm flex items-center justify-center space-x-2 shadow-sm">
                      <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                      <span>⛔ নিষিদ্ধ পণ্য (Prohibited Cargo) — বুকিং নেওয়া সম্ভব নয়</span>
                    </div>
                    <p className="text-[11px] text-center text-rose-800 font-medium">
                      বাংলাদেশ কাস্টমস আইন ও এভিয়েশন নিয়মানুযায়ী এই পণ্যের কোনো কোটেশন বা বুকিং সম্ভব নয়।
                    </p>
                  </div>
                ) : (
                  <button
                    id="btn-calculate-my-estimate"
                    type="submit"
                    className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base shadow-lg shadow-amber-500/20 transition-colors"
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    <span>Calculate Estimate & Get Quotation</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                )}
              </div>

            </form>
          ) : (
            /* ========================================================================= */
            /* 2. ESTIMATE RESULT SCREEN                                                 */
            /* ========================================================================= */
            <div className="space-y-6">
              
              {/* Result Card */}
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* Header Strip */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                  <div>
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                      C&amp;F AGENT • CARGO LOGISTICS
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      {estimateResult?.serviceType === 'Hand Carry Cargo' 
                        ? 'Hand Carry Super Express Quotation' 
                        : 'Your Estimated Air D2D Cost'}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-sm uppercase tracking-wide">
                    {estimateResult?.serviceType === 'Hand Carry Cargo' 
                      ? 'Hand Carry (24-48h)' 
                      : 'Smart Estimate'}
                  </span>
                </div>

                {/* Route & Product Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 text-xs">
                  <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
                    <span className="text-slate-400 block font-medium">Service / Route</span>
                    <span className="text-sm font-bold text-white block mt-0.5">
                      {estimateResult?.serviceType === 'Hand Carry Cargo' 
                        ? 'Hand Carry (24-48h)' 
                        : `${estimateResult?.shippingFrom} → BD`}
                    </span>
                  </div>

                  <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
                    <span className="text-slate-400 block font-medium">Product Name</span>
                    <span className="text-sm font-bold text-white block mt-0.5 truncate" title={estimateResult?.productName}>
                      {estimateResult?.productName}
                    </span>
                  </div>

                  <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
                    <span className="text-slate-400 block font-medium">Weight</span>
                    <span className="text-sm font-bold text-amber-400 block mt-0.5">
                      {estimateResult?.weight} KG
                    </span>
                  </div>

                  <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
                    <span className="text-slate-400 block font-medium">Applicable Rate</span>
                    <span className="text-sm font-bold text-white block mt-0.5">
                      {rateSettings.currencySymbol}{estimateResult?.applicableRate} / KG
                    </span>
                  </div>
                </div>

                {/* Prominent Estimated Cargo Charge Box */}
                <div className="bg-slate-800/90 border-2 border-amber-500 rounded-2xl p-5 text-center my-4">
                  <span className="text-xs uppercase tracking-widest font-black text-amber-400 block mb-1">
                    Estimated Cargo Charge
                  </span>
                  <div className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                    {formattedEstimateCharge}
                  </div>
                  <span className="text-[11px] text-slate-300 block mt-1.5 font-mono">
                    Calculation: {estimateResult?.weight} KG × {rateSettings.currencySymbol}{estimateResult?.applicableRate} / KG
                  </span>
                </div>

                {/* Estimate Reference ID, Customer Info & Timestamp */}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800 gap-2">
                  <span>
                    Estimate Ref: <strong className="text-slate-200 font-mono">{estimateResult?.refId}</strong>
                  </span>
                  <span>
                    Customer: <strong className="text-slate-200">{customerName} ({customerMobile})</strong>
                  </span>
                  <span>
                    CRM Lead: <strong className="text-amber-400 font-mono">{savedLeadId}</strong>
                  </span>
                </div>
              </div>

              {/* ENLARGED & PROMINENT IMPORTANT PRICING NOTICE */}
              <div className="bg-amber-100 border-2 border-amber-400 rounded-2xl p-5 text-amber-950 shadow-sm">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
                  <div className="space-y-1.5">
                    <h4 className="text-sm sm:text-base font-black text-amber-950 uppercase tracking-wide">
                      Important Pricing Notice
                    </h4>
                    <p className="text-xs sm:text-sm font-bold text-amber-950 leading-relaxed">
                      এটি একটি আনুমানিক হিসাব। Actual rate, minimum charge, chargeable weight, customs duty, restricted goods এবং অন্যান্য প্রযোজ্য খরচ যাচাই করে final quotation দেওয়া হবে।
                    </p>
                    <p className="text-xs text-amber-900 leading-relaxed pt-1">
                      ⚠️ সাধারণ পণ্যের বাইরে দামি পণ্য বা ওজনে/পিস অনুযায়ী শুল্ক প্রযোজ্য আইটেমের ক্ষেত্রে রেট কিছুটা বেশি হতে পারে। মাল বুকিংয়ের পূর্বে আমাদের টিমের সাথে যোগাযোগ করে ফাইনাল রেট নিশ্চিত করুন।
                    </p>
                  </div>
                </div>
              </div>

              {/* PRIMARY ACTION BUTTONS (Direct WhatsApp + Options) */}
              <div className="space-y-3">
                {/* 1. Get Official Quotation on WhatsApp (Direct Link) */}
                <a
                  id="btn-get-official-quotation-whatsapp"
                  href={whatsAppDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base shadow-xl transition-colors"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  <span>Get Official Quotation on WhatsApp</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Edit Shipment Details */}
                  <button
                    type="button"
                    onClick={() => setViewMode('form')}
                    className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-300 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
                    <span>Edit Shipment Details</span>
                  </button>

                  {/* Start New Estimate */}
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-300 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
                    <span>Start New Estimate</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-5 sm:px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>C&amp;F Logistics Hubs: Guangzhou • Shenzhen • Yiwu • Hong Kong • Dhaka</span>
          </div>
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
