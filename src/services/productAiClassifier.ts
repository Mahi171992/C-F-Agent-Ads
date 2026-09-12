// Intelligent AI Product Compliance Classifier for Bangladesh Customs & Airlines Regulations
// Identifies:
// 1. Prohibited (সম্পূর্ণ নিষিদ্ধ পণ্য) -> Blocked from booking as per screenshot/law (SS অনুযায়ী স্টপ)
// 2. Restricted / Sensitive (সংবেদনশীল পণ্য) -> Air Cargo (Hong Kong) or Hand Carry Super Express (রেট বেশি)
// 3. Allowed General (সাধারণ পণ্য) -> Standard China / Hong Kong Air D2D or Hand Carry

export type ProductComplianceType = 'prohibited' | 'restricted' | 'allowed';

export interface ProductComplianceResult {
  status: ProductComplianceType;
  productName: string;
  matchedKeywords: string[];
  titleBengali: string;
  titleEnglish: string;
  descriptionBengali: string;
  descriptionEnglish: string;
  isBlocked: boolean;
  canHandCarry: boolean;
  canAirCargo: boolean;
  handCarryNote?: string;
  recommendedRoute: 'china_air' | 'hk_air' | 'hand_carry' | 'blocked';
  legalNotice?: string;
}

// Banned / Prohibited items under Bangladesh Customs Act, IATA Cargo Rules & SRO
const PROHIBITED_KEYWORDS = [
  // Weapons & Ammunition
  'weapon', 'weapons', 'gun', 'guns', 'pistol', 'pistols', 'firearm', 'firearms', 'revolver',
  'bullet', 'bullets', 'ammunition', 'ammo', 'cartridge', 'rifle', 'shotgun', 'airgun',
  'sword', 'swords', 'dagger', 'hunting knife', 'combat knife', 'bayonet', 'stun gun', 'taser',
  'pepper spray', 'tear gas', 'অস্ত্র', 'বন্দুক', 'পিস্তল', 'গুলি', 'ছোরা', 'তলোয়ার',
  
  // Explosives & Fireworks
  'explosive', 'explosives', 'bomb', 'dynamite', 'gunpowder', 'firework', 'fireworks', 
  'firecracker', 'firecrackers', 'detonator', 'flares', 'আতশবাজি', 'পটকা', 'বিস্ফোরক',

  // Drugs & Narcotics
  'drug', 'drugs', 'narcotic', 'narcotics', 'yaba', 'ya ba', 'weed', 'marijuana', 'cannabis', 
  'ganja', 'hemp', 'opium', 'cocaine', 'heroin', 'morphine', 'meth', 'ice meth', 'crystal meth', 
  'phensedyl', 'codeine', 'ecstasy', 'lsd', 'shabu', 'মাদক', 'ইয়াবা', 'গাঁজা', 'ফেন্সিডিল',
  
  // Alcohol & Liquor
  'alcohol', 'liquor', 'wine', 'beer', 'vodka', 'whisky', 'whiskey', 'rum', 'gin', 'tequila', 
  'spirits', 'মদ', 'অ্যালকোহল',

  // Vapes & E-Cigarettes (Banned in Bangladesh by Health Ministry & NBR SRO)
  'vape', 'vapes', 'vaping', 'e-cigarette', 'e cigarette', 'electronic cigarette', 'e-liquid', 
  'eliquid', 'vape juice', 'vape pod', 'juul', 'iqos', 'ভ্যাপ', 'ই-সিগারেট',

  // Drones & Unmanned Aerial Vehicles (Strictly Prohibited without CAAB & Defense clearance)
  'drone', 'drones', 'quadcopter', 'quad copter', 'uav', 'aerial drone', 'camera drone', 
  'spy drone', 'rc airplane', 'ড্রোন',

  // Walkie-Talkies & Wireless Transceivers (Banned without BTRC NOC & License)
  'walkie talkie', 'walkietalkie', 'two way radio', 'wireless transmitter', 'rf transmitter', 
  'radio transmitter', 'jammer', 'signal jammer', 'gps jammer', 'wireless transceiver', 'ওয়াকিটকি',

  // Spy & Concealed Surveillance Cameras
  'spy camera', 'hidden camera', 'pinhole camera', 'spy pen', 'spy glasses', 'audio bug', 
  'surveillance bug', 'স্পাই ক্যামেরা',

  // Counterfeit Currency & Smuggled Bullion
  'counterfeit currency', 'fake money', 'fake currency', 'counterfeit note', 'fake note', 
  'gold bar', 'gold bullion', 'raw gold', 'silver bullion', 'নকল টাকা', 'স্বর্ণ বার',

  // Adult Items & Pornography
  'pornography', 'porn', 'adult toy', 'sex doll', 'adult doll', 'sex toy',

  // Endangered Wildlife
  'ivory', 'tiger skin', 'deer horn', 'animal skin', 'turtle shell', 'হাতির দাঁত',
];

