import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Eye, 
  Upload, 
  Image as ImageIcon, 
  Phone, 
  MapPin, 
  Clock, 
  Tag, 
  Radio, 
  X, 
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
  AlertCircle,
  Camera,
  FolderOpen,
  ArrowRight,
  Maximize2,
  Layers,
  ZoomIn
} from 'lucide-react';
import { 
  ManagedSponsoredCampaign, 
  getAllSponsoredCampaigns, 
  createSponsoredCampaign, 
  updateSponsoredCampaign, 
  deleteSponsoredCampaign, 
  setActiveSponsoredCampaign,
  toggleSponsoredActiveStatus 
} from '../../services/sponsoredService';
import { SponsoredItem } from '../../data/sponsoredData';

// High resolution Kushtia city business banner presets
export const SAMPLE_BANNER_IMAGES = [
  {
    name: 'শপিং মল ও পোশাক',
    tag: 'ফ্যাশন',
    url: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=450&auto=format&fit=crop&q=70'
  },
  {
    name: 'কম্পিউটার ও গ্যাজেট শপ',
    tag: 'আইটি',
    url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=450&auto=format&fit=crop&q=70'
  },
  {
    name: 'রেস্তোরাঁ ও বিরিয়ানি হাউজ',
    tag: 'খাবার',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=450&auto=format&fit=crop&q=70'
  },
  {
    name: 'লেডিস ফ্যাশন ও জুয়েলারি',
    tag: 'জুয়েলারি',
    url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=450&auto=format&fit=crop&q=70'
  },
  {
    name: 'মোটরসাইকেল ও অটোমোবাইল',
    tag: 'অটো',
    url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=450&auto=format&fit=crop&q=70'
  },
  {
    name: 'সুপারশপ ও গ্রোসারি মার্কেট',
    tag: 'মুদি',
    url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=450&auto=format&fit=crop&q=70'
  },
  {
    name: 'মেডিক্যাল ও ডায়াগনস্টিক',
    tag: 'স্বাস্থ্য',
    url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=450&auto=format&fit=crop&q=70'
  },
  {
    name: 'কোচিং সেন্টার ও শিক্ষা প্রতিষ্ঠান',
    tag: 'শিক্ষা',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=450&auto=format&fit=crop&q=70'
  }
];

const LOCAL_SPONSORED_PICTURES_KEY = 'kushtia_connect_sponsored_custom_pictures';

interface SponsoredPictureItem {
  id: string;
  url: string;
  title: string;
  uploadedAt: number;
}

interface SponsoredManagementTabProps {
  initialOpenStudio?: boolean;
}

