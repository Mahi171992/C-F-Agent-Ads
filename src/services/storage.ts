import { RateSettings, Lead, EstimateResult } from '../types';

const STORAGE_KEYS = {
  RATES: 'sbc_rate_settings_v1',
  LEADS: 'sbc_air_d2d_leads_v1',
};

export const DEFAULT_RATE_SETTINGS: RateSettings = {
  chinaRate: 720,
  hongKongRate: 920,
  rmbRate: 17.50,
  usdRate: 124.00,
  seaCbmRate: 16500,
  handCarryPerKgRate: 1800,
  handCarrySensitiveRate: 2200,
  handCarryBaseFee: 35000,
  otherCountryNote: 'Special route verification required by C&F team',
  whatsappNumber: '+8801713872156',
  email: 'sbcnf.ltd@gmail.com',
  facebookPage: "C&F Agent",
  companyName: "C&F Agent",
  currencySymbol: '৳',
};

export const INITIAL_SAMPLE_LEADS: Lead[] = [
  {
    id: 'SBC-LEAD-2041',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    serviceType: 'Air D2D Cargo',
    shippingFrom: 'China',
    productName: 'LED Ceiling Light Modules',
    productCategory: 'Electronics',
    approximateWeight: 50,
    applicableRate: 320,
    estimatedCargoCharge: 16000,
    additionalDetails: 'Cartons well packed, no lithium battery',
    name: 'Rafiqul Islam',
    mobile: '+8801712345678',
    email: 'rafiqul@dhakalighting.com',
    companyName: 'Dhaka Modern Lighting Co.',
    preferredContactMethod: 'WhatsApp',
    leadSource: 'Landing Page',
    estimateRefId: 'SBC-AIR-849102',
    status: 'New',
    assignedStaff: 'Tanvir Hossain (Operations Desk)',
    adminNotes: 'Customer requested door delivery in Motijheel commercial area.',
    followUpDate: '2026-09-13',
  },
  {
    id: 'SBC-LEAD-2042',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    serviceType: 'Supplier Payment Support',
    productName: '1688 Factory Settlement - RMB TT Transfer',
    currency: 'RMB',
    foreignAmount: 25000,
    exchangeRate: 17.50,
    applicableRate: 17.50,
    estimatedCargoCharge: 437500,
    name: 'Kamrul Hasan',
    mobile: '+8801799887766',
    companyName: 'Hasan Trading Corp',
    preferredContactMethod: 'WhatsApp',
    leadSource: 'Landing Page',
    estimateRefId: 'SBC-PAY-932140',
    status: 'New',
    assignedStaff: 'C&F Operations Desk',
    adminNotes: 'Official proforma quotation pad requested. PI verification pending.',
  },
  {
    id: 'SBC-LEAD-2043',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    serviceType: 'Sea D2D Cargo',
    shippingFrom: 'China',
    productName: 'Ceramic Bathroom Tiles & Sanitary Ware',
    quantity: '18 Pallets / 420 Cartons',
    approximateWeight: 3800,
    cbm: 4.8,
    applicableRate: 16500,
    estimatedCargoCharge: 79200,
    additionalDetails: 'Origin: Ningbo Port. Door delivery to Mirpur, Dhaka',
    name: 'Md. Tareq Aziz',
    mobile: '+8801611334455',
    companyName: 'Bengal Ceramic Centre',
    preferredContactMethod: 'Phone Call',
    leadSource: 'Landing Page',
    estimateRefId: 'SBC-SEA-441920',
    status: 'Contacted',
    assignedStaff: 'Tanvir Hossain (Operations Desk)',
  },
  {
    id: 'SBC-LEAD-2040',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    serviceType: 'Air D2D Cargo',
    shippingFrom: 'Hong Kong',
    productName: 'Textile Fabric Samples',
    productCategory: 'Garments / Textile',
    approximateWeight: 35,
    applicableRate: 360,
    estimatedCargoCharge: 12600,
    additionalDetails: 'Urgent sample for BGMEA factory approval',
    name: 'Nasrin Akhter',
    mobile: '+8801911223344',
    companyName: 'Apex Fashion Sourcing',
    preferredContactMethod: 'Phone Call',
    leadSource: 'Landing Page',
    estimateRefId: 'SBC-AIR-782194',
    status: 'Quotation Prepared',
    assignedStaff: 'Farhana Sultana (Air C&F Specialist)',
    adminNotes: 'Air Waybill draft sent via WhatsApp. Awaiting confirmation.',
    followUpDate: '2026-09-14',
  }
];

