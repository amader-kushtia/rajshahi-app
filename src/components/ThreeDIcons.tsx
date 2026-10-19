import React from 'react';

// 1. দর্শনীয় স্থান: 3D Historical Monument / Dome
export const Monument3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="domeGrad" cx="50%" cy="30%" r="60%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#FFF2D6" />
        <stop offset="100%" stopColor="#DFBF86" />
      </radialGradient>
      <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFF8EC" />
        <stop offset="100%" stopColor="#E2CA9B" />
      </linearGradient>
      <linearGradient id="treeGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <filter id="monDrop" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Base trees */}
    <circle cx="12" cy="48" r="8" fill="url(#treeGrad)" />
    <circle cx="52" cy="48" r="8" fill="url(#treeGrad)" />
    <circle cx="8" cy="46" r="6" fill="#10B981" />
    <circle cx="56" cy="46" r="6" fill="#10B981" />
    
    {/* Base platform */}
    <path d="M6 56 H58 V52 H6 Z" fill="#CBB284" />
    <path d="M10 52 H54 V48 H10 Z" fill="#E8D7B5" />
    <path d="M14 48 H50 V45 H14 Z" fill="#FBF3E2" />

    {/* Pillars and Walls */}
    <rect x="18" y="32" width="28" height="13" rx="1" fill="url(#wallGrad)" filter="url(#monDrop)" />
    {/* Arches */}
    <path d="M22 45 V38 C22 36 24 35 26 35 C28 35 30 36 30 38 V45 Z" fill="#8B693A" />
    <path d="M34 45 V38 C34 36 36 35 38 35 C40 35 42 36 42 38 V45 Z" fill="#8B693A" />

    {/* Side mini domes */}
    <path d="M14 36 C14 30 18 26 18 26 C18 26 22 30 22 36 Z" fill="url(#domeGrad)" />
    <path d="M42 36 C42 30 46 26 46 26 C46 26 50 30 50 36 Z" fill="url(#domeGrad)" />

    {/* Central Grand Dome */}
    <path d="M22 32 C22 18 32 10 32 10 C32 10 42 18 42 32 Z" fill="url(#domeGrad)" filter="url(#monDrop)" />
    {/* Golden spire / finial */}
    <path d="M31 10 H33 V4 H31 Z" fill="#FBBF24" />
    <circle cx="32" cy="4" r="2" fill="#F59E0B" />
  </svg>
);

// 2. রেস্টুরেন্ট: 3D Cloche Food Cover + Fork & Spoon
export const Restaurant3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="clocheGrad" cx="45%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#FDE68A" />
        <stop offset="100%" stopColor="#F59E0B" />
      </radialGradient>
      <linearGradient id="utensilGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E2E8F0" />
      </linearGradient>
      <filter id="clocheDrop">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.35" />
      </filter>
    </defs>
    {/* Fork on Left */}
    <g transform="translate(4, 10)">
      <path d="M8 8 V22 C8 24 10 26 12 26 V44 H14 V26 C16 26 18 24 18 22 V8 H16 V18 H14 V8 H12 V18 H10 V8 Z" fill="url(#utensilGrad)" filter="url(#clocheDrop)" />
    </g>
    {/* Spoon in Center-Left angled */}
    <g transform="translate(14, 10)">
      <path d="M12 8 C8 8 6 14 6 20 C6 24 9 26 11 26 V44 H13 V26 C15 26 18 24 18 20 C18 14 16 8 12 8 Z" fill="url(#utensilGrad)" filter="url(#clocheDrop)" />
    </g>
    {/* Cloche Food Cover on Right */}
    <g filter="url(#clocheDrop)">
      {/* Platter base */}
      <ellipse cx="45" cy="44" rx="16" ry="3.5" fill="#E2E8F0" />
      <ellipse cx="45" cy="43" rx="15" ry="3" fill="#FFFFFF" />
      {/* Dome */}
      <path d="M31 42 C31 28 38 24 45 24 C52 24 59 28 59 42 Z" fill="url(#clocheGrad)" />
      {/* Handle */}
      <circle cx="45" cy="22" r="2.5" fill="#D97706" />
      <path d="M44 22 H46 V24 H44 Z" fill="#B45309" />
    </g>
  </svg>
);