export const SponsoredManagementTab: React.FC<SponsoredManagementTabProps> = ({ initialOpenStudio = false }) => {
  const [campaigns, setCampaigns] = useState<ManagedSponsoredCampaign[]>(() => getAllSponsoredCampaigns());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);
  const [previewCampaign, setPreviewCampaign] = useState<ManagedSponsoredCampaign | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [enlargedImageUrl, setEnlargedImageUrl] = useState<string | null>(null);

  // Picture Studio State
  const [customPictures, setCustomPictures] = useState<SponsoredPictureItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_SPONSORED_PICTURES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    businessName: '',
    badge: 'ভেরিফায়েড পার্টনার',
    tagline: '',
    shortDescription: '',
    fullDescription: '',
    discountBadge: '৫০% পর্যন্ত ছাড়',
    couponCode: 'KUSHTIA50',
    validTill: '৩১ ডিসেম্বর ২০২৬ পর্যন্ত প্রযোজ্য',
    location: 'শহীদ ডা. জিকরুল হক রোড, কুষ্টিয়া',
    phone: '01712000000',
    whatsapp: '8801712000000',
    email: 'contact@kushtiaplaza.com',
    openingHours: 'প্রতিদিন সকাল ১০:০০ টা - রাত ১০:০০ টা',
    imageUrl: SAMPLE_BANNER_IMAGES[0].url,
    extraImages: [] as string[],
    isActive: true
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeCampaign = campaigns.find(c => c.isActive) || campaigns[0];

  // Save custom pictures to storage
  const saveCustomPicture = (url: string, title: string) => {
    const newPic: SponsoredPictureItem = {
      id: 'pic_' + Date.now() + Math.random().toString(36).substring(2, 6),
      url,
      title,
      uploadedAt: Date.now()
    };
    const updated = [newPic, ...customPictures];
    setCustomPictures(updated);
    try {
      localStorage.setItem(LOCAL_SPONSORED_PICTURES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not cache custom picture:', e);
    }
    return newPic;
  };

  const removeCustomPicture = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customPictures.filter(p => p.id !== id);
    setCustomPictures(updated);
    try {
      localStorage.setItem(LOCAL_SPONSORED_PICTURES_KEY, JSON.stringify(updated));
    } catch {}
    showToast('পিকচার মুছে ফেলা হয়েছে।');
  };

  // Handle file uploads (converts file to dataUrl)
  const processImageFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        alert('অনুগ্রহ করে শুধু ইমেজ ফাইল (JPG, PNG, WebP) নির্বাচন করুন।');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultUrl = reader.result as string;
        saveCustomPicture(resultUrl, file.name.replace(/\.[^/.]+$/, ''));
        showToast('ছবি সফলভাবে আপলোড করা হয়েছে!');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleOpenCreateWithImage = (imageUrl: string, defaultName?: string) => {
    setEditingCampaignId(null);
    setFormData({
      businessName: defaultName || '',
      badge: 'ভেরিফায়েড পার্টনার',
      tagline: '',
      shortDescription: '',
      fullDescription: '',
      discountBadge: 'বিশেষ ক্যাশব্যাক অফার',
      couponCode: 'KUSHTIANEW',
      validTill: '৩১ ডিসেম্বর ২০২৬ পর্যন্ত প্রযোজ্য',
      location: 'এনএস রোড, কুষ্টিয়া সদর, কুষ্টিয়া',
      phone: '01712000000',
      whatsapp: '8801712000000',
      email: '',
      openingHours: 'সকাল ৯:০০ - রাত ১০:০০',
      imageUrl: imageUrl,
      extraImages: [],
      isActive: true
    });
    setIsFormOpen(true);
  };

  const handleOpenCreate = () => {
    handleOpenCreateWithImage(customPictures[0]?.url || SAMPLE_BANNER_IMAGES[0].url);
  };

  const handleOpenEdit = (campaign: ManagedSponsoredCampaign) => {
    setEditingCampaignId(campaign.id);
    const primaryImg = campaign.images?.[0]?.url || SAMPLE_BANNER_IMAGES[0].url;
    const extras = campaign.images?.slice(1).map(i => i.url) || [];
    
    setFormData({
      businessName: campaign.businessName,
      badge: campaign.badge,
      tagline: campaign.tagline,
      shortDescription: campaign.shortDescription,
      fullDescription: campaign.fullDescription,
      discountBadge: campaign.discountBadge,
      couponCode: campaign.couponCode,
      validTill: campaign.validTill,
      location: campaign.location,
      phone: campaign.phone,
      whatsapp: campaign.whatsapp,
      email: campaign.email,
      openingHours: campaign.openingHours,
      imageUrl: primaryImg,
      extraImages: extras,
      isActive: campaign.isActive
    });
    setIsFormOpen(true);
  };

  const handleAddUrlPicture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    saveCustomPicture(customUrlInput.trim(), 'অনলাইন ব্যানার ছবি');
    setCustomUrlInput('');
    showToast('অনলাইন ছবির লিংক গ্যালারিতে যোগ করা হয়েছে!');
  };

  const handleFormFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        setFormData(prev => ({ ...prev, imageUrl: url }));
        saveCustomPicture(url, file.name.replace(/\.[^/.]+$/, ''));
        showToast('ছবি নির্বাচন ও আপলোড সফল!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName.trim() || !formData.fullDescription.trim()) {
      alert('অনুগ্রহ করে প্রতিষ্ঠানের নাম ও বিস্তারিত বিবরণ লিখুন।');
      return;
    }

    const allImages = [
      { url: formData.imageUrl, caption: formData.businessName },
      ...formData.extraImages.map((u, i) => ({ url: u, caption: `${formData.businessName} - ছবি ${i + 2}` }))
    ];

    const campaignPayload: Omit<ManagedSponsoredCampaign, 'id' | 'createdAt'> = {
      businessName: formData.businessName.trim(),
      badge: formData.badge.trim() || 'স্পন্সরড পার্টনার',
      tagline: formData.tagline.trim(),
      shortDescription: formData.shortDescription.trim() || formData.tagline.trim(),
      fullDescription: formData.fullDescription.trim(),
      discountBadge: formData.discountBadge.trim() || 'বিশেষ অফার',
      couponCode: formData.couponCode.trim() || 'KUSHTIA',
      validTill: formData.validTill.trim(),
      location: formData.location.trim(),
      phone: formData.phone.trim(),
      whatsapp: formData.whatsapp.trim(),
      email: formData.email.trim(),
      openingHours: formData.openingHours.trim(),
      images: allImages,
      facilities: [
        'ভেরিফায়েড প্রিমিয়াম সেবা ও গুণগত মান',
        'সহজ পেমেন্ট ও আকর্ষণীয় ডিসকাউন্ট সুবিধা',
        'সার্বক্ষণিক কাস্টমার সাপোর্ট ও গ্যারান্টি'
      ],
      deals: [
        {
          id: 'deal-1',
          title: formData.tagline || 'এক্সক্লুসিভ অফার প্যাকেজ',
          originalPrice: 'মূল্যছাড়',
          offerPrice: formData.discountBadge,
          tag: 'ধামাকা অফার',
          image: formData.imageUrl
        }
      ],
      isActive: formData.isActive
    };

    if (editingCampaignId) {
      const updated = updateSponsoredCampaign(editingCampaignId, campaignPayload);
      setCampaigns(updated);
      showToast('স্পন্সরড বিজ্ঞাপন সফলভাবে আপডেট করা হয়েছে!');
    } else {
      const updated = createSponsoredCampaign(campaignPayload);
      setCampaigns(updated);
      showToast('নতুন স্পন্সরড বিজ্ঞাপন সফলভাবে তৈরি করা হয়েছে!');
    }

    setIsFormOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`আপনি কি নিশ্চিতভাবে "${name}" স্পন্সরড ক্যাম্পেইনটি মুছে ফেলতে চান?`)) {
      const updated = deleteSponsoredCampaign(id);
      setCampaigns(updated);
      showToast(`"${name}" বিজ্ঞাপনটি মুছে ফেলা হয়েছে।`);
    }
  };

  const handleSetCampaignActive = (id: string, name: string) => {
    const updated = setActiveSponsoredCampaign(id);
    setCampaigns(updated);
    showToast(`"${name}" বিজ্ঞাপনটি এখন মূল অ্যাপের হোমপেজে সক্রিয় করা হয়েছে!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-500/30 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. DEDICATED PICTURE UPLOAD STUDIO */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-200/80 shadow-sm space-y-5 bg-gradient-to-br from-white via-amber-50/30 to-amber-100/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200/60">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">স্পন্সরড পিকচার আপলোড ও ব্যানার স্টুডিও</h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                  ছবি যোগ করুন
                </span>
              </div>
              <p className="text-xs text-slate-600">
                এখানে আপনার মোবাইল বা কম্পিউটার থেকে বিজ্ঞাপন ব্যানার বা প্রতিষ্ঠানের ছবি আপলোড করুন
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন স্পন্সর ক্যাম্পেইন লিখুন</span>
          </button>
        </div>

        {/* Upload Dropzone & URL Input Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          <div 
            className={`lg:col-span-7 rounded-2xl border-2 border-dashed p-6 text-center flex flex-col items-center justify-center transition-all cursor-pointer bg-white ${
              isDragOver 
                ? 'border-amber-500 bg-amber-50/60 scale-[1.01]' 
                : 'border-amber-300/80 hover:border-amber-500 hover:bg-amber-50/30'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              processImageFiles(e.dataTransfer.files);
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => processImageFiles(e.target.files)}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3 shadow-xs">
              <Upload className="w-7 h-7 text-amber-700" />
            </div>
            <div className="text-sm font-black text-slate-900 mb-1">
              এখানে ক্লিক করে ছবি নির্বাচন করুন বা ড্র্যাগ করে ছেড়ে দিন
            </div>
            <p className="text-xs text-slate-500 max-w-sm mb-3">
              কুষ্টিয়ায়র যেকোনো দোকান, রেস্তোরাঁ, শপিং মল বা ব্যানারের ছবি (JPG, PNG, WebP)
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-[11px] font-bold">
              <FolderOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>ডিভাইস ফাইল ব্রাউজ করুন</span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-pink-200/80/90 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 mb-1">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>ছবির অনলাইন লিংক (URL) দিয়ে যুক্ত করুন</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                ফেসবুক, গুগল ড্রাইভ বা যেকোনো ওয়েবসাইটের ডিরেক্ট ইমেজ লিংক পেস্ট করে যুক্ত করতে পারেন।
              </p>

              <form onSubmit={handleAddUrlPicture} className="space-y-2">
                <input
                  type="url"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="https://example.com/banner-photo.jpg"
                  className="w-full px-3 py-2 bg-slate-50 border border-pink-200/80 rounded-xl text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={!customUrlInput.trim()}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>গ্যালারিতে লিংক যুক্ত করুন</span>
                </button>
              </form>
            </div>

            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/50 text-[11px] text-amber-900 font-medium">
              💡 <strong>টিপস:</strong> ছবি আপলোড করার পর সরাসরি সেই ছবি দিয়ে নিচে "ক্যাম্পেইন তৈরি করুন" বাটনে ক্লিক করে ব্যানার পাবলিশ করতে পারবেন।
            </div>
          </div>
        </div>

        {/* Uploaded & Ready Picture Gallery */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                প্রস্তুত ছবি ও ব্যানার গ্যালারি ({customPictures.length + SAMPLE_BANNER_IMAGES.length}টি ছবি পাওয়া গেছে)
              </h4>
            </div>
            <span className="text-[11px] text-slate-500">যেকোনো ছবিতে ক্লিক করে সরাসরি ক্যাম্পেইন তৈরি করুন</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {customPictures.map((pic) => (
              <div
                key={pic.id}
                className="group relative bg-white rounded-2xl overflow-hidden border border-amber-300 shadow-2xs hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  <img
                    src={pic.url}
                    alt={pic.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-1.5 left-1.5 bg-emerald-700 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                    আপনার আপলোড
                  </span>
                  <button
                    onClick={(e) => removeCustomPicture(pic.id, e)}
                    className="absolute top-1.5 right-1.5 p-1 bg-slate-900/80 hover:bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="ছবি ডিলিট করুন"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setEnlargedImageUrl(pic.url)}
                    className="absolute bottom-1.5 right-1.5 p-1 bg-slate-900/80 hover:bg-slate-900 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="বড় করে দেখুন"
                  >
                    <ZoomIn className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-2 flex-1 flex flex-col justify-between gap-1.5">
                  <p className="text-[11px] font-bold text-slate-800 line-clamp-1">{pic.title}</p>
                  <button
                    onClick={() => handleOpenCreateWithImage(pic.url, pic.title)}
                    className="w-full py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[10px] font-black flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>এই ছবি ব্যবহার করুন</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}

            {SAMPLE_BANNER_IMAGES.map((preset, idx) => (
              <div
                key={`preset-${idx}`}
                className="group relative bg-white rounded-2xl overflow-hidden border border-pink-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-1.5 left-1.5 bg-slate-900/80 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                    {preset.tag}
                  </span>
                  <button
                    onClick={() => setEnlargedImageUrl(preset.url)}
                    className="absolute bottom-1.5 right-1.5 p-1 bg-slate-900/80 hover:bg-slate-900 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="বড় করে দেখুন"
                  >
                    <ZoomIn className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-2 flex-1 flex flex-col justify-between gap-1.5">
                  <p className="text-[11px] font-bold text-slate-800 line-clamp-1">{preset.name}</p>
                  <button
                    onClick={() => handleOpenCreateWithImage(preset.url, preset.name)}
                    className="w-full py-1 bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-950 rounded-lg text-[10px] font-black flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>বিজ্ঞাপন তৈরি</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. ACTIVE CAMPAIGN LIVE BANNER PREVIEW */}
      {activeCampaign && (
        <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                বর্তমানে মূল অ্যাপের হোমপেজে লাইভ ব্যানার (Live Banner Preview)
              </span>
            </div>
            <button
              onClick={() => setPreviewCampaign(activeCampaign)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>সম্পূর্ণ ডিটেইলস প্রিভিউ</span>
            </button>
          </div>

          <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden border border-emerald-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                  <span className="bg-amber-400 text-amber-950 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                    Sponsored
                  </span>
                  <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>{activeCampaign.discountBadge}</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
                    {activeCampaign.badge}
                  </span>
                </div>

                <div className="text-base font-black text-white pr-4 line-clamp-1">
                  {activeCampaign.businessName} • {activeCampaign.tagline}
                </div>

                <p className="text-xs text-slate-300 leading-snug line-clamp-2 mt-1 mb-3">
                  {activeCampaign.shortDescription || activeCampaign.fullDescription.slice(0, 110)}
                </p>

                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-bold text-slate-900 bg-white px-3 py-1 rounded-xl shadow-xs">
                    অফার ও বিস্তারিত দেখুন
                  </span>
                  <span className="text-xs text-amber-300 font-mono font-bold">
                    কুপন কোড: {activeCampaign.couponCode}
                  </span>
                  <span className="text-xs text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span className="truncate max-w-[200px]">{activeCampaign.location}</span>
                  </span>
                </div>
              </div>

              <div 
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 border-2 border-white/20 shadow-md relative group cursor-pointer"
                onClick={() => setEnlargedImageUrl(activeCampaign.images?.[0]?.url || SAMPLE_BANNER_IMAGES[0].url)}
              >
                <img
                  src={activeCampaign.images?.[0]?.url || SAMPLE_BANNER_IMAGES[0].url}
                  alt={activeCampaign.businessName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
                  বড় করে দেখুন
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CAMPAIGNS LIST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-sm font-black text-slate-900">
            সকল স্পন্সরড ক্যাম্পেইনের তালিকা ({campaigns.length} টি)
          </h4>
          <span className="text-xs text-slate-500">
            যেকোনো ক্যাম্পেইনের পাশে 'সক্রিয় করুন' চাপলে তা হোমপেজে লাইভ হবে
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className={`bg-white rounded-3xl p-5 border transition-all shadow-xs flex flex-col justify-between ${
                camp.isActive ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-pink-200/80/80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-14 h-14 rounded-2xl overflow-hidden border border-pink-200/80 shadow-2xs shrink-0 cursor-pointer relative group"
                      onClick={() => setEnlargedImageUrl(camp.images?.[0]?.url || SAMPLE_BANNER_IMAGES[0].url)}
                    >
                      <img
                        src={camp.images?.[0]?.url || SAMPLE_BANNER_IMAGES[0].url}
                        alt={camp.businessName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[9px]">
                        জুম
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                          {camp.badge}
                        </span>
                        {camp.isActive ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>মূল অ্যাপে সক্রিয়</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            নিষ্ক্রিয়
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1">{camp.businessName}</h4>
                    </div>
                  </div>

                  <span className="text-[11px] font-black px-2 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                    {camp.discountBadge}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mb-2 font-medium">
                  {camp.tagline}
                </p>

                <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-pink-100 space-y-1 mb-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="line-clamp-1">{camp.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{camp.phone}</span>
                    </span>
                    <span className="font-mono font-bold text-emerald-700">
                      কুপন: {camp.couponCode}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 line-clamp-2 italic mb-3">
                  "{camp.fullDescription}"
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-pink-100 gap-2">
                <div>
                  {!camp.isActive ? (
                    <button
                      onClick={() => handleSetCampaignActive(camp.id, camp.businessName)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1"
                    >
                      <Radio className="w-3 h-3" />
                      <span>সক্রিয় করুন</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>বর্তমানে চলছে</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPreviewCampaign(camp)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="প্রিভিউ দেখুন"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(camp)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="সম্পাদনা করুন"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(camp.id, camp.businessName)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. CREATE / EDIT CAMPAIGN MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 border border-pink-200/80 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-pink-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {editingCampaignId ? 'স্পন্সরড বিজ্ঞাপন সম্পাদনা' : 'নতুন স্পন্সরড বিজ্ঞাপন তৈরি'}
                  </h3>
                  <p className="text-xs text-slate-500">ছবি নির্বাচন করুন এবং বিজ্ঞাপনের সম্পূর্ণ তথ্য পূরণ করুন</p>
                </div>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-amber-700" />
                    <span>বিজ্ঞাপনের প্রধান ছবি / ব্যানার পিকচার (Required Picture)</span>
                  </label>
                  <span className="text-[11px] text-amber-800 font-bold">হোমপেজ ব্যানারে বড় করে দেখাবে</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3.5 items-start">
                  <div className="w-32 h-24 rounded-2xl overflow-hidden bg-slate-200 border-2 border-amber-300 shrink-0 shadow-sm relative group">
                    <img
                      src={formData.imageUrl}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      onClick={() => setEnlargedImageUrl(formData.imageUrl)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold"
                    >
                      বড় প্রিভিউ
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-white text-[9px] text-center py-0.5 font-bold">
                      নির্বাচিত ছবি
                    </div>
                  </div>

                  <div className="flex-1 w-full space-y-2.5">
                    <div className="flex items-center gap-2">
                      <label className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs">
                        <Upload className="w-4 h-4" />
                        <span>ডিভাইস থেকে নতুন ছবি আপলোড</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFormFileSelect}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-slate-500">বা নিচের লিংক বক্স ব্যবহার করুন</span>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="ছবির লিংক বা URL পেস্ট করুন..."
                        className="w-full px-3 py-2 bg-white border border-pink-200/80 rounded-xl text-xs font-medium focus:outline-none focus:border-amber-600"
                      />
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-slate-500 mb-1">কুইক প্রিসেট গ্যালারি থেকে ছবি বেছে নিন:</div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {SAMPLE_BANNER_IMAGES.slice(0, 5).map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, imageUrl: preset.url }))}
                            className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${
                              formData.imageUrl === preset.url
                                ? 'bg-amber-600 text-slate-950 border-amber-600'
                                : 'bg-white text-slate-700 border-pink-200/80 hover:bg-slate-100'
                            }`}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    ব্যবসা বা প্রতিষ্ঠানের নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                    placeholder="যেমন: কুষ্টিয়া সিটি প্লাজা অ্যান্ড সুপার মল"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-xl text-xs font-medium focus:outline-none focus:border-pink-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    স্পন্সরড ব্যাজ বা ট্যাগ
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                    placeholder="যেমন: ভেরিফায়েড পার্টনার, এক্সক্লুসিভ স্পন্সর"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-xl text-xs font-medium focus:outline-none focus:border-pink-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    ক্যাম্পেইন হেডলাইন / স্লোগান *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tagline}
                    onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                    placeholder="যেমন: ঈদ ও বৈশাখ স্পেশাল মেগা ডিসকাউন্ট মেলা!"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-xl text-xs font-medium focus:outline-none focus:border-pink-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    ডিসকাউন্ট বা অফার ব্যাজ
                  </label>
                  <input
                    type="text"
                    value={formData.discountBadge}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountBadge: e.target.value }))}
                    placeholder="যেমন: ৫০% পর্যন্ত ছাড়, বাই ১ গেট ১"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-xl text-xs font-medium focus:outline-none focus:border-pink-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-900 block mb-1 flex items-center justify-between">
                  <span>বিজ্ঞাপনের বিস্তারিত বিবরণ (Full Description) *</span>
                  <span className="text-[11px] font-normal text-slate-400">মূল অ্যাপের ডিটেইলস পেজে বড় করে দেখাবে</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullDescription: e.target.value }))}
                  placeholder="এখানে অফার, পণ্যের তালিকা, বিশেষ সুযোগ-সুবিধা এবং আকর্ষণীয় বিস্তারিত লিখুন..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-xl text-xs font-medium focus:outline-none focus:border-pink-600 focus:bg-white leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  হোমপেজ ব্যানারের সংক্ষিপ্ত বিবরণ (Short Summary)
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  placeholder="হোমপেজ ব্যানারে এক/দুই লাইনের সংক্ষিপ্ত কথা..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-xl text-xs font-medium focus:outline-none focus:border-pink-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">কুপন কোড</label>
                  <input
                    type="text"
                    value={formData.couponCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, couponCode: e.target.value }))}
                    placeholder="যেমন: KUSHTIA50"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-pink-200/80 rounded-xl text-xs font-medium focus:outline-none focus:border-pink-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">অফারের মেয়াদ</label>
                  <input
                    type="text"
                    value={formData.validTill}
                    onChange={(e) => setFormData(prev => ({ ...prev, validTill: e.target.value }))}
                    placeholder="যেমন: ৩০ সেপ্টেম্বর পর্যন্ত"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-pink-200/80 rounded-xl text-xs font-medium focus:outline-none focus:border-pink-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">মোবাইল ফোন নম্বর</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="017xxxxxxxx"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-pink-200/80 rounded-xl text-xs font-medium focus:outline-none focus:border-pink-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">হোয়াটসঅ্যাপ নম্বর (দেশ কোড সহ)</label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                    placeholder="88017xxxxxxxx"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-pink-200/80 rounded-xl text-xs font-medium focus:outline-none focus:border-pink-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">ঠিকানা / লোকেশন</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="যেমন: শহীদ ডা. জিকরুল হক রোড, কুষ্টিয়া"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-pink-200/80 rounded-xl text-xs font-medium focus:outline-none focus:border-pink-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-pink-200/80">
                <div>
                  <div className="text-xs font-bold text-slate-800">হোমপেজে সরাসরি সক্রিয় করুন</div>
                  <div className="text-[11px] text-slate-500">চালু থাকলে এটি সেভ করার সাথে সাথে মূল অ্যাপে ব্যানার হিসেবে দেখাবে</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-pink-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-pink-200/80 text-slate-600 hover:bg-slate-50 text-xs font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20"
                >
                  {editingCampaignId ? 'বিজ্ঞাপন আপডেট ও সেভ করুন' : 'নতুন স্পন্সর বিজ্ঞাপন প্রকাশ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. IMAGE ZOOM / ENLARGED MODAL */}
      {enlargedImageUrl && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setEnlargedImageUrl(null)}
        >
          <div className="relative max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl p-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-3 text-white border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300">স্পন্সরড ব্যানার প্রিভিউ</span>
              <button
                onClick={() => setEnlargedImageUrl(null)}
                className="p-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[75vh] flex items-center justify-center p-2 bg-black/50">
              <img
                src={enlargedImageUrl}
                alt="Enlarged"
                className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-3 bg-slate-900 text-center">
              <button
                onClick={() => {
                  handleOpenCreateWithImage(enlargedImageUrl);
                  setEnlargedImageUrl(null);
                }}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs transition-colors"
              >
                এই ছবি দিয়ে সরাসরি বিজ্ঞাপন তৈরি করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. FULL CAMPAIGN DETAIL MODAL PREVIEW */}
      {previewCampaign && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden border border-pink-200/80 shadow-2xl space-y-4 my-8">
            <div className="relative h-48 bg-slate-900">
              <img
                src={previewCampaign.images?.[0]?.url || SAMPLE_BANNER_IMAGES[0].url}
                alt={previewCampaign.businessName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <button
                onClick={() => setPreviewCampaign(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/80"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-4 right-4">
                <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded">
                  {previewCampaign.badge}
                </span>
                <h3 className="text-lg font-black text-white mt-1 leading-snug">{previewCampaign.businessName}</h3>
                <p className="text-xs text-amber-300 font-bold">{previewCampaign.tagline}</p>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-amber-800 font-bold">বিশেষ অফার ও ডিসকাউন্ট</div>
                  <div className="text-sm font-black text-amber-950">{previewCampaign.discountBadge}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500">কুপন কোড</div>
                  <div className="text-xs font-mono font-bold text-emerald-800 bg-white px-2 py-1 rounded-md border border-pink-200/80">
                    {previewCampaign.couponCode}
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold text-slate-900 mb-1">বিস্তারিত বিবরণ:</h5>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-pink-100">
                  {previewCampaign.fullDescription}
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{previewCampaign.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{previewCampaign.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{previewCampaign.openingHours}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-pink-100 flex items-center justify-end">
                <button
                  onClick={() => setPreviewCampaign(null)}
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
