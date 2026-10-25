import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Image as ImageIcon, 
  Upload, 
  Tag, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  ArrowLeft,
  FileText,
  UserCheck,
  Smartphone,
  UtensilsCrossed,
  Facebook,
  Plus,
  Trash2,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PostItem, CategoryType } from '../../types';
import { uploadPostImage } from '../../services/postService';

interface AdminEditPostModalProps {
  post: PostItem | null; // null if creating
  onClose: () => void;
  onSave: (postData: Partial<PostItem>) => void;
  onApprove?: () => void;
  onReject?: () => void;
}

export const AdminEditPostModal: React.FC<AdminEditPostModalProps> = ({
  post,
  onClose,
  onSave,
  onApprove,
  onReject
}) => {
  const isEditing = Boolean(post);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Main Form State
  const [formData, setFormData] = useState({
    title: post?.title || '',
    category: post?.category || ('house-rent' as PostItem['category']),
    subcategory: post?.subcategory || '',
    description: post?.description || '',
    price: post?.price || '',
    location: (post?.location && !post.location.includes('নীলফামারী')) ? post.location : 'কুষ্টিয়া সদর, কুষ্টিয়া',
    contactPhone: post?.contactPhone || '01712000000',
    whatsapp: post?.whatsapp || '',
    facebook: post?.facebook || '',
    imageUrl: post?.imageUrl || '',
    authorName: post?.authorName || 'অ্যাডমিন মডারেশন',
    isVerified: post?.isVerified ?? true
  });

  // Food / Restaurant Menu Details State
  const [foodType, setFoodType] = useState(post?.details?.foodType || '');
  const [menuHighlights, setMenuHighlights] = useState(post?.details?.menuHighlights || '');
  const [deliveryAvailable, setDeliveryAvailable] = useState(post?.details?.deliveryAvailable ?? true);
  const [menuItems, setMenuItems] = useState<{ name: string; price: string; ingredients?: string }[]>(
    post?.details?.menuItems || []
  );

  React.useEffect(() => {
    setFormData({
      title: post?.title || '',
      category: post?.category || ('house-rent' as PostItem['category']),
      subcategory: post?.subcategory || '',
      description: post?.description || '',
      price: post?.price || '',
      location: (post?.location && !post.location.includes('নীলফামারী')) ? post.location : 'কুষ্টিয়া সদর, কুষ্টিয়া',
      contactPhone: post?.contactPhone || '01712000000',
      whatsapp: post?.whatsapp || '',
      facebook: post?.facebook || '',
      imageUrl: post?.imageUrl || '',
      authorName: post?.authorName || 'অ্যাডমিন মডারেশন',
      isVerified: post?.isVerified ?? true
    });
    setFoodType(post?.details?.foodType || '');
    setMenuHighlights(post?.details?.menuHighlights || '');
    setDeliveryAvailable(post?.details?.deliveryAvailable ?? true);
    setMenuItems(post?.details?.menuItems || []);
  }, [post]);

  // New Menu Item Builder Temporary Inputs
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemIngredients, setNewItemIngredients] = useState('');

  const steps = [
    { id: 1, title: 'সাধারণ তথ্য', icon: FileText, desc: 'শিরোনাম, বিবরণ ও ক্যাটাগরি' },
    { id: 2, title: 'মিডিয়া ও মেনু', icon: UtensilsCrossed, desc: 'ছবি, লোকেশন, মূল্য ও রেস্টুরেন্ট মেনু' },
    { id: 3, title: 'যোগাযোগ ও ফেসবুক', icon: Facebook, desc: 'মোবাইল, ফেসবুক ও ভেরিফিকেশন' }
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploadingImage(true);
        setUploadError('');
        const url = await uploadPostImage(file);
        setFormData(prev => ({ ...prev, imageUrl: url }));
      } catch (err: any) {
        console.error('Admin image upload error:', err);
        setUploadError(err?.message || 'ছবি আপলোড করতে সমস্যা হয়েছে।');
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleAddMenuItem = () => {
    if (!newItemName.trim()) {
      alert('অনুগ্রহ করে খাবারের নাম লিখুন।');
      return;
    }
    if (!newItemPrice.trim()) {
      alert('অনুগ্রহ করে খাবারের দাম লিখুন।');
      return;
    }

    setMenuItems(prev => [
      ...prev,
      {
        name: newItemName.trim(),
        price: newItemPrice.trim().includes('৳') ? newItemPrice.trim() : `${newItemPrice.trim()} ৳`,
        ingredients: newItemIngredients.trim() || undefined
      }
    ]);

    setNewItemName('');
    setNewItemPrice('');
    setNewItemIngredients('');
  };

  const handleRemoveMenuItem = (index: number) => {
    setMenuItems(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!formData.title.trim()) {
        alert('অনুগ্রহ করে পোস্ট শিরোনাম লিখুন।');
        return false;
      }
      if (!formData.description.trim()) {
        alert('অনুগ্রহ করে বিস্তারিত বিবরণ লিখুন।');
        return false;
      }
    }
    if (step === 3) {
      if (!formData.contactPhone.trim()) {
        alert('অনুগ্রহ করে যোগাযোগের ফোন নম্বর দিন।');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }

    setIsSaving(true);
    
    // Create robust merged object
    const updatedPostData: Partial<PostItem> = {
      ...(post || {}),
      title: formData.title.trim(),
      category: formData.category,
      subcategory: formData.subcategory.trim() || undefined,
      description: formData.description.trim(),
      price: formData.price.trim() || undefined,
      location: formData.location.trim() || 'কুষ্টিয়া',
      contactPhone: formData.contactPhone.trim(),
      whatsapp: formData.whatsapp.trim() || undefined,
      facebook: formData.facebook.trim() || undefined,
      imageUrl: formData.imageUrl.trim() || undefined,
      authorName: formData.authorName.trim() || 'অ্যাডমিন মডারেশন',
      isVerified: formData.isVerified,
      details: {
        ...(post?.details || {}),
        foodType: foodType.trim() || undefined,
        menuHighlights: menuHighlights.trim() || undefined,
        deliveryAvailable: deliveryAvailable,
        menuItems: menuItems.length > 0 ? menuItems : (post?.details?.menuItems || undefined)
      }
    };

    try {
      await onSave(updatedPostData);
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
      alert('পোস্ট সেভ করতে সমস্যা হয়েছে।');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-pink-200/80 dark:border-slate-800 shadow-2xl overflow-hidden my-8 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-pink-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {isEditing ? 'পোস্ট ও রেস্টুরেন্ট ভিডিও/মেনু সম্পাদনা' : 'নতুন পোস্ট বা রেস্টুরেন্ট যুক্ত করুন'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEditing ? `পোস্ট আইডি: ${post?.id}` : 'মূল নাগরিক অ্যাপে তাৎক্ষণিক লাইভ হবে'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Step Stepper Progress Bar */}
        <div className="px-5 pt-5 pb-3 border-b border-pink-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 left-4 h-0.5 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 2) * 94}%` }}
            />

            {steps.map((step) => {
              const StepIcon = step.icon;
              const isCompleted = currentStep > step.id;
              const isActive = currentStep === step.id;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    if (step.id < currentStep) {
                      setCurrentStep(step.id);
                    } else if (step.id === currentStep + 1) {
                      handleNext();
                    }
                  }}
                  className="z-10 flex flex-col items-center focus:outline-none"
                >
                  <div 
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-emerald-600 text-white shadow-md' 
                        : isActive 
                        ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 dark:ring-emerald-950' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-4 h-4" />
                    )}
                  </div>
                  <span className={`text-[10px] font-bold mt-1.5 transition-colors duration-300 ${
                    isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'
                  }`}>
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-5 flex-1 space-y-4 max-h-[72vh] overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            {currentStep === 1 ? (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">পোস্ট / রেস্টুরেন্টের নাম *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="যেমন: স্টেশন রোড বিরিয়ানি প্যালেস বা ৩ রুমের বাসা ভাড়া..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-pink-200/80 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-none focus:border-pink-600 focus:bg-white dark:focus:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">ক্যাটাগরি *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as CategoryType }))}
                    className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-800/40 border border-pink-200/80 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-pink-600"
                  >
                    <option value="food">🍔 খাবার ও রেস্টুরেন্ট (রেস্টুরেন্ট মেনু সাপোর্টেড)</option>
                    <option value="house-rent">🏠 বাসা ও মেস ভাড়া</option>
                    <option value="buy-sell">🛍️ কেনাবেচা বাজার</option>
                    <option value="doctor">🩺 ডাক্তার তালিকা</option>
                    <option value="blood">🩸 রক্তদান সেবা</option>
                    <option value="transport">🚗 পরিবহন সেবা</option>
                    <option value="mason">🧱 রাজমিস্ত্রি</option>
                    <option value="mobile-maker">📱 মোবাইল মেকার</option>
                    <option value="electrician">⚡ ইলেকট্রিশিয়ান</option>
                    <option value="plumber">🪠 প্লাম্বার</option>
                    <option value="ac-mechanic">❄️ এসি/ফ্রিজ</option>
                    <option value="driver">🚘 ড্রাইভার</option>
                    <option value="tutor">📚 গৃহশিক্ষক</option>
                    <option value="vet">🐾 পশু চিকিৎসক</option>
                    <option value="jobs">💼 চাকরি ও নিয়োগ</option>
                    <option value="lost-found">🔍 হারানো ও প্রাপ্তি</option>
                    <option value="crime-reporter">🚨 গোপন ক্রাইম রিপোর্ট</option>
                    <option value="events">🎉 ইভেন্ট ও ডেকোরেশন</option>
                    <option value="legal">⚖️ আইনজীবী সেবা</option>
                    <option value="citizen-fund">🤝 নাগরিক ফান্ড</option>
                    <option value="services">🛠️ অন্যান্য সার্ভিস</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">সাব-ক্যাটাগরি / টাইপ (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                    placeholder={formData.category === 'food' ? "যেমন: বিরিয়ানি ও কাবাব, ক্যাফে বা ঐতিহ্যবাহী মিষ্টি" : "যেমন: ফ্যামিলি বাসা, স্মার্টফোন..."}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-pink-200/80 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-none focus:border-pink-600 focus:bg-white dark:focus:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">বিস্তারিত বিবরণ *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="সুযোগ-সুবিধা, ঠিকানা ও বিস্তারিত বিবরণ লিখুন..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-pink-200/80 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-none focus:border-pink-600 focus:bg-white dark:focus:bg-slate-800 dark:text-white leading-relaxed"
                  />
                </div>
              </motion.div>
            ) : currentStep === 2 ? (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                {/* Media Upload */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-pink-200/80 dark:border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>পোস্ট বা রেস্টুরেন্টের ছবি (Image URL বা ফাইল)</span>
                    {uploadingImage ? (
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> আপলোড হচ্ছে...
                      </span>
                    ) : formData.imageUrl ? (
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">ছবি সংযুক্ত আছে</span>
                    ) : null}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                      placeholder="ছবির ওয়েব লিংক..."
                      className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-pink-200/80 dark:border-slate-700 rounded-xl text-xs dark:text-white focus:outline-none focus:border-pink-600"
                    />
                    <label className={`px-3 py-2 ${uploadingImage ? 'bg-slate-300 opacity-60 cursor-not-allowed' : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 cursor-pointer'} text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1`}>
                      {uploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      <span>{uploadingImage ? 'আপলোড...' : 'ফাইল'}</span>
                      <input type="file" accept="image/*" disabled={uploadingImage} onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                  {uploadError && (
                    <p className="text-[11px] text-rose-600 font-semibold">{uploadError}</p>
                  )}
                </div>

                {/* Location Input */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">ঠিকানা / এলাকা</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="যেমন: স্টেশন রোড, কুষ্টিয়া"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-pink-200/80 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-none focus:border-pink-600 focus:bg-white dark:focus:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* Price/Fee Input */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">সাধারণ মূল্য / এভারেজ বাজেট</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="যেমন: ১৮০ - ২৮০ ৳/প্লেট"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-pink-200/80 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-none focus:border-pink-600 focus:bg-white dark:focus:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* RESTAURANT MENU BUILDER SECTION */}
                <div className="p-4 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-amber-200/60 dark:border-amber-900/30">
                    <UtensilsCrossed className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
                    <div>
                      <h4 className="text-xs font-black text-amber-950 dark:text-amber-300">
                        রেস্টুরেন্টের খাবারে বিস্তারিত মেনু তৈরি করুন
                      </h4>
                      <p className="text-[10px] text-amber-800/80 dark:text-amber-400">
                        এডমিন প্যানেল থেকে খাবার ও দাম সরাসরি অ্যাপের মেনুতে দেখাবে
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        খাবারের ধরন (Cuisine/Type)
                      </label>
                      <input
                        type="text"
                        value={foodType}
                        onChange={(e) => setFoodType(e.target.value)}
                        placeholder="যেমন: বিরিয়ানি ও কাচ্চি"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-xl text-xs dark:text-white focus:outline-none focus:border-amber-600"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        প্রধান মেনু সংক্ষেপ (Highlights)
                      </label>
                      <input
                        type="text"
                        value={menuHighlights}
                        onChange={(e) => setMenuHighlights(e.target.value)}
                        placeholder="যেমন: কাচ্চি, বিফ তেহারি, বোরহানি"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-xl text-xs dark:text-white focus:outline-none focus:border-amber-600"
                      />
                    </div>
                  </div>

                  {/* Added Menu Items List */}
                  {menuItems.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 block">
                        যুক্তকৃত খাবারের তালিকা ({menuItems.length} টি):
                      </span>
                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {menuItems.map((item, idx) => (
                          <div 
                            key={idx}
                            className="flex items-center justify-between gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-amber-200/80 dark:border-slate-700 text-xs shadow-2xs"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-white truncate">{item.name}</span>
                                <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                                  {item.price}
                                </span>
                              </div>
                              {item.ingredients && (
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{item.ingredients}</p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveMenuItem(idx)}
                              className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                              title="আইটেম বাদ দিন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Form to Add New Menu Item */}
                  <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-amber-200 dark:border-slate-700 space-y-2">
                    <span className="text-[11px] font-extrabold text-amber-900 dark:text-amber-400 block">
                      + নতুন খাবারের আইটেম যোগ করুন
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="খাবারের নাম (যেমন: খাসির কাচ্চি)"
                        className="sm:col-span-5 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-pink-200/80 dark:border-slate-700 rounded-lg text-xs dark:text-white"
                      />
                      <input
                        type="text"
                        value={newItemPrice}
                        onChange={(e) => setNewItemPrice(e.target.value)}
                        placeholder="দাম (যেমন: ২৮০ ৳)"
                        className="sm:col-span-3 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-pink-200/80 dark:border-slate-700 rounded-lg text-xs dark:text-white"
                      />
                      <input
                        type="text"
                        value={newItemIngredients}
                        onChange={(e) => setNewItemIngredients(e.target.value)}
                        placeholder="উপকরণ/বিবরণ (ঐচ্ছিক)"
                        className="sm:col-span-4 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-pink-200/80 dark:border-slate-700 rounded-lg text-xs dark:text-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddMenuItem}
                      className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>মেনুতে যুক্ত করুন</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                {/* Contact Phone */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">যোগাযোগের ফোন নম্বর *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder="যেমন: 01712000000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-pink-200/80 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-none focus:border-pink-600 focus:bg-white dark:focus:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* Whatsapp (Optional) */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">হোয়াটসঅ্যাপ নম্বর (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                    placeholder="যেমন: 01712000000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-pink-200/80 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-none focus:border-pink-600 focus:bg-white dark:focus:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* Facebook Link (NEW FEATURE REQUESTED BY USER) */}
                <div>
                  <label className="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5 block mb-1">
                    <Facebook className="w-3.5 h-3.5 text-blue-600" />
                    <span>ফেসবুক পেজ বা প্রোফাইল লিংক (Facebook Link)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.facebook}
                    onChange={(e) => setFormData(prev => ({ ...prev, facebook: e.target.value }))}
                    placeholder="https://facebook.com/your-restaurant-or-profile"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-blue-200 dark:border-blue-900/50 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 dark:text-white"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    গ্রাহক অ্যাপ থেকে সরাসরি "ফেসবুকে যোগাযোগ" বাটনে ক্লিক করে পেজে যেতে পারবে।
                  </p>
                </div>

                {/* Author Display Name (Optional) */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">বিজ্ঞাপনদাতা / রেস্টুরেন্টের নাম</label>
                  <input
                    type="text"
                    value={formData.authorName}
                    onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                    placeholder="যেমন: স্টোর বা রেস্টুরেন্টের নাম"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-pink-200/80 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-none focus:border-pink-600 focus:bg-white dark:focus:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* Verified Badge Checkbox */}
                <div className="flex items-center justify-between p-3.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-900/30">
                  <div className="space-y-0.5">
                    <span className="text-xs font-black text-emerald-950 dark:text-emerald-400 block">ভেরিফায়েড বিজ্ঞাপন ব্যাজ</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">বিজ্ঞাপনে বিশ্বস্ত টিকচিহ্ন যুক্ত করবে</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isVerified}
                    onChange={(e) => setFormData(prev => ({ ...prev, isVerified: e.target.checked }))}
                    className="w-4 h-4 text-emerald-600 rounded-md focus:ring-pink-500 cursor-pointer accent-emerald-600"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls Footer */}
          <div className="flex items-center gap-3 pt-4 border-t border-pink-100 dark:border-slate-800">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-[0.98]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>পূর্ববর্তী</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-xs font-bold transition-all ml-auto"
            >
              বাতিল
            </button>

            {isEditing && (
               <>
                 <button
                   type="button"
                   onClick={() => { if(confirm('পোস্টটি বাতিল করতে চান?')) onReject?.(); }}
                   className="py-2.5 px-4 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl text-xs font-black transition-all flex items-center gap-1.5"
                 >
                   <X className="w-3.5 h-3.5" />
                   <span>বাতিল করুন</span>
                 </button>
                 <button
                   type="button"
                   onClick={() => { if(confirm('পোস্টটি অনুমোদন করতে চান?')) onApprove?.(); }}
                   className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5"
                 >
                   <CheckCircle2 className="w-3.5 h-3.5" />
                   <span>অনুমোদন করুন</span>
                 </button>
               </>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs active:scale-[0.98]"
              >
                <span>পরবর্তী</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSaving}
                className="py-2.5 px-5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md active:scale-[0.98] disabled:opacity-50"
              >
                {isSaving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> <span>সেভ হচ্ছে...</span></>
                ) : (
                  <><Save className="w-4 h-4" /> <span>{isEditing ? 'পরিবর্তন সেভ করুন' : 'পোস্ট প্রকাশ করুন'}</span></>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