// 3. শপিং: 3D Shopping Bags (Blue & Yellow)
export const Shopping3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="blueBag" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
      <linearGradient id="yellowBag" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#EAB308" />
      </linearGradient>
      <filter id="bagDrop">
        <feDropShadow dx="1" dy="3" stdDeviation="2" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Yellow bag behind */}
    <g transform="translate(24, 12)" filter="url(#bagDrop)">
      <path d="M12 10 C12 5 16 2 20 2 C24 2 28 5 28 10" stroke="#CA8A04" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M8 10 L6 38 H34 L32 10 Z" fill="url(#yellowBag)" />
      {/* Bag side depth */}
      <path d="M6 10 L8 14 H32 L34 10 Z" fill="#FEF08A" opacity="0.6" />
    </g>
    {/* Blue bag in front */}
    <g transform="translate(4, 16)" filter="url(#bagDrop)">
      <path d="M14 10 C14 4 18 1 22 1 C26 1 30 4 30 10" stroke="#0369A1" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <path d="M8 10 L5 38 H39 L36 10 Z" fill="url(#blueBag)" />
      {/* Bag fold highlight */}
      <path d="M5 10 L9 13 H35 L39 10 Z" fill="#BAE6FD" opacity="0.7" />
    </g>
  </svg>
);

// 4. চাকরি: 3D Business Briefcase
export const Jobs3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="caseGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="50%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#0369A1" />
      </linearGradient>
      <linearGradient id="strapGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <filter id="caseDrop">
        <feDropShadow dx="0" dy="3" stdDeviation="2" floodOpacity="0.35" />
      </filter>
    </defs>
    {/* Briefcase handle */}
    <path d="M22 18 C22 13 26 11 32 11 C38 11 42 13 42 18" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Main Case Body */}
    <rect x="8" y="18" width="48" height="34" rx="6" fill="url(#caseGrad)" filter="url(#caseDrop)" />
    {/* Top Flap */}
    <path d="M8 22 C8 20 10 18 12 18 H52 C54 18 56 20 56 22 V34 C56 34 44 38 32 38 C20 38 8 34 8 34 Z" fill="#0284C7" />
    {/* Gold Lock */}
    <rect x="29" y="32" width="6" height="8" rx="1.5" fill="url(#strapGrad)" filter="url(#caseDrop)" />
    <circle cx="32" cy="36" r="1" fill="#78350F" />
    {/* Corner Reinforcements */}
    <path d="M8 46 C8 49 11 52 14 52 H18 V46 H8 Z" fill="#0369A1" />
    <path d="M56 46 C56 49 53 52 50 52 H46 V46 H56 Z" fill="#0369A1" />
  </svg>
);

// 5. বাস-ট্রেন: 3D Yellow Bus + Blue Train
export const Transport3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="busGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#EAB308" />
      </linearGradient>
      <linearGradient id="trainGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#67E8F9" />
        <stop offset="50%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#0891B2" />
      </linearGradient>
      <filter id="transDrop">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.35" />
      </filter>
    </defs>
    {/* Bus on Left */}
    <g filter="url(#transDrop)">
      <rect x="6" y="16" width="24" height="34" rx="5" fill="url(#busGrad)" />
      <rect x="9" y="20" width="18" height="10" rx="2" fill="#1E293B" />
      <circle cx="11" cy="42" r="2.5" fill="#FFFFFF" />
      <circle cx="25" cy="42" r="2.5" fill="#FFFFFF" />
      <rect x="14" y="41" width="8" height="3" rx="1" fill="#713F12" />
      <circle cx="10" cy="48" r="2" fill="#0F172A" />
      <circle cx="26" cy="48" r="2" fill="#0F172A" />
    </g>
    {/* Train on Right */}
    <g filter="url(#transDrop)">
      <path d="M36 18 C36 13 40 12 48 12 C56 12 60 13 60 18 V46 C60 48 58 50 56 50 H40 C38 50 36 48 36 46 Z" fill="url(#trainGrad)" />
      <path d="M39 18 C39 16 42 15 48 15 C54 15 57 16 57 18 V28 H39 Z" fill="#0F172A" />
      {/* Front nose stripe */}
      <rect x="36" y="32" width="24" height="4" fill="#FFFFFF" />
      <circle cx="48" cy="41" r="3.5" fill="#FEF08A" />
      <rect x="42" y="47" width="12" height="3" rx="1" fill="#1E293B" />
    </g>
  </svg>
);

