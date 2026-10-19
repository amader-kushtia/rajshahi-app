import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Phone, 
  Scale, 
  Clock, 
  Plus, 
  ShieldCheck, 
  CheckCircle2, 
  MessageCircle, 
  BookOpen, 
  Building,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { PostItem } from '../types';
import { subscribeToPosts } from '../services/postService';

interface LegalPageProps {
  onBack: () => void;
  onOpenCreatePost?: () => void;
}

const INITIAL_LEGAL_SERVICES: PostItem[] = [
  {
    id: 'legal-1',
    category: 'legal',
    title: 'অ্যাডভোকেট এ. কে. এম. শহিদুল ইসলাম (সিনিয়র আইনজীবী)',
    description: 'নীলফামারী জেলা ও দায়রা জজ আদালত এবং কুষ্টিয়া চেম্বার। জমি-জমা সংক্রান্ত জটিল দেওয়ানি মামলা, খতিয়ান সংশোধন, বণ্টন ও সিভিল আপিলে ২০+ বছরের অভিজ্ঞতা।',
    location: 'চেম্বার: কোর্ট রোড সংলগ্ন, কুষ্টিয়া',
    subcategory: 'দেওয়ানি ও জমি-জমা',
    contactPhone: '01711332211',
    whatsapp: '01711332211',
    authorName: 'অ্যাডভোকেট শহিদুল ইসলাম',
    createdAt: Date.now() - 1000 * 60 * 60 * 8,
    isVerified: true,
    featured: true,
    details: {
      lawyerCourt: 'নীলফামারী জজকোর্ট ও কুষ্টিয়া',
      lawyerSpeciality: 'দেওয়ানি, খতিয়ান ও জমি বিরোধ',
      experienceYears: '২২ বছর',
      chamberTime: 'বিকেল ৫:০০ - রাত ৯:০০ (শনি-বৃহস্পতি)'
    }
  },
  {
    id: 'legal-2',
    category: 'legal',
    title: 'অ্যাডভোকেট বেগম ফারহানা ইয়াসমিন (পারিবারিক আদালত বিশেষজ্ঞ)',
    description: 'পারিবারিক আদালত, দেনমোহর, খোরপোষ, শিশুর অভিভাবকত্ব ও নারী সুরক্ষা সংক্রান্ত আইনি পরামর্শ ও মামলা পরিচালনায় অভিজ্ঞ। নারীদের জন্য সহজ আইনি সহায়তা।',
    location: 'চেম্বার: শেরে বাংলা রোড, কুষ্টিয়া',
    subcategory: 'পারিবারিক ও মোহরানা',
    contactPhone: '01722554433',
    whatsapp: '01722554433',
    authorName: 'অ্যাডভোকেট ফারহানা ইয়াসমিন',
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    isVerified: true,
    details: {
      lawyerCourt: 'নীলফামারী ও কুষ্টিয়া চৌকি আদালত',
      lawyerSpeciality: 'পারিবারিক ও অভিভাবকত্ব আইন',
      experienceYears: '১২ বছর',
      chamberTime: 'বিকেল ৫:৩০ - রাত ৮:৩০'
    }
  },
  {
    id: 'legal-3',
    category: 'legal',
    title: 'অ্যাডভোকেট মো. মাহমুদুল হাসান (ফৌজদারি আইন বিশেষজ্ঞ)',
    description: 'ফৌজদারি মামলা, জামিন আবেদন, পুলিশ তদন্ত ও আপিল ট্রাইব্যুনালে বিচক্ষণ আইনি লড়াই। দ্রুত জামিন শুনানি ও আইনগত অধিকার সংরক্ষণে তৎপর।',
    location: 'চেম্বার: শহীদ ডা. জিকরুল হক রোড, কুষ্টিয়া',
    subcategory: 'ফৌজদারি মামলা',
    contactPhone: '01733667788',
    whatsapp: '01733667788',
    authorName: 'অ্যাডভোকেট মাহমুদুল হাসান',
    createdAt: Date.now() - 1000 * 60 * 60 * 36,
    isVerified: true,
    details: {
      lawyerCourt: 'জেলা ও দায়রা জজ আদালত',
      lawyerSpeciality: 'ফৌজদারি, জামিন ও ট্রাইব্যুনাল',
      experienceYears: '১৫ বছর',
      chamberTime: 'সন্ধ্যা ৬:০০ - রাত ৯:৩০'
    }
  },
  {
    id: 'legal-4',
    category: 'legal',
    title: 'সরকার নিবন্ধিত কুষ্টিয়া সাব-রেজিস্ট্রি দলিল লেখক সমিতি',
    description: 'জমি ক্রয়-বিক্রয় কবলা দলিল, হেবা ঘোষণাপত্র, বন্টননামা, দানপত্র ও বায়নানামা নির্ভুলভাবে প্রস্তুত ও সরকারি ফি দিয়ে দ্রুত রেজিস্ট্রি প্রক্রিয়াকরণ।',
    location: 'সাব-রেজিস্ট্রি অফিস চত্বর, কুষ্টিয়া',
    subcategory: 'দলিল লেখক সমিতি',
    contactPhone: '01744889900',
    whatsapp: '01744889900',
    authorName: 'কুষ্টিয়া দলিল লেখক কল্যাণ সমিতি',
    createdAt: Date.now() - 1000 * 60 * 60 * 60,
    isVerified: true,
    details: {
      lawyerCourt: 'কুষ্টিয়া সাব-রেজিস্ট্রি অফিস',
      lawyerSpeciality: 'ভূমি দলিল লিখন ও রেজিস্ট্রি',
      experienceYears: '২৫ বছর',
      chamberTime: 'সকাল ৯:০০ - বিকেল ৫:০০ (সরকারি কার্যদিবস)'
    }
  }
];

