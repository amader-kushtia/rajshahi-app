import React from 'react';
import { ArrowLeft, MapPin, Phone, MessageCircle, UtensilsCrossed, Info, Facebook } from 'lucide-react';
import { PostItem } from '../types';

interface RestaurantMenuDetailProps {
  restaurant: PostItem;
  onBack: () => void;
}

export const RestaurantMenuDetail: React.FC<RestaurantMenuDetailProps> = ({ restaurant, onBack }) => {
  const menuItems = restaurant.details?.menuItems || [];

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Top Bar */}
      <div className="bg-white rounded-2xl p-4 border border-pink-200/80/80 shadow-xs flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 transition-colors"
          title="ফিরে যান"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-black text-slate-900 line-clamp-1">{restaurant.title}</h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
            <MapPin className="w-3 h-3 text-amber-600" />
            <span className="truncate">{restaurant.location}</span>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      {restaurant.imageUrl && (
        <div className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden relative shadow-sm border border-pink-200/80">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="inline-block px-2.5 py-1 bg-amber-500 text-amber-950 text-[10px] font-black rounded-lg mb-2 shadow-sm">
              {restaurant.subcategory || 'খাবার'}
            </span>
            <p className="text-sm font-medium text-slate-100 line-clamp-2 leading-snug drop-shadow-md">
              {restaurant.description}
            </p>
          </div>
        </div>
      )}

      {/* Menu Section */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-pink-200/80/80 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
            <UtensilsCrossed className="w-4 h-4 text-amber-700" />
          </div>
          <h3 className="text-base font-black text-slate-900">মেনু ও দাম</h3>
        </div>

        {menuItems.length > 0 ? (
          <div className="space-y-3">
            {menuItems.map((item, index) => (
              <div 
                key={index} 
                className="group flex justify-between gap-4 p-3.5 rounded-xl border border-pink-100 bg-slate-50/50 hover:bg-amber-50/50 hover:border-amber-200 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-amber-800 transition-colors">
                    {item.name}
                  </h4>
                  {item.ingredients && (
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {item.ingredients}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0 flex flex-col items-end justify-center">
                  <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                    {item.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-pink-100 border-dashed">
            <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-600">বিস্তারিত মেনু যুক্ত করা হয়নি</p>
            <p className="text-xs text-slate-400 mt-1">দয়া করে কল করে খাবারের দাম জেনে নিন।</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-2xl p-4 border border-pink-200/80/80 shadow-xs flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {restaurant.whatsapp && (
            <a
              href={`https://wa.me/88${restaurant.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমি আমার কুষ্টিয়াতে "${restaurant.title}" এর মেনু দেখে অর্ডার করতে চাচ্ছি।`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] rounded-xl transition-colors font-bold text-sm border border-[#25D366]/20"
            >
              <MessageCircle className="w-5 h-5" />
              <span>হোয়াটসঅ্যাপে অর্ডার</span>
            </a>
          )}
          {restaurant.facebook && (
            <a
              href={restaurant.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] rounded-xl transition-colors font-bold text-sm border border-[#1877F2]/20"
            >
              <Facebook className="w-5 h-5" />
              <span>ফেসবুকে যোগাযোগ</span>
            </a>
          )}
        </div>
        <a
          href={`tel:${restaurant.contactPhone}`}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors"
        >
          <Phone className="w-5 h-5" />
          <span>কল করে অর্ডার দিন</span>
        </a>
      </div>
    </div>
  );
};
