import React from 'react';

import {
  Monument3DIcon,
  Restaurant3DIcon,
  Shopping3DIcon,
  Jobs3DIcon,
  Transport3DIcon,
  Hospital3DIcon,
  Doctor3DIcon,
  Emergency3DIcon,
  House3DIcon,
  News3DIcon,
  Event3DIcon,
  Services3DIcon
} from './ThreeDIcons';

export {
  Monument3DIcon,
  Restaurant3DIcon,
  Shopping3DIcon,
  Jobs3DIcon,
  Transport3DIcon,
  Hospital3DIcon,
  Doctor3DIcon,
  Emergency3DIcon,
  House3DIcon,
  News3DIcon,
  Event3DIcon,
  Services3DIcon
};

// ==========================================
// 1. পুলিশ ও থানা: 3D Royal Blue Shield & Golden Star
// ==========================================
export const Police3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="polShieldGrad" cx="35%" cy="25%" r="75%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="45%" stopColor="#2563EB" />
        <stop offset="100%" stopColor="#1E3A8A" />
      </radialGradient>
      <linearGradient id="polGoldGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <filter id="polDrop" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#1E3A8A" floodOpacity="0.45" />
      </filter>
    </defs>
    {/* Outer Golden Rim */}
    <path
      d="M32 6 L52 14 C52 34 44 48 32 58 C20 48 12 34 12 14 L32 6 Z"
      fill="url(#polGoldGrad)"
      filter="url(#polDrop)"
    />
    {/* Inner Blue Shield */}
    <path
      d="M32 9 L49 16 C49 33 42 45 32 54 C22 45 15 33 15 16 L32 9 Z"
      fill="url(#polShieldGrad)"
    />
    {/* 3D Specular Highlight */}
    <path
      d="M32 10 L46 17 C45 28 41 38 32 46 C32 30 32 18 32 10 Z"
      fill="#FFFFFF"
      opacity="0.25"
    />
    {/* Golden Police Star Badge */}
    <polygon
      points="32,20 35,27 43,28 37,33 39,41 32,37 25,41 27,33 21,28 29,27"
      fill="url(#polGoldGrad)"
    />
    {/* Star Center Gem */}
    <circle cx="32" cy="32" r="3" fill="#FFFFFF" opacity="0.9" />
  </svg>
);

// ==========================================
// 2. ফায়ার সার্ভিস: 3D Fiery Blaze & Rescue Shield
// ==========================================
export const FireService3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="fireOuter" cx="45%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#F87171" />
        <stop offset="40%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#991B1B" />
      </radialGradient>
      <radialGradient id="fireInner" cx="45%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="60%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#EA580C" />
      </radialGradient>
      <filter id="fireGlow">
        <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#DC2626" floodOpacity="0.5" />
      </filter>
    </defs>
    {/* Red/Yellow Base Glow */}
    <circle cx="32" cy="52" r="14" fill="#F97316" opacity="0.3" filter="blur(4px)" />
    {/* Outer Big Flame */}
    <path
      d="M32 6 C32 16 46 22 46 38 C46 48 38 56 32 58 C26 56 18 48 18 38 C18 24 30 18 32 6 Z"
      fill="url(#fireOuter)"
      filter="url(#fireGlow)"
    />
    {/* Mid Vibrant Orange Flame */}
    <path
      d="M32 18 C32 26 42 32 42 42 C42 50 36 55 32 56 C28 55 22 50 22 42 C22 30 30 24 32 18 Z"
      fill="url(#fireInner)"
    />
    {/* Inner White-Hot Core */}
    <path
      d="M32 30 C32 36 38 40 38 46 C38 51 34 54 32 54 C30 54 26 51 26 46 C26 40 30 36 32 30 Z"
      fill="#FFFFFF"
      opacity="0.95"
    />
    {/* Cross Water Axes in White */}
    <circle cx="32" cy="45" r="3" fill="#FEE2E2" />
  </svg>
);

// ==========================================
// 3. ব্যাংক ও এটিএম: 3D Emerald Bank Building with Gold Coin
// ==========================================
export const Bank3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="bnkWall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="60%" stopColor="#059669" />
        <stop offset="100%" stopColor="#065F46" />
      </linearGradient>
      <linearGradient id="bnkGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <filter id="bnkDrop">
        <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#065F46" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Roof Pediment / Triangle */}
    <path d="M10 22 L32 8 L54 22 H10 Z" fill="url(#bnkWall)" filter="url(#bnkDrop)" />
    <path d="M14 21 L32 10 L50 21 H14 Z" fill="#6EE7B7" opacity="0.6" />
    {/* Pediment Gold Star */}
    <circle cx="32" cy="16" r="3" fill="url(#bnkGold)" />
    {/* Architrave */}
    <rect x="8" y="22" width="48" height="4" rx="1" fill="#047857" />
    {/* 4 Classical Pillars */}
    <rect x="12" y="26" width="6" height="22" rx="1" fill="#E6FFFA" />
    <rect x="23" y="26" width="6" height="22" rx="1" fill="#E6FFFA" />
    <rect x="35" y="26" width="6" height="22" rx="1" fill="#E6FFFA" />
    <rect x="46" y="26" width="6" height="22" rx="1" fill="#E6FFFA" />
    {/* Base Plinth Steps */}
    <rect x="6" y="48" width="52" height="4" rx="1" fill="#047857" />
    <rect x="4" y="52" width="56" height="5" rx="1" fill="#065F46" filter="url(#bnkDrop)" />
    {/* Foreground Floating 3D Gold Coin */}
    <circle cx="48" cy="42" r="10" fill="url(#bnkGold)" filter="url(#bnkDrop)" />
    <circle cx="48" cy="42" r="8" fill="#FBBF24" />
    <text x="45" y="46" fontFamily="sans-serif" fontSize="11" fontWeight="bold" fill="#78350F">৳</text>
  </svg>
);

