import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  PhoneCall, 
  ShieldAlert, 
  ShieldCheck, 
  Flame, 
  Hospital, 
  Zap, 
  HeartHandshake, 
  MapPin, 
  Clock, 
  AlertTriangle,
  Building2,
  Shield
} from 'lucide-react';
import { getManagedHelplines, subscribeToHelplines } from '../services/adminFeaturesService';
import { getAppThemeConfig } from '../services/adminService';
import { EmergencyHelpline } from '../types';

interface EmergencyPageProps {
  onBack: () => void;
}

interface EssentialNumber {
  id: string;
  category: 'police' | 'hospital' | 'admin';
  categoryLabel: string;
  title: string;
  phone: string;
  address: string;
  details: string;
}

const KUSHTIA_ESSENTIAL_NUMBERS: EssentialNumber[] = [
  // Police Stations
  {
    id: 'es-p1',
    category: 'police',
    categoryLabel: 'পুলিশ স্টেশন',
    title: 'কুষ্টিয়া সদর মডেল থানা',
    phone: '01320-146000',
    address: 'থানাপাড়া, কুষ্টিয়া সদর',
    details: 'ওসি ও ডিউটি অফিসার ২৪/৭ জরুরি সেবা'
  },
  {
    id: 'es-p2',
    category: 'police',
    categoryLabel: 'পুলিশ স্টেশন',
    title: 'কুমারখালী থানা, কুষ্টিয়া',
    phone: '01320-146300',
    address: 'কুমারখালী বাজার, কুষ্টিয়া',
    details: 'আইন-শৃঙ্খলা ও টহল পুলিশ সহায়তা'
  },
  {
    id: 'es-p3',
    category: 'police',
    categoryLabel: 'পুলিশ স্টেশন',
    title: 'ভেড়ামারা থানা, কুষ্টিয়া',
    phone: '01320-146400',
    address: 'ভেড়ামারা, কুষ্টিয়া',
    details: 'হাইওয়ে ও থানা নিরাপত্তা সেবা'
  },
  {
    id: 'es-p4',
    category: 'police',
    categoryLabel: 'পুলিশ স্টেশন',
    title: 'মিরপুর থানা, কুষ্টিয়া',
    phone: '01320-146500',
    address: 'মিরপুর, কুষ্টিয়া',
    details: 'পোড়াদহ ও মিরপুর সার্কেল নিরাপত্তা'
  },
  {
    id: 'es-p5',
    category: 'police',
    categoryLabel: 'পুলিশ স্টেশন',
    title: 'দৌলতপুর থানা, কুষ্টিয়া',
    phone: '01320-146700',
    address: 'দৌলতপুর, কুষ্টিয়া',
    details: 'সীমান্ত ও উপজেলা পুলিশিং'
  },
  {
    id: 'es-p6',
    category: 'police',
    categoryLabel: 'পুলিশ স্টেশন',
    title: 'খোকসা থানা, কুষ্টিয়া',
    phone: '01320-146600',
    address: 'খোকসা, কুষ্টিয়া',
    details: 'থানা নিয়ন্ত্রণ কক্ষ'
  },

  // Hospitals
  {
    id: 'es-h1',
    category: 'hospital',
    categoryLabel: 'হাসপাতাল',
    title: 'কুষ্টিয়া ২৫০ শয্যা বিশিষ্ট জেনারেল হাসপাতাল',
    phone: '071-62402',
    address: 'হাসপাতাল মোড়, কুষ্টিয়া সদর',
    details: 'জরুরি বিভাগ, আইসিইউ ও ট্রমা সেন্টার (২৪ ঘণ্টা)'
  },
  {
    id: 'es-h2',
    category: 'hospital',
    categoryLabel: 'হাসপাতাল',
    title: 'কুষ্টিয়া মেডিকেল কলেজ হাসপাতাল',
    phone: '071-61500',
    address: 'কুষ্টিয়া শহরতলী',
    details: 'বিশেষজ্ঞ চিকিৎসা সেবা ও ইনডোর বিভাগ'
  },
  {
    id: 'es-h3',
    category: 'hospital',
    categoryLabel: 'হাসপাতাল',
    title: 'কুমারখালী উপজেলা স্বাস্থ্য কমপ্লেক্স',
    phone: '01730-324888',
    address: 'কুমারখালী, কুষ্টিয়া',
    details: 'জরুরি প্রসূতি ও প্রাথমিক চিকিৎসাসেবা'
  },
  {
    id: 'es-h4',
    category: 'hospital',
    categoryLabel: 'হাসপাতাল',
    title: 'ভেড়ামারা উপজেলা স্বাস্থ্য কমপ্লেক্স',
    phone: '01712-990011',
    address: 'ভেড়ামারা, কুষ্টিয়া',
    details: 'উপজেলা স্বাস্থ্য সেবা'
  },

  // Admin Offices
  {
    id: 'es-a1',
    category: 'admin',
    categoryLabel: 'প্রশাসনিক অফিস',
    title: 'জেলা প্রশাসক (DC) কার্যালয়, কুষ্টিয়া',
    phone: '071-61700',
    address: 'কালেক্টরেট ভবন, কোর্টপাড়া, কুষ্টিয়া',
    details: 'জেলা ম্যাজিস্ট্রেসি ও প্রশাসনিক সহায়তা'
  },
  {
    id: 'es-a2',
    category: 'admin',
    categoryLabel: 'প্রশাসনিক অফিস',
    title: 'কুষ্টিয়া পৌরসভা নাগরিক ভবন',
    phone: '071-62020',
    address: 'এনএস রোড, কুষ্টিয়া',
    details: 'পৌর নাগরিক সেবা ও কন্ট্রোল রুম'
  },
  {
    id: 'es-a3',
    category: 'admin',
    categoryLabel: 'প্রশাসনিক অফিস',
    title: 'সিভিল সার্জন কার্যালয়, কুষ্টিয়া',
    phone: '071-62340',
    address: 'হাসপাতাল রোড, কুষ্টিয়া',
    details: 'জেলা স্বাস্থ্য অধিদপ্তর'
  },
  {
    id: 'es-a4',
    category: 'admin',
    categoryLabel: 'প্রশাসনিক অফিস',
    title: 'পুলিশ সুপার (SP) অফিস, কুষ্টিয়া',
    phone: '01320-145998',
    address: 'কোর্টপাড়া, কুষ্টিয়া',
    details: 'জেলা পুলিশ কন্ট্রোল রুম'
  }
];