// 6. হাসপাতাল: 3D Hospital Clinic Building
export const Hospital3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="hospGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E2E8F0" />
      </linearGradient>
      <filter id="hospDrop">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
      </filter>
    </defs>
    {/* Side Wings */}
    <rect x="8" y="24" width="48" height="28" rx="3" fill="#CBD5E1" filter="url(#hospDrop)" />
    {/* Center main block */}
    <rect x="18" y="14" width="28" height="38" rx="4" fill="url(#hospGrad)" filter="url(#hospDrop)" />
    {/* Red Medical Cross */}
    <rect x="29" y="18" width="6" height="12" rx="1" fill="#EF4444" />
    <rect x="26" y="21" width="12" height="6" rx="1" fill="#EF4444" />
    {/* Clinic Windows */}
    <rect x="12" y="28" width="5" height="6" rx="1" fill="#38BDF8" />
    <rect x="12" y="38" width="5" height="6" rx="1" fill="#38BDF8" />
    <rect x="47" y="28" width="5" height="6" rx="1" fill="#38BDF8" />
    <rect x="47" y="38" width="5" height="6" rx="1" fill="#38BDF8" />
    {/* Center Glass Entrance */}
    <rect x="27" y="40" width="10" height="12" rx="1.5" fill="#0284C7" />
  </svg>
);

// 7. ডাক্তার: 3D Doctor with Stethoscope
export const Doctor3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="faceGrad" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stopColor="#FED7AA" />
        <stop offset="100%" stopColor="#FDBA74" />
      </radialGradient>
      <linearGradient id="coatGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E2E8F0" />
      </linearGradient>
      <filter id="docDrop">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
      </filter>
    </defs>
    {/* Hair & Head */}
    <circle cx="32" cy="19" r="11" fill="#1E293B" />
    <circle cx="32" cy="21" r="9" fill="url(#faceGrad)" />
    {/* Hair bangs */}
    <path d="M23 18 C25 13 32 12 41 15 C39 13 32 11 23 18 Z" fill="#0F172A" />

    {/* Lab Coat / Body */}
    <path d="M12 54 C12 40 18 34 26 33 L32 38 L38 33 C46 34 52 40 52 54 Z" fill="url(#coatGrad)" filter="url(#docDrop)" />
    
    {/* Blue Shirt & Tie */}
    <path d="M28 33 L32 38 L36 33 H28 Z" fill="#38BDF8" />
    <path d="M31 38 L33 38 L33 46 L32 48 L31 46 Z" fill="#0284C7" />

    {/* Stethoscope around neck */}
    <path d="M24 35 C24 45 28 47 30 47 M40 35 C40 45 36 47 34 47" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <circle cx="32" cy="49" r="2.5" fill="#94A3B8" />
  </svg>
);

// 8. জরুরি সেবা: 3D Red Siren Beacon
export const Emergency3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="sirenGrad" cx="45%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#FEF2F2" />
        <stop offset="35%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#991B1B" />
      </radialGradient>
      <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#94A3B8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
      <filter id="sirenDrop">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Glow rays */}
    <line x1="32" y1="6" x2="32" y2="10" stroke="#F87171" strokeWidth="3" strokeLinecap="round" />
    <line x1="16" y1="12" x2="20" y2="15" stroke="#F87171" strokeWidth="3" strokeLinecap="round" />
    <line x1="48" y1="12" x2="44" y2="15" stroke="#F87171" strokeWidth="3" strokeLinecap="round" />

    {/* Siren Base */}
    <ellipse cx="32" cy="50" rx="20" ry="5" fill="url(#baseGrad)" />
    <rect x="14" y="44" width="36" height="6" rx="2" fill="#64748B" />

    {/* Siren Dome */}
    <path d="M19 44 C19 22 25 14 32 14 C39 14 45 22 45 44 Z" fill="url(#sirenGrad)" filter="url(#sirenDrop)" />

    {/* White Cross on Siren */}
    <rect x="29" y="26" width="6" height="12" rx="1.5" fill="#FFFFFF" />
    <rect x="26" y="29" width="12" height="6" rx="1.5" fill="#FFFFFF" />
  </svg>
);

// 9. বাসা ভাড়া: 3D Cute House Cottage
export const House3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F472B6" />
        <stop offset="100%" stopColor="#DB2777" />
      </linearGradient>
      <linearGradient id="wallGradHouse" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#FCE7F3" />
      </linearGradient>
      <filter id="houseDrop">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.35" />
      </filter>
    </defs>
    {/* Chimney */}
    <rect x="42" y="16" width="6" height="12" rx="1" fill="#BE185D" />
    
    {/* House Body */}
    <rect x="14" y="30" width="36" height="24" rx="3" fill="url(#wallGradHouse)" filter="url(#houseDrop)" />

    {/* Sloping Roof */}
    <path d="M8 32 L32 12 L56 32 H8 Z" fill="url(#roofGrad)" filter="url(#houseDrop)" />

    {/* Door */}
    <rect x="27" y="38" width="10" height="16" rx="2" fill="#DB2777" />
    <circle cx="34" cy="46" r="1" fill="#FEF08A" />

    {/* Windows */}
    <rect x="17" y="36" width="7" height="7" rx="1.5" fill="#67E8F9" stroke="#DB2777" strokeWidth="1" />
    <rect x="40" y="36" width="7" height="7" rx="1.5" fill="#67E8F9" stroke="#DB2777" strokeWidth="1" />
  </svg>
);

