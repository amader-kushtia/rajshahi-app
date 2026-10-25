import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  PhoneCall, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Hospital, 
  Clock, 
  Phone, 
  MapPin,
  ShieldCheck,
  Building,
  UserCheck,
  Save,
  X
} from 'lucide-react';
import { Doctor, EmergencyHelpline } from '../../types';
import { 
  getManagedDoctors, 
  saveDoctor, 
  deleteDoctor, 
  subscribeToDoctors,
  getManagedHelplines, 
  saveHelpline, 
  deleteHelpline,
  subscribeToHelplines
} from '../../services/adminFeaturesService';

export const DirectoryManagementTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'doctors' | 'helplines'>('doctors');
  
  // Data state
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [helplines, setHelplines] = useState<EmergencyHelpline[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Form State
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [isHelplineModalOpen, setIsHelplineModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [editingHelpline, setEditingHelpline] = useState<EmergencyHelpline | null>(null);

  // Doctor Form Fields
  const [docName, setDocName] = useState('');
  const [docSpeciality, setDocSpeciality] = useState('');
  const [docDegree, setDocDegree] = useState('');
  const [docHospital, setDocHospital] = useState('');
  const [docChamber, setDocChamber] = useState('');
  const [docVisitingHours, setDocVisitingHours] = useState('');
  const [docSerial, setDocSerial] = useState('');
  const [docFee, setDocFee] = useState('');
  const [docDays, setDocDays] = useState('');

  // Helpline Form Fields
  const [helpTitle, setHelpTitle] = useState('');
  const [helpDept, setHelpDept] = useState('');
  const [helpNumber, setHelpNumber] = useState('');
  const [helpAltNumber, setHelpAltNumber] = useState('');
  const [helpAddress, setHelpAddress] = useState('');
  const [helpHours, setHelpHours] = useState('২৪ ঘণ্টা');

  useEffect(() => {
    const unsubDocs = subscribeToDoctors((data) => {
      setDoctors(data);
    });
    const unsubHelps = subscribeToHelplines((data) => {
      setHelplines(data);
    });
    return () => {
      unsubDocs();
      unsubHelps();
    };
  }, []);

  // Doctor Form Handlers
  const openDoctorModal = (doctor?: Doctor) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setDocName(doctor.name);
      setDocSpeciality(doctor.speciality);
      setDocDegree(doctor.degree);
      setDocHospital(doctor.hospital);
      setDocChamber(doctor.chamber);
      setDocVisitingHours(doctor.visitingHours);
      setDocSerial(doctor.serialNumber);
      setDocFee(doctor.fee);
      setDocDays(doctor.availableDays);
    } else {
      setEditingDoctor(null);
      setDocName('');
      setDocSpeciality('জেনারেল মেডিসিন');
      setDocDegree('এমবিবিএস, বিসিএস (স্বাস্থ্য)');
      setDocHospital('কুষ্টিয়া ২৫০ শয্যা সরকারি হাসপাতাল');
      setDocChamber('কুষ্টিয়া');
      setDocVisitingHours('প্রতিদিন বিকাল ৫:০০ - রাত ৮:০০');
      setDocSerial('01712000000');
      setDocFee('৬০০ ৳');
      setDocDays('শনিবার হতে বৃহস্পতিবার');
    }
    setIsDoctorModalOpen(true);
  };

  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    saveDoctor({
      id: editingDoctor ? editingDoctor.id : undefined,
      name: docName.trim(),
      speciality: docSpeciality.trim(),
      degree: docDegree.trim(),
      hospital: docHospital.trim(),
      chamber: docChamber.trim(),
      visitingHours: docVisitingHours.trim(),
      serialNumber: docSerial.trim(),
      fee: docFee.trim(),
      availableDays: docDays.trim(),
      isVerified: true
    });

    setIsDoctorModalOpen(false);
  };

  // Helpline Form Handlers
  const openHelplineModal = (helpline?: EmergencyHelpline) => {
    if (helpline) {
      setEditingHelpline(helpline);
      setHelpTitle(helpline.title);
      setHelpDept(helpline.dept);
      setHelpNumber(helpline.number);
      setHelpAltNumber(helpline.alternateNumber || '');
      setHelpAddress(helpline.address);
      setHelpHours(helpline.availableHours);
    } else {
      setEditingHelpline(null);
      setHelpTitle('');
      setHelpDept('কুষ্টিয়া প্রশাসন');
      setHelpNumber('');
      setHelpAltNumber('');
      setHelpAddress('কুষ্টিয়া সদর, কুষ্টিয়া');
      setHelpHours('২৪ ঘণ্টা খোলা');
    }
    setIsHelplineModalOpen(true);
  };

  const handleSaveHelpline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!helpTitle.trim() || !helpNumber.trim()) return;

    saveHelpline({
      id: editingHelpline ? editingHelpline.id : undefined,
      title: helpTitle.trim(),
      dept: helpDept.trim(),
      number: helpNumber.trim(),
      alternateNumber: helpAltNumber.trim() || undefined,
      address: helpAddress.trim(),
      availableHours: helpHours.trim()
    });

    setIsHelplineModalOpen(false);
  };

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.speciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.chamber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHelplines = helplines.filter(h =>
    h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.number.includes(searchQuery)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-200/80/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <Stethoscope className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">
              জরুরি ডিরেক্টরি ও ডাক্তার সেবা পরিচালনা
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            ডাক্তারদের চেম্বার, ভিজিটিং সময় এবং ফায়ার সার্ভিস, পুলিশ বা অ্যাম্বুলেন্স নম্বর সরাসরি পরিবর্তন করুন।
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'doctors' ? (
            <button
              onClick={() => openDoctorModal()}
              className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl text-xs font-black flex items-center gap-2 shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন ডাক্তার যোগ করুন</span>
            </button>
          ) : (
            <button
              onClick={() => openHelplineModal()}
              className="px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-2xl text-xs font-black flex items-center gap-2 shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন হেল্পলাইন নম্বর</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tab Switcher & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-pink-200/80/80">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveSubTab('doctors')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeSubTab === 'doctors'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>বিশেষজ্ঞ ডাক্তার তালিকা ({doctors.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('helplines')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeSubTab === 'helplines'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>জরুরি হেল্পলাইন নম্বর ({helplines.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নাম বা বিষয় লিখে খুঁজুন..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-pink-200/80 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-hidden"
          />
        </div>
      </div>

      {/* 1. DOCTORS TAB CONTENT */}
      {activeSubTab === 'doctors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDoctors.map((doctor) => (
            <div 
              key={doctor.id}
              className="bg-white rounded-3xl p-5 border border-pink-200/80/90 shadow-xs hover:border-teal-500/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                      {doctor.name}
                      {doctor.isVerified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                    </h3>
                    <span className="inline-block text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md mt-0.5">
                      {doctor.speciality}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-xl">
                    ফি: {doctor.fee}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 font-medium">
                  {doctor.degree}
                </p>

                <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-pink-100">
                  <div className="flex items-center gap-1.5 truncate">
                    <Building className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{doctor.hospital}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
                    <span className="truncate font-medium text-slate-700">{doctor.chamber}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>{doctor.visitingHours}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="font-bold text-slate-800">সিরিয়াল: {doctor.serialNumber}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 mt-2 border-t border-pink-100">
                <button
                  onClick={() => openDoctorModal(doctor)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>সম্পাদনা</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`আপনি কি "${doctor.name}" কে তালিকা থেকে মুছে ফেলতে চান?`)) {
                      deleteDoctor(doctor.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. HELPLINES TAB CONTENT */}
      {activeSubTab === 'helplines' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredHelplines.map((helpline) => (
            <div 
              key={helpline.id}
              className="bg-white rounded-3xl p-5 border border-pink-200/80/90 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                  {helpline.dept}
                </span>
                <h3 className="text-xs font-black text-slate-900 leading-snug">
                  {helpline.title}
                </h3>
                
                <div className="pt-2 border-t border-pink-100 space-y-1">
                  <div className="text-sm font-black text-emerald-800 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{helpline.number}</span>
                  </div>
                  {helpline.alternateNumber && (
                    <p className="text-[11px] text-slate-500">
                      বিকল্প: {helpline.alternateNumber}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{helpline.address}</span>
                  </p>
                  <p className="text-[10px] text-amber-700 font-bold">
                    {helpline.availableHours}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 mt-2 border-t border-pink-100">
                <button
                  onClick={() => openHelplineModal(helpline)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                >
                  সম্পাদনা
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`আপনি কি "${helpline.title}" মুছে ফেলতে চান?`)) {
                      deleteHelpline(helpline.id);
                    }
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DOCTOR CREATE/EDIT MODAL */}
      {isDoctorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl border border-pink-200/80">
            <div className="flex items-center justify-between border-b border-pink-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">
                {editingDoctor ? 'ডাক্তারের তথ্য সম্পাদনা' : 'নতুন ডাক্তার যুক্ত করুন'}
              </h3>
              <button 
                onClick={() => setIsDoctorModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDoctor} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ডাক্তারের নাম *</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="যেমন: ডাঃ মোঃ কামরুল ইসলাম"
                  className="w-full px-3 py-2 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বিশেষজ্ঞতা *</label>
                  <input
                    type="text"
                    required
                    value={docSpeciality}
                    onChange={(e) => setDocSpeciality(e.target.value)}
                    placeholder="যেমন: কার্ডিওলজিস্ট"
                    className="w-full px-3 py-2 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ভিজিট ফি</label>
                  <input
                    type="text"
                    value={docFee}
                    onChange={(e) => setDocFee(e.target.value)}
                    placeholder="যেমন: ৭০০ ৳"
                    className="w-full px-3 py-2 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ডিগ্রি ও পদবী</label>
                <input
                  type="text"
                  value={docDegree}
                  onChange={(e) => setDocDegree(e.target.value)}
                  placeholder="যেমন: এমবিবিএস, এফসিপিএস (মেডিসিন)"
                  className="w-full px-3 py-2 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">মূল কর্মস্থল / হাসপাতাল</label>
                <input
                  type="text"
                  value={docHospital}
                  onChange={(e) => setDocHospital(e.target.value)}
                  placeholder="যেমন: কুষ্টিয়া ২৫০ শয্যা সরকারি হাসপাতাল"
                  className="w-full px-3 py-2 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">চেম্বার ও ঠিকানা *</label>
                <input
                  type="text"
                  required
                  value={docChamber}
                  onChange={(e) => setDocChamber(e.target.value)}
                  placeholder="যেমন: সেবা ডায়াগনস্টিক সেন্টার, শেরে বাংলা রোড"
                  className="w-full px-3 py-2 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">সাক্ষাতের সময়</label>
                  <input
                    type="text"
                    value={docVisitingHours}
                    onChange={(e) => setDocVisitingHours(e.target.value)}
                    placeholder="যেমন: বিকাল ৫টা - রাত ৯টা"
                    className="w-full px-3 py-2 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">সিরিয়াল বুকিং ফোন *</label>
                  <input
                    type="text"
                    required
                    value={docSerial}
                    onChange={(e) => setDocSerial(e.target.value)}
                    placeholder="01712..."
                    className="w-full px-3 py-2 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-teal-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-pink-100">
                <button
                  type="button"
                  onClick={() => setIsDoctorModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HELPLINE MODAL */}
      {isHelplineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-pink-200/80">
            <div className="flex items-center justify-between border-b border-pink-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">
                {editingHelpline ? 'হেল্পলাইন সম্পাদনা' : 'নতুন হেল্পলাইন যুক্ত করুন'}
              </h3>
              <button 
                onClick={() => setIsHelplineModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHelpline} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">সেবা বা প্রতিষ্ঠানের নাম *</label>
                <input
                  type="text"
                  required
                  value={helpTitle}
                  onChange={(e) => setHelpTitle(e.target.value)}
                  placeholder="যেমন: কুষ্টিয়া ফায়ার স্টেশন"
                  className="w-full px-3 py-2 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বিভাগ বা দপ্তর</label>
                <input
                  type="text"
                  value={helpDept}
                  onChange={(e) => setHelpDept(e.target.value)}
                  placeholder="যেমন: ফায়ার সার্ভিস ও সিভিল ডিফেন্স"
                  className="w-full px-3 py-2 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">জরুরি নম্বর *</label>
                  <input
                    type="text"
                    required
                    value={helpNumber}
                    onChange={(e) => setHelpNumber(e.target.value)}
                    placeholder="01715..."
                    className="w-full px-3 py-2 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বিকল্প নম্বর</label>
                  <input
                    type="text"
                    value={helpAltNumber}
                    onChange={(e) => setHelpAltNumber(e.target.value)}
                    placeholder="০৫৫২৬-..."
                    className="w-full px-3 py-2 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ঠিকানা বা এরিয়া</label>
                <input
                  type="text"
                  value={helpAddress}
                  onChange={(e) => setHelpAddress(e.target.value)}
                  placeholder="যেমন: রেলওয়ে কলোনি রোড, কুষ্টিয়া"
                  className="w-full px-3 py-2 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-pink-100">
                <button
                  type="button"
                  onClick={() => setIsHelplineModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