// Sensitive / Restricted Items: Allowed via Hong Kong Air or Hand Carry Super Express (with higher rate)
const RESTRICTED_KEYWORDS = [
  // Batteries & Energy storage
  'battery', 'batteries', 'powerbank', 'power bank', 'lithium', 'lithium-ion', 'li-ion', 
  'lipo', 'dry cell', 'solar battery', 'accumulator', 'ব্যাটারি', 'পাওয়ার ব্যাংক',

  // Liquids, Lotions, Sprays & Cosmetics
  'liquid', 'liquids', 'serum', 'lotion', 'shampoo', 'toner', 'body wash', 'cleanser',
  'cream', 'cosmetic', 'cosmetics', 'lipstick', 'foundation', 'perfume', 'perfumes', 
  'fragrance', 'attar', 'bodyspray', 'body spray', 'deodorant', 'aerosol', 'oil', 'essential oil',
  'লিকুইড', 'পারফিউম', 'সুগন্ধি', 'কসমেটিকস',

  // Magnets & Magnetic Acoustic items
  'magnet', 'magnets', 'magnetic', 'neodymium', 'speaker', 'subwoofer', 'loudspeaker', 
  'earphone', 'headphone', 'airpod', 'motor', 'electric motor', 'ম্যাগনেট', 'স্পিকার',

  // Gas & Pressurized containers
  'gas', 'gaseous', 'butane', 'lighter', 'propane', 'co2 cartridge', 'গ্যাস',

  // Chemicals & Powders
  'chemical', 'chemicals', 'powder', 'resin', 'ink', 'printer ink', 'paint', 'pigment', 
  'toner powder', 'dye', 'reagent', 'এসিড', 'কেমিক্যাল', 'পাউডার',

  // Brand Replica & Copy Items
  'brand copy', 'copy', 'replica', 'master copy', 'first copy', '1st copy', 'fake brand', 
  'nike copy', 'adidas copy', 'rolex copy', 'gucci copy', 'lv copy', 'কপি', 'রেপ্লিকা',

  // High Value Gadgets & Jewelry (Eligible for Hand Carry Super Express)
  'iphone', 'ipad', 'macbook', 'laptop', 'gpu', 'graphics card', 'dslr camera', 'camera lens',
  'gold jewelry', 'diamond ring', 'luxury watch', 'smartwatch'
];

/**
 * AI-powered compliance classifier for product name
 */
