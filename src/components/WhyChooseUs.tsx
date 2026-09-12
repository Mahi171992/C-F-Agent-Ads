import React from 'react';
import { ShieldCheck, Award, MapPin, Warehouse, Zap, CheckCircle2, Headphones, FileCheck, Lock, Check } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber-500" />,
      title: 'সরকার অনুমোদিত লাইসেন্সপ্রাপ্ত সিএন্ডএফ এজেন্ট',
      subtitle: 'NBR Customs License #1048/BD',
      desc: 'জাতীয় রাজস্ব বোর্ড (NBR), ঢাকা কাস্টমস হাউস (DAC) এবং চট্টগ্রাম কাস্টমস হাউসের নিবন্ধিত প্রতিনিধি। আপনার প্রতিটি চালান শতভাগ আইনি প্রক্রিয়ায় খালাস নিশ্চিত করি।',
    },
    {
      icon: <Lock className="w-6 h-6 text-emerald-500" />,
      title: '১০০% নিরাপদ কাস্টমস ক্লিয়ারেন্স নিশ্চয়তা',
      subtitle: 'Zero Seizure & No Penalty Risk',
      desc: 'কাস্টমসে পণ্য আটক বা অনাকাঙ্ক্ষিত জরিমানা হওয়ার কোনো ঝুঁকি নেই। সঠিক এইচএস কোড নির্ধারণ ও পণ্যের সঠিক ডিক্লেয়ারেশন দিয়ে দ্রুততম রিলিজ।',
    },
    {
      icon: <Warehouse className="w-6 h-6 text-amber-500" />,
      title: 'চায়না ও হংকংয়ে নিজস্ব ওয়্যারহাউজ নেটওয়ার্ক',
      subtitle: 'Guangzhou, Yiwu & Hong Kong Hubs',
      desc: 'চায়না সাপ্লায়ারদের থেকে বিনামূল্যে পণ্য গ্রহণ, কোয়ালিটি চেকিং, বারকোড ট্র্যাকিং ও এক্সপোর্ট গ্রেড সুরক্ষিত প্যাকিং ব্যবস্থা।',
    },
    {
      icon: <Zap className="w-6 h-6 text-sky-500" />,
      title: 'সরাসরি কার্গো ফ্লাইট ও এক্সপ্রেস শিডিউল',
      subtitle: 'Direct Flights: 3-5 Working Days',
      desc: 'সপ্তাহে ৪টি সরাসরি ফ্লাইটে এয়ার কার্গো শিপমেন্ট এবং দ্রুততম কনটেইনার সি-শিপমেন্ট। কোনো ট্রানজিট বিলম্ব বা অপ্রয়োজনীয় হোল্ড ছাড়া সরাসরি বাংলাদেশে পৌঁছানো।',
    },
    {
      icon: <FileCheck className="w-6 h-6 text-purple-500" />,
      title: 'কোনো গোপন খরচ নেই — ১০০% ট্রান্সপারেন্ট',
      subtitle: 'Transparent Commercial Deals',
      desc: 'আমাদের সাথে কাজ করার পর কোনো অপ্রত্যাশিত পোর্ট চার্জ, হ্যান্ডলিং এক্সট্রা বা হিডেন ফি দিতে হয় না। আগে থেকেই পরিষ্কার কাস্টমস চার্জ নির্ধারণ।',
    },
    {
      icon: <MapPin className="w-6 h-6 text-rose-500" />,
      title: 'সমগ্র ৬৪ জেলায় ফ্যাক্টরি ও গোডাউনে ডেলিভারি',
      subtitle: 'Nationwide Doorstep Delivery',
      desc: 'ঢাকা, চট্টগ্রাম, গাজীপুর, নারায়ণগঞ্জ, সিলেট, বগুড়া, খুলনা, রাজশাহী সহ বাংলাদেশের প্রতিটি জেলায় নিজস্ব ডেলিভারি ব্যবস্থাপনায় নিরাপদ হস্তান্তর।',
    },
  ];

  return (
    <section id="why-us" className="py-12 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200 inline-flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-600" />
            কেন বাংলাদেশের শীর্ষ আমদানিকারক ও প্রতিষ্ঠানসমূহ আমাদের ওপর আস্থা রাখেন?
          </span>
          
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 mt-4 tracking-tight leading-tight">
            কাস্টমস ক্লিয়ারেন্স ও লজিস্টিকসে <span className="text-amber-600">নির্ভরযোগ্যতা ও সততাই</span> আমাদের মূল শক্তি
          </h2>
          
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            চায়না বা হংকং থেকে বাণিজ্যিক পণ্য আমদানিতে সবচেয়ে বড় চ্যালেঞ্জ কাস্টমস ক্লিয়ারেন্স ও পণ্যের নিরাপত্তা। লাইসেন্সপ্রাপ্ত সিএন্ডএফ এজেন্ট হিসেবে আমাদের সাথে আপনি পাচ্ছেন শতভাগ আইনি নিশ্চয়তা, দ্রুততম ডেলিভারি এবং গোপন খরচবিহীন নির্ভরযোগ্য সেবা।
          </p>
        </div>

        {/* 6 Key Strengths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {points.map((pt, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-amber-400 hover:bg-amber-50/20 transition-all group shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 group-hover:border-amber-300 flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                  {pt.icon}
                </div>

                <span className="text-[11px] font-bold text-amber-700 block uppercase tracking-wider mb-1">
                  {pt.subtitle}
                </span>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug">
                  {pt.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {pt.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center text-xs font-semibold text-emerald-700">
                <Check className="w-3.5 h-3.5 mr-1" />
                <span>গ্যারান্টিযুক্ত পেশাদার সেবা</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
