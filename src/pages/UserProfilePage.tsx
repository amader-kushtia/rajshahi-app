import React, { useState, useEffect } from 'react';
import { 
  User, 
  CheckCircle2, 
  LogOut, 
  LogIn, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  Code,
  ExternalLink,
  Bookmark,
  HelpCircle,
  Shield,
  Rocket,
  Clock,
  XCircle,
  AlertTriangle,
  Heart,
  ChevronRight,
  Camera,
  Calendar,
  Copy,
  Check
} from 'lucide-react';
import { BalanceCard } from '../components/BalanceCard';
import { useAuth } from '../context/AuthContext';
import { PostItem, CategoryType, UserProfile, PostDraftItem } from '../types';
import { getUserSubmittedPostIds, getMasterPosts, fetchUserPostsFromFirestore } from '../services/postService';
import { getLocalDrafts, deleteLocalDraft, publishDraftPost } from '../services/draftService';
import { deleteUser, updateProfile } from 'firebase/auth';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Edit2, Trash2, Save, X, Building2, Send, Edit3 } from 'lucide-react';

interface UserProfilePageProps {
  posts: PostItem[];
  onNavigate: (category: CategoryType) => void;
  onOpenCreatePost: () => void;
}

// Curated high-quality professional presets for avatar picker
const AVATAR_PRESETS = [
  { id: 'initials', name: 'নামের আদ্যক্ষর (Dynamic Initials)' },
  { id: 'premium_kushtia', url: '/src/assets/images/premium_avatar_kushtia_1792070025466.jpg', name: 'প্রিমিয়াম নাগরিক' },
  { id: 'preset_male_1', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80', name: 'তরুণ নাগরিক' },
  { id: 'preset_female_1', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80', name: 'তরুণী নাগরিক' },
  { id: 'preset_male_2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80', name: 'স্মার্ট নাগরিক' },
  { id: 'preset_female_2', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80', name: 'পেশাজীবী নারী' },
  { id: 'preset_male_3', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80', name: 'শুভ্র হাসি' },
  { id: 'preset_female_3', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80', name: 'স্বচ্ছ হাসি' }
];

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  posts,
  onNavigate,
  onOpenCreatePost,
}) => {
  const { user, firebaseUser, logOut, openAuthModal, updateUserProfile, isAdmin } = useAuth();

  // Inline Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editWard, setEditWard] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editPhotoURL, setEditPhotoURL] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editError, setEditError] = useState('');

  const handleStartEdit = () => {
    setEditName(user?.displayName || '');
    setEditPhone(user?.phone || '');
    setEditWard(user?.ward || '');
    setEditAddress(user?.address || '');
    setEditPhotoURL(user?.photoURL || '');
    setEditError('');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditError('');
  };

  const [userFetchedPosts, setUserFetchedPosts] = useState<PostItem[]>([]);
  const [userDrafts, setUserDrafts] = useState<PostDraftItem[]>([]);
  const [activePostsTab, setActivePostsTab] = useState<'published' | 'drafts'>('published');
  const [submittingDraftId, setSubmittingDraftId] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const refreshDrafts = () => {
    const list = getLocalDrafts(user?.uid);
    setUserDrafts(list);
  };

  useEffect(() => {
    refreshDrafts();
    const handleDraftsUpdated = () => refreshDrafts();
    window.addEventListener('kushtia-drafts-updated', handleDraftsUpdated);
    window.addEventListener('storage', handleDraftsUpdated);
    return () => {
      window.removeEventListener('kushtia-drafts-updated', handleDraftsUpdated);
      window.removeEventListener('storage', handleDraftsUpdated);
    };
  }, [user]);

  const handleResumeDraft = (draft: PostDraftItem) => {
    try {
      localStorage.setItem('kushtia_active_editing_draft', JSON.stringify(draft));
      onNavigate('create-post');
    } catch (e) {
      console.error('Error saving active draft:', e);
    }
  };

  const handleDeleteDraft = (draftId: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই খসড়াটি মুছে ফেলতে চান?')) {
      deleteLocalDraft(draftId);
      refreshDrafts();
    }
  };

  const handleSubmitDraftForReview = async (draft: PostDraftItem) => {
    setSubmittingDraftId(draft.id);
    try {
      await publishDraftPost(draft, false);
      refreshDrafts();
      alert('খসড়াটি এডমিন পর্যালোচনার জন্য জমা দেওয়া হয়েছে! এডমিন অনুমোদন করলেই এটি পাবলিক হবে।');
    } catch (e: any) {
      alert('খসড়া জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setSubmittingDraftId(null);
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  useEffect(() => {
    if (user) {
      fetchUserPostsFromFirestore(user).then(fetched => {
        if (fetched && fetched.length > 0) {
          setUserFetchedPosts(fetched);
        }
      });
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setEditError('');

    try {
      const updatedData: Partial<UserProfile> = {
        displayName: editName.trim() || user.displayName,
        phone: editPhone.trim(),
        ward: editWard.trim(),
        address: editAddress.trim(),
        photoURL: editPhotoURL.trim(),
      };

      if (user.uid && !user.uid.startsWith('demo-') && !user.uid.startsWith('citizen-')) {
        try {
          const userRef = doc(db, 'users', user.uid);
          await setDoc(userRef, {
            ...updatedData,
            updatedAt: Date.now()
          }, { merge: true });

          const currentFbUser = auth.currentUser || firebaseUser;
          if (currentFbUser) {
            await updateProfile(currentFbUser, { 
              displayName: updatedData.displayName,
              photoURL: updatedData.photoURL
            }).catch(e => console.warn('Auth updateProfile warning:', e));
          }
        } catch (dbErr) {
          console.warn('Firestore setDoc profile update error, applying local profile update:', dbErr);
        }
      }

      const newProfile: UserProfile = {
        ...user,
        ...updatedData,
      };
      updateUserProfile(newProfile);
      setIsEditing(false);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setEditError('প্রোফাইল আপডেট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    const confirmed = window.confirm('আপনি কি নিশ্চিত যে আপনার অ্যাকাউন্টটি স্থায়ীভাবে মুছে ফেলতে চান? এই পদক্ষেপটি অপরিবর্তনীয় এবং আপনার সকল তথ্য মুছে যাবে।');
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      if (user.uid && !user.uid.startsWith('demo-')) {
        try {
          await deleteDoc(doc(db, 'users', user.uid));
        } catch (docErr) {
          console.warn('Error deleting firestore user document:', docErr);
        }
      }

      const currentFbUser = auth.currentUser || firebaseUser;
      if (currentFbUser) {
        await deleteUser(currentFbUser);
      }

      await logOut();
      alert('আপনার অ্যাকাউন্টটি সফলভাবে মুছে ফেলা হয়েছে।');
    } catch (err: any) {
      console.error('Error deleting account:', err);
      if (err?.code === 'auth/requires-recent-login') {
        alert('নিরাপত্তার স্বার্থে অ্যাকাউন্ট মুছে ফেলার পূর্বে আপনাকে পুনরায় লগইন করতে হবে। অনুগ্রহ করে লগআউট করে পুনরায় লগইন করে চেষ্টা করুন।');
      } else {
        alert('অ্যাকাউন্ট মুছে ফেলতে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const [myPosts, setMyPosts] = useState<PostItem[]>([]);

  useEffect(() => {
    const submittedIds = getUserSubmittedPostIds();
    const allCandidatePostsMap = new Map<string, PostItem>();
    posts.forEach(p => allCandidatePostsMap.set(p.id, p));
    getMasterPosts().forEach(p => allCandidatePostsMap.set(p.id, p));
    userFetchedPosts.forEach(p => allCandidatePostsMap.set(p.id, p));

    const allCandidatePosts = Array.from(allCandidatePostsMap.values());

    const filtered = allCandidatePosts.filter(p => {
      // 1. Core UID Check (Highest Priority & Safest)
      if (user && user.uid && p.authorId) {
        const userUid = user.uid.trim();
        const postAuthorId = p.authorId.trim();
        if (userUid === postAuthorId) return true;
      }

      // 2. Email/Phone Match (Fallback for legacy or guest-to-account migration)
      if (user) {
        if (user.email && (p as any).authorEmail && (p as any).authorEmail.toLowerCase().trim() === user.email.toLowerCase().trim()) {
          return true;
        }

        const cleanUserPhone = user.phone ? user.phone.replace(/\D/g, '') : '';
        const cleanAuthorPhone = p.authorPhone ? p.authorPhone.replace(/\D/g, '') : '';
        const cleanContactPhone = p.contactPhone ? p.contactPhone.replace(/\D/g, '') : '';
        
        if (cleanUserPhone && cleanUserPhone.length >= 8 && (cleanUserPhone === cleanAuthorPhone || cleanUserPhone === cleanContactPhone)) {
          return true;
        }
      }

      // 3. Local Submission History (Device-specific fallback)
      if (submittedIds.includes(p.id)) {
        if (!p.authorId) return true;
        if (user && p.authorId === user.uid) return true;
      }

      // 4. Name Match (Loose fallback)
      if (user && user.displayName && 
          user.displayName !== 'সম্মানিত নাগরিক' && 
          user.displayName !== 'কুষ্টিয়া নাগরিক' && 
          p.authorName === user.displayName) {
        if (!p.authorId || (user && p.authorId === user.uid)) {
          return true;
        }
      }

      return false;
    });

    setMyPosts(filtered);
  }, [user, posts, userFetchedPosts]);

  // Determine elegant avatar initial and gradient
  const getAvatarGradient = (uid: string) => {
    const gradients = [
      'from-emerald-500 to-teal-600',
      'from-indigo-500 to-blue-600',
      'from-purple-500 to-indigo-600',
      'from-rose-500 to-pink-600',
      'from-amber-500 to-orange-600',
    ];
    const index = uid ? uid.charCodeAt(0) % gradients.length : 0;
    return gradients[index];
  };

  const initialLetter = user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'S';
  const avatarGradient = user ? getAvatarGradient(user.uid) : 'from-emerald-500 to-teal-600';

  return (
    <div className="space-y-5 pb-28 animate-in fade-in duration-200">
      {/* User Account Card */}
      <BalanceCard currentUser={user} onOpenAuth={openAuthModal} />
          {user ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-pink-200/80/80 dark:border-slate-800/80 shadow-xs relative overflow-hidden">
              
              {/* Premium Background Cover Mesh Banner */}
              <div className="h-28 bg-gradient-to-r from-emerald-500/10 via-emerald-600/15 to-teal-600/5 relative overflow-hidden border-b border-pink-100/60 dark:border-slate-800/40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(5,150,105,0.08),transparent_50%)]" />
                <div className="absolute right-6 top-5 flex items-center gap-1 bg-white/70 dark:bg-slate-950/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/50 dark:border-slate-800/50">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 tracking-wider">PREMIUM CITIZEN</span>
                </div>
              </div>

              {/* Main Profile Info Section */}
              <div className="px-5 pb-5 pt-0 relative">
                {/* Overlapping Avatar Area */}
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-10 mb-4">
                  <div className="relative group shrink-0">
                    <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-xl ring-4 ring-white dark:ring-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center transition-transform group-hover:scale-102">
                      {user.photoURL && user.photoURL !== 'initials' && !user.photoURL.startsWith('demo-') ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = ''; // fallbacks to initials below
                          }}
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-black text-3xl shadow-inner`}>
                          {initialLetter}
                        </div>
                      )}
                    </div>
                    {user.isVerified && (
                      <span className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full shadow-md ring-3 ring-white dark:ring-slate-900 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  <div className="text-center sm:text-left flex-1 pb-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 justify-center sm:justify-start">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-wide">
                        {user.displayName}
                      </h3>
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-0.5 sm:mt-0">
                        {user.isVerified ? (
                          <span className="text-[10px] bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                            <span>অনুমোদিত নাগরিক</span>
                          </span>
                        ) : (
                          <button 
                            onClick={() => alert("ভেরিফিকেশনের অনুরোধ পাঠানো হয়েছে। অ্যাডমিন প্যানেল থেকে খুব শীঘ্রই আপনার প্রোফাইল ভেরিফাই করা হবে।")}
                            className="text-[9px] bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-pink-200/80 dark:border-slate-700 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 transition-colors"
                          >
                            <Shield className="w-3 h-3" />
                            ভেরিফাই করুন
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                      {user.email || 'কুষ্টিয়া, বাংলাদেশ'}
                    </p>

                    {user.citizenId && (
                      <div className="mt-1.5 flex items-center justify-center sm:justify-start gap-1.5 text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                        <span className="opacity-70">UID:</span>
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-pink-200/80 dark:border-slate-700">
                          <span className="text-slate-900 dark:text-slate-200">
                            {user.citizenId}
                          </span>
                          <button 
                            onClick={() => handleCopyId(user.citizenId!)}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-emerald-600"
                            title="ID কপি করুন"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-[10px] text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-100/70 dark:border-emerald-900/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Firebase Auth Verified</span>
                    </div>
                  </div>
                </div>

                {/* Dynamic User Stats Grid */}
                <div className="grid grid-cols-3 gap-2 py-3.5 px-4 mb-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-pink-100 dark:border-slate-800/60 text-center">
                  <div>
                    <span className="block text-[11px] font-bold text-slate-500 dark:text-slate-400">আমার মোট পোস্ট</span>
                    <span className="text-sm font-black text-slate-800 dark:text-slate-200 mt-0.5 block">{myPosts.length}টি</span>
                  </div>
                  <div className="border-x border-pink-200/80/50 dark:border-slate-800">
                    <span className="block text-[11px] font-bold text-slate-500 dark:text-slate-400">লাইভ পাবলিশড</span>
                    <span className="text-sm font-black text-slate-800 dark:text-slate-200 mt-0.5 block">
                      {myPosts.filter(p => p.status === 'approved' || !p.status).length}টি
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-slate-500 dark:text-slate-400">মেম্বার রোল</span>
                    <span className="text-sm font-black text-emerald-700 dark:text-emerald-400 mt-0.5 block truncate">
                      {isAdmin ? 'এডমিন' : (user.role === 'moderator' ? 'মডারেটর' : 'নাগরিক')}
                    </span>
                  </div>
                </div>

                {/* Inline Edit Form or Details View */}
                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4 pt-3.5 border-t border-pink-100 dark:border-slate-800">
                    <div className="flex items-center justify-between pb-1">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Edit2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>প্রোফাইল তথ্য পরিবর্তন করুন</span>
                      </h4>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <X className="w-4.5 h-4.5" />
                      </button>
                    </div>

                    {editError && (
                      <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 rounded-2xl text-xs font-medium flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>{editError}</span>
                      </div>
                    )}

                    {/* Curated Preset Avatar Picker Gallery */}
                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
                        <Camera className="w-3.5 h-3.5 text-slate-500" />
                        <span>আপনার প্রিমিয়াম প্রোফাইল ছবি সিলেক্ট করুন</span>
                      </label>
                      <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x">
                        {AVATAR_PRESETS.map(preset => {
                          const isSelected = preset.id === 'initials' 
                            ? (editPhotoURL === 'initials' || !editPhotoURL)
                            : editPhotoURL === preset.url;
                            
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => setEditPhotoURL(preset.id === 'initials' ? 'initials' : (preset.url || ''))}
                              className={`w-14 h-14 rounded-2xl flex-shrink-0 relative overflow-hidden border-2 transition-all snap-start ${
                                isSelected 
                                  ? 'border-emerald-600 dark:border-emerald-500 scale-105 shadow-md ring-2 ring-emerald-500/20' 
                                  : 'border-pink-200/80 dark:border-slate-800 hover:border-slate-400'
                              }`}
                            >
                              {preset.id === 'initials' ? (
                                <div className={`w-full h-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-black text-base`}>
                                  {initialLetter}
                                </div>
                              ) : (
                                <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                              )}
                              {isSelected && (
                                <div className="absolute inset-0 bg-emerald-600/10 flex items-center justify-center">
                                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 rounded-full" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-400 mb-1">পূর্ণ নাম</label>
                        <input
                          type="text"
                          required
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="আপনার নাম লিখুন"
                          className="w-full px-3.5 py-3 text-xs rounded-2xl border border-pink-200/80 dark:border-slate-800 focus:outline-hidden focus:border-pink-600 dark:focus:border-emerald-500 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-400 mb-1">মোবাইল নম্বর</label>
                        <input
                          type="tel"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="০১XXXXXXXXX"
                          className="w-full px-3.5 py-3 text-xs rounded-2xl border border-pink-200/80 dark:border-slate-800 focus:outline-hidden focus:border-pink-600 dark:focus:border-emerald-500 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-400 mb-1">ওয়ার্ড / এলাকা</label>
                          <input
                            type="text"
                            value={editWard}
                            onChange={(e) => setEditWard(e.target.value)}
                            placeholder="যেমন: ১৫ নং ওয়ার্ড"
                            className="w-full px-3.5 py-3 text-xs rounded-2xl border border-pink-200/80 dark:border-slate-800 focus:outline-hidden focus:border-pink-600 dark:focus:border-emerald-500 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-400 mb-1">ঠিকানা</label>
                          <input
                            type="text"
                            value={editAddress}
                            onChange={(e) => setEditAddress(e.target.value)}
                            placeholder="পূর্ব পাটোয়ারী পাড়া"
                            className="w-full px-3.5 py-3 text-xs rounded-2xl border border-pink-200/80 dark:border-slate-800 focus:outline-hidden focus:border-pink-600 dark:focus:border-emerald-500 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 pt-2">
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={handleCancelEdit}
                        className="py-3 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-black transition-colors"
                      >
                        বাতিল
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="py-3 px-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    {/* Curated Information Cards List */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/30 border border-pink-100 dark:border-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                          <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">মোবাইল নম্বর:</span>
                        </div>
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          {user.phone || 'যুক্ত করা হয়নি'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/30 border border-pink-100 dark:border-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                          <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">ওয়ার্ড / এলাকা:</span>
                        </div>
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          {user.ward || 'যুক্ত করা হয়নি'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/30 border border-pink-100 dark:border-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                          <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">ঠিকানা:</span>
                        </div>
                        <span className="text-xs font-black text-slate-900 dark:text-white truncate max-w-[200px]">
                          {user.address || 'কুষ্টিয়া, বাংলাদেশ'}
                        </span>
                      </div>
                    </div>

                    {/* Edit Profile Button */}
                    <button
                      onClick={handleStartEdit}
                      className="w-full py-3 px-4 mb-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all border border-pink-200/80/60 dark:border-slate-800 shadow-xs"
                    >
                      <Edit2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      <span>প্রোফাইল এডিট করুন</span>
                    </button>

                    {/* Secure Admin Panel Shortcut - ONLY for authenticated admin */}
                    {isAdmin && (
                      <button
                        id="profile-admin-panel-btn"
                        onClick={() => onNavigate('admin-panel' as any)}
                        className="w-full py-3 px-4 mb-4 bg-slate-950 hover:bg-slate-900 text-emerald-400 rounded-2xl text-xs font-black flex items-center justify-center gap-2.5 border border-emerald-500/30 shadow-md transition-all active:scale-99 cursor-pointer"
                      >
                        <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
                        <span>অ্যাডমিন প্যানেলে প্রবেশ করুন</span>
                      </button>
                    )}

                    {/* Action Buttons Row */}
                    <div className="grid grid-cols-2 gap-2.5 pt-3.5 border-t border-pink-100 dark:border-slate-800">
                      <button
                        onClick={onOpenCreatePost}
                        className="py-3 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white rounded-2xl text-xs font-black transition-all shadow-md hover:shadow-lg text-center"
                      >
                        + নতুন পোস্ট করুন
                      </button>
                      <button
                        onClick={logOut}
                        className="py-3 px-4 bg-slate-100 hover:bg-rose-50/70 dark:bg-slate-800 dark:hover:bg-rose-950/20 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition-all border border-pink-200/80/50 dark:border-slate-850"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>লগআউট</span>
                      </button>
                    </div>

                    {/* Delete Account Option */}
                    <div className="pt-4 mt-2.5 border-t border-pink-100 dark:border-slate-800 flex justify-center">
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={handleDeleteAccount}
                        className="text-xs text-rose-500 hover:text-rose-700 font-extrabold flex items-center gap-1.5 px-4 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4 shrink-0" />
                        <span>{isDeleting ? 'অ্যাকাউন্ট মোছা হচ্ছে...' : 'অ্যাকাউন্ট মুছে ফেলুন'}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-pink-200/80/80 dark:border-slate-800 shadow-xs text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 mx-auto flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-3">
                <User className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">আপনি লগইন করেননি</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto mb-4">
                আমার কুষ্টিয়াতে পোস্ট করতে ও ব্যক্তিগত কার্যক্রম দেখতে আপনার গুগল বা ফেসবুক দিয়ে লগইন করুন
              </p>
              <button
                onClick={openAuthModal}
                className="py-2.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>লগইন করুন</span>
              </button>
            </div>
          )}

          {/* Quick Menu Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => onNavigate('saved-posts')}
              className="p-3 bg-white dark:bg-slate-900 rounded-3xl border border-pink-200/80/80 dark:border-slate-800 hover:border-pink-300 dark:hover:border-emerald-800/60 text-center transition-all flex flex-col items-center justify-center gap-2 shadow-xs group"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-105">
                <Bookmark className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-black text-slate-800 dark:text-slate-200">সংরক্ষিত পোস্ট</span>
            </button>

            <button
              onClick={() => onNavigate('help-support')}
              className="p-3 bg-white dark:bg-slate-900 rounded-3xl border border-pink-200/80/80 dark:border-slate-800 hover:border-pink-300 dark:hover:border-emerald-800/60 text-center transition-all flex flex-col items-center justify-center gap-2 shadow-xs group"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-105">
                <HelpCircle className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-black text-slate-800 dark:text-slate-200">সাহায্য ও সাপোর্ট</span>
            </button>

            <button
              onClick={() => onNavigate('terms-privacy')}
              className="p-3 bg-white dark:bg-slate-900 rounded-3xl border border-pink-200/80/80 dark:border-slate-800 hover:border-pink-300 dark:hover:border-emerald-800/60 text-center transition-all flex flex-col items-center justify-center gap-2 shadow-xs group"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-105">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-black text-slate-800 dark:text-slate-200">শর্ত ও নীতি</span>
            </button>
          </div>

          {/* My Posts & Drafts Section */}
          {(user || myPosts.length > 0 || userDrafts.length > 0) && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4.5 border border-pink-200/80/80 dark:border-slate-800/80 shadow-xs">
              
              {/* Tab Selector Header */}
              <div className="flex items-center justify-between gap-2 border-b border-pink-100/80 dark:border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
                  <button
                    onClick={() => setActivePostsTab('published')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activePostsTab === 'published'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>আমার পোস্টসমূহ ({myPosts.length})</span>
                  </button>

                  <button
                    onClick={() => setActivePostsTab('drafts')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activePostsTab === 'drafts'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                    <span>খসড়া ({userDrafts.length})</span>
                    {userDrafts.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    )}
                  </button>
                </div>

                {activePostsTab === 'published' && myPosts.some(p => p.status === 'pending') && (
                  <span className="text-[9px] font-extrabold text-amber-800 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/40 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400 animate-pulse" />
                    <span>অনুমোদনাধীন পোস্ট আছে</span>
                  </span>
                )}
              </div>

              {/* Tab 1: Published & Pending Posts */}
              {activePostsTab === 'published' && (
                myPosts.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs">
                    আপনি এখনো কোনো পোস্ট করেননি।
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myPosts.map(p => {
                      const isPending = p.status === 'pending';
                      const isApproved = !p.status || p.status === 'approved';
                      const isRejected = p.status === 'rejected';

                      return (
                        <div 
                          key={p.id} 
                          className={`p-3.5 rounded-2xl border transition-all ${
                            isPending 
                              ? 'bg-amber-50/20 dark:bg-amber-950/10 border-amber-200/70 dark:border-amber-900/40' 
                              : isRejected 
                              ? 'bg-rose-50/20 dark:bg-rose-950/10 border-rose-200/60 dark:border-rose-900/40' 
                              : 'bg-slate-50/50 dark:bg-slate-800/20 border-pink-100 dark:border-slate-850 hover:border-pink-200/80'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="overflow-hidden flex-1">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-xs font-black text-slate-900 dark:text-white line-clamp-1">
                                  {p.title}
                                </span>
                                {p.featured && (
                                  <span className="bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 text-[9px] px-1.5 py-0.5 rounded font-extrabold flex items-center gap-0.5">
                                    <Rocket className="w-2.5 h-2.5" />
                                    Boosted
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap font-medium">
                                <span className="flex items-center gap-0.5">
                                  <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                  {p.location}
                                </span>
                                <span>•</span>
                                <span className="font-extrabold text-slate-700 dark:text-slate-300">
                                  {p.price || (p.category === 'house-rent' ? 'ভাড়া' : p.category)}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1.5 shrink-0">
                              {isApproved && !p.featured && (
                                <button 
                                  onClick={() => alert("পোস্ট বুস্ট করার জন্য অ্যাডমিনের সাথে যোগাযোগ করুন অথবা পেমেন্ট গেটওয়ের মাধ্যমে স্পন্সর করুন।")}
                                  className="text-[9px] bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 px-2 py-1 rounded-lg font-extrabold flex items-center gap-1 transition-colors border border-orange-200/50 dark:border-orange-900/50 cursor-pointer"
                                >
                                  <Rocket className="w-3 h-3" />
                                  Boost
                                </button>
                              )}

                              {/* Dynamic Post Status Badges */}
                              {isPending && (
                                <span className="text-[9px] bg-amber-500 text-slate-950 px-2 py-1 rounded-lg font-black flex items-center gap-1 animate-pulse">
                                  <Clock className="w-3 h-3 text-slate-950" />
                                  <span>পেন্ডিং</span>
                                </span>
                              )}

                              {isApproved && (
                                <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/50 dark:border-emerald-800/50 px-2 py-1 rounded-lg font-extrabold flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>লাইভ</span>
                                </span>
                              )}

                              {isRejected && (
                                <span className="text-[9px] bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300/50 dark:border-rose-800/50 px-2 py-1 rounded-lg font-extrabold flex items-center gap-1">
                                  <XCircle className="w-3 h-3 text-rose-600" />
                                  <span>বাতিল</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Status explanations */}
                          {isPending && (
                            <div className="mt-2.5 pt-2.5 border-t border-amber-200/50 dark:border-amber-900/30 flex items-start gap-1.5 text-[10px] text-amber-900 dark:text-amber-300 font-bold leading-relaxed">
                              <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                              <span>আপনার এই পোস্টটি এডমিন প্যানেলে পর্যালোচনার জন্য জমা আছে। এডমিন অনুমোদন দিলে এটি সবার কাছে পাবলিশড হবে।</span>
                            </div>
                          )}

                          {isRejected && (
                            <div className="mt-2.5 pt-2.5 border-t border-rose-200/50 dark:border-rose-900/30 text-[10px] text-rose-700 dark:text-rose-300 font-bold leading-relaxed flex items-start gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                              <span>বাতিলের কারণ: {p.rejectionReason || 'নীতিমালা পরিপন্থী বা অসম্পূর্ণ বিবরণ।'}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )
              )}

              {/* Tab 2: Drafts Tab */}
              {activePostsTab === 'drafts' && (
                <div className="space-y-3">
                  {userDrafts.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 mx-auto flex items-center justify-center">
                        <Bookmark className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-slate-700 dark:text-slate-300">কোনো সংরক্ষিত খসড়া নেই</p>
                      <p className="text-[11px] max-w-xs mx-auto">
                        নতুন পোস্ট তৈরি করার সময় 'খসড়া হিসেবে সেভ করুন' বাটনে ক্লিক করলে ড্রাফট এখানে সংরক্ষিত থাকবে।
                      </p>
                      <button
                        onClick={onOpenCreatePost}
                        className="mt-2 py-2 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        + নতুন পোস্ট ড্রাফট করুন
                      </button>
                    </div>
                  ) : (
                    userDrafts.map((draft) => (
                      <div
                        key={draft.id}
                        className="p-3.5 rounded-2xl border bg-amber-50/20 dark:bg-amber-950/10 border-amber-200/80 dark:border-amber-900/40 hover:border-amber-300 transition-all space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="overflow-hidden flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-xs font-black text-slate-900 dark:text-white line-clamp-1">
                                {draft.title}
                              </span>
                              <span className="text-[9px] bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-md font-bold">
                                {draft.category}
                              </span>
                              {draft.isAutoSaved && (
                                <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                                  অটো-সেভ
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {draft.description || 'বিবরণ এখনো যুক্ত করা হয়নি।'}
                            </p>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-2 flex-wrap font-medium mt-1.5">
                              <span>এলাকা: {draft.location}</span>
                              {draft.price && <span>• মূল্য: {draft.price}</span>}
                              <span>• সর্বশেষ পরিবর্তন: {new Date(draft.updatedAt).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>

                        {/* Draft Action Buttons: Resume/Edit, Submit for Review, Delete */}
                        <div className="pt-2 border-t border-amber-200/50 dark:border-amber-900/30 flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleResumeDraft(draft)}
                              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                              title="খসড়াটি আবার এডিট ও সম্পন্ন করুন"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>সম্পাদনা ও শুরু করুন</span>
                            </button>

                            <button
                              disabled={submittingDraftId === draft.id}
                              onClick={() => handleSubmitDraftForReview(draft)}
                              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                              title="এডমিন অনুমোদনের জন্য জমা দিন"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>{submittingDraftId === draft.id ? 'জমা হচ্ছে...' : 'এডমিন রিভিউতে পাঠান'}</span>
                            </button>
                          </div>

                          <button
                            onClick={() => handleDeleteDraft(draft.id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                            title="খসড়া মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

            </div>
          )}
    </div>
  );
};
