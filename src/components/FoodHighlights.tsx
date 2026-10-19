import React from 'react';
import { UtensilsCrossed, ArrowRight, Star, MapPin } from 'lucide-react';
import { CategoryType, PostItem } from '../types';

interface FoodHighlightsProps {
  foodItems: PostItem[];
  onNavigate: (cat: CategoryType) => void;
}

export const FoodHighlights: React.FC<FoodHighlightsProps> = ({ foodItems, onNavigate }) => {
  if (foodItems.length === 0) return null;

  // Take top 3 food items to display in the highlights
  const topFoods = foodItems.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl p-4 border border-amber-200/60 shadow-xs relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 rounded-full bg-amber-50 blur-2xl pointer-events-none" />
      
      <div className="relative z-10 flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
            <UtensilsCrossed className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">
              রেস্টুরেন্ট ও খাবার
            </h3>
            <p className="text-[10px] font-medium text-slate-500">কুষ্টিয়ায়র স্পেশাল স্বাদ</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('food')}
          className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-0.5 bg-amber-50 px-2.5 py-1.5 rounded-lg transition-colors"
        >
          <span>সব দেখুন</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-1 px-1">
        {topFoods.map(item => (
          <div 
            key={item.id}
            onClick={() => onNavigate('food')}
            className="w-48 shrink-0 bg-slate-50 rounded-xl border border-pink-100 hover:border-amber-200 overflow-hidden cursor-pointer group transition-all"
          >
            {item.imageUrl && (
              <div className="h-24 w-full overflow-hidden relative">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-1.5 left-2 right-2 flex justify-between items-center">
                  <span className="text-[9px] font-bold text-white bg-amber-600/90 px-1.5 py-0.5 rounded">
                    {item.subcategory || 'খাবার'}
                  </span>
                  {item.price && (
                    <span className="text-[10px] font-bold text-white shadow-sm">
                      {item.price}
                    </span>
                  )}
                </div>
              </div>
            )}
            <div className="p-2.5">
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-amber-700 line-clamp-1 mb-1">
                {item.title}
              </h4>
              <div className="flex items-center gap-1 text-[10px] text-slate-500 truncate">
                <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                <span className="truncate">{item.location}</span>
              </div>
            </div>
          </div>
        ))}
        
        {/* View All Card */}
        <div 
          onClick={() => onNavigate('food')}
          className="w-24 shrink-0 bg-amber-50/50 rounded-xl border border-amber-100 flex flex-col items-center justify-center cursor-pointer group hover:bg-amber-100/50 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-110 transition-transform">
            <ArrowRight className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-[10px] font-bold text-amber-800 text-center leading-tight">আরও<br/>দেখুন</span>
        </div>
      </div>
    </div>
  );
};
