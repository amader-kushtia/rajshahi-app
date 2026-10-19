import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  AlertCircle, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  KeyRound, 
  X, 
  ShieldAlert, 
  HelpCircle,
  Sparkles,
  Phone
} from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { CategoryType } from '../types';

interface LoginPageProps {
  onBack: () => void;
  onNavigate: (category: CategoryType) => void;
  onOpenAdminPanel?: () => void;
}

export interface LoginDetailedFeedback {
  title: string;
  message: string;
  checklist?: string[];
  errorCode?: string;
  failedField?: 'email' | 'password' | 'both' | 'network' | 'system';
  isAdminAttempt?: boolean;
}

export const parseLoginError = (err: any, emailInput: string): LoginDetailedFeedback => {
  const code = err?.code || '';
  const msg = err?.message || '';

  // 1. Missing Firebase config / API Key
  if (code === 'auth/api-key-not-valid' || msg.includes('api-key-not-valid')) {
    return {
      title: 'ফায়ারবেস এপিআই কী (API Key) কনফিগারেশন ত্রুটি',
      message: 'অ্যাপের ফায়ারবেস অথেন্টিকেশন এপিআই কী সক্রিয় পাওয়া যায়নি। দয়া করে প্রজেক্টের কনফিগারেশন ফাইল বা .env ফাইলটি যাচাই করুন।',
      checklist: [
        'প্রজেক্টের .env ফাইলে VITE_FIREBASE_API_KEY সঠিকভাবে দেওয়া আছে কিনা তা নিশ্চিত করুন।',
        'প্রয়োজনে ইন্টারনেট সংযোগ ও ফায়ারবেস কনফিগারেশন চেক করুন।'
      ],
      errorCode: code || 'auth/api-key-not-valid',
      failedField: 'system',
      isAdminAttempt: false
    };
  }

  // 2. Wrong Password / Invalid Credential
  if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
    return {
      title: 'লগইন ব্যর্থ — ইমেইল বা পাসওয়ার্ড সঠিক নয়',
      message: 'প্রবেশকৃত ইমেইল বা পাসওয়ার্ডটি মিলছে না। অনুগ্রহ করে যাচাই করে পুনরায় চেষ্টা করুন।',
      checklist: [
        'ইমেইল ও পাসওয়ার্ডের বানান সতর্কতার সাথে পুনরায় মিলিয়ে নিন।',
        'পাসওয়ার্ড মনে না থাকলে "পাসওয়ার্ড ভুলে গেছেন?" অপশন ব্যবহার করে রিসেট করুন।',
        'অ্যাকাউন্ট না থাকলে নিচে "নতুন অ্যাকাউন্ট তৈরি করুন" বাটনে ক্লিক করুন।'
      ],
      errorCode: code,
      failedField: 'password',
      isAdminAttempt: false
    };
  }

  // 3. User Not Found
  if (code === 'auth/user-not-found') {
    return {
      title: 'অ্যাকাউন্ট পাওয়া যায়নি',
      message: `"${emailInput.trim()}" ইমেইল ঠিকানায় কোনো নিবন্ধিত অ্যাকাউন্ট পাওয়া যায়নি।`,
      checklist: [
        'ইমেইল ঠিকানার বানানে কোনো অসাবধানতাবশত ভুল বা অতিরিক্ত স্পেস আছে কিনা দেখুন।',
        'আপনি যদি নতুন হন, তবে নিচে "নতুন অ্যাকাউন্ট তৈরি করুন" বাটনে ট্যাপ করে নিবন্ধন করুন।'
      ],
      errorCode: code,
      failedField: 'email',
      isAdminAttempt: false
    };
  }

  // 4. Invalid Email Format
  if (code === 'auth/invalid-email') {
    return {
      title: 'ইমেইল ফরম্যাট সঠিক নয়',
      message: 'প্রবেশকৃত ইমেইল ঠিকানার ফরম্যাট বৈধ নয়। যেমন: name@example.com',
      checklist: [
        'ইমেইল ঠিকানায় অবশ্যই "@" এবং ডোমেন নাম (যেমন gmail.com) থাকতে হবে।',
        'ইমেইলের আগে বা পরে কোনো খালি স্থান (space) রাখা যাবে না।'
      ],
      errorCode: code,
      failedField: 'email',
      isAdminAttempt: false
    };
  }

  // 5. Weak Password
  if (code === 'auth/weak-password') {
    return {
      title: 'পাসওয়ার্ড অতিরিক্ত দুর্বল',
      message: 'পাসওয়ার্ডটি অতিরিক্ত ছোট। নিরাপত্তা সুরক্ষার জন্য পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।',
      checklist: [
        'কমপক্ষে ৬টি বা তার বেশি অক্ষরের পাসওয়ার্ড ব্যবহার করুন।'
      ],
      errorCode: code,
      failedField: 'password',
      isAdminAttempt: false
    };
  }

  // 6. Too Many Requests / Temporarily Blocked
  if (code === 'auth/too-many-requests') {
    return {
      title: 'অ্যাকাউন্ট সাময়িকভাবে স্থগিত',
      message: 'নিরাপত্তা ব্যবস্থার অংশ হিসেবে বারবার ভুল পাসওয়ার্ড দেওয়ার কারণে এই অ্যাকাউন্টটি সাময়িকভাবে লক করা হয়েছে।',
      checklist: [
        '৫ থেকে ১৫ মিনিট অপেক্ষা করে পুনরায় চেষ্টা করুন।',
        'অথবা "পাসওয়ার্ড ভুলে গেছেন?" বাটনে ক্লিক করে পাসওয়ার্ড রিসেট করুন।'
      ],
      errorCode: code,
      failedField: 'both',
      isAdminAttempt: false
    };
  }

  // 7. Network / Offline Error
  if (code === 'auth/network-request-failed' || msg.toLowerCase().includes('network') || !navigator.onLine) {
    return {
      title: 'নেটওয়ার্ক বা ইন্টারনেট সংযোগ সমস্যা',
      message: 'ফায়ারবেস অথেন্টিকেশন সার্ভারের সাথে সংযোগ স্থাপন করা যাচ্ছে না।',
      checklist: [
        'আপনার ডিভাইসের ইন্টারনেট বা ওয়াইফাই সংযোগ চালু রয়েছে কিনা পরীক্ষা করুন।',
        'ভিপিএন (VPN) চালু থাকলে তা সাময়িকভাবে বন্ধ করে পুনরায় চেষ্টা করুন।'
      ],
      errorCode: code || 'auth/network-request-failed',
      failedField: 'network',
      isAdminAttempt: false
    };
  }

  // 8. Account Disabled
  if (code === 'auth/user-disabled') {
    return {
      title: 'অ্যাকাউন্টটি নিষ্ক্রিয় করা হয়েছে',
      message: 'এই অ্যাকাউন্টটি অ্যাডমিনিস্ট্রেটর কর্তৃক সাময়িকভাবে স্থগিত বা নিষ্ক্রিয় রাখা হয়েছে।',
      checklist: [
        'সহায়তার জন্য কুষ্টিয়া জেলা সাপোর্ট টিম বা প্রধান প্রশাসকের সাথে যোগাযোগ করুন।'
      ],
      errorCode: code,
      failedField: 'email',
      isAdminAttempt: false
    };
  }

  // Fallback
  return {
    title: 'লগইন সম্পন্ন করা যায়নি',
    message: msg || 'ইমেইল বা পাসওয়ার্ড যাচাইয়ের সময় একটি অনাকাঙ্ক্ষিত ত্রুটি দেখা দিয়েছে।',
    checklist: [
      'আপনার দেওয়া তথ্য পুনরায় যাচাই করে চেষ্টা করুন।',
      'প্রয়োজনে ইন্টারনেট সংযোগ রিফ্রেশ করে আবার চেষ্টা করুন।'
    ],
    errorCode: code || 'auth/unknown',
    failedField: 'both',
    isAdminAttempt: false
  };
};

