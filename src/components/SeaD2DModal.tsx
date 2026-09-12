import React, { useState } from 'react';
import { 
  X, 
  Ship, 
  CheckCircle2, 
  MessageCircle, 
  Box, 
  Scale, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  HelpCircle,
  ArrowRight,
  User,
  Phone,
  Building,
  RotateCcw
} from 'lucide-react';
import { RateSettings, Lead } from '../types';
import { 
  generateLeadId, 
  generateRefId, 
  saveLead 
} from '../services/storage';

interface SeaD2DModalProps {
  isOpen: boolean;
  onClose: () => void;
  rateSettings: RateSettings;
  onLeadCreated: (lead: Lead) => void;
  onSwitchToConsultancy?: () => void;
}

export type SeaServiceType = 'LCL' | 'FCL' | 'D2D';

export const SeaD2DModal: React.FC<SeaD2DModalProps> = ({
  isOpen,
  onClose,
  rateSettings,
  onLeadCreated,
  onSwitchToConsultancy,
}) => {
  // Origin port
  const [originType, setOriginType] = useState('Guangzhou Port');
  const [customOrigin, setCustomOrigin] = useState('');

  // Service Type & Transit Time
  const [serviceType, setServiceType] = useState<SeaServiceType>('D2D');

  // Destination Port in Bangladesh
  const [bdPort, setBdPort] = useState('Chittagong Customs House');

  // Cargo Details
  const [productDetails, setProductDetails] = useState('');
  const [quantity, setQuantity] = useState('');
  const [weight, setWeight] = useState<string>('500');
  const [cbm, setCbm] = useState<string>('2.5');

  // Carton CBM calculator helper
  const [showCbmCalc, setShowCbmCalc] = useState(false);
  const [cartonLength, setCartonLength] = useState('');
  const [cartonWidth, setCartonWidth] = useState('');
  const [cartonHeight, setCartonHeight] = useState('');
  const [cartonCount, setCartonCount] = useState('');

  // Customer Details (Mandatory at end)
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [companyName, setCompanyName] = useState('');

  // Step: 'input' | 'result'
  const [step, setStep] = useState<'input' | 'result'>('input');
  const [createdLead, setCreatedLead] = useState<Lead | null>(null);
  const [errors, setErrors] = useState<{
    productDetails?: string;
    customerName?: string;
    customerMobile?: string;
  }>({});

  if (!isOpen) return null;

  // Recommended Origin Ports
  const originPorts = [
    'Guangzhou Port (CAN), China',
    'Ningbo-Zhoushan Port, China',
    'Shenzhen / Yantian (SZX), China',
    'Shanghai Port, China',
    'Qingdao Port, China',
    'Hong Kong Port',
    'Other Port / Country',
  ];

  // All Bangladesh Ports
  const bdPorts = [
    'Chittagong Customs House (Recommended)',
    'Dhaka ICD Kamalapur Customs House',
    'Pangaon ICT (Inland Container Terminal)',
    'Benapole Land Port Customs House',
    'Mongla Port Customs House',
    'Payra Port',
  ];

  const handleServiceTypeChange = (type: SeaServiceType) => {
    setServiceType(type);
    if (type === 'LCL') {
      setBdPort('Chittagong Customs House (Recommended)');
    }
  };

  const calculateHelperCbm = () => {
    const l = parseFloat(cartonLength) || 0;
    const w = parseFloat(cartonWidth) || 0;
    const h = parseFloat(cartonHeight) || 0;
    const count = parseFloat(cartonCount) || 1;

    if (l > 0 && w > 0 && h > 0) {
      const totalCbm = (l * w * h * count) / 1000000;
      setCbm(totalCbm.toFixed(2));
      setShowCbmCalc(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: {
      productDetails?: string;
      customerName?: string;
      customerMobile?: string;
    } = {};

    if (!productDetails.trim()) {
      newErrors.productDetails = 'Please specify Product Details. (পণ্যের বিবরণ দিন)';
    }

    if (!customerName.trim()) {
      newErrors.customerName = 'Please provide your Name. (আপনার নাম দিন)';
    }

    if (!customerMobile.trim()) {
      newErrors.customerMobile = 'Please provide your Mobile/WhatsApp number. (মোবাইল নম্বর দিন)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const refId = generateRefId('SBC-SEA');
    const leadId = generateLeadId();
    const finalOrigin = originType === 'Other Port / Country' ? customOrigin.trim() || 'Other Port' : originType;
    const finalBdPort = serviceType === 'LCL' ? 'Chittagong Customs House' : bdPort;
    const numericWeight = parseFloat(weight) || 0;
    const numericCbm = parseFloat(cbm) || 0;

    let transitLabel = '40 to 45 Days (Door to Door)';
    if (serviceType === 'LCL') transitLabel = '35 to 40 Days (LCL)';
    if (serviceType === 'FCL') transitLabel = '25 Days (FCL)';

    const newLead: Lead = {
      id: leadId,
      createdAt: new Date().toISOString(),
      serviceType: 'Sea D2D Cargo',
      shippingFrom: 'China',
      productName: productDetails.trim(),
      quantity: quantity.trim() || undefined,
      approximateWeight: numericWeight,
      cbm: numericCbm,
      applicableRate: 0,
      estimatedCargoCharge: 0, // No estimated rate shown, custom quote on inquiry
      portName: finalBdPort,
      transitTimeOption: transitLabel,
      additionalDetails: `Origin: ${finalOrigin}, Dest Port: ${finalBdPort}, Service: ${transitLabel}, Qty: ${quantity}`,
      name: customerName.trim(),
      mobile: customerMobile.trim(),
      companyName: companyName.trim() || undefined,
      preferredContactMethod: 'WhatsApp',
      leadSource: 'Landing Page',
      estimateRefId: refId,
      status: 'New',
      adminNotes: `Client requested Sea Quote for ${numericCbm} CBM via ${finalOrigin} to ${finalBdPort}`,
    };

    saveLead(newLead);
    onLeadCreated(newLead);
    setCreatedLead(newLead);
    setStep('result');
  };

  const handleReset = () => {
    setProductDetails('');
    setQuantity('');
    setWeight('500');
    setCbm('2.5');
    setStep('input');
    setErrors({});
  };

  const finalOriginText = originType === 'Other Port / Country' ? customOrigin || 'Other Port' : originType;
  const finalBdPortText = serviceType === 'LCL' ? 'Chittagong Customs House' : bdPort;

  // Clean WhatsApp URL with all cargo details
  const getWhatsAppMessage = () => {
    let serviceLabel = 'Door to Door (40-45 Days)';
    if (serviceType === 'LCL') serviceLabel = 'LCL (35-40 Days)';
    if (serviceType === 'FCL') serviceLabel = 'FCL (25 Days)';

    return `Hello C&F Agent,

I want to get a Sea Cargo quotation:

• Ref ID: ${createdLead?.estimateRefId || 'SBC-SEA'}
• Service Type: ${serviceLabel}
• Origin Port: ${finalOriginText}
• Bangladesh Port: ${finalBdPortText}
• Product Details: ${productDetails}
• Quantity: ${quantity || 'N/A'}
• Total Weight: ${weight} KG
• Volume: ${cbm} CBM
• Customer Name: ${customerName}
• Mobile / WhatsApp: ${customerMobile}
${companyName ? `• Company: ${companyName}\n` : ''}
Please verify the best freight rate and next vessel sailing schedule.

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
            <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Sea D2D & Container Cargo
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500 text-slate-950">
                  LCL / FCL
                </span>
              </div>
              <p className="text-xs text-blue-300 font-medium">
                Cost-Effective Bulk Sea Freight to Bangladesh
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
          {step === 'input' ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Introduction Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs sm:text-sm text-blue-950 flex items-start justify-between">
                <div>
                  <span className="font-bold block">সি-কার্গো শিপমেন্ট তথ্য দিন ও স্পেশাল রেটের জন্য অনুরোধ করুন</span>
                  <span className="text-xs text-blue-800 block mt-0.5">
                    সেরা রেটের জন্য আমাদের সি-ফ্রেইট টিম আপনার কার্গো ভলিউম অনুযায়ী সর্বনিম্ন রেট অফার করবে।
                  </span>
                </div>
                <Ship className="w-5 h-5 text-blue-600 shrink-0 ml-2 mt-0.5" />
              </div>

              {/* 1. Service Type & Transit Time (Required) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                  ১. কাঙ্ক্ষিত সার্ভিস ও ট্রানজিট টাইম সিলেক্ট করুন <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Option 1: 35 to 40 Day LCL */}
                  <button
                    type="button"
                    onClick={() => handleServiceTypeChange('LCL')}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      serviceType === 'LCL'
                        ? 'border-blue-500 bg-blue-50/90 ring-2 ring-blue-500/20 text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">LCL Consolidation</span>
                      {serviceType === 'LCL' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </div>
                    <span className="text-xs font-black text-blue-700 block mt-1">35 to 40 Days</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Less than Container Load (শুধু চট্টগ্রাম পোর্ট)</span>
                  </button>

                  {/* Option 2: 25 Day FCL */}
                  <button
                    type="button"
                    onClick={() => handleServiceTypeChange('FCL')}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      serviceType === 'FCL'
                        ? 'border-blue-500 bg-blue-50/90 ring-2 ring-blue-500/20 text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">FCL Full Container</span>
                      {serviceType === 'FCL' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </div>
                    <span className="text-xs font-black text-blue-700 block mt-1">25 Days (Fastest)</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">20ft / 40ft / 40HQ কন্টেইনার</span>
                  </button>

                  {/* Option 3: 40 to 45 Day Door to Door */}
                  <button
                    type="button"
                    onClick={() => handleServiceTypeChange('D2D')}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      serviceType === 'D2D'
                        ? 'border-blue-500 bg-blue-50/90 ring-2 ring-blue-500/20 text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Door to Door (D2D)</span>
                      {serviceType === 'D2D' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </div>
                    <span className="text-xs font-black text-blue-700 block mt-1">40 to 45 Days</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">ট্যাক্স ও ক্লিয়ারেন্সসহ হোম ডেলিভারি</span>
                  </button>
                </div>
              </div>

              {/* 2. Port of Origin (Recommended + Custom) */}
              <div>
                <label htmlFor="sea-origin" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  ২. Port of Origin (যে পোর্ট থেকে লোড হবে) <span className="text-rose-500">*</span>
                </label>
                <select
                  id="sea-origin"
                  value={originType}
                  onChange={(e) => setOriginType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                >
                  {originPorts.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>

                {originType === 'Other Port / Country' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={customOrigin}
                      onChange={(e) => setCustomOrigin(e.target.value)}
                      placeholder="পোর্ট ও দেশের নাম লিখুন (যেমন: Port of Bangkok, Thailand / Port Klang, Malaysia)"
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* 3. Bangladesh Destination Port (With Strict LCL Rule) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="sea-bd-port" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    ৩. Bangladesh Destination Port (গন্তব্য কাস্টমস হাউস) <span className="text-rose-500">*</span>
                  </label>
                  {serviceType === 'LCL' && (
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      LCL = শুধু চট্টগ্রাম
                    </span>
                  )}
                </div>

                <select
                  id="sea-bd-port"
                  value={serviceType === 'LCL' ? 'Chittagong Customs House (Recommended)' : bdPort}
                  disabled={serviceType === 'LCL'}
                  onChange={(e) => setBdPort(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none ${
                    serviceType === 'LCL'
                      ? 'bg-slate-100 border-slate-300 text-slate-700 cursor-not-allowed'
                      : 'bg-white border-slate-300 focus:border-blue-500'
                  }`}
                >
                  {bdPorts.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>

                {serviceType === 'LCL' && (
                  <p className="text-[11px] text-rose-700 font-medium mt-1.5 flex items-center">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1 shrink-0 text-rose-600" />
                    LCL কনটেইনার কার্গো শুধুমাত্র চট্টগ্রাম পোর্ট/কাস্টমস হাউসে আনলোড ও খালাস সম্ভব; অন্য কোনো পোর্টে এলসিএল খালাস হয় না।
                  </p>
                )}
              </div>

              {/* 4. Product Details */}
              <div>
                <label htmlFor="sea-product-details" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  ৪. Product Details (পণ্যের বিবরণ) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="sea-product-details"
                  rows={2}
                  required
                  value={productDetails}
                  onChange={(e) => {
                    setProductDetails(e.target.value);
                    if (errors.productDetails) setErrors({ ...errors, productDetails: undefined });
                  }}
                  placeholder="যেমন: Ceramic Tiles, Machinery, Hardware tools, Plastic Raw Materials ইত্যাদি..."
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none transition-colors ${
                    errors.productDetails ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300 focus:border-blue-500 bg-white'
                  }`}
                />
                {errors.productDetails && (
                  <p className="text-xs text-rose-600 mt-1">{errors.productDetails}</p>
                )}
              </div>

              {/* 5. Quantity, Weight & CBM */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="sea-qty" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Package / Cartons <span className="text-slate-400 font-normal">(ঐচ্ছিক)</span>
                  </label>
                  <input
                    id="sea-qty"
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 50 Cartons / 2 Pallets"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="sea-weight" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Gross Weight (KG) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="sea-weight"
                      type="number"
                      required
                      min="1"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm pr-10 focus:outline-none focus:border-blue-500 bg-white"
                    />
                    <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">KG</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="sea-cbm" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Total CBM <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCbmCalc(!showCbmCalc)}
                      className="text-[10px] font-bold text-blue-600 underline cursor-pointer"
                    >
                      {showCbmCalc ? 'Close' : 'CBM Calc'}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="sea-cbm"
                      type="number"
                      step="0.01"
                      required
                      min="0.1"
                      value={cbm}
                      onChange={(e) => setCbm(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm pr-12 focus:outline-none focus:border-blue-500 bg-white"
                    />
                    <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">CBM</span>
                  </div>
                </div>
              </div>

              {/* Helper: Carton CBM Calculator */}
              {showCbmCalc && (
                <div className="bg-slate-100 border border-slate-300 rounded-xl p-3.5 space-y-2.5">
                  <span className="text-xs font-bold text-slate-800 block">
                    কার্টুনের মাপ দিয়ে CBM বের করুন (L × W × H in CM)
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <input
                      type="number"
                      placeholder="L (cm)"
                      value={cartonLength}
                      onChange={(e) => setCartonLength(e.target.value)}
                      className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                    <input
                      type="number"
                      placeholder="W (cm)"
                      value={cartonWidth}
                      onChange={(e) => setCartonWidth(e.target.value)}
                      className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                    <input
                      type="number"
                      placeholder="H (cm)"
                      value={cartonHeight}
                      onChange={(e) => setCartonHeight(e.target.value)}
                      className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                    <input
                      type="number"
                      placeholder="কার্টুন সংখ্যা"
                      value={cartonCount}
                      onChange={(e) => setCartonCount(e.target.value)}
                      className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={calculateHelperCbm}
                    className="w-full py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold"
                  >
                    Apply Calculated CBM
                  </button>
                </div>
              )}

              {/* 6. Customer Details (Mandatory at end) */}
              <div className="bg-slate-100/80 border-2 border-blue-400/80 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center">
                    <User className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                    আপনার যোগাযোগের তথ্য (কোটেশন ও রেটের জন্য)
                  </span>
                  <span className="text-[11px] font-bold text-rose-600">আবশ্যক *</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="sea-customer-name" className="block text-xs font-semibold text-slate-700 mb-1">
                      আপনার নাম (Name) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="sea-customer-name"
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => {
                          setCustomerName(e.target.value);
                          if (errors.customerName) setErrors({ ...errors, customerName: undefined });
                        }}
                        placeholder="আপনার পূর্ণ নাম"
                        className={`w-full pl-8 pr-3 py-2 text-xs rounded-lg border transition-colors focus:outline-none ${
                          errors.customerName ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300 focus:border-blue-500 bg-white'
                        }`}
                      />
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                    {errors.customerName && (
                      <p className="text-[11px] text-rose-600 mt-0.5">{errors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="sea-customer-mobile" className="block text-xs font-semibold text-slate-700 mb-1">
                      মোবাইল / WhatsApp নম্বর <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="sea-customer-mobile"
                        type="tel"
                        required
                        value={customerMobile}
                        onChange={(e) => {
                          setCustomerMobile(e.target.value);
                          if (errors.customerMobile) setErrors({ ...errors, customerMobile: undefined });
                        }}
                        placeholder="017... / 018..."
                        className={`w-full pl-8 pr-3 py-2 text-xs rounded-lg border transition-colors focus:outline-none ${
                          errors.customerMobile ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300 focus:border-blue-500 bg-white'
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
                  <label htmlFor="sea-customer-company" className="block text-xs font-semibold text-slate-700 mb-1">
                    প্রতিষ্ঠানের নাম (Company Name) <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="sea-customer-company"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="প্রতিষ্ঠানের নাম"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 bg-white"
                    />
                    <Building className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-black text-sm sm:text-base shadow-lg transition-colors"
              >
                <Ship className="w-5 h-5 mr-2" />
                <span>Submit for Best Sea Freight Rate</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>

            </form>
          ) : (
            /* Result Screen: Highlight Team Working & Thanks */
            <div className="space-y-6">
              
              {/* Highlight Card: No Estimated Rate, Team Working on Best Rate */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 border border-slate-800 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                    <CheckCircle2 className="w-7 h-7 text-blue-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">
                      C&amp;F AGENT • SEA FREIGHT DESK
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      আপনার সি-কার্গো তথ্য সফলভাবে গ্রহণ করা হয়েছে!
                    </h3>
                  </div>
                </div>

                {/* Prominent Banner as explicitly requested by user */}
                <div className="bg-blue-950/80 border-2 border-blue-400 rounded-2xl p-5 text-center my-3">
                  <div className="text-base sm:text-lg font-black text-blue-200 leading-relaxed">
                    সেরা ও সবচেয়ে সাশ্রয়ী রেটের জন্য আমাদের টিম কাজ করছে।
                  </div>
                  <p className="text-xs sm:text-sm text-blue-300 mt-2 leading-relaxed">
                    অনুগ্রহ করে একটু অপেক্ষা করুন, আমাদের সিনিয়র সি-ফ্রেইট স্পেশালিস্ট আপনার পণ্য, মোট ভলিউম ({cbm} CBM) ও নির্বাচিত পোর্ট রুট বিশ্লেষণ করে দ্রুততম সময়ে সেরা রেট ও বুকিং বিস্তারিত সরাসরি জানিয়ে দেবে।
                  </p>
                  <div className="mt-3 inline-block px-4 py-1.5 rounded-full bg-blue-500 text-slate-950 font-black text-xs">
                    আমাদের সাথে যোগাযোগ করার জন্য আপনাকে আন্তরিক ধন্যবাদ!
                  </div>
                </div>

                {/* Cargo Details Recap */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
                  <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700">
                    <span className="text-slate-400 block font-medium">Service</span>
                    <span className="text-sm font-bold text-white block mt-0.5">
                      {serviceType === 'LCL' ? 'LCL (35-40 D)' : serviceType === 'FCL' ? 'FCL (25 D)' : 'D2D (40-45 D)'}
                    </span>
                  </div>

                  <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700">
                    <span className="text-slate-400 block font-medium">Origin</span>
                    <span className="text-sm font-bold text-white block mt-0.5 truncate" title={finalOriginText}>
                      {finalOriginText}
                    </span>
                  </div>

                  <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700">
                    <span className="text-slate-400 block font-medium">Destination Port</span>
                    <span className="text-sm font-bold text-blue-400 block mt-0.5 truncate" title={finalBdPortText}>
                      {finalBdPortText}
                    </span>
                  </div>

                  <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700">
                    <span className="text-slate-400 block font-medium">Cargo Volume</span>
                    <span className="text-sm font-bold text-white block mt-0.5">
                      {cbm} CBM • {weight} KG
                    </span>
                  </div>
                </div>

                {/* Ref & Customer */}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800 gap-2">
                  <span>Ref ID: <strong className="text-slate-200 font-mono">{createdLead?.estimateRefId}</strong></span>
                  <span>Lead ID: <strong className="text-blue-400 font-mono">{createdLead?.id}</strong></span>
                  <span>Client: <strong className="text-slate-200">{customerName} ({customerMobile})</strong></span>
                </div>
              </div>

              {/* PROMPT TO SWITCH TO IMPORT CONSULTANCY FOR CUSTOMS TAX & ASSESSMENT VALUE */}
              <div className="bg-purple-50 border-2 border-purple-300 rounded-2xl p-5 text-purple-950">
                <div className="flex items-start space-x-3">
                  <HelpCircle className="w-6 h-6 text-purple-700 shrink-0 mt-0.5" />
                  <div className="space-y-1.5">
                    <h4 className="text-sm sm:text-base font-black text-purple-950">
                      পণ্যটির বিস্তারিত ট্যাক্স হিসাব ও কাস্টমস মিনিমাম ভ্যালু জানতে চান?
                    </h4>
                    <p className="text-xs text-purple-900 leading-relaxed">
                      কাস্টমস নির্ধারিত নির্দিষ্ট HS Code, NBR Assessment Minimum Value ও মোট শুল্ক (CD, RD, SD, VAT, AIT, AT) জানতে আমাদের <strong>ইমপোর্ট কনসালটেন্সি সার্ভিস</strong> গ্রহণ করুন।
                    </p>
                    <p className="text-[11px] text-purple-800 font-medium">
                      (অফিসিয়াল কাস্টমস মিনিমাম ভ্যালু ও ভ্যালুয়েশন শিট প্রাপ্তির জন্য সার্ভিস চার্জ মাত্র ২০০ টাকা প্রতি এইচএস কোড)
                    </p>
                    {onSwitchToConsultancy && (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onSwitchToConsultancy();
                          }}
                          className="inline-flex items-center px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs shadow transition-colors"
                        >
                          <span>Switch to Import Consultancy</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="space-y-3">
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base shadow-lg transition-colors"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  <span>Chat with Sea Freight Specialist on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-300 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
                  <span>Submit Another Sea Inquiry</span>
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-5 sm:px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Port Coverage: Chittagong • Kamalapur ICD • Pangaon • Benapole • Mongla</span>
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
