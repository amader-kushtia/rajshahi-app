import React from 'react';
import { Home, Grid, Phone, Tag, User } from 'lucide-react';
import { CategoryType } from '../types';

interface BottomNavigationProps {
  currentCategory: CategoryType;
  onNavigate: (category: CategoryType) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentCategory,
  onNavigate,
}) => {
  const isHomeActive = currentCategory === 'home';
  
  const isServicesActive = 
    currentCategory === 'services' || 
    currentCategory === 'categories' || 
    [
      'house-rent',
      'buy-sell',
      'doctor',
      'blood',
      'blood-request',
      'transport',
      'crime-reporter',
      'food',
      'jobs',
      'lost-found',
      'legal',
      'events',
      'volunteers',
      'citizen-fund',
      'mason',
      'mobile-maker',
      'electrician',
      'plumber',
      'ac-mechanic',
      'driver',
      'tutor',
      'vet'
    ].includes(currentCategory);

  const isEmergencyActive = currentCategory === 'emergency';
  const isOffersActive = currentCategory === 'sponsored-details';
  const isProfileActive = 
    currentCategory === 'profile' || 
    currentCategory === 'developer' || 
    currentCategory === 'notification-settings' || 
    currentCategory === 'saved-posts' || 
    currentCategory === 'help-support' || 
    currentCategory === 'terms-privacy' ||
    currentCategory === 'login' ||
    currentCategory === 'register';

  const navItems = [
    {
      id: 'home' as CategoryType,
      label: 'হোম',
      icon: Home,
      isActive: isHomeActive,
    },
    {
      id: 'services' as CategoryType,
      label: 'সার্ভিস',
      icon: Grid,
      isActive: isServicesActive && !isHomeActive,
    },
    {
      id: 'emergency' as CategoryType,
      label: 'জরুরি সেবা',
      icon: Phone,
      isActive: isEmergencyActive,
    },
    {
      id: 'sponsored-details' as CategoryType,
      label: 'অফার',
      icon: Tag,
      isActive: isOffersActive,
    },
    {
      id: 'profile' as CategoryType,
      label: 'প্রোফাইল',
      icon: User,
      isActive: isProfileActive && !isHomeActive && !isServicesActive && !isEmergencyActive && !isOffersActive,
    },
  ];

  return (
    <nav 
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] w-full overflow-x-hidden"
    >
      <div className="w-full max-w-2xl mx-auto px-2 sm:px-4 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all duration-200 cursor-pointer active:scale-90 ${
                active
                  ? 'text-emerald-700 scale-105'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title={item.label}
            >
              <div 
                className={`p-1.5 rounded-xl transition-all duration-200 ${
                  active 
                    ? 'bg-emerald-50 border border-emerald-200/70 shadow-xs' 
                    : 'hover:bg-slate-100'
                }`}
              >
                <Icon 
                  className={`w-5 h-5 transition-transform ${
                    active 
                      ? 'stroke-[2.5] text-emerald-600 drop-shadow-[0_2px_4px_rgba(16,185,129,0.25)]' 
                      : 'stroke-[1.8] text-slate-500'
                  }`} 
                />
              </div>
              <span 
                className={`text-[10px] sm:text-[11px] font-black tracking-tight mt-0.5 ${
                  active ? 'text-emerald-800 font-extrabold drop-shadow-xs' : 'text-slate-600'
                }`}
              >
                {item.label}
              </span>
              {active && (
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full shadow-[0_0_6px_#10b981] mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
