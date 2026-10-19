import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Phone, 
  Droplet, 
  Heart, 
  AlertCircle, 
  Plus, 
  Calendar, 
  Clock, 
  Building2, 
  Share2, 
  CheckCircle2,
  X,
  MessageCircle,
  Siren,
  Users,
  Facebook,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  Activity
} from 'lucide-react';

// Format timestamp to user-friendly Bengali relative time
const formatBanglaTimeAgo = (timestamp?: number): string => {
  if (!timestamp) return 'আজকে';
  const diffMinutes = Math.floor((Date.now() - timestamp) / (1000 * 60));
  if (diffMinutes < 1) return 'এইমাত্র';
  if (diffMinutes < 60) return `${diffMinutes} মিনিট আগে`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} ঘণ্টা আগে`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} দিন আগে`;
};
import { BLOOD_DONORS } from '../data/initialData';
import { PostItem } from '../types';
import { subscribeToPosts, createNewPost } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { useAdminConfig } from '../context/AdminConfigContext';

interface BloodBankPageProps {
  onBack: () => void;
  onOpenCreatePost?: () => void;
}

// Initial realistic emergency requests for Kushtia
const INITIAL_BLOOD_REQUESTS: PostItem[] = [
  {
    id: 'blood-req-1',
    category: 'blood-request',
    title: 'জরুরি B+ (বি পজিটিভ) রক্তের আবেদন',
    description: 'রোগীর সিজারিয়ান অপারেশনের জন্য জরুরি ভিত্তিতে ১ ব্যাগ বি পজিটিভ রক্তের প্রয়োজন। রক্তদাতার যাতায়াত ও সম্মানের ব্যবস্থা থাকবে।',
    location: 'কুষ্টিয়া ২৫০ শয্যা সরকারি হাসপাতাল',
    contactPhone: '01712554433',
    whatsapp: '01712554433',
    authorName: 'মো. রফিকুল ইসলাম (রোগীর ভাই)',
    createdAt: Date.now() - 1000 * 60 * 35, // 35 mins ago
    isVerified: true,
    details: {
      bloodGroup: 'B+',
      bloodBagsNeeded: '১ ব্যাগ',
      hospitalName: 'কুষ্টিয়া ২৫০ শয্যা জেনারেল হাসপাতাল, গাইনী ওয়ার্ড',
      patientProblem: 'সিজারিয়ান অপারেশন',
      bloodUrgency: 'জরুরি (আজই)'
    }
  },
  {
    id: 'blood-req-2',
    category: 'blood-request',
    title: 'থ্যালাসেমিয়া রোগীর জন্য O+ রক্ত প্রয়োজন',
    description: '৮ বছর বয়সী শিশুর নিয়মিত রক্ত পরিবর্তনের জন্য ও পজিটিভ রক্ত প্রয়োজন। একজন মানবিক রক্তদাতার আন্তরিক সহযোগিতা কামনা করছি।',
    location: 'রংপুর ডায়াবেটিক ও শিশু হাসপাতাল (সৈয়দপুর রোগী)',
    contactPhone: '01789112244',
    whatsapp: '01789112244',
    authorName: 'তানজিলা বেগম (রোগীর মা)',
    createdAt: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
    isVerified: true,
    details: {
      bloodGroup: 'O+',
      bloodBagsNeeded: '২ ব্যাগ',
      hospitalName: 'কুষ্টিয়া ডায়াবেটিস সমিতি ও হাসপাতাল',
      patientProblem: 'থ্যালাসেমিয়া চিকিৎসা',
      bloodUrgency: 'আগামীকাল'
    }
  }
];

