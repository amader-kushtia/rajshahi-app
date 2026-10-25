import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  Image as ImageIcon, 
  Shield, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CategoryType, PostItem } from '../types';
import { KUSHTIA_AREAS } from '../data/initialData';
import { uploadPostImage, createNewPost, compressImageToDataUrl } from '../services/postService';
import { FreeAdminPostNotice } from './FreeAdminPostNotice';
import { SecretInfoSecurityNotice } from './SecretInfoSecurityNotice';
import { 
  canUserPostInCategory, 
  isCategoryPublicPostable, 
  SERVICE_POSTING_POLICIES 
} from '../data/serviceCategoriesPolicy';

interface PostCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: CategoryType;
  onPostSuccess: () => void;
  isMemberPostingAllowed?: boolean;
}

export const PostCreateModal: React.FC<PostCreateModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'house-rent',
  onPostSuccess,
  isMemberPostingAllowed = false,
}) => {
  const { user, isAdmin } = useAuth();

  const [category, setCategory] = useState<PostItem['category']>(
    defaultCategory === 'crime-reporter' 
      ? 'crime-reporter' 
      : (defaultCategory === 'buy-sell' ? 'buy-sell' : (defaultCategory === 'services' ? 'services' : 'house-rent'))
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState(KUSHTIA_AREAS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [subcategory, setSubcategory] = useState('ফ্যামিলি বাসা');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [whatsapp, setWhatsapp] = useState(user?.phone || '');
  const [facebook, setFacebook] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(defaultCategory === 'crime-reporter');
  
  // Specific category fields
  const [rooms, setRooms] = useState('৩ রুম + ড্রয়িং');
  const [condition, setCondition] = useState<'নতুন' | 'ব্যবহৃত' | 'অরিজিনাল কন্ডিশন'>('ব্যবহৃত');
  const [crimeCategory, setCrimeCategory] = useState<'মাদক ব্যবসা' | 'দুর্নীতি' | 'চাঁদাবাজি' | 'অন্যান্য অপরাধ'>('মাদক ব্যবসা');

  // File Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [compressingImage, setCompressingImage] = useState(false);
  const [compressionStats, setCompressionStats] = useState<{ originalSize: string; compressedSize: string; savings: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setErrorMessage('শুধুমাত্র ছবি ফাইল নির্বাচন করুন।');
        return;
      }
      try {
        setCompressingImage(true);
        setErrorMessage('');
        const originalSizeKb = Math.round(file.size / 1024);

        // Compress image client-side to optimize bandwidth & speed for feed load
        const compressedDataUrl = await compressImageToDataUrl(file, 1000, 1000, 0.75);

        const base64Length = compressedDataUrl.length - (compressedDataUrl.indexOf(',') + 1);
        const compressedSizeKb = Math.round((base64Length * 3) / 4 / 1024);
        const savedPercent = Math.max(0, Math.round(((originalSizeKb - compressedSizeKb) / originalSizeKb) * 100));

        setImageFile(file);
        setImagePreview(compressedDataUrl);
        setCompressionStats({
          originalSize: originalSizeKb > 1024 ? `${(originalSizeKb / 1024).toFixed(1)} MB` : `${originalSizeKb} KB`,
          compressedSize: compressedSizeKb > 1024 ? `${(compressedSizeKb / 1024).toFixed(1)} MB` : `${compressedSizeKb} KB`,
          savings: `${savedPercent}%`
        });
      } catch (err) {
        console.error('Image compression preview error:', err);
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      } finally {
        setCompressingImage(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMessage('অতিথি হিসেবে পোস্ট করার অনুমতি নেই। পোস্ট প্রকাশ করতে প্রথমে লগইন করুন।');
      return;
    }

    // Enforce category-level permissions
    if (!canUserPostInCategory(category, isAdmin)) {
      const pol = SERVICE_POSTING_POLICIES[category];
      setErrorMessage(`"${pol?.label || category}" একটি সংরক্ষিত অফিশিয়াল সেবা। এতে সাধারণ নাগরিকদের সরাসরি পোস্ট করার অনুমতি নেই, শুধুমাত্র অনুমোদিত এডমিন পোস্ট করতে পারেন।`);
      return;
    }

    // Server-side enforcement: isMemberPostingAllowed check
    if (!isAdmin && !isMemberPostingAllowed && category !== 'crime-reporter' && !isCategoryPublicPostable(category)) {
      setErrorMessage('বর্তমানে সাধারণ নাগরিকদের সরাসরি পোস্ট করার অনুমতি নেই। পোস্ট করতে অ্যাডমিনের সাথে যোগাযোগ করুন।');
      return;
    }

    if (!title.trim()) {
      setErrorMessage('অনুগ্রহ করে পোস্টের একটি আকর্ষণীয় শিরোনাম লিখুন।');
      return;
    }
    if (title.trim().length > 150) {
      setErrorMessage('শিরোনাম সর্বোচ্চ ১৫০ অক্ষরের মধ্যে রাখুন।');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('অনুগ্রহ করে বিস্তারিত বিবরণ প্রদান করুন।');
      return;
    }
    if (description.trim().length > 2000) {
      setErrorMessage('বিবরণ সর্বোচ্চ ২০০০ অক্ষরের মধ্যে রাখুন।');
      return;
    }

    if (category === 'crime-reporter' && !imageFile) {
      setErrorMessage('গোপন তথ্য ও অপরাধের বিষয় পোস্ট করার জন্য অবশ্যই প্রমাণপত্র হিসেবে ছবি বা ডকুমেন্ট (Image/Proof) যুক্ত করতে হবে।');
      return;
    }

    try {
      setUploading(true);
      setErrorMessage('');

      let uploadedImageUrl = '';
      if (imageFile) {
        // Upload image to Firebase Storage
        uploadedImageUrl = await uploadPostImage(imageFile);
      } else {
        // Default category image
        if (category === 'house-rent') {
          uploadedImageUrl = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80';
        } else if (category === 'buy-sell') {
          uploadedImageUrl = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80';
        } else if (category === 'crime-reporter') {
          uploadedImageUrl = 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80';
        } else {
          uploadedImageUrl = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80';
        }
      }

      const finalAuthorName = isAnonymous ? 'সচেতন নাগরিক' : (user?.displayName || 'কুষ্টিয়া নাগরিক');
      const finalAuthorPhoto = isAnonymous 
        ? 'https://api.dicebear.com/7.x/bottts/svg?seed=anonymousCitizen'
        : (user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=citizen');

      const finalLocation = customLocation ? `${customLocation}, কুষ্টিয়া` : `${location}, কুষ্টিয়া`;

      const isPending = category === 'crime-reporter' || !isAdmin;

      const newPostData = {
        category,
        title: title.trim(),
        description: description.trim(),
        price: price ? (price.includes('৳') ? price : `${price} ৳`) : undefined,
        location: finalLocation,
        subcategory,
        contactPhone: contactPhone.trim() || '',
        whatsapp: whatsapp.trim() || contactPhone.trim() || '',
        facebook: facebook || undefined,
        imageUrl: uploadedImageUrl,
        authorName: finalAuthorName,
        authorPhoto: finalAuthorPhoto,
        authorId: user?.uid || 'guest-citizen',
        authorEmail: user?.email || undefined,
        authorPhone: user?.phone || contactPhone.trim() || undefined,
        isAnonymous: isAnonymous,
        isVerified: isAdmin ? true : (!isPending && !isAnonymous),
        status: (isAdmin ? 'approved' : (isPending ? 'pending' : 'approved')) as 'pending' | 'approved',
        approvedAt: isAdmin ? Date.now() : undefined,
        approvedBy: isAdmin ? (user?.displayName || 'Admin') : undefined,
        details: {
          rooms: category === 'house-rent' ? rooms : undefined,
          condition: category === 'buy-sell' ? condition : undefined,
          crimeCategory: category === 'crime-reporter' ? crimeCategory : undefined,
        }
      };

      await createNewPost(newPostData);
      
      if (isAdmin) {
        setSuccessMessage('পোস্টটি সফলভাবে তৈরি ও সরাসরি প্রকাশ করা হয়েছে!');
      } else {
        setSuccessMessage('প্রিয় ব্যবহারকারী, আপনার মূল্যবান পোস্টটি আমাদের অ্যাডমিন টিম যাচাই-বাছাই করছে। পোস্টটি প্রকাশের উপযুক্ত বিবেচিত হলে অবশ্যই পাবলিশ করা হবে। অনুগ্রহ করে কিছুক্ষণ ধৈর্য ধরে অপেক্ষা করুন। আপনার সহযোগিতাই আমাদের অনুপ্রেরণা।\n\n— আমার কুষ্টিয়া অ্যাডমিন টিম');
      }

      setTimeout(() => {
        onPostSuccess();
        onClose();
      }, 2000);

    } catch (err: any) {
      console.error('Submit post error:', err);
      setErrorMessage(err?.message || 'পোস্ট সংরক্ষণে সমস্যা হয়েছে, দয়া করে পুনরায় চেষ্টা করুন।');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-emerald-100 my-auto relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-100 mb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>নতুন পোস্ট তৈরি করুন</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">কুষ্টিয়া</span>
            </h3>
            <p className="text-xs text-slate-500">আপনার তথ্য মুহূর্তেই সমগ্র কুষ্টিয়া শহরের মানুষের কাছে পৌঁছাবে</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-800 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs font-bold text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Admin Review Notice Card */}
        <div className="mb-4 bg-pink-50 border border-pink-200 rounded-2xl p-3 text-xs text-pink-950 space-y-1 shadow-xs">
          <div className="font-bold flex items-center gap-1.5 text-pink-900 text-xs">
            <AlertTriangle className="w-3.5 h-3.5 text-pink-700" />
            <span>অ্যাডমিন যাচাই-বাছাই নোটিশ</span>
          </div>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line text-[11px]">
            প্রিয় ব্যবহারকারী, আপনার মূল্যবান পোস্টটি আমাদের অ্যাডমিন টিম যাচাই-বাছাই করছে। পোস্টটি প্রকাশের উপযুক্ত বিবেচিত হলে অবশ্যই পাবলিশ করা হবে। অনুগ্রহ করে কিছুক্ষণ ধৈর্য ধরে অপেক্ষা করুন। আপনার সহযোগিতাই আমাদের অনুপ্রেরণা।
            
            — আমার কুষ্টিয়া অ্যাডমিন টিম
          </p>
        </div>

        {/* Category Selector */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            ক্যাটাগরি নির্বাচন করুন *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'house-rent', label: 'বাসা ভাড়া' },
              { id: 'buy-sell', label: 'বাই-সেল' },
              { id: 'electrician', label: 'ইলেকট্রিশিয়ান' },
              { id: 'driver', label: 'ড্রাইভার' },
              { id: 'jobs', label: 'চাকরি' },
              { id: 'food', label: 'খাবার' },
              { id: 'lost-found', label: 'হারানো-প্রাপ্তি' },
              { id: 'crime-reporter', label: 'গোপন তথ্য' },
            ].map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => {
                  setCategory(item.id as any);
                  if (item.id === 'crime-reporter') setIsAnonymous(true);
                }}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                  category === item.id
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {!isAdmin && !isMemberPostingAllowed && category !== 'crime-reporter' ? (
          <FreeAdminPostNotice
            categoryName={
              category === 'house-rent' ? 'বাসা ভাড়া' : category === 'buy-sell' ? 'বাই-সেল' : 'লোকাল সেবা'
            }
            categoryId={category}
            user={user}
            onOpenCrimeReporter={() => {
              setCategory('crime-reporter');
              setIsAnonymous(true);
            }}
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">

          {/* Anonymous Post Toggle & Security Notice */}
          {category === 'crime-reporter' && (
            <div className="space-y-3 mb-4">
              <SecretInfoSecurityNotice compact />

              <div className="p-3 bg-indigo-50/80 border border-indigo-200/80 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-indigo-950 block">
                      পরিচয় গোপন রাখুন (Post Anonymously)
                    </span>
                    <span className="text-[11px] text-indigo-700">
                      লেখক হিসেবে 'সচেতন নাগরিক' প্রদর্শিত হবে
                    </span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-pink-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              পোস্টের শিরোনাম *
            </label>
            <input
              type="text"
              maxLength={150}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                category === 'house-rent'
                  ? 'যেমন: মজমপুর গেটে ৩ রুমের মনোরম ফ্যামিলি বাসা ভাড়া'
                  : category === 'buy-sell'
                  ? 'যেমন: ব্যবহৃত পালসার ১৫০সিসি ও রেডমি স্মার্টফোন'
                  : category === 'crime-reporter'
                  ? 'যেমন: কুষ্টিয়া কোর্ট স্টেশন সংলগ্ন এলাকায় রাতের বেলায় মাদক সেবন ও বিক্রয়'
                  : 'পোস্টের শিরোনাম লিখুন'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200/80 text-xs focus:outline-none focus:border-pink-600 focus:ring-1 focus:ring-emerald-600 font-medium"
              required
            />
          </div>

          {/* Category specific subcategories */}
          {category === 'house-rent' && (
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ধরন</label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-pink-200/80 text-xs font-medium focus:border-pink-600"
                >
                  <option value="ফ্যামিলি বাসা">ফ্যামিলি বাসা</option>
                  <option value="ব্যাচেলর মেস">ব্যাচেলর মেস</option>
                  <option value="সাবলেট">সাবলেট</option>
                  <option value="অফিস/দোকান">অফিস/দোকান</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">রুমের বিবরণ</label>
                <input
                  type="text"
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                  placeholder="যেমন: ৩ রুম, ২ বাথরুম"
                  className="w-full px-3 py-2 rounded-xl border border-pink-200/80 text-xs font-medium"
                />
              </div>
            </div>
          )}

          {category === 'buy-sell' && (
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">পণ্যের ক্যাটাগরি</label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-pink-200/80 text-xs font-medium focus:border-pink-600"
                >
                  <option value="স্মার্টফোন ও গ্যাজেট">স্মার্টফোন ও গ্যাজেট</option>
                  <option value="মোটরসাইকেল / বাইক">মোটরসাইকেল / বাইক</option>
                  <option value="ইলেকট্রনিক্স ও ফ্রিজ">ইলেকট্রনিক্স ও ফ্রিজ</option>
                  <option value="ঘরের আসবাবপত্র">ঘরের আসবাবপত্র</option>
                  <option value="অন্যান্য পণ্য">অন্যান্য পণ্য</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">কন্ডিশন</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-pink-200/80 text-xs font-medium"
                >
                  <option value="ব্যবহৃত">ব্যবহৃত (Used)</option>
                  <option value="নতুন">নতুন (Brand New)</option>
                  <option value="অরিজিনাল কন্ডিশন">অরিজিনাল কন্ডিশন</option>
                </select>
              </div>
            </div>
          )}

          {category === 'crime-reporter' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">অপরাধের ধরন</label>
              <select
                value={crimeCategory}
                onChange={(e) => setCrimeCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-pink-200/80 text-xs font-medium"
              >
                <option value="মাদক ব্যবসা">মাদক ব্যবসা ও সেবন</option>
                <option value="দুর্নীতি">সরকারি/বেসরকারি প্রতিষ্ঠানে দুর্নীতি</option>
                <option value="চাঁদাবাজি">ফুটপাত বা দোকানে চাঁদাবাজি</option>
                <option value="অন্যান্য অপরাধ">অন্যান্য সামাজিক অপরাধ</option>
              </select>
            </div>
          )}

          {/* Price & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {category !== 'crime-reporter' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মূল্য / ভাড়া (টাকা)
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="যেমন: ৮,৫০০"
                  className="w-full px-3 py-2 rounded-xl border border-pink-200/80 text-xs font-medium"
                />
              </div>
            )}

            <div className={category === 'crime-reporter' ? 'col-span-2' : ''}>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                কুষ্টিয়ায়র এলাকা নির্বাচন করুন *
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-pink-200/80 text-xs font-medium"
              >
                {KUSHTIA_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Specific custom road/address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              সুনির্দিষ্ট ঠিকানা / ল্যান্ডমার্ক
            </label>
            <input
              type="text"
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              placeholder="যেমন: রেলওয়ে কারখানা গেটের সামনে, মসজিদ গলি"
              className="w-full px-3 py-2 rounded-xl border border-pink-200/80 text-xs font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              বিস্তারিত বিবরণ *
            </label>
            <textarea
              rows={3}
              maxLength={2000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="পোস্টের সম্পূর্ণ বিবরণ লিখুন..."
              className="w-full px-3 py-2 rounded-xl border border-pink-200/80 text-xs font-medium focus:border-pink-600 focus:ring-1 focus:ring-emerald-600"
              required
            />
          </div>

          {/* Photo Upload to Firebase Storage with Auto Image Compression */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>ছবি যুক্ত করুন (স্বয়ংক্রিয় কম্প্রেস ও ফাস্ট আপলোড)</span>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">⚡ ফিড লোড অপ্টিমাইজড</span>
            </label>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <label className="cursor-pointer flex-1 border-2 border-dashed border-pink-300 hover:border-emerald-500 rounded-2xl p-4 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-emerald-50/20 transition-all">
                  {compressingImage ? (
                    <>
                      <Loader2 className="w-6 h-6 text-emerald-600 animate-spin mb-1" />
                      <span className="text-xs font-bold text-slate-700">ছবি কম্প্রেস করা হচ্ছে...</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">ফাইলের সাইজ ছোট করা হচ্ছে</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-6 h-6 text-emerald-700 mb-1" />
                      <span className="text-xs font-bold text-slate-700">ছবি নির্বাচন করুন</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG বা WEBP (স্বয়ংক্রিয় অপ্টিমাইজেশন)</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={compressingImage}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {imagePreview && (
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-pink-200/80 shrink-0 shadow-sm">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                        setCompressionStats(null);
                      }}
                      className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-0.5 shadow-sm"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {compressionStats && (
                <div className="p-2.5 bg-emerald-50/90 border border-emerald-200 rounded-xl flex items-center justify-between text-[11px] font-bold text-emerald-900 animate-in fade-in">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>ছবি সফলভাবে কম্প্রেস ও অপ্টিমাইজ করা হয়েছে!</span>
                  </div>
                  <span className="text-[10px] bg-emerald-200/80 text-emerald-950 px-2 py-0.5 rounded-md">
                    মূল সাইজ {compressionStats.originalSize} ➔ কম্প্রেসড {compressionStats.compressedSize} ({compressionStats.savings} ছোট)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Numbers (Hidden if Anonymous Crime Report) */}
          {!isAnonymous && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  যোগাযোগের ফোন নম্বর *
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="017xxxxxxxx"
                  className="w-full px-3 py-2 rounded-xl border border-pink-200/80 text-xs font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  হোয়াটসঅ্যাপ নম্বর (WhatsApp)
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="017xxxxxxxx"
                  className="w-full px-3 py-2 rounded-xl border border-pink-200/80 text-xs font-medium mb-3"
                />
                
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ফেসবুক প্রোফাইল লিংক (ঐচ্ছিক)
                </label>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/yourprofile"
                  className="w-full px-3 py-2 rounded-xl border border-pink-200/80 text-xs font-medium"
                />
              </div>
            </div>
          )}

          {/* Action Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>ফায়ারবেসে সংরক্ষণ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>পোস্ট প্রকাশ করুন</span>
                </>
              )}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};
