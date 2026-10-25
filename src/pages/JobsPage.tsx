import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Phone, 
  Briefcase, 
  Calendar, 
  Clock, 
  Building2, 
  DollarSign, 
  Plus, 
  CheckCircle2, 
  Share2, 
  MessageCircle,
  FileText,
  Bookmark,
  Users,
  Facebook
} from 'lucide-react';
import { PostItem } from '../types';
import { subscribeToPosts } from '../services/postService';

interface JobsPageProps {
  onBack: () => void;
  onOpenCreatePost?: () => void;
}

const INITIAL_LOCAL_JOBS: PostItem[] = [
  {
    id: 'job-1',
    category: 'jobs',
    title: 'নিউ মার্কেটের শীর্ষ কাপড়ের শোরুমে অভিজ্ঞ সেলস এক্সিকিউটিভ আবশ্যক',
    description: 'গ্রাহকদের সাথে মার্জিত আচরণ ও সেলস হ্যান্ডেল করতে হবে। ন্যূনতম এসএসসি পাস। পূর্বে কাপড়ের দোকানে কাজের অভিজ্ঞতাসম্পন্ন প্রার্থীদের অগ্রাধিকার দেওয়া হবে।',
    price: '১২,০০০ - ১৫,০০০ ৳/মাস',
    location: 'নিউ মার্কেট ২য় তলা, কুষ্টিয়া',
    subcategory: 'সেলস ও শোরুম',
    contactPhone: '01712445566',
    whatsapp: '01712445566',
    authorName: 'আল-মদিনা ফ্যাশন হাউজ',
    createdAt: Date.now() - 1000 * 60 * 60 * 4,
    isVerified: true,
    featured: true,
    details: {
      companyName: 'আল-মদিনা ফ্যাশন হাউজ',
      jobType: 'ফুল-টাইম',
      jobSalary: '১২,০০০ - ১৫,০০০ ৳ (কমিশনসহ)',
      jobDeadline: '২৫ সেপ্টেম্বর ২০২৬'
    }
  },
  {
    id: 'job-2',
    category: 'jobs',
    title: 'আধুনিক অফসেট প্রেসে গ্রাফিক্স ডিজাইনার ও কম্পিউটার অপারেটর',
    description: 'Adobe Illustrator ও Photoshop-এ পোস্টার, রশিদ ও বিয়ের কার্ড ডিজাইনে পারদর্শী হতে হবে। দ্রুত টাইপিং ও ফাইল প্রসেসিং জানা বাধ্যতামূলক।',
    price: '১৪,০০০ - ১৮,০০০ ৳/মাস',
    location: 'শহীদ ডা. জিকরুল হক রোড, কুষ্টিয়া',
    subcategory: 'প্রেস ও প্রিন্টিং',
    contactPhone: '01733998877',
    whatsapp: '01733998877',
    authorName: 'কুষ্টিয়া ডিজিটাল প্রেস অ্যান্ড পাবলিকেশন',
    createdAt: Date.now() - 1000 * 60 * 60 * 18,
    isVerified: true,
    details: {
      companyName: 'কুষ্টিয়া ডিজিটাল প্রেস',
      jobType: 'ফুল-টাইম',
      jobSalary: '১৪,০০০ - ১৮,০০০ ৳',
      jobDeadline: '৩০ সেপ্টেম্বর ২০২৬'
    }
  },
  {
    id: 'job-3',
    category: 'jobs',
    title: 'কুষ্টিয়া সেন্ট্রাল ডায়াগনস্টিক সেন্টারে রিসেপশনিস্ট ও বিলিং সহকারী',
    description: 'হাসপাতালে রোগী ও দর্শনার্থীদের সিরিয়াল প্রদান, বিল প্রস্তুত ও ফোন কল রিসিভ করতে হবে। নারী প্রার্থীদের অগ্রাধিকার দেওয়া হবে। শিক্ষাগত যোগ্যতা: এইচএসসি।',
    price: '১০,৫০০ ৳/মাস',
    location: 'হাসপাতাল রোড, কুষ্টিয়া',
    subcategory: 'ডায়াগনস্টিক ও ক্লিনিক',
    contactPhone: '01755112233',
    whatsapp: '01755112233',
    authorName: 'কুষ্টিয়া সেন্ট্রাল ল্যাব অ্যান্ড ডায়াগনস্টিক',
    createdAt: Date.now() - 1000 * 60 * 60 * 30,
    isVerified: true,
    details: {
      companyName: 'সেন্ট্রাল ল্যাব',
      jobType: 'ফুল-টাইম',
      jobSalary: '১০,৫০০ ৳ + উৎসব বোনাস',
      jobDeadline: '২৮ সেপ্টেম্বর ২০২৬'
    }
  },
  {
    id: 'job-4',
    category: 'jobs',
    title: 'কিন্ডারগার্টেন স্কুলে প্রাথমিক শ্রেণির জন্য সহকারী শিক্ষিকা',
    description: 'প্লে থেকে ৩য় শ্রেণি পর্যন্ত শিশুসুলভ স্নেহে পাঠদানের মানসিকতা থাকতে হবে। বাংলা ও ইংরেজি বিষয়ে ভালো দক্ষতা কাম্য। মহিলা প্রার্থীদের আবেদন আহ্বান করা হচ্ছে।',
    price: '৮,০০০ ৳/মাস',
    location: 'হাউজিং এস্টেট, কুষ্টিয়া',
    subcategory: 'শিক্ষকতা ও কোচিং',
    contactPhone: '01788223344',
    whatsapp: '01788223344',
    authorName: 'লিটল স্টারস একাডেমি',
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    isVerified: false,
    details: {
      companyName: 'লিটল স্টারস একাডেমি',
      jobType: 'পার্ট-টাইম',
      jobSalary: '৮,০০০ ৳ (সকাল ৮টা - দুপুর ১টা)',
      jobDeadline: '০৫ অক্টোবর ২০২৬'
    }
  },
  {
    id: 'job-5',
    category: 'jobs',
    title: 'কুষ্টিয়া শহরের ভেতরে পার্সেল ও ফুড ডেলিভারি রাইডার আবশ্যক',
    description: 'নিজস্ব বাইসাইকেল বা মোটরসাইকেল থাকতে হবে। অ্যান্ড্রয়েড স্মার্টফোন ব্যবহারে পারদর্শী হতে হবে। কুষ্টিয়াের বিভিন্ন পাড়া-মহল্লা চেনা আবশ্যক। প্রতিদিনের আকর্ষণীয় কমিশন।',
    price: '১৫,০০০ - ১৮,০০০ ৳/মাস',
    location: 'শেরে বাংলা রোড, কুষ্টিয়া',
    subcategory: 'ডেলিভারি ও কুরিয়ার',
    contactPhone: '01799001122',
    whatsapp: '01799001122',
    authorName: 'কুষ্টিয়া ফাস্ট এক্সপ্রেস',
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
    isVerified: true,
    details: {
      companyName: 'কুষ্টিয়া ফাস্ট এক্সপ্রেস',
      jobType: 'ফুল-টাইম',
      jobSalary: '১৫,০০০ ৳ + পার্সেল প্রতি বোনাস',
      jobDeadline: 'চলমান নিয়োগ'
    }
  }
];

