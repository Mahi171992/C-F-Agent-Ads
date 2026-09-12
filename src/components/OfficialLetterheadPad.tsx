import React from 'react';
import { Printer, Download, X, ShieldCheck, Building2, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { RateSettings } from '../types';

export interface PadQuotationData {
  refId: string;
  date: string;
  serviceTitle: string;
  clientName: string;
  clientMobile: string;
  clientCompany?: string;
  currency?: 'RMB' | 'USD';
  foreignAmount?: number;
  exchangeRate?: number;
  approximateTotalBdt: number;
  particulars: {
    label: string;
    value: string;
  }[];
  terms: string[];
}

interface OfficialLetterheadPadProps {
  isOpen: boolean;
  onClose: () => void;
  data: PadQuotationData | null;
  rateSettings: RateSettings;
}

export const OfficialLetterheadPad: React.FC<OfficialLetterheadPadProps> = ({
  isOpen,
  onClose,
  data,
  rateSettings,
}) => {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-sm overflow-y-auto animate-fadeIn print:p-0 print:bg-white print:static"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden my-auto max-h-[96vh] flex flex-col print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Action Bar (Hidden in Print) */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0 print:hidden">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold">Official C&F Agent Pad Preview</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Letterhead Document Body */}
        <div id="printable-pad" className="p-8 sm:p-12 overflow-y-auto flex-1 bg-white text-slate-900 print:p-6">
          
          {/* Company Official Letterhead Header */}
          <div className="border-b-2 border-slate-900 pb-5 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left">
              
              {/* Crest & Title */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center font-black text-2xl border-2 border-amber-500 shadow-md">
                  C&amp;F
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight uppercase">
                    {rateSettings.companyName}
                  </h1>
                  <p className="text-xs font-bold text-amber-700 tracking-wide">
                    LICENSED CUSTOMS CLEARING &amp; FORWARDING (C&amp;F) AGENT
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Govt. Customs License Reg. No: <strong>#1048/BD</strong> • Custom House Dhaka (Airport) &amp; Chattogram Port
                  </p>
                </div>
              </div>

              {/* Contact Snapshot */}
              <div className="text-right text-[11px] text-slate-600 space-y-0.5 sm:border-l sm:border-slate-200 sm:pl-4">
                <p className="font-semibold text-slate-800">Head Office: Motijheel C/A, Dhaka-1000</p>
                <p>Airport Desk: HSIA Cargo Village, Dhaka</p>
                <p>Port Office: Agrabad C/A, Chattogram</p>
                <p className="font-bold text-slate-900">Hotline: {rateSettings.whatsappNumber}</p>
                <p>Support: Available on WhatsApp</p>
              </div>

            </div>
          </div>

          {/* Quotation Document Badge & Meta */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-3.5 rounded-xl border border-slate-200 mb-6 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                DOCUMENT TYPE
              </span>
              <span className="font-black text-slate-900 text-sm">
                OFFICIAL PROFORMA QUOTATION & RATE ACCEPTANCE
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 block">REFERENCE ID</span>
              <span className="font-mono font-bold text-slate-900 text-xs">
                {data.refId}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Date: {data.date}</span>
            </div>
          </div>

          {/* Client Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                ISSUED TO (APPLICANT)
              </span>
              <div className="mt-1 font-bold text-slate-900 text-sm">
                {data.clientName || 'Valued Business Client'}
              </div>
              {data.clientCompany && (
                <div className="text-slate-700 font-medium">{data.clientCompany}</div>
              )}
              {data.clientMobile && (
                <div className="text-slate-700 font-medium">Contact: {data.clientMobile}</div>
              )}
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                FACILITATING C&F DESK
              </span>
              <div className="mt-1 font-bold text-slate-900">
                {rateSettings.companyName} — Commercial Desk
              </div>
              <div className="text-slate-600">Service: {data.serviceTitle}</div>
              <div className="text-emerald-700 font-semibold text-[11px]">
                Status: Verified Rate Acceptance
              </div>
            </div>
          </div>

          {/* Particulars Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden mb-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-bold">
                  <th className="py-2.5 px-4">Item / Description</th>
                  <th className="py-2.5 px-4 text-right">Details / Calculation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.particulars.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="py-2.5 px-4 font-semibold text-slate-800">{item.label}</td>
                    <td className="py-2.5 px-4 text-right font-medium text-slate-900">{item.value}</td>
                  </tr>
                ))}
                
                {/* Total Row */}
                <tr className="bg-amber-50/80 font-black text-sm">
                  <td className="py-3 px-4 text-slate-950 uppercase">
                    Approximate Total Amount (BDT)
                  </td>
                  <td className="py-3 px-4 text-right text-base text-amber-900 font-black">
                    {rateSettings.currencySymbol}{data.approximateTotalBdt.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Terms & Verification Notice */}
          <div className="mb-8 space-y-2 text-[11px] text-slate-600">
            <h5 className="font-bold text-slate-900 uppercase text-xs">
              Terms & Operational Conditions:
            </h5>
            <ul className="list-disc pl-5 space-y-1">
              {data.terms.map((term, i) => (
                <li key={i}>{term}</li>
              ))}
            </ul>
          </div>

          {/* Official Seal & Signature Strip */}
          <div className="pt-8 border-t border-slate-200 flex items-end justify-between text-xs">
            <div className="text-center">
              <div className="w-24 h-24 border-2 border-dashed border-amber-600/40 rounded-full flex flex-col items-center justify-center text-amber-700 font-bold text-[9px] p-1 mx-auto bg-amber-50/30">
                <ShieldCheck className="w-6 h-6 text-amber-600 mb-0.5" />
                <span>C&amp;F AGENT</span>
                <span>CUSTOMS CLEARING</span>
                <span className="text-[8px] text-slate-500">LIC #1048/BD</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">Official Agency Seal</span>
            </div>

            <div className="text-center min-w-[180px]">
              <div className="h-10 border-b border-slate-900 mb-1 flex items-end justify-center">
                <span className="font-serif italic text-sm text-slate-800 font-bold">
                  Customs Officer
                </span>
              </div>
              <p className="font-bold text-slate-900 text-xs">Authorized Signatory</p>
              <p className="text-[10px] text-slate-500">{rateSettings.companyName}</p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 print:hidden">
          <span>Official electronic quotation generated on company pad.</span>
          <button
            onClick={onClose}
            className="text-slate-700 hover:text-slate-900 font-bold"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
