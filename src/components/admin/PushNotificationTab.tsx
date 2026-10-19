import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Send, 
  CheckCircle2, 
  Volume2, 
  BarChart2, 
  Users, 
  Eye, 
  TrendingUp, 
  Clock, 
  CheckCheck, 
  Radio, 
  Trash2,
  RefreshCw,
  Info
} from 'lucide-react';
import { 
  publishEmergencyBroadcast, 
  playEmergencyChime, 
  getRealSubscriberCount, 
  deleteEmergencyBroadcast 
} from '../../utils/pushNotification';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

export interface BroadcastItem {
  id: string;
  title: string;
  body: string;
  type: string;
  createdAt: number;
  deliveredCount?: number;
  openedCount?: number;
  sender?: string;
}

export const PushNotificationTab: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'info' | 'emergency' | 'blood' | 'electricity' | 'weather'>('info');
  const [soundType, setSoundType] = useState('sound10');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [realSubscribers, setRealSubscribers] = useState<number>(1);
  const [broadcasts, setBroadcasts] = useState<BroadcastItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Clear any old fake mock logs from previous sessions
  useEffect(() => {
    try {
      localStorage.removeItem('kushtia_push_campaign_analytics_logs');
    } catch {}
  }, []);

  // Fetch real subscriber count
  const refreshSubscriberCount = async () => {
    try {
      const count = await getRealSubscriberCount();
      setRealSubscribers(count);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    refreshSubscriberCount();
  }, []);

  // Real-time Firestore listener for broadcasts
  useEffect(() => {
    try {
      const q = query(
        collection(db, 'emergency_broadcasts'),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items: BroadcastItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          items.push({
            id: docSnap.id,
            title: data.title || 'বিজ্ঞপ্তি',
            body: data.body || data.message || '',
            type: data.type || 'info',
            createdAt: data.createdAt || Date.now(),
            deliveredCount: data.deliveredCount !== undefined ? data.deliveredCount : 1,
            openedCount: data.openedCount || 0,
            sender: data.sender || 'Admin'
          });
        });
        setBroadcasts(items);
        setLoading(false);
      }, (err) => {
        console.warn('Firestore broadcasts listener notice:', err);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn('Could not bind broadcast listener:', e);
      setLoading(false);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handlePlayPreview = () => {
    playEmergencyChime('info', soundType);
  };

  const handleSendPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setIsSending(true);

    const result = await publishEmergencyBroadcast({
      title: title.trim(),
      body: message.trim(),
      type: type,
      soundType: soundType,
      actionUrl: '/',
      tag: `custom-push-${Date.now()}`
    });

    setIsSending(false);

    if (result.success) {
      showToast(`সফলভাবে নোটিফিকেশন পাঠানো হয়েছে (${result.deliveredCount} জন সক্রিয় ডিভাইসে)!`);
      setTitle('');
      setMessage('');
      refreshSubscriberCount();
    } else {
      showToast('নোটিফিকেশন পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  const handleDelete = async (broadcastId: string, broadcastTitle: string) => {
    if (!window.confirm(`আপনি কি "${broadcastTitle}" নোটিফিকেশনটি মুছে ফেলতে চান?`)) {
      return;
    }

    const success = await deleteEmergencyBroadcast(broadcastId);
    if (success) {
      showToast('নোটিফিকেশন সফলভাবে মুছে ফেলা হয়েছে');
    } else {
      showToast('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  const totalSentCount = broadcasts.length;
  const totalDelivered = broadcasts.reduce((acc, c) => acc + (c.deliveredCount ?? realSubscribers), 0);
  const totalOpened = broadcasts.reduce((acc, c) => acc + (c.openedCount ?? 0), 0);
  const overallOpenRate = totalDelivered > 0 ? ((totalOpened / totalDelivered) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-500/30 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 border border-blue-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-black tracking-wider uppercase mb-1">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>পুশ নোটিফিকেশন ও ব্রডকাস্ট কন্ট্রোল</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            লাইভ জরুরি ব্রডকাস্ট ও নাগরিক রিচ
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            নোটিফিকেশন শুধুমাত্র সক্রিয় এবং নিবন্ধিত ডিভাইসে পৌঁছাবে। কোনো ভুল বা অনুমাননির্ভর ডেটা নেই।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshSubscriberCount}
            className="flex items-center gap-1.5 bg-blue-900/50 hover:bg-blue-800/60 border border-blue-500/40 px-3.5 py-2 rounded-2xl text-xs font-bold text-blue-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>রিফ্রেশ</span>
          </button>
          <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/40 px-3.5 py-2 rounded-2xl shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-300">সক্রিয় ডিভাইস: {realSubscribers} জন</span>
          </div>
        </div>
      </div>

      {/* Accurate Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="p-2.5 bg-blue-50 text-blue-700 rounded-2xl">
              <Send className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              মোট পাঠানো
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalSentCount}টি</div>
            <div className="text-xs font-bold text-slate-500 mt-0.5">প্রচারিত ব্রডকাস্ট</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl">
              <Users className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              আসল রিচ (Delivered)
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{realSubscribers} জন</div>
            <div className="text-xs font-bold text-slate-500 mt-0.5">বর্তমান সক্রিয় গ্রাহক</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="p-2.5 bg-indigo-50 text-indigo-700 rounded-2xl">
              <Eye className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              ওপেন হয়েছে (Opened)
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalOpened} জন</div>
            <div className="text-xs font-bold text-slate-500 mt-0.5">বিজ্ঞপ্তি খুলে দেখেছেন</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="p-2.5 bg-amber-50 text-amber-700 rounded-2xl">
              <TrendingUp className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              ওপেন রেট
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{overallOpenRate}%</div>
            <div className="text-xs font-bold text-slate-500 mt-0.5">প্রকৃত এনগেজমেন্ট রেট</div>
          </div>
        </div>
      </div>

      {/* Send Notification Form */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-200/80/80 shadow-xs space-y-4">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-600" />
          <span>নতুন পুশ নোটিফিকেশন পাঠান</span>
        </h3>

        <form onSubmit={handleSendPush} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                নোটিফিকেশনের ধরন *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="info">সাধারণ তথ্য (Info)</option>
                <option value="emergency">জরুরি সতর্কতা (Emergency)</option>
                <option value="blood">রক্তের ডাক (Blood)</option>
                <option value="electricity">বিদ্যুৎ বিজ্ঞপ্তি (Electricity)</option>
                <option value="weather">আবহাওয়া সতর্কতা (Weather)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>নোটিফিকেশন সাউন্ড *</span>
                <button 
                  type="button" 
                  onClick={handlePlayPreview}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-[10px]"
                >
                  <Volume2 className="w-3 h-3" /> শুনুন
                </button>
              </label>
              <select
                value={soundType}
                onChange={(e) => setSoundType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="sound1">১. সফট বেল (Soft Bell)</option>
                <option value="sound2">২. সুইট রিং (Sweet Ring)</option>
                <option value="sound3">৩. অ্যালার্ট টোন (Alert Tone)</option>
                <option value="sound4">৪. ডাবল চাইম (Double Chime)</option>
                <option value="sound5">৫. ম্যাজিক ডাস্ট (Magic Dust)</option>
                <option value="sound6">৬. সাকসেস পপ (Success Pop)</option>
                <option value="sound7">৭. জরুরি সাইরেন (Urgent Siren)</option>
                <option value="sound8">৮. ডিপ ইকো (Deep Echo)</option>
                <option value="sound9">৯. ম্যারিম্বা (Marimba)</option>
                <option value="sound10">১০. সিম্পল পিং (Simple Ping)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              নোটিফিকেশন শিরোনাম *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="যেমন: নতুন আপডেট এসেছে!"
              className="w-full px-3.5 py-2.5 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              বিস্তারিত বার্তা *
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="বিস্তারিত লিখুন..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          <div className="pt-2 border-t border-pink-100 flex justify-end">
            <button
              type="submit"
              disabled={isSending}
              className={`px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all ${isSending ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? 'পাঠানো হচ্ছে...' : 'পুশ নোটিফিকেশন পাঠান'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Real Campaigns Delivery Report Table / List */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-200/80/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-blue-600" />
              <span>প্রকৃত ক্যাম্পেইন ডেলিভারি লগ (Real Delivery Log)</span>
            </h3>
            <p className="text-xs text-slate-500">আপনার পাঠানো নোটিফিকেশনের সঠিক ও লাইভ তালিকা</p>
          </div>
          <span className="text-xs font-bold text-slate-500">মোট {broadcasts.length}টি নোটিফিকেশন</span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400 font-bold">
            লোড হচ্ছে...
          </div>
        ) : broadcasts.length === 0 ? (
          <div className="py-10 text-center bg-slate-50 rounded-2xl border border-dashed border-pink-200/80 space-y-2">
            <Info className="w-6 h-6 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-600">এখনও কোনো নোটিফিকেশন পাঠানো হয়নি।</p>
            <p className="text-[11px] text-slate-400">উপরের ফর্ম ব্যবহার করে নোটিফিকেশন পাঠালে এখানে তার সঠিক রিচ দেখা যাবে।</p>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {broadcasts.map((camp) => {
              const delivered = camp.deliveredCount ?? realSubscribers;
              const opened = camp.openedCount ?? 0;
              const openRate = delivered > 0 ? ((opened / delivered) * 100).toFixed(1) : '0.0';
              const dateStr = new Date(camp.createdAt).toLocaleString('bn-BD', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div key={camp.id} className="p-4 rounded-2xl bg-slate-50 border border-pink-200/80/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase">
                          {camp.type}
                        </span>
                        <h4 className="text-xs font-black text-slate-900">{camp.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">{camp.body}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{dateStr}</span>
                      </div>
                      <button
                        onClick={() => handleDelete(camp.id, camp.title)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Delivery and Open Stats Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-pink-200/80/60 text-xs">
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-pink-200/80/60">
                      <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">পৌঁছেছে (Delivered)</span>
                        <span className="font-black text-slate-800">{delivered} জন</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-pink-200/80/60">
                      <Eye className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">ওপেন করেছে (Opened)</span>
                        <span className="font-black text-slate-800">{opened} জন</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-pink-200/80/60">
                      <CheckCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-0.5">
                          <span>ওপেন রেট</span>
                          <span className="text-indigo-600 font-black">{openRate}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-600 h-full rounded-full"
                            style={{ width: `${Math.min(Number(openRate), 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
