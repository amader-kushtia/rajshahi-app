import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Share2, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Tag, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck,
  ShoppingBag,
  Info,
  Maximize2,
  X
} from 'lucide-react';
import { CURRENT_SPONSORED_CAMPAIGN } from '../data/sponsoredData';
import { getActiveSponsoredCampaign } from '../services/sponsoredService';

interface SponsoredDetailsPageProps {
  onBack: () => void;
}

export const SponsoredDetailsPage: React.FC<SponsoredDetailsPageProps> = ({ onBack }) => {
  const [item, setItem] = useState(() => getActiveSponsoredCampaign() || CURRENT_SPONSORED_CAMPAIGN);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [sharedSuccess, setSharedSuccess] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setItem(getActiveSponsoredCampaign() || CURRENT_SPONSORED_CAMPAIGN);
    };
    window.addEventListener('sponsored-campaigns-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('sponsored-campaigns-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleCopyCoupon = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(item.couponCode);
      setCopiedCoupon(true);
      setTimeout(() => setCopiedCoupon(false), 2500);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: item.businessName,
      text: `${item.businessName} - ${item.tagline}। কুষ্টিয়া জেলা অ্যাপে স্পনসরড অফারটি দেখুন!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setSharedSuccess(true);
        setTimeout(() => setSharedSuccess(false), 3000);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopyCoupon();
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200 pb-8">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-4 border border-pink-200/80/80 shadow-xs flex items-center gap-2.5">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 transition-colors"
          title="ফিরে যান"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="bg-amber-400 text-amber-950 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
              SPONSORED
            </span>
            <h2 className="text-sm sm:text-base font-black text-slate-900 truncate">
              {item.businessName}
            </h2>
          </div>
          <p className="text-xs text-slate-500 truncate">অফিসিয়াল স্পনসরড প্রমোশন ও ব্যবসায়িক অফার</p>
        </div>
      </div>

      {sharedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>অফারটি সফলভাবে শেয়ার করা হয়েছে!</span>
        </div>
      )}

      {/* Hero Image & Gallery Section */}
      <div className="bg-white rounded-3xl p-4 border border-pink-200/80/80 shadow-xs space-y-3">
        {/* Main Big Photo */}
        <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100 group">
          <img
            src={item.images[selectedImageIndex].url}
            alt={item.images[selectedImageIndex].caption}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
            onClick={() => setIsLightboxOpen(true)}
            referrerPolicy="no-referrer"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="bg-emerald-800/90 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>{item.badge}</span>
            </span>
            <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-lg shadow-xs">
              {item.discountBadge}
            </span>
          </div>

          <button
            onClick={() => setIsLightboxOpen(true)}
            className="absolute bottom-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-xl backdrop-blur-xs text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="text-[10px]">বড় করে দেখুন</span>
          </button>
        </div>

        {/* Caption */}
        <p className="text-xs text-slate-600 font-medium px-1 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>{item.images[selectedImageIndex].caption}</span>
        </p>

        {/* Thumbnails list */}
        <div>
          <span className="text-[11px] font-bold text-slate-500 block mb-2 px-1">
            আরও ছবি দেখুন ({item.images.length}টি ফটো):
          </span>
          <div className="grid grid-cols-5 gap-2">
            {item.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                  selectedImageIndex === idx 
                    ? 'border-emerald-600 ring-2 ring-emerald-600/30 scale-95' 
                    : 'border-pink-200/80 hover:border-pink-300 opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.caption}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-3xl w-full">
            <img
              src={item.images[selectedImageIndex].url}
              alt={item.images[selectedImageIndex].caption}
              className="w-full max-h-[75vh] object-contain rounded-2xl"
              referrerPolicy="no-referrer"
            />
            <p className="text-white text-sm text-center mt-3 font-semibold">
              {item.images[selectedImageIndex].caption}
            </p>
          </div>
        </div>
      )}

      {/* Special Offer Voucher Banner */}
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-3xl p-5 shadow-xs relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase bg-amber-400 text-amber-950 px-2 py-0.5 rounded-md inline-block mb-1.5">
              স্পেশাল কুপন অফার
            </span>
            <h3 className="text-base font-black text-white">{item.tagline}</h3>
            <p className="text-xs text-emerald-200 mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{item.validTill}</span>
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 flex items-center justify-between sm:justify-start gap-3 shrink-0">
            <div>
              <span className="text-[9px] text-emerald-200 block uppercase font-bold">ভাউচার কোড</span>
              <span className="text-sm font-black tracking-widest text-amber-300">{item.couponCode}</span>
            </div>
            <button
              onClick={handleCopyCoupon}
              className="px-3 py-1.5 bg-white text-emerald-900 rounded-xl text-xs font-bold hover:bg-emerald-50 transition flex items-center gap-1 shadow-xs"
            >
              {copiedCoupon ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>কপি হয়েছে</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>কোড কপি</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Business Details & Description */}
      <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-700" />
          <span>প্রতিষ্ঠান ও অফার সম্পর্কিত বিস্তারিত</span>
        </h3>
        <p className="text-xs text-slate-700 leading-relaxed">
          {item.fullDescription}
        </p>

        {/* Facilities Grid */}
        <div className="pt-2">
          <h4 className="text-xs font-bold text-slate-800 mb-2.5">
            শোরুমের বিশেষ সুবিধাসমূহ:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {item.facilities.map((fac, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-pink-100 text-xs text-slate-700"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{fac}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Deals / Products Cards */}
      <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-700" />
            <span>জনপ্রিয় আইটেম ও ধামাকা অফার সমূহ</span>
          </h3>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
            স্পেশাল প্রাইস
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {item.deals.map((deal) => (
            <div
              key={deal.id}
              className="p-3 rounded-2xl bg-slate-50 border border-pink-100 hover:border-pink-300 transition-all flex items-center gap-3 group"
            >
              <img
                src={deal.image}
                alt={deal.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-pink-200/80"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-black px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded-md inline-block mb-1">
                  {deal.tag}
                </span>
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {deal.title}
                </h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xs font-black text-emerald-700">
                    {deal.offerPrice}
                  </span>
                  <span className="text-[10px] text-slate-400 line-through">
                    {deal.originalPrice}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location, Opening Hours & Direct Contact */}
      <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs space-y-3.5">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-700" />
          <span>ঠিকানা ও সরাসরি যোগাযোগের মাধ্যম</span>
        </h3>

        <div className="space-y-2 text-xs text-slate-700">
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-pink-100">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-slate-900">শোরুমের অবস্থান</span>
              <span>{item.location}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-pink-100">
            <Clock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-slate-900">খোলার সময়সূচী</span>
              <span>{item.openingHours}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <a
            href={`https://wa.me/${item.whatsapp}?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমি আমার কুষ্টিয়া অ্যাপে "${item.businessName}"-এর স্পনসরড অফারটি দেখে যোগাযোগ করছি।`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>হোয়াটসঅ্যাপে ইনকোয়ারি করুন</span>
          </a>

          <a
            href={`tel:${item.phone}`}
            className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>সরাসরি কল দিন ({item.phone})</span>
          </a>
        </div>

        <button
          onClick={handleShare}
          className="w-full py-2.5 px-4 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-pink-200/80/80"
        >
          <Share2 className="w-4 h-4 text-emerald-700" />
          <span>অফারটি বন্ধুদের সাথে শেয়ার করুন</span>
        </button>
      </div>

      {/* Advertise Here Banner for Other Business Owners in Rajshahi */}
      <div className="p-4 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-center sm:text-left">
          <span className="text-[9px] uppercase tracking-wider font-bold text-amber-400 block mb-0.5">
            আপনার ব্যবসার প্রসার বাড়ান
          </span>
          <h4 className="text-xs sm:text-sm font-bold">আমার কুষ্টিয়াতে বিজ্ঞাপন দিতে চান?</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            হাজারো কুষ্টিয়াবাসীর কাছে আপনার প্রতিষ্ঠান বা সেবার বিজ্ঞাপন দিতে সরাসরি এডমিন ডেস্কে যোগাযোগ করুন।
          </p>
        </div>

        <a
          href={`https://wa.me/8801700000000?text=${encodeURIComponent('আসসালামু আলাইকুম এডমিন, আমি আমার কুষ্টিয়া অ্যাপে স্পনসরড বিজ্ঞাপন দিতে আগ্রহী। বিস্তারিত জানতে চাই।')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black shrink-0 transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>বিজ্ঞাপন দিন (WhatsApp)</span>
        </a>
      </div>
    </div>
  );
};
