import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Edit2, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Image as ImageIcon,
  Save,
  X,
  Plus,
  Heart,
  Settings
} from 'lucide-react';
import { useAdminConfig } from '../../context/AdminConfigContext';
import { Volunteer } from '../../types';

export const VolunteerManagementTab: React.FC = () => {
  const { 
    themeConfig, 
    updateThemeConfig, 
    volunteers, 
    addNewVolunteer, 
    editVolunteer, 
    removeVolunteer 
  } = useAdminConfig();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Volunteer, 'id' | 'joinedAt'>>({
    name: '',
    photoURL: '',
    whatsapp: '',
    address: '',
    isVerified: true
  });

  // Settings state
  const [popupActive, setPopupActive] = useState(themeConfig.volunteerPopupActive);
  const [popupMessage, setPopupMessage] = useState(themeConfig.volunteerPopupMessage);
  const [contactNumber, setContactNumber] = useState(themeConfig.volunteerContactNumber);

  const handleSaveSettings = () => {
    updateThemeConfig({
      volunteerPopupActive: popupActive,
      volunteerPopupMessage: popupMessage,
      volunteerContactNumber: contactNumber
    });
    alert('সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await editVolunteer(editingId, formData);
        setEditingId(null);
      } else {
        await addNewVolunteer(formData);
        setIsAdding(false);
      }
      setFormData({
        name: '',
        photoURL: '',
        whatsapp: '',
        address: '',
        isVerified: true
      });
    } catch (err) {
      alert('সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  const handleEdit = (v: Volunteer) => {
    setEditingId(v.id);
    setFormData({
      name: v.name,
      photoURL: v.photoURL,
      whatsapp: v.whatsapp,
      address: v.address || '',
      isVerified: v.isVerified || false
    });
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই সেচ্ছাসেবীর তথ্য মুছে ফেলতে চান?')) {
      await removeVolunteer(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Volunteer Popup Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-pink-200/80/60 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">স্বেচ্ছাসেবী সেটিংস</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">জয়েন পপআপ এবং কন্টাক্ট নম্বর নিয়ন্ত্রণ করুন</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-pink-100 dark:border-slate-800">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">স্বেচ্ছাসেবী পপআপ সক্রিয়</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">ইউজারদের জয়েন করার অনুরোধ দেখাবে</p>
            </div>
            <button
              onClick={() => setPopupActive(!popupActive)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${popupActive ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${popupActive ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 dark:text-slate-300">পপআপ মেসেজ</label>
            <textarea
              value={popupMessage}
              onChange={(e) => setPopupMessage(e.target.value)}
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-pink-200/80 dark:border-slate-700 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-pink-500/20 outline-none min-h-[80px]"
              placeholder="পপআপে যা লেখা থাকবে..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 dark:text-slate-300">যোগদানের কন্টাক্ট নম্বর (WhatsApp)</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full py-3.5 pl-11 pr-4 bg-slate-50 dark:bg-slate-800 border border-pink-200/80 dark:border-slate-700 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-pink-500/20 outline-none"
                placeholder="017XXXXXXXX"
              />
            </div>
          </div>

          <button
            onClick={handleSaveSettings}
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-sm font-black shadow-lg shadow-emerald-700/20 transition-all active:scale-98"
          >
            সেটিংস সেভ করুন
          </button>
        </div>
      </div>

      {/* Volunteer List Management */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-pink-200/80/60 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">স্বেচ্ছাসেবী তালিকা</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">টিম মেম্বারদের তথ্য যোগ ও এডিট করুন</p>
            </div>
          </div>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="py-2.5 px-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-black flex items-center gap-2 border border-emerald-100 dark:border-emerald-900/30"
            >
              <Plus className="w-4 h-4" />
              নতুন যোগ করুন
            </button>
          )}
        </div>

        {isAdding && (
          <form onSubmit={handleSubmit} className="mb-8 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-pink-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-600" />
                {editingId ? 'তথ্য এডিট করুন' : 'নতুন সদস্য যোগ করুন'}
              </h4>
              <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase px-1">নাম</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-white dark:bg-slate-900 border border-pink-200/80 dark:border-slate-800 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-pink-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase px-1">WhatsApp নম্বর</label>
                <input
                  required
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full p-3 bg-white dark:bg-slate-900 border border-pink-200/80 dark:border-slate-800 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-pink-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase px-1">ছবি URL</label>
                <input
                  required
                  type="text"
                  value={formData.photoURL}
                  onChange={(e) => setFormData({ ...formData, photoURL: e.target.value })}
                  className="w-full p-3 bg-white dark:bg-slate-900 border border-pink-200/80 dark:border-slate-800 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-pink-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase px-1">ঠিকানা/এলাকা</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-3 bg-white dark:bg-slate-900 border border-pink-200/80 dark:border-slate-800 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-pink-500/20"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4">
               <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.isVerified}
                    onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-pink-500/20"
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">ভেরিফাইড ব্যাজ দেখাবে</span>
               </label>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button type="submit" className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md">
                <Save className="w-4 h-4" />
                সদস্য সেভ করুন
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {volunteers.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-pink-200/80 dark:border-slate-800">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-400">কোনো সেচ্ছাসেবী তথ্য পাওয়া যায়নি।</p>
            </div>
          ) : (
            volunteers.map((v: Volunteer) => (
              <div key={v.id} className="flex items-center gap-4 p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-pink-100 dark:border-slate-800 hover:border-emerald-100 dark:hover:border-emerald-900/30 transition-all">
                <img src={v.photoURL} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1">
                    {v.name}
                    {v.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">{v.address || 'কুষ্টিয়া'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(v)} className="p-2 bg-white dark:bg-slate-900 rounded-lg text-slate-500 hover:text-emerald-600 border border-pink-100 dark:border-slate-800 shadow-sm transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(v.id)} className="p-2 bg-white dark:bg-slate-900 rounded-lg text-slate-500 hover:text-rose-600 border border-pink-100 dark:border-slate-800 shadow-sm transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
