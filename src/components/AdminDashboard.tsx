import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Filter, 
  Download, 
  Save, 
  UserCheck, 
  Clock, 
  Phone, 
  Mail, 
  Building, 
  AlertCircle, 
  CheckCircle2, 
  Settings, 
  ListOrdered, 
  DollarSign, 
  MessageSquare,
  Lock,
  LogOut,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Ship,
  Plane,
  Briefcase,
  HelpCircle,
  Coins,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { Lead, LeadStatus, ServiceType, RateSettings } from '../types';
import { exportLeadsToCSV } from '../services/storage';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
  onUpdateLead: (id: string, updates: Partial<Lead>) => void;
  rateSettings: RateSettings;
  onSaveRateSettings: (newSettings: RateSettings) => void;
}

const ALL_STATUSES: LeadStatus[] = [
  'New',
  'Contacted',
  'Quotation Prepared',
  'Follow-up Required',
  'Converted',
  'Not Interested',
  'Closed',
];

const ALL_SERVICES: (ServiceType | 'All')[] = [
  'All',
  'Air D2D Cargo',
  'Sea D2D Cargo',
  'Supplier Payment Support',
  'Hand Carry Cargo',
  'Import Consultancy',
  'Customs Clearing',
];

const STAFF_MEMBERS = [
  'Tanvir Hossain (Operations Desk)',
  'Farhana Sultana (Air C&F Specialist)',
  'Kawsar Ahmed (Guangzhou Hub)',
  'Senior Operations Manager',
  'Unassigned',
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  leads,
  onUpdateLead,
  rateSettings,
  onSaveRateSettings,
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('sbc_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [passError, setPassError] = useState('');

  // Active tab
  const [activeTab, setActiveTab] = useState<'leads' | 'rates'>('leads');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [serviceFilter, setServiceFilter] = useState<string>('All');

  // Expanded lead details card
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);

  // Rate Settings form state
  const [editChinaRate, setEditChinaRate] = useState<number>(rateSettings.chinaRate);
  const [editHkRate, setEditHkRate] = useState<number>(rateSettings.hongKongRate);
  const [editRmbRate, setEditRmbRate] = useState<number>(rateSettings.rmbRate || 17.50);
  const [editUsdRate, setEditUsdRate] = useState<number>(rateSettings.usdRate || 124.00);
  const [editSeaCbmRate, setEditSeaCbmRate] = useState<number>(rateSettings.seaCbmRate || 16500);
  const [editHandCarryRate, setEditHandCarryRate] = useState<number>(rateSettings.handCarryPerKgRate || 1800);
  const [editHandCarrySensitiveRate, setEditHandCarrySensitiveRate] = useState<number>(rateSettings.handCarrySensitiveRate || 2200);
  const [editHandCarryBase, setEditHandCarryBase] = useState<number>(rateSettings.handCarryBaseFee || 35000);
  const [editWhatsapp, setEditWhatsapp] = useState<string>(rateSettings.whatsappNumber);
  const [ratesSavedAlert, setRatesSavedAlert] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin123' || passcode === 'sbcnf') {
      setIsAuthenticated(true);
      localStorage.setItem('sbc_admin_auth', 'true');
      setPassError('');
    } else {
      setPassError('Invalid passcode. Default passcode is: admin123');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('sbc_admin_auth');
    setPasscode('');
  };

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: RateSettings = {
      ...rateSettings,
      chinaRate: Number(editChinaRate),
      hongKongRate: Number(editHkRate),
      rmbRate: Number(editRmbRate),
      usdRate: Number(editUsdRate),
      seaCbmRate: Number(editSeaCbmRate),
      handCarryPerKgRate: Number(editHandCarryRate),
      handCarrySensitiveRate: Number(editHandCarrySensitiveRate),
      handCarryBaseFee: Number(editHandCarryBase),
      whatsappNumber: editWhatsapp.trim(),
    };
    onSaveRateSettings(updated);
    setRatesSavedAlert(true);
    setTimeout(() => setRatesSavedAlert(false), 3000);
  };

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.name && lead.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.companyName && lead.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lead.estimateRefId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    const matchesService = serviceFilter === 'All' || lead.serviceType === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  // Summary Metrics
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === 'New').length;
  const convertedLeads = leads.filter((l) => l.status === 'Converted').length;
  const totalPipelineCharge = leads.reduce((acc, l) => acc + (l.estimatedCargoCharge || 0), 0);

  const getServiceBadge = (type: ServiceType) => {
    switch (type) {
      case 'Supplier Payment Support':
        return <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold flex items-center"><Coins className="w-3 h-3 mr-1 text-amber-600" /> Payment</span>;
      case 'Sea D2D Cargo':
        return <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] font-bold flex items-center"><Ship className="w-3 h-3 mr-1 text-blue-600" /> Sea D2D</span>;
      case 'Hand Carry Cargo':
        return <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded text-[10px] font-bold flex items-center"><Briefcase className="w-3 h-3 mr-1 text-rose-600" /> Hand Carry</span>;
      case 'Import Consultancy':
        return <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-[10px] font-bold flex items-center"><HelpCircle className="w-3 h-3 mr-1 text-purple-600" /> Consultancy</span>;
      case 'Customs Clearing':
        return <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold flex items-center"><ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" /> C&F Customs</span>;
      default:
        return <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded text-[10px] font-bold flex items-center"><Plane className="w-3 h-3 mr-1 text-sky-600" /> Air D2D</span>;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black">
              SB
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  C&amp;F Agent — Admin CRM &amp; Live Rates
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Govt C&F #1048/BD
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Air & Sea D2D, Supplier Payment (RMB/USD), Hand Carry & Consultancy
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="p-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg flex items-center"
                title="Lock Session"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" />
                <span className="hidden sm:inline">Lock</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!isAuthenticated ? (
          /* Authentication Screen */
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Staff Authentication
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your administrative passcode to view customer inquiries and manage rate configurations.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter Passcode (default: admin123)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-center focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                autoFocus
              />
              {passError && (
                <p className="text-xs text-rose-600 font-medium">{passError}</p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                Unlock Management Portal
              </button>
            </form>
            
            <p className="text-[11px] text-slate-400">
              Default demo passcode: <span className="font-mono font-bold text-slate-700">admin123</span>
            </p>
          </div>
        ) : (
          /* Main Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Nav Sub-Tabs & Metrics Bar */}
            <div className="bg-slate-50 border-b border-slate-200 px-5 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 shrink-0">
              
              {/* Tab Selector */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('leads')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center ${
                    activeTab === 'leads'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <ListOrdered className="w-3.5 h-3.5 mr-1.5" />
                  <span>Inquiries & Leads</span>
                  <span className="ml-2 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                    {totalLeads}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('rates')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center ${
                    activeTab === 'rates'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5 mr-1.5" />
                  <span>Rate Settings & Exchange Rates</span>
                </button>
              </div>

              {/* Quick Metrics */}
              <div className="flex items-center space-x-3 text-xs">
                <div className="bg-white px-2.5 py-1 rounded-md border border-slate-200 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
                  <span className="text-slate-500 mr-1">New:</span>
                  <strong className="text-slate-900">{newLeads}</strong>
                </div>

                <div className="bg-white px-2.5 py-1 rounded-md border border-slate-200 flex items-center">
                  <span className="text-slate-500 mr-1">Converted:</span>
                  <strong className="text-emerald-700">{convertedLeads}</strong>
                </div>

                <div className="bg-white px-2.5 py-1 rounded-md border border-slate-200 flex items-center">
                  <span className="text-slate-500 mr-1">Pipeline:</span>
                  <strong className="text-amber-700">৳{totalPipelineCharge.toLocaleString()}</strong>
                </div>
              </div>

            </div>

            {/* TAB 1: LEADS CRM TABLE */}
            {activeTab === 'leads' && (
              <div className="flex-1 flex flex-col overflow-hidden p-4 sm:p-6 space-y-4">
                
                {/* Search, Filter & CSV Export Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 shrink-0">
                  <div className="flex flex-wrap items-center gap-2 flex-1 max-w-2xl">
                    {/* Search Input */}
                    <div className="relative flex-1 min-w-[180px]">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Lead ID, Product, Customer..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Filter by Service */}
                    <select
                      value={serviceFilter}
                      onChange={(e) => setServiceFilter(e.target.value)}
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 font-medium focus:outline-none focus:border-amber-500"
                    >
                      {ALL_SERVICES.map((s) => (
                        <option key={s} value={s}>Service: {s}</option>
                      ))}
                    </select>

                    {/* Filter by Status */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 font-medium focus:outline-none focus:border-amber-500"
                    >
                      <option value="All">Status: All</option>
                      {ALL_STATUSES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  {/* Export CSV Button */}
                  <button
                    onClick={() => exportLeadsToCSV(filteredLeads)}
                    disabled={filteredLeads.length === 0}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center transition-colors disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                    <span>Export CSV</span>
                  </button>
                </div>

                {/* Leads List */}
                {filteredLeads.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 border-2 border-dashed border-slate-200 rounded-xl">
                    <AlertCircle className="w-8 h-8 mb-2" />
                    <p className="text-sm font-semibold">No inquiries match your filter criteria.</p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {filteredLeads.map((lead) => {
                      const isExpanded = expandedLeadId === lead.id;
                      return (
                        <div
                          key={lead.id}
                          className="bg-white rounded-xl border border-slate-200 shadow-sm hover:border-amber-400/80 transition-all overflow-hidden"
                        >
                          {/* Card Header Row */}
                          <div
                            onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
                            className="p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                                {lead.id}
                              </span>
                              {getServiceBadge(lead.serviceType)}
                              <div>
                                <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                                  {lead.productName}
                                </h4>
                                <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                                  <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                                  <span>•</span>
                                  <span>Ref: {lead.estimateRefId}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              {/* Financial / Estimate info */}
                              <div className="text-right">
                                {lead.serviceType === 'Supplier Payment Support' ? (
                                  <div>
                                    <span className="text-xs font-extrabold text-amber-900 block">
                                      ৳{lead.estimatedCargoCharge.toLocaleString()}
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-mono">
                                      {lead.currency === 'RMB' ? '¥' : '$'}{lead.foreignAmount?.toLocaleString()} @ ৳{lead.exchangeRate}
                                    </span>
                                  </div>
                                ) : lead.serviceType === 'Sea D2D Cargo' ? (
                                  <div>
                                    <span className="text-xs font-extrabold text-blue-900 block">
                                      ৳{lead.estimatedCargoCharge.toLocaleString()}
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-mono">
                                      {lead.cbm} CBM • {lead.approximateWeight} KG
                                    </span>
                                  </div>
                                ) : lead.serviceType === 'Import Consultancy' ? (
                                  <div>
                                    <span className="text-xs font-extrabold text-emerald-800 block">
                                      Tariff Inquiry
                                    </span>
                                    <span className="text-[10px] text-slate-500">
                                      {lead.consultancyTopics?.length || 1} Topics
                                    </span>
                                  </div>
                                ) : (
                                  <div>
                                    <span className="text-xs font-extrabold text-slate-900 block">
                                      ৳{lead.estimatedCargoCharge.toLocaleString()}
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-mono">
                                      {lead.approximateWeight} KG
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Status Badge */}
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                lead.status === 'New' ? 'bg-rose-100 text-rose-700' :
                                lead.status === 'Converted' ? 'bg-emerald-100 text-emerald-700' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {lead.status}
                              </span>

                              <button className="text-slate-400 hover:text-slate-600">
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          {/* Expanded Details Pane */}
                          {isExpanded && (
                            <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50 text-xs space-y-3">
                              
                              {/* Customer Information Grid */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-lg border border-slate-200">
                                <div>
                                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Customer</span>
                                  <span className="font-bold text-slate-900">{lead.name || 'Anonymous Estimator'}</span>
                                  {lead.companyName && <p className="text-slate-600 text-[11px]">{lead.companyName}</p>}
                                </div>

                                <div>
                                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Mobile / WhatsApp</span>
                                  {lead.mobile ? (
                                    <a
                                      href={`https://wa.me/${lead.mobile.replace(/[^0-9]/g, '')}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-mono text-emerald-600 hover:underline font-bold"
                                    >
                                      {lead.mobile}
                                    </a>
                                  ) : (
                                    <span className="text-slate-400">Not provided</span>
                                  )}
                                </div>

                                <div>
                                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Service Specifics</span>
                                  {lead.consultancyTopics && lead.consultancyTopics.length > 0 ? (
                                    <p className="text-slate-700 font-medium">{lead.consultancyTopics.join(', ')}</p>
                                  ) : lead.quantity ? (
                                    <p className="text-slate-700">Qty: {lead.quantity} | CBM: {lead.cbm}</p>
                                  ) : lead.additionalDetails ? (
                                    <p className="text-slate-700">{lead.additionalDetails}</p>
                                  ) : (
                                    <p className="text-slate-500">Standard consignment</p>
                                  )}
                                </div>
                              </div>

                              {/* Action controls: Status, Assigned Staff, Notes */}
                              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                                
                                {/* Status select */}
                                <div className="sm:col-span-3">
                                  <label className="block text-slate-500 font-semibold mb-1">Status:</label>
                                  <select
                                    value={lead.status}
                                    onChange={(e) => onUpdateLead(lead.id, { status: e.target.value as LeadStatus })}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800"
                                  >
                                    {ALL_STATUSES.map((st) => (
                                      <option key={st} value={st}>{st}</option>
                                    ))}
                                  </select>
                                </div>

                                {/* Assigned staff */}
                                <div className="sm:col-span-4">
                                  <label className="block text-slate-500 font-semibold mb-1">Assigned Staff:</label>
                                  <select
                                    value={lead.assignedStaff || 'Unassigned'}
                                    onChange={(e) => onUpdateLead(lead.id, { assignedStaff: e.target.value })}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800"
                                  >
                                    {STAFF_MEMBERS.map((stf) => (
                                      <option key={stf} value={stf}>{stf}</option>
                                    ))}
                                  </select>
                                </div>

                                {/* Follow up */}
                                <div className="sm:col-span-5">
                                  <label className="block text-slate-500 font-semibold mb-1">Next Follow-up:</label>
                                  <input
                                    type="date"
                                    value={lead.followUpDate || ''}
                                    onChange={(e) => onUpdateLead(lead.id, { followUpDate: e.target.value })}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800"
                                  />
                                </div>

                                {/* Notes */}
                                <div className="sm:col-span-12">
                                  <label className="block text-slate-500 font-semibold mb-1">Internal CRM Notes:</label>
                                  <input
                                    type="text"
                                    defaultValue={lead.adminNotes || ''}
                                    onBlur={(e) => onUpdateLead(lead.id, { adminNotes: e.target.value })}
                                    placeholder="Add quotation status, AWB number, payment proof verification..."
                                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800"
                                  />
                                </div>
                              </div>

                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: RATE SETTINGS (AIR, RMB/USD EXCHANGE RATES, SEA CBM, HAND CARRY) */}
            {activeTab === 'rates' && (
              <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto space-y-6">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-lg font-bold text-slate-900">
                    Live Rate Master & Exchange Rate Settings
                  </h3>
                  <p className="text-xs text-slate-500">
                    Set the rates here. These instantly update the customer-facing calculators for Air D2D, Supplier Payment (RMB/USD), Sea D2D, and Hand Carry.
                  </p>
                </div>

                {ratesSavedAlert && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
                    <span>Rate Settings successfully updated! Live calculators are now updated.</span>
                  </div>
                )}

                <form onSubmit={handleSaveRates} className="space-y-4 text-xs">
                  
                  {/* Supplier Payment Exchange Rates */}
                  <div className="bg-amber-50/60 border border-amber-300 rounded-xl p-4 space-y-3">
                    <div className="flex items-center space-x-2 border-b border-amber-200 pb-2">
                      <CreditCard className="w-4 h-4 text-amber-600" />
                      <span className="font-bold text-slate-900 text-sm">
                        Supplier Payment Exchange Rates (RMB / USD)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-slate-800 block mb-1">
                          Chinese Yuan (RMB) Rate (৳ BDT / RMB)
                        </label>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-slate-600">৳</span>
                          <input
                            type="number"
                            step="0.05"
                            min="1"
                            required
                            value={editRmbRate}
                            onChange={(e) => setEditRmbRate(Number(e.target.value))}
                            className="w-36 px-3 py-2 rounded-lg border border-slate-300 font-black text-sm bg-white text-slate-900"
                          />
                          <span className="text-slate-500">per 1 RMB</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">Default: ৳17.50</p>
                      </div>

                      <div>
                        <label className="font-bold text-slate-800 block mb-1">
                          US Dollar (USD) Rate (৳ BDT / USD)
                        </label>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-slate-600">৳</span>
                          <input
                            type="number"
                            step="0.10"
                            min="1"
                            required
                            value={editUsdRate}
                            onChange={(e) => setEditUsdRate(Number(e.target.value))}
                            className="w-36 px-3 py-2 rounded-lg border border-slate-300 font-black text-sm bg-white text-slate-900"
                          />
                          <span className="text-slate-500">per 1 USD</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">Default: ৳124.00</p>
                      </div>
                    </div>
                  </div>

                  {/* Air D2D Rates */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                      <Plane className="w-4 h-4 text-sky-600" />
                      <span className="font-bold text-slate-900 text-sm">Air D2D Cargo Rates (BDT / KG)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-slate-800 block mb-1">
                          China Air D2D Rate
                        </label>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-slate-600">৳</span>
                          <input
                            type="number"
                            min="10"
                            required
                            value={editChinaRate}
                            onChange={(e) => setEditChinaRate(Number(e.target.value))}
                            className="w-36 px-3 py-2 rounded-lg border border-slate-300 font-black text-sm bg-white text-slate-900"
                          />
                          <span className="text-slate-500">/ KG</span>
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-slate-800 block mb-1">
                          Hong Kong Air D2D Rate
                        </label>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-slate-600">৳</span>
                          <input
                            type="number"
                            min="10"
                            required
                            value={editHkRate}
                            onChange={(e) => setEditHkRate(Number(e.target.value))}
                            className="w-36 px-3 py-2 rounded-lg border border-slate-300 font-black text-sm bg-white text-slate-900"
                          />
                          <span className="text-slate-500">/ KG</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sea D2D CBM Rate & Hand Carry Rates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 space-y-2">
                      <div className="flex items-center space-x-2 border-b border-blue-200 pb-1.5">
                        <Ship className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-slate-900">Sea D2D Cargo Rate</span>
                      </div>
                      <div>
                        <label className="font-bold text-slate-800 block mb-1">Rate per CBM (BDT)</label>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-slate-600">৳</span>
                          <input
                            type="number"
                            min="500"
                            required
                            value={editSeaCbmRate}
                            onChange={(e) => setEditSeaCbmRate(Number(e.target.value))}
                            className="w-36 px-3 py-2 rounded-lg border border-slate-300 font-black text-sm bg-white text-slate-900"
                          />
                          <span className="text-slate-500">/ CBM</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-center space-x-2 border-b border-rose-200 pb-1.5">
                        <Briefcase className="w-4 h-4 text-rose-600" />
                        <span className="font-bold text-slate-900">Hand Carry Express Rates</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-slate-800 block text-xs mb-1">
                            General Hand Carry (৳/KG)
                          </label>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-bold text-slate-600">৳</span>
                            <input
                              type="number"
                              min="100"
                              required
                              value={editHandCarryRate}
                              onChange={(e) => setEditHandCarryRate(Number(e.target.value))}
                              className="w-28 px-2.5 py-1.5 rounded-lg border border-slate-300 font-black text-xs bg-white text-slate-900"
                            />
                            <span className="text-[11px] text-slate-500">/ KG</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">সাধারণ পণ্যের হ্যান্ড ক্যারি</p>
                        </div>

                        <div>
                          <label className="font-bold text-slate-800 block text-xs mb-1 text-rose-800">
                            Sensitive / Battery / Copy (৳/KG)
                          </label>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-bold text-rose-700">৳</span>
                            <input
                              type="number"
                              min="100"
                              required
                              value={editHandCarrySensitiveRate}
                              onChange={(e) => setEditHandCarrySensitiveRate(Number(e.target.value))}
                              className="w-28 px-2.5 py-1.5 rounded-lg border border-rose-300 font-black text-xs bg-white text-rose-950 ring-1 ring-rose-200"
                            />
                            <span className="text-[11px] text-rose-700">/ KG</span>
                          </div>
                          <p className="text-[10px] text-rose-600 mt-0.5 font-medium">ব্যাটারি/লিকুইড/কপি আইটেমের হ্যান্ড ক্যারি রেট</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Compliance & Prohibited Sentinel Status */}
                  <div className="bg-amber-50/80 border border-amber-300/80 rounded-xl p-4 text-xs text-amber-950 space-y-1.5">
                    <div className="flex items-center space-x-2 font-bold text-amber-900">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      <span>AI Product Compliance Sentinel (স্বয়ংক্রিয় নিষিদ্ধ ও সংবেদনশীল পণ্য শনাক্তকারী)</span>
                    </div>
                    <p className="text-[11px] text-amber-900 leading-relaxed">
                      ক্যালকুলেটরে কোনো গ্রাহক অস্ত্র, মাদক, ড্রোন, ভ্যাপ বা নিষিদ্ধ পণ্যের নাম দিলে AI সিস্টেম স্বয়ংক্রিয়ভাবে বুকিং ব্লক রাখবে (SS অনুযায়ী)। অন্যদিকে ব্যাটারি, লিকুইড বা কপি আইটেম হলে হ্যান্ড ক্যারি (বেশি রেটে) অথবা হংকং এয়ার রুটে বুকিং গ্রহণের অপশন দেবে।
                    </p>
                  </div>

                  {/* Official WhatsApp */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
                    <label className="font-bold text-slate-800 block">
                      Official C&amp;F Agent WhatsApp Hotline Number
                    </label>
                    <input
                      type="text"
                      required
                      value={editWhatsapp}
                      onChange={(e) => setEditWhatsapp(e.target.value)}
                      placeholder="+8801842000000"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs bg-white text-slate-900"
                    />
                    <p className="text-[11px] text-slate-400">
                      Include country code (e.g. +8801842000000). All auto-generated WhatsApp inquiries connect to this number.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95"
                    >
                      <Save className="w-4 h-4 mr-1.5" />
                      <span>Save All Live Rates & Settings</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
