import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  FileText, 
  Lock, 
  AlertTriangle, 
  EyeOff, 
  UserCheck, 
  HelpCircle,
  Mail,
  CheckCircle2
} from 'lucide-react';

interface TermsPrivacyPageProps {
  onBack: () => void;
}

export const TermsPrivacyPage: React.FC<TermsPrivacyPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-4 border border-pink-200/80/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 transition-colors"
            title="ফিরে যান"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>শর্তাবলী ও গোপনীয়তা নীতি</span>
            </h2>
            <p className="text-xs text-slate-500">আমার কুষ্টিয়া ব্যবহারের আইনি শর্ত ও তথ্য সুরক্ষা নীতিমালা</p>
          </div>
        </div>

        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
          আপডেট: ২০২৬
        </span>
      </div>

      {/* Tabs Switcher */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-white rounded-2xl border border-pink-200/80/80 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('terms')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'terms'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>ব্যবহারের শর্তাবলী (Terms)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('privacy')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'privacy'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>গোপনীয়তা সুরক্ষা (Privacy)</span>
        </button>
      </div>

      {activeTab === 'terms' ? (
        /* Terms Content */
        <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-900">
            <h4 className="font-bold mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>ভূমিকা ও প্ল্যাটফর্মের উদ্দেশ্য</span>
            </h4>
            "আমার কুষ্টিয়া" কুষ্টিয়া জেলার নাগরিক ও অধিবাসীদের জন্য একটি উন্মুক্ত ও জনকল্যাণমূলক ডিজিটাল প্ল্যাটফর্ম। এটি ব্যবহারের মাধ্যমে আপনি নিচের শর্তাবলি মেনে নিতে সম্মত হচ্ছেন।
          </div>

          <section className="space-y-1.5">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>১. সঠিক তথ্য প্রদানের নিশ্চয়তা</span>
            </h4>
            <p>
              বাসা ভাড়া, মেস, জিনিসপত্র কেনাবেচা, ডাক্তার বা মিস্ত্রি সার্ভিসের বিজ্ঞাপন দেওয়ার সময় ব্যবহারকারীকে সর্বদা সত্য, নির্ভুল ও হালনাগাদ তথ্য প্রদান করতে হবে। কোনো ভুয়া নাম, মিথ্যা মূল্য বা বিভ্রান্তিকর ছবি ব্যবহার করা সম্পূর্ণ নিষিদ্ধ।
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>২. আর্থিক লেনদেন ও নিরাপত্তা সতর্কতা</span>
            </h4>
            <p>
              "আমার কুষ্টিয়া" সরাসরি কোনো আর্থিক লেনদেন বা মধ্যস্থতা করে না। বাসা ভাড়া চুক্তি, অগ্রিম ভাড়া প্রদান কিংবা পুরোনো জিনিস কেনাবেচার পূর্বে সরাসরি মুখোমুখি দেখে যাচাই করুন। কোনো অবস্থাতেই পণ্য বা বাসা স্বচক্ষে দেখার পূর্বে অপরিচিত ব্যক্তির বিকাশ/নগদে অগ্রিম টাকা পাঠাবেন না।
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="text-sm font-bold text-slate-900">
              <span>৩. নিষিদ্ধ কার্যকলাপ ও সাইবার নীতিমালা</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>অশ্লীল, আপত্তিকর বা সমাজে বিশৃঙ্খলা সৃষ্টিকারী কোনো কনটেন্ট পোস্ট করা যাবে না।</li>
              <li>রাজনৈতিক উস্কানিমূলক বা ধর্মীয় অনুভূতিতে আঘাত হানে এমন প্রচারণা নিষিদ্ধ।</li>
              <li>অননুমোদিত কোনো ব্যক্তি বা প্রতিষ্ঠানের পরিচয় নকল করা দণ্ডনীয় অপরাধ।</li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h4 className="text-sm font-bold text-slate-900">
              <span>৪. এডমিন ও মডারেশনের অধিকার</span>
            </h4>
            <p>
              অ্যাপটির নিরাপত্তা ও সুস্থ পরিবেশ বজায় রাখতে এডমিন টিম যেকোনো বিজ্ঞাপন বা পোস্ট যাচাই-বাছাই, সংশোধন অথবা নিয়ম লঙ্ঘনের দায়ে অপসারণ করার পূর্ণ অধিকার সংরক্ষণ করে।
            </p>
          </section>
        </div>
      ) : (
        /* Privacy Policy Content */
        <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-900">
            <h4 className="font-bold mb-1 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>আপনার ব্যক্তিগত তথ্যের গোপনীয়তা রক্ষা</span>
            </h4>
            আমরা আপনার তথ্যের গোপনীয়তাকে সর্বোচ্চ অগ্রাধিকার প্রদান করি। আমরা কখনোই আপনার অনুমতি ছাড়া তৃতীয় কোনো পক্ষের কাছে আপনার ব্যক্তিগত তথ্য বিক্রি বা হস্তান্তর করি না।
          </div>

          <section className="space-y-1.5">
            <h4 className="text-sm font-bold text-slate-900">
              <span>১. কি ধরনের তথ্য সংগ্রহ করা হয়?</span>
            </h4>
            <p>
              - আপনি যখন গুগল বা ফেসবুকে লগইন করেন, তখন আপনার নাম, ইমেইল ও প্রোফাইল ছবি Firebase Authentication দ্বারা নিরাপদে সংরক্ষিত থাকে।<br />
              - আপনি যখন পোস্ট করেন, কেবল তখনই আপনি যে মোবাইল নম্বর বা ঠিকানা প্রকাশ্যে দেন তা অন্য নাগরিকদের যোগাযোগের সুবিধার্থে প্রদর্শিত হয়।
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <EyeOff className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>২. পরিচয় গোপন মোড (Anonymous Reporting) এর গোপনীয়তা</span>
            </h4>
            <p>
              "পরিচয় গোপন মোড" ব্যবহারের সময় ব্যবহারকারীর নাম, ইমেইল বা পরিচয় সম্পর্কিত কোনো ডেটা সংগ্রহ বা প্রকাশ করা হয় না। পোস্টগুলো সম্পূর্ণরূপে 'নাম প্রকাশে অনিচ্ছুক নাগরিক' হিসেবে প্রকাশ পায়।
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="text-sm font-bold text-slate-900">
              <span>৩. লোকাল ডেটা ও বুকমার্ক স্টোরেজ</span>
            </h4>
            <p>
              আপনার সংরক্ষিত বা বুকমার্ক করা পোস্টসমূহ এবং নোটিফিকেশন ফিল্টার সরাসরি আপনার ব্রাউজার বা ডিভাইসে (Local Storage) নিরাপদে সংরক্ষিত থাকে।
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="text-sm font-bold text-slate-900">
              <span>৪. যোগাযোগ ও তথ্য সংশোধনের অনুরোধ</span>
            </h4>
            <p>
              আপনার অ্যাকাউন্ট সম্পর্কিত যেকোনো তথ্য বা পোস্ট অপসারণ করতে চাইলে সরাসরি এডমিন ইমেইলে যোগাযোগ করতে পারেন: <strong className="text-emerald-800 font-bold">support@kushtiaconnect.com</strong>
            </p>
          </section>
        </div>
      )}

      {/* Admin Signature */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs flex items-center justify-between">
        <div>
          <span className="font-bold text-emerald-400 block">আমার কুষ্টিয়া এডমিন ও সিস্টেম টিম</span>
        </div>
        <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-800">
          সুরক্ষিত ও ভেরিফাইড
        </span>
      </div>
    </div>
  );
};