export const EmergencyPage: React.FC<EmergencyPageProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'police' | 'hospital' | 'admin'>('all');
  const [appConfig, setAppConfig] = useState(() => getAppThemeConfig());
  const [helplines, setHelplines] = useState<EmergencyHelpline[]>([]);

  useEffect(() => {
    const unsubHelplines = subscribeToHelplines((data) => setHelplines(data));
    getManagedHelplines().then(setHelplines);
    
    const handleConfigUpdate = () => {
      setAppConfig(getAppThemeConfig());
    };
    window.addEventListener('kushtia-app-config-updated', handleConfigUpdate);
    window.addEventListener('storage', handleConfigUpdate);
    return () => {
      unsubHelplines();
      window.removeEventListener('kushtia-app-config-updated', handleConfigUpdate);
      window.removeEventListener('storage', handleConfigUpdate);
    };
  }, []);

  const policeNum = appConfig?.emergencyContacts?.police || appConfig?.policePhone;
  const fireNum = appConfig?.emergencyContacts?.fire || appConfig?.fireServicePhone;
  const hospitalNum = appConfig?.emergencyContacts?.hospital || appConfig?.hospitalPhone;
  const ambulanceNum = appConfig?.emergencyContacts?.ambulance || appConfig?.ambulancePhone;
  const electricityNum = appConfig?.emergencyContacts?.electricity || appConfig?.electricityPhone;

  const activeHelplines = helplines.map(item => {
    if (item.id === 'em-2' && policeNum) {
      return { ...item, number: policeNum };
    }
    if (item.id === 'em-3' && fireNum) {
      return { ...item, number: fireNum };
    }
    if (item.id === 'em-4' && hospitalNum) {
      return { ...item, number: hospitalNum };
    }
    if (item.id === 'em-5' && ambulanceNum) {
      return { ...item, number: ambulanceNum };
    }
    if (item.id === 'em-6' && electricityNum) {
      return { ...item, number: electricityNum };
    }
    return item;
  });

  const filteredHelplines = activeHelplines.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.number.includes(searchQuery)
  );

  const filteredEssentialNumbers = KUSHTIA_ESSENTIAL_NUMBERS.filter(item => {
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.includes(searchQuery) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getIcon = (name: string) => {
    switch (name) {
      case 'ShieldAlert': return <ShieldAlert className="w-6 h-6 text-red-600" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-indigo-600" />;
      case 'Flame': return <Flame className="w-6 h-6 text-amber-600" />;
      case 'Hospital': return <Hospital className="w-6 h-6 text-emerald-600" />;
      case 'Zap': return <Zap className="w-6 h-6 text-yellow-600" />;
      case 'HeartHandshake': return <HeartHandshake className="w-6 h-6 text-rose-600" />;
      default: return <PhoneCall className="w-6 h-6 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-4 border border-pink-200/80/80 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 transition-colors flex items-center gap-1"
              title="পূর্ববর্তী পেজে ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">ফিরে যান</span>
            </button>
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-1.5">
                <PhoneCall className="w-5 h-5 text-red-600 animate-pulse" />
                <span>জরুরি হেল্পলাইন ও অত্যাবশ্যকীয় নম্বর</span>
              </h2>
              <p className="text-xs text-slate-500">কুষ্টিয়া জেলার পুলিশ স্টেশন, হাসপাতাল ও প্রশাসনিক অফিসের জরুরি কন্টাক্ট</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="থানা, হাসপাতাল, ডিসি অফিস বা অ্যাম্বুলেন্স অনুসন্ধান..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-pink-200/80 text-xs font-medium focus:outline-none focus:border-red-600 focus:bg-white"
          />
        </div>
      </div>

      {/* 999 Highlight Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-red-100 mb-0.5">
            <AlertTriangle className="w-4 h-4 text-yellow-300 animate-bounce" />
            <span>জাতীয় জরুরি সেবা (টোল ফ্রি)</span>
          </div>
          <h3 className="text-2xl font-black tracking-tight">ডায়াল করুন ৯৯৯ (999)</h3>
          <p className="text-xs text-red-100">যেকোনো নেটওয়ার্ক থেকে সম্পূর্ণ বিনামূল্যে কল করুন</p>
        </div>
        <a
          href="tel:999"
          className="px-4 py-3 bg-white text-red-600 hover:bg-red-50 active:scale-95 rounded-xl font-extrabold text-sm flex items-center gap-2 shadow-md transition-all shrink-0"
        >
          <PhoneCall className="w-4 h-4" />
          <span>এখনই কল</span>
        </a>
      </div>

      {/* SECTION 1: General Helplines */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-slate-900 px-1 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-600" />
          <span>জরুরি সেবা হটলাইন</span>
        </h3>
        {filteredHelplines.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-4 border border-pink-200/80/90 shadow-xs hover:border-red-200 transition-all"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-pink-100">
                  {getIcon(item.iconName)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>
                  <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                    {item.dept}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{item.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                    <Clock className="w-3 h-3 shrink-0" />
                    <span>{item.availableHours}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-pink-100 flex items-center justify-between gap-2">
              <div className="text-xs text-slate-700">
                নম্বর: <b className="font-mono text-sm text-slate-900">{item.number}</b>
              </div>
              <a
                href={`tel:${item.number.replace(/[^0-9]/g, '')}`}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs transition-all shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>ডায়াল করুন</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 2: Essential Numbers */}
      <div className="space-y-3 pt-4 border-t border-pink-200/80">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <span>কুষ্টিয়া অত্যাবশ্যকীয় নম্বরসমূহ (Essential Numbers)</span>
          </h3>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            সব দেখুন
          </button>
          <button
            onClick={() => setActiveTab('police')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              activeTab === 'police'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-indigo-50 text-slate-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>পুলিশ স্টেশন</span>
          </button>
          <button
            onClick={() => setActiveTab('hospital')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              activeTab === 'hospital'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-emerald-50 text-slate-700'
            }`}
          >
            <Hospital className="w-3.5 h-3.5" />
            <span>হাসপাতাল</span>
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              activeTab === 'admin'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-amber-50 text-slate-700'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>প্রশাসনিক অফিস</span>
          </button>
        </div>

        {/* Essential Numbers List */}
        <div className="space-y-3">
          {filteredEssentialNumbers.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-pink-200/80/90 shadow-xs hover:border-pink-300 transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                      item.category === 'police' 
                        ? 'bg-indigo-100 text-indigo-800' 
                        : item.category === 'hospital' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {item.categoryLabel}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">{item.details}</span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 leading-snug">{item.title}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{item.address}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-pink-100 flex items-center justify-between gap-2">
                <div className="text-xs text-slate-700">
                  ফোন: <b className="font-mono text-sm text-slate-900">{item.phone}</b>
                </div>
                <a
                  href={`tel:${item.phone.replace(/[^0-9]/g, '')}`}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs transition-all shrink-0"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>কল করুন</span>
                </a>
              </div>
            </div>
          ))}

          {filteredEssentialNumbers.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-400 text-xs">
              কোনো নাম্বার খুঁজে পাওয়া যায়নি।
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