export function getRateSettings(): RateSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RATES);
    if (data) {
      const parsed = JSON.parse(data);
      // Migrate old placeholder phone number or missing email
      if (parsed.whatsappNumber === '+8801842000000' || !parsed.whatsappNumber) {
        parsed.whatsappNumber = '+8801713872156';
      }
      if (!parsed.email) {
        parsed.email = 'sbcnf.ltd@gmail.com';
      }
      // Ensure company branding is C&F Agent
      if (!parsed.facebookPage || parsed.facebookPage.includes('CHOWDHURY')) {
        parsed.facebookPage = "C&F Agent";
      }
      if (!parsed.companyName || parsed.companyName.includes('CHOWDHURY')) {
        parsed.companyName = "C&F Agent";
      }
      return { ...DEFAULT_RATE_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load rate settings:', e);
  }
  return DEFAULT_RATE_SETTINGS;
}

export function saveRateSettings(settings: RateSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.RATES, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save rate settings:', e);
  }
}

export function getLeads(): Lead[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LEADS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load leads:', e);
  }
  // Initialize with samples
  try {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(INITIAL_SAMPLE_LEADS));
  } catch (e) {
    // ignore
  }
  return INITIAL_SAMPLE_LEADS;
}

export function saveLead(lead: Lead): void {
  try {
    const existing = getLeads();
    const updated = [lead, ...existing];
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save lead:', e);
  }
}

export function updateLead(id: string, updates: Partial<Lead>): Lead[] {
  try {
    const existing = getLeads();
    const updated = existing.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead));
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to update lead:', e);
    return getLeads();
  }
}

export function generateRefId(prefix = 'SBC-AIR'): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${num}`;
}

export function generateLeadId(): string {
  const num = Math.floor(2050 + Math.random() * 9000);
  return `SBC-LEAD-${num}`;
}

// Generate the exact pre-filled WhatsApp link requested in Section 11 for Air D2D
export function createWhatsAppChatUrl(
  number: string,
  shippingFrom: string,
  productName: string,
  weight: number,
  estimatedAmountFormatted: string
): string {
  const cleanNumber = number.replace(/[^0-9]/g, '');
  const message = `Hello C&F Agent,

I want to know about Air D2D Cargo from ${shippingFrom} to Bangladesh.

Product: ${productName}

Weight: ${weight} KG

Estimated Cargo Charge: ${estimatedAmountFormatted}

Please provide your official quotation.

Thank you.`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

// Generate pre-filled WhatsApp message for Sea D2D Cargo (with Product, Quantity, Weight, CBM)
export function createSeaWhatsAppUrl(
  number: string,
  productName: string,
  quantity: string,
  weight: number | string,
  cbm: number | string,
  origin: string,
  estimatedCharge: string
): string {
  const cleanNumber = number.replace(/[^0-9]/g, '');
  const message = `Hello C&F Agent,

I want an official quotation for Sea D2D Cargo to Bangladesh.

Product Details: ${productName}
Port of Origin: ${origin}
Quantity: ${quantity || 'N/A'}
Total Weight: ${weight} KG
Total Volume: ${cbm} CBM
Estimated Sea Freight: ${estimatedCharge}

Please verify the CBM rate and schedule for the next sailing vessel.

Thank you.`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

// Generate pre-filled WhatsApp message for Supplier Payment Support (with RMB/USD, Rate, Total BDT)
export function createSupplierPaymentWhatsAppUrl(
  number: string,
  currency: 'RMB' | 'USD',
  foreignAmount: number,
  exchangeRate: number,
  totalBdtFormatted: string,
  customerName?: string
): string {
  const cleanNumber = number.replace(/[^0-9]/g, '');
  const message = `Hello C&F Agent,

I want to make a Supplier Payment transfer from Bangladesh.

Currency: ${currency}
Transfer Amount: ${currency === 'RMB' ? '¥' : '$'}${foreignAmount.toLocaleString()}
Agreed Exchange Rate: ৳${exchangeRate} per ${currency}
Approximate Total: ${totalBdtFormatted}
${customerName ? `Applicant / Company: ${customerName}\n` : ''}
Please provide your official company bank details and proforma invoice payment instructions.

Thank you.`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

// Generate pre-filled WhatsApp message for Hand Carry Super Express
export function createHandCarryWhatsAppUrl(
  number: string,
  productName: string,
  weight: number | string,
  origin: string,
  urgency: string,
  estimatedCharge: string
): string {
  const cleanNumber = number.replace(/[^0-9]/g, '');
  const message = `Hello C&F Agent,

I require urgent Hand Carry Cargo (On-board courier) service.

Product: ${productName}
Departure: ${origin} → Dhaka (DAC)
Weight: ${weight} KG
Required Transit: ${urgency}
Estimated Cost: ${estimatedCharge}

Please verify courier flight availability and immediate airport handover.

Thank you.`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

// Generate pre-filled WhatsApp message for Import Consultancy
export function createImportConsultancyWhatsAppUrl(
  number: string,
  productName: string,
  topics: string[],
  additionalNotes: string,
  customerName?: string
): string {
  const cleanNumber = number.replace(/[^0-9]/g, '');
  const message = `Hello C&F Agent,

I need professional Import Customs & Tariff Consultancy.