// ==========================================
// 4. মোবাইল ব্যাংকিং: 3D Smartphone with Gold Coins
// ==========================================
export const MobileBanking3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="phoneBody" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F43F5E" />
        <stop offset="50%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#9F1239" />
      </linearGradient>
      <linearGradient id="coinGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <filter id="mfsDrop">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#9F1239" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Angled Phone */}
    <rect x="14" y="8" width="30" height="48" rx="6" fill="url(#phoneBody)" filter="url(#mfsDrop)" />
    {/* Screen */}
    <rect x="17" y="14" width="24" height="36" rx="3" fill="#FFFFFF" />
    {/* Screen Top App Bar */}
    <rect x="17" y="14" width="24" height="8" rx="2" fill="#BE123C" />
    {/* Transfer Arrow Icon on Screen */}
    <path d="M25 28 L33 28 M30 25 L33 28 L30 31" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M33 36 L25 36 M28 33 L25 36 L28 39" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />
    {/* Flying Gold Coin Front */}
    <circle cx="44" cy="22" r="9" fill="url(#coinGrad)" filter="url(#mfsDrop)" />
    <circle cx="44" cy="22" r="7" fill="#FBBF24" />
    <text x="41" y="26" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#78350F">৳</text>
    {/* Small Coin Behind */}
    <circle cx="48" cy="38" r="6" fill="url(#coinGrad)" filter="url(#mfsDrop)" />
  </svg>
);

// ==========================================
// 5. কুরিয়ার ও পার্সেল: 3D Express Delivery Box
// ==========================================
export const Courier3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="boxTop" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="boxLeft" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="boxRight" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#B45309" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
      <filter id="boxDrop">
        <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#78350F" floodOpacity="0.45" />
      </filter>
    </defs>
    {/* Speed Lines */}
    <line x1="4" y1="28" x2="14" y2="28" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
    <line x1="6" y1="36" x2="12" y2="36" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
    {/* 3D Isometric Box */}
    <g filter="url(#boxDrop)">
      {/* Top Diamond */}
      <polygon points="32,10 52,21 32,32 12,21" fill="url(#boxTop)" />
      {/* Left Face */}
      <polygon points="12,21 32,32 32,54 12,43" fill="url(#boxLeft)" />
      {/* Right Face */}
      <polygon points="32,32 52,21 52,43 32,54" fill="url(#boxRight)" />
      {/* Packing Tape */}
      <polygon points="32,10 37,13 27,29 22,26" fill="#FDE68A" opacity="0.8" />
      {/* Fragile / Arrow Stamp on Box */}
      <rect x="36" y="30" width="8" height="6" rx="1" fill="#FFFFFF" opacity="0.9" />
      <polygon points="40,32 42,34 38,34" fill="#DC2626" />
    </g>
  </svg>
);

// ==========================================
// 6. কম্পিউটার ও প্রিন্ট: 3D Color Laser Printer
// ==========================================
export const ComputerPrint3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="printBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#4338CA" />
      </linearGradient>
      <filter id="printDrop">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#312E81" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Top Paper Feeding */}
    <rect x="20" y="8" width="24" height="16" rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
    <line x1="24" y1="14" x2="36" y2="14" stroke="#94A3B8" strokeWidth="1.5" />
    <line x1="24" y1="18" x2="40" y2="18" stroke="#94A3B8" strokeWidth="1.5" />
    {/* Main Printer Body */}
    <rect x="10" y="20" width="44" height="24" rx="5" fill="url(#printBody)" filter="url(#printDrop)" />
    {/* Glowing Status Screen */}
    <rect x="15" y="25" width="8" height="6" rx="1" fill="#22D3EE" />
    <circle cx="27" cy="28" r="2" fill="#34D399" />
    {/* Paper Output Slot */}
    <rect x="16" y="34" width="32" height="4" rx="1" fill="#1E1B4B" />
    {/* Printed Sheet Outputting with CMYK Color Bars */}
    <g filter="url(#printDrop)">
      <rect x="18" y="36" width="28" height="18" rx="2" fill="#FFFFFF" />
      {/* Photo Placeholder */}
      <rect x="21" y="40" width="10" height="10" rx="1" fill="#818CF8" />
      {/* CMYK dots */}
      <circle cx="35" cy="42" r="1.5" fill="#06B6D4" />
      <circle cx="39" cy="42" r="1.5" fill="#EC4899" />
      <circle cx="35" cy="46" r="1.5" fill="#FACC15" />
      <circle cx="39" cy="46" r="1.5" fill="#0F172A" />
    </g>
  </svg>
);

// ==========================================
// 7. ফ্রিল্যান্সিং: 3D High-Tech Laptop with Code & Rocket
// ==========================================
export const Freelancing3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="laptopLid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#6D28D9" />
      </linearGradient>
      <linearGradient id="laptopBase" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#94A3B8" />
      </linearGradient>
      <filter id="lapDrop">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#5B21B6" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Screen Display Bezel */}
    <rect x="12" y="12" width="40" height="28" rx="4" fill="url(#laptopLid)" filter="url(#lapDrop)" />
    {/* Screen Glass */}
    <rect x="15" y="15" width="34" height="22" rx="2" fill="#0F172A" />
    {/* Code Brackets on Screen */}
    <text x="18" y="27" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#38BDF8">&lt;/&gt;</text>
    <rect x="18" y="31" width="16" height="2" rx="1" fill="#34D399" />
    <rect x="26" y="23" width="18" height="2" rx="1" fill="#F472B6" />
    {/* Laptop Base Plate */}
    <path d="M6 40 L58 40 L54 48 L10 48 Z" fill="url(#laptopBase)" filter="url(#lapDrop)" />
    {/* Trackpad */}
    <rect x="27" y="42" width="10" height="4" rx="1" fill="#CBD5E1" />
  </svg>
);

