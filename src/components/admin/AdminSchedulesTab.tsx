import React, { useState, useEffect } from 'react';
import { 
  Train, 
  Plane, 
  Bus, 
  Car, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Ticket,
  X,
  Save,
  Table as TableIcon
} from 'lucide-react';
import { TransportSchedule } from '../../types';
import { getManagedTransport, saveTransport, deleteTransport } from '../../services/adminFeaturesService';

export const AdminSchedulesTab: React.FC = () => {
  const [transports, setTransports] = useState<TransportSchedule[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('সব');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransport, setEditingTransport] = useState<TransportSchedule | null>(null);

  // Form fields
  const [transType, setTransType] = useState<'বাস' | 'ট্রেন' | 'বিমান' | 'কার রেন্ট' | 'মাইক্রোবাস'>('বাস');
  const [transName, setTransName] = useState('');
  const [transCode, setTransCode] = useState('');
  const [transRoute, setTransRoute] = useState('');
  const [transDeparture, setTransDeparture] = useState('');
  const [transArrival, setTransArrival] = useState('');
  const [transOffDay, setTransOffDay] = useState('');
  const [transPhone, setTransPhone] = useState('');
  const [fareClassName, setFareClassName] = useState('সাধারণ চেয়ার / সিট');
  const [fareAmount, setFareAmount] = useState('৫০০ ৳');
  const [fareList, setFareList] = useState<{ class: string; fare: string }[]>([]);

  const [feedback, setFeedback] = useState<string | null>(null);

  const refreshData = () => {
    setTransports(getManagedTransport());
  };

  useEffect(() => {
    refreshData();
    const handleUpdate = () => refreshData();
    window.addEventListener('kushtia-transport-updated', handleUpdate);
    return () => window.removeEventListener('kushtia-transport-updated', handleUpdate);
  }, []);

  const openModal = (item?: TransportSchedule) => {
    if (item) {
      setEditingTransport(item);
      setTransType(item.type);
      setTransName(item.name);
      setTransCode(item.code || '');
      setTransRoute(item.route);
      setTransDeparture(item.departureTime);
      setTransArrival(item.arrivalTime);
      setTransOffDay(item.offDay);
      setTransPhone(item.bookingPhone || '');
      setFareList(item.fareList || []);
    } else {
      setEditingTransport(null);
      setTransType('বাস');
      setTransName('');
      setTransCode('');
      setTransRoute('কুষ্টিয়া ⇄ ঢাকা');
      setTransDeparture('কুষ্টিয়া ছাড়ার সময়: সকাল ৮:০০');
      setTransArrival('ঢাকা পৌঁছার সময়: বিকাল ৪:০০');
      setTransOffDay('নেই');
      setTransPhone('01712000000');
      setFareList([
        { class: 'নন-এসি', fare: '৮০০ ৳' },
        { class: 'এসি', fare: '১২০০ ৳' }
      ]);
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transName.trim() || !transRoute.trim()) {
      alert('দয়া করে পরিববহনের নাম ও রুট পূরণ করুন।');
      return;
    }

    saveTransport({
      id: editingTransport ? editingTransport.id : undefined,
      type: transType,
      name: transName,
      code: transCode,
      route: transRoute,
      departureTime: transDeparture,
      arrivalTime: transArrival,
      offDay: transOffDay,
      bookingPhone: transPhone,
      fareList: fareList.length > 0 ? fareList : [{ class: 'সাধারণ', fare: '৫০০ ৳' }]
    });

    setIsModalOpen(false);
    setFeedback('শিডিউল সফলভাবে সংরক্ষণ করা হয়েছে!');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`আপনি কি নিশ্চিতভাবে "${name}" শিডিউলটি ডিলিট করতে চান?`)) {
      deleteTransport(id);
      setFeedback('শিডিউল সফলভাবে ডিলিট করা হয়েছে।');
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const addFareItem = () => {
    if (!fareClassName || !fareAmount) return;
    setFareList([...fareList, { class: fareClassName, fare: fareAmount }]);
    setFareClassName('');
    setFareAmount('');
  };

  const removeFareItem = (idx: number) => {
    setFareList(fareList.filter((_, i) => i !== idx));
  };

  const filteredTransports = transports.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.code && item.code.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = filterType === 'সব' || item.type === filterType || (filterType === 'মাইক্রোবাস' && (item.type === 'কার রেন্ট' || item.type === 'মাইক্রোবাস'));
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-pink-200/80/80 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Train className="w-6 h-6 text-emerald-600" />
            <span>Schedules Management (ট্রেন, ফ্লাইট, বাস, কার)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            টেবিল লেআউটে কুষ্টিয়া যাতায়াত ও টিকেটিং শিডিউল সংযোজন, সম্পাদনা এবং নিয়ন্ত্রণ করুন।
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন শিডিউল যোগ করুন</span>
        </button>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2.5 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-pink-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="রুট বা নাম দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-pink-200/80 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-pink-600 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {['সব', 'ট্রেন', 'বিমান', 'বাস', 'মাইক্রোবাস'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === type
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {type === 'মাইক্রোবাস' ? 'কার রেন্ট' : type}
            </button>
          ))}
        </div>
      </div>

      {/* CRUD Table Layout */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-pink-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-pink-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-emerald-600" />
            <span>সকল শিডিউল টেবিল ({filteredTransports.length}টি)</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">ধরণ ও নাম</th>
                <th className="py-3 px-4">রুট</th>
                <th className="py-3 px-4">সময় বিবরণ</th>
                <th className="py-3 px-4">ছুটি ও হেল্পলাইন</th>
                <th className="py-3 px-4">ভাড়া তালিকা</th>
                <th className="py-3 px-4 text-right">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium">
              {filteredTransports.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        {item.type === 'ট্রেন' && <Train className="w-4 h-4" />}
                        {item.type === 'বিমান' && <Plane className="w-4 h-4 text-sky-600" />}
                        {item.type === 'বাস' && <Bus className="w-4 h-4 text-amber-600" />}
                        {(item.type === 'কার রেন্ট' || item.type === 'মাইক্রোবাস') && <Car className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                            {item.type}
                          </span>
                          {item.code && (
                            <span className="text-[10px] text-slate-500 font-semibold">{item.code}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-semibold">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item.route}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="line-clamp-2">{item.departureTime}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-slate-700 dark:text-slate-300">ছুটি: <strong className="font-bold">{item.offDay}</strong></div>
                    {item.bookingPhone && (
                      <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">ফোন: {item.bookingPhone}</div>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {item.fareList?.map((f, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-lg font-bold border border-pink-200/80/60 dark:border-slate-700">
                          {f.class}: <span className="text-emerald-700 dark:text-emerald-400">{f.fare}</span>
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openModal(item)}
                        className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
                        title="এডিট"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-colors"
                        title="ডিলিট"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredTransports.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500 font-bold">
                    কোনো যাতায়াত শিডিউল পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-pink-200/80 dark:border-slate-800 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-pink-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Ticket className="w-5 h-5 text-emerald-600" />
                <span>{editingTransport ? 'যাতায়াত শিডিউল সম্পাদনা করুন' : 'নতুন যাতায়াত শিডিউল যোগ করুন'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">পরিবহনের ধরণ</label>
                <select
                  value={transType}
                  onChange={(e) => setTransType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-pink-200/80 dark:border-slate-700 text-xs font-bold dark:text-white"
                >
                  <option value="বাস">বাস</option>
                  <option value="ট্রেন">ট্রেন</option>
                  <option value="বিমান">বিমান</option>
                  <option value="কার রেন্ট">কার রেন্ট / মাইক্রোবাস</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">পরিবহনের নাম</label>
                  <input
                    type="text"
                    required
                    value={transName}
                    onChange={(e) => setTransName(e.target.value)}
                    placeholder="যেমন: নীলসাগর এক্সপ্রেস"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-pink-200/80 dark:border-slate-700 text-xs font-bold dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">কোড বা নম্বর (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={transCode}
                    onChange={(e) => setTransCode(e.target.value)}
                    placeholder="যেমন: ৭৬৫/৭৬৬"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-pink-200/80 dark:border-slate-700 text-xs font-bold dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">রুট বিবরণ</label>
                <input
                  type="text"
                  required
                  value={transRoute}
                  onChange={(e) => setTransRoute(e.target.value)}
                  placeholder="যেমন: চিলাহাটি ⇄ কুষ্টিয়া ⇄ ঢাকা"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-pink-200/80 dark:border-slate-700 text-xs font-bold dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">সময় / ছাড়ার সময়</label>
                  <input
                    type="text"
                    required
                    value={transDeparture}
                    onChange={(e) => setTransDeparture(e.target.value)}
                    placeholder="কুষ্টিয়া ছাড়ার সময়: রাত ০৯:৪০"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-pink-200/80 dark:border-slate-700 text-xs font-bold dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">পৌঁছানোর সময় / বিবরণ</label>
                  <input
                    type="text"
                    value={transArrival}
                    onChange={(e) => setTransArrival(e.target.value)}
                    placeholder="ঢাকা পৌঁছার সময়: সকাল ০৫:৩০"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-pink-200/80 dark:border-slate-700 text-xs font-bold dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">সাপ্তাহিক ছুটি বা বন্ধ</label>
                  <input
                    type="text"
                    value={transOffDay}
                    onChange={(e) => setTransOffDay(e.target.value)}
                    placeholder="যেমন: সোমবার"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-pink-200/80 dark:border-slate-700 text-xs font-bold dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">বুকিং বা হেল্পলাইন নম্বর</label>
                  <input
                    type="text"
                    value={transPhone}
                    onChange={(e) => setTransPhone(e.target.value)}
                    placeholder="যেমন: 01712000000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-pink-200/80 dark:border-slate-700 text-xs font-bold dark:text-white"
                  />
                </div>
              </div>

              {/* Fare List Builder */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">ভাড়া তালিকা যোগ করুন</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={fareClassName}
                    onChange={(e) => setFareClassName(e.target.value)}
                    placeholder="ক্লাস (যেমন: শোভন চেয়ার)"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-pink-200/80 dark:border-slate-700 text-xs font-bold dark:text-white"
                  />
                  <input
                    type="text"
                    value={fareAmount}
                    onChange={(e) => setFareAmount(e.target.value)}
                    placeholder="ভাড়া (যেমন: ৫৫০ ৳)"
                    className="w-28 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-pink-200/80 dark:border-slate-700 text-xs font-bold dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={addFareItem}
                    className="px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black shrink-0 hover:bg-emerald-700"
                  >
                    যোগ
                  </button>
                </div>

                <div className="space-y-1.5">
                  {fareList.map((f, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold">
                      <span>{f.class}: <strong className="text-emerald-700">{f.fare}</strong></span>
                      <button
                        type="button"
                        onClick={() => removeFareItem(i)}
                        className="text-rose-500 hover:text-rose-700 text-[10px] font-bold"
                      >
                        রিমুভ
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-pink-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/20 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
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
