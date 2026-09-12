import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  MessageCircle, 
  FileText, 
  Building2, 
  Anchor, 
  Plane, 
  Truck, 
  ArrowRight, 
  AlertCircle,
  RotateCcw,
  User,
  Phone,
  Building,
  PackageCheck,
  Send
} from 'lucide-react';
import { RateSettings, Lead } from '../types';
import { 
  generateLeadId, 
  generateRefId, 
  saveLead,
  createCustomsClearingWhatsAppUrl 
} from '../services/storage';

interface CustomsClearingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rateSettings: RateSettings;
  onLeadCreated: (lead: Lead) => void;
}

export type CustomsOperation = 'Import' | 'Export';
export type ImportMode = 'Courier' | 'AirFreight' | 'SeaFreight';

export const CustomsClearingModal: React.FC<CustomsClearingModalProps> = ({
  isOpen,
  onClose,
  rateSettings,
  onLeadCreated,
}) => {
  // 1. Operation: Import vs Export
  const [operation, setOperation] = useState<CustomsOperation>('Import');

  // Common & Import Fields
  const [bdPort, setBdPort] = useState('Chittagong Sea Port / Customs House');
  const [productDetails, setProductDetails] = useState('');
  const [hsCode, setHsCode] = useState('');
  const [invoiceValueUsd, setInvoiceValueUsd] = useState('');
  const [paymentMode, setPaymentMode] = useState<'LC' | 'TT' | 'Direct'>('LC');
  const [importMode, setImportMode] = useState<ImportMode>('AirFreight');

  // Export Fields
  const [quantity, setQuantity] = useState('');
  const [weight, setWeight] = useState('');
  const [cartons, setCartons] = useState('');
  const [cbm, setCbm] = useState('');
  const [destinationPort, setDestinationPort] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('');
  const [receiverDetails, setReceiverDetails] = useState('');

  // Customer Contact Fields (Mandatory at end)
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [companyName, setCompanyName] = useState('');

  // Step: 'form' | 'result'
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [createdLead, setCreatedLead] = useState<Lead | null>(null);
  const [errors, setErrors] = useState<{
    productDetails?: string;
    customerName?: string;
    customerMobile?: string;
    destination?: string;
  }>({});

  if (!isOpen) return null;

  const bdPorts = [
    'Chittagong Sea Port / Customs House',
    'Hazrat Shahjalal International Airport (HSIA), Dhaka (Airport Freight Unit)',
    'Benapole Land Port Customs House',
    'Pangaon Inland Container Terminal (ICT)',
    'Mongla Port Customs House',
    'Dhaka ICD Kamalapur Customs House',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: {
      productDetails?: string;
      customerName?: string;
      customerMobile?: string;
      destination?: string;
    } = {};

    if (!productDetails.trim()) {
      newErrors.productDetails = 'Please enter Product Details. (পণ্যের বিবরণ দিন)';
    }

    if (operation === 'Export' && !destinationPort.trim()) {
      newErrors.destination = 'Please provide destination port & country. (গন্তব্য পোর্ট দিন)';
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

    const refId = generateRefId('SBC-CNF');
    const leadId = generateLeadId();
    const numericVal = parseFloat(invoiceValueUsd) || 0;
    const numericWeight = parseFloat(weight) || 0;
    const numericCartons = parseInt(cartons, 10) || 0;
    const numericCbm = parseFloat(cbm) || 0;

    const newLead: Lead = {
      id: leadId,
      createdAt: new Date().toISOString(),
      serviceType: 'Customs Clearing',
      customsOperation: operation,
      portName: operation === 'Import' ? bdPort : destinationPort,
      productName: productDetails.trim(),
      quantity: quantity.trim() || undefined,
      approximateWeight: numericWeight || undefined,
      cartonCount: numericCartons || undefined,
      cbm: numericCbm || undefined,
      invoiceValueUsd: numericVal || undefined,
      documentType: operation === 'Import' ? paymentMode : 'EXP Form / ERC',
      destinationPort: operation === 'Export' ? `${destinationPort}, ${destinationCountry}` : undefined,
      applicableRate: 0,
      estimatedCargoCharge: 0, // No estimated charge shown
      additionalDetails: operation === 'Import'
        ? `Mode: ${importMode}, Port: ${bdPort}, Val: $${numericVal}, Payment: ${paymentMode}, HS: ${hsCode || 'N/A'}`
        : `Export to: ${destinationPort}, ${destinationCountry}, Receiver: ${receiverDetails}, Qty: ${quantity}`,
      name: customerName.trim(),
      mobile: customerMobile.trim(),
      companyName: companyName.trim() || undefined,
      preferredContactMethod: 'WhatsApp',
      leadSource: 'Landing Page',
      estimateRefId: refId,
      status: 'New',
      adminNotes: `C&F ${operation} inquiry for ${productDetails} at ${operation === 'Import' ? bdPort : destinationPort}`,
    };

    saveLead(newLead);
    onLeadCreated(newLead);
    setCreatedLead(newLead);
    setStep('result');
  };

  const handleReset = () => {
    setProductDetails('');
    setHsCode('');
    setInvoiceValueUsd('');
    setQuantity('');
    setWeight('');
    setCartons('');
    setCbm('');
    setDestinationPort('');
    setReceiverDetails('');
    setStep('form');
    setErrors({});
  };

  const whatsAppUrl = createCustomsClearingWhatsAppUrl(
    rateSettings.whatsappNumber,
    operation,
    operation === 'Import' ? bdPort : destinationPort,
    productDetails,
    {
      invoiceValueUsd,
      documentType: paymentMode,
      importMode: importMode === 'Courier' ? 'Courier Freight (DHL/FedEx/UPS)' : importMode === 'AirFreight' ? 'Regular Air Freight (B/E)' : 'Sea Container Freight',
      quantity,
      weight,
      cartons,
      cbm,
      destinationPort: `${destinationPort} ${destinationCountry ? `(${destinationCountry})` : ''}`,
      receiverDetails,
      customerName,
      customerMobile,
    }
  );

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
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Customs Clearing (C&F Agent)
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500 text-slate-950">
                  Licensed #1048/BD
                </span>
              </div>
              <p className="text-xs text-emerald-400 font-medium">
                Import & Export Customs Clearance • Air, Sea & Land Ports
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
              
              {/* 1. Operation Selection: Import vs Export */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                  ১. কাস্টমস অপারেশনের ধরন সিলেক্ট করুন <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOperation('Import')}
                    className={`p-3.5 rounded-xl border text-left transition-colors ${
                      operation === 'Import'
                        ? 'border-emerald-500 bg-emerald-50/90 ring-2 ring-emerald-500/20 text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-slate-900">আমদানি (Import Clearance)</span>
                      {operation === 'Import' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      বিদেশ থেকে বাংলাদেশে আসা পণ্যের কাস্টমস খালাস
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOperation('Export')}
                    className={`p-3.5 rounded-xl border text-left transition-colors ${
                      operation === 'Export'
                        ? 'border-emerald-500 bg-emerald-50/90 ring-2 ring-emerald-500/20 text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-slate-900">রপ্তানি (Export Clearance)</span>
                      {operation === 'Export' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      বাংলাদেশ থেকে বিদেশে পণ্য প্রেরণের কাস্টমস প্রসেসিং
                    </span>
                  </button>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* BRANCH A: IMPORT CLEARANCE                                                */}
              {/* ========================================================================= */}
              {operation === 'Import' ? (
                <div className="space-y-4">
                  {/* Port Selection */}
                  <div>
                    <label htmlFor="cnf-port" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      বাংলাদেশ পোর্ট / কাস্টমস হাউস <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="cnf-port"
                      value={bdPort}
                      onChange={(e) => setBdPort(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                    >
                      {bdPorts.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  {/* Delivery / Shipping Mode */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      শিপমেন্ট ডেলিভারি মাধ্যম <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setImportMode('Courier')}
                        className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
                          importMode === 'Courier'
                            ? 'border-emerald-500 bg-emerald-50 font-bold text-slate-900'
                            : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>Courier Freight</span>
                          {importMode === 'Courier' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        </div>
                        <span className="text-[10px] text-slate-500 block">DHL / FedEx / UPS / Aramex</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setImportMode('AirFreight')}
                        className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
                          importMode === 'AirFreight'
                            ? 'border-emerald-500 bg-emerald-50 font-bold text-slate-900'
                            : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>Direct Air Freight</span>
                          {importMode === 'AirFreight' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        </div>
                        <span className="text-[10px] text-slate-500 block">Commercial Cargo (B/E)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setImportMode('SeaFreight')}
                        className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
                          importMode === 'SeaFreight'
                            ? 'border-emerald-500 bg-emerald-50 font-bold text-slate-900'
                            : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>Sea Container</span>
                          {importMode === 'SeaFreight' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        </div>
                        <span className="text-[10px] text-slate-500 block">LCL / FCL Container</span>
                      </button>
                    </div>
                  </div>

                  {/* Required Documents Information Box for selected mode */}
                  <div className="bg-slate-100 rounded-xl p-3 border border-slate-200 text-xs text-slate-700 space-y-1">
                    <span className="font-bold text-slate-900 block flex items-center">
                      <FileText className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      ক্লিয়ারেন্সের জন্য প্রয়োজনীয় ডকুমেন্টস (WhatsApp-এ পাঠাতে হবে):
                    </span>
                    {importMode === 'Courier' && (
                      <p className="text-[11px] text-slate-600">
                        • Air Waybill (AWB) বা ট্র্যাকিং কপি • House AWB • Commercial Invoice • Packing List • কার্গো অ্যারাইভাল নোটিশ (Arrival Notice)।
                      </p>
                    )}
                    {importMode === 'AirFreight' && (
                      <p className="text-[11px] text-slate-600">
                        • Master AWB & House AWB • Commercial Invoice • Packing List • Country of Origin (COO) • Letter of Credit (L/C) কপি বা ব্যাংক পারমিট।
                      </p>
                    )}
                    {importMode === 'SeaFreight' && (
                      <p className="text-[11px] text-slate-600">
                        • Original Bill of Lading (B/L) • Commercial Invoice • Packing List • L/C কপি • Form-C • ইন্সুরেন্স সার্টিফিকেট • ডেলিভারি অর্ডার (DO)।
                      </p>
                    )}
                  </div>

                  {/* Product Details & HS Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-8">
                      <label htmlFor="cnf-product-details" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Product Details (পণ্যের বিবরণ) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="cnf-product-details"
                        type="text"
                        required
                        value={productDetails}
                        onChange={(e) => {
                          setProductDetails(e.target.value);
                          if (errors.productDetails) setErrors({ ...errors, productDetails: undefined });
                        }}
                        placeholder="যেমন: Electronic Components, Medical Machine, Garment Accessories"
                        className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border focus:outline-none ${
                          errors.productDetails ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300 focus:border-emerald-500 bg-white'
                        }`}
                      />
                      {errors.productDetails && (
                        <p className="text-xs text-rose-600 mt-1">{errors.productDetails}</p>
                      )}
                    </div>

                    <div className="sm:col-span-4">
                      <label htmlFor="cnf-hs-code" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        HS Code <span className="text-slate-400 font-normal">(জানা থাকলে)</span>
                      </label>
                      <input
                        id="cnf-hs-code"
                        type="text"
                        value={hsCode}
                        onChange={(e) => setHsCode(e.target.value)}
                        placeholder="e.g. 8504.40.90"
                        className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 bg-white"
                      />
                    </div>
                  </div>

                  {/* Invoice Value & Payment Mode */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="cnf-inv-val" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Invoice Value ($ USD) <span className="text-slate-400 font-normal">(ঐচ্ছিক)</span>
                      </label>
                      <div className="relative">
                        <input
                          id="cnf-inv-val"
                          type="number"
                          value={invoiceValueUsd}
                          onChange={(e) => setInvoiceValueUsd(e.target.value)}
                          placeholder="e.g. 12500"
                          className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 pr-12 focus:outline-none focus:border-emerald-500 bg-white"
                        />
                        <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">USD</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        ব্যাংকিং পেমেন্ট মোড <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setPaymentMode('LC')}
                          className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-colors ${
                            paymentMode === 'LC'
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                              : 'border-slate-300 bg-white text-slate-600'
                          }`}
                        >
                          L/C
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMode('TT')}
                          className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-colors ${
                            paymentMode === 'TT'
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                              : 'border-slate-300 bg-white text-slate-600'
                          }`}
                        >
                          T/T
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMode('Direct')}
                          className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-colors ${
                            paymentMode === 'Direct'
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                              : 'border-slate-300 bg-white text-slate-600'
                          }`}
                        >
                          Direct Purchase
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* ========================================================================= */
                /* BRANCH B: EXPORT CLEARANCE                                                */
                /* ========================================================================= */
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cnf-exp-product" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      রপ্তানি পণ্যের বিবরণ (Export Product Details) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="cnf-exp-product"
                      type="text"
                      required
                      value={productDetails}
                      onChange={(e) => {
                        setProductDetails(e.target.value);
                        if (errors.productDetails) setErrors({ ...errors, productDetails: undefined });
                      }}
                      placeholder="যেমন: Ready Made Garments (RMG), Jute Products, Handicrafts, Leather"
                      className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border focus:outline-none ${
                        errors.productDetails ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300 focus:border-emerald-500 bg-white'
                      }`}
                    />
                    {errors.productDetails && (
                      <p className="text-xs text-rose-600 mt-1">{errors.productDetails}</p>
                    )}
                  </div>

                  {/* Quantity, Weight, Cartons & CBM */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label htmlFor="cnf-exp-qty" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Quantity & Unit
                      </label>
                      <input
                        id="cnf-exp-qty"
                        type="text"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="e.g. 5000 Pcs"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 bg-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="cnf-exp-weight" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Gross Weight
                      </label>
                      <div className="relative">
                        <input
                          id="cnf-exp-weight"
                          type="number"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          placeholder="e.g. 1200"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 pr-8 focus:outline-none focus:border-emerald-500 bg-white"
                        />
                        <span className="absolute right-2 top-2 text-[11px] font-bold text-slate-400">KG</span>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="cnf-exp-cartons" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Carton Count
                      </label>
                      <input
                        id="cnf-exp-cartons"
                        type="number"
                        value={cartons}
                        onChange={(e) => setCartons(e.target.value)}
                        placeholder="e.g. 80 Cartons"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 bg-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="cnf-exp-cbm" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Total CBM
                      </label>
                      <div className="relative">
                        <input
                          id="cnf-exp-cbm"
                          type="number"
                          step="0.1"
                          value={cbm}
                          onChange={(e) => setCbm(e.target.value)}
                          placeholder="e.g. 4.2"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 pr-9 focus:outline-none focus:border-emerald-500 bg-white"
                        />
                        <span className="absolute right-2 top-2 text-[11px] font-bold text-slate-400">CBM</span>
                      </div>
                    </div>
                  </div>

                  {/* Destination Port & Country */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="cnf-exp-dest-port" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Destination Port (গন্তব্য পোর্ট) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="cnf-exp-dest-port"
                        type="text"
                        required
                        value={destinationPort}
                        onChange={(e) => setDestinationPort(e.target.value)}
                        placeholder="যেমন: Port of Hamburg / Felixstowe / JFK Airport"
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 bg-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="cnf-exp-dest-country" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Destination Country (গন্তব্য দেশ)
                      </label>
                      <input
                        id="cnf-exp-dest-country"
                        type="text"
                        value={destinationCountry}
                        onChange={(e) => setDestinationCountry(e.target.value)}
                        placeholder="যেমন: Germany, UK, USA, Canada"
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 bg-white"
                      />
                    </div>
                  </div>

                  {/* Receiver / Consignee Details */}
                  <div>
                    <label htmlFor="cnf-exp-receiver" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Receiver / Consignee Details (ক্রেতা / আমদানিকারক প্রতিষ্ঠান)
                    </label>
                    <input
                      id="cnf-exp-receiver"
                      type="text"
                      value={receiverDetails}
                      onChange={(e) => setReceiverDetails(e.target.value)}
                      placeholder="Buyer Company Name & Contact Details"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 bg-white"
                    />
                  </div>

                  {/* Export Required Documents Notice */}
                  <div className="bg-slate-100 rounded-xl p-3 border border-slate-200 text-xs text-slate-700">
                    <span className="font-bold text-slate-900 block flex items-center">
                      <FileText className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      রপ্তানি ক্লিয়ারেন্সের জন্য প্রয়োজনীয় ডকুমেন্টস:
                    </span>
                    <p className="text-[11px] text-slate-600 mt-1">
                      • Commercial Invoice & Packing List • Export Registration Certificate (ERC) • ব্যাংক অনুমোদিত EXP Form • কান্ট্রি অফ অরিজিন (COO) • শিপিং বিল প্রিন্ট।
                    </p>
                  </div>
                </div>
              )}

              {/* No Estimated Rate Notice */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-950">
                <span className="font-bold block text-emerald-900 mb-0.5">
                  কাস্টমস ক্লিয়ারেন্স সার্ভিস চার্জ সংক্রান্ত তথ্য:
                </span>
                কাস্টমস ক্লিয়ারিং ফি এবং অ্যাসাইনমেন্ট চার্জ প্রতিটি কনসাইনমেন্টের পোর্ট, ইনভয়েস ভ্যালু ও ডকুমেন্টস টাইপের ওপর নির্ভর করে। আপনার ডকুমেন্টস যাচাইয়ের পর আমাদের অভিজ্ঞ সিএন্ডএফ ডেস্ক সর্বনিম্ন সার্ভিস চার্জে চূড়ান্ত কোটেশন প্রদান করবে।
              </div>

              {/* CUSTOMER CONTACT (Mandatory at end) */}
              <div className="bg-slate-100/80 border-2 border-emerald-400/80 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center">
                    <User className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                    আপনার যোগাযোগের তথ্য (কোটেশন ও পরামর্শের জন্য)
                  </span>
                  <span className="text-[11px] font-bold text-rose-600">আবশ্যক *</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="cnf-customer-name" className="block text-xs font-semibold text-slate-700 mb-1">
                      আপনার নাম (Customer Name) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="cnf-customer-name"
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => {
                          setCustomerName(e.target.value);
                          if (errors.customerName) setErrors({ ...errors, customerName: undefined });
                        }}
                        placeholder="আপনার পূর্ণ নাম"
                        className={`w-full pl-8 pr-3 py-2 text-xs rounded-lg border transition-colors focus:outline-none ${
                          errors.customerName ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300 focus:border-emerald-500 bg-white'
                        }`}
                      />
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                    {errors.customerName && (
                      <p className="text-[11px] text-rose-600 mt-0.5">{errors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="cnf-customer-mobile" className="block text-xs font-semibold text-slate-700 mb-1">
                      মোবাইল / WhatsApp নম্বর <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="cnf-customer-mobile"
                        type="tel"
                        required
                        value={customerMobile}
                        onChange={(e) => {
                          setCustomerMobile(e.target.value);
                          if (errors.customerMobile) setErrors({ ...errors, customerMobile: undefined });
                        }}
                        placeholder="017... / 018..."
                        className={`w-full pl-8 pr-3 py-2 text-xs rounded-lg border transition-colors focus:outline-none ${
                          errors.customerMobile ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300 focus:border-emerald-500 bg-white'
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
                  <label htmlFor="cnf-customer-company" className="block text-xs font-semibold text-slate-700 mb-1">
                    প্রতিষ্ঠানের নাম (Company / Importer Name) <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="cnf-customer-company"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="আমদানিকারক বা রপ্তানিকারক প্রতিষ্ঠানের নাম"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 bg-white"
                    />
                    <Building className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-sm sm:text-base shadow-lg transition-colors"
              >
                <ShieldCheck className="w-5 h-5 mr-2" />
                <span>Submit Customs Clearing Inquiry</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>

            </form>
          ) : (
            /* RESULT SCREEN */
            <div className="space-y-6">
              
              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 border border-slate-800 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                      C&amp;F AGENT • LICENSED CUSTOMS DESK
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      কাস্টমস ক্লিয়ারেন্স রিকুয়েস্ট গ্রহণ করা হয়েছে
                    </h3>
                  </div>
                </div>

                {/* Team Working Notice */}
                <div className="bg-emerald-950/80 border-2 border-emerald-500 rounded-2xl p-5 text-center my-3">
                  <div className="text-base sm:text-lg font-black text-emerald-200">
                    আপনার {operation === 'Import' ? 'আমদানি' : 'রপ্তানি'} ডকুমেন্টস পর্যালোচনার জন্য প্রস্তুত!
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-300 mt-2 leading-relaxed">
                    আমাদের সিনিয়র লাইসেন্সপ্রাপ্ত কাস্টমস অ্যাসেসর আপনার তথ্যাবলী যাচাই করে দ্রুততম সময়ে সর্বনিম্ন সার্ভিস চার্জে চূড়ান্ত কোটেশন ও কাস্টমস ছাড়পত্র গাইডলাইন প্রদান করবে।
                  </p>
                  <div className="mt-3 inline-block px-4 py-1.5 rounded-full bg-emerald-500 text-slate-950 font-black text-xs">
                    লাইসেন্স নং: #1048/BD • চট্টগ্রাম ও ঢাকা কাস্টমস হাউস
                  </div>
                </div>

                {/* Inquiry Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                  <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700">
                    <span className="text-slate-400 block font-medium">Operation</span>
                    <span className="text-sm font-bold text-white block mt-0.5">
                      {operation} Clearance
                    </span>
                  </div>

                  <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700">
                    <span className="text-slate-400 block font-medium">Port</span>
                    <span className="text-sm font-bold text-emerald-400 block mt-0.5 truncate" title={operation === 'Import' ? bdPort : destinationPort}>
                      {operation === 'Import' ? bdPort : destinationPort}
                    </span>
                  </div>

                  <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700">
                    <span className="text-slate-400 block font-medium">Product</span>
                    <span className="text-sm font-bold text-white block mt-0.5 truncate" title={productDetails}>
                      {productDetails}
                    </span>
                  </div>

                  <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700">
                    <span className="text-slate-400 block font-medium">Payment Mode</span>
                    <span className="text-sm font-bold text-white block mt-0.5">
                      {paymentMode}
                    </span>
                  </div>
                </div>

                {/* Ref & Customer */}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800 gap-2">
                  <span>Ref ID: <strong className="text-slate-200 font-mono">{createdLead?.estimateRefId}</strong></span>
                  <span>Lead: <strong className="text-emerald-400 font-mono">{createdLead?.id}</strong></span>
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
                  <span>Send Documents to Customs Desk on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-300 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
                  <span>Submit Another Customs Inquiry</span>
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-5 sm:px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Official Customs Agent: Bill of Entry (B/E) • Assessment • DO Release</span>
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