// ==========================================
// 8. রক্তদাতা ফোরাম: 3D Glossy Ruby Blood Drop with Cross
// ==========================================
export const Blood3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="rubyDrop" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FDA4AF" />
        <stop offset="35%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#881337" />
      </radialGradient>
      <filter id="bloodGlow">
        <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#E11D48" floodOpacity="0.5" />
      </filter>
    </defs>
    {/* 3D Liquid Drop */}
    <path
      d="M32 6 C32 6 48 24 48 38 C48 48 41 56 32 56 C23 56 16 48 16 38 C16 24 32 6 32 6 Z"
      fill="url(#rubyDrop)"
      filter="url(#bloodGlow)"
    />
    {/* Glossy White Reflection Curve */}
    <path
      d="M24 28 C22 34 22 42 26 46"
      stroke="#FFFFFF"
      strokeWidth="3.5"
      strokeLinecap="round"
      opacity="0.85"
    />
    {/* Medical Plus Cross */}
    <rect x="29" y="32" width="6" height="14" rx="2" fill="#FFFFFF" />
    <rect x="25" y="36" width="14" height="6" rx="2" fill="#FFFFFF" />
  </svg>
);

// ==========================================
// 9. রক্তের অনুরোধ: 3D Heart in Caring Hands
// ==========================================
export const BloodRequest3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="heartPulse" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FCA5A5" />
        <stop offset="40%" stopColor="#DC2626" />
        <stop offset="100%" stopColor="#7F1D1D" />
      </radialGradient>
      <filter id="heartGlow">
        <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#DC2626" floodOpacity="0.45" />
      </filter>
    </defs>
    {/* Pulse Waves */}
    <path d="M12 36 L20 36 L24 28 L28 44 L34 32 L38 36 L52 36" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
    {/* 3D Pumping Heart */}
    <path
      d="M32 18 C28 10 16 10 14 20 C12 28 20 38 32 48 C44 38 52 28 50 20 C48 10 36 10 32 18 Z"
      fill="url(#heartPulse)"
      filter="url(#heartGlow)"
    />
    {/* Highlight shine */}
    <ellipse cx="22" cy="18" rx="4" ry="2" fill="#FFFFFF" opacity="0.6" transform="rotate(-30 22 18)" />
    {/* Blood Group A+ Badge */}
    <circle cx="44" cy="46" r="8" fill="#FFFFFF" filter="url(#heartGlow)" />
    <text x="40" y="50" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#DC2626">+</text>
  </svg>
);

// ==========================================
// 10. ক্রাইম রিপোর্টার: 3D Stealth Spy Shield
// ==========================================
export const CrimeReporter3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="spyShield" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="50%" stopColor="#7E22CE" />
        <stop offset="100%" stopColor="#3B0764" />
      </radialGradient>
      <filter id="spyDrop">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#3B0764" floodOpacity="0.5" />
      </filter>
    </defs>
    {/* Deep Purple Shield */}
    <path
      d="M32 8 L50 16 C50 36 42 48 32 56 C22 48 14 36 14 16 L32 8 Z"
      fill="url(#spyShield)"
      filter="url(#spyDrop)"
    />
    {/* Secret Eye in Center */}
    <path
      d="M20 32 C24 24 40 24 44 32 C40 40 24 40 20 32 Z"
      fill="#FFFFFF"
    />
    {/* Iris & Pupil */}
    <circle cx="32" cy="32" r="6" fill="#7E22CE" />
    <circle cx="32" cy="32" r="3" fill="#0F172A" />
    <circle cx="34" cy="30" r="1.5" fill="#FFFFFF" />
  </svg>
);

// ==========================================
// 11. ভূমি অফিস: 3D Land Deed Scroll & Seal
// ==========================================
export const LandOffice3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="parchment" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FEF3C7" />
        <stop offset="100%" stopColor="#FDE68A" />
      </linearGradient>
      <filter id="scrollDrop">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#78350F" floodOpacity="0.35" />
      </filter>
    </defs>
    {/* Parchment Document */}
    <rect x="14" y="10" width="36" height="44" rx="4" fill="url(#parchment)" filter="url(#scrollDrop)" />
    {/* Text lines */}
    <line x1="20" y1="18" x2="44" y2="18" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="20" y1="24" x2="40" y2="24" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
    <line x1="20" y1="29" x2="44" y2="29" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
    <line x1="20" y1="34" x2="36" y2="34" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
    {/* Red Government Wax Stamp */}
    <circle cx="38" cy="42" r="8" fill="#DC2626" filter="url(#scrollDrop)" />
    <circle cx="38" cy="42" r="6" fill="#B91C1C" />
    <circle cx="38" cy="42" r="3" fill="#FCA5A5" />
  </svg>
);

// ==========================================
// 12. পৌরসভা: 3D City Hall Building with Clock
// ==========================================
export const Municipality3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="muniGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
      <filter id="muniDrop">
        <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#0369A1" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Central Clock Tower */}
    <rect x="24" y="8" width="16" height="44" rx="2" fill="url(#muniGrad)" filter="url(#muniDrop)" />
    {/* Spire Roof */}
    <polygon points="32,2 40,8 24,8" fill="#0369A1" />
    {/* Clock Face */}
    <circle cx="32" cy="18" r="5" fill="#FFFFFF" />
    <line x1="32" y1="18" x2="32" y2="15" stroke="#0F172A" strokeWidth="1.5" />
    <line x1="32" y1="18" x2="35" y2="18" stroke="#0F172A" strokeWidth="1.5" />
    {/* Side Wings */}
    <rect x="8" y="24" width="48" height="28" rx="2" fill="#E0F2FE" filter="url(#muniDrop)" />
    {/* Windows */}
    <rect x="12" y="30" width="5" height="7" rx="1" fill="#0284C7" />
    <rect x="47" y="30" width="5" height="7" rx="1" fill="#0284C7" />
    {/* Grand Entrance */}
    <rect x="27" y="38" width="10" height="14" rx="2" fill="#0F172A" />
  </svg>
);