// 10. স্থানীয় খবর: 3D Printed Newspaper "NEWS"
export const News3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="paperGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F1F5F9" />
      </linearGradient>
      <filter id="newsDrop">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.35" />
      </filter>
    </defs>
    {/* Back layer sheet */}
    <rect x="14" y="12" width="40" height="42" rx="3" fill="#E2E8F0" />
    {/* Main newspaper front */}
    <rect x="10" y="15" width="40" height="39" rx="3" fill="url(#paperGrad)" filter="url(#newsDrop)" />
    
    {/* Bold "NEWS" Title */}
    <text x="14" y="27" fontFamily="sans-serif" fontSize="9" fontWeight="900" fill="#0F172A" letterSpacing="1">
      NEWS
    </text>

    {/* Header dividing line */}
    <line x1="14" y1="30" x2="46" y2="30" stroke="#0F172A" strokeWidth="1.5" />

    {/* Image placeholder */}
    <rect x="14" y="33" width="14" height="15" rx="1" fill="#94A3B8" />

    {/* Text columns */}
    <line x1="31" y1="34" x2="46" y2="34" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="31" y1="38" x2="46" y2="38" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="31" y1="42" x2="46" y2="42" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="31" y1="46" x2="42" y2="46" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 11. ইভেন্ট: 3D Calendar with Gold Star
export const Event3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="calTop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F87171" />
        <stop offset="100%" stopColor="#DC2626" />
      </linearGradient>
      <linearGradient id="calBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F8FAFC" />
      </linearGradient>
      <filter id="calDrop">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.35" />
      </filter>
    </defs>
    {/* Spiral Rings */}
    <rect x="18" y="10" width="4" height="8" rx="2" fill="#CBD5E1" />
    <rect x="28" y="10" width="4" height="8" rx="2" fill="#CBD5E1" />
    <rect x="38" y="10" width="4" height="8" rx="2" fill="#CBD5E1" />

    {/* Calendar Card */}
    <rect x="10" y="15" width="44" height="38" rx="5" fill="url(#calBody)" filter="url(#calDrop)" />
    
    {/* Red Top Header */}
    <path d="M10 20 C10 17 12 15 15 15 H49 C52 15 54 17 54 20 V25 H10 Z" fill="url(#calTop)" />

    {/* Calendar grid dots */}
    <circle cx="18" cy="32" r="2" fill="#CBD5E1" />
    <circle cx="26" cy="32" r="2" fill="#CBD5E1" />
    <circle cx="18" cy="40" r="2" fill="#CBD5E1" />
    <circle cx="26" cy="40" r="2" fill="#CBD5E1" />

    {/* Big Shiny Golden Star on active day */}
    <path d="M40 30 L42 35 L47 35 L43 38 L45 43 L40 40 L35 43 L37 38 L33 35 L38 35 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="0.8" />
  </svg>
);

// 12. সেবা সমূহ: 3D Metallic Gear / Tools
export const Services3DIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="gearGrad" cx="45%" cy="40%" r="55%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#93C5FD" />
        <stop offset="100%" stopColor="#2563EB" />
      </radialGradient>
      <filter id="gearDrop">
        <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* 3D Gear Shape */}
    <path 
      d="M28 8 H36 V14 C38 15 40 16 42 17 L47 13 L53 19 L49 24 C50 26 51 28 52 30 H58 V38 H52 C51 40 50 42 49 44 L53 49 L47 55 L42 51 C40 52 38 53 36 54 V60 H28 V54 C26 53 24 52 22 51 L17 55 L11 49 L15 44 C14 42 13 40 12 38 H6 V30 H12 C13 28 14 26 15 24 L11 19 L17 13 L22 17 C24 16 26 15 28 14 Z" 
      fill="url(#gearGrad)" 
      filter="url(#gearDrop)"
    />
    {/* Center Hole */}
    <circle cx="32" cy="34" r="8" fill="#1D4ED8" />
    <circle cx="32" cy="34" r="5" fill="#0B2559" />
  </svg>
);
