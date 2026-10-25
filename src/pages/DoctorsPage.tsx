import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Phone, 
  Stethoscope, 
  Heart, 
  Droplet, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Building, 
  AlertCircle
} from 'lucide-react';
import { getDoctors, getBloodDonors, subscribeToDoctors, subscribeToBloodDonors } from '../services/adminFeaturesService';
import { Doctor, BloodDonor } from '../types';

interface DoctorsPageProps {
  initialTab?: 'doctors' | 'blood';
  onBack: () => void;
}

export const DoctorsPage: React.FC<DoctorsPageProps> = ({
  initialTab = 'doctors',
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'doctors' | 'blood'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeciality, setSelectedSpeciality] = useState('সব বিশেষজ্ঞ');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('সব রক্ত গ্রুপ');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [donors, setDonors] = useState<BloodDonor[]>([]);

  useEffect(() => {
    const unsubDocs = subscribeToDoctors((data) => setDoctors(data));
    const unsubDonors = subscribeToBloodDonors((data) => setDonors(data));
    
    // Initial sync fetch
    setDoctors(getDoctors());
    setDonors(getBloodDonors());

    return () => {
      unsubDocs();
      unsubDonors();
    };
  }, []);

  const specialities = ['সব বিশেষজ্ঞ', 'মেডিসিন', 'গাইনী', 'শিশু রোগ', 'অর্থোপেডিক'];
  const bloodGroups = ['সব রক্ত গ্রুপ', 'A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'];

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.speciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.chamber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpec = 
      selectedSpeciality === 'সব বিশেষজ্ঞ' || doc.speciality.includes(selectedSpeciality);

    return matchesSearch && matchesSpec;
  });

  const filteredDonors = donors.filter(donor => {
    const matchesSearch = 
      donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGroup = 
      selectedBloodGroup === 'সব রক্ত গ্রুপ' || donor.bloodGroup === selectedBloodGroup;

    return matchesSearch && matchesGroup;
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
                <Stethoscope className="w-5 h-5 text-emerald-700" />
                <span>ডাক্তার ও স্বাস্থ্যসেবা</span>
              </h2>
              <p className="text-xs text-slate-500">কুষ্টিয়ায়র বিশেষজ্ঞ ডাক্তার চেম্বার ও জরুরি রক্তদাতা</p>
            </div>
          </div>
        </div>

        {/* Tab Switcher: Doctors vs Blood Donors */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-3">
          <button
            onClick={() => setActiveTab('doctors')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'doctors'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-emerald-600" />
            <span>বিশেষজ্ঞ ডাক্তার ({doctors.length})</span>
          </button>
 
          <button
            onClick={() => setActiveTab('blood')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'blood'
                ? 'bg-white text-rose-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Droplet className="w-4 h-4 text-rose-600" />
            <span>জরুরি রক্তদাতা ({donors.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-2.5">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'doctors'
                ? 'ডাক্তারের নাম, রোগ বা চেম্বার খুঁজুন...'
                : 'রক্তের গ্রুপ বা এলাকা অনুসন্ধান করুন...'
            }
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-pink-200/80 text-xs font-medium focus:outline-none focus:border-pink-600"
          />
        </div>

        {/* Dynamic Filters based on Tab */}
        {activeTab === 'doctors' ? (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
            {specialities.map(spec => (
              <button
                key={spec}
                onClick={() => setSelectedSpeciality(spec)}
                className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all ${
                  selectedSpeciality === spec
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
            {bloodGroups.map(bg => (
              <button
                key={bg}
                onClick={() => setSelectedBloodGroup(bg)}
                className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all ${
                  selectedBloodGroup === bg
                    ? 'bg-rose-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* DOCTORS LIST TAB */}
      {activeTab === 'doctors' && (
        <div className="space-y-3">
          {filteredDoctors.map(doc => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl p-4 border border-pink-200/80/90 shadow-xs hover:border-emerald-200 transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900">{doc.name}</h3>
                    {doc.isVerified && (
                      <div className="flex items-center gap-0.5 bg-emerald-100/80 text-emerald-800 px-1.5 py-0.5 rounded-full text-[9px] font-bold border border-emerald-200 shadow-xs">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>যাচাইকৃত</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                    {doc.speciality}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">{doc.degree}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block">ভিজিট ফি</span>
                  <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50/80 px-2 py-0.5 rounded-md border border-emerald-100">
                    {doc.fee}
                  </span>
                </div>
              </div>

              {/* Hospital & Chamber details */}
              <div className="bg-slate-50 rounded-xl p-2.5 mb-3 text-xs space-y-1.5 border border-pink-100">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Building className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="font-semibold text-slate-800">{doc.chamber}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{doc.visitingHours}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{doc.availableDays}</span>
                </div>
              </div>

              {/* Booking Call Action */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-pink-100">
                <span className="text-[11px] text-slate-500 truncate">
                  সিরিয়াল দিতে সরাসরি কল করুন
                </span>
                <a
                  href={`tel:${doc.serialNumber}`}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>সিরিয়াল: {doc.serialNumber}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BLOOD DONORS TAB */}
      {activeTab === 'blood' && (
        <div className="space-y-3">
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-xs text-rose-900 font-medium">
            <Heart className="w-4 h-4 text-rose-600 shrink-0 fill-current" />
            <span>এক ব্যাগ রক্ত বাঁচাতে পারে একটি জীবন। কোনো রোগীকে রক্ত দিতে স্বেচ্ছাসেবী রক্তদাতাদের সরাসরি কল করুন।</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredDonors.map(donor => (
              <div
                key={donor.id}
                className="bg-white rounded-2xl p-3.5 border border-pink-200/80/90 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex flex-col items-center justify-center shrink-0 shadow-sm shadow-rose-900/10">
                    <span className="text-base font-black leading-none">{donor.bloodGroup}</span>
                    <span className="text-[9px] font-semibold text-rose-200 mt-0.5">রক্ত গ্রুপ</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{donor.name}</h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>{donor.location}</span>
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      দান করেছেন: <b className="text-slate-700">{donor.totalDonations} বার</b> ({donor.lastDonationDate})
                    </span>
                  </div>
                </div>

                <a
                  href={`tel:${donor.phone}`}
                  className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold transition-colors shrink-0"
                  title="রক্তদাতাকে কল করুন"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