// ==========================================
// 13. পাসপোর্ট ও ভিসা: 3D Passport & Passenger Jet
// ==========================================
export const Passport3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="passCover" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#065F46" />
        <stop offset="100%" stopColor="#022C22" />
      </linearGradient>
      <filter id="passDrop">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#022C22" floodOpacity="0.45" />
      </filter>
    </defs>
    {/* Passport Booklet */}
    <rect x="10" y="12" width="34" height="44" rx="4" fill="url(#passCover)" filter="url(#passDrop)" />
    {/* Golden BD Emblem */}
    <circle cx="27" cy="28" r="8" stroke="#FBBF24" strokeWidth="1.5" fill="none" />
    <circle cx="27" cy="28" r="3" fill="#FBBF24" />
    <text x="17" y="42" fontFamily="sans-serif" fontSize="6" fontWeight="bold" fill="#FBBF24" letterSpacing="1">
      PASSPORT
    </text>
    {/* Flying Airplane in Front */}
    <g transform="translate(24, 18)" filter="url(#passDrop)">
      <path
        d="M26 4 L14 18 L4 16 L2 20 L10 24 L8 32 L12 34 L16 26 L26 28 C30 28 32 24 32 20 C32 16 30 4 26 4 Z"
        fill="#FFFFFF"
      />
      <circle cx="25" cy="18" r="1.5" fill="#0284C7" />
    </g>
  </svg>
);

// ==========================================
// 14. এনআইডি ও ভোটার: 3D Smart National ID Card
// ==========================================
export const NidVoter3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="nidCard" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ECFDF5" />
        <stop offset="100%" stopColor="#D1FAE5" />
      </linearGradient>
      <filter id="nidDrop">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#065F46" floodOpacity="0.35" />
      </filter>
    </defs>
    {/* Card Body */}
    <rect x="8" y="16" width="48" height="34" rx="4" fill="url(#nidCard)" stroke="#10B981" strokeWidth="1.5" filter="url(#nidDrop)" />
    {/* Top Green Banner */}
    <path d="M8 20 C8 17 11 16 14 16 H50 C53 16 56 17 56 20 V23 H8 Z" fill="#059669" />
    {/* Gold Smart Chip */}
    <rect x="14" y="27" width="8" height="7" rx="1.5" fill="#FBBF24" stroke="#D97706" strokeWidth="0.8" />
    {/* User Photo Placeholder */}
    <rect x="40" y="26" width="11" height="13" rx="1.5" fill="#94A3B8" />
    {/* Signature lines */}
    <line x1="14" y1="38" x2="34" y2="38" stroke="#065F46" strokeWidth="1.5" />
    <line x1="14" y1="42" x2="28" y2="42" stroke="#059669" strokeWidth="1.5" />
  </svg>
);

// ==========================================
// 15. গাড়ি মেরামত: 3D Chrome Wrench & Speed Gear
// ==========================================
export const CarRepair3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="gearOrange" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FB923C" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
      <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#94A3B8" />
      </linearGradient>
      <filter id="gearDrop">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#C2410C" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Background Rotating Gear */}
    <circle cx="34" cy="34" r="18" fill="url(#gearOrange)" filter="url(#gearDrop)" />
    <circle cx="34" cy="34" r="8" fill="#FFFFFF" />
    {/* Crossing Chrome Wrench */}
    <g transform="rotate(-35 30 30)" filter="url(#gearDrop)">
      <rect x="27" y="10" width="6" height="38" rx="2" fill="url(#chrome)" />
      {/* Wrench Top Jaw */}
      <path d="M24 14 C24 8 36 8 36 14 L33 16 C33 13 27 13 27 16 Z" fill="url(#chrome)" />
      {/* Wrench Bottom Ring */}
      <circle cx="30" cy="46" r="6" fill="url(#chrome)" />
      <circle cx="30" cy="46" r="3" fill="#FFFFFF" />
    </g>
  </svg>
);

// ==========================================
// 16. স্কুল ও কলেজ: 3D Graduation Cap & Books
// ==========================================
export const SchoolCollege3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="capGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
      <filter id="capDrop">
        <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#0F172A" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Book Stack Base */}
    <rect x="12" y="44" width="40" height="8" rx="2" fill="#3B82F6" />
    <rect x="14" y="38" width="36" height="8" rx="2" fill="#EF4444" />
    {/* Mortarboard Diamond */}
    <polygon points="32,10 56,22 32,32 8,22" fill="url(#capGrad)" filter="url(#capDrop)" />
    {/* Skullcap underneath */}
    <path d="M22 27 C22 34 42 34 42 27" fill="#1E293B" />
    {/* Gold Tassel */}
    <circle cx="32" cy="21" r="2" fill="#F59E0B" />
    <path d="M32 21 C38 21 48 26 46 38" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <rect x="44" y="36" width="4" height="6" rx="1" fill="#D97706" />
  </svg>
);

// ==========================================
// 17. রেন্ট-এ-কার: 3D Emerald Sedan & Keys
// ==========================================
export const CarRental3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="carBody" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="50%" stopColor="#059669" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <filter id="carDrop">
        <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#065F46" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Car Profile */}
    <g filter="url(#carDrop)">
      {/* Chassis Top */}
      <path d="M16 28 L24 16 H40 L48 28 Z" fill="#6EE7B7" />
      {/* Window Cutout */}
      <path d="M19 26 L25 18 H39 L45 26 Z" fill="#0F172A" />
      {/* Lower Main Car Body */}
      <rect x="8" y="27" width="48" height="16" rx="4" fill="url(#carBody)" />
      {/* Headlights */}
      <rect x="8" y="32" width="4" height="4" rx="1" fill="#FEF08A" />
      <rect x="52" y="32" width="4" height="4" rx="1" fill="#EF4444" />
      {/* Wheels */}
      <circle cx="18" cy="43" r="6" fill="#1E293B" />
      <circle cx="18" cy="43" r="2.5" fill="#E2E8F0" />
      <circle cx="46" cy="43" r="6" fill="#1E293B" />
      <circle cx="46" cy="43" r="2.5" fill="#E2E8F0" />
    </g>
  </svg>
);

