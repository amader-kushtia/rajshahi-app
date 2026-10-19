import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getActiveSponsoredCampaign } from '../services/sponsoredService';
import { SponsoredItem } from '../data/sponsoredData';

interface BannerAdsProps {
  onOpenDetails?: () => void;
}

export const BannerAds: React.FC<BannerAdsProps> = ({ onOpenDetails }) => {
  const [item, setItem] = useState<SponsoredItem>(() => getActiveSponsoredCampaign());

  useEffect(() => {
    const handleUpdate = () => {
      setItem(getActiveSponsoredCampaign());
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('sponsored-campaigns-updated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('sponsored-campaigns-updated', handleUpdate);
    };
  }, []);

  if (!item) return null;

  return (
    <div 
      onClick={onOpenDetails}
      className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 rounded-3xl p-4 text-white shadow-xs relative overflow-hidden group mb-4 border border-emerald-600/30 cursor-pointer transition-all hover:shadow-md"
    >
      <div className="absolute -right-4 -top-8 w-28 h-28 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all pointer-events-none"></div>
      
      <div className="flex items-center justify-between gap-3 relative z-10">
        <div className="flex-1 min-w-0 overflow-hidden">
          {/* Top badges */}
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <span className="bg-amber-400 text-amber-950 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-xs">
              Sponsored
            </span>
            <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{item.discountBadge}</span>
            </span>
          </div>

          {/* Continuous Running / Marquee Headline */}
          <div className="relative overflow-hidden w-full mb-1 py-0.5 select-none">
            <div className="animate-marquee">
              <span className="text-sm font-black text-white group-hover:text-amber-200 transition-colors pr-8">
                {item.businessName} • {item.tagline}
              </span>
              <span className="text-sm font-black text-white group-hover:text-amber-200 transition-colors pr-8" aria-hidden="true">
                {item.businessName} • {item.tagline}
              </span>
            </div>
          </div>

          {/* Subtitle / Description: Multi-line display so full text is completely readable */}
          <p className="text-xs text-emerald-100 leading-snug line-clamp-2 mt-0.5 mb-2.5">
            {item.shortDescription}
          </p>

          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails?.();
            }}
            className="text-xs font-bold text-emerald-950 bg-white px-3.5 py-1.5 rounded-xl hover:bg-amber-300 transition-all flex items-center gap-1.5 shadow-xs w-max group-hover:bg-amber-300"
          >
            <span>বিস্তারিত দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Thumbnail preview on the right */}
        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-white/20 shadow-xs relative">
          <img
            src={item.images[0].url}
            alt={item.businessName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
