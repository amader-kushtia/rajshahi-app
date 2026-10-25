import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Droplet, 
  Phone, 
  MapPin, 
  Plus, 
  Search, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Send,
  Clock,
  Hospital,
  Activity,
  UserCheck,
  UserX,
  X
} from 'lucide-react';
import { BloodDonor, BloodEmergencyAlert } from '../../types';
import { 
  getManagedBloodDonors, 
  saveBloodDonor, 
  toggleBloodDonorAvailability, 
  deleteBloodDonor, 
  subscribeToBloodDonors,
  getBloodEmergencyAlerts, 
  createBloodEmergencyAlert, 
  toggleBloodAlertStatus, 
  deleteBloodEmergencyAlert,
  subscribeToBloodAlerts
} from '../../services/adminFeaturesService';
import { publishEmergencyBroadcast } from '../../utils/pushNotification';

export const BloodManagementTab: React.FC = () => {
  const [donors, setDonors] = useState<BloodDonor[]>([]);
  const [bloodAlerts, setBloodAlerts] = useState<BloodEmergencyAlert[]>([]);
  
  // Filters & State
  const [selectedGroup, setSelectedGroup] = useState<string>('সব গ্রুপ');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isDonorModalOpen, setIsDonorModalOpen] = useState(false);

  // Emergency Blood Alert Form
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [bagsNeeded, setBagsNeeded] = useState(1);
  const [hospital, setHospital] = useState('কুষ্টিয়া ২৫০ শয্যা সরকারি হাসপাতাল');
  const [reason, setReason] = useState('জরুরি সার্জারি অপারেশন');
  const [urgency, setUrgency] = useState<BloodEmergencyAlert['urgency']>('জরুরি (১ ঘণ্টার মধ্যে)');
  const [contactPhone, setContactPhone] = useState('');
  const [location, setLocation] = useState('হাসপাতাল রোড, কুষ্টিয়া');

  // Donor Form
  const [donorName, setDonorName] = useState('');
  const [donorGroup, setDonorGroup] = useState('A+');
  const [donorLocation, setDonorLocation] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorTotal, setDonorTotal] = useState(1);
  const [donorLastDate, setDonorLastDate] = useState('৩ মাস পূর্বে');

  useEffect(() => {
    const unsubDonors = subscribeToBloodDonors((data) => {
      setDonors(data);
    });
    const unsubAlerts = subscribeToBloodAlerts((data) => {
      setBloodAlerts(data);
    });
    return () => {
      unsubDonors();
      unsubAlerts();
    };
  }, []);

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !contactPhone.trim()) return;

    createBloodEmergencyAlert({
      patientName: patientName.trim(),
      bloodGroup,
      bagsNeeded: Number(bagsNeeded) || 1,
      hospital: hospital.trim(),
      reason: reason.trim(),
      urgency,
      contactPhone: contactPhone.trim(),
      location: location.trim(),
      isActive: true
    });

    // Send instant push notification & alarm chime to all registered citizens
    publishEmergencyBroadcast({
      title: `🚨 জরুরি রক্তের ডাক: ${bloodGroup} রক্ত প্রয়োজন`,
      body: `${hospital ? hospital.trim() : 'কুষ্টিয়া হাসপাতাল'} এ রোগীর জন্য ${bagsNeeded || 1} ব্যাগ ${bloodGroup} রক্ত জরুরি। ফোন: ${contactPhone.trim()}`,
      type: 'blood',
      bloodGroup: bloodGroup,
      hospital: hospital.trim(),
      contactNumber: contactPhone.trim(),
      actionUrl: '/?tab=blood'
    });

    setIsAlertModalOpen(false);
    // Reset
    setPatientName('');
    setContactPhone('');
  };

  const handleSaveDonor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || !donorPhone.trim()) return;

    saveBloodDonor({
      name: donorName.trim(),
      bloodGroup: donorGroup,
      location: donorLocation.trim() || 'কুষ্টিয়া',
      phone: donorPhone.trim(),
      totalDonations: Number(donorTotal) || 1,
      lastDonationDate: donorLastDate.trim(),
      isAvailable: true
    });

    setIsDonorModalOpen(false);
    setDonorName('');
    setDonorPhone('');
  };

  const bloodGroups = ['সব গ্রুপ', 'A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'];

  const filteredDonors = donors.filter(d => {
    const matchesGroup = selectedGroup === 'সব গ্রুপ' || d.bloodGroup === selectedGroup;
    const matchesSearch = 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone.includes(searchQuery);
    return matchesGroup && matchesSearch;
  });

  const activeBloodAlerts = bloodAlerts.filter(a => a.isActive);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-200/80/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-700">
              <Droplet className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">
              রক্তদাতা ডাটাবেস ও জরুরি ব্লাড অ্যালার্ট
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            রক্তের জরুরি প্রয়োজনে তৎক্ষণাৎ রক্তদাতার সাথে যোগাযোগ করুন বা শহরের পর্দায় জরুরি ডাক পোস্ট করুন।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAlertModalOpen(true)}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-black flex items-center gap-2 shadow-xs transition-all animate-pulse"
          >
            <AlertTriangle className="w-4 h-4 text-amber-200" />
            <span>জরুরি রক্তের ডাক ছাড়ুন</span>
          </button>

          <button
            onClick={() => setIsDonorModalOpen(true)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black flex items-center gap-2 shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>রক্তদাতা যোগ করুন</span>
          </button>
        </div>
      </div>

      {/* ACTIVE EMERGENCY BLOOD ALERTS CAROUSEL/LIST */}
      {activeBloodAlerts.length > 0 && (
        <div className="bg-gradient-to-r from-rose-900 via-red-800 to-rose-950 text-white rounded-3xl p-5 shadow-lg border border-rose-700/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-white/20 rounded-xl">
                <Heart className="w-4 h-4 text-rose-200 fill-rose-200" />
              </span>
              <h3 className="text-sm font-black text-white">
                বর্তমানে লাইভ জরুরি রক্তের আহ্বান ({activeBloodAlerts.length})
              </h3>
            </div>
            <span className="text-[10px] bg-rose-700 px-2 py-0.5 rounded-full font-bold">
              অ্যাপের হোম ও ব্লাড পেজে পিন করা
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeBloodAlerts.map(alert => (
              <div 
                key={alert.id}
                className="bg-black/25 rounded-2xl p-4 border border-white/10 flex flex-col justify-between space-y-2 backdrop-blur-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 bg-white text-rose-900 text-xs font-black rounded-lg">
                      {alert.bloodGroup} গ্রুপ • {alert.bagsNeeded} ব্যাগ
                    </span>
                    <span className="text-[10px] text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded">
                      {alert.urgency}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white mt-2">রোগী: {alert.patientName}</h4>
                  <p className="text-[11px] text-rose-100 flex items-center gap-1 mt-0.5">
                    <Hospital className="w-3 h-3 text-rose-300 shrink-0" />
                    <span className="truncate">{alert.hospital}</span>
                  </p>
                  <p className="text-[11px] text-rose-200 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-300 shrink-0" />
                    <span>{alert.contactPhone}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-[10px] text-rose-300">
                    {new Date(alert.createdAt).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button
                    onClick={() => toggleBloodAlertStatus(alert.id)}
                    className="px-2.5 py-1 bg-white/90 hover:bg-white text-rose-900 text-[11px] font-bold rounded-lg transition-all"
                  >
                    রক্ত পাওয়া গেছে (সম্পন্ন)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BLOOD DONORS DIRECTORY */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-200/80/80 shadow-xs space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-pink-100">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
            {bloodGroups.map(group => (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedGroup === group
                    ? 'bg-rose-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {group}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="রক্তদাতা খুঁজুন..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-pink-200/80 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-hidden"
            />
          </div>
        </div>

        {/* Donors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredDonors.map(donor => (
            <div 
              key={donor.id}
              className="p-4 rounded-2xl border border-pink-200/80 hover:border-rose-300 transition-all flex flex-col justify-between space-y-2 bg-slate-50/50"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 font-black text-xs flex items-center justify-center border border-rose-200 shadow-xs">
                    {donor.bloodGroup}
                  </span>
                  
                  <button
                    onClick={() => toggleBloodDonorAvailability(donor.id)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all ${
                      donor.isAvailable 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {donor.isAvailable ? (
                      <>
                        <UserCheck className="w-3 h-3" />
                        <span>প্রস্তুত</span>
                      </>
                    ) : (
                      <>
                        <UserX className="w-3 h-3" />
                        <span>অনুপলব্ধ</span>
                      </>
                    )}
                  </button>
                </div>

                <h4 className="text-xs font-black text-slate-900 mt-2">{donor.name}</h4>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{donor.location}</span>
                </p>
                <div className="text-[11px] text-slate-600 font-bold flex items-center gap-1 mt-1">
                  <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>{donor.phone}</span>
                </div>
                <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
                  <span>মোট রক্তদান: {donor.totalDonations} বার</span>
                  <span>{donor.lastDonationDate}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-pink-200/80/60">
                <a 
                  href={`tel:${donor.phone}`}
                  className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>কল</span>
                </a>
                
                <button
                  onClick={() => {
                    if (window.confirm(`আপনি কি "${donor.name}" কে মুছে ফেলতে চান?`)) {
                      deleteBloodDonor(donor.id);
                    }
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600"
                  title="মুছুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE EMERGENCY BLOOD ALERT MODAL */}
      {isAlertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-pink-200/80">
            <div className="flex items-center justify-between border-b border-pink-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>জরুরি রক্তের ডাক ছাড়ুন</span>
              </h3>
              <button 
                onClick={() => setIsAlertModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAlert} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">রক্তের গ্রুপ *</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-pink-300 text-xs font-bold focus:ring-2 focus:ring-rose-500 outline-hidden bg-white"
                  >
                    {['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">প্রয়োজনীয় ব্যাগ</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={bagsNeeded}
                    onChange={(e) => setBagsNeeded(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">রোগীর নাম *</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="যেমন: মোছাঃ শাহিদা বেগম"
                  className="w-full px-3 py-2 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">হাসপাতাল / ক্লিনিক *</label>
                <input
                  type="text"
                  required
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  placeholder="যেমন: কুষ্টিয়া ২৫০ শয্যা জেনারেল হাসপাতাল"
                  className="w-full px-3 py-2 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">জরুরিতা</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as BloodEmergencyAlert['urgency'])}
                    className="w-full px-3 py-2 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-hidden bg-white"
                  >
                    <option value="জরুরি (১ ঘণ্টার মধ্যে)">জরুরি (১ ঘণ্টার মধ্যে)</option>
                    <option value="আজকের মধ্যে">আজকের মধ্যে</option>
                    <option value="আগামীকাল">আগামীকাল</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">যোগাযোগ নম্বর *</label>
                  <input
                    type="text"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="01712..."
                    className="w-full px-3 py-2 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">অসুস্থতা বা কারণ</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="যেমন: ডেলিভারি রোগী অথবা দুর্ঘটনা"
                  className="w-full px-3 py-2 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-pink-100">
                <button
                  type="button"
                  onClick={() => setIsAlertModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-rose-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>এখনই ডাক প্রচার করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD DONOR MODAL */}
      {isDonorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-pink-200/80">
            <div className="flex items-center justify-between border-b border-pink-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">
                নতুন রক্তদাতা নিবন্ধন করুন
              </h3>
              <button 
                onClick={() => setIsDonorModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDonor} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">রক্তদাতার নাম *</label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="যেমন: মোঃ সাকিবুল হাসান"
                  className="w-full px-3 py-2 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">রক্তের গ্রুপ *</label>
                  <select
                    value={donorGroup}
                    onChange={(e) => setDonorGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-pink-300 text-xs font-bold focus:ring-2 focus:ring-rose-500 outline-hidden bg-white"
                  >
                    {['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="text"
                    required
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="01712..."
                    className="w-full px-3 py-2 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">এলাকা / ঠিকানা</label>
                <input
                  type="text"
                  value={donorLocation}
                  onChange={(e) => setDonorLocation(e.target.value)}
                  placeholder="যেমন: মজমপুর, কুষ্টিয়া"
                  className="w-full px-3 py-2 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">মোট রক্তদান (বার)</label>
                  <input
                    type="number"
                    min="0"
                    value={donorTotal}
                    onChange={(e) => setDonorTotal(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">সর্বশেষ রক্তদান</label>
                  <input
                    type="text"
                    value={donorLastDate}
                    onChange={(e) => setDonorLastDate(e.target.value)}
                    placeholder="যেমন: ৩ মাস পূর্বে"
                    className="w-full px-3 py-2 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-pink-100">
                <button
                  type="button"
                  onClick={() => setIsDonorModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black flex items-center gap-1.5"
                >
                  <span>নিবন্ধন সম্পন্ন করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