// ==========================================
// 18. ইন্টারনেট ও ব্রডব্যান্ড: 3D Wi-Fi Router
// ==========================================
export const Internet3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="routerGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0EA5E9" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
      <filter id="routerDrop">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0369A1" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Wi-Fi Waves */}
    <path d="M20 18 C26 12 38 12 44 18" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M24 23 C28 19 36 19 40 23" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    {/* 3 Antennas */}
    <rect x="18" y="14" width="3" height="20" rx="1" fill="#1E293B" />
    <rect x="31" y="10" width="3" height="24" rx="1" fill="#1E293B" />
    <rect x="43" y="14" width="3" height="20" rx="1" fill="#1E293B" />
    {/* Router Body */}
    <rect x="10" y="34" width="44" height="14" rx="4" fill="url(#routerGrad)" filter="url(#routerDrop)" />
    {/* Glowing Green LEDs */}
    <circle cx="16" cy="41" r="1.5" fill="#22C55E" />
    <circle cx="21" cy="41" r="1.5" fill="#22C55E" />
    <circle cx="26" cy="41" r="1.5" fill="#22C55E" />
    <circle cx="31" cy="41" r="1.5" fill="#38BDF8" />
  </svg>
);

// ==========================================
// 19. চক্ষু সেবা: 3D Optical Glasses & Eye
// ==========================================
export const EyeCare3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="glassFrame" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#14B8A6" />
        <stop offset="100%" stopColor="#0F766E" />
      </linearGradient>
      <filter id="eyeDrop">
        <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#0F766E" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Left Lens Frame */}
    <circle cx="21" cy="32" r="13" stroke="url(#glassFrame)" strokeWidth="3" fill="#F0FDFA" filter="url(#eyeDrop)" />
    <circle cx="21" cy="32" r="5" fill="#0D9488" />
    <circle cx="23" cy="30" r="2" fill="#FFFFFF" />
    {/* Right Lens Frame */}
    <circle cx="43" cy="32" r="13" stroke="url(#glassFrame)" strokeWidth="3" fill="#F0FDFA" filter="url(#eyeDrop)" />
    <circle cx="43" cy="32" r="5" fill="#0D9488" />
    <circle cx="45" cy="30" r="2" fill="#FFFFFF" />
    {/* Bridge Bar */}
    <path d="M34 29 C32 27 32 27 30 29" stroke="url(#glassFrame)" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Temples */}
    <line x1="8" y1="30" x2="3" y2="28" stroke="url(#glassFrame)" strokeWidth="3" strokeLinecap="round" />
    <line x1="56" y1="30" x2="61" y2="28" stroke="url(#glassFrame)" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// ==========================================
// 20. ডেন্টাল সেবা: 3D Sparkling Pearl Tooth
// ==========================================
export const DentalCare3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="toothGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#E0F2FE" />
        <stop offset="100%" stopColor="#BAE6FD" />
      </radialGradient>
      <filter id="toothDrop">
        <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#0284C7" floodOpacity="0.35" />
      </filter>
    </defs>
    {/* 3D Tooth Shape */}
    <path
      d="M20 12 C14 12 10 18 10 26 C10 36 18 42 20 54 C21 57 24 58 26 56 C28 54 30 46 32 46 C34 46 36 54 38 56 C40 58 43 57 44 54 C46 42 54 36 54 26 C54 18 50 12 44 12 C38 12 34 16 32 16 C30 16 26 12 20 12 Z"
      fill="url(#toothGrad)"
      filter="url(#toothDrop)"
    />
    {/* Sparkle Glint */}
    <path d="M42 16 L44 20 L48 22 L44 24 L42 28 L40 24 L36 22 L40 20 Z" fill="#38BDF8" />
  </svg>
);

// ==========================================
// 21. জিম ও ফিটনেস: 3D Iron Dumbbell
// ==========================================
export const Fitness3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="iron" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F43F5E" />
        <stop offset="50%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#881337" />
      </linearGradient>
      <filter id="fitDrop">
        <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#881337" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Angled Dumbbell Bar */}
    <line x1="16" y1="48" x2="48" y2="16" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
    <line x1="26" y1="38" x2="38" y2="26" stroke="#E2E8F0" strokeWidth="6" strokeLinecap="round" />
    {/* Left Heavy Weight Plates */}
    <rect x="10" y="38" width="6" height="18" rx="2" fill="url(#iron)" filter="url(#fitDrop)" transform="rotate(-45 13 47)" />
    <rect x="6" y="42" width="6" height="14" rx="2" fill="url(#iron)" transform="rotate(-45 9 49)" />
    {/* Right Heavy Weight Plates */}
    <rect x="42" y="6" width="6" height="18" rx="2" fill="url(#iron)" filter="url(#fitDrop)" transform="rotate(-45 45 15)" />
    <rect x="46" y="10" width="6" height="14" rx="2" fill="url(#iron)" transform="rotate(-45 49 17)" />
  </svg>
);

// ==========================================
// 22. খেলাধুলা: 3D Golden Champion Trophy
// ==========================================
export const Sports3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="trophyGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#CA8A04" />
      </linearGradient>
      <filter id="trophyDrop">
        <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#CA8A04" floodOpacity="0.45" />
      </filter>
    </defs>
    {/* Base Stand */}
    <rect x="22" y="48" width="20" height="8" rx="2" fill="#1E293B" filter="url(#trophyDrop)" />
    <path d="M26 48 L30 42 H34 L38 48 Z" fill="url(#trophyGold)" />
    {/* Trophy Cup */}
    <path
      d="M18 10 H46 V24 C46 34 38 40 32 40 C26 40 18 34 18 24 V10 Z"
      fill="url(#trophyGold)"
      filter="url(#trophyDrop)"
    />
    {/* Handles */}
    <path d="M18 14 H12 C10 14 8 18 8 22 C8 28 12 30 18 30" stroke="#F59E0B" strokeWidth="3" fill="none" />
    <path d="M46 14 H52 C54 14 56 18 56 22 C56 28 52 30 46 30" stroke="#F59E0B" strokeWidth="3" fill="none" />
    {/* Star on Cup */}
    <polygon points="32,20 34,24 38,24 35,27 36,31 32,29 28,31 29,27 26,24 30,24" fill="#FFFFFF" />
  </svg>
);

