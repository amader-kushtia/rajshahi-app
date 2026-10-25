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
  Table as TableIcon,
  RefreshCw
} from 'lucide-react';
import { TransportSchedule } from '../../types';
import { 
  getManagedTransport, 
  saveTransport, 
  deleteTransport, 
  subscribeToTransport,
  deleteAllTransportsBatch,
  restoreDefaultTransports 
} from '../../services/adminFeaturesService';

export const AdminSchedulesTab: React.FC = () => {
  const [transports, setTransports] = useState<TransportSchedule[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('সব');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransport, setEditingTransport] = useState<TransportSchedule | null>(null);
  const [transportToDelete, setTransportToDelete] = useState<TransportSchedule | null>(null);

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
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const refreshData = async () => {
    const data = await getManagedTransport();
    setTransports(data);
  };

  useEffect(() => {
    // 1. Initial load
    refreshData();

    // 2. Real-time subscriber
    const unsub = subscribeToTransport((data) => {
      setTransports(data);
    });

    // 3. Global DOM event listener for cross-tab reactivity
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
      setFareList(
        item.fareList && item.fareList.length > 0 
          ? JSON.parse(JSON.stringify(item.fareList))
          : [{ class: 'সাধারণ', fare: '৫০০ ৳' }]
      );
      setFareClassName('');
      setFareAmount('');
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
        { class: 'সাধারণ', fare: '৫০০ ৳' },
        { class: 'এসি', fare: '১২০০ ৳' }
      ]);
      setFareClassName('');
      setFareAmount('');
    }
    setIsModalOpen(true);
  };

  const updateFareItemClass = (idx: number, newClass: string) => {
    setFareList(prev => prev.map((item, i) => i === idx ? { ...item, class: newClass } : item));
  };

  const updateFareItemAmount = (idx: number, newFare: string) => {
    setFareList(prev => prev.map((item, i) => i === idx ? { ...item, fare: newFare } : item));
  };

  const addNewEmptyFareRow = () => {
    setFareList(prev => [...prev, { class: 'নতুন শ্রেণি', fare: '৫০০ ৳' }]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transName.trim() || !transRoute.trim()) {
      alert('দয়া করে পরিববহনের নাম ও রুট পূরণ করুন।');
      return;
    }

    try {
      setIsSaving(true);
      
      // Ensure fareList has at least one valid entry and sanitize amounts
      let finalFares = fareList.filter(f => f.class.trim() || f.fare.trim()).map(f => ({
        class: f.class.trim() || 'সাধারণ',
        fare: f.fare.trim() ? (f.fare.includes('৳') ? f.fare.trim() : `${f.fare.trim()} ৳`) : '৫০০ ৳'
      }));

      // If user typed in temporary input without clicking add, include it as well
      if (fareAmount.trim()) {
        const cls = fareClassName.trim() || 'সাধারণ';
        const formattedFare = fareAmount.includes('৳') ? fareAmount.trim() : `${fareAmount.trim()} ৳`;
        const exists = finalFares.findIndex(f => f.class.toLowerCase() === cls.toLowerCase());
        if (exists >= 0) {
          finalFares[exists].fare = formattedFare;
        } else {
          finalFares.push({ class: cls, fare: formattedFare });
        }
      }

      if (finalFares.length === 0) {
        finalFares = [{ class: 'সাধারণ', fare: '৫০০ ৳' }];
      }

      const payload: Partial<TransportSchedule> = {
        id: editingTransport ? editingTransport.id : undefined,
        type: transType,
        name: transName.trim(),
        code: transCode.trim(),
        route: transRoute.trim(),
        departureTime: transDeparture.trim(),
        arrivalTime: transArrival.trim(),
        offDay: transOffDay.trim(),
        bookingPhone: transPhone.trim(),
        fareList: finalFares
      };
      
      // Save and update state optimistically with 0ms delay
      const updated = await saveTransport(payload);
      setTransports(prev => {
        const idx = prev.findIndex(t => t.id === updated.id);
        if (idx >= 0) {
          return [...prev.slice(0, idx), updated, ...prev.slice(idx + 1)];
        }
        return [updated, ...prev];
      });

      setIsModalOpen(false);
      setFeedback('যাতায়াত শিডিউল ও নতুন ভাড়া সফলভাবে সংরক্ষণ করা হয়েছে!');
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      console.error('Error saving transport:', err);
      alert('সংরক্ষণ করতে সমস্যা হয়েছে।');
    } finally {
      setIsSaving(false);
    }
  };


  const handleDelete = (item: TransportSchedule) => {
    setTransportToDelete(item);
  };

  const confirmDelete = async () => {
    if (!transportToDelete) return;
    try {
      setIsDeleting(true);
      const idToDelete = transportToDelete.id;
      
      // Delete and update local state immediately
      await deleteTransport(idToDelete);
      setTransports(prev => prev.filter(t => t.id !== idToDelete));
      
      setTransportToDelete(null);
      setFeedback('শিডিউল সফলভাবে মুছে ফেলা হয়েছে (আর ফিরে আসবে না)।');
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      console.error('Error deleting transport:', err);
      alert('ডিলিট করতে সমস্যা হয়েছে।');
    } finally {
      setIsDeleting(false);
      setTransportToDelete(null);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('আপনি কি নিশ্চিতভাবে এই তালিকার সবগুলা শিডিউল ডিলিট করতে চান? ডিলিট করলে এগুলো আর স্বয়ংক্রিয়ভাবে ফিরে আসবে না।')) {
      return;
    }
    try {
      setIsDeleting(true);
      await deleteAllTransportsBatch();
      setTransports([]);
      setFeedback('সবগুলা যাতায়াত শিডিউল স্থায়ীভাবে মুছে ফেলা হয়েছে।');
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      console.error('Error clearing all transports:', err);
      alert('সবগুলা ডিলিট করতে সমস্যা হয়েছে।');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestoreDefaults = async () => {
    if (!confirm('আপনি কি কুষ্টিয়ার ডিফল্ট ট্রেন ও বাসের সময়সূচী পুনরায় রিস্টোর করতে চান?')) {
      return;
    }
    try {
      const restored = await restoreDefaultTransports();
      setTransports(restored);
      setFeedback('ডিফল্ট শিডিউলসমূহ সফলভাবে রিস্টোর করা হয়েছে!');
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      console.error('Error restoring defaults:', err);
      alert('রিস্টোর করতে সমস্যা হয়েছে।');
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

        <div className="flex flex-wrap items-center gap-2">
          {transports.length > 0 && (
            <button
              onClick={handleClearAll}
              disabled={isDeleting}
              className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              title="এই ক্যাটাগরির সবগুলা শিডিউল একসঙ্গে ডিলিট করুন"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>সব মুছুন ({transports.length})</span>
            </button>
          )}

          <button
            onClick={handleRestoreDefaults}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="কুষ্টিয়ার ডিফল্ট শিডিউল রিস্টোর করুন"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
            <span>ডিফল্ট রিস্টোর</span>
          </button>

          <button
            onClick={() => openModal()}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-transform hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন শিডিউল যোগ করুন</span>
          </button>
        </div>
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
                        onClick={() => handleDelete(item)}
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

      {/* Delete Confirmation Modal */}
      {transportToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-pink-200/80 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900 dark:text-white">শিডিউলটি মুছে ফেলতে চান?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                আপনি কি নিশ্চিতভাবে <span className="font-bold text-slate-700 dark:text-slate-200">"{transportToDelete.name}"</span> শিডিউলটি ডিলিট করতে চান? এটি আর ফিরিয়ে আনা সম্ভব নয়।
              </p>
            </div>
            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={() => setTransportToDelete(null)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
              >
                বাতিল করুন
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-black shadow-md shadow-rose-600/20"
              >
                {isDeleting ? 'মুছে ফেলা হচ্ছে...' : 'হ্যাঁ, মুছে ফেলুন'}
              </button>
            </div>
          </div>
        </div>
      )}

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
                    placeholder="যেমন: সুন্দরবন এক্সপ্রেস"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-pink-200/80 dark:border-slate-700 text-xs font-bold dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">কোড বা নম্বর (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={transCode}
                    onChange={(e) => setTransCode(e.target.value)}
                    placeholder="যেমন: ৭২৫/৭২৬"
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
                  placeholder="যেমন: খুলনা ⇄ কুষ্টিয়া (পোড়াদহ) ⇄ ঢাকা"
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

              {/* Fare List - Directly Editable Rows */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      ভাড়া তালিকা (শ্রেণি ও টাকার পরিমাণ সরাসরি এডিট করুন)
                    </label>
                    <p className="text-[10px] text-slate-500">বক্সে সরাসরি ক্লিক করে টাকার পরিমাণ বা শ্রেণি পরিবর্তন করতে পারেন</p>
                  </div>
                  <button
                    type="button"
                    onClick={addNewEmptyFareRow}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ শ্রেণি যোগ করুন</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {fareList.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-pink-200/80 dark:border-slate-700">
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">শ্রেণি / সিটের ধরণ</label>
                        <input
                          type="text"
                          value={f.class}
                          onChange={(e) => updateFareItemClass(i, e.target.value)}
                          placeholder="যেমন: সাধারণ / শোভন চেয়ার"
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-pink-200/80 dark:border-slate-700 text-xs font-bold dark:text-white"
                        />
                      </div>
                      <div className="w-32 sm:w-36">
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">ভাড়া (টাকা)</label>
                        <input
                          type="text"
                          value={f.fare}
                          onChange={(e) => updateFareItemAmount(i, e.target.value)}
                          placeholder="যেমন: ৬০০ ৳"
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-xs font-black text-emerald-700 dark:text-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      {fareList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFareItem(i)}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors mt-3 shrink-0"
                          title="এই শ্রেণিটি বাদ দিন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
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
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
                >
                  {isSaving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