export const JobsPage: React.FC<JobsPageProps> = ({ onBack, onOpenCreatePost }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('সব চাকরি');
  const [selectedType, setSelectedType] = useState('সব ধরণ');
  const [jobs, setJobs] = useState<PostItem[]>(INITIAL_LOCAL_JOBS);

  const subcategories = [
    'সব চাকরি',
    'সেলস ও শোরুম',
    'প্রেস ও প্রিন্টিং',
    'ডায়াগনস্টিক ও ক্লিনিক',
    'শিক্ষকতা ও কোচিং',
    'ডেলিভারি ও কুরিয়ার',
    'অফিস সহকারী'
  ];

  const jobTypes = ['সব ধরণ', 'ফুল-টাইম', 'পার্ট-টাইম'];

  // Subscribe to real-time posts from Firestore for jobs category
  useEffect(() => {
    const unsub = subscribeToPosts((livePosts) => {
      const liveJobs = livePosts.filter(p => p.category === 'jobs');
      if (liveJobs.length > 0) {
        const combined = [...liveJobs];
        INITIAL_LOCAL_JOBS.forEach(init => {
          if (!combined.some(c => c.id === init.id)) {
            combined.push(init);
          }
        });
        setJobs(combined);
      }
    }, 'jobs');

    return () => unsub();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.details?.companyName || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSub = 
      selectedSubcategory === 'সব চাকরি' || job.subcategory === selectedSubcategory;

    const matchesType = 
      selectedType === 'সব ধরণ' || job.details?.jobType === selectedType;

    return matchesSearch && matchesSub && matchesType;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-4 border border-pink-200/80/80 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 transition-colors flex items-center gap-1"
              title="পূর্ববর্তী পেজে ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">ফিরে যান</span>
            </button>
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-1.5">
                <Briefcase className="w-5 h-5 text-indigo-700" />
                <span>চাকরি ও স্থানীয় নিয়োগ বিজ্ঞপ্তি</span>
              </h2>
              <p className="text-xs text-slate-500">কুষ্টিয়াের দোকান, প্রেস, শোরুম, ডায়াগনস্টিক ও স্থানীয় প্রতিষ্ঠানের চাকরি</p>
            </div>
          </div>

          {onOpenCreatePost && (
            <button
              onClick={onOpenCreatePost}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-sm shadow-indigo-950/10 transition-all active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>নিয়োগ পোস্ট দিন</span>
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-2.5">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="পদবী, প্রতিষ্ঠান বা এলাকা লিখে খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-pink-200/80 text-xs font-medium focus:outline-none focus:border-indigo-600"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs mb-2">
          {subcategories.map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubcategory(sub)}
              className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedSubcategory === sub
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Job Type Toggle */}
        <div className="flex items-center gap-2 pt-1 border-t border-pink-100 text-[11px]">
          <span className="text-slate-500 font-medium">কাজের ধরন:</span>
          {jobTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2.5 py-0.5 rounded-md font-bold transition-all ${
                selectedType === type
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* JOBS LIST */}
      <div className="space-y-3">
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-pink-200/80 text-center">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">কোনো চাকরি পাওয়া যায়নি</p>
            <p className="text-xs text-slate-500 mt-1">অন্য কোনো পদবী অনুসন্ধান করুন বা ফিল্টার পরিবর্তন করুন।</p>
          </div>
        ) : (
          filteredJobs.map(job => (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-4 border border-pink-200/80/90 shadow-xs hover:border-indigo-300 transition-all group"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {job.details?.jobType || 'ফুল-টাইম'}
                    </span>
                    {job.subcategory && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {job.subcategory}
                      </span>
                    )}
                    {job.isVerified && (
                      <span className="flex items-center gap-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        যাচাইকৃত
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-indigo-800 transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-600 mt-1 flex-wrap">
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                      {job.details?.companyName || job.authorName}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {job.location}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl block border border-emerald-100">
                    {job.details?.jobSalary || job.price || 'আলোচনা সাপেক্ষে'}
                  </span>
                  {job.details?.jobDeadline && (
                    <span className="text-[10px] text-slate-400 block mt-1">
                      মেয়াদ: {job.details.jobDeadline}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-2">
                {job.description}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-pink-100">
                <span className="text-[11px] text-slate-400">
                  সরাসরি প্রতিষ্ঠানে কল করে সিভি বা আগ্রহ জানান
                </span>

                <div className="flex items-center gap-2">
                  {job.whatsapp && (
                    <a
                      href={`https://wa.me/88${job.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমি আমার কুষ্টিয়া অ্যাপে "${job.title}" নিয়োগ বিজ্ঞপ্তি দেখে যোগাযোগ করছি।`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors font-bold text-xs flex items-center gap-1"
                      title="হোয়াটসঅ্যাপে সিভি পাঠান"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">সিভি পাঠান</span>
                    </a>
                  )}

                  {job.facebook && (
                    <a
                      href={job.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] rounded-xl transition-colors font-bold text-xs flex items-center gap-1"
                      title="ফেসবুক প্রোফাইল বা পেজ"
                    >
                      <Facebook className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <a
                    href={`tel:${job.contactPhone}`}
                    className="flex items-center gap-1.5 px-3 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>কল: {job.contactPhone}</span>
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