// ==========================================
// 23. কৃষি ও সার-বীজ: 3D Golden Wheat & Sprout
// ==========================================
export const Agriculture3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="wheatGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#A16207" />
      </linearGradient>
      <filter id="wheatDrop">
        <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#854D0E" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Green Sprout Base */}
    <circle cx="32" cy="54" r="16" fill="#15803D" />
    {/* Central Stalk */}
    <line x1="32" y1="12" x2="32" y2="48" stroke="#CA8A04" strokeWidth="3" strokeLinecap="round" />
    {/* Wheat Grains */}
    <ellipse cx="26" cy="18" rx="5" ry="3" fill="url(#wheatGold)" filter="url(#wheatDrop)" transform="rotate(-30 26 18)" />
    <ellipse cx="38" cy="18" rx="5" ry="3" fill="url(#wheatGold)" filter="url(#wheatDrop)" transform="rotate(30 38 18)" />
    <ellipse cx="25" cy="26" rx="6" ry="3.5" fill="url(#wheatGold)" filter="url(#wheatDrop)" transform="rotate(-30 25 26)" />
    <ellipse cx="39" cy="26" rx="6" ry="3.5" fill="url(#wheatGold)" filter="url(#wheatDrop)" transform="rotate(30 39 26)" />
    <ellipse cx="24" cy="34" rx="6" ry="3.5" fill="url(#wheatGold)" filter="url(#wheatDrop)" transform="rotate(-30 24 34)" />
    <ellipse cx="40" cy="34" rx="6" ry="3.5" fill="url(#wheatGold)" filter="url(#wheatDrop)" transform="rotate(30 40 34)" />
    <circle cx="32" cy="12" r="3" fill="#FEF08A" />
  </svg>
);

// ==========================================
// 24. মৎস্য সেবা: 3D Swimming Silver Fish
// ==========================================
export const Fisheries3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="fishGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="60%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#075985" />
      </linearGradient>
      <filter id="fishDrop">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#075985" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Water Splash Wave */}
    <circle cx="32" cy="46" r="14" fill="#E0F2FE" opacity="0.6" />
    {/* Fish Body */}
    <path
      d="M10 32 C18 20 38 20 48 30 L58 22 V42 L48 34 C38 44 18 44 10 32 Z"
      fill="url(#fishGrad)"
      filter="url(#fishDrop)"
    />
    {/* Belly Highlight */}
    <path d="M18 34 C26 40 38 38 44 32" stroke="#BAE6FD" strokeWidth="2" strokeLinecap="round" />
    {/* Eye */}
    <circle cx="18" cy="28" r="2.5" fill="#FFFFFF" />
    <circle cx="17.5" cy="28" r="1.5" fill="#0F172A" />
  </svg>
);

// ==========================================
// 25. হোটেল ও রিসোর্ট: 3D Luxury Hotel Bed & Stars
// ==========================================
export const Hotel3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="hotelBed" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <filter id="hotelDrop">
        <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#78350F" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* 3 Golden Stars on top */}
    <polygon points="20,12 21,14 23,14 22,16 23,18 20,17 17,18 18,16 17,14 19,14" fill="#FBBF24" />
    <polygon points="32,8 33,11 36,11 34,13 35,16 32,14 29,16 30,13 28,11 31,11" fill="#F59E0B" />
    <polygon points="44,12 45,14 47,14 46,16 47,18 44,17 41,18 42,16 41,14 43,14" fill="#FBBF24" />
    {/* Headboard */}
    <rect x="12" y="22" width="40" height="14" rx="3" fill="url(#hotelBed)" filter="url(#hotelDrop)" />
    {/* Pillows */}
    <rect x="16" y="26" width="13" height="8" rx="2" fill="#FFFFFF" />
    <rect x="35" y="26" width="13" height="8" rx="2" fill="#FFFFFF" />
    {/* Duvet Bed Base */}
    <rect x="8" y="34" width="48" height="16" rx="4" fill="#FEF3C7" filter="url(#hotelDrop)" />
    <line x1="8" y1="42" x2="56" y2="42" stroke="#FDE68A" strokeWidth="2" />
  </svg>
);

// ==========================================
// 26. মুদি বাজার: 3D Shopping Cart & Veggies
// ==========================================
export const Grocery3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="cartGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <filter id="cartDrop">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#065F46" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Apples & Milk inside cart */}
    <circle cx="26" cy="20" r="5" fill="#EF4444" />
    <rect x="32" y="14" width="8" height="12" rx="1.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
    {/* Cart Basket */}
    <path
      d="M14 18 H48 L42 38 H20 L14 18 Z"
      fill="url(#cartGrad)"
      filter="url(#cartDrop)"
    />
    <line x1="12" y1="18" x2="6" y2="18" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
    {/* Wheels */}
    <circle cx="22" cy="46" r="4" fill="#1E293B" />
    <circle cx="40" cy="46" r="4" fill="#1E293B" />
  </svg>
);

// ==========================================
// 27. শাক-সবজি: 3D Fresh Veggie Basket
// ==========================================
export const Vegetables3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="basketWood" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
      <filter id="vegDrop">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#78350F" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Big Red Tomato */}
    <circle cx="24" cy="24" r="9" fill="#DC2626" />
    <circle cx="22" cy="22" r="2.5" fill="#FCA5A5" />
    {/* Orange Carrot */}
    <polygon points="40,14 44,14 36,32 34,30" fill="#F97316" />
    <path d="M42 14 L46 8 M42 14 L42 7" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" />
    {/* Green Cabbage */}
    <circle cx="36" cy="25" r="8" fill="#16A34A" />
    {/* Woven Basket */}
    <path
      d="M12 30 H52 L46 50 H18 L12 30 Z"
      fill="url(#basketWood)"
      filter="url(#vegDrop)"
    />
    <line x1="15" y1="38" x2="49" y2="38" stroke="#FDE68A" strokeWidth="2" strokeDasharray="4 2" />
  </svg>
);