export function classifyProductCompliance(
  productName: string,
  category?: string
): ProductComplianceResult {
  const normalized = `${productName || ''} ${category || ''}`.toLowerCase().trim();

  if (!normalized) {
    return {
      status: 'allowed',
      productName: '',
      matchedKeywords: [],
      titleBengali: 'সাধারণ বাণিজ্যিক পণ্য',
      titleEnglish: 'General Commercial Goods',
      descriptionBengali: 'পণ্যের নাম লিখলে এআই সিস্টেম স্বয়ংক্রিয়ভাবে কাস্টমস অনুমতি ও সঠিক রুট নির্ধারণ করবে।',
      descriptionEnglish: 'Enter product name to evaluate customs route and eligibility.',
      isBlocked: false,
      canHandCarry: true,
      canAirCargo: true,
      recommendedRoute: 'china_air'
    };
  }

  // 1. Check for strictly Prohibited (নিষিদ্ধ) Goods first
  const matchedProhibited: string[] = [];
  for (const kw of PROHIBITED_KEYWORDS) {
    if (normalized.includes(kw.toLowerCase())) {
      matchedProhibited.push(kw);
    }
  }

  if (matchedProhibited.length > 0) {
    return {
      status: 'prohibited',
      productName,
      matchedKeywords: matchedProhibited,
      titleBengali: '⛔ নিষিদ্ধ পণ্য সতর্কতা (Prohibited Goods)',
      titleEnglish: 'Strictly Prohibited Cargo Alert',
      descriptionBengali: `সতর্কতা: "${productName}" পণ্যটি বাংলাদেশ কাস্টমস আইন ও আন্তর্জাতিক বিমান নিরাপত্তা (IATA) বিধি অনুযায়ী সম্পূর্ণ নিষিদ্ধ। কোনো অবস্থাতেই এই পণ্যের এয়ার কার্গো বা হ্যান্ড ক্যারি বুকিং গ্রহণ করা সম্ভব নয়।`,
      descriptionEnglish: `Warning: "${productName}" is strictly prohibited under Bangladesh Customs regulations and IATA flight safety laws. Booking is blocked.`,
      isBlocked: true,
      canHandCarry: false,
      canAirCargo: false,
      recommendedRoute: 'blocked',
      legalNotice: 'Bangladesh Customs Act Section 15 & Civil Aviation Banned Cargo Regulations.',
      handCarryNote: 'নিষিদ্ধ পণ্য কোনোভাবেই হ্যান্ড ক্যারি বা কুরিয়ারে পরিবহনযোগ্য নয়।'
    };
  }

  // 2. Check for Restricted / Sensitive Goods (Hand Carry or Hong Kong possible with higher rate)
  const matchedRestricted: string[] = [];
  for (const kw of RESTRICTED_KEYWORDS) {
    if (normalized.includes(kw.toLowerCase())) {
      matchedRestricted.push(kw);
    }
  }

  if (matchedRestricted.length > 0) {
    return {
      status: 'restricted',
      productName,
      matchedKeywords: matchedRestricted,
      titleBengali: '⚡ সংবেদনশীল আইটেম — Hand Carry বা HK রুটে সম্ভব (রেট বেশি)',
      titleEnglish: 'Sensitive Cargo — Available via Hand Carry or HK Route',
      descriptionBengali: `পণ্যটিতে ব্যাটারি/লিকুইড/ম্যাগনেট বা সংবেদনশীল বৈশিষ্ট্য রয়েছে। সরাসরি চায়না সাধারণ ফ্লাইটে এটি নেওয়া যাবে না; তবে আমাদের হংকং এয়ার কার্গো রুট অথবা দ্রুততম হ্যান্ড ক্যারি (Hand Carry Super Express - ২৪-৪৮ ঘণ্টা) মাধ্যমে নিরাপদে আনা সম্ভব।`,
      descriptionEnglish: `Contains battery/liquid/magnet/copy attributes. Permitted via Hong Kong Air D2D or Hand Carry Super Express (Higher Rate applies).`,
      isBlocked: false,
      canHandCarry: true,
      canAirCargo: true,
      recommendedRoute: 'hand_carry',
      handCarryNote: 'এই অপশন হলেও Hand Carry করা যাবে, তবে সাধারণ পণ্যের চেয়ে রেট বেশি।'
    };
  }

  // 3. Allowed General Commercial Goods
  return {
    status: 'allowed',
    productName,
    matchedKeywords: [],
    titleBengali: '✅ অনুমোদিত সাধারণ পণ্য (General Cargo)',
    titleEnglish: 'Permitted Commercial Cargo',
    descriptionBengali: 'স্ট্যান্ডার্ড বাণিজ্যিক পণ্য। মূল ভূখণ্ড চায়না এয়ার কার্গো, হংকং রুট অথবা হ্যান্ড ক্যারি যে কোনো মাধ্যমে সরাসরি শিপমেন্ট সম্ভব।',
    descriptionEnglish: 'Standard commercial goods eligible for normal Air D2D Cargo and Hand Carry.',
    isBlocked: false,
    canHandCarry: true,
    canAirCargo: true,
    recommendedRoute: 'china_air',
    handCarryNote: 'জরুরি ডেলিভারির ক্ষেত্রে হ্যান্ড ক্যারি করা যাবে।'
  };
}
