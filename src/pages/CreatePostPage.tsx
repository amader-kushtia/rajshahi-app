import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  UploadCloud, 
  Image as ImageIcon, 
  Shield, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Sparkles,
  Home,
  ShoppingBag,
  Wrench,
  AlertTriangle,
  Droplet,
  Check,
  Trash2,
  Info,
  Lock,
  ChevronRight,
  MessageCircle,
  Zap,
  Snowflake,
  Car,
  GraduationCap,
  Dog,
  Briefcase,
  PackageSearch,
  UtensilsCrossed,
  Scale,
  PartyPopper,
  Hammer,
  Smartphone,
  Bookmark,
  FileText,
  RotateCcw,
  Save,
  Search,
  Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AppThemeConfig, CategoryType, PostItem, PostDraftItem } from '../types';
import { KUSHTIA_AREAS } from '../data/initialData';
import { uploadPostImage, createNewPost, compressImageToDataUrl } from '../services/postService';
import { 
  saveLocalDraft, 
  autoSaveDraftProgress, 
  getAutoSavedProgress, 
  clearAutoSavedProgress, 
  deleteLocalDraft 
} from '../services/draftService';
import { FreeAdminPostNotice } from '../components/FreeAdminPostNotice';
import { SecretInfoSecurityNotice } from '../components/SecretInfoSecurityNotice';
import {
  SERVICE_POSTING_POLICIES,
  canUserPostInCategory,
  isCategoryPublicPostable,
  getPublicPostableCategories,
  ServicePostingPolicy
} from '../data/serviceCategoriesPolicy';

interface CreatePostPageProps {
  initialCategory?: CategoryType | string;
  onBack: () => void;
  onSuccess: (targetCategory: CategoryType) => void;
  appTheme?: AppThemeConfig;
  initialDraftId?: string;
}