// ==========================================
// 28. বিউটি পার্লার: 3D Golden Scissors & Sparkles
// ==========================================
export const BeautyParlor3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="parlGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FDA4AF" />
        <stop offset="50%" stopColor="#F43F5E" />
        <stop offset="100%" stopColor="#BE123C" />
      </linearGradient>
      <filter id="parlDrop">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#BE123C" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Lipstick */}
    <rect x="36" y="24" width="8" height="24" rx="2" fill="#1E293B" filter="url(#parlDrop)" />
    <rect x="36" y="16" width="8" height="8" rx="1" fill="#F43F5E" />
    {/* Crossed Golden Scissors */}
    <g transform="rotate(-30 25 35)" filter="url(#parlDrop)">
      <circle cx="18" cy="46" r="5" stroke="#FBBF24" strokeWidth="2.5" fill="none" />
      <circle cx="30" cy="46" r="5" stroke="#FBBF24" strokeWidth="2.5" fill="none" />
      <line x1="20" y1="42" x2="30" y2="14" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
      <line x1="28" y1="42" x2="18" y2="14" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
    </g>
    {/* Magic Sparkles */}
    <polygon points="48,8 49,11 52,12 49,13 48,16 47,13 44,12 47,11" fill="#FBBF24" />
  </svg>
);

// ==========================================
// 29. লন্ড্রি ও ড্রাই ক্লিন: 3D Washing Machine
// ==========================================
export const Laundry3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="washMachine" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
      <filter id="washDrop">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0369A1" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Machine Cabinet */}
    <rect x="12" y="10" width="40" height="46" rx="6" fill="url(#washMachine)" filter="url(#washDrop)" />
    {/* Control Panel */}
    <rect x="16" y="14" width="32" height="6" rx="2" fill="#E0F2FE" />
    <circle cx="20" cy="17" r="1.5" fill="#0284C7" />
    <circle cx="25" cy="17" r="1.5" fill="#0284C7" />
    <circle cx="43" cy="17" r="2" fill="#F59E0B" />
    {/* Circular Glass Porthole */}
    <circle cx="32" cy="36" r="13" fill="#1E293B" />
    <circle cx="32" cy="36" r="10" fill="#67E8F9" />
    {/* Soap Water Swirl inside */}
    <path d="M26 36 C28 32 36 32 38 36 C36 40 28 40 26 36 Z" fill="#FFFFFF" opacity="0.8" />
  </svg>
);

// ==========================================
// 30. ফার্নিচার: 3D Royal Velvet Sofa
// ==========================================
export const Furniture3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="sofaVelvet" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <filter id="sofaDrop">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#78350F" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* High Backrest */}
    <rect x="14" y="16" width="36" height="24" rx="4" fill="url(#sofaVelvet)" filter="url(#sofaDrop)" />
    {/* Tufted Button Indents */}
    <circle cx="22" cy="24" r="1.5" fill="#78350F" />
    <circle cx="32" cy="24" r="1.5" fill="#78350F" />
    <circle cx="42" cy="24" r="1.5" fill="#78350F" />
    {/* Padded Seat Cushion */}
    <rect x="10" y="32" width="44" height="14" rx="4" fill="#FBBF24" filter="url(#sofaDrop)" />
    {/* Armrests */}
    <rect x="8" y="26" width="8" height="18" rx="3" fill="#D97706" />
    <rect x="48" y="26" width="8" height="18" rx="3" fill="#D97706" />
    {/* Wooden Legs */}
    <rect x="12" y="46" width="4" height="6" rx="1" fill="#78350F" />
    <rect x="48" y="46" width="4" height="6" rx="1" fill="#78350F" />
  </svg>
);

// ==========================================
// 31. হার্ডওয়্যার ও স্যানিটারি: 3D Steel Hammer & Tools
// ==========================================
export const Hardware3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="hammerSteel" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#94A3B8" />
        <stop offset="50%" stopColor="#64748B" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>
      <filter id="toolDrop">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#334155" floodOpacity="0.45" />
      </filter>
    </defs>
    {/* Wooden Handle */}
    <rect x="28" y="18" width="8" height="38" rx="3" fill="#D97706" stroke="#B45309" strokeWidth="1" filter="url(#toolDrop)" />
    {/* Hammer Steel Head */}
    <path
      d="M16 12 H48 V22 H40 V20 H24 V22 H16 Z"
      fill="url(#hammerSteel)"
      filter="url(#toolDrop)"
    />
    <rect x="12" y="10" width="6" height="14" rx="1" fill="#CBD5E1" />
  </svg>
);

// ==========================================
// 32. রাজমিস্ত্রি: 3D Brick Wall & Trowel
// ==========================================
export const Mason3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="brickRed" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F87171" />
        <stop offset="100%" stopColor="#B91C1C" />
      </linearGradient>
      <filter id="masonDrop">
        <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#7F1D1D" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Brick Wall */}
    <g filter="url(#masonDrop)">
      <rect x="8" y="24" width="22" height="8" rx="1" fill="url(#brickRed)" />
      <rect x="34" y="24" width="22" height="8" rx="1" fill="url(#brickRed)" />
      <rect x="18" y="34" width="28" height="8" rx="1" fill="url(#brickRed)" />
      <rect x="8" y="44" width="22" height="8" rx="1" fill="url(#brickRed)" />
      <rect x="34" y="44" width="22" height="8" rx="1" fill="url(#brickRed)" />
    </g>
    {/* Steel Trowel */}
    <polygon points="32,8 44,20 32,24 24,18" fill="#E2E8F0" filter="url(#masonDrop)" />
    <rect x="22" y="14" width="4" height="12" rx="1" fill="#D97706" transform="rotate(30 22 14)" />
  </svg>
);