export const BloodBankPage: React.FC<BloodBankPageProps> = ({ onBack }) => {
  const { user, isAdmin } = useAuth();
  const { themeConfig } = useAdminConfig();
  const bloodHotline = themeConfig.bloodHelplinePhone || themeConfig.supportPhone || '01711224455';
  const cleanBloodHotline = bloodHotline.replace(/[^0-9]/g, '');
  const [activeTab, setActiveTab] = useState<'requests' | 'donors'>('requests');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('সব রক্ত গ্রুপ');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real-time blood requests from Firestore
  const [bloodRequests, setBloodRequests] = useState<PostItem[]>(INITIAL_BLOOD_REQUESTS);
  
  // Emergency Request Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [reqBloodGroup, setReqBloodGroup] = useState('A+');
  const [bagsNeeded, setBagsNeeded] = useState('১ ব্যাগ');
  const [hospital, setHospital] = useState('কুষ্টিয়া ২৫০ শয্যা জেনারেল হাসপাতাল');
  const [problem, setProblem] = useState('সিজারিয়ান অপারেশন');
  const [urgency, setUrgency] = useState<'জরুরি (আজই)' | 'আগামীকাল' | 'নরমাল'>('জরুরি (আজই)');
  const [contactName, setContactName] = useState(user?.displayName || '');
  const [contactNumber, setContactNumber] = useState('');
  const [extraNotes, setExtraNotes] = useState('');

  const bloodGroups = ['সব রক্ত গ্রুপ', 'A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'];

  // Subscribe to real-time blood requests
  useEffect(() => {
    const unsub = subscribeToPosts((posts) => {
      const liveBloodRequests = posts.filter(
        p => p.category === 'blood-request' || (p.category === 'blood' && p.details?.bloodBagsNeeded)
      );
      if (liveBloodRequests.length > 0) {
        // Combine with initial requests without duplicates
        const combined = [...liveBloodRequests];
        INITIAL_BLOOD_REQUESTS.forEach(init => {
          if (!combined.some(c => c.id === init.id)) {
            combined.push(init);
          }
        });
        setBloodRequests(combined);
      }
    }, 'blood-request');

    return () => unsub();
  }, []);

  // Quick share / copy blood request helper
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleShareRequest = (req: PostItem) => {
    const bloodGroup = req.details?.bloodGroup || 'A+';
    const bags = req.details?.bloodBagsNeeded || '১ ব্যাগ';
    const hospital = req.details?.hospitalName || req.location || 'কুষ্টিয়া';
    const problem = req.details?.patientProblem || 'জরুরি প্রয়োজন';
    const urgency = req.details?.bloodUrgency || 'আজই';

    const shareText = `🚨 [জরুরি রক্তের আবেদন - সৈয়দপুর কানেক্ট]\n\n` +
      `🩸 রক্তের গ্রুপ: ${bloodGroup}\n` +
      `📦 প্রয়োজন: ${bags}\n` +
      `🏥 হাসপাতাল/স্থান: ${hospital}\n` +
      `🩺 রোগীর সমস্যা: ${problem}\n` +
      `⏰ কখন লাগবে: ${urgency}\n` +
      `👤 রোগীর স্বজন: ${req.authorName || 'উল্লেখ নেই'}\n` +
      `📞 মোবাইল নম্বর: ${req.contactPhone}\n` +
      `${req.description ? `📝 বিস্তারিত: ${req.description}\n` : ''}\n` +
      `দয়া করে রক্তদানে এগিয়ে আসুন বা পোস্টটি শেয়ার করুন।\n` +
      `— সৈয়দপুর কানেক্ট নাগরিক সেবা`;

    if (navigator.share) {
      navigator.share({
        title: req.title,
        text: shareText,
      }).catch(() => {
        navigator.clipboard?.writeText(shareText);
        setCopiedId(req.id);
        setTimeout(() => setCopiedId(null), 2500);
      });
    } else {
      navigator.clipboard?.writeText(shareText);
      setCopiedId(req.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  // For General Citizens: Send formatted details directly to Owner/Admin via WhatsApp
  const handleContactOwnerForBlood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactNumber.trim()) {
      alert('অনুগ্রহ করে যোগাযোগের একটি সক্রিয় মোবাইল নম্বর প্রদান করুন');
      return;
    }

    const message = `[আমার কুষ্টিয়া - জরুরি রক্তের আবেদন]\n` +
      `আসসালামু আলাইকুম এডমিন, রোগীর জরুরি রক্তের জন্য তথ্য পাঠালাম:\n\n` +
      `🩸 রক্তের গ্রুপ: ${reqBloodGroup}\n` +
      `📦 প্রয়োজনীয় পরিমাণ: ${bagsNeeded}\n` +
      `⏰ কখন লাগবে: ${urgency}\n` +
      `🏥 হাসপাতাল/স্থান: ${hospital}\n` +
      `👤 রোগীর নাম: ${patientName || 'উল্লেখ নেই'}\n` +
      `📋 সমস্যা/রোগ: ${problem || 'উল্লেখ নেই'}\n` +
      `📞 যোগাযোগকারী: ${contactName || 'স্বজন'}\n` +
      `📱 যোগাযোগের নম্বর: ${contactNumber}\n` +
      `${extraNotes ? `📝 অতিরিক্ত নোট: ${extraNotes}\n` : ''}\n` +
      `অনুগ্রহ করে তথ্যটি যাচাই করে দ্রুত অ্যাপে রক্ত চেয়ে পোস্ট ও অ্যালার্ট জারি করে দিন। ধন্যবাদ।`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/88${cleanBloodHotline}?text=${encoded}`, '_blank');
    setIsModalOpen(false);
  };

  // For Admin Only: Directly publishes blood post to Firestore
  const handleCreateEmergencyRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('ভুয়া আবেদন প্রতিরোধে সাধারণ ইউজার সরাসরি পোস্ট করতে পারবেন না। রক্ত লাগলে এডমিন হেল্পলাইনের সাথে যোগাযোগ করুন।');
      return;
    }
    if (!contactNumber.trim()) {
      alert('অনুগ্রহ করে যোগাযোগের মোবাইল নম্বর প্রদান করুন');
      return;
    }

    setSubmitting(true);
    try {
      const newPost: Omit<PostItem, 'id' | 'createdAt'> = {
        category: 'blood-request',
        title: `জরুরি ${reqBloodGroup} রক্তের আবেদন (${hospital})`,
        description: `${patientName ? `রোগী: ${patientName}। ` : ''}সমস্যা: ${problem}। প্রয়োজন: ${bagsNeeded}। স্থান: ${hospital}। ${extraNotes}`,
        location: hospital,
        contactPhone: contactNumber,
        whatsapp: contactNumber,
        authorName: contactName || 'এডমিন (আমার কুষ্টিয়া)',
        isVerified: true,
        details: {
          bloodGroup: reqBloodGroup,
          bloodBagsNeeded: bagsNeeded,
          hospitalName: hospital,
          patientProblem: problem,
          bloodUrgency: urgency
        }
      };

      await createNewPost(newPost);
      setIsModalOpen(false);
      // Reset form
      setPatientName('');
      setContactNumber('');
      setExtraNotes('');
      setActiveTab('requests');
      alert('রক্তের আবেদন সফলভাবে পোস্ট করা হয়েছে।');
    } catch (err) {
      console.error('Failed to post blood request', err);
      alert('পোস্ট করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRequests = bloodRequests.filter(req => {
    const groupMatch = selectedBloodGroup === 'সব রক্ত গ্রুপ' || req.details?.bloodGroup === selectedBloodGroup;
    const searchMatch = 
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.details?.hospitalName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.details?.patientProblem || '').toLowerCase().includes(searchQuery.toLowerCase());
    return groupMatch && searchMatch;
  });

  const filteredDonors = BLOOD_DONORS.filter(donor => {
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
              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-800 transition-colors flex items-center gap-1"
              title="পূর্ববর্তী পেজে ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">ফিরে যান</span>
            </button>
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-1.5">
                <Droplet className="w-5 h-5 text-rose-600 fill-rose-600" />
                <span>কুষ্টিয়া রক্তদাতা ও রিকোয়েস্ট</span>
              </h2>
              <p className="text-xs text-slate-500">জরুরি রক্তের লাইভ আবেদন ও নিবন্ধিত রক্তদাতাদের নেটওয়ার্ক</p>
            </div>
          </div>

          {isAdmin ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-rose-900/10 transition-all active:scale-95 animate-pulse"
            >
              <Siren className="w-4 h-4" />
              <span>জরুরি রক্ত পোস্ট (এডমিন)</span>
            </button>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-rose-900/10 transition-all active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>রক্ত লাগবে? Owner-কে জানান</span>
            </button>
          )}
        </div>

        {/* Emergency Banner */}
        <div className="p-3.5 bg-gradient-to-r from-rose-700 via-red-600 to-rose-800 rounded-2xl text-white shadow-xs mb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start md:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xs sm:text-sm font-black">রক্তের জরুরি প্রয়োজন? সরাসরি Owner-এর সাথে যোগাযোগ করুন</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">ভেরিফায়েড নিয়মাবলী</span>
              </div>
              <p className="text-[11px] sm:text-xs text-rose-100 mt-0.5">
                নিরাপত্তা ও প্রতারণা রোধে সাধারণ কেউ রক্ত চেয়ে নিজে থেকে পোস্ট করতে পারবে না। শুধুমাত্র এডমিন পোস্ট করতে পারবে। রক্ত লাগলে এডমিন হেল্পলাইনে জানালে অবিলম্বে ভেরিফাই করে লাইভ পোস্ট দেওয়া হবে।
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            <a
              href={`https://wa.me/88${cleanBloodHotline}?text=${encodeURIComponent('আসসালামু আলাইকুম এডমিন, আমার রোগীর জন্য জরুরি রক্ত প্রয়োজন।')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 bg-white text-rose-700 hover:bg-rose-50 text-xs font-black rounded-lg shadow-xs shrink-0 transition-all flex items-center gap-1"
            >
              {isAdmin ? '+ নতুন পোস্ট' : 'তথ্য পাঠান'}
            </button>
          </div>
        </div>

        {/* Tab Switcher: Emergency Requests vs Volunteer Donors */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-3">
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'requests'
                ? 'bg-white text-rose-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Siren className="w-4 h-4 text-rose-600" />
            <span>জরুরি রক্তের আবেদন ({filteredRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('donors')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'donors'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>স্বেচ্ছাসেবী রক্তদাতা ({filteredDonors.length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-2.5">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'requests'
                ? 'হাসপাতাল, রোগ বা এলাকা লিখে খুঁজুন...'
                : 'রক্তের গ্রুপ বা এলাকা অনুসন্ধান করুন...'
            }
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-pink-200/80 text-xs font-medium focus:outline-none focus:border-rose-600"
          />
        </div>

        {/* Blood Group Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
          {bloodGroups.map(bg => (
            <button
              key={bg}
              onClick={() => setSelectedBloodGroup(bg)}
              className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedBloodGroup === bg
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: EMERGENCY REQUESTS BOARD */}
      {activeTab === 'requests' && (
        <div className="space-y-3">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-pink-200/80 text-center">
              <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">এই মুহূর্তে কোনো রক্তের আবেদন পাওয়া যায়নি</p>
              <p className="text-xs text-slate-500 mt-1">আপনার বা পরিচিত কারো রক্ত লাগলে ওপরের "জরুরি রক্ত চান" বাটনে ক্লিক করুন।</p>
            </div>
          ) : (
            filteredRequests.map(req => {
              const urgency = req.details?.bloodUrgency || 'জরুরি (আজই)';
              const bloodGroup = req.details?.bloodGroup || 'A+';
              const bags = req.details?.bloodBagsNeeded || '১ ব্যাগ';
              const hospital = req.details?.hospitalName || req.location || 'কুষ্টিয়া';
              const problem = req.details?.patientProblem;
              const timeAgo = formatBanglaTimeAgo(req.createdAt);

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-rose-100 shadow-xs hover:shadow-md hover:border-rose-300 transition-all duration-200 relative overflow-hidden"
                >
                  {/* Top Header Bar: Urgency, Verification, and Time */}
                  <div className="flex items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-rose-50 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                        {urgency}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>ভেরিফায়েড আবেদন</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{timeAgo}</span>
                    </div>
                  </div>

                  {/* Main Section: Blood Group Emblem + Title + Parameters */}
                  <div className="flex flex-col sm:flex-row items-start gap-3.5 sm:gap-4">
                    {/* Blood Group Display Emblem */}
                    <div className="w-full sm:w-20 sm:h-24 rounded-2xl bg-gradient-to-br from-rose-600 via-red-600 to-rose-700 text-white flex sm:flex-col items-center justify-between sm:justify-center p-2.5 sm:p-2 shrink-0 shadow-md shadow-rose-900/15">
                      <div className="flex items-center sm:flex-col gap-1.5 sm:gap-0">
                        <span className="text-2xl sm:text-3xl font-black tracking-tight leading-none">{bloodGroup}</span>
                        <span className="text-[10px] font-extrabold text-rose-100 uppercase tracking-wide">রক্ত প্রয়োজন</span>
                      </div>
                      <span className="sm:mt-2 px-2.5 py-0.5 rounded-lg bg-black/25 text-white text-[11px] font-black flex items-center gap-1">
                        <Droplet className="w-3 h-3 text-rose-200 fill-current" />
                        <span>{bags}</span>
                      </span>
                    </div>

                    {/* Title & Structured Details */}
                    <div className="flex-1 w-full">
                      <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug tracking-tight">
                        {req.title}
                      </h3>

                      {/* Structured Info Badges */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2.5">
                        <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-pink-200/80/80 text-xs">
                          <Building2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] text-slate-400 block font-medium">হাসপাতাল / স্থান</span>
                            <span className="font-bold text-slate-900 break-words block leading-snug">{hospital}</span>
                          </div>
                        </div>

                        {problem ? (
                          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-pink-200/80/80 text-xs">
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] text-slate-400 block font-medium">রোগীর সমস্যা / কারণ</span>
                              <span className="font-bold text-slate-900 break-words block leading-snug">{problem}</span>
                            </div>
                          </div>
                        ) : req.location && req.location !== hospital ? (
                          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-pink-200/80/80 text-xs">
                            <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] text-slate-400 block font-medium">রোগীর অবস্থান / এলাকা</span>
                              <span className="font-bold text-slate-900 break-words block leading-snug">{req.location}</span>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Full Description & Instructions - Completely Untruncated & Premium */}
                  {req.description && (
                    <div className="mt-3.5 p-4 rounded-2xl bg-rose-50/80 border border-rose-200/90 text-slate-800">
                      <div className="flex items-center gap-1.5 text-rose-950 font-black text-xs mb-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>রক্তদানের সম্পূর্ণ বিবরণ ও জরুরি নির্দেশনা:</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed whitespace-pre-line break-words select-text">
                        {req.description}
                      </p>
                    </div>
                  )}

                  {/* Footer: Contact Person & Action Buttons */}
                  <div className="mt-4 pt-3.5 border-t border-pink-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="text-xs text-slate-600 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-black text-xs shrink-0">
                        {req.authorName ? req.authorName.charAt(0) : 'র'}
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">আবেদনকারী / রোগীর স্বজন:</span>
                        <span className="font-bold text-slate-900">{req.authorName || 'কুষ্টিয়া নাগরিক'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      {/* Share / Copy */}
                      <button
                        onClick={() => handleShareRequest(req)}
                        className="p-2.5 rounded-xl border border-pink-200/80 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        title="আবেদন শেয়ার বা কপি করুন"
                      >
                        {copiedId === req.id ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-700 text-xs font-bold">কপি হয়েছে!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-4 h-4 text-slate-500" />
                            <span className="text-xs">শেয়ার</span>
                          </>
                        )}
                      </button>

                      {/* WhatsApp Direct */}
                      {req.whatsapp && (
                        <a
                          href={`https://wa.me/88${req.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমি আমার কুষ্টিয়া অ্যাপে আপনার ${bloodGroup} রক্তের আবেদন (${hospital}) দেখে যোগাযোগ করছি।`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                          title="হোয়াটসঅ্যাপে যোগাযোগ করুন"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>WhatsApp</span>
                        </a>
                      )}

                      {/* Facebook */}
                      {req.facebook && (
                        <a
                          href={req.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] rounded-xl transition-colors font-bold text-xs flex items-center justify-center"
                          title="ফেসবুকে যোগাযোগ করুন"
                        >
                          <Facebook className="w-4 h-4" />
                        </a>
                      )}

                      {/* Direct Phone Call */}
                      <a
                        href={`tel:${req.contactPhone}`}
                        className="flex-1 sm:flex-initial py-2.5 px-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-xl text-xs font-black shadow-md shadow-rose-900/15 transition-all flex items-center justify-center gap-2"
                      >
                        <Phone className="w-4 h-4 animate-bounce" />
                        <span>কল করুন: {req.contactPhone}</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: VOLUNTEER BLOOD DONORS DIRECTORY */}
      {activeTab === 'donors' && (
        <div className="space-y-3">
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-xs text-emerald-900 font-medium">
            <Heart className="w-4 h-4 text-emerald-600 shrink-0 fill-current" />
            <span>কুষ্টিয়ায়র স্বেচ্ছাসেবী রক্তদাতাগণ নিঃস্বার্থভাবে রক্তদানে প্রস্তুত। সরাসরি কল করে যোগাযোগ করুন।</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredDonors.map(donor => (
              <div
                key={donor.id}
                className="bg-white rounded-2xl p-3.5 border border-pink-200/80/90 shadow-xs flex items-center justify-between gap-3 hover:border-emerald-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex flex-col items-center justify-center shrink-0 shadow-sm shadow-rose-900/10">
                    <span className="text-base font-black leading-none">{donor.bloodGroup}</span>
                    <span className="text-[9px] font-semibold text-rose-200 mt-0.5">রক্ত গ্রুপ</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      {donor.name}
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    </h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>{donor.location}</span>
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      দান করেছেন: <b className="text-slate-700">{donor.totalDonations} বার</b> ({donor.lastDonationDate || 'নিয়মিত'})
                    </span>
                  </div>
                </div>

                <a
                  href={`tel:${donor.phone}`}
                  className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold transition-colors shrink-0 flex items-center gap-1"
                  title="রক্তদাতাকে কল করুন"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-xs font-bold hidden sm:inline">কল</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUICK EMERGENCY BLOOD REQUEST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3.5 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 border border-pink-200/80 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-pink-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <Siren className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {isAdmin ? 'জরুরি রক্তের আবেদন প্রকাশ (এডমিন)' : 'রক্তের আবেদন — Owner এর সাথে যোগাযোগ'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isAdmin ? 'এডমিন হিসেবে সরাসরি লাইভ আবেদন প্রকাশ করুন' : 'রোগীর তথ্য দিন এবং Owner-কে অবহিত করুন'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Strict Citizen Notice (When user is not admin) */}
            {!isAdmin && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs mb-3.5 space-y-1.5">
                <div className="flex items-center gap-2 font-black text-amber-950">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>জরুরি রক্তের ভেরিফিকেশন নিয়মাবলী</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  রক্ত নিয়ে যে-কোনো প্রতারণা ও ভুয়া আবেদন প্রতিরোধে <strong>সাধারণ নাগরিক নিজে থেকে সরাসরি পোস্ট করতে পারবে না</strong>। শুধুমাত্র এডমিন পোস্ট করতে পারবে। রক্ত লাগলে অবশ্যই নিচের তথ্য পূরণ করে সরাসরি <strong>এডমিন হেল্পলাইনের সাথে যোগাযোগ</strong> করতে হবে।
                </p>
                <div className="pt-1.5 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700">জরুরি ব্লাড হেল্পলাইন:</span>
                  <span className="font-black text-rose-700">আমার কুষ্টিয়া ({bloodHotline})</span>
                </div>
              </div>
            )}

            <form onSubmit={isAdmin ? handleCreateEmergencyRequest : handleContactOwnerForBlood} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">রক্তের গ্রুপ *</label>
                  <select
                    value={reqBloodGroup}
                    onChange={(e) => setReqBloodGroup(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-pink-200/80 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-rose-600 text-xs"
                  >
                    {['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">কত ব্যাগ প্রয়োজন? *</label>
                  <select
                    value={bagsNeeded}
                    onChange={(e) => setBagsNeeded(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-pink-200/80 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-rose-600 text-xs"
                  >
                    <option value="১ ব্যাগ">১ ব্যাগ</option>
                    <option value="২ ব্যাগ">২ ব্যাগ</option>
                    <option value="৩ ব্যাগ">৩ ব্যাগ</option>
                    <option value="জরুরি ৪+ ব্যাগ">জরুরি ৪+ ব্যাগ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">জরুরিত্ব (কখন লাগবে?) *</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-pink-200/80 rounded-xl font-bold text-rose-700 focus:outline-none focus:border-rose-600 text-xs"
                  >
                    <option value="জরুরি (আজই)">জরুরি (আজই)</option>
                    <option value="আগামীকাল">আগামীকাল</option>
                    <option value="নরমাল">নরমাল / নির্দিষ্ট তারিখে</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">রোগীর সমস্যা / কারণ</label>
                  <input
                    type="text"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="যেমন: সিজারিয়ান, ডেঙ্গু, থ্যালাসেমিয়া"
                    className="w-full p-2.5 bg-slate-50 border border-pink-200/80 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-rose-600 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">হাসপাতাল / স্থান *</label>
                <input
                  type="text"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  placeholder="যেমন: কুষ্টিয়া ২৫০ শয্যা জেনারেল হাসপাতাল, ওয়ার্ড নং ৩"
                  className="w-full p-2.5 bg-slate-50 border border-pink-200/80 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-rose-600 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">রোগী / স্বজনের নাম</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="আপনার নাম"
                    className="w-full p-2.5 bg-slate-50 border border-pink-200/80 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-rose-600 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">যোগাযোগের মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full p-2.5 bg-slate-50 border border-pink-200/80 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-rose-600 text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">অতিরিক্ত নির্দেশনা (ঐচ্ছিক)</label>
                <textarea
                  rows={2}
                  value={extraNotes}
                  onChange={(e) => setExtraNotes(e.target.value)}
                  placeholder="যেমন: যাতায়াত খরচ দেওয়া হবে বা রক্তদাতার সাথে সরাসরি যোগাযোগ করতে হবে..."
                  className="w-full p-2.5 bg-slate-50 border border-pink-200/80 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-rose-600 text-xs resize-none"
                />
              </div>

              {/* Action Buttons */}
              {isAdmin ? (
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-2/3 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-900/10 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>পোস্ট হচ্ছে...</span>
                    ) : (
                      <>
                        <Siren className="w-4 h-4" />
                        <span>জরুরি আবেদন সরাসরি পোস্ট করুন</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-900/10 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>তথ্যসহ এডমিনকে WhatsApp করুন (জরুরি অনুমোদন)</span>
                  </button>

                  <div className="grid grid-cols-1 gap-2">
                    <a
                      href={`tel:${bloodHotline}`}
                      className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 text-center border border-rose-200"
                    >
                      <Phone className="w-3.5 h-3.5 text-rose-600" />
                      <span>ব্লাড হেল্পলাইনে সরাসরি কল করুন ({bloodHotline})</span>
                    </a>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
