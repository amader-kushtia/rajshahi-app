import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Train, 
  Plane, 
  Bus, 
  Car, 
  Clock, 
  Calendar, 
  MapPin, 
  Phone, 
  Ticket, 
  CheckCircle2, 
  Info
} from 'lucide-react';
import { getManagedTransport, subscribeToTransport } from '../services/adminFeaturesService';
import { TransportSchedule } from '../types';
import { TransportMapView } from '../components/TransportMapView';

interface TransportPageProps {
  onBack: () => void;
}

export const TransportPage: React.FC<TransportPageProps> = ({ onBack }) => {
  const [activeType, setActiveType] = useState<'সব' | 'ট্রেন' | 'বিমান' | 'বাস' | 'মাইক্রোবাস'>('সব');
  const [searchQuery, setSearchQuery] = useState('');
  const [transports, setTransports] = useState<TransportSchedule[]>([]);

  useEffect(() => {
    const unsub = subscribeToTransport((data) => {
      setTransports(data);
    });

    const handleEvent = (e: any) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setTransports(e.detail);
      }
    };
    window.addEventListener('kushtia-transport-updated', handleEvent);

    return () => {
      unsub();
      window.removeEventListener('kushtia-transport-updated', handleEvent);
    };
  }, []);

  const filteredTransport = transports.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.code && item.code.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = activeType === 'সব' || item.type === activeType || (activeType === 'মাইক্রোবাস' && (item.type === 'কার রেন্ট' || item.type === 'মাইক্রোবাস'));

    return matchesSearch && matchesType;
  });

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
                <Train className="w-5 h-5 text-emerald-700" />
                <span>যাতায়াত ও টিকেট শিডিউল</span>
              </h2>
              <p className="text-xs text-slate-500">কুষ্টিয়া ট্রেন, বিমান, বাস ও রেন্ট-এ-কার বুকিং</p>
            </div>
          </div>
        </div>

        {/* Vehicle Type Tabs */}
        <div className="grid grid-cols-5 gap-1.5 p-1 bg-slate-100 rounded-xl mb-3 text-xs font-bold">
          {[
            { id: 'সব', label: 'সব শিডিউল', icon: Ticket },
            { id: 'ট্রেন', label: 'ট্রেন', icon: Train },
            { id: 'বিমান', label: 'ফ্লাইট', icon: Plane },
            { id: 'বাস', label: 'বাস', icon: Bus },
            { id: 'মাইক্রোবাস', label: 'কার রেন্ট', icon: Car },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveType(tab.id as any)}
              className={`py-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${
                activeType === tab.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-[11px]">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="রুট বা ট্রেনের নাম অনুসন্ধান করুন (যেমন: সুন্দরবন, মধুমতি, ঢাকা, খুলনা)..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-pink-200/80 text-xs font-medium focus:outline-none focus:border-pink-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Interactive Map View */}
      <TransportMapView />

      {/* Info Notice */}
      <div className="p-3 bg-emerald-50/80 border border-emerald-100 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900 font-medium">
        <Info className="w-4 h-4 text-emerald-700 shrink-0" />
        <span>কুষ্টিয়া পোড়াদহ জংশন, কোর্ট স্টেশন ও মজমপুর বাস টার্মিনাল জেলার প্রধান যোগাযোগ কেন্দ্র। যেকোনো টিকেটের জন্য সরাসরি কাউন্টারে যোগাযোগ করুন।</span>
      </div>

      {/* Transport Cards */}
      <div className="space-y-3.5">
        {filteredTransport.map((trans) => (
          <div
            key={trans.id}
            className="bg-white rounded-2xl p-4 border border-pink-200/80/90 shadow-xs hover:border-emerald-200 transition-all"
          >
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                  {trans.type === 'ট্রেন' && <Train className="w-5 h-5" />}
                  {trans.type === 'বিমান' && <Plane className="w-5 h-5 text-sky-600" />}
                  {trans.type === 'বাস' && <Bus className="w-5 h-5 text-amber-600" />}
                  {trans.type === 'মাইক্রোবাস' && <Car className="w-5 h-5 text-indigo-600" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{trans.name}</h3>
                    {trans.code && (
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        {trans.code}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{trans.route}</span>
                  </div>
                </div>
              </div>

              <span className="text-[11px] font-bold px-2 py-1 rounded-md bg-emerald-50 text-emerald-800 shrink-0">
                {trans.type}
              </span>
            </div>

            {/* Time & Schedule Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl text-xs text-slate-700 mb-3 border border-pink-100">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-medium">{trans.departureTime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>ছুটির দিন: <b className="text-slate-800">{trans.offDay}</b></span>
              </div>
            </div>

            {/* Fares List */}
            <div className="mb-3">
              <span className="text-[11px] font-bold text-slate-500 block mb-1">ভাড়া তালিকা:</span>
              <div className="flex flex-wrap gap-2">
                {trans.fareList.map((f, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg border border-pink-200/80 text-xs font-medium"
                  >
                    <span className="text-slate-600">{f.class}:</span>
                    <span className="font-extrabold text-emerald-800">{f.fare}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Booking Call Button */}
            {trans.bookingPhone && (
              <div className="pt-2.5 border-t border-pink-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">টিকেট ও সিট বুকিং:</span>
                <a
                  href={`tel:${trans.bookingPhone.replace(/[^0-9]/g, '')}`}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>কল: {trans.bookingPhone}</span>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
