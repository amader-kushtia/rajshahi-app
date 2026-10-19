import React, { useState } from 'react';
import { Image as ImageIcon, Upload, CheckCircle2, Loader2, Sparkles, RefreshCw, Eye, PlusCircle } from 'lucide-react';
import { useAdminConfig } from '../../context/AdminConfigContext';
import { addActivityLog } from '../../services/adminService';
import kushtiaHeroImage from '../../assets/images/kushtia_panoramic_hero.jpg';

export const AdminHomeBannerTab: React.FC = () => {
  const { themeConfig, updateThemeConfig } = useAdminConfig();
  const currentBanner = themeConfig.homeBannerUrl || kushtiaHeroImage;

  const [bannerInput, setBannerInput] = useState<string>(themeConfig.homeBannerUrl || '');
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);



  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('দয়া করে একটি বৈধ ছবি (Image) নির্বাচন করুন।');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('ছবির সাইজ ৮ মেগাবাইটের কম হতে হবে।');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setUploading(true);

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64String = uploadEvent.target?.result as string;
      if (base64String) {
        setBannerInput(base64String);
        updateThemeConfig({ homeBannerUrl: base64String });
        setSuccessMessage('সফলভাবে ব্যানার যোগ করা হয়েছে এবং লাইভ আপডেট হয়েছে!');
        addActivityLog({
          type: 'theme_updated',
          title: 'হোম পেজ ব্যানার সংযোজিত',
          description: 'অ্যাডমিন প্যানেল থেকে ডিভাইস ইমেজ ফাইল আপলোড করে হোম পেজ ব্যানার আপডেট করা হয়েছে।',
          actor: 'অ্যাডমিন'
        });
      } else {
        setErrorMessage('ছবি প্রসেস করতে সমস্যা হয়েছে।');
      }
      setUploading(false);
    };
    reader.onerror = () => {
      setErrorMessage('ছবি পড়তে সমস্যা হয়েছে।');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAddBanner = (urlToSave: string) => {
    const trimmed = urlToSave.trim();
    if (!trimmed) {
      setErrorMessage('দয়া করে ছবির সঠিক লিংক বা ফাইল প্রদান করুন।');
      return;
    }
    setErrorMessage(null);
    setBannerInput(trimmed);
    updateThemeConfig({ homeBannerUrl: trimmed });
    setSuccessMessage('সফলভাবে "এড ব্যানার" সম্পন্ন হয়েছে এবং হোম পেজে লাইভ দেখাচ্ছে!');
    addActivityLog({
      type: 'theme_updated',
      title: 'হোম পেজ ব্যানার এডেড',
      description: 'অ্যাডমিন প্যানেল থেকে এড ব্যানার বাটনের মাধ্যমে নতুন ব্যানার লাইভ করা হয়েছে।',
      actor: 'অ্যাডমিন'
    });
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleResetToDefault = () => {
    setBannerInput('');
    updateThemeConfig({ homeBannerUrl: '' });
    setSuccessMessage('ব্যানার ডিফল্ট কুষ্টিয়া ছবিতে রিসেট করা হয়েছে!');
    addActivityLog({
      type: 'theme_updated',
      title: 'হোম পেজ ব্যানার রিসেট',
      description: 'হোম পেজের ব্যানার ডিফল্ট ছবিতে ফিরিয়ে আনা হয়েছে।',
      actor: 'অ্যাডমিন'
    });
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner Title Card */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 rounded-3xl p-6 text-white shadow-lg flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-white/20 p-2 rounded-xl">
              <ImageIcon className="w-6 h-6 text-white" />
            </span>
            <h2 className="text-xl font-black">এড হোম পেজ ব্যানার (Home Banner Manager)</h2>
          </div>
          <p className="text-emerald-100 text-xs sm:text-sm">
            নিচে লিংক লিখে বা ছবি সিলেক্ট করে এক ক্লিকেই **"এড ব্যানার"** করুন। সাথে সাথে হোম স্ক্রিনে লাইভ আপডেট হয়ে যাবে।
          </p>
        </div>
        <div className="hidden sm:flex bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20 items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
          <span className="text-xs font-bold">ইনস্ট্যান্ট লাইভ</span>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3.5 rounded-2xl flex items-center gap-3 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <span className="text-sm font-black">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3.5 rounded-2xl flex items-center gap-3 shadow-sm animate-in fade-in">
          <span className="text-sm font-black">{errorMessage}</span>
        </div>
      )}

      {/* Live Preview Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-600" />
            বর্তমান লাইভ ব্যানার প্রিভিউ (Live Preview)
          </h3>
          <button
            onClick={handleResetToDefault}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            ডিফল্ট করুন
          </button>
        </div>

        <div className="relative w-full h-[220px] sm:h-[280px] rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-inner bg-slate-100">
          <img
            src={bannerInput || currentBanner}
            alt="Live Banner Preview"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex items-center justify-between">
            <span className="text-white text-xs font-bold bg-emerald-600 px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              লাইভ হোম ব্যানার সক্রিয়
            </span>
            <span className="text-emerald-300 text-xs font-mono">
              {bannerInput ? 'কাস্টম ব্যানার' : 'ডিফল্ট ব্যানার'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Add Banner Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Option 1: File Upload */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-1 flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-600" />
              ফাইল থেকে ছবি আপলোড করুন
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              ডিভাইস থেকে যেকোনো ছবি সিলেক্ট করলেই তা সাথে সাথে এড হয়ে যাবে।
            </p>

            <label className="border-2 border-dashed border-emerald-400 hover:border-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group shadow-sm">
              {uploading ? (
                <div className="flex flex-col items-center space-y-2">
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                  <span className="text-xs font-bold text-emerald-800">আপলোড ও লাইভ হচ্ছে...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black text-emerald-900">ফাইল সিলেক্ট করুন (Click to upload)</span>
                  <span className="text-[10px] text-slate-400">JPG, PNG, WEBP</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Option 2: Image URL Input with "এড ব্যানার" Button */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-1 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              ছবির লিংক দিয়ে ব্যানার এড করুন
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              ছবির লিংক পেস্ট করে নিচে **"এড ব্যানার"** বাটনে ক্লিক করুন।
            </p>

            <div className="space-y-3">
              <input
                type="url"
                value={bannerInput}
                onChange={(e) => setBannerInput(e.target.value)}
                placeholder="https://images.unsplash.com/... (ইমেজ লিংক)"
                className="w-full px-4 py-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-emerald-600 font-mono shadow-inner"
              />
              <button
                onClick={() => handleAddBanner(bannerInput)}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black py-3.5 rounded-xl text-sm shadow-lg shadow-emerald-200 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                এড ব্যানার (Add Banner)
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
