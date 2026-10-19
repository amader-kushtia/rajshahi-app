import React, { useState } from 'react';
import { 
  ArrowLeft, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Phone, 
  MessageCircle, 
  Mail, 
  ShieldAlert, 
  HeartHandshake, 
  Send, 
  CheckCircle2, 
  ExternalLink,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { DEVELOPER_INFO } from '../data/initialData';
import { useAuth } from '../context/AuthContext';
import { getAppThemeConfig } from '../services/adminService';

interface HelpSupportPageProps {
  onBack: () => void;
  onNavigateToEmergency: () => void;
}

export const HelpSupportPage: React.FC<HelpSupportPageProps> = ({
  onBack,
  onNavigateToEmergency,
}) => {
  const [appTheme, setAppTheme] = useState(() => getAppThemeConfig());
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [userQuery, setUserQuery] = useState('');
  const [userContact, setUserContact] = useState('');
  const [queryCategory, setQueryCategory] = useState('সাধারণ জিজ্ঞাসা');
  const [submitted, setSubmitted] = useState(false);

  // Sync real-time config updates from Admin
  React.useEffect(() => {
    const handleConfigUpdate = (e: any) => {
      if (e.detail) setAppTheme(e.detail);
      else setAppTheme(getAppThemeConfig());
    };
    window.addEventListener('kushtia-app-config-updated', handleConfigUpdate);
    return () => window.removeEventListener('kushtia-app-config-updated', handleConfigUpdate);
  }, []);

  const faqs = [
    {
      q: 'আমার কুষ্টিয়াে কীভাবে বাসা ভাড়া বা মেসের বিজ্ঞাপন পোস্ট করব?',
      a: 'অ্যাপের নিচে থাকা "+" (প্লাস) বাটনে অথবা সংশ্লিষ্ট ক্যাটাগরি পেজে গিয়ে "+ পোস্ট করুন" বাটনে ক্লিক করুন। এরপর বাসার বিবরণ, রুম ও বাথরুম সংখ্যা, এলাকা (যেমন: নতুন বাবুপাড়া, হাতিখানা), মাসিক ভাড়া এবং যোগাযোগের মোবাইল নম্বর দিয়ে পোস্ট নিশ্চিত করুন।'
    },
    {
      q: 'ডাক্তার অ্যাপয়েন্টমেন্ট বা রক্তের প্রয়োজন হলে কীভাবে যোগাযোগ করব?',
      a: '"ডাক্তার ও স্বাস্থ্য" বা "জরুরি রক্তদাতা" সেকশনে যান। সেখানে বিশেষজ্ঞ ডাক্তারদের চেম্বারের সময়সূচী এবং সিরিয়ালের সরাসরি ফোন নম্বর দেওয়া আছে। রক্তদাতাদের তালিকা থেকে নির্দিষ্ট ব্লাড গ্রুপের ডোনারের সাথে সরাসরি কল বা হোয়াটসঅ্যাপে কথা বলতে পারবেন।'
    },
    {
      q: 'পরিচয় গোপন রেখে কি অপরাধ বা দুর্নীতির তথ্য জানানো সম্ভব?',
      a: 'হ্যাঁ, "পরিচয় গোপন মোড (Anonymous Reporter)" ব্যবহার করে কোনো প্রকার ব্যক্তিগত পরিচয় বা মোবাইল নম্বর প্রকাশ ছাড়াই অপরাধ, চাঁদাবাজি বা অবৈধ কার্যক্রমের তথ্য কুষ্টিয়াবাসী ও প্রশাসনের দৃষ্টিগোচর করতে পারেন।'
    },
    {
      q: 'কোনো বিজ্ঞাপন বা পোস্টে ভুল তথ্য বা প্রতারক দেখলে কী করব?',
      a: 'অনতিবিলম্বে আমাদের এডমিন হেল্পলাইনে যোগাযোগ করুন অথবা নিচে দেওয়া সাপোর্ট ফর্মে পোস্টের বিস্তারিত লিখে জমা দিন। এডমিন ভেরিফাই করে দ্রুত ব্যবস্থা গ্রহণ করবেন।'
    },
    {
      q: 'আমার কুষ্টিয়া ব্যবহারের জন্য কি কোনো ফি বা চার্জ দিতে হয়?',
      a: 'না, "আমার কুষ্টিয়া" সম্পূর্ণ অলাভজনক ও জনকল্যাণমূলক উদ্যোগ। সাধারণ নাগরিক, শিক্ষার্থী এবং ক্ষুদ্র ব্যবসায়ীদের জন্য সেবাগুলো সম্পূর্ণ বিনামূল্যে উন্মুক্ত।'
    }
  ];

  const { user } = useAuth();

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      window.dispatchEvent(new CustomEvent('require-auth'));
      return;
    }
    if (!userQuery.trim()) return;

    const message = encodeURIComponent(
      `[আমার কুষ্টিয়া - হেল্পডেস্ক অনুসন্ধান]\nবিষয়: ${queryCategory}\nযোগাযোগ: ${userContact || 'অনুরোধকারী'}\nসমস্যা: ${userQuery}`
    );
    const cleanSupport = (appTheme.supportPhone || '').replace(/[^0-9]/g, '');
    const targetPhone = appTheme.isSupportActive !== false && cleanSupport 
      ? `88${cleanSupport}` 
      : '8801700000000';
    window.open(`https://wa.me/${targetPhone}?text=${message}`, '_blank');
    setSubmitted(true);
    setTimeout(() => {
      setUserQuery('');
      setUserContact('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 border border-pink-200/80/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 transition-colors"
            title="ফিরে যান"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="w-5 h-5 text-emerald-700" />
              <span>সাহায্য ও সাপোর্ট সেন্টার</span>
            </h2>
            <p className="text-xs text-slate-500">আমার কুষ্টিয়া ব্যবহারে যেকোনো সহায়তা ও তথ্য</p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          ২৪/৭ হেল্পডেস্ক
        </span>
      </div>

      {/* Quick Emergency Banner */}
      <div className="bg-gradient-to-r from-rose-900 to-rose-700 text-white rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold">জরুরি নাগরিক সেবা খুঁজছেন?</h4>
            <p className="text-xs text-rose-100">থানা, ফায়ার সার্ভিস, সরকারি হাসপাতাল বা বিদ্যুৎ কেন্দ্রের নম্বর</p>
          </div>
        </div>
        <button
          onClick={onNavigateToEmergency}
          className="px-3.5 py-2 bg-white text-rose-800 rounded-xl text-xs font-bold shrink-0 hover:bg-rose-50 transition-colors shadow-xs"
        >
          জরুরি ডিরেক্টরি দেখুন
        </button>
      </div>

      {/* 24/7 Admin Direct Contact Helpline */}
      {appTheme.isSupportActive !== false && (
        <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-emerald-700" />
            <span>সরাসরি এডমিন ও সাপোর্ট হেল্পলাইন</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* WhatsApp Support (when active) */}
            {appTheme.isWhatsAppSupportActive !== false && appTheme.supportPhone && (
              <button
                onClick={() => window.open(`https://wa.me/${appTheme.supportPhone}`, '_blank')}
                className="w-full text-left p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50/90 via-teal-50/40 to-white border border-emerald-200/90 hover:border-emerald-400 hover:shadow-md transition-all flex items-center justify-between group active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm shadow-[#25D366]/30 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-slate-900 block truncate group-hover:text-emerald-800 transition-colors">
                      {appTheme.supportLabel || 'হোয়াটসঅ্যাপ সাপোর্ট'}
                    </span>
                    <span className="text-[11px] text-emerald-800 font-extrabold block truncate">
                      সরাসরি হোয়াটসঅ্যাপ মেসেজ (নিরাপদ চ্যাট)
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-black text-emerald-700 bg-white px-2.5 py-1 rounded-xl border border-emerald-200 shrink-0 group-hover:bg-[#25D366] group-hover:text-white transition-colors shadow-2xs">
                  চ্যাট ↗
                </span>
              </button>
            )}

            {/* Facebook Page/Profile Support (when active) */}
            {appTheme.isFacebookSupportActive && appTheme.supportFacebookUrl && (
              <a
                href={appTheme.supportFacebookUrl.startsWith('http') ? appTheme.supportFacebookUrl : `https://facebook.com/${appTheme.supportFacebookUrl.replace(/^@/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-left p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/90 via-indigo-50/40 to-white border border-blue-200/90 hover:border-blue-400 hover:shadow-md transition-all flex items-center justify-between group active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-sm shadow-[#1877F2]/30 group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-slate-900 block truncate group-hover:text-blue-800 transition-colors">
                      {appTheme.supportFacebookLabel || 'অফিসিয়াল ফেসবুক পেজ / আইডি'}
                    </span>
                    <span className="text-[11px] text-blue-700 font-extrabold block truncate">
                      সরাসরি ফেসবুকে মেসেজ দিন বা পেজ ভিজিট করুন
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-black text-blue-700 bg-white px-2.5 py-1 rounded-xl border border-blue-200 shrink-0 group-hover:bg-[#1877F2] group-hover:text-white transition-colors shadow-2xs">
                  ভিজিট ↗
                </span>
              </a>
            )}

            <a
              href={`tel:${appTheme.supportPhone || '01700000000'}`}
              className="p-3.5 rounded-2xl bg-slate-50 border border-pink-100 hover:bg-slate-100 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">জরুরি হেল্পলাইন কল</span>
                  <span className="text-[11px] text-slate-600 font-bold">{appTheme.supportPhone || '01700000000'}</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500" />
            </a>

            <a
              href="mailto:support@kushtiaconnect.com"
              className="p-3.5 rounded-2xl bg-slate-50 border border-pink-100 hover:bg-slate-100 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">অফিসিয়াল সাপোর্ট ইমেইল</span>
                  <span className="text-[11px] text-slate-600 font-bold">support@kushtiaconnect.com</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500" />
            </a>
          </div>
        </div>
      )}

      {/* Frequently Asked Questions (FAQ) */}
      <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-700" />
          <span>সাধারণ প্রশ্নোত্তর (FAQ)</span>
        </h3>

        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border border-pink-200/80/80 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full text-left p-3.5 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between gap-3 transition-colors"
                >
                  <span className="text-xs font-bold text-slate-800 leading-snug">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-3.5 bg-white text-xs text-slate-600 leading-relaxed border-t border-pink-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Support Query Ticket Form */}
      <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Send className="w-4 h-4 text-emerald-700" />
          <span>সাপোর্ট টিমের কাছে প্রশ্ন বা অভিযোগ জমা দিন</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          আপনার সমস্যার বিবরণ দিলে সরাসরি সাপোর্ট হেল্পডেস্কে পাঠিয়ে সমাধান নিশ্চিত করা হবে।
        </p>

        {submitted ? (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
            <h4 className="text-sm font-bold text-emerald-900">আপনার প্রশ্নটি গ্রহণ করা হয়েছে!</h4>
            <p className="text-xs text-emerald-700 mt-0.5">আমরা অতি দ্রুত আপনার সাথে যোগাযোগ করব।</p>
          </div>
        ) : (
          <form onSubmit={handleSupportSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">জিজ্ঞাসার ধরন</label>
                <select
                  value={queryCategory}
                  onChange={e => setQueryCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-pink-200/80 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="সাধারণ জিজ্ঞাসা">সাধারণ জিজ্ঞাসা</option>
                  <option value="পোস্ট সম্পর্কিত সমস্যা">পোস্ট সম্পর্কিত সমস্যা</option>
                  <option value="ভুয়া পোস্টের অভিযোগ">ভুয়া পোস্টের অভিযোগ</option>
                  <option value="প্রযুক্তিগত ত্রুটি">প্রযুক্তিগত ত্রুটি (Bug Report)</option>
                  <option value="অন্যান্য">অন্যান্য</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">আপনার নাম বা ফোন নম্বর</label>
                <input
                  type="text"
                  placeholder="যেমন: ০১৭১২-xxxxxx"
                  value={userContact}
                  onChange={e => setUserContact(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-pink-200/80 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">সমস্যার বিবরণ</label>
              <textarea
                rows={3}
                placeholder="সমস্যা বা সাহায্যের বিস্তারিত লিখুন..."
                required
                value={userQuery}
                onChange={e => setUserQuery(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200/80 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>সহায়তার আবেদন পাঠান</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