// ==========================================
// 33. আইনি সহায়তা: 3D Golden Scales of Justice
// ==========================================
export const Legal3DIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="scaleGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="50%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#A16207" />
      </linearGradient>
      <filter id="scaleDrop">
        <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#78350F" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Central Pillar */}
    <rect x="30" y="10" width="4" height="42" rx="1" fill="url(#scaleGold)" filter="url(#scaleDrop)" />
    <circle cx="32" cy="10" r="3" fill="#FBBF24" />
    <rect x="20" y="50" width="24" height="6" rx="2" fill="url(#scaleGold)" filter="url(#scaleDrop)" />
    {/* Balance Beam */}
    <line x1="12" y1="16" x2="52" y2="16" stroke="#CA8A04" strokeWidth="3" strokeLinecap="round" />
    {/* Left Pan */}
    <line x1="14" y1="17" x2="10" y2="28" stroke="#CA8A04" strokeWidth="1.5" />
    <line x1="14" y1="17" x2="18" y2="28" stroke="#CA8A04" strokeWidth="1.5" />
    <ellipse cx="14" cy="28" rx="8" ry="3" fill="url(#scaleGold)" filter="url(#scaleDrop)" />
    {/* Right Pan */}
    <line x1="50" y1="17" x2="46" y2="28" stroke="#CA8A04" strokeWidth="1.5" />
    <line x1="50" y1="17" x2="54" y2="28" stroke="#CA8A04" strokeWidth="1.5" />
    <ellipse cx="50" cy="28" rx="8" ry="3" fill="url(#scaleGold)" filter="url(#scaleDrop)" />
  </svg>
);

// ==========================================
// Master Dispatcher: Service3DIcon Component
// ==========================================
import { CategoryType } from '../types';

interface Service3DIconProps {
  id: CategoryType;
  className?: string;
}

export const Service3DIcon: React.FC<Service3DIconProps> = ({ id, className = "w-11 h-11" }) => {
  switch (id) {
    case 'police':
      return <Police3DIcon className={className} />;
    case 'fire-service':
      return <FireService3DIcon className={className} />;
    case 'bank-atm':
      return <Bank3DIcon className={className} />;
    case 'mobile-banking':
      return <MobileBanking3DIcon className={className} />;
    case 'courier':
      return <Courier3DIcon className={className} />;
    case 'computer-print':
      return <ComputerPrint3DIcon className={className} />;
    case 'freelancing':
      return <Freelancing3DIcon className={className} />;
    case 'blood':
      return <Blood3DIcon className={className} />;
    case 'blood-request':
      return <BloodRequest3DIcon className={className} />;
    case 'emergency':
      return <Emergency3DIcon className={className} />;
    case 'crime-reporter':
      return <CrimeReporter3DIcon className={className} />;
    case 'land-office':
      return <LandOffice3DIcon className={className} />;
    case 'municipality':
      return <Municipality3DIcon className={className} />;
    case 'passport-visa':
      return <Passport3DIcon className={className} />;
    case 'birth-death':
      return <LandOffice3DIcon className={className} />;
    case 'nid-voter':
      return <NidVoter3DIcon className={className} />;
    case 'car-repair':
      return <CarRepair3DIcon className={className} />;
    case 'school-college':
      return <SchoolCollege3DIcon className={className} />;
    case 'car-rental':
      return <CarRental3DIcon className={className} />;
    case 'agriculture':
      return <Agriculture3DIcon className={className} />;
    case 'fisheries':
      return <Fisheries3DIcon className={className} />;
    case 'hotel':
      return <Hotel3DIcon className={className} />;
    case 'grocery':
      return <Grocery3DIcon className={className} />;
    case 'vegetables':
      return <Vegetables3DIcon className={className} />;
    case 'beauty-parlor':
      return <BeautyParlor3DIcon className={className} />;
    case 'laundry':
      return <Laundry3DIcon className={className} />;
    case 'furniture':
      return <Furniture3DIcon className={className} />;
    case 'hardware':
      return <Hardware3DIcon className={className} />;
    case 'internet':
      return <Internet3DIcon className={className} />;
    case 'eye-care':
      return <EyeCare3DIcon className={className} />;
    case 'dental-care':
      return <DentalCare3DIcon className={className} />;
    case 'fitness':
      return <Fitness3DIcon className={className} />;
    case 'sports':
      return <Sports3DIcon className={className} />;
    case 'business-directory':
      return <Jobs3DIcon className={className} />;
    case 'hospital':
      return <Hospital3DIcon className={className} />;
    case 'doctor':
      return <Doctor3DIcon className={className} />;
    case 'mobile-maker':
      return <Services3DIcon className={className} />;
    case 'electrician':
      return <Services3DIcon className={className} />;
    case 'plumber':
      return <Services3DIcon className={className} />;
    case 'ac-mechanic':
      return <Services3DIcon className={className} />;
    case 'driver':
      return <CarRental3DIcon className={className} />;
    case 'tutor':
      return <SchoolCollege3DIcon className={className} />;
    case 'food':
      return <Restaurant3DIcon className={className} />;
    case 'lost-found':
      return <Shopping3DIcon className={className} />;
    case 'legal':
      return <Legal3DIcon className={className} />;
    case 'citizen-fund':
      return <BloodRequest3DIcon className={className} />;
    case 'govt-office':
      return <Municipality3DIcon className={className} />;
    case 'bus-train':
      return <Transport3DIcon className={className} />;
    case 'tourist-spot':
      return <Monument3DIcon className={className} />;
    case 'mason':
      return <Mason3DIcon className={className} />;
    case 'house-rent':
      return <House3DIcon className={className} />;
    case 'buy-sell':
      return <Shopping3DIcon className={className} />;
    case 'jobs':
      return <Jobs3DIcon className={className} />;
    case 'events':
      return <Event3DIcon className={className} />;
    default:
      return <Services3DIcon className={className} />;
  }
};
