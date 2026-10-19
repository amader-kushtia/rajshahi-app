import React, { useState } from 'react';
import { Mail, Lock, User, Phone, MapPin, Building2, AlertCircle, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { CategoryType } from '../types';

const BOY_EMOJIS = ['👦', '👨', '👨‍🦱', '👨‍🦰', '👱‍♂️', '🧔', '👲', '👳‍♂️', '👮‍♂️', '🦸‍♂️'];
const GIRL_EMOJIS = ['👧', '👩', '👩‍🦱', '👩‍🦰', '👱‍♀️', '🧕', '👩‍⚕️', '👸', '👮‍♀️', '🦸‍♀️'];
const OTHER_EMOJIS = ['🧑', '🧒', '🧑‍🦱', '🧑‍🦰', '👱', '👽', '👻', '🤖', '🦊', '🐼'];

const getEmojiDataUrl = (emoji: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${emoji}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

interface RegisterPageProps {
  onBack: () => void;
  onNavigate: (category: CategoryType) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onBack, onNavigate }) => {
  const { updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');

  const getPasswordStrength = (pwd: string) => {
    if (!pwd || pwd.length < 6) {
      return { label: 'দুর্বল', color: 'text-rose-600', level: 'weak' as const };
    }
    const hasDigitOrSpecial = /[\d\W_]/.test(pwd);
    const isOnlyLetters = /^[a-zA-Z\u0980-\u09FF]+$/.test(pwd);
    if (pwd.length >= 8 && hasDigitOrSpecial && !isOnlyLetters) {
      return { label: 'শক্তিশালী', color: 'text-emerald-600', level: 'strong' as const };
    }
    return { label: 'মাঝারি', color: 'text-amber-600', level: 'medium' as const };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate Bangladesh Phone Number format: 01[3-9] followed by 8 digits (total 11 digits)
    const normalizedPhone = phone.trim().replace(/^(\+880|880)/, '0');
    const bdPhoneRegex = /^01[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(normalizedPhone)) {
      setError('সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নাম্বার দিন (যেমন: 01712345678 বা 018xxxxxxxx)।');
      return;
    }

    if (passwordStrength.level === 'weak') {
      setError('পাসওয়ার্ড অত্যন্ত দুর্বল! অনুগ্রহ করে কমপক্ষে ৬ অক্ষরের শক্তিশালী পাসওয়ার্ড দিন।');
      return;
    }

    if (password !== confirmPassword) {
      setError('পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না।');
      return;
    }
    if (!gender) {
      setError('দয়া করে আপনার লিঙ্গ নির্বাচন করুন।');
      return;
    }
    if (!selectedEmoji) {
      setError('দয়া করে একটি কার্টুন ইমোজি বেছে নিন।');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const authEmail = `${normalizedPhone}@kushtiaconnect.local`;
      const userCredential = await createUserWithEmailAndPassword(auth, authEmail, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      const finalAvatarUrl = getEmojiDataUrl(selectedEmoji);
      
      // Generate unique human-readable 8-digit UID (e.g. 87654321)
      const citizenId = Math.floor(10000000 + Math.random() * 90000000).toString();

      const userData = {
        uid: user.uid,
        citizenId: citizenId,
        displayName: name,
        email: authEmail,
        phone: normalizedPhone,
        gender: gender,
        address: address,
        photoURL: finalAvatarUrl,
        status: 'active',
        role: 'citizen',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      await setDoc(doc(db, 'users', user.uid), userData);

      updateUserProfile({
        uid: user.uid,
        citizenId: citizenId,
        displayName: name,
        email: authEmail,
        phone: normalizedPhone,
        address: address,
        gender: gender as 'male' | 'female' | 'other',
        isVerified: true,
        photoURL: userData.photoURL
      });

      setSuccessMessage('আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! এখন মোবাইল নাম্বার ও পাসওয়ার্ড দিয়ে লগইন করুন।');
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (err: any) {
      if (err?.code === 'auth/api-key-not-valid' || err?.message?.includes('api-key-not-valid')) {
        setError('Firebase API Key কনফিগার করা নেই। অনুগ্রহ করে .env ফাইলে আসল Firebase Credentials দিন।');
      } else if (err.code === 'auth/email-already-in-use' || err.code === 'auth/account-exists-with-different-credential') {
        setError('এই মোবাইল নাম্বার দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট খোলা হয়েছে।');
      } else if (err.code === 'auth/weak-password') {
        setError('পাসওয়ার্ড অত্যন্ত সহজ। দয়া করে অন্তত ৬ অক্ষরের শক্তিশালী পাসওয়ার্ড দিন।');
      } else {
        setError('অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-emerald-800 text-white pt-12 pb-6 px-4 rounded-b-[2rem] shadow-lg sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold">নতুন অ্যাকাউন্ট তৈরি করুন</h1>
            <p className="text-emerald-100 text-xs mt-0.5">আমার কুষ্টিয়াতে যুক্ত হোন</p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-8 max-w-md mx-auto mt-2">
        {successMessage && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2 text-emerald-800 text-xs font-medium shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-red-700 text-xs font-medium shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-pink-100">
          <form onSubmit={handleSignup} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">সম্পূর্ণ নাম</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-pink-200/80 rounded-xl text-sm focus:ring-2 focus:ring-pink-500/20 focus:border-emerald-500 transition-all outline-none"
                  placeholder="আপনার নাম"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">মোবাইল নাম্বার</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-pink-200/80 rounded-xl text-sm focus:ring-2 focus:ring-pink-500/20 focus:border-emerald-500 transition-all outline-none"
                  placeholder="017xxxxxxxx"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">লিঙ্গ নির্বাচন করুন</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => { setGender('male'); setSelectedEmoji(''); }}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    gender === 'male' 
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800 ring-2 ring-emerald-500/20' 
                      : 'bg-white border-pink-200/80 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  পুরুষ
                </button>
                <button
                  type="button"
                  onClick={() => { setGender('female'); setSelectedEmoji(''); }}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    gender === 'female' 
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800 ring-2 ring-emerald-500/20' 
                      : 'bg-white border-pink-200/80 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  মহিলা
                </button>
                <button
                  type="button"
                  onClick={() => { setGender('other'); setSelectedEmoji(''); }}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    gender === 'other' 
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800 ring-2 ring-emerald-500/20' 
                      : 'bg-white border-pink-200/80 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  অন্যান্য
                </button>
              </div>
            </div>

            {gender && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">আপনার প্রোফাইলের জন্য একটি কার্টুন ইমোজি বেছে নিন</label>
                <div className="grid grid-cols-5 gap-2">
                  {(gender === 'male' ? BOY_EMOJIS : gender === 'female' ? GIRL_EMOJIS : OTHER_EMOJIS).map(emoji => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`text-2xl sm:text-3xl p-1.5 sm:p-2 rounded-xl border-2 transition-all flex items-center justify-center ${
                        selectedEmoji === emoji 
                          ? 'border-emerald-500 bg-emerald-50 scale-105 shadow-sm' 
                          : 'border-pink-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">ঠিকানা</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-pink-200/80 rounded-xl text-sm focus:ring-2 focus:ring-pink-500/20 focus:border-emerald-500 transition-all outline-none"
                  placeholder="মহল্লা / এলাকার নাম"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">পাসওয়ার্ড</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-pink-200/80 rounded-xl text-sm focus:ring-2 focus:ring-pink-500/20 focus:border-emerald-500 transition-all outline-none"
                    placeholder="৬ অক্ষরের বেশি"
                  />
                </div>
                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="mt-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-1 flex-1 mr-2">
                      <div className={`h-1 flex-1 rounded-full transition-colors ${passwordStrength.level === 'weak' ? 'bg-rose-500' : passwordStrength.level === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      <div className={`h-1 flex-1 rounded-full transition-colors ${passwordStrength.level === 'medium' ? 'bg-amber-500' : passwordStrength.level === 'strong' ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                      <div className={`h-1 flex-1 rounded-full transition-colors ${passwordStrength.level === 'strong' ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                    </div>
                    <span className={`text-[11px] font-bold ${passwordStrength.color}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">কনফার্ম পাসওয়ার্ড</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-pink-200/80 rounded-xl text-sm focus:ring-2 focus:ring-pink-500/20 focus:border-emerald-500 transition-all outline-none"
                    placeholder="পুনরায় টাইপ করুন"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 mt-6 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-600 hover:from-emerald-700 hover:to-emerald-500 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-900/20 transition-all disabled:opacity-70"
            >
              {loading ? 'অপেক্ষা করুন...' : 'অ্যাকাউন্ট তৈরি করুন'}
            </button>
          </form>
        </div>

        <div className="mt-8">
          <div className="relative flex py-3 items-center">
            <div className="grow border-t border-pink-200/80"></div>
            <span className="shrink mx-4 text-xs text-slate-400 font-semibold uppercase">আগে থেকেই অ্যাকাউন্ট আছে?</span>
            <div className="grow border-t border-pink-200/80"></div>
          </div>
          
          <button
            onClick={() => onNavigate('login')}
            className="w-full py-3 px-4 mt-2 rounded-xl bg-white text-slate-700 font-bold text-sm flex items-center justify-center gap-2 border border-pink-200/80 hover:bg-slate-50 transition-colors"
          >
            লগইন করুন
          </button>
        </div>

        <div className="mt-6 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-start gap-3 text-xs text-emerald-800 font-medium">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="leading-relaxed">
            আপনার সকল ব্যক্তিগত তথ্য, নাম্বার ও ঠিকানা ফায়ারবেস ডেটাবেস দ্বারা সম্পূর্ণ সুরক্ষিত ও এনক্রিপ্টেড। আপনার সম্মতি ব্যতীত কোনো তথ্য শেয়ার করা হয় না।
          </p>
        </div>

      </div>
    </div>
  );
};