export const LegalPage: React.FC<LegalPageProps> = ({ onBack, onOpenCreatePost }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('সব আইনজীবী');
  const [lawyers, setLawyers] = useState<PostItem[]>(INITIAL_LEGAL_SERVICES);

  const subcategories = [
    'সব আইনজীবী',
    'দেওয়ানি ও জমি-জমা',
    'ফৌজদারি মামলা',
    'পারিবারিক ও মোহরানা',
    'দলিল লেখক সমিতি'
  ];

  // Subscribe to real-time posts from Firestore for legal
  useEffect(() => {
    const unsub = subscribeToPosts((livePosts) => {
      const liveLawyers = livePosts.filter(p => p.category === 'legal');
      if (liveLawyers.length > 0) {
        const combined = [...liveLawyers];
        INITIAL_LEGAL_SERVICES.forEach(init => {
          if (!combined.some(c => c.id === init.id)) {
            combined.push(init);
          }
        });
        setLawyers(combined);
      }
    }, 'legal');

    return () => unsub();
  }, []);

  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = 
      lawyer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lawyer.details?.lawyerSpeciality || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSub = 
      selectedSubcategory === 'সব আইনজীবী' || lawyer.subcategory === selectedSubcategory;

    return matchesSearch && matchesSub;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-4 border border-pink-200/80/80 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1"
              title="পূর্ববর্তী পেজে ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">ফিরে যান</span>
            </button>
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-1.5">
                <Scale className="w-5 h-5 text-slate-800" />
                <span>কুষ্টিয়া আইনি সহায়তা ও আইনজীবী</span>
              </h2>
              <p className="text-xs text-slate-500">জজকোর্ট ও কুষ্টিয়াের অভিজ্ঞ অ্যাডভোকেট, দলিল লেখক ও আইনি পরামর্শ</p>
            </div>
          </div>

          {onOpenCreatePost && (
            <button
              onClick={onOpenCreatePost}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>আইনজীবী তালিকাভুক্তি</span>
            </button>
          )}
        </div>

        {/* Free Legal Aid Notice Banner */}
        <div className="p-3 bg-slate-50 border border-pink-200/80 rounded-xl mb-3 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>সরকারি বিনামূল্যে আইনি সহায়তার জন্য জাতীয় হেল্পলাইন: <b>১৬৪৩০</b> (টোল ফ্রি)</span>
          </div>
          <a
            href="tel:16430"
            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[11px] shrink-0"
          >
            ১৬৪৩০ কল
          </a>
        </div>

        {/* Search */}
        <div className="relative mb-2.5">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="আইনজীবীর নাম, দেওয়ানি, জমি, ফৌজদারি বা চেম্বার খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-pink-200/80 text-xs font-medium focus:outline-none focus:border-slate-800"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
          {subcategories.map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubcategory(sub)}
              className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedSubcategory === sub
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* LAWYERS LIST */}
      <div className="space-y-3">
        {filteredLawyers.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-pink-200/80 text-center">
            <Scale className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">কোনো আইনজীবী বা সেবা পাওয়া যায়নি</p>
            <p className="text-xs text-slate-500 mt-1">অন্য কোনো শব্দ দিয়ে অনুসন্ধান করুন।</p>
          </div>
        ) : (
          filteredLawyers.map(lawyer => (
            <div
              key={lawyer.id}
              className="bg-white rounded-2xl p-4 border border-pink-200/80/90 shadow-xs hover:border-slate-400 transition-all group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                      {lawyer.subcategory}
                    </span>
                    {lawyer.isVerified && (
                      <span className="flex items-center gap-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        যাচাইকৃত আইনজীবী
                      </span>
                    )}
                    {lawyer.details?.experienceYears && (
                      <span className="text-[10px] text-slate-500 font-medium">
                        অভিজ্ঞতা: {lawyer.details.experienceYears}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-slate-800 transition-colors">
                    {lawyer.title}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {lawyer.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl mb-3 border border-pink-100">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{lawyer.location}</span>
                </div>
                {lawyer.details?.chamberTime && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>চেম্বার সময়: {lawyer.details.chamberTime}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-pink-100">
                <span className="text-[11px] text-slate-500">
                  পরামর্শ ও সাক্ষাতের জন্য কল করুন
                </span>

                <div className="flex items-center gap-2">
                  {lawyer.whatsapp && (
                    <a
                      href={`https://wa.me/88${lawyer.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমি আমার কুষ্টিয়া অ্যাপে আপনার আইনি চেম্বারের তথ্য পেয়ে যোগাযোগ করছি।`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors font-bold text-xs flex items-center gap-1"
                      title="হোয়াটসঅ্যাপে মেসেজ পাঠান"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">মেসেজ</span>
                    </a>
                  )}

                  <a
                    href={`tel:${lawyer.contactPhone}`}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>কল: {lawyer.contactPhone}</span>
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
