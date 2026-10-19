import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  Save, 
  Eye, 
  EyeOff, 
  MessageCircle, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  Globe,
  Check,
  X,
  AlertTriangle,
  Send,
  Link2,
  Copy,
  Layers,
  HelpCircle
} from 'lucide-react';
import { AppThemeConfig } from '../../types';

interface SupportHelplineTabProps {
  appTheme: AppThemeConfig;
  onUpdateTheme: (updated: Partial<AppThemeConfig>) => void;
}

// Crisp official Facebook SVG Icon
const FacebookIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

// High-Fidelity Modern Interactive Toggle Switch
interface ModernToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  activeColor?: string;
  activeText?: string;
  inactiveText?: string;
  label?: string;
}

const ModernToggleSwitch: React.FC<ModernToggleSwitchProps> = ({
  checked,
  onChange,
  activeColor = '#059669',
  activeText = 'অন',
  inactiveText = 'অফ',
  label
}) => {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full p-1 transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95 shadow-inner ${
          checked ? 'shadow-black/20' : 'bg-slate-200 hover:bg-slate-300'
        }`}
        style={{
          backgroundColor: checked ? activeColor : undefined
        }}
      >
        <span className="sr-only">{label || 'Toggle status'}</span>
        
        {/* Track Label Text */}
        <span 
          className={`absolute text-[9px] font-black tracking-wider uppercase transition-opacity duration-200 ${
            checked 
              ? 'left-2 text-white' 
              : 'right-2 text-slate-500'
          }`}
        >
          {checked ? activeText : inactiveText}
        </span>

        {/* Sliding Knob with Micro-Icon */}
        <span
          className={`pointer-events-none flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 ease-in-out ${
            checked ? 'translate-x-8' : 'translate-x-0'
          }`}
        >
          {checked ? (
            <Check className="w-3.5 h-3.5" style={{ color: activeColor }} strokeWidth={3} />
          ) : (
            <X className="w-3.5 h-3.5 text-slate-400" strokeWidth={2.5} />
          )}
        </span>
      </button>

      {/* Visual Status Pill Badge */}
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`cursor-pointer px-2.5 py-1 rounded-xl text-[11px] font-black flex items-center gap-1.5 transition-all border shadow-2xs ${
          checked 
            ? 'bg-white shadow-2xs hover:brightness-95' 
            : 'bg-slate-100 text-slate-500 border-pink-200/80/80 hover:bg-slate-200/70'
        }`}
        style={{
          color: checked ? activeColor : undefined,
          borderColor: checked ? `${activeColor}40` : undefined
        }}
      >
        <span 
          className={`w-2 h-2 rounded-full ${checked ? 'animate-pulse' : 'bg-slate-400'}`} 
          style={{ backgroundColor: checked ? activeColor : undefined }}
        />
        <span>{checked ? `${activeText} (সক্রিয়)` : `${inactiveText} (বন্ধ)`}</span>
      </button>
    </div>
  );
};

export const SupportHelplineTab: React.FC<SupportHelplineTabProps> = ({
  appTheme,
  onUpdateTheme
}) => {
  // Master display switch
  const [isSupportActive, setIsSupportActive] = useState(appTheme.isSupportActive ?? true);

  // WhatsApp Channel
  const [isWhatsAppActive, setIsWhatsAppActive] = useState(appTheme.isWhatsAppSupportActive ?? true);
  const [supportPhone, setSupportPhone] = useState(appTheme.supportPhone || '01700000000');
  const [supportLabel, setSupportLabel] = useState(appTheme.supportLabel || 'এডমিন ও সাপোর্ট হেল্পলাইন');

  // Facebook Channel
  const [isFacebookActive, setIsFacebookActive] = useState(appTheme.isFacebookSupportActive ?? false);
  const [supportFacebookUrl, setSupportFacebookUrl] = useState(appTheme.supportFacebookUrl || '');
  const [supportFacebookLabel, setSupportFacebookLabel] = useState(appTheme.supportFacebookLabel || 'ফেসবুক পেজ / আইডি সাপোর্ট');

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Synchronize state with incoming prop updates
  useEffect(() => {
    setIsSupportActive(appTheme.isSupportActive ?? true);
    setIsWhatsAppActive(appTheme.isWhatsAppSupportActive ?? true);
    setSupportPhone(appTheme.supportPhone || '01700000000');
    setSupportLabel(appTheme.supportLabel || 'এডমিন ও সাপোর্ট হেল্পলাইন');
    setIsFacebookActive(appTheme.isFacebookSupportActive ?? false);
    setSupportFacebookUrl(appTheme.supportFacebookUrl || '');
    setSupportFacebookLabel(appTheme.supportFacebookLabel || 'ফেসবুক পেজ / আইডি সাপোর্ট');
  }, [appTheme]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean phone number (remove dashes, spaces, make sure it has proper format)
    let cleanPhone = supportPhone.trim().replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      cleanPhone = '88' + cleanPhone; // Prefix Bangladesh country code if missing
    }

    // Clean Facebook URL
    let cleanFbUrl = supportFacebookUrl.trim();
    if (cleanFbUrl && !cleanFbUrl.startsWith('http://') && !cleanFbUrl.startsWith('https://')) {
      if (cleanFbUrl.startsWith('facebook.com') || cleanFbUrl.startsWith('fb.me') || cleanFbUrl.startsWith('fb.com')) {
        cleanFbUrl = 'https://' + cleanFbUrl;
      } else {
        // Assume user entered username / ID
        cleanFbUrl = `https://facebook.com/${cleanFbUrl.replace(/^@/, '')}`;
      }
    }

    const updatedConfig: Partial<AppThemeConfig> = {
      isSupportActive,
      isWhatsAppSupportActive: isWhatsAppActive,
      supportPhone: cleanPhone,
      supportLabel: supportLabel.trim() || 'এডমিন ও সাপোর্ট হেল্পলাইন',
      isFacebookSupportActive: isFacebookActive,
      supportFacebookUrl: cleanFbUrl,
      supportFacebookLabel: supportFacebookLabel.trim() || 'ফেসবুক পেজ / আইডি সাপোর্ট'
    };

    onUpdateTheme(updatedConfig);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const getCleanFbPreviewUrl = () => {
    const raw = supportFacebookUrl.trim();
    if (!raw) return 'https://facebook.com';
    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
    return `https://facebook.com/${raw.replace(/^@/, '')}`;
  };

  const getCleanPhoneForWhatsApp = () => {
    let clean = supportPhone.trim().replace(/[^0-9]/g, '');
    if (clean.startsWith('0') && clean.length === 11) clean = '88' + clean;
    return clean || '8801700000000';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header Banner Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-200/80/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-[#25D366] to-[#1877F2]"></div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-700 via-teal-600 to-[#1877F2] text-white flex items-center justify-center shadow-lg shadow-emerald-800/20 shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  এডমিন ও সাপোর্ট হেল্পলাইন কন্ট্রোল
                </h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-pink-200/80">
                  v2.0 মডার্ন
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                নাগরিকদের জন্য সরাসরি ওয়ান-ক্লিক হোয়াটসঅ্যাপ ও ফেসবুক আইডি যোগাযোগের সমন্বিত সেটিংস
              </p>
            </div>
          </div>

          {/* Master State Visual Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-[11px] font-black px-3 py-1.5 rounded-2xl border flex items-center gap-1.5 shadow-2xs ${
              isSupportActive 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80' 
                : 'bg-rose-50 text-rose-800 border-rose-200/80'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isSupportActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span>{isSupportActive ? 'অ্যাপে সম্পূর্ণ মডিউল লাইভ আছে' : 'বর্তমানে সকল সাপোর্ট হাইড করা'}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input Configuration Form */}
        <div className="lg:col-span-7 space-y-5">
          <form onSubmit={handleSave} className="space-y-5">
            
            {/* MASTER MODULE TOGGLE CARD */}
            <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs transition-all hover:border-pink-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      {isSupportActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                    </div>
                    <span className="text-xs sm:text-sm font-black text-slate-900">
                      অ্যাপে হেল্পলাইন ও সাপোর্ট মডিউল প্রদর্শন
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed pl-9">
                    এটি অন থাকলে নাগরিক সাহায্য ও সাপোর্ট পেজে সরাসরি যোগাযোগ বোতামসমূহ দৃশ্যমান হবে। অফ করলে পুরো সেকশনটি নিরাপদে বন্ধ থাকবে।
                  </p>
                </div>
                
                {/* Master Modern Toggle Switch */}
                <div className="shrink-0 self-start sm:self-center pl-9 sm:pl-0">
                  <ModernToggleSwitch
                    checked={isSupportActive}
                    onChange={setIsSupportActive}
                    activeColor="#059669"
                    activeText="অন"
                    inactiveText="অফ"
                    label="মাস্টার হেল্পলাইন ডিসপ্লে"
                  />
                </div>
              </div>
            </div>

            {/* CHANNEL 1: WhatsApp Support Channel with Modern Status Switch */}
            <div className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-200 shadow-xs relative overflow-hidden ${
              isWhatsAppActive 
                ? 'border-emerald-300/80 ring-2 ring-emerald-500/10' 
                : 'border-pink-200/80/80 bg-slate-50/60'
            }`}>
              <div className={`absolute top-0 left-0 right-0 h-1 transition-all ${
                isWhatsAppActive ? 'bg-[#25D366]' : 'bg-slate-200'
              }`} />

              {/* WhatsApp Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-4 border-b border-pink-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-md shadow-[#25D366]/25 shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <span>WhatsApp হেল্পলাইন চ্যানেল</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      নাগরিকদের সরাসরি এনক্রিপ্টেড হোয়াটসঅ্যাপ চ্যাটে যুক্ত করার মাধ্যম
                    </p>
                  </div>
                </div>

                {/* WhatsApp Status Toggle Switch */}
                <div className="shrink-0 self-start sm:self-center">
                  <ModernToggleSwitch
                    checked={isWhatsAppActive}
                    onChange={setIsWhatsAppActive}
                    activeColor="#25D366"
                    activeText="অন"
                    inactiveText="অফ"
                    label="হোয়াটসঅ্যাপ সাপোর্ট স্ট্যাটাস"
                  />
                </div>
              </div>

              {/* WhatsApp Inputs (When ON) */}
              {isWhatsAppActive ? (
                <div className="mt-5 space-y-4 animate-in fade-in duration-200">
                  <div>
                    <label className="text-xs font-bold text-slate-800 flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-[#25D366]" />
                        <span>হোয়াটসঅ্যাপ মোবাইল নম্বর (সিকিউরড) *</span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        সরাসরি চ্যাট লিংক তৈরি হবে
                      </span>
                    </label>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-black text-xs">
                        🇧🇩 +88
                      </div>
                      <input
                        type="text"
                        required={isWhatsAppActive}
                        value={supportPhone}
                        onChange={(e) => setSupportPhone(e.target.value)}
                        placeholder="যেমন: 01700000000"
                        className="w-full pl-16 pr-28 py-3 bg-slate-50/70 focus:bg-white border border-pink-200/80 focus:border-[#25D366] rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-3 focus:ring-[#25D366]/20 transition-all"
                      />
                      {supportPhone && (
                        <div className="absolute inset-y-0 right-2 flex items-center">
                          <a
                            href={`https://wa.me/${getCleanPhoneForWhatsApp()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 active:scale-95 text-emerald-900 rounded-xl text-[10px] font-black flex items-center gap-1 transition-all"
                            title="হোয়াটসঅ্যাপ চ্যাট পরীক্ষা করুন"
                          >
                            <span>টেস্ট করুন</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-amber-700 font-semibold mt-1.5 flex items-center gap-1">
                      <span>🔒 নিরাপত্তা তথ্য:</span>
                      <span>নাগরিকদের সামনে মোবাইল নম্বরটি গোপন থাকবে; ক্লিক করলে সরাসরি হোয়াটসঅ্যাপ চ্যাট ওপেন হবে।</span>
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      হোয়াটসঅ্যাপ বাটন টেক্সট / লেবেল
                    </label>
                    <input
                      type="text"
                      value={supportLabel}
                      onChange={(e) => setSupportLabel(e.target.value)}
                      placeholder="যেমন: এডমিন ও সাপোর্ট হেল্পলাইন"
                      className="w-full px-4 py-2.5 bg-slate-50/70 focus:bg-white border border-pink-200/80 focus:border-[#25D366] rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-3 focus:ring-[#25D366]/20 transition-all"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-3.5 bg-slate-100/80 rounded-2xl border border-pink-200/80/60 text-xs text-slate-500 font-medium flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <span>WhatsApp সাপোর্ট চ্যানেলটি বর্তমানে বন্ধ রয়েছে।</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsWhatsAppActive(true)}
                    className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-800 rounded-xl text-[11px] font-black border border-pink-200/80 transition-colors shrink-0 cursor-pointer"
                  >
                    চালু করুন
                  </button>
                </div>
              )}
            </div>

            {/* CHANNEL 2: Facebook Support Channel with Modern Status Switch */}
            <div className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-200 shadow-xs relative overflow-hidden ${
              isFacebookActive 
                ? 'border-blue-300/80 ring-2 ring-blue-500/10' 
                : 'border-pink-200/80/80 bg-slate-50/60'
            }`}>
              <div className={`absolute top-0 left-0 right-0 h-1 transition-all ${
                isFacebookActive ? 'bg-[#1877F2]' : 'bg-slate-200'
              }`} />

              {/* Facebook Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-4 border-b border-pink-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center shadow-md shadow-[#1877F2]/25 shrink-0">
                    <FacebookIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <span>Facebook সাপোর্ট চ্যানেল</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      ফেসবুক প্রোফাইল, পেজ বা গ্রুপে সরাসরি ওয়ান-ক্লিক যোগাযোগের লিংক
                    </p>
                  </div>
                </div>

                {/* Facebook Status Toggle Switch */}
                <div className="shrink-0 self-start sm:self-center">
                  <ModernToggleSwitch
                    checked={isFacebookActive}
                    onChange={setIsFacebookActive}
                    activeColor="#1877F2"
                    activeText="অন"
                    inactiveText="অফ"
                    label="ফেসবুক সাপোর্ট স্ট্যাটাস"
                  />
                </div>
              </div>

              {/* Facebook Inputs (When ON) */}
              {isFacebookActive ? (
                <div className="mt-5 space-y-4 animate-in fade-in duration-200">
                  <div>
                    <label className="text-xs font-bold text-slate-800 flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-[#1877F2]" />
                        <span>ফেসবুক আইডি / পেজ লিংক (URL) *</span>
                      </span>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        ফেসবুকে সরাসরি রিডাইরেক্ট হবে
                      </span>
                    </label>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Link2 className="w-4 h-4 text-blue-500" />
                      </div>
                      <input
                        type="text"
                        required={isFacebookActive}
                        value={supportFacebookUrl}
                        onChange={(e) => setSupportFacebookUrl(e.target.value)}
                        placeholder="যেমন: https://facebook.com/kushtia.connect অথবা ইউজারনেম"
                        className="w-full pl-10 pr-28 py-3 bg-slate-50/70 focus:bg-white border border-pink-200/80 focus:border-[#1877F2] rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-3 focus:ring-[#1877F2]/20 transition-all"
                      />
                      {supportFacebookUrl && (
                        <div className="absolute inset-y-0 right-2 flex items-center">
                          <a
                            href={getCleanFbPreviewUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 bg-blue-100 hover:bg-blue-200 active:scale-95 text-blue-900 rounded-xl text-[10px] font-black flex items-center gap-1 transition-all"
                            title="ফেসবুক পেজ লিংকটি ওপেন করে টেস্ট করুন"
                          >
                            <span>টেস্ট করুন</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Quick helper suggestion chips */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-400">সহজ নমুনা:</span>
                      <button
                        type="button"
                        onClick={() => setSupportFacebookUrl('https://facebook.com/kushtiaconnect')}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-[10px] font-semibold text-slate-600 hover:text-blue-700 transition-colors border border-pink-200/80/80 cursor-pointer"
                      >
                        facebook.com/kushtiaconnect
                      </button>
                      <button
                        type="button"
                        onClick={() => setSupportFacebookUrl('https://m.me/kushtiaconnect')}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-[10px] font-semibold text-slate-600 hover:text-blue-700 transition-colors border border-pink-200/80/80 cursor-pointer"
                      >
                        m.me/kushtiaconnect (ম্যাসেঞ্জার)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      ফেসবুক বাটন টেক্সট / লেবেল
                    </label>
                    <input
                      type="text"
                      value={supportFacebookLabel}
                      onChange={(e) => setSupportFacebookLabel(e.target.value)}
                      placeholder="যেমন: অফিসিয়াল ফেসবুক পেজ সাপোর্ট"
                      className="w-full px-4 py-2.5 bg-slate-50/70 focus:bg-white border border-pink-200/80 focus:border-[#1877F2] rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-3 focus:ring-[#1877F2]/20 transition-all"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-3.5 bg-slate-100/80 rounded-2xl border border-pink-200/80/60 text-xs text-slate-500 font-medium flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <span>Facebook সাপোর্ট চ্যানেলটি বর্তমানে বন্ধ রয়েছে।</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsFacebookActive(true)}
                    className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-800 rounded-xl text-[11px] font-black border border-pink-200/80 transition-colors shrink-0 cursor-pointer"
                  >
                    চালু করুন
                  </button>
                </div>
              )}
            </div>

            {/* Save Controls Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              {saveSuccess ? (
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 
                  সেটিংস সফলভাবে সংরক্ষিত ও আপডেট হয়েছে!
                </span>
              ) : (
                <div className="text-[11px] text-slate-400 font-medium hidden sm:block">
                  * পরিবর্তন শেষে সেভ বাটনে ক্লিক করুন
                </div>
              )}

              <button
                type="submit"
                className="w-full sm:w-auto py-3 px-8 bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 hover:from-emerald-700 hover:to-teal-800 active:scale-98 text-white font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-700/20 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>কনফিগারেশন সেভ করুন</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Live Interactive Preview Panel */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-pink-200/80/80 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-pink-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  লাইভ সিটিজেন প্রিভিউ
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                নাগরিক পেজের ভিউ
              </span>
            </div>

            {isSupportActive ? (
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-pink-200/80/80 shadow-inner space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-pink-200/80/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-black text-slate-800">সরাসরি এডমিন ও সাপোর্ট হেল্পলাইন</span>
                  </div>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    ২৪/৭ অনলাইন
                  </span>
                </div>

                <p className="text-[11px] text-slate-500">
                  নাগরিকরা নিচের বোতামগুলোতে ক্লিক করে সরাসরি যোগাযোগ করতে পারবেন:
                </p>

                {/* Target support item 1: WhatsApp Button Preview */}
                {isWhatsAppActive && (
                  <a
                    href={`https://wa.me/${getCleanPhoneForWhatsApp()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50/80 border border-emerald-200 hover:border-pink-300 hover:shadow-sm transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm shadow-[#25D366]/30 group-hover:scale-105 transition-transform">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-extrabold text-slate-900 block truncate group-hover:text-emerald-800 transition-colors">
                          {supportLabel || 'হোয়াটসঅ্যাপ সাপোর্ট'}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold block truncate">
                          সরাসরি হোয়াটসঅ্যাপ মেসেজ (নিরাপদ চ্যাট)
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-emerald-700 bg-white px-2.5 py-1 rounded-xl border border-emerald-200 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-2xs">
                      চ্যাট করুন →
                    </span>
                  </a>
                )}

                {/* Target support item 2: Facebook Button Preview */}
                {isFacebookActive && (
                  <a
                    href={getCleanFbPreviewUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/80 border border-blue-200 hover:border-blue-300 hover:shadow-sm transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-sm shadow-[#1877F2]/30 group-hover:scale-105 transition-transform">
                        <FacebookIcon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-extrabold text-slate-900 block truncate group-hover:text-blue-800 transition-colors">
                          {supportFacebookLabel || 'ফেসবুক পেজ / আইডি সাপোর্ট'}
                        </span>
                        <span className="text-[10px] text-blue-700 font-bold block truncate">
                          {supportFacebookUrl ? 'ফেসবুকে পেজ বা আইডিতে মেসেজ দিন' : 'লিংক যুক্ত করা হয়নি'}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-blue-700 bg-white px-2.5 py-1 rounded-xl border border-blue-200 shrink-0 group-hover:bg-[#1877F2] group-hover:text-white transition-colors shadow-2xs">
                      ভিজিট করুন →
                    </span>
                  </a>
                )}

                {/* Neither channel active fallback */}
                {!isWhatsAppActive && !isFacebookActive && (
                  <div className="py-6 text-center space-y-1 bg-white rounded-2xl border border-dashed border-amber-200 p-4">
                    <AlertTriangle className="w-7 h-7 text-amber-500 mx-auto" />
                    <p className="text-xs font-black text-slate-800">উভয় চ্যানেলই বর্তমানে বন্ধ (OFF)</p>
                    <p className="text-[10px] text-slate-400">নাগরিকদের জন্য WhatsApp অথবা Facebook সাপোর্ট অন করুন।</p>
                  </div>
                )}

                {/* Info Note */}
                <div className="pt-2 text-center text-[10px] text-slate-400 font-medium">
                  💡 যেকোনো বাটন ক্লিক করে সরাসরি কার্যকারিতা যাচাই করে দেখতে পারেন।
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-8 border border-dashed border-pink-200/80 text-center flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-400 flex items-center justify-center">
                  <EyeOff className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-black text-slate-700">সাপোর্ট হেল্পলাইন অফলাইন আছে</h4>
                <p className="text-[10px] text-slate-400 leading-normal max-w-[220px] mx-auto">
                  মাস্টার সুইচ বন্ধ থাকায় নাগরিক অ্যাপের সাহায্য পেজে এই সেকশনটি প্রদর্শিত হবে না।
                </p>
                <button
                  type="button"
                  onClick={() => setIsSupportActive(true)}
                  className="mt-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  এখনই অন করুন
                </button>
              </div>
            )}
          </div>

          <div className="pt-5 border-t border-pink-100 text-[10px] text-slate-500 leading-normal flex items-start gap-2 mt-4">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>কুষ্টিয়া পৌরবাসী ও অ্যাডমিনদের যোগাযোগ ব্যবস্থাকে আধুনিক, এনক্রিপ্টেড এবং স্প্যামমুক্ত রাখতে এই ব্যবস্থা প্রণয়ন করা হয়েছে।</span>
          </div>
        </div>

      </div>

    </div>
  );
};