export const CreatePostPage: React.FC<CreatePostPageProps> = ({
  initialCategory = 'house-rent',
  onBack,
  onSuccess,
  appTheme,
  initialDraftId,
}) => {
  const { user, firebaseUser, isAdmin, openAuthModal } = useAuth();
  const bloodHotline = appTheme?.bloodHelplinePhone || appTheme?.supportPhone || '01711224455';
  const cleanBloodHotline = bloodHotline.replace(/[^0-9]/g, '');

  // Check if non-admin arrived with an admin-only category
  const [adminNotice, setAdminNotice] = useState<string | null>(() => {
    if (initialCategory && !isAdmin && !isCategoryPublicPostable(initialCategory)) {
      const pol = SERVICE_POSTING_POLICIES[initialCategory];
      return pol?.adminOnlyReason || `"${pol?.label || initialCategory}" একটি সংরক্ষিত অফিশিয়াল সেবা। এতে শুধুমাত্র অনুমোদিত এডমিন পোস্ট ও তথ্য আপডেট করতে পারেন। সাধারণ নাগরিকদের জন্য নিচে উন্মুক্ত নাগরিক সেবায় পোস্ট করার ব্যবস্থা রয়েছে।`;
    }
    return null;
  });

  // Normalize category selection
  const normalizeInitialCategory = (cat?: CategoryType | string): PostItem['category'] => {
    if (!cat) return 'house-rent';
    if (!isAdmin && !isCategoryPublicPostable(cat)) {
      return 'house-rent';
    }
    if (SERVICE_POSTING_POLICIES[cat]) {
      return cat as PostItem['category'];
    }
    return 'house-rent';
  };

  const [category, setCategory] = useState<PostItem['category']>(normalizeInitialCategory(initialCategory));
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState(KUSHTIA_AREAS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [subcategory, setSubcategory] = useState('ফ্যামিলি বাসা');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [whatsapp, setWhatsapp] = useState(user?.phone || '');
  const [isAnonymous, setIsAnonymous] = useState(initialCategory === 'crime-reporter');

  // Category specific options
  const [rooms, setRooms] = useState('৩ রুম + ড্রয়িং');
  const [condition, setCondition] = useState<'নতুন' | 'ব্যবহৃত' | 'অরিজিনাল কন্ডিশন'>('ব্যবহৃত');
  const [crimeCategory, setCrimeCategory] = useState<'মাদক ব্যবসা' | 'দুর্নীতি' | 'চাঁদাবাজি' | 'ছিনতাই ও চুরি' | 'অন্যান্য অপরাধ'>('মাদক ব্যবসা');
  const [bloodGroup, setBloodGroup] = useState('A+');
  const [hospitalName, setHospitalName] = useState('কুষ্টিয়া ২৫০ শয্যা জেনারেল হাসপাতাল');
  const [experience, setExperience] = useState('৩+ বছরের বাস্তব অভিজ্ঞতা');
  const [driverLicense, setDriverLicense] = useState('পেশাদার ড্রাইভিং লাইসেন্স (প্রফেশনাল)');
  const [tutorSubject, setTutorSubject] = useState('গণিত, বিজ্ঞান ও ইংরেজি');
  const [jobType, setJobType] = useState('ফুল-টাইম');
  const [lostFoundType, setLostFoundType] = useState<'lost' | 'found'>('lost');
  const [companyName, setCompanyName] = useState('');
  const [foodType, setFoodType] = useState('মিষ্টি ও ডেইরি');
  const [cuisine, setCuisine] = useState('ঐতিহ্যবাহী বাঙালি');
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);


  // File Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [compressingImage, setCompressingImage] = useState(false);
  const [compressionStats, setCompressionStats] = useState<{ originalSize: string; compressedSize: string; savings: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showGuidelines, setShowGuidelines] = useState(false);

  // Draft & Autosave State
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(initialDraftId || null);
  const [lastAutoSavedTime, setLastAutoSavedTime] = useState<string | null>(null);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [pendingAutoSavedDraft, setPendingAutoSavedDraft] = useState<Partial<PostDraftItem> | null>(null);
  const [isDraftRestored, setIsDraftRestored] = useState(false);

  const loadDraftIntoForm = (d: Partial<PostDraftItem>) => {
    if (d.category) setCategory(d.category as any);
    if (d.title) setTitle(d.title);
    if (d.description) setDescription(d.description);
    if (d.price) setPrice(d.price.replace('৳', '').trim());
    if (d.location) setLocation(d.location.replace(', কুষ্টিয়া', ''));
    if (d.customLocation) setCustomLocation(d.customLocation);
    if (d.subcategory) setSubcategory(d.subcategory);
    if (d.contactPhone) setContactPhone(d.contactPhone);
    if (d.whatsapp) setWhatsapp(d.whatsapp);
    if (typeof d.isAnonymous === 'boolean') setIsAnonymous(d.isAnonymous);
    if (d.imagePreview) setImagePreview(d.imagePreview);
    if (d.id) setCurrentDraftId(d.id);

      if (d.details) {
        if (d.details.rooms) setRooms(d.details.rooms);
        if (d.details.condition) setCondition(d.details.condition);
        if (d.details.crimeCategory) setCrimeCategory(d.details.crimeCategory);
        if (d.details.bloodGroup) setBloodGroup(d.details.bloodGroup);
        if (d.details.hospitalName) setHospitalName(d.details.hospitalName);
        if (d.details.experience) setExperience(d.details.experience);
        if (d.details.driverLicense) setDriverLicense(d.details.driverLicense);
        if (d.details.tutorSubject) setTutorSubject(d.details.tutorSubject);
        if (d.details.jobType) setJobType(d.details.jobType);
        if (d.details.companyName) setCompanyName(d.details.companyName);
        if (d.details.lostFoundType) setLostFoundType(d.details.lostFoundType);
        if (d.details.foodType) setFoodType(d.details.foodType);
        if (d.details.cuisine) setCuisine(d.details.cuisine);
        if (typeof d.details.deliveryAvailable === 'boolean') setDeliveryAvailable(d.details.deliveryAvailable);
      }

  };

  useEffect(() => {
    try {
      const activeDraftRaw = localStorage.getItem('kushtia_active_editing_draft');
      if (activeDraftRaw) {
        const d: PostDraftItem = JSON.parse(activeDraftRaw);
        localStorage.removeItem('kushtia_active_editing_draft');
        loadDraftIntoForm(d);
        setIsDraftRestored(true);
        setCurrentDraftId(d.id);
        return;
      }
    } catch (e) {
      console.warn('Error reading active editing draft:', e);
    }

    const autoDraft = getAutoSavedProgress();
    if (autoDraft && (autoDraft.title || autoDraft.description)) {
      setPendingAutoSavedDraft(autoDraft);
    }
  }, []);

  const handleRestoreAutosave = () => {
    if (pendingAutoSavedDraft) {
      loadDraftIntoForm(pendingAutoSavedDraft);
      setPendingAutoSavedDraft(null);
      setIsDraftRestored(true);
      setSuccessMessage('পূর্ববর্তী খসড়াটি সফলভাবে লোড করা হয়েছে!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleDiscardAutosave = () => {
    clearAutoSavedProgress();
    setPendingAutoSavedDraft(null);
  };

  // Auto-save post progress to localStorage every 30 seconds to prevent data loss during network interruptions
  useEffect(() => {
    const timer = setInterval(() => {
      if (title.trim() || description.trim()) {
        const payload: Partial<PostDraftItem> = {
          id: currentDraftId || undefined,
          category,
          title: title.trim(),
          description: description.trim(),
          price: price.trim(),
          location,
          customLocation: customLocation.trim(),
          subcategory,
          contactPhone: contactPhone.trim(),
          whatsapp: whatsapp.trim(),
          isAnonymous,
          imagePreview,
          authorId: user?.uid || 'guest-citizen',
          authorName: isAnonymous ? 'সচেতন নাগরিক' : (user?.displayName || 'নাগরিক'),
          isAutoSaved: true,
          details: {
            rooms: category === 'house-rent' ? rooms : undefined,
            condition: category === 'buy-sell' ? condition : undefined,
            crimeCategory: category === 'crime-reporter' ? crimeCategory : undefined,
            bloodGroup: category === 'blood' ? bloodGroup : undefined,
            hospitalName: category === 'blood' ? hospitalName : undefined,
            experience: ['electrician', 'plumber', 'ac-mechanic', 'driver', 'tutor', 'vet'].includes(category) ? experience : undefined,
            driverLicense: category === 'driver' ? driverLicense : undefined,
            tutorSubject: category === 'tutor' ? tutorSubject : undefined,
            jobType: category === 'jobs' ? jobType : undefined,
            companyName: category === 'jobs' ? companyName : undefined,
            lostFoundType: category === 'lost-found' ? lostFoundType : undefined,
            foodType: category === 'food' ? foodType : undefined,
            cuisine: category === 'food' ? cuisine : undefined,
            deliveryAvailable: category === 'food' ? deliveryAvailable : undefined
          }
        };

        autoSaveDraftProgress(payload);
        const d = new Date();
        const timeStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
        setLastAutoSavedTime(timeStr);
      }
    }, 30000);

    return () => clearInterval(timer);
  }, [category, title, description, price, location, customLocation, subcategory, contactPhone, whatsapp, isAnonymous, imagePreview, rooms, condition, crimeCategory, bloodGroup, hospitalName, experience, driverLicense, tutorSubject, jobType, companyName, lostFoundType, currentDraftId, user]);

  const handleSaveAsDraft = () => {
    setIsDraftSaving(true);
    setErrorMessage('');
    try {
      const draftObj = saveLocalDraft({
        id: currentDraftId || undefined,
        category,
        title: title.trim() || 'শিরোনামহীন খসড়া',
        description: description.trim(),
        price: price.trim(),
        location,
        customLocation: customLocation.trim(),
        subcategory,
        contactPhone: contactPhone.trim(),
        whatsapp: whatsapp.trim(),
        isAnonymous,
        imagePreview,
        authorId: user?.uid || 'guest-citizen',
        authorName: isAnonymous ? 'সচেতন নাগরিক' : (user?.displayName || 'কুষ্টিয়া নাগরিক'),
        details: {
          rooms: category === 'house-rent' ? rooms : undefined,
          condition: category === 'buy-sell' ? condition : undefined,
          crimeCategory: category === 'crime-reporter' ? crimeCategory : undefined,
          bloodGroup: category === 'blood' ? bloodGroup : undefined,
          hospitalName: category === 'blood' ? hospitalName : undefined,
          experience: ['electrician', 'plumber', 'ac-mechanic', 'driver', 'tutor', 'vet'].includes(category) ? experience : undefined,
          driverLicense: category === 'driver' ? driverLicense : undefined,
          tutorSubject: category === 'tutor' ? tutorSubject : undefined,
          jobType: category === 'jobs' ? jobType : undefined,
          companyName: category === 'jobs' ? companyName : undefined,
          lostFoundType: category === 'lost-found' ? lostFoundType : undefined,
          foodType: category === 'food' ? foodType : undefined,
          cuisine: category === 'food' ? cuisine : undefined,
          deliveryAvailable: category === 'food' ? deliveryAvailable : undefined
        }
      });

      setCurrentDraftId(draftObj.id);
      setSuccessMessage('খসড়াটি লোকাল স্টোরেজে সফলভাবে সংরক্ষিত হয়েছে! কোনো পাবলিক পুশ নোটিফিকেশন তৈরি হয়নি। প্রোফাইলের "খসড়া" ট্যাবে এটি পাওয়া যাবে।');
      setTimeout(() => setSuccessMessage(''), 4500);
    } catch (e: any) {
      setErrorMessage('খসড়া সেভ করতে সমস্যা হয়েছে।');
    } finally {
      setIsDraftSaving(false);
    }
  };

  const categoriesConfig = useMemo(() => {
    const list = isAdmin ? Object.values(SERVICE_POSTING_POLICIES) : getPublicPostableCategories();
    return list.map(item => ({
      id: item.id as PostItem['category'],
      name: item.label,
      englishName: item.englishLabel,
      icon: item.icon,
      color: item.allowPublicPost ? 'from-emerald-700 to-teal-800' : 'from-amber-600 to-rose-700',
      badge: item.badge,
      group: item.group,
      groupLabel: item.groupLabel,
      allowPublicPost: item.allowPublicPost,
      adminOnlyReason: item.adminOnlyReason,
      subcategories: item.subcategories
    }));
  }, [isAdmin]);

  const [categorySearch, setCategorySearch] = useState('');
  const [categoryFilterGroup, setCategoryFilterGroup] = useState<string>('all');

  const filteredCategoriesConfig = useMemo(() => {
    return categoriesConfig.filter(cat => {
      // Group filter
      if (categoryFilterGroup === 'admin-only') {
        if (cat.allowPublicPost) return false;
      } else if (categoryFilterGroup === 'public') {
        if (!cat.allowPublicPost) return false;
      } else if (categoryFilterGroup !== 'all' && cat.group !== categoryFilterGroup) {
        return false;
      }

      // Search filter
      const q = categorySearch.trim().toLowerCase();
      if (q) {
        const matchName = cat.name.toLowerCase().includes(q);
        const matchEng = cat.englishName?.toLowerCase().includes(q);
        const matchGroup = cat.groupLabel.toLowerCase().includes(q);
        const matchBadge = cat.badge.toLowerCase().includes(q);
        if (!matchName && !matchEng && !matchGroup && !matchBadge) return false;
      }

      return true;
    });
  }, [categoriesConfig, categoryFilterGroup, categorySearch]);

  const handleCategorySelect = (selectedId: PostItem['category']) => {
    if (!canUserPostInCategory(selectedId, isAdmin)) {
      const pol = SERVICE_POSTING_POLICIES[selectedId];
      setErrorMessage(`"${pol?.label || selectedId}" একটি সংরক্ষিত অফিশিয়াল সেবা। এটি শুধুমাত্র অনুমোদিত এডমিন পোস্ট করতে পারেন।`);
      return;
    }
    setCategory(selectedId);
    setErrorMessage('');
    setAdminNotice(null);
    
    // Auto-set subcategory default for the chosen category
    const cfg = categoriesConfig.find(c => c.id === selectedId);
    if (cfg && cfg.subcategories.length > 0) {
      setSubcategory(cfg.subcategories[0]);
    }

    if (selectedId === 'crime-reporter') {
      setIsAnonymous(true);
    } else {
      setIsAnonymous(false);
    }
  };

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

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setCompressionStats(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) {
      setErrorMessage('পোস্ট করতে অ্যাকাউন্ট তৈরি করুন অথবা লগইন করুন।');
      openAuthModal();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }


    // Enforce category-level public vs admin permissions
    if (!canUserPostInCategory(category, isAdmin)) {
      const pol = SERVICE_POSTING_POLICIES[category];
      setErrorMessage(`"${pol?.label || category}" একটি সংরক্ষিত অফিশিয়াল সেবা। এতে সাধারণ নাগরিকদের সরাসরি পোস্ট করার অনুমতি নেই, শুধুমাত্র অনুমোদিত এডমিন পোস্ট করতে পারেন।`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Check system-level posting permission if applicable
    if (!isAdmin && !appTheme?.isMemberPostingAllowed && category !== 'crime-reporter' && !isCategoryPublicPostable(category)) {
      setErrorMessage('বর্তমানে এই সেবায় সাধারণ নাগরিকদের সরাসরি পোস্ট করার অনুমতি নেই। পোস্ট করতে অ্যাডমিনের সাথে যোগাযোগ করুন।');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!title.trim()) {
      setErrorMessage('অনুগ্রহ করে পোস্টের একটি আকর্ষণীয় শিরোনাম লিখুন।');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (title.trim().length > 150) {
      setErrorMessage('শিরোনাম সর্বোচ্চ ১৫০ অক্ষরের মধ্যে রাখুন।');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!description.trim()) {
      setErrorMessage('অনুগ্রহ করে বিস্তারিত বিবরণ প্রদান করুন।');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (description.trim().length > 2000) {
      setErrorMessage('বিবরণ সর্বোচ্চ ২০০০ অক্ষরের মধ্যে রাখুন।');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if ((category === 'blood' || (category as string) === 'blood-request') && !isAdmin) {
      setErrorMessage(`রক্তের আবেদন সাধারণ নাগরিক নিজে থেকে পোস্ট করতে পারবেন না। শুধুমাত্র এডমিন পোস্ট করতে পারবেন। রক্ত লাগলে অবশ্যই এডমিন হেল্পলাইনে যোগাযোগ করতে হবে (${bloodHotline})।`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (category === 'crime-reporter' && !imageFile) {
      setErrorMessage('গোপন তথ্য ও অপরাধের বিষয় পোস্ট করার জন্য অবশ্যই প্রমাণপত্র হিসেবে ছবি বা ফাইল (Image/Proof) যুক্ত করতে হবে।');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setUploading(true);
      setErrorMessage('');

      let uploadedImageUrl = '';
      if (imageFile) {
        uploadedImageUrl = await uploadPostImage(imageFile);
      } else {
        // High quality fallback based on selected category
        if (category === 'house-rent') {
          uploadedImageUrl = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80';
        } else if (category === 'buy-sell') {
          uploadedImageUrl = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80';
        } else if (category === 'electrician') {
          uploadedImageUrl = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80';
        } else if (category === 'plumber') {
          uploadedImageUrl = 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80';
        } else if (category === 'ac-mechanic') {
          uploadedImageUrl = 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80';
        } else if (category === 'driver') {
          uploadedImageUrl = 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80';
        } else if (category === 'tutor') {
          uploadedImageUrl = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80';
        } else if (category === 'vet') {
          uploadedImageUrl = 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=800&auto=format&fit=crop&q=80';
        } else if (category === 'crime-reporter') {
          uploadedImageUrl = 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80';
        } else if (category === 'blood') {
          uploadedImageUrl = 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop&q=80';
        } else if (category === 'jobs') {
          uploadedImageUrl = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80';
        } else if (category === 'lost-found') {
          uploadedImageUrl = 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80';
        } else if (category === 'food') {
          uploadedImageUrl = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80';
        } else if (category === 'legal') {
          uploadedImageUrl = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80';
        } else if (category === 'events') {
          uploadedImageUrl = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=80';
        } else {
          uploadedImageUrl = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80';
        }
      }

      const finalAuthorName = isAnonymous ? 'সচেতন নাগরিক' : (user?.displayName || 'কুষ্টিয়া নাগরিক');
      const finalAuthorPhoto = isAnonymous 
        ? 'https://api.dicebear.com/7.x/bottts/svg?seed=anonymousCitizen'
        : (user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=citizen');

      const finalLocation = customLocation.trim() 
        ? `${customLocation.trim()}, কুষ্টিয়া` 
        : `${location}, কুষ্টিয়া`;

      const isAdminOfficialPost = isAdmin && !isCategoryPublicPostable(category);
      const isPending = category === 'crime-reporter' || !isAdmin;

      const newPostData = {
        category,
        title: title.trim(),
        description: description.trim(),
        price: price.trim() ? (price.includes('৳') ? price.trim() : `${price.trim()} ৳`) : undefined,
        location: finalLocation,
        subcategory,
        contactPhone: contactPhone.trim() || '',
        whatsapp: whatsapp.trim() || contactPhone.trim() || '',
        imageUrl: uploadedImageUrl,
        authorName: isAdminOfficialPost ? (user?.displayName ? `${user.displayName} (অফিশিয়াল)` : 'আমার কুষ্টিয়া অফিশিয়াল') : finalAuthorName,
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
          bloodGroup: category === 'blood' ? bloodGroup : undefined,
          hospitalName: category === 'blood' ? hospitalName : undefined,
          experience: ['electrician', 'plumber', 'ac-mechanic', 'driver', 'tutor', 'vet'].includes(category) ? experience : undefined,
          driverLicense: category === 'driver' ? driverLicense : undefined,
          tutorSubject: category === 'tutor' ? tutorSubject : undefined,
          jobType: category === 'jobs' ? jobType : undefined,
          companyName: category === 'jobs' ? companyName : undefined,
          lostFoundType: category === 'lost-found' ? lostFoundType : undefined,
          foodType: category === 'food' ? foodType : undefined,
          cuisine: category === 'food' ? cuisine : undefined,
          deliveryAvailable: category === 'food' ? deliveryAvailable : undefined
        }
      };


      await createNewPost(newPostData);
      
      clearAutoSavedProgress();
      if (currentDraftId) {
        deleteLocalDraft(currentDraftId);
      }

      if (isAdmin) {
        setSuccessMessage('পোস্টটি সফলভাবে তৈরি ও সরাসরি প্রকাশ করা হয়েছে!');
      } else {
        setSuccessMessage('প্রিয় ব্যবহারকারী, আপনার মূল্যবান পোস্টটি আমাদের অ্যাডমিন টিম যাচাই-বাছাই করছে। পোস্টটি প্রকাশের উপযুক্ত বিবেচিত হলে অবশ্যই পাবলিশ করা হবে। অনুগ্রহ করে কিছুক্ষণ ধৈর্য ধরে অপেক্ষা করুন। আপনার সহযোগিতাই আমাদের অনুপ্রেরণা।\n\n— আমার কুষ্টিয়া অ্যাডমিন টিম');
      }

      setTimeout(() => {
        onSuccess(category as CategoryType);
      }, 2000);

    } catch (err: any) {
      console.error('Submit post error:', err);
      setErrorMessage(err?.message || 'পোস্ট সংরক্ষণে সমস্যা হয়েছে, দয়া করে ইন্টারনেট সংযোগ চেক করে পুনরায় চেষ্টা করুন।');
    } finally {
      setUploading(false);
    }
  };

  const activeCategoryData = categoriesConfig.find(c => c.id === category);

  return (
    <div className="space-y-4 animate-in fade-in duration-200 pb-12 max-w-3xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-pink-200/80/90 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-pink-50 text-slate-700 hover:text-pink-800 transition-colors flex items-center justify-center shrink-0 border border-pink-200/80/60"
            title="ফিরে যান"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900">
                নতুন পোস্ট তৈরি করুন
              </h1>
              <span className="text-[10px] bg-pink-100 text-pink-800 font-bold px-2 py-0.5 rounded-full">
                কুষ্টিয়া
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              আপনার তথ্য মুহূর্তেই সমগ্র কুষ্টিয়া শহরের মানুষের কাছে পৌঁছাবে
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowGuidelines(!showGuidelines)}
          className="p-2.5 rounded-2xl bg-slate-50 hover:bg-pink-50 text-slate-600 hover:text-pink-800 border border-pink-200/80/60 transition-colors text-xs font-bold flex items-center gap-1 shrink-0"
          title="পোস্ট করার নিয়মাবলী"
        >
          <Info className="w-4 h-4 text-pink-700" />
          <span className="hidden sm:inline">নিয়মাবলী</span>
        </button>
      </div>

      {/* Guidelines Drawer Card */}
      {showGuidelines && (
        <div className="bg-pink-50/90 border border-pink-200 rounded-3xl p-4 text-xs text-pink-950 space-y-1.5 shadow-xs">
          <div className="font-bold flex items-center gap-1.5 text-pink-900 text-sm">
            <Sparkles className="w-4 h-4 text-pink-700" />
            <span>আমার কুষ্টিয়াতে দ্রুত রেসপন্স পাওয়ার টিপস:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-700 ml-1">
            <li>পোস্টে সঠিক ও সুস্পষ্ট শিরোনাম দিন (যেমন: রুমের সংখ্যা বা পণ্যের নাম)।</li>
            <li>মোবাইল ক্যামেরা দিয়ে তোলা পরিষ্কার ছবি যুক্ত করলে রেসপন্স ৩ গুণ বৃদ্ধি পায়।</li>
            <li>সঠিক ফোন নম্বর ও এলাকা উল্লেখ করুন যাতে আগ্রহী ব্যক্তিরা সরাসরি যোগাযোগ করতে পারেন।</li>
            <li>অপরাধ বা সংবেদনশীল তথ্যের ক্ষেত্রে নাম গোপন রাখার সুবিধা ব্যবহার করুন।</li>
          </ul>
        </div>
      )}

      {/* Guest Warning Card */}
      {!user && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-4 text-amber-950 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-sm block leading-snug">
                অতিথি হিসেবে পোস্ট করার অনুমতি নেই
              </span>
              <span className="text-xs text-amber-800 font-medium block mt-0.5">
                প্ল্যাটফর্মে তথ্য বা সার্ভিস পোস্ট করতে অনুগ্রহ করে প্রথমে আপনার অ্যাকাউন্টে লগইন করুন।
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={openAuthModal}
            className="w-full sm:w-auto px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold shrink-0 transition-colors shadow-xs cursor-pointer"
          >
            লগইন / সাইন ইন করুন
          </button>
        </div>
      )}

      {/* Admin Review Notice Card */}
      <div className="bg-pink-50 border border-pink-200 rounded-3xl p-4 text-xs text-pink-950 space-y-1.5 shadow-xs">
        <div className="font-bold flex items-center gap-1.5 text-pink-900 text-sm">
          <AlertTriangle className="w-4 h-4 text-pink-700" />
          <span>অ্যাডমিন যাচাই-বাছাই নোটিশ</span>
        </div>
        <p className="text-slate-700 leading-relaxed whitespace-pre-line">
          প্রিয় ব্যবহারকারী, আপনার মূল্যবান পোস্টটি আমাদের অ্যাডমিন টিম যাচাই-বাছাই করছে। পোস্টটি প্রকাশের উপযুক্ত বিবেচিত হলে অবশ্যই পাবলিশ করা হবে। অনুগ্রহ করে কিছুক্ষণ ধৈর্য ধরে অপেক্ষা করুন। আপনার সহযোগিতাই আমাদের অনুপ্রেরণা।
          
          — আমার কুষ্টিয়া অ্যাডমিন টিম
        </p>
      </div>

      {/* Blood Request Redirection Card for Citizens */}
      {!isAdmin && (initialCategory === 'blood' || (initialCategory as string) === 'blood-request') && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-4 text-rose-950 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-300 text-rose-800 flex items-center justify-center shrink-0">
              <Droplet className="w-5 h-5 text-rose-600 fill-rose-600" />
            </div>
            <div>
              <span className="font-black text-sm block leading-snug">
                জরুরি রক্ত লাগবে? এডমিন হেল্পলাইনে যোগাযোগ করুন
              </span>
              <span className="text-xs text-rose-800 font-medium block mt-0.5">
                নিরাপত্তা ও সত্যতা রক্ষায় সাধারণ নাগরিক নিজে সরাসরি রক্ত চেয়ে পোস্ট করতে পারবে না। শুধুমাত্র এডমিন পোস্ট করতে পারবে। রক্ত লাগলে সরাসরি এডমিনকে জানান।
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <a
              href={`https://wa.me/88${cleanBloodHotline}?text=${encodeURIComponent('আসসালামু আলাইকুম এডমিন, আমার রোগীর জন্য জরুরি রক্ত প্রয়োজন।')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
            >
              <span>এডমিন WhatsApp</span>
            </a>
            <a
              href={`tel:${bloodHotline}`}
              className="px-3.5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
            >
              <span>এডমিন কল</span>
            </a>
          </div>
        </div>
      )}

      {/* Error / Success Notifications */}
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 bg-pink-50 border border-pink-200 text-pink-900 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-pink-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Admin Mode Indicator */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-4 py-2.5 rounded-2xl flex items-center justify-between text-xs font-black shadow-md border border-amber-600">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>অ্যাডমিন প্রিভিলেজ মোড: আপনি সরাসরি যেকোনো ক্যাটাগরিতে পোস্ট প্রকাশ করতে পারেন।</span>
          </div>
          <span className="bg-slate-950 text-amber-300 px-2 py-0.5 rounded-lg text-[10px]">অ্যাডমিন</span>
        </div>
      )}

      {/* Pending Autosaved Draft Banner */}
      {pendingAutoSavedDraft && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <span className="font-black text-sm text-slate-900 block leading-tight">
                পূর্বে ড্রাফট করা অসমাপ্ত পোস্ট পাওয়া গেছে!
              </span>
              <span className="text-xs text-slate-600 font-medium block mt-0.5">
                "{pendingAutoSavedDraft.title || 'শিরোনামহীন খসড়া'}" — আপনি কি কাজটি যেখান থেকে রেখেছিলেন সেখান থেকে আবার শুরু করতে চান?
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={handleRestoreAutosave}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 flex-1 sm:flex-initial cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>রিস্টোর করুন</span>
            </button>
            <button
              type="button"
              onClick={handleDiscardAutosave}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center flex-1 sm:flex-initial cursor-pointer"
            >
              মুছে ফেলুন
            </button>
          </div>
        </div>
      )}

      {/* Admin Notice Banner (If redirected from an admin-only service) */}
      {adminNotice && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-4 text-amber-950 shadow-xs flex items-start gap-3 animate-in fade-in">
          <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
            <Lock className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black text-amber-900">সংরক্ষিত অফিসিয়াল সেবা সংক্রান্ত নোটিশ</h4>
            <p className="text-xs text-amber-800 mt-0.5 leading-relaxed font-medium">
              {adminNotice}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAdminNotice(null)}
            className="text-amber-700 hover:text-amber-900 text-xs font-bold px-2 py-1 rounded-lg hover:bg-amber-100 shrink-0"
          >
            ঠিক আছে
          </button>
        </div>
      )}

      {/* SECTION 1: ক্যাটাগরি নির্বাচন (Interactive Visual Cards with Search & Filters) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-pink-200/80/90 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>১. ক্যাটাগরি নির্বাচন করুন</span>
              <span className="text-rose-500 font-bold">*</span>
            </label>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isAdmin 
                ? 'এডমিন হিসেবে আপনি সকল ১০০টি সেবায় (সরকারি, জরুরি ও নাগরিক) পোস্ট করতে পারবেন' 
                : 'কুষ্টিয়ার নাগরিকদের জন্য উন্মুক্ত যে সেবা দিতে চান তা বেছে নিন'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-xl">
              {activeCategoryData?.allowPublicPost ? '✓ পাবলিক উন্মুক্ত' : '🔒 এডমিন সংরক্ষিত'}
            </span>
            <span className="text-[11px] text-pink-700 font-black bg-pink-50 border border-pink-200/80 px-2.5 py-1 rounded-xl">
              {activeCategoryData?.name}
            </span>
          </div>
        </div>

        {/* Search & Filter Group Row */}
        <div className="space-y-2 pt-1">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              placeholder="ক্যাটাগরি খুঁজুন (যেমন: বাসা ভাড়া, ইলেকট্রিশিয়ান, ড্রাইভার, চাকরি...)"
              className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-pink-500 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden transition-all"
            />
            {categorySearch && (
              <button
                type="button"
                onClick={() => setCategorySearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Group Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            {isAdmin ? (
              <>
                <button
                  type="button"
                  onClick={() => setCategoryFilterGroup('all')}
                  className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${
                    categoryFilterGroup === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  সব ১০০টি সেবা ({categoriesConfig.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilterGroup('admin-only')}
                  className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                    categoryFilterGroup === 'admin-only'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <Lock className="w-3 h-3" />
                  <span>শুধুমাত্র এডমিন (সংরক্ষিত)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilterGroup('public')}
                  className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                    categoryFilterGroup === 'public'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <span>নাগরিক পাবলিক সেবা</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setCategoryFilterGroup('all')}
                  className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${
                    categoryFilterGroup === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  সব পাবলিক সেবা ({categoriesConfig.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilterGroup('daily_needs')}
                  className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${
                    categoryFilterGroup === 'daily_needs'
                      ? 'bg-pink-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  বাসা ও মার্কেট
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilterGroup('tech_handyman')}
                  className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${
                    categoryFilterGroup === 'tech_handyman'
                      ? 'bg-amber-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  মিস্ত্রি ও কারিগরি
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilterGroup('transport')}
                  className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${
                    categoryFilterGroup === 'transport'
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  যাতায়াত ও চালক
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilterGroup('education_it')}
                  className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${
                    categoryFilterGroup === 'education_it'
                      ? 'bg-indigo-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  শিক্ষা ও আইটি
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilterGroup('govt')}
                  className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${
                    categoryFilterGroup === 'govt'
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  আইনি সহায়তা
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilterGroup('emergency')}
                  className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${
                    categoryFilterGroup === 'emergency'
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  গোপন রিপোর্ট
                </button>
              </>
            )}
          </div>
        </div>

        {/* Selected Admin Category Banner */}
        {isAdmin && !activeCategoryData?.allowPublicPost && (
          <div className="bg-linear-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-3 text-xs text-amber-950 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold block leading-tight">অফিশিয়াল সংরক্ষিত ডিরেক্টরি পোস্ট মোড</span>
              <span className="text-[11px] text-amber-800 block mt-0.5">
                এই পোস্টটি অ্যাডমিন অফিসিয়াল পোস্ট হিসেবে চিহ্নিত হবে এবং সাথে সাথে ভেরিফাইড হিসেবে লাইভ হবে।
              </span>
            </div>
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 max-h-[360px] overflow-y-auto pr-1 gap-2.5">
          {filteredCategoriesConfig.length > 0 ? (
            filteredCategoriesConfig.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;
              const isPublic = cat.allowPublicPost;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`p-2.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between group active:scale-98 ${
                    isSelected
                      ? 'border-pink-700 bg-pink-800 text-white shadow-md ring-2 ring-pink-600/30'
                      : isPublic
                        ? 'border-slate-200 bg-slate-50/70 hover:bg-pink-50/50 hover:border-pink-300 text-slate-700'
                        : 'border-amber-200 bg-amber-50/50 hover:bg-amber-100/60 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected 
                        ? 'bg-white/20 text-white' 
                        : isPublic 
                          ? 'bg-white text-pink-800 shadow-2xs border border-pink-100' 
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected ? (
                      <span className="w-4 h-4 rounded-full bg-white text-pink-800 flex items-center justify-center shadow-xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    ) : !isPublic && (
                      <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" />
                        <span>এডমিন</span>
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-black block leading-tight truncate">
                      {cat.name}
                    </span>
                    <span className={`text-[10px] block mt-0.5 truncate ${isSelected ? 'text-pink-100' : 'text-slate-500'}`}>
                      {cat.badge}
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="col-span-full py-8 text-center text-slate-500 space-y-1">
              <Search className="w-6 h-6 mx-auto text-slate-300" />
              <p className="text-xs font-bold">"{categorySearch}" নামে কোনো ক্যাটাগরি পাওয়া যায়নি</p>
              <button
                type="button"
                onClick={() => { setCategorySearch(''); setCategoryFilterGroup('all'); }}
                className="text-xs text-pink-700 font-bold hover:underline"
              >
                সব ফিল্টার মুছুন
              </button>
            </div>
          )}
        </div>
      </div>

      {/* If non-admin user is in any category OTHER than crime-reporter and direct posting is disabled: Show Free Admin WhatsApp / Facebook Concierge Notice */}
      {!isAdmin && !appTheme?.isMemberPostingAllowed && category !== 'crime-reporter' ? (
        <FreeAdminPostNotice
          categoryName={activeCategoryData?.name || 'বিজ্ঞাপন'}
          categoryId={category}
          user={user}
          onOpenCrimeReporter={() => handleCategorySelect('crime-reporter')}
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {category === 'crime-reporter' && (
            <SecretInfoSecurityNotice />
          )}

        {/* SECTION 2: পোস্টের মূল তথ্য (Dynamic Category Dependent Inputs) */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-pink-200/80/90 shadow-xs space-y-4">
          <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 block">
            <span>২. পোস্টের মূল বিবরণ ও মূল্য</span>
            <span className="text-rose-500 font-bold">*</span>
          </label>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              পোস্টের শিরোনাম <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={150}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                category === 'house-rent' ? 'যেমন: মজমপুর গেটে ৩ রুমের মনোরম ফ্যামিলি বাসা ভাড়া' :
                category === 'buy-sell' ? 'যেমন: Redmi Note 12 Pro (8GB/128GB) একদম ফ্রেশ কন্ডিশন' :
                category === 'electrician' ? 'যেমন: অভিজ্ঞ ইলেকট্রিশিয়ান - হাউস ওয়্যারিং ও ফ্যান মেরামত' :
                category === 'plumber' ? 'যেমন: জরুরি প্লাম্বার সেবা - পাইপলাইন লিকেজ ও স্যানিটারি ফিটিংস' :
                category === 'ac-mechanic' ? 'যেমন: দক্ষ এসি ও ফ্রিজ মেকানিক - গ্যাস রিফিল ও মেরামত' :
                category === 'driver' ? 'যেমন: অভিজ্ঞ ও লাইসেন্সধারী প্রাইভেট কার ড্রাইভার প্রয়োজন / সেবা' :
                category === 'tutor' ? 'যেমন: গণিত ও বিজ্ঞান বিষয়ে অভিজ্ঞ গৃহশিক্ষক / গৃহশিক্ষিকা আবশ্যক' :
                category === 'vet' ? 'যেমন: ডেইরি ফার্ম ও পোষা প্রাণীর অভিজ্ঞ পশু চিকিৎসক ও সেবা' :
                category === 'crime-reporter' ? 'যেমন: কুষ্টিয়া কোর্ট স্টেশন সংলগ্ন এলাকায় মাদক ব্যবসার গোপন তথ্য' :
                'যেমন: জরুরী প্রয়োজনে A+ রক্তের আবেদন'
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-2xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-pink-700 focus:bg-white transition-all font-medium"
            />
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-pink-50/60 p-2 rounded-xl border border-pink-100/80">
              💡 <span className="font-bold text-slate-800">এই ঘরে কী লিখবেন:</span> যা বিক্রি বা ভাড়া দিচ্ছেন অথবা যে সেবা প্রদান করছেন তার মূল কথাটি ১ লাইনে স্পষ্ট করে লিখুন।
            </p>
          </div>

          {/* Subcategory & Category-Specific Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Subcategory dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                ধরণ / সাব-ক্যাটাগরি
              </label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-2xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-pink-700 font-medium cursor-pointer"
              >
                {activeCategoryData?.subcategories.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-pink-50/60 p-2 rounded-xl border border-pink-100/80">
                💡 <span className="font-bold text-slate-800">এই ঘরে কী নির্বাচন করবেন:</span> আপনার বিজ্ঞাপনের সঠিক উপ-ক্যাটাগরি (যেমন: ফ্যামিলি বাসা, ব্যাচেলর মেস ইত্যাদি) বেছে নিন।
              </p>
            </div>

            {/* If House Rent: Room details */}
            {category === 'house-rent' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">রুমের বিবরণ</label>
                <input
                  type="text"
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                  placeholder="যেমন: ৩ রুম + ২ বাথ + বারান্দা"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-2xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-pink-700 font-medium"
                />
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-pink-50/60 p-2 rounded-xl border border-pink-100/80">
                  💡 <span className="font-bold text-slate-800">এই ঘরে কী লিখবেন:</span> কয়টি বেডরুম, বাথরুম, বারান্দা বা ডাইনিং স্পেস আছে তা সংক্ষেপে লিখুন।
                </p>
              </div>
            )}

            {/* If Buy Sell: Condition */}
            {category === 'buy-sell' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">পণ্যের কন্ডিশন</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-2xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-pink-700 font-medium cursor-pointer"
                >
                  <option value="ব্যবহৃত">ব্যবহৃত (Used - Good Condition)</option>
                  <option value="নতুন">নতুন (Brand New / Unused)</option>
                  <option value="অরিজিনাল কন্ডিশন">অরিজিনাল শোরুম কন্ডিশন</option>
                </select>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-pink-50/60 p-2 rounded-xl border border-pink-100/80">
                  💡 <span className="font-bold text-slate-800">এই ঘরে কী নির্বাচন করবেন:</span> পণ্যটি নতুন নাকি ব্যবহৃত তা স্পষ্টভাবে সিলেক্ট করুন।
                </p>
              </div>
            )}

            {/* If Service Profession: Experience selection */}
            {['electrician', 'plumber', 'ac-mechanic', 'driver', 'tutor', 'vet'].includes(category) && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">কাজের অভিজ্ঞতা</label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-2xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-pink-700 font-medium cursor-pointer"
                >
                  <option value="১-২ বছরের বাস্তব অভিজ্ঞতা">১-২ বছরের বাস্তব অভিজ্ঞতা</option>
                  <option value="৩-৫ বছরের বাস্তব অভিজ্ঞতা">৩-৫ বছরের বাস্তব অভিজ্ঞতা</option>
                  <option value="৫+ বছরের অভিজ্ঞ কারিগর">৫+ বছরের অভিজ্ঞ কারিগর</option>
                  <option value="১০+ বছরের দক্ষ অভিজ্ঞ মাস্টার">১০+ বছরের দক্ষ অভিজ্ঞ মাস্টার</option>
                </select>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-pink-50/60 p-2 rounded-xl border border-pink-100/80">
                  💡 <span className="font-bold text-slate-800">এই ঘরে কী নির্বাচন করবেন:</span> এই পেশায় আপনার কত বছরের কাজের অভিজ্ঞতা আছে তা সিলেক্ট করুন।
                </p>
              </div>
            )}

            {/* If Driver: License Type */}
            {category === 'driver' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">ড্রাইভিং লাইসেন্স</label>
                <select
                  value={driverLicense}
                  onChange={(e) => setDriverLicense(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-2xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-pink-700 font-medium cursor-pointer"
                >
                  <option value="পেশাদার ড্রাইভিং লাইসেন্স (প্রফেশনাল)">পেশাদার লাইসেন্স (প্রফেশনাল)</option>
                  <option value="অপেশাদার ড্রাইভিং লাইসেন্স (হালকা)">অপেশাদার লাইসেন্স (হালকা)</option>
                  <option value="ভারী যানবাহন লাইসেন্স">ভারী যানবাহন লাইসেন্স</option>
                </select>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-pink-50/60 p-2 rounded-xl border border-pink-100/80">
                  💡 <span className="font-bold text-slate-800">এই ঘরে কী নির্বাচন করবেন:</span> আপনার ড্রাইভিং লাইসেন্সের ধরণ বেছে নিন।
                </p>
              </div>
            )}

            {/* If Tutor: Subjects */}
            {category === 'tutor' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">পড়ানোর বিষয় / স্পেশালিটি</label>
                <input
                  type="text"
                  value={tutorSubject}
                  onChange={(e) => setTutorSubject(e.target.value)}
                  placeholder="যেমন: গণিত, ইংরেজি ও বিজ্ঞান"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-2xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-pink-700 font-medium"
                />
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-pink-50/60 p-2 rounded-xl border border-pink-100/80">
                  💡 <span className="font-bold text-slate-800">এই ঘরে কী লিখবেন:</span> আপনি কোন কোন বিষয় পড়াবেন বা পড়াতে শিক্ষক খুঁজছেন তা লিখুন।
                </p>
              </div>
            )}

            {/* If Crime: Crime category */}
            {category === 'crime-reporter' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">অপরাধের ধরণ</label>
                <select
                  value={crimeCategory}
                  onChange={(e) => setCrimeCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-2xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-pink-700 font-medium cursor-pointer"
                >
                  <option value="মাদক ব্যবসা">মাদক ব্যবসা</option>
                  <option value="চাঁদাবাজি">চাঁদাবাজি</option>
                  <option value="ছিনতাই ও চুরি">ছিনতাই ও চুরি</option>
                  <option value="দুর্নীতি">দুর্নীতি ও ঘুষ</option>
                  <option value="অন্যান্য অপরাধ">অন্যান্য অপরাধ</option>
                </select>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-pink-50/60 p-2 rounded-xl border border-pink-100/80">
                  💡 <span className="font-bold text-slate-800">এই ঘরে কী নির্বাচন করবেন:</span> ঘটনার ধরণ সিলেক্ট করুন (আপনার পরিচয় ও তথ্য সুরক্ষিত থাকবে)।
                </p>
              </div>
            )}

            {/* If Jobs: Type and Company */}
            {category === 'jobs' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">কাজের ধরন</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-2xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-pink-700 font-medium cursor-pointer"
                  >
                    <option value="ফুল-টাইম">ফুল-টাইম (Full Time)</option>
                    <option value="পার্ট-টাইম">পার্ট-টাইম (Part Time)</option>
                    <option value="চুক্তিবিত্তিক">চুক্তিবিত্তিক (Contract)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">প্রতিষ্ঠান / দোকানের নাম</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="যেমন: আল-মদিনা ফ্যাশন হাউজ"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-2xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-pink-700 font-medium"
                  />
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-pink-50/60 p-2 rounded-xl border border-pink-100/80">
                    💡 <span className="font-bold text-slate-800">এই ঘরে কী লিখবেন:</span> প্রতিষ্ঠান বা অফিসের নাম লিখুন।
                  </p>
                </div>
              </>
            )}

            {/* If Lost and Found: Type */}
            {category === 'lost-found' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">হারানো নাকি প্রাপ্তি?</label>
                <select
                  value={lostFoundType}
                  onChange={(e) => setLostFoundType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-2xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-pink-700 font-bold cursor-pointer"
                >
                  <option value="lost">হারিয়ে গেছে (Lost Item)</option>
                  <option value="found">পাওয়া গেছে (Found Item)</option>
                </select>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-pink-50/60 p-2 rounded-xl border border-pink-100/80">
                  💡 <span className="font-bold text-slate-800">এই ঘরে কী নির্বাচন করবেন:</span> জিনিসটি হারিয়েছে নাকি কুড়িয়ে পেয়েছেন তা সিলেক্ট করুন।
                </p>
              </div>
            )}

            {/* If Blood: Blood group */}
            {category === 'blood' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">রক্তের গ্রুপ</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-pink-200/80 text-xs font-bold"
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            )}

            {/* If Food: Specific Fields */}
            {category === 'food' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">খাবারের ধরণ</label>
                  <select
                    value={foodType}
                    onChange={(e) => setFoodType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-pink-200/80 text-xs font-bold"
                  >
                    <option value="মিষ্টি ও ডেইরি">মিষ্টি ও ডেইরি</option>
                    <option value="বিরিয়ানি ও কাচ্চি">বিরিয়ানি ও কাচ্চি</option>
                    <option value="ফাস্টফুড ও ড্রিঙ্কস">ফাস্টফুড ও ড্রিঙ্কস</option>
                    <option value="দেশি ঘরোয়া খাবার">দেশি ঘরোয়া খাবার</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>ডেলিভারি সুবিধা?</span>
                    <input 
                      type="checkbox" 
                      checked={deliveryAvailable} 
                      onChange={(e) => setDeliveryAvailable(e.target.checked)}
                      className="w-4 h-4 text-pink-700 border-pink-300 rounded-sm focus:ring-pink-500"
                    />
                  </label>
                  <p className="text-[10px] text-slate-500">হোম ডেলিভারি দেওয়া হয় কি না টিক দিন</p>
                </div>
              </>
            )}
          </div>


          {/* Price / Rent / Charge (If not crime reporter) */}
          {category !== 'crime-reporter' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                {category === 'house-rent' ? 'মাসিক ভাড়া (টাকা)' : 
                 category === 'buy-sell' ? 'বিক্রয় মূল্য (টাকা)' :
                 category === 'jobs' ? 'মাসিক বেতন / পারিশ্রমিক (টাকা)' :
                 category === 'lost-found' ? 'পুরস্কার বা উপহারের অংক (যদি থাকে)' :
                 category === 'food' ? 'খাবারের মূল্য / রেট (টাকা)' :
                 category === 'events' ? 'প্যাকেজ রেট / শিফট ভাড়া (টাকা)' :
                 category === 'legal' ? 'পরামর্শ ফি (টাকা, ঐচ্ছিক)' :
                 category === 'driver' ? 'মাসিক বেতন বা দৈনিক ট্রিপ ফি (ঐচ্ছিক)' :
                 category === 'tutor' ? 'মাসিক পারিশ্রমিক / টিউশন ফি (ঐচ্ছিক)' :
                 ['electrician', 'plumber', 'ac-mechanic', 'vet'].includes(category) ? 'ভিজিট ফি / সার্ভিস চার্জ (ঐচ্ছিক)' :
                 'মূল্য (টাকা)'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder={
                    category === 'house-rent' ? 'যেমন: ৮,৫০০' :
                    category === 'buy-sell' ? 'যেমন: ১৬,৫০০' :
                    category === 'jobs' ? 'যেমন: ১২,০০০ - ১৫,০০০' :
                    category === 'lost-found' ? 'যেমন: ১,০০০ (উপযুক্ত পুরস্কার)' :
                    category === 'food' ? 'যেমন: ২৫০' :
                    category === 'events' ? 'যেমন: ২০,০০০' :
                    category === 'driver' ? 'যেমন: ১২,০০০' :
                    category === 'tutor' ? 'যেমন: ৩,৫০০' :
                    'যেমন: ৩৫০'
                  }
                  className="w-full px-3.5 py-2.5 pl-8 bg-slate-50 border border-pink-200/80 rounded-2xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-pink-700 font-medium"
                />
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">৳</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-pink-50/60 p-2 rounded-xl border border-pink-100/80">
                💡 <span className="font-bold text-slate-800">এই ঘরে কী লিখবেন:</span> ভাড়ার পরিমাণ, বিক্রয়মূল্য বা সার্ভিস চার্জের টাকার অংক লিখুন (যেমন: ৮৫০০ বা আলোচনা সাপেক্ষ)।
              </p>
            </div>
          )}

          {/* Description Textarea */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>বিস্তারিত বিবরণ <span className="text-rose-500">*</span></span>
              <span className="text-[10px] text-slate-400 font-normal">স্পেস, সুবিধা বা বৈশিষ্ট্য লিখুন</span>
            </label>
            <textarea
              required
              rows={4}
              maxLength={2000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                category === 'house-rent' ? 'বাসার ফ্লোর, টাইলস, পানির সুবিধা, বিদ্যুৎ বিল, সিকিউরিটি এবং যোগাযোগের সময় উল্লেখ করুন...' :
                category === 'buy-sell' ? 'পণ্যের বয়স, সাথে কি কি কাগজ বা বক্স পাবেন, কোনো সমস্যা আছে কিনা বিস্তারিত লিখুন...' :
                category === 'crime-reporter' ? 'ঘটনার বিস্তারিত স্থান, সময় এবং জড়িত ব্যক্তিদের তথ্য সুস্পষ্টভাবে লিখুন (আপনার পরিচয় নিরাপদ থাকবে)...' :
                ['electrician', 'plumber', 'ac-mechanic', 'driver', 'tutor', 'vet'].includes(category) ? 'কাজের ধরণ, অভিজ্ঞতা, সার্ভিস চার্জের শর্ত, সময়সূচি এবং যোগাযোগের উপযুক্ত সময় লিখুন...' :
                'বিস্তারিত তথ্য লিখুন...'
              }
              className="w-full p-3.5 bg-slate-50 border border-pink-200/80 rounded-2xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-pink-700 focus:bg-white transition-all font-medium resize-none leading-relaxed"
            />
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-pink-50/60 p-2 rounded-xl border border-pink-100/80">
              💡 <span className="font-bold text-slate-800">এই ঘরে কী লিখবেন:</span> সম্পূর্ণ বিস্তারিত লিখুন। বাসা হলে গ্যাস, পানি, বিদ্যুৎ, বারান্দা; জিনিস বিক্রি হলে কন্ডিশন ও কেনা কয়দিন হলো; চাকরির ক্ষেত্রে কাজের সময় ও শিক্ষাগত যোগ্যতা।
            </p>
          </div>
        </div>

        {/* SECTION 3: অবস্থান ও ঠিকানা (Location in Kushtia) */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-pink-200/80/90 shadow-xs space-y-3">
          <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 block">
            <MapPin className="w-3.5 h-3.5 text-pink-700" />
            <span>৩. কুষ্টিয়ায়র এলাকা ও ঠিকানা</span>
            <span className="text-rose-500 font-bold">*</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">কুষ্টিয়ায়র এলাকা নির্বাচন করুন</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="যেমন: কুষ্টিয়া সদর, মজমপুর"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-2xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-pink-700 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">সুনির্দিষ্ট ল্যান্ডমার্ক / রোড নম্বর</label>
              <input
                type="text"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="যেমন: রেলওয়ে কারখানা গেটের বিপরীতে"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-pink-200/80 rounded-2xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-pink-700 font-medium"
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-pink-50/60 p-2.5 rounded-xl border border-pink-100/80">
            💡 <span className="font-bold text-slate-800">এই ঘরে কী লিখবেন:</span> কুষ্টিয়ার সুনির্দিষ্ট এলাকা/উপজেলা সিলেক্ট করুন এবং রোড নম্বর, মোড় বা পরিচিত কোনো ভবনের নাম লিখুন যাতে আগ্রহী ব্যক্তিরা সহজেই স্থানটি চিনতে পারে।
          </p>
        </div>

        {/* SECTION 4: ছবি আপলোড (Photo Upload with live compression & preview) */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-pink-200/80/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-pink-700" />
              <span>৪. ছবি সংযুক্ত করুন (স্বয়ংক্রিয় কম্প্রেস ও ফাস্ট ফিড লোড)</span>
            </label>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">⚡ অপ্টিমাইজড</span>
          </div>

          {imagePreview ? (
            <div className="space-y-2">
              <div className="relative rounded-2xl overflow-hidden border-2 border-pink-500/50 bg-slate-100 max-h-60 flex items-center justify-center">
                <img 
                  src={imagePreview} 
                  alt="Upload preview" 
                  className="w-full h-56 object-cover"
                />
                <div className="absolute top-2 right-2 flex items-center gap-1.5">
                  <label className="cursor-pointer px-2.5 py-1.5 bg-black/70 hover:bg-black/85 text-white rounded-xl text-[11px] font-bold backdrop-blur-xs flex items-center gap-1 transition-all">
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>পরিবর্তন</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={compressingImage}
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-1.5 bg-rose-600/90 hover:bg-rose-700 text-white rounded-xl text-[11px] backdrop-blur-xs transition-all"
                    title="ছবি মুছুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {compressionStats && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-[11px] font-bold text-emerald-900 animate-in fade-in">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>ছবি সফলভাবে কম্প্রেস ও অপ্টিমাইজ করা হয়েছে!</span>
                  </div>
                  <span className="text-[10px] bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded-md">
                    মূল সাইজ {compressionStats.originalSize} ➔ কম্প্রেসড {compressionStats.compressedSize} ({compressionStats.savings} ছোট)
                  </span>
                </div>
              )}
            </div>
          ) : (
            <label className="border-2 border-dashed border-pink-200/80 hover:border-pink-600 rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-pink-50/40 transition-colors group">
              {compressingImage ? (
                <>
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-2" />
                  <span className="text-xs font-bold text-slate-800">ছবি কম্প্রেস ও অপ্টিমাইজ করা হচ্ছে...</span>
                  <span className="text-[10px] text-slate-400 mt-1">ফিডে দ্রুত লোড হওয়ার জন্য সাইজ ছোট করা হচ্ছে</span>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-slate-500 group-hover:text-pink-700 group-hover:scale-105 transition-all mb-2">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    ছবি নির্বাচন করতে ক্লিক করুন অথবা ফাইল টেনে এনে ড্রপ করুন
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">
                    JPG, PNG বা WEBP (স্বয়ংক্রিয় কম্প্রেস হয়ে ফায়ারবেসে আপলোড হবে)
                  </span>
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
          )}
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-pink-50/60 p-2.5 rounded-xl border border-pink-100/80">
            💡 <span className="font-bold text-slate-800">এই ঘরে কী করবেন:</span> বাসা, পণ্য বা সেবার স্পষ্ট ১টি ছবি সংযুক্ত করুন। ফিডে দ্রুত লোড হওয়ার সুবিধার্থে ছবি স্বয়ংক্রিয়ভাবে কম্প্রেস ও অপ্টিমাইজ হয়ে যাবে।
          </p>
        </div>

        {/* SECTION 5: যোগাযোগ ও গোপনীয়তা (Contact & Trust Settings) */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-pink-200/80/90 shadow-xs space-y-4">
          <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 block">
            <Phone className="w-3.5 h-3.5 text-pink-700" />
            <span>৫. যোগাযোগ ও পরিচয় সেটিংস</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">মোবাইল ফোন নম্বর</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3.5 py-2.5 pl-9 bg-slate-50 border border-pink-200/80 rounded-2xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-pink-700 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">হোয়াটসঅ্যাপ নম্বর (মেসেজের জন্য)</label>
              <div className="relative">
                <MessageCircle className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3.5 py-2.5 pl-9 bg-slate-50 border border-pink-200/80 rounded-2xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-pink-700 font-medium"
                />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-pink-50/60 p-2.5 rounded-xl border border-pink-100/80">
            💡 <span className="font-bold text-slate-800">এই ঘরে কী লিখবেন:</span> যে ফোন নম্বরে আগ্রহী ব্যক্তিরা সরাসরি ফোন বা হোয়াটসঅ্যাপে কথা বলতে পারবেন সেই ১১ ডিজিটের সচল মোবাইল নম্বরটি লিখুন।
          </p>

          {/* Anonymous Option or Verified Citizen Info */}
          <div className="pt-2 border-t border-pink-100">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-pink-100">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isAnonymous ? 'bg-amber-100 text-amber-800' : 'bg-pink-100 text-pink-800'
                }`}>
                  {isAnonymous ? <Lock className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">
                    {isAnonymous ? 'সচেতন নাগরিক হিসেবে নাম গোপন রাখা হবে' : 'আমার কুষ্টিয়া ভেরিফাইড পোস্ট'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {isAnonymous ? 'পোস্টে আপনার আসল নাম ও প্রোফাইল ছবি লুকানো থাকবে' : `পোস্টকারী: ${user?.displayName || 'কুষ্টিয়া নাগরিক'}`}
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
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-pink-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-700"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Autosave Status Indicator */}
        <div className="flex items-center justify-between px-2 text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>প্রতি ৩০ সেকেন্ড পর পর ড্রাফট স্বয়ংক্রিয়ভাবে সেভ হয়</span>
          </div>
          {lastAutoSavedTime && (
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
              সর্বশেষ অটো-সেভ: {lastAutoSavedTime}
            </span>
          )}
        </div>

        {/* Submit & Save as Draft Button Section */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            type="submit"
            disabled={uploading}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-800 via-pink-700 to-pink-800 hover:from-pink-900 hover:to-pink-900 text-white font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>পোস্টটি প্রকাশিত হচ্ছে...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>অনুমোদনের জন্য পোস্ট করুন</span>
              </>
            )}
          </button>

          {/* Save as Draft Button */}
          <button
            type="button"
            disabled={uploading || isDraftSaving}
            onClick={handleSaveAsDraft}
            className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="পাবলিক পুশ ছাড়াই খসড়া হিসেবে ফোনে সংরক্ষণ করুন"
          >
            <Bookmark className="w-4 h-4 text-amber-700" />
            <span>{isDraftSaving ? 'খসড়া সেভ হচ্ছে...' : 'খসড়া হিসেবে সেভ করুন'}</span>
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            বাতিল করুন
          </button>
        </div>
      </form>
      )}
    </div>
  );
};