Product Name: ${productName}
Inquiry Topics:
${topics.map((t) => `• ${t}`).join('\n')}
${additionalNotes ? `Specific Query: ${additionalNotes}\n` : ''}${customerName ? `Client: ${customerName}\n` : ''}
Please let me know the customs clearing guidelines and duty assessment.

Thank you.`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

// Generate pre-filled WhatsApp message for Customs Clearing (Import & Export C&F)
export function createCustomsClearingWhatsAppUrl(
  number: string,
  operation: 'Import' | 'Export',
  portName: string,
  productDetails: string,
  details: {
    invoiceValueUsd?: number | string;
    documentType?: string;
    importMode?: string;
    quantity?: string;
    weight?: string | number;
    cartons?: string | number;
    cbm?: string | number;
    destinationPort?: string;
    receiverDetails?: string;
    customerName?: string;
    customerMobile?: string;
  }
): string {
  const cleanNumber = number.replace(/[^0-9]/g, '');
  let message = `Hello C&F Agent (Licensed Customs Clearing & Forwarding),\n\n`;
  message += `I require official Customs Clearance (C&F) assistance for ${operation.toUpperCase()}.\n\n`;
  message += `Port / Customs House: ${portName}\n`;
  message += `Product Details: ${productDetails}\n`;

  if (operation === 'Import') {
    if (details.invoiceValueUsd) message += `Invoice Value: $${details.invoiceValueUsd} USD\n`;
    if (details.documentType) message += `Payment Mode: ${details.documentType}\n`;
    if (details.importMode) message += `Shipping Mode: ${details.importMode}\n`;
  } else {
    if (details.quantity) message += `Quantity: ${details.quantity}\n`;
    if (details.weight) message += `Gross Weight: ${details.weight} KG\n`;
    if (details.cartons) message += `Cartons: ${details.cartons}\n`;
    if (details.cbm) message += `CBM Volume: ${details.cbm}\n`;
    if (details.destinationPort) message += `Destination Port/Country: ${details.destinationPort}\n`;
    if (details.receiverDetails) message += `Receiver/Consignee: ${details.receiverDetails}\n`;
  }

  if (details.customerName) message += `Contact Name: ${details.customerName}\n`;
  if (details.customerMobile) message += `Mobile/WhatsApp: ${details.customerMobile}\n`;
  message += `\nI will send the required shipping documents (AWB/BL, Invoice, Packing List). Please advise on B/E assessment and your C&F handling quote.\n\nThank you.`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

// Restricted goods detection keywords
export const RESTRICTED_PATTERNS = [
  'battery',
  'batteries',
  'liquid',
  'liquids',
  'magnet',
  'magnets',
  'gas',
  'gaseous',
  'chemical',
  'chemicals',
  'spray',
  'aerosol',
  'flammable',
  'dangerous',
  'explosive',
  'power bank',
  'powerbank',
  'lithium',
  'tarol',
  'acid',
  'perfume',
];

export function checkRestrictedGoods(text: string): { isRestricted: boolean; matched: string[] } {
  const normalized = (text || '').toLowerCase();
  const matched: string[] = [];
  
  for (const pattern of RESTRICTED_PATTERNS) {
    if (normalized.includes(pattern)) {
      matched.push(pattern);
    }
  }

  return {
    isRestricted: matched.length > 0,
    matched,
  };
}

export function exportLeadsToCSV(leads: Lead[]): void {
  if (leads.length === 0) return;

  const headers = [
    'Lead ID',
    'Date',
    'Service',
    'Origin',
    'Product Name',
    'Category',
    'Weight (KG)',
    'Rate (BDT)',
    'Estimated Charge (BDT)',
    'Customer Name',
    'Mobile / WhatsApp',
    'Email',
    'Company',
    'Preferred Contact',
    'Status',
    'Assigned Staff',
    'Estimate Ref ID',
    'Admin Notes',
  ];

  const rows = leads.map((l) => [
    `"${l.id}"`,
    `"${new Date(l.createdAt).toLocaleString()}"`,
    `"${l.serviceType}"`,
    `"${l.shippingFrom}"`,
    `"${(l.productName || '').replace(/"/g, '""')}"`,
    `"${l.productCategory}"`,
    l.approximateWeight,
    l.applicableRate,
    l.estimatedCargoCharge,
    `"${(l.name || '').replace(/"/g, '""')}"`,
    `"${(l.mobile || '').replace(/"/g, '""')}"`,
    `"${(l.email || '').replace(/"/g, '""')}"`,
    `"${(l.companyName || '').replace(/"/g, '""')}"`,
    `"${l.preferredContactMethod || ''}"`,
    `"${l.status}"`,
    `"${(l.assignedStaff || '').replace(/"/g, '""')}"`,
    `"${l.estimateRefId}"`,
    `"${(l.adminNotes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `CF_Agent_Cargo_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
