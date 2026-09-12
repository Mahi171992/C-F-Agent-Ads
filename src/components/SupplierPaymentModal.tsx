import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Calculator, 
  ArrowRight, 
  CheckCircle2, 
  FileDown, 
  MessageCircle, 
  Building, 
  User, 
  Phone, 
  DollarSign, 
  Coins, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { RateSettings, Lead, ContactMethod } from '../types';
import { 
  generateLeadId, 
  generateRefId, 
  saveLead, 
  createSupplierPaymentWhatsAppUrl 
} from '../services/storage';
import { PadQuotationData } from './OfficialLetterheadPad';

interface SupplierPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  rateSettings: RateSettings;
  onLeadCreated: (lead: Lead) => void;
  onOpenPad: (data: PadQuotationData) => void;
}

export const SupplierPaymentModal: React.FC<SupplierPaymentModalProps> = ({
  isOpen,
  onClose,
  rateSettings,
  onLeadCreated,
  onOpenPad,
}) => {
  // Calculation inputs
  const [currency, setCurrency] = useState<'RMB' | 'USD'>('RMB');
  const [amount, setAmount] = useState<string>('10000');
  const [purpose, setPurpose] = useState('1688 / Alibaba / Direct Factory Settlement');

  // Customer details (at the end as requested: "Get Quick Estimate e Customer Name & Number Last e dite hobe sob gulor jonno")
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [preferredContact, setPreferredContact] = useState<ContactMethod>('WhatsApp');

  // Steps: 'calculate' | 'accepted'
  const [step, setStep] = useState<'calculate' | 'accepted'>('calculate');
  const [createdLead, setCreatedLead] = useState<Lead | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const currentExchangeRate = currency === 'RMB' ? rateSettings.rmbRate : rateSettings.usdRate;
  const numericAmount = parseFloat(amount) || 0;
  const approximateTotalBdt = Math.round(numericAmount * currentExchangeRate);

  const handleAcceptAndGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerMobile.trim()) {
      setErrorMsg('Please provide your Name & Mobile number to generate your official C&F quotation pad. (নাম ও মোবাইল নম্বর দিন)');
      return;
    }

    if (numericAmount <= 0) {
      setErrorMsg('Please enter a valid amount greater than 0.');
      return;
    }

    setErrorMsg('');

    const refId = generateRefId('SBC-PAY');
    const leadId = generateLeadId();

    const newLead: Lead = {
      id: leadId,
      createdAt: new Date().toISOString(),
      serviceType: 'Supplier Payment Support',
      productName: `${currency} Supplier Payment (${purpose})`,
      currency,
      foreignAmount: numericAmount,
      exchangeRate: currentExchangeRate,
      applicableRate: currentExchangeRate,
      estimatedCargoCharge: approximateTotalBdt,
      name: customerName.trim(),
      mobile: customerMobile.trim(),
      companyName: companyName.trim() || undefined,
      preferredContactMethod: preferredContact,
      leadSource: 'Landing Page',
      estimateRefId: refId,
      status: 'New',
      adminNotes: `Client accepted ${currency} rate @ ৳${currentExchangeRate}. Generated official pad.`,
    };

    saveLead(newLead);
    onLeadCreated(newLead);
    setCreatedLead(newLead);
    setStep('accepted');
  };

  const handleViewOfficialPad = () => {
    const padData: PadQuotationData = {
      refId: createdLead?.estimateRefId || generateRefId('SBC-PAY'),
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      serviceTitle: 'International Supplier Payment & Trade Settlement Facilitation',
      clientName: customerName || 'Valued Importer',
      clientMobile: customerMobile || '',
      clientCompany: companyName || undefined,
      currency,
      foreignAmount: numericAmount,
      exchangeRate: currentExchangeRate,
      approximateTotalBdt,
      particulars: [
        { label: 'Settlement Service', value: 'Direct Foreign Supplier Payment Coordination' },
        { label: 'Payment Currency', value: currency === 'RMB' ? 'Chinese Yuan (RMB ¥)' : 'US Dollar (USD $)' },
        { label: 'Remittance Amount', value: `${currency === 'RMB' ? '¥' : '$'}${numericAmount.toLocaleString()}` },
        { label: 'Agreed Fixed Exchange Rate', value: `৳${currentExchangeRate} BDT per 1 ${currency}` },
        { label: 'Channel & Purpose', value: purpose },
        { label: 'C&F Agent Facilitation Fee', value: 'Included in Rate' },
      ],
      terms: [
        'Exchange rate locked for 24 hours from quotation generation date.',
        'Client must provide Supplier Proforma Invoice (PI) and verified Chinese Bank / Alipay account details.',
        'Payment settlement processed within same-day or maximum 24 business hours upon BDT deposit verification in C&F Agent bank account.',
        'Official electronic payment proof (TT / Bank Slip) will be provided promptly upon settlement completion.',
      ],
    };

    onOpenPad(padData);
  };

  const whatsAppUrl = createSupplierPaymentWhatsAppUrl(
    rateSettings.whatsappNumber,
    currency,
    numericAmount,
    currentExchangeRate,
    `৳${approximateTotalBdt.toLocaleString()}`,
    customerName
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Supplier Payment Support
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 uppercase">
                  Direct Rate
                </span>
              </div>
              <p className="text-xs text-amber-400 font-medium">
                RMB (¥) & USD ($) Safe Settlement to China & Global Suppliers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-5">
          
          {step === 'calculate' ? (
            <form onSubmit={handleAcceptAndGenerate} className="space-y-5">
              
              {/* Notice Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 flex items-start justify-between">
                <div>
                  <span className="font-bold block">লাইভ রেট দিয়ে সরাসরি আপনার সাপ্লায়ার পেমেন্টের আনুমানিক মোট হিসাব দেখুন।</span>
                  <span className="text-[11px] text-amber-800 mt-0.5 block">
                    রেট অ্যাক্সেপ্ট করলে C&F Agent অফিশিয়াল প্যাডে প্রফর্মা কোটেশন PDF ডাউনলোড করতে পারবেন।
                  </span>
                </div>
                <Coins className="w-5 h-5 text-amber-600 shrink-0 ml-2" />
              </div>

              {/* Currency Selector (RMB / USD) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Select Currency (কারেন্সি নির্বাচন করুন)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrency('RMB')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      currency === 'RMB'
                        ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20 text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-extrabold flex items-center">
                        <span className="text-amber-600 mr-1.5 text-lg font-black">¥</span> Chinese Yuan (RMB)
                      </span>
                      {currency === 'RMB' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                    </div>
                    <div className="mt-2 text-xs font-bold text-slate-900">
                      Live Rate: <span className="text-amber-700 font-extrabold text-sm">৳{rateSettings.rmbRate}</span> / RMB
                    </div>
                    <span className="text-[10px] text-slate-500 block">For 1688, Taobao & China Factories</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrency('USD')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      currency === 'USD'
                        ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20 text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-extrabold flex items-center">
                        <span className="text-amber-600 mr-1.5 text-lg font-black">$</span> US Dollar (USD)
                      </span>
                      {currency === 'USD' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                    </div>
                    <div className="mt-2 text-xs font-bold text-slate-900">
                      Live Rate: <span className="text-amber-700 font-extrabold text-sm">৳{rateSettings.usdRate}</span> / USD
                    </div>
                    <span className="text-[10px] text-slate-500 block">For International TT & Alibaba Trade</span>
                  </button>
                </div>
              </div>

              {/* Amount to Transfer */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Amount in {currency} (কত {currency} পাঠাতে চান?) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-bold">
                    {currency === 'RMB' ? '¥' : '$'}
                  </div>
                  <input
                    type="number"
                    min="100"
                    step="any"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={currency === 'RMB' ? 'e.g. 25000' : 'e.g. 5000'}
                    className="w-full pl-8 pr-16 py-2.5 rounded-xl border border-slate-300 text-sm font-bold bg-white text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs font-bold text-slate-500">
                    {currency}
                  </div>
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Payment Purpose / Platform
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
                >
                  <option value="1688 / Alibaba / Direct Factory Settlement">1688 / Alibaba / Direct Factory Settlement</option>
                  <option value="Sample Order & Mold Fee">Sample Order & Mold Fee</option>
                  <option value="Commercial Production Balance (TT)">Commercial Production Balance (TT)</option>
                  <option value="Alipay / WeChat Direct Supplier Transfer">Alipay / WeChat Direct Supplier Transfer</option>
                  <option value="Other Commercial Payment">Other Commercial Payment</option>
                </select>
              </div>

              {/* Live Calculation Display Box */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 text-center">
                <span className="text-xs uppercase font-bold text-amber-400 tracking-wider block mb-1">
                  Approximate Total Required (BDT)
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white">
                  ৳{approximateTotalBdt.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-mono">
                  Calculation: {currency === 'RMB' ? '¥' : '$'}{numericAmount.toLocaleString()} × ৳{currentExchangeRate} per {currency}
                </div>
              </div>

              {/* Mandatory Customer Details at the End (Last e) as requested */}
              <div className="bg-slate-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 space-y-3.5">
                <div className="border-b border-slate-200 pb-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase">
                    Customer Information (Last Step to Accept & Get Official PDF Pad)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    অফিশিয়াল কোটেশন প্যাড তৈরি ও রেকর্ড সংরক্ষণের জন্য আপনার নাম ও নম্বর দিন।
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Customer Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="আপনার নাম"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile / WhatsApp Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerMobile}
                      onChange={(e) => setCustomerMobile(e.target.value)}
                      placeholder="+880 17... / 01..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Company / Business Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Dhaka Trade International"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Preferred Contact Method
                    </label>
                    <div className="flex gap-2">
                      {(['WhatsApp', 'Phone Call'] as ContactMethod[]).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setPreferredContact(m)}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                            preferredContact === m
                              ? 'bg-amber-500 text-slate-950 border-amber-500'
                              : 'bg-white text-slate-700 border-slate-300'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2 rounded border border-rose-200">
                    {errorMsg}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] flex items-center justify-center"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  <span>Accept Rate & Generate Official C&F Pad</span>
                </button>
              </div>

            </form>
          ) : (
            /* Accepted View */
            <div className="space-y-6 text-center py-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs uppercase font-bold text-amber-600 tracking-wider">
                  Official Rate Accepted
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  Quotation Pad Generated!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                  Your supplier payment estimate has been verified and registered with reference ID:
                </p>
                <span className="inline-block mt-2 font-mono font-black text-sm px-3 py-1 bg-slate-100 border border-slate-300 rounded-lg text-slate-800">
                  {createdLead?.estimateRefId}
                </span>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs max-w-md mx-auto text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Applicant Name:</span>
                  <span className="font-bold text-slate-900">{customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transfer Amount:</span>
                  <span className="font-bold text-slate-900">{currency === 'RMB' ? '¥' : '$'}{numericAmount.toLocaleString()} {currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Exchange Rate:</span>
                  <span className="font-bold text-amber-700">৳{currentExchangeRate} per {currency}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-black text-sm">
                  <span className="text-slate-800">Total BDT:</span>
                  <span className="text-amber-900">৳{approximateTotalBdt.toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <button
                  onClick={handleViewOfficialPad}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  <span>Download / Print Official Pad (PDF)</span>
                </button>

                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span>Send to C&amp;F WhatsApp Desk</span>
                </a>
              </div>

              <button
                onClick={() => setStep('calculate')}
                className="text-xs text-slate-500 hover:text-slate-800 underline block mx-auto pt-2"
              >
                Calculate another payment transfer
              </button>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-5 sm:px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>C&F Agent — Licensed Customs Clearing & Forwarding</span>
          <button
            onClick={onClose}
            className="text-slate-700 hover:text-slate-900 font-bold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
