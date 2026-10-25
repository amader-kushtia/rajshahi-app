import React, { useRef, useState } from 'react';
import { 
  ShieldCheck, 
  Share2, 
  Download, 
  MapPin, 
  Droplet,
  Globe,
  Sparkles,
  QrCode,
  Copy,
  Check,
  AlertCircle,
  X,
  ExternalLink,
  Sparkle
} from 'lucide-react';
import { UserProfile } from '../types';
import { useAdminConfig } from '../context/AdminConfigContext';
import { QRCodeSVG } from 'qrcode.react';

interface SmartCitizenIDCardProps {
  user: UserProfile;
}

export const SmartCitizenIDCard: React.FC<SmartCitizenIDCardProps> = ({ user }) => {
  const { themeConfig } = useAdminConfig();
  const cardRef = useRef<HTMLDivElement>(null);
  
  // State
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [previewImageData, setPreviewImageData] = useState<string | null>(null);

  const appName = 'আমার কুষ্টিয়া';
  const primaryGradient = themeConfig?.primaryGradient || 'from-emerald-700 to-teal-800';

  const citizenIdCode = user.citizenId || (user.uid ? user.uid.substring(0, 8).toUpperCase() : '5PXY5HH2');
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://amarkushtia.app';
  
  const postCaption = `🇧🇩 আমি '${appName}' অ্যাপের একজন ভেরিফাইড স্মার্ট নাগরিক!\n✨ নাম: ${user.displayName || 'সম্মানিত নাগরিক'}\n🆔 স্মার্ট সিটিজেন আইডি: ${citizenIdCode}\n\nকুষ্টিয়া শহরের সকল জরুরি সেবা, যাতায়াত ও নাগরিক আইডি পেতে অ্যাপটি ব্যবহার করুন:\n${shareUrl}`;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Synchronous Clipboard Copy with multi-layer fallback for iframe environments
  const copyToClipboard = (text: string, msg = 'লিঙ্ক ও তথ্য সফলভাবে কপি হয়েছে!') => {
    let success = false;

    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      textarea.setAttribute('readonly', '');
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, 99999);
      success = document.execCommand('copy');
      document.body.removeChild(textarea);
    } catch (err) {
      console.warn('execCommand copy warning:', err);
    }

    if (!success && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setShowCopied(true);
        triggerToast(msg);
        setTimeout(() => setShowCopied(false), 2500);
      }).catch(e => {
        console.warn('Async writeText fallback warning:', e);
        triggerToast('কপি করতে সমস্যা হয়েছে। লিঙ্ক সিলেক্ট করে ম্যানুয়ালি কপি করুন।');
      });
      return;
    }

    if (success) {
      setShowCopied(true);
      triggerToast(msg);
      setTimeout(() => setShowCopied(false), 2500);
    } else {
      triggerToast('লিঙ্ক সিলেক্ট করে ম্যানুয়ালি কপি করুন।');
    }
  };

  // 1-Click Facebook Share & Post
  const handleFacebookShare = (e?: React.MouseEvent) => {
    copyToClipboard(postCaption, 'ফেসবুক পোস্টের বিবরণ ও লিঙ্ক কপি হয়েছে!');
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
  };

  // 1-Click TikTok Share & Post
  const handleTikTokShare = (e?: React.MouseEvent) => {
    copyToClipboard(postCaption, 'টিকটক ক্যাপশন ও লিঙ্ক কপি হয়েছে! টিকটকে পেস্ট করে শেয়ার করুন।');
    window.open('https://www.tiktok.com/upload', '_blank', 'noopener,noreferrer');
  };

  // 1-Click WhatsApp Share
  const handleWhatsAppShare = (e?: React.MouseEvent) => {
    copyToClipboard(postCaption, 'হোয়াটসঅ্যাপ বার্তা কপি হয়েছে!');
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(postCaption)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Main Share Button
  const handleMainShareClick = async () => {
    setError(null);
    setIsSocialModalOpen(true);

    if (navigator.share && window.isSecureContext) {
      try {
        await navigator.share({
          title: `${user.displayName || 'নাগরিক'} - ${appName} Smart Citizen ID`,
          text: postCaption,
          url: shareUrl,
        });
      } catch (err: any) {
        console.warn('Native share dismissed or not supported in iframe context:', err);
      }
    }
  };

  // Helper to load user photo safely without CORS throwing exceptions
  const loadAvatarImage = (url: string): Promise<HTMLImageElement | null> => {
    return new Promise((resolve) => {
      if (!url || url === 'initials') {
        resolve(null);
        return;
      }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = url;
    });
  };

  // Resilient HD PNG Card Download Generator
  const generateCanvasFallback = async (): Promise<string> => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    const issuedDate = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(issuedDate.getFullYear() + 5);
    const formattedIssuedDate = issuedDate.toLocaleDateString('bn-BD');
    const formattedExpiryDate = expiryDate.toLocaleDateString('bn-BD');

    // Canvas Card Outer Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1000, 630);

    // Rounded Border Frame
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, 996, 626);

    // Top Header Banner Linear Gradient
    const grad = ctx.createLinearGradient(0, 0, 1000, 140);
    grad.addColorStop(0, '#047857');
    grad.addColorStop(1, '#0d9488');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1000, 140);

    // Header Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('আমার কুষ্টিয়া', 35, 55);

    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('SMART DIGITAL CITIZEN ID', 35, 92);

    // Verified Badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(780, 35, 185, 45);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('VERIFIED ✓', 820, 64);

    // Photo / Avatar Container
    const avatarImg = user.photoURL ? await loadAvatarImage(user.photoURL) : null;
    if (avatarImg) {
      ctx.drawImage(avatarImg, 40, 175, 160, 160);
    } else {
      ctx.fillStyle = '#047857';
      ctx.fillRect(40, 175, 160, 160);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 70px sans-serif';
      ctx.fillText((user.displayName || 'ন').charAt(0), 95, 280);
    }

    // Info Grid
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('FULL NAME', 230, 190);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(user.displayName || 'সম্মানিত নাগরিক', 230, 225);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('PROFESSION', 230, 265);
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(user.profession || 'নাগরিক', 230, 298);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('BLOOD GROUP', 580, 265);
    ctx.fillStyle = '#e11d48';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(user.bloodGroup || 'N/A', 580, 298);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('ID NUMBER', 230, 345);
    ctx.fillStyle = '#047857';
    ctx.font = 'bold 26px monospace';
    ctx.fillText(citizenIdCode, 230, 378);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('DATE OF BIRTH', 580, 345);
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(user.dob || '01-01-1995', 580, 378);

    // Footer Divider Line
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 470);
    ctx.lineTo(960, 470);
    ctx.stroke();

    // Footer Address
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`ঠিকানা: ${user.upazila ? user.upazila + ', ' : ''}${user.ward || 'কুষ্টিয়া সদর, কুষ্টিিয়া'}`, 40, 515);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`ইস্যু: ${formattedIssuedDate}  |  মেয়াদ: ${formattedExpiryDate}`, 40, 555);

    // Digital Signature
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText((user.displayName || 'Owner').split(' ')[0], 720, 520);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('Digital Signature', 720, 545);

    return canvas.toDataURL('image/png');
  };

  const handleDownload = async () => {
    setError(null);
    setIsDownloading(true);

    try {
      const dataUrl = await generateCanvasFallback();
      setPreviewImageData(dataUrl);

      // Trigger standard HTML download
      try {
        const downloadLink = document.createElement('a');
        const filename = `Amar-Kushtia-Citizen-ID-${(user.displayName || 'Citizen').replace(/\s+/g, '-')}.png`;
        downloadLink.href = dataUrl;
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } catch (dlErr) {
        console.warn('Automatic download link trigger restricted, preview modal active:', dlErr);
      }

      triggerToast('স্মার্ট সিটিজেন আইডি কার্ড সেভ করার জন্য প্রস্তুত!');
    } catch (err: any) {
      console.error('Card export error:', err);
      setError('কার্ড ছবি তৈরি করতে সমস্যা হয়েছে।');
    } finally {
      setIsDownloading(false);
    }
  };

  const openBlobInNewTab = (dataUrl: string) => {
    try {
      const arr = dataUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    } catch (e) {
      console.warn('Blob opening error:', e);
      window.open(dataUrl, '_blank');
    }
  };

  const getBloodColor = (group?: string) => {
    if (!group || group === 'N/A') return 'text-slate-400';
    return 'text-rose-600';
  };

  const issuedDate = new Date();
  const expiryDate = new Date();
  expiryDate.setFullYear(issuedDate.getFullYear() + 5);

  const formattedIssuedDate = issuedDate.toLocaleDateString('bn-BD');
  const formattedExpiryDate = expiryDate.toLocaleDateString('bn-BD');

  return (
    <div className="relative group max-w-[460px] sm:max-w-[540px] w-full mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 backdrop-blur-md">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Premium Outer Ambient Glow */}
      <div className={`absolute -inset-1.5 bg-gradient-to-r ${primaryGradient} rounded-[2.5rem] blur-lg opacity-15 group-hover:opacity-25 transition duration-500`}></div>
      
      {/* Smart Card Container */}
      <div 
        ref={cardRef}
        className="relative bg-white dark:bg-slate-950 rounded-[2.2rem] border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden aspect-[1.58/1] select-none"
      >
        {/* Holographic Watermark & Ambient Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.06] mix-blend-overlay bg-gradient-to-tr from-transparent via-white to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-[2500ms] ease-in-out"></div>
        
        {/* Top Header Banner Background */}
        <div className={`absolute top-0 left-0 right-0 h-[4.25rem] sm:h-[4.75rem] bg-gradient-to-br ${primaryGradient} opacity-95`}>
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:8px_8px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"></div>
        </div>

        {/* Official Seal Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04] dark:opacity-[0.06] pointer-events-none">
          <Globe className="w-52 h-52 text-slate-900 dark:text-white" />
        </div>

        {/* Card Main Body Content */}
        <div className="relative p-4 sm:p-5 h-full flex flex-col justify-between">
          {/* Top Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-inner">
                <Globe className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-black text-[11px] sm:text-xs tracking-tight leading-none uppercase">
                  {appName}
                </h2>
                <p className="text-white/85 text-[7px] sm:text-[8px] font-bold uppercase tracking-widest mt-1">
                  Smart Digital Citizen ID
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/25 backdrop-blur-md border border-white/35 shadow-sm">
              <ShieldCheck className="w-3 h-3 text-emerald-300" />
              <span className="text-[8px] sm:text-[9px] font-black text-white tracking-wide">VERIFIED</span>
            </div>
          </div>

          {/* User Details Middle Section */}
          <div className="flex gap-3.5 sm:gap-4 items-center mt-1 sm:mt-1.5">
            {/* User Photo / Avatar */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1.35rem] overflow-hidden ring-2 ring-white/90 dark:ring-slate-700 shadow-xl bg-slate-100 dark:bg-slate-800 relative group-hover:scale-[1.02] transition-transform">
                {user.photoURL && user.photoURL !== 'initials' ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName} 
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${primaryGradient} flex items-center justify-center text-white text-2xl font-black`}>
                    {(user.displayName || 'ন').charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 opacity-15 pointer-events-none border border-dashed border-white/40"></div>
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-slate-900 rounded-lg shadow-md border border-slate-100 dark:border-slate-800">
                <Sparkles className="w-3 h-3 text-amber-500" />
              </div>
            </div>

            {/* Info Fields Grid */}
            <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-1 sm:gap-y-1.5">
              <div className="col-span-2">
                <p className="text-[6px] sm:text-[7px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Full Name</p>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-tight truncate mt-0.5">
                  {user.displayName || 'সম্মানিত নাগরিক'}
                </h3>
              </div>

              <div>
                <p className="text-[6px] sm:text-[7px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Profession</p>
                <p className="text-[9.5px] sm:text-[10.5px] font-black text-slate-700 dark:text-slate-300 truncate mt-0.5">
                  {user.profession || 'নাগরিক'}
                </p>
              </div>

              <div>
                <p className="text-[6px] sm:text-[7px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Blood Group</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Droplet className={`w-2.5 h-2.5 ${getBloodColor(user.bloodGroup)}`} />
                  <span className="text-[9.5px] sm:text-[10.5px] font-black text-slate-700 dark:text-slate-300">
                    {user.bloodGroup || 'N/A'}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[6px] sm:text-[7px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">ID Number</p>
                <p className="text-[10px] sm:text-[11.5px] font-black text-emerald-700 dark:text-emerald-400 font-mono tracking-tight mt-0.5">
                  {citizenIdCode}
                </p>
              </div>

              <div>
                <p className="text-[6px] sm:text-[7px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Date of Birth</p>
                <p className="text-[9.5px] sm:text-[10.5px] font-black text-slate-700 dark:text-slate-300 mt-0.5">
                  {user.dob || '01-01-1995'}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Card Footer Section */}
          <div className="flex items-end justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60 mt-1">
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span className="text-[8.5px] sm:text-[9.5px] font-bold text-slate-600 dark:text-slate-400">
                  {user.upazila ? `${user.upazila}, ` : ''}{user.ward || 'কুষ্টিয়া সদর, কুষ্টিিয়া'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-[5px] sm:text-[6px] font-black text-slate-400 uppercase tracking-tighter">Issued</span>
                  <span className="text-[8.5px] sm:text-[9px] font-bold text-slate-600 dark:text-slate-400">{formattedIssuedDate}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[5px] sm:text-[6px] font-black text-rose-400 uppercase tracking-tighter">Expiry</span>
                  <span className="text-[8.5px] sm:text-[9px] font-bold text-rose-600 dark:text-rose-400">{formattedExpiryDate}</span>
                </div>
              </div>
            </div>

            {/* Digital Signature */}
            <div className="flex flex-col items-center mr-1">
              <span className="text-[5px] sm:text-[6px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Digital Signature</span>
              <div className="font-['Dancing_Script',cursive] text-[13px] sm:text-[14px] text-slate-800 dark:text-slate-200 -rotate-1 select-none leading-none mb-0.5">
                {(user.displayName || 'Owner').split(' ')[0]}
              </div>
              <div className="w-14 h-[0.75px] bg-slate-300 dark:bg-slate-700"></div>
            </div>

            {/* Crisp Standalone QR Code SVG */}
            <div className="relative group/qr">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white p-1 rounded-xl shadow-md border border-slate-200/80 flex items-center justify-center">
                <QRCodeSVG 
                  value={citizenIdCode}
                  size={42}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <div className="absolute -top-1 -right-1 bg-emerald-600 text-white p-0.5 rounded-md shadow-sm">
                <QrCode className="w-2.5 h-2.5" />
              </div>
            </div>
          </div>
        </div>

        {/* EMV Gold Smart Chip Graphic */}
        <div className="absolute top-[4.75rem] sm:top-[5.25rem] right-4 w-8 h-6 sm:w-9 sm:h-6.5 rounded-lg bg-gradient-to-br from-amber-200 via-amber-400 to-amber-500 opacity-40 border border-amber-600/50 shadow-inner overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(0,0,0,0.1)_25.5%,rgba(0,0,0,0.1)_26.5%,transparent_27%,transparent_50%,rgba(0,0,0,0.1)_50.5%,rgba(0,0,0,0.1)_51.5%,transparent_52%,transparent_75%,rgba(0,0,0,0.1)_75.5%,rgba(0,0,0,0.1)_76.5%,transparent_77%)]"></div>
        </div>
      </div>

      {/* Primary Action Buttons (Share & Download) */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button
          type="button"
          onClick={handleMainShareClick}
          disabled={isSharing}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black text-slate-800 dark:text-slate-100 shadow-md hover:shadow-lg transition-all active:scale-95 group/btn cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-blue-600 group-hover/btn:rotate-12 transition-transform" />
          <span>{isSharing ? 'শেয়ার হচ্ছে...' : 'শেয়ার করুন'}</span>
        </button>
        
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-700/25 transition-all active:scale-95 cursor-pointer"
        >
          <Download className={`w-4 h-4 text-white group-hover/btn:-translate-y-0.5 transition-transform ${isDownloading ? 'animate-bounce' : ''}`} />
          <span>{isDownloading ? 'ডাউনলোড হচ্ছে...' : 'ডাউনলোড করুন'}</span>
        </button>
      </div>

      {/* 1-Click Social Media Posting Bar */}
      <div className="mt-3.5 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-pink-100 dark:border-slate-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-[11px] font-black text-slate-700 dark:text-slate-300">
          <span className="flex items-center gap-1.5">
            <Sparkle className="w-3.5 h-3.5 text-pink-600 fill-pink-600" />
            <span>১-ক্লিকে সোশ্যাল পোস্ট ও শেয়ার</span>
          </span>
          <span className="text-[10px] text-pink-600 font-bold">লিঙ্ক সহ</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Facebook */}
          <button
            type="button"
            onClick={handleFacebookShare}
            className="flex flex-col items-center justify-center py-2 px-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 transition-all active:scale-95 cursor-pointer group"
            title="ফেসবুকে এক ক্লিকে পোস্ট করুন"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center mb-1 shadow-xs group-hover:scale-105 transition-transform">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <span className="text-[10px] font-black">ফেসবুক</span>
          </button>

          {/* TikTok */}
          <button
            type="button"
            onClick={handleTikTokShare}
            className="flex flex-col items-center justify-center py-2 px-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 transition-all active:scale-95 cursor-pointer group"
            title="টিকটকে এক ক্লিকে শেয়ার ও লিঙ্ক পোস্ট করুন"
          >
            <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center mb-1 shadow-xs group-hover:scale-105 transition-transform">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.41c-.01 2.22-.84 4.38-2.38 5.98-1.55 1.6-3.76 2.53-6.02 2.53-2.27 0-4.48-.93-6.03-2.53-1.54-1.6-2.37-3.76-2.38-5.98 0-2.23.84-4.39 2.38-5.99 1.55-1.6 3.76-2.53 6.03-2.53.53 0 1.05.05 1.57.17v4.13c-.5-.16-1.03-.25-1.57-.24-1.12 0-2.22.46-2.99 1.25-.78.8-1.2 1.9-1.2 3.03s.42 2.23 1.2 3.03c.77.79 1.87 1.25 2.99 1.25 1.13 0 2.23-.46 3-1.25.78-.8 1.2-1.9 1.2-3.03V.02z"/>
              </svg>
            </div>
            <span className="text-[10px] font-black">টিকটক</span>
          </button>

          {/* WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="flex flex-col items-center justify-center py-2 px-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 transition-all active:scale-95 cursor-pointer group"
            title="হোয়াটসঅ্যাপে সরাসরি পাঠান"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-1 shadow-xs group-hover:scale-105 transition-transform">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </div>
            <span className="text-[10px] font-black">হোয়াটসঅ্যাপ</span>
          </button>

          {/* Copy Link & Details */}
          <button
            type="button"
            onClick={() => copyToClipboard(postCaption)}
            className="flex flex-col items-center justify-center py-2 px-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/40 hover:bg-pink-100 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800/60 transition-all active:scale-95 cursor-pointer group"
            title="লিঙ্ক ও পুরো বার্তা কপি করুন"
          >
            <div className="w-7 h-7 rounded-full bg-pink-600 text-white flex items-center justify-center mb-1 shadow-xs group-hover:scale-105 transition-transform">
              {showCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </div>
            <span className="text-[10px] font-black">{showCopied ? 'কপি হয়েছে' : 'কপি লিঙ্ক'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-3 p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center justify-center gap-1.5 text-rose-600 text-xs font-bold animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Full Social Share & Posting Modal */}
      {isSocialModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-pink-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-pink-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-600">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">নাগরিক আইডি শেয়ার করুন</h3>
                  <p className="text-[10px] text-slate-500">ফেসবুক, টিকটক ও অন্যান্য মাধ্যমে এক ক্লিকে পোস্ট</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSocialModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pre-formatted Caption Box */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-pink-100 dark:border-slate-700 space-y-1.5">
              <span className="text-[10px] font-black text-slate-500 block uppercase">পোস্টের বার্তা / ক্যাপশন</span>
              <p className="text-xs text-slate-700 dark:text-slate-200 whitespace-pre-line font-medium line-clamp-4 select-all">
                {postCaption}
              </p>
              <button
                type="button"
                onClick={() => copyToClipboard(postCaption)}
                className="w-full mt-1 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors"
              >
                {showCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{showCopied ? 'ক্যাপশন কপি হয়েছে!' : 'পুরো ক্যাপশন ও লিঙ্ক কপি করুন'}</span>
              </button>
            </div>

            {/* Direct Social Share Buttons List */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleFacebookShare}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-between shadow-md shadow-blue-600/20 active:scale-98 transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>ফেসবুকে এক ক্লিকে পোস্ট করুন</span>
                </span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </button>

              <button
                type="button"
                onClick={handleTikTokShare}
                className="w-full py-2.5 px-4 bg-black hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-between shadow-md active:scale-98 transition-all border border-slate-700 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.41c-.01 2.22-.84 4.38-2.38 5.98-1.55 1.6-3.76 2.53-6.02 2.53-2.27 0-4.48-.93-6.03-2.53-1.54-1.6-2.37-3.76-2.38-5.98 0-2.23.84-4.39 2.38-5.99 1.55-1.6 3.76-2.53 6.03-2.53.53 0 1.05.05 1.57.17v4.13c-.5-.16-1.03-.25-1.57-.24-1.12 0-2.22.46-2.99 1.25-.78.8-1.2 1.9-1.2 3.03s.42 2.23 1.2 3.03c.77.79 1.87 1.25 2.99 1.25 1.13 0 2.23-.46 3-1.25.78-.8 1.2-1.9 1.2-3.03V.02z"/>
                  </svg>
                  <span>টিকটকে শেয়ার করুন (ক্যাপশন সহ)</span>
                </span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </button>

              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-between shadow-md shadow-emerald-600/20 active:scale-98 transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>হোয়াটসঅ্যাপে পাঠান</span>
                </span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generated HD Card Download / Preview Modal */}
      {previewImageData && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-emerald-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">কার্ড ছবি প্রস্তুত হয়েছে</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewImageData(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Generated Image Preview */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
              <img src={previewImageData} alt="Citizen Card" className="w-full h-auto object-contain select-all" />
            </div>

            <p className="text-[11px] text-center text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              💡 গ্যালারিতে সরাসরি সেভ করতে উপরের ছবিটিতে <strong className="text-emerald-700 dark:text-emerald-400 font-bold">চাপ দিয়ে ধরে রাখুন (Long Press)</strong> এবং "Download image" এ চাপ দিন অথবা নিচের বাটনে চাপ দিন।
            </p>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => openBlobInNewTab(previewImageData)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>নতুন ট্যাবে পুরো HD কার্ড ছবি খুলুন</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewImageData(null)}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
