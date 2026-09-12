export type ShippingOrigin = 'China' | 'Hong Kong' | 'Other Country';

export type ServiceType = 
  | 'Air D2D Cargo' 
  | 'Sea D2D Cargo' 
  | 'Supplier Payment Support' 
  | 'Import Consultancy' 
  | 'Hand Carry Cargo'
  | 'Customs Clearing';

export type ProductCategory = 
  | 'General Goods'
  | 'Electronics'
  | 'Garments / Textile'
  | 'Machinery / Spare Parts'
  | 'Other';

export type LeadStatus = 
  | 'New'
  | 'Contacted'
  | 'Quotation Prepared'
  | 'Follow-up Required'
  | 'Converted'
  | 'Not Interested'
  | 'Closed';

export type ContactMethod = 'WhatsApp' | 'Phone Call' | 'Email';

export interface RateSettings {
  chinaRate: number; // default 720
  hongKongRate: number; // default 920
  rmbRate: number; // default 17.50 BDT
  usdRate: number; // default 124.00 BDT
  seaCbmRate: number; // default 16500 BDT / CBM
  handCarryPerKgRate: number; // default 1800 BDT / KG
  handCarrySensitiveRate?: number; // default 2200 BDT / KG for Battery, Liquid, Magnet, Brand Copy, High-Value
  handCarryBaseFee: number; // default 35000 BDT
  otherCountryNote: string;
  whatsappNumber: string; // e.g. "+8801713872156"
  email: string; // "sbcnf.ltd@gmail.com"
  facebookPage: string; // "C&F Agent"
  companyName: string; // "C&F Agent"
  currencySymbol: string; // ৳
}

export interface EstimateResult {
  refId: string;
  date: string;
  serviceType: ServiceType;
  shippingFrom?: ShippingOrigin;
  productName: string;
  productCategory?: ProductCategory;
  weight?: number;
  cbm?: number;
  quantity?: string;
  foreignAmount?: number;
  currency?: 'RMB' | 'USD';
  applicableRate: number;
  estimatedCargoCharge: number;
  additionalDetails?: string;
  productPhoto?: string;
  hasRestrictedKeywords?: boolean;
  restrictedKeywordsFound?: string[];
  consultancyTopics?: string[];
}

export interface Lead {
  id: string; // e.g. SBC-LEAD-1001
  createdAt: string;
  serviceType: ServiceType;
  shippingFrom?: ShippingOrigin;
  productName: string;
  productCategory?: ProductCategory;
  approximateWeight?: number;
  cbm?: number;
  quantity?: string;
  currency?: 'RMB' | 'USD';
  foreignAmount?: number;
  exchangeRate?: number;
  applicableRate: number;
  estimatedCargoCharge: number;
  additionalDetails?: string;
  productPhotoReference?: string;
  consultancyTopics?: string[];
  urgency?: string;
  portName?: string;
  customsOperation?: 'Import' | 'Export';
  invoiceValueUsd?: number;
  documentType?: string;
  cartonCount?: number;
  destinationPort?: string;
  trxId?: string;
  transitTimeOption?: string;
  name?: string;
  mobile?: string;
  email?: string;
  companyName?: string;
  preferredContactMethod?: ContactMethod;
  leadSource: 'Landing Page';
  estimateRefId: string;
  status: LeadStatus;
  assignedStaff?: string;
  adminNotes?: string;
  followUpDate?: string;
}