export const LoginPage: React.FC<LoginPageProps> = ({ onBack, onNavigate, onOpenAdminPanel }) => {
  const { loginWithCredentials } = useAuth();
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [feedback, setFeedback] = useState<LoginDetailedFeedback | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'mh7539019@gmail.com').toLowerCase();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    setSuccessMessage('');
    try {
      await loginWithCredentials(email, password);
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail === ADMIN_EMAIL) {
        if (onOpenAdminPanel) {
          onOpenAdminPanel();
        } else {
          onNavigate('admin-panel' as any);
        }
      } else {
        onBack();
      }
    } catch (err: any) {
      const detailedFeedback = parseLoginError(err, email);
      setFeedback(detailedFeedback);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const targetEmail = email.trim();
    if (!targetEmail) {
      setFeedback({
        title: 'ইমেইল প্রয়োজন',
        message: 'পাসওয়ার্ড রিসেট করতে অনুগ্রহ করে নিচের ঘরে আপনার ইমেইল ঠিকানাটি লিখুন।',
        checklist: ['ইমেইল লেখার পর পুনরায় "পাসওয়ার্ড ভুলে গেছেন?" বা রিসেট বাটনে ক্লিক করুন।'],
        failedField: 'email'
      });
      setSuccessMessage('');
      return;
    }

    setResetLoading(true);
    setFeedback(null);
    setSuccessMessage('');

    console.log('[Auth Debug] Attempting password reset email for:', targetEmail);
    console.log('[Auth Debug] Firebase Auth Config State:', {
      authDomain: auth.app.options.authDomain,
      projectId: auth.app.options.projectId,
      hasApiKey: !!auth.app.options.apiKey
    });

    try {
      await sendPasswordResetEmail(auth, targetEmail);
      console.log('[Auth Debug] Password reset email sent successfully to:', targetEmail);
      setSuccessMessage(`আপনার (${targetEmail}) ঠিকানায় পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে। ইনবক্স বা স্প্যাম ফোল্ডার চেক করুন।`);
    } catch (err: any) {
      console.error('[Auth Debug] Password reset email failed with error:', {
        code: err?.code,
        message: err?.message,
        email: targetEmail
      });
      if (err?.code === 'auth/user-not-found') {
        setSuccessMessage(`আপনার এই ইমেইলটি (${targetEmail}) আমাদের ডাটাবেজে নতুন। আপনি যেকোনো পাসওয়ার্ড দিয়ে সরাসরি "লগইন করুন" বাটনে ক্লিক করে অ্যাকাউন্ট চালু করতে পারেন।`);
      } else {
        const resetFeedback = parseLoginError(err, targetEmail);
        setFeedback(resetFeedback);
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
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
            <h1 className="text-xl font-bold">লগইন করুন</h1>
            <p className="text-emerald-100 text-xs mt-0.5">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-8 max-w-md mx-auto">
        <div className="text-center mb-8 mt-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 mx-auto flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-emerald-900/20 mb-4 overflow-hidden p-2">
            <img src="/assets/logo.svg" alt="Logo" className="w-full h-full object-contain filter drop-shadow" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            কুষ্টিয়া জেলা
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            স্বাগতম! দয়া করে আপনার তথ্য দিন।
          </p>
        </div>

        {/* Security & Contact Guard Notice */}
        <div className="mb-6 p-3.5 bg-emerald-50/90 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-950 text-xs shadow-xs">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block text-emerald-900">নিরাপত্তা ও যোগাযোগের নিয়মাবলী:</span>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              আমাদের কুষ্টিয়া অ্যাপ নিরাপদে ব্যবহার করতে সঠিক তথ্য প্রদান করুন, পাসওয়ার্ড গোপন রাখুন এবং যোগাযোগের আগে নম্বর ও পরিচয় যাচাই করুন। ভুয়া তথ্য, প্রতারণা ও হয়রানি থেকে বিরত থাকুন। জরুরি পরিস্থিতিতে সংশ্লিষ্ট কর্তৃপক্ষের সঙ্গে সরাসরি যোগাযোগ করুন।
            </p>
          </div>
        </div>

        {successMessage && (
          <div className="mb-5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2 text-emerald-800 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>{successMessage}</p>
          </div>
        )}

        {/* Detailed Login Failure Feedback Alert */}
        {feedback && (
          <div 
            id="login-failure-feedback"
            className="mb-6 p-4 bg-rose-50/95 border border-rose-200 rounded-2xl text-slate-800 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200"
          >
            {/* Feedback Header */}
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 border border-rose-200">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-rose-950 leading-tight">
                    {feedback.title}
                  </h3>
                  {feedback.errorCode && (
                    <span className="text-[10px] font-mono font-semibold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                      ত্রুটি কোড: {feedback.errorCode}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setFeedback(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-rose-100/50 transition-colors"
                title="বার্তা বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Primary Explanation Text */}
            <p className="text-xs text-rose-900 font-medium mb-3 leading-relaxed">
              {feedback.message}
            </p>

            {/* Structured Troubleshooting Checklist */}
            {feedback.checklist && feedback.checklist.length > 0 && (
              <div className="bg-white/90 rounded-xl p-3 border border-rose-200/80 mb-3 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>সমাধানের নির্দেশনা:</span>
                </span>
                <ul className="space-y-1.5">
                  {feedback.checklist.map((item, idx) => (
                    <li key={idx} className="text-[11px] text-slate-600 flex items-start gap-2 leading-relaxed">
                      <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Admin Special Password Recovery Action */}
            {feedback.isAdminAttempt && (
              <div className="pt-2.5 border-t border-rose-200/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>অ্যাডমিন নিরাপত্তা রিকভারি</span>
                </div>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={resetLoading}
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{resetLoading ? 'পাঠানো হচ্ছে...' : 'এডমিন পাসওয়ার্ড রিসেট লিংক পাঠান'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">মোবাইল নাম্বার</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Phone className={`h-5 w-5 ${feedback?.failedField === 'email' || feedback?.failedField === 'both' ? 'text-rose-500' : 'text-slate-400'}`} />
              </div>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (feedback?.failedField === 'email' || feedback?.failedField === 'both') {
                    setFeedback(null);
                  }
                }}
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all outline-none ${
                  feedback?.failedField === 'email' || feedback?.failedField === 'both'
                    ? 'bg-rose-50/40 border-2 border-rose-400 text-rose-950 focus:ring-2 focus:ring-rose-400/20'
                    : 'bg-slate-50 border border-pink-200/80 text-slate-900 focus:ring-2 focus:ring-pink-500/20 focus:border-emerald-500'
                }`}
                placeholder="017xxxxxxxx"
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-slate-700">পাসওয়ার্ড</label>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={resetLoading}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors disabled:opacity-50"
              >
                {resetLoading ? 'পাঠানো হচ্ছে...' : 'পাসওয়ার্ড ভুলে গেছেন?'}
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className={`h-5 w-5 ${feedback?.failedField === 'password' || feedback?.failedField === 'both' ? 'text-rose-500' : 'text-slate-400'}`} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (feedback?.failedField === 'password' || feedback?.failedField === 'both') {
                    setFeedback(null);
                  }
                }}
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all outline-none ${
                  feedback?.failedField === 'password' || feedback?.failedField === 'both'
                    ? 'bg-rose-50/40 border-2 border-rose-400 text-rose-950 focus:ring-2 focus:ring-rose-400/20'
                    : 'bg-slate-50 border border-pink-200/80 text-slate-900 focus:ring-2 focus:ring-pink-500/20 focus:border-emerald-500'
                }`}
                placeholder="আপনার পাসওয়ার্ড দিন"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 mt-4 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-600 hover:from-emerald-700 hover:to-emerald-500 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-900/20 transition-all disabled:opacity-70"
          >
            {loading ? 'অপেক্ষা করুন...' : 'লগইন করুন'}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative flex py-3 items-center">
            <div className="grow border-t border-pink-200/80"></div>
            <span className="shrink mx-4 text-xs text-slate-400 font-semibold uppercase">নতুন ব্যবহারকারী?</span>
            <div className="grow border-t border-pink-200/80"></div>
          </div>
          
          <button
            onClick={() => onNavigate('register')}
            className="w-full py-3.5 px-4 mt-2 rounded-xl bg-white text-emerald-700 font-bold text-sm flex items-center justify-center gap-2 border-2 border-emerald-100 hover:bg-emerald-50 transition-colors"
          >
            নতুন অ্যাকাউন্ট তৈরি করুন
          </button>
        </div>
      </div>
    </div>
  );
};
