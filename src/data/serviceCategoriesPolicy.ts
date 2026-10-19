import { 
  Home, 
  ShoppingBag, 
  Zap, 
  Wrench, 
  Snowflake, 
  Car, 
  GraduationCap, 
  Dog, 
  Hammer, 
  Smartphone, 
  AlertTriangle, 
  Droplet, 
  Briefcase, 
  PackageSearch, 
  UtensilsCrossed, 
  Scale, 
  PartyPopper,
  Shield,
  Flame,
  Building,
  Landmark,
  Wallet,
  Package,
  Printer,
  Laptop,
  FileText,
  Plane,
  FileSignature,
  UserCheck,
  Sprout,
  Fish,
  Hotel,
  Scissors,
  Shirt,
  Sofa,
  Wifi,
  Eye,
  Smile,
  Dumbbell,
  Trophy,
  Stethoscope,
  Heart,
  Train,
  Apple,
  PhoneCall,
  LucideIcon
} from 'lucide-react';
import { CategoryType, PostItem } from '../types';

export interface ServicePostingPolicy {
  id: CategoryType;
  label: string;
  englishLabel: string;
  icon: LucideIcon;
  allowPublicPost: boolean;
  group: 'emergency' | 'health' | 'govt' | 'tech_handyman' | 'transport' | 'business_finance' | 'education_it' | 'daily_needs';
  groupLabel: string;
  badge: string;
  adminOnlyReason?: string;
  subcategories: string[];
  suggestedFields?: {
    priceLabel?: string;
    hasPrice?: boolean;
    locationPlaceholder?: string;
    phoneLabel?: string;
  };
}

export const SERVICE_POSTING_POLICIES: Record<string, ServicePostingPolicy> = {
  // ==========================================
  // ১. সাধারণ নাগরিক / পাবলিক পোস্ট অনুমতিপ্রাপ্ত সেবা (PUBLIC POSTING ALLOWED)
  // ==========================================
  'house-rent': {
    id: 'house-rent',
    label: 'বাসা ভাড়া',
    englishLabel: 'House Rent',
    icon: Home,
    allowPublicPost: true,
    group: 'daily_needs',
    groupLabel: 'বাসা ও জমিজমা',
    badge: 'বাসা / মেস / দোকান',
    subcategories: ['ফ্যামিলি বাসা', 'ব্যাচেলর মেস', 'সাবলেট', 'দোকান/বাণিজ্যিক স্পেস', 'গ্যারেজ/গুদাম', 'অফিস স্পেস']
  },
  'buy-sell': {
    id: 'buy-sell',
    label: 'বাই-সেল মার্কেট',
    englishLabel: 'Buy & Sell',
    icon: ShoppingBag,
    allowPublicPost: true,
    group: 'daily_needs',
    groupLabel: 'কেনাবেচা',
    badge: 'মোবাইল / পণ্য',
    subcategories: ['স্মার্টফোন ও গ্যাজেট', 'বাইক ও মোটরসাইকেল', 'আসবাবপত্র', 'ইলেকট্রনিক্স ও টিভি', 'জমি ও ফ্ল্যাট', 'অন্যান্য সামগ্রী']
  },
  'jobs': {
    id: 'jobs',
    label: 'চাকরি ও নিয়োগ',
    englishLabel: 'Jobs & Career',
    icon: Briefcase,
    allowPublicPost: true,
    group: 'education_it',
    groupLabel: 'কর্মসংস্থান',
    badge: 'নিয়োগ বিজ্ঞপ্তি',
    subcategories: ['সেলস ও মার্কেটিং', 'শোরুম ও শপ সহকারী', 'প্রেস ও কম্পিউটার অপারেটর', 'ডেলিভারি বয় ও রাইডার', 'শিক্ষকতা ও কোচিং', 'অফিস সহকারী / পিওন', 'ড্রাইভার নিয়োগ']
  },
  'lost-found': {
    id: 'lost-found',
    label: 'হারানো ও প্রাপ্তি',
    englishLabel: 'Lost & Found',
    icon: PackageSearch,
    allowPublicPost: true,
    group: 'emergency',
    groupLabel: 'নাগরিক সেবা',
    badge: 'আইডি / দলিল / বস্তু',
    subcategories: ['জাতীয় পরিচয়পত্র ও সার্টিফিকেট', 'মানিব্যাগ ও ড্রাইভিং লাইসেন্স', 'মোবাইল ও গ্যাজেট', 'চাবি ও আনুষঙ্গিক', 'পোষা প্রাণী', 'অন্যান্য জিনিস']
  },
  'electrician': {
    id: 'electrician',
    label: 'ইলেকট্রিশিয়ান',
    englishLabel: 'Electrician',
    icon: Zap,
    allowPublicPost: true,
    group: 'tech_handyman',
    groupLabel: 'মিস্ত্রি ও কারিগরি',
    badge: 'ওয়্যারিং / ফ্যান / লাইন',
    subcategories: ['হাউস ওয়্যারিং ও পাইপিং', 'ফ্যান, লাইট ও সুইচ ফিটিং', 'আইপিএস ও ইউপিএস ব্যাটারি', 'পানির পাম্প ও মোটর ওয়্যারিং', 'শর্ট সার্কিট ও বিদ্যুৎ মেরামত']
  },
  'plumber': {
    id: 'plumber',
    label: 'প্লাম্বার ও স্যানিটারি',
    englishLabel: 'Plumber',
    icon: Wrench,
    allowPublicPost: true,
    group: 'tech_handyman',
    groupLabel: 'মিস্ত্রি ও কারিগরি',
    badge: 'পাইপলাইন / স্যানিটারি',
    subcategories: ['পাইপ লিকেজ ও পানির লাইন', 'স্যানিটারি কমোড ও বেসিন', 'পানির মোটর ও পাম্প ফিটিং', 'ছাদের পানির ট্যাংক পরিষ্কার', 'ড্রেনেজ ও সিঙ্ক ব্লক সমাধান']
  },
  'ac-mechanic': {
    id: 'ac-mechanic',
    label: 'এসি ও ফ্রিজ মেকানিক',
    englishLabel: 'AC & Fridge Mechanic',
    icon: Snowflake,
    allowPublicPost: true,
    group: 'tech_handyman',
    groupLabel: 'মিস্ত্রি ও কারিগরি',
    badge: 'সার্ভিসিং / গ্যাস রিফিল',
    subcategories: ['এসি সার্ভিসিং ও ক্লিনিং', 'এসি গ্যাস রিফিল', 'ফ্রিজ ঠান্ডা না হওয়া সমাধান', 'এসি ইনস্টল ও শিফটিং', 'কম্প্রেসার ও থার্মোস্ট্যাট মেরামত']
  },
  'driver': {
    id: 'driver',
    label: 'ড্রাইভার ও চালক',
    englishLabel: 'Driver',
    icon: Car,
    allowPublicPost: true,
    group: 'transport',
    groupLabel: 'যাতায়াত ও চালক',
    badge: 'ব্যক্তিগত / রেন্টাল চালক',
    subcategories: ['ব্যক্তিগত প্রাইভেট কার চালক', 'উবার / পাঠাও রাইডার', 'মাইক্রোবাস ও হাইয়েস চালক', 'দৈনিক / ট্রিপ ভিত্তিক ড্রাইভার', 'অ্যাম্বুলেন্স / পিকআপ চালক']
  },
  'tutor': {
    id: 'tutor',
    label: 'গৃহশিক্ষক ও টিউটর',
    englishLabel: 'Home Tutor',
    icon: GraduationCap,
    allowPublicPost: true,
    group: 'education_it',
    groupLabel: 'শিক্ষা ও প্রশিক্ষণ',
    badge: 'টিউশন / কোচিং',
    subcategories: ['১ম - ৫ম শ্রেণি অল সাবজেক্ট', '৬ষ্ঠ - ৮ম শ্রেণি ম্যাথ/সায়েন্স', 'এসএসসি (বিজ্ঞান/বাণিজ্য/মানবিক)', 'এইচএসসি পদার্থ/রসায়ন/গণিত', 'ইংরেজি স্পোকেন ও গ্রামার', 'মাদরাসা ও কোরআন শিক্ষা']
  },
  'mason': {
    id: 'mason',
    label: 'রাজমিস্ত্রি ও কনস্ট্রাকশন',
    englishLabel: 'Mason & Construction',
    icon: Hammer,
    allowPublicPost: true,
    group: 'tech_handyman',
    groupLabel: 'নির্মাণ ও মিস্ত্রি',
    badge: 'বাড়ি নির্মাণ / টাইলস',
    subcategories: ['ভবন নির্মাণ ও ছাদ ঢালাই', 'টাইলস ও মার্বেল ফিটিংস', 'প্লাস্টার ও ওয়াল গাথুনি', 'বাথরুম ও কিচেন রেনোভেশন', 'রং ও পুটিং এর কাজ']
  },
  'mobile-maker': {
    id: 'mobile-maker',
    label: 'মোবাইল মেকার ও মেরামত',
    englishLabel: 'Mobile Servicing',
    icon: Smartphone,
    allowPublicPost: true,
    group: 'tech_handyman',
    groupLabel: 'কারিগরি মেরামত',
    badge: 'ডিসপ্লে / সফটওয়্যার',
    subcategories: ['ডিসপ্লে ও টাচ গ্লাস পরিবর্তন', 'মাদারবোর্ড ও ডেড ফোন রিকভারি', 'সফটওয়্যার, ফ্ল্যাশ ও লক রিমুভ', 'চার্জিং পোর্ট ও ব্যাটারি রিপ্লেস', 'ওয়াটার ড্যামেজ ফোন রিপেয়ার']
  },
  'car-repair': {
    id: 'car-repair',
    label: 'গাড়ি গ্যারেজ ও অটো রিপেয়ার',
    englishLabel: 'Auto Garage & Repair',
    icon: Wrench,
    allowPublicPost: true,
    group: 'transport',
    groupLabel: 'যানবাহন ও মেরামত',
    badge: 'গাড়ি ও বাইক গ্যারেজ',
    subcategories: ['প্রাইভেট কার ও জিপ সার্ভিসিং', 'মোটরসাইকেল টিউনিং ও ইঞ্জিন কাজ', 'অটো ডেন্টিং ও পেইন্টিং', 'হুইল অ্যালাইনমেন্ট ও টায়ার', 'ব্যাটারি ও অটো ইলেকট্রিক']
  },
  'car-rental': {
    id: 'car-rental',
    label: 'রেন্ট-এ-কার ও গাড়ি ভাড়া',
    englishLabel: 'Car Rental',
    icon: Car,
    allowPublicPost: true,
    group: 'transport',
    groupLabel: 'যাতায়াত ও ভ্রমণ',
    badge: 'মাইক্রোবাস / প্রাইভেট কার',
    subcategories: ['হাইয়েস ও নোয়া মাইক্রোবাস ভাড়া', 'প্রাইভেট কার ও সেডান ভাড়া', 'অ্যাম্বুলেন্স ও রোগী পরিবহন', 'পিকআপ ও ট্রাক ভাড়া', 'বিয়ে ও ইভেন্ট গাড়ি বুকিং']
  },
  'hardware': {
    id: 'hardware',
    label: 'হার্ডওয়্যার ও পেইন্ট মিস্ত্রি',
    englishLabel: 'Hardware & Paint',
    icon: Hammer,
    allowPublicPost: true,
    group: 'tech_handyman',
    groupLabel: 'মিস্ত্রি ও পণ্য',
    badge: 'পেইন্ট / রঙ / স্যানিটারি',
    subcategories: ['বিল্ডিং পেইন্ট ও পুটিং কাজ', 'হার্ডওয়্যার ও টুলস সরবরাহ', 'গ্রিল ও থাই অ্যালুমিনিয়াম কাজ', 'দরজা ও লক ফিটিংস']
  },
  'furniture': {
    id: 'furniture',
    label: 'আসবাবপত্র ও কাঠমিস্ত্রি',
    englishLabel: 'Furniture & Carpentry',
    icon: Sofa,
    allowPublicPost: true,
    group: 'daily_needs',
    groupLabel: 'আসবাবপত্র ও ডেকোর',
    badge: 'কাঠমিস্ত্রি / ফার্নিচার শপ',
    subcategories: ['খাট, আলমারি ও ওয়ারড্রব তৈরি', 'সোফা ও ডাইনিং টেবিল মেরামত', 'অফিস ক্যাবিনেট ও ইন্টেরিয়র কাজ', 'কাঠের পলিশ ও বার্নিশ']
  },
  'food': {
    id: 'food',
    label: 'রেস্টুরেন্ট ও খাবার',
    englishLabel: 'Food & Restaurants',
    icon: UtensilsCrossed,
    allowPublicPost: true,
    group: 'daily_needs',
    groupLabel: 'খাবার ও ক্যাটারিং',
    badge: 'মিষ্টি / ক্যাফে / খাবার',
    subcategories: ['ঐতিহ্যবাহী তিলের খাজা ও মিষ্টি', 'বিরিয়ানি, খিচুড়ি ও কাচ্চি', 'ফাস্টফুড ও ক্যাফে আইটেম', 'হোমমেড কেক ও খাবার ডেলিভারি', 'পারিবারিক খাবার মেনু']
  },
  'grocery': {
    id: 'grocery',
    label: 'মুদি ও ডিপার্টমেন্টাল শপ',
    englishLabel: 'Grocery Store',
    icon: ShoppingBag,
    allowPublicPost: true,
    group: 'daily_needs',
    groupLabel: 'নিত্যপণ্য',
    badge: 'চাল / ডাল / নিত্যপ্রয়োজনীয়',
    subcategories: ['চাল, ডাল, তেল ও মশলা', 'প্যাকেটজাত খাবার ও স্ন্যাক্স', 'কসমেটিকস ও টয়লেট্রিজ', 'হোম ডেলিভারি মুদি বাজার']
  },
  'vegetables': {
    id: 'vegetables',
    label: 'কাঁচাবাজার ও ফলমূল',
    englishLabel: 'Vegetables & Fruits',
    icon: Apple,
    allowPublicPost: true,
    group: 'daily_needs',
    groupLabel: 'কাঁচাবাজার',
    badge: 'তাজা শাকসবজি / ফল',
    subcategories: ['টাটকা শাকসবজি ও আলু-পেঁয়াজ', 'মৌসুমি দেশি ও বিদেশি ফল', 'মাছ ও মাংসের অর্ডার', 'পাইকারি কাঁচাবাজার দর']
  },
  'beauty-parlor': {
    id: 'beauty-parlor',
    label: 'বিউটি পার্লার ও সেলুন',
    englishLabel: 'Beauty Parlour & Salon',
    icon: Scissors,
    allowPublicPost: true,
    group: 'daily_needs',
    groupLabel: 'রূপচর্চা ও সেলুন',
    badge: 'ব্রাইডাল / হেয়ারকাট / রূপচর্চা',
    subcategories: ['ব্রাইডাল ও পার্টি মেকআপ', 'হেয়ার কাট ও স্পা ট্রিটমেন্ট', 'ফেশিয়াল ও স্কিন কেয়ার', 'জেন্টস প্রিমিয়াম হেয়ারকাটিং']
  },
  'laundry': {
    id: 'laundry',
    label: 'লন্ড্রি ও ড্রাই ওয়াশ',
    englishLabel: 'Laundry & Dry Wash',
    icon: Shirt,
    allowPublicPost: true,
    group: 'daily_needs',
    groupLabel: 'পরিচ্ছন্নতা',
    badge: 'ড্রাই ক্লিনিং / ইস্ত্রি',
    subcategories: ['স্যুট ও ব্লেজার ড্রাই ওয়াশ', 'শাড়ি ও লেহেঙ্গা ক্লিনিং', 'কম্বল ও চাদর ওয়াশ', 'দ্রুত আয়রন ও প্রেস ডেলিভারি']
  },
  'computer-print': {
    id: 'computer-print',
    label: 'কম্পিউটার ও প্রিন্টিং সেবা',
    englishLabel: 'Computer & Printing',
    icon: Printer,
    allowPublicPost: true,
    group: 'education_it',
    groupLabel: 'আইটি ও প্রিন্টিং',
    badge: 'কম্পোজ / কালার প্রিন্ট',
    subcategories: ['অনলাইন আবেদন ও ফরম পূরণ', 'ফটোস্ট্যাট ও কালার প্রিন্টিং', 'ব্যানার, পোস্টার ও ভিজিটিং কার্ড', 'সিভি ও বায়োডাটা তৈরি', 'আইডি কার্ড ও লেমিনেটিং']
  },
  'freelancing': {
    id: 'freelancing',
    label: 'ফ্রিল্যান্সার ও ডিজিটাল সেবা',
    englishLabel: 'Freelancing & Digital',
    icon: Laptop,
    allowPublicPost: true,
    group: 'education_it',
    groupLabel: 'তথ্যপ্রযুক্তি',
    badge: 'ওয়েব / গ্রাফিক্স / ডিজিটাল',
    subcategories: ['ওয়েবসাইট ও ওয়েব অ্যাপ তৈরি', 'গ্রাফিক্স ডিজাইন ও লোগো মেকিং', 'ডিজিটাল মার্কেটিং ও ফেসবুক বুস্ট', 'ভিডিও এডিটিং ও কন্টেন্ট', 'ডাটা এন্ট্রি ও টাইপিং']
  },
  'business-directory': {
    id: 'business-directory',
    label: 'ব্যবসা ও দোকান প্রচার',
    englishLabel: 'Business Directory',
    icon: Landmark,
    allowPublicPost: true,
    group: 'business_finance',
    groupLabel: 'ব্যবসা বাণিজ্য',
    badge: 'শোরুম / প্রতিষ্ঠান প্রচার',
    subcategories: ['পোশাক ও ক্লথিং শোরুম', 'জুয়েলারি ও স্বর্ণের দোকান', 'ইলেকট্রনিক্স ও হোম অ্যাপ্লায়েন্স', 'পাইকারি আড়ত ও বাণিজ্যিক প্রতিষ্ঠান', 'নতুন শোরুম উদ্বোধন অফার']
  },
  'hotel': {
    id: 'hotel',
    label: 'আবাসিক হোটেল ও গেস্ট হাউস',
    englishLabel: 'Hotels & Accommodation',
    icon: Hotel,
    allowPublicPost: true,
    group: 'transport',
    groupLabel: 'হোটেল ও থাকার জায়গা',
    badge: 'রুম বুকিং / গেস্ট হাউস',
    subcategories: ['ভিআইপি এসি রুম বুকিং', 'নন-এসি বাজেট রুম', 'ফ্যামিলি স্যুট ও গেস্ট হাউস', 'কর্পোরেট মিটিং রুম ও হল']
  },
  'residential-hotel': {
    id: 'residential-hotel',
    label: 'আবাসিক হোটেল সেবা',
    englishLabel: 'Residential Hotel Service',
    icon: Building,
    allowPublicPost: true,
    group: 'transport',
    groupLabel: 'হোটেল ও থাকার জায়গা',
    badge: 'আবাসন ও গেস্টহাউস',
    subcategories: ['এসি রুম ও ভিআইপি স্যুট', 'নন-এসি বাজেট রুম', 'ফ্যামিলি হোটেল ও গেস্টহাউস', 'বুকিং ও যোগাযোগ']
  },
  'fitness': {
    id: 'fitness',
    label: 'জিম ও ফিটনেস সেন্টার',
    englishLabel: 'Gym & Fitness',
    icon: Dumbbell,
    allowPublicPost: true,
    group: 'daily_needs',
    groupLabel: 'স্বাস্থ্য ও ফিটনেস',
    badge: 'বডি বিল্ডিং / অ্যারোবিক্স',
    subcategories: ['জিম মেম্বারশিপ ও অফার', 'লেডিস স্পেশাল শিফট ও ট্রেইনার', 'ওয়েট লস ও বডি ট্রান্সফর্মেশন', 'পার্সোনাল ফিটনেস কোচ']
  },
  'sports': {
    id: 'sports',
    label: 'খেলাধুলার সরঞ্জাম ও ক্লাব',
    englishLabel: 'Sports & Equipment',
    icon: Trophy,
    allowPublicPost: true,
    group: 'daily_needs',
    groupLabel: 'খেলাধুলা',
    badge: 'ক্রিকেট / ফুটবল / সরঞ্জাম',
    subcategories: ['ক্রিকেট ব্যাট ও বল সামগ্রী', 'জার্সি ও টিম কিট কাস্টমাইজ', 'ব্যাডমিন্টন ও টেবিল টেনিস', 'স্পোর্টস টুর্নামেন্ট আয়োজন']
  },
  'legal': {
    id: 'legal',
    label: 'আইনি সহায়তা ও দলিল লেখক',
    englishLabel: 'Legal Aid & Deed Writers',
    icon: Scale,
    allowPublicPost: true,
    group: 'govt',
    groupLabel: 'আইন ও আদালত',
    badge: 'অ্যাডভোকেট / চেম্বার',
    subcategories: ['জমি-জমা ও দলিল রেজিস্ট্রি পরামর্শ', 'দেওয়ানি ও ফ্যামিলি কোর্ট মামলা', 'ফৌজদারি মামলা ও জামিন আবেদন', 'হলফনামা ও নোটারি পাবলিক']
  },
  'events': {
    id: 'events',
    label: 'অনুষ্ঠান, ডেকোরেটর ও ক্যাটারিং',
    englishLabel: 'Events & Decorator',
    icon: PartyPopper,
    allowPublicPost: true,
    group: 'daily_needs',
    groupLabel: 'অনুষ্ঠান ও উৎসব',
    badge: 'কমিউনিটি সেন্টার / ডেকোরেশন',
    subcategories: ['বিয়ে ও সুন্নতে খাৎনা ডেকোরেশন', 'কমিউনিটি সেন্টার বুকিং', 'ক্যাটারিং ও বাবুর্চি সার্ভিস', 'সাউন্ড সিস্টেম ও আলোকসজ্জা', 'ফটোগ্রাফি ও সিনেমাটোগ্রাফি']
  },
  'vet': {
    id: 'vet',
    label: 'পশু চিকিৎসক ও খামার সেবা',
    englishLabel: 'Veterinary Care',
    icon: Dog,
    allowPublicPost: true,
    group: 'daily_needs',
    groupLabel: 'প্রাণিসম্পদ ও খামার',
    badge: 'গরু / ছাগল / পোষা প্রাণী',
    subcategories: ['গরু ও ডেইরি খামার চিকিৎসা', 'হাঁস-মুরগি ও ব্রয়লার খামার', 'বিড়াল ও পোষা প্রাণীর চিকিৎসা', 'টিকা ও কৃমিনাশক প্রদান', 'কৃত্রিম প্রজনন ও পরামর্শ']
  },
  'crime-reporter': {
    id: 'crime-reporter',
    label: 'অপরাধ ও তথ্য ডেস্ক',
    englishLabel: 'Crime Reporter',
    icon: AlertTriangle,
    allowPublicPost: true,
    group: 'emergency',
    groupLabel: 'নাগরিক সুরক্ষা',
    badge: '১০০% গোপনীয় রিপোর্ট',
    subcategories: ['মাদক ব্যবসা ও চোরাচালান', 'চাঁদাবাজি ও দখলদারি', 'ছিনতাই ও চুরির তথ্য', 'দুর্নীতি ও ঘুষের প্রমাণ', 'ইভটিজিং ও নারীদের নিরাপত্তা', 'জনদুর্ভোগ ও অবৈধ কর্মকাণ্ড']
  },

  // ==========================================
  // ২. শুধুমাত্র এডমিন পোস্ট / অফিসিয়াল ডিরেক্টরি (ADMIN-ONLY SERVICES)
  // সাধারণ ব্যবহারকারী সরাসরি পোস্ট করতে পারবেন না, কারণ এগুলো অফিসিয়াল তথ্য
  // ==========================================
  'police': {
    id: 'police',
    label: 'পুলিশ ও থানা',
    englishLabel: 'Police Station',
    icon: Shield,
    allowPublicPost: false,
    group: 'emergency',
    groupLabel: 'আইনশৃঙ্খলা ও নিরাপত্তা',
    badge: '🔒 শুধুমাত্র এডমিন',
    adminOnlyReason: 'এটি বাংলাদেশ পুলিশের অফিশিয়াল থানা ও কর্মকর্তাদের যোগাযোগ ডিরেক্টরি। বিভ্রান্তি রোধে শুধুমাত্র ভেরিফাইড এডমিন তথ্য যুক্ত বা হালনাগাদ করতে পারেন।',
    subcategories: ['থানার ওসির নম্বর', 'ডিউটি অফিসার হেল্পলাইন', 'ট্রাফিক ফাঁড়ি', 'কন্ট্রোল রুম', 'সার্কেল এসপি অফিস']
  },
  'fire-service': {
    id: 'fire-service',
    label: 'ফায়ার সার্ভিস ও সিভিল ডিফেন্স',
    englishLabel: 'Fire Service',
    icon: Flame,
    allowPublicPost: false,
    group: 'emergency',
    groupLabel: 'জরুরি উদ্ধার ও অগ্নিনির্বাপণ',
    badge: '🔒 শুধুমাত্র এডমিন',
    adminOnlyReason: 'জরুরি অগ্নিনির্বাপণ ও উদ্ধারকারী দলের অফিশিয়াল নম্বর ও স্টেশন তথ্য কেবল এডমিন নিয়ন্ত্রণ করেন।',
    subcategories: ['দমকল স্টেশন কুষ্টিয়া সদর', 'কুমারখালী ফায়ার স্টেশন', 'ভেড়ামারা ফায়ার স্টেশন', 'মিরপুর ফায়ার স্টেশন', 'খোকসা ফায়ার স্টেশন', 'দৌলতপুর ফায়ার স্টেশন']
  },
  'emergency': {
    id: 'emergency',
    label: 'জরুরি জাতীয় হেল্পলাইন',
    englishLabel: 'National Emergency',
    icon: PhoneCall,
    allowPublicPost: false,
    group: 'emergency',
    groupLabel: 'জাতীয় জরুরি সেবা',
    badge: '🔒 শুধুমাত্র এডমিন',
    adminOnlyReason: 'জাতীয় জরুরি সেবা ও সরকারি টোল-ফ্রি নম্বর কেবল অনুমোদিত এডমিন প্রকাশ ও পরিবর্তন করতে পারেন।',
    subcategories: ['জরুরি সেবা ৯৯৯', 'সরকারি তথ্য সেবা ৩৩৩', 'নারী ও শিশু নির্যাতন ১০৯', 'দুদক হটলাইন ১০৬', 'জাতীয় পরিচয়পত্র ১০৫', 'দুর্যোগের আগাম বার্তা ১০৯০']
  },
  'blood': {
    id: 'blood',
    label: 'জরুরি রক্তদান ও ব্লাড ব্যাংক',
    englishLabel: 'Blood Bank & Donors',
    icon: Droplet,
    allowPublicPost: false,
    group: 'health',
    groupLabel: 'রক্তদান ও সেবা',
    badge: '🔒 শুধুমাত্র এডমিন',
    adminOnlyReason: 'রক্তের দালাল ও ভুয়া রক্তের আবেদন রুখতে ব্লাড ব্যাংক ও ভেরিফাইড আবেদন শুধুমাত্র এডমিন ও মডারেটর পরিচালনা করেন।',
    subcategories: ['কুষ্টিয়া জেনারেল হাসপাতাল ব্লাড ব্যাংক', 'সন্ধানী কুষ্টিয়া মেডিকেল ইউনিট', 'রেড ক্রিসেন্ট ব্লাড সেন্টার', 'ভেরিফাইড জরুরি রক্ত আবেদন']
  },
  'blood-request': {
    id: 'blood-request',
    label: 'ভেরিফাইড রক্তের আবেদন',
    englishLabel: 'Verified Blood Request',
    icon: Droplet,
    allowPublicPost: false,
    group: 'health',
    groupLabel: 'রক্তদান',
    badge: '🔒 শুধুমাত্র এডমিন',
    adminOnlyReason: 'রক্তের অপব্যবহার ঠেকাতে এডমিন যাচাইয়ের পর পোস্ট করেন।',
    subcategories: ['A+ রক্ত প্রয়োজন', 'B+ রক্ত প্রয়োজন', 'O+ রক্ত প্রয়োজন', 'AB+ রক্ত প্রয়োজন', 'নেগেটিভ গ্রুপের জরুরি রক্ত']
  },
  'hospital': {
    id: 'hospital',
    label: 'হাসপাতাল ও ক্লিনিক ডিরেক্টরি',
    englishLabel: 'Hospitals & Clinics',
    icon: Building,
    allowPublicPost: false,
    group: 'health',
    groupLabel: 'হাসপাতাল ও সেবা',
    badge: '🔒 শুধুমাত্র এডমিন',
    adminOnlyReason: 'সরকারি ও স্বাস্থ্য অধিদপ্তর অনুমোদিত হাসপাতাল এবং জরুরি বিভাগের সঠিক তথ্য কেবল এডমিন সংরক্ষণ করেন।',
    subcategories: ['২৫০ শয্যা বিশিষ্ট জেনারেল হাসপাতাল', 'উপজেলা স্বাস্থ্য কমপ্লেক্স', 'মা ও শিশু কল্যাণ কেন্দ্র', 'অনুমোদিত বেসরকারি ক্লিনিক']
  },
  'doctor': {
    id: 'doctor',
    label: 'ডাক্তার ও বিশেষজ্ঞ চেম্বার',
    englishLabel: 'Doctors & Specialists',
    icon: Stethoscope,
    allowPublicPost: false,
    group: 'health',
    groupLabel: 'চিকিৎসক তালিকা',
    badge: '🔒 শুধুমাত্র এডমিন',
    adminOnlyReason: 'বিএমডিসি রেজিস্টার্ড ডাক্তার ও হাসপাতালের চেম্বার শিডিউল নির্ভুল রাখতে এডমিন প্যানেল থেকে প্রকাশ করা হয়।',
    subcategories: ['মেডিসিন বিশেষজ্ঞ', 'হৃদরোগ ও কার্ডিওলজি', 'গাইনি ও প্রসূতি বিশেষজ্ঞ', 'শিশু রোগ বিশেষজ্ঞ', 'অর্থোপেডিক ও ট্রমা', 'সার্জারি বিশেষজ্ঞ']
  },
  'eye-care': {
    id: 'eye-care',
    label: 'চক্ষু হাসপাতাল ও আই কেয়ার',
    englishLabel: 'Eye Hospital & Care',
    icon: Eye,
    allowPublicPost: false,
    group: 'health',
    groupLabel: 'চক্ষু চিকিৎসা',
    badge: '🔒 শুধুমাত্র এডমিন',
    adminOnlyReason: 'চক্ষু হাসপাতাল ও অনুমোদিত চক্ষু বিশেষজ্ঞদের তালিকা এডমিন কর্তৃক পরিচালিত।',
    subcategories: ['চক্ষু হাসপাতাল কুষ্টিয়া', 'অপারেশন ও লেন্স প্রতিস্থাপন', 'জরুরি চক্ষু পরীক্ষা কেন্দ্র']
  },
  'dental-care': {
    id: 'dental-care',
    label: 'ডেন্টাল ক্লিনিক ও ডেন্টিস্ট',
    englishLabel: 'Dental Care',
    icon: Smile,
    allowPublicPost: false,
    group: 'health',
    groupLabel: 'দন্ত চিকিৎসা',
    badge: '🔒 শুধুমাত্র এডমিন',
    adminOnlyReason: 'অনুমোদিত বিডিএস ডেন্টিস্ট এবং ডেন্টাল ক্লিনিক তালিকা এডমিন কর্তৃক হালনাগাদ করা হয়।',
    subcategories: ['রুট ক্যানেল ও ফিলিং', 'দাঁতের স্কেলিং ও পলিশিং', 'দাঁত তোলা ও সার্জারি', 'অর্থোডন্টিক চিকিৎসা']
  },
  'govt-office': {
    id: 'govt-office',
    label: 'সরকারি দপ্তর ও কর্মকর্তা',
    englishLabel: 'Govt Offices',
    icon: Building,
    allowPublicPost: false,
    group: 'govt',
    groupLabel: 'প্রশাসন ও সরকারি দপ্তর',
    badge: '🔒 শুধুমাত্র এডমিন',
    adminOnlyReason: 'ডিসি অফিস, ইউএনও, এসিল্যান্ড ও সরকারি দপ্তরের অফিসিয়াল নম্বর শুধু এডমিন পরিচালনা করেন।',
    subcategories: ['জেলা প্রশাসকের কার্যালয় (ডিসি)', 'উপজেলা নির্বাহী অফিস (ইউএনও)', 'সহকারী কমিশনার (ভূমি)', 'জেলা পরিষদ ও এলজিইডি']
  },
  'land-office': {
    id: 'land-office',
    label: 'ভূমি ও সাব-রেজিস্ট্রি অফিস',
    englishLabel: 'Land Office & Registry',
    icon: FileText,
    allowPublicPost: false,
    group: 'govt',
    groupLabel: 'ভূমি ও নাগরিক সেবা',
    badge: '🔒 শুধুমাত্র এডমিন',
    adminOnlyReason: 'খতিয়ান, নামজারি ও সাব-রেজিস্ট্রার অফিসের অফিশিয়াল সিটিজেন চার্টার ও হেল্পডেস্ক তথ্য এডমিন কর্তৃক পোস্ট করা হয়।',
    subcategories: ['উপজেলা ভূমি অফিস (এসিল্যান্ড)', 'ইউনিয়ন ভূমি অফিস (তহশিল)', 'সাব-রেজিস্ট্রি অফিস দলিল শাখা', 'ভূমি উন্নয়ন কর ও ই-নামজারি']
  },
  'municipality': {
    id: 'municipality',
    label: 'পৌরসভা ও সিটি সেবা',
    englishLabel: 'Municipality Services',
    icon: Landmark,
    allowPublicPost: false,
    group: 'govt',
    groupLabel: 'পৌরসভা ও নগর সেবা',
    badge: '🔒 শুধুমাত্র এডমিন',
    adminOnlyReason: 'পৌরসভার মেয়র, কাউন্সিলর, হোল্ডিং ট্যাক্স ও ট্রেড লাইসেন্স শাখার অফিশিয়াল তথ্য এডমিন কর্তৃক প্রকাশিত।',
    subcategories: ['পৌরসভা হেল্পডেস্ক', 'পৌর পানি সরবরাহ শাখা', 'রাস্তার বাতি ও পরিচ্ছন্নতা', 'ট্রেড লাইসেন্স শাখা']
  },
  'union-parishad': {
    id: 'union-parishad',
    label: 'ইউনিয়ন পরিষদ সেবা',
    englishLabel: 'Union Parishad Services',
    icon: Building,
    allowPublicPost: false,
    group: 'govt',
    groupLabel: 'স্থানীয় সরকার',
    badge: '🔒 শুধুমাত্র এডমিন',
    adminOnlyReason: 'ইউনিয়ন পরিষদের চেয়ারম্যান, সচিব, নাগরিক সনদ ও ওয়ারিশান সনদের অফিশিয়াল তথ্য এডমিন কর্তৃক প্রকাশিত।',
    subcategories: ['ইউপি চেয়ারম্যান ও সচিব অফিস', 'নাগরিক সনদ ও ওয়ারিশান', 'ভিজিডি ও সামাজিক নিরাপত্তা', 'ইউপি উদ্যোক্তা ও ডিজিটাল সেন্টার']
  },
  'passport-visa': {
    id: 'passport-visa',
    label: 'পাসপোর্ট ও ভিসা সংক্রান্ত তথ্য',
    englishLabel: 'Passport & Visa',
    icon: Plane,
    allowPublicPost: false,
    group: 'govt',
    groupLabel: 'পাসপোর্ট ও ভ্রমণ নথি',
    badge: '🔒 শুধুমাত্র এডমিন',
    adminOnlyReason: 'আঞ্চলিক পাসপোর্ট অফিসের অফিশিয়াল নিয়মাবলী ও হেল্পলাইন শুধু এডমিন ম্যানেজ করেন।',
    subcategories: ['আঞ্চলিক পাসপোর্ট অফিস কুষ্টিয়া', 'ই-পাসপোর্ট আবেদন গাইড', 'পাসপোর্ট ডেলিভারি ও অনুসন্ধান']
  },
  'birth-death': {
    id: 'birth-death',
    label: 'জন্ম ও মৃত্যু নিবন্ধন সহায়তা',
    englishLabel: 'Birth & Death Registration',
    icon: FileSignature,
    allowPublicPost: false,
    group: 'govt',
    groupLabel: 'নিবন্ধন ও নাগরিক সনদ',
    badge: '🔒 শুধুমাত্র এডমিন',
    adminOnlyReason: 'সরকারি জন্ম-মৃত্যু নিবন্ধন বিধিমালা ও অফিস তালিকা অফিশিয়াল তথ্যের অন্তর্ভুক্ত।',
    subcategories: ['পৌরসভা জন্ম নিবন্ধন শাখা', 'ইউনিয়ন পরিষদ জন্ম সনদ শাখা', 'জন্ম সনদ সংশোধন প্রক্রিয়া']
  },
  'nid-voter': {
    id: 'nid-voter',
    label: 'জাতীয় পরিচয়পত্র ও ভোটার সেবা',
    englishLabel: 'NID & Voter Services',
    icon: UserCheck,
    allowPublicPost: false,
    group: 'govt',
    groupLabel: 'নির্বাচন কমিশন ও এনআইডি',
    badge: '🔒 শুধুমাত্র এডমিন',
    adminOnlyReason: 'জেলা নির্বাচন অফিস ও এনআইডি কার্ড সংশোধন হেল্পডেস্ক তথ্য কেবল এডমিন নিয়ন্ত্রণ করেন।',
    subcategories: ['জেলা নির্বাচন অফিস', 'উপজেলা নির্বাচন অফিস', 'নতুন ভোটার অন্তর্ভুক্তি ও স্থানান্তর', 'এনআইডি সংশোধন ও ডুপ্লিকেট উত্তোলন']
  },
  'bank-atm': {
    id: 'bank-atm',
    label: 'ব্যাংক ও এটিএম বুথ',
    englishLabel: 'Banks & ATM Booths',
    icon: Landmark,
    allowPublicPost: false,
    group: 'business_finance',
    groupLabel: 'ব্যাংকিং ও ফাইন্যান্স',
    badge: '🔒 শুধুমাত্র এডমিন',
    adminOnlyReason: 'আর্থিক জালিয়াতি ও প্রতারণা রোধে ব্যাংক শাখা ও এটিএম বুথের ঠিকানা/নম্বর কেবল এডমিন যোগ করতে পারেন।',
    subcategories: ['সোনালী, রূপালী, অগ্রণী ও জনতা ব্যাংক', 'ইসলামী ব্যাংক বাংলাদেশ লিমিটেড', 'ডাচ-বাংলা ব্যাংক ও ফাস্ট ট্র্যাক', 'ব্র্যাক, সিটি ও ইবিএল এটিএম বুথ']
  },
  'mobile-banking': {
    id: 'mobile-banking',
    label: 'মোবাইল ব্যাংকিং ডিলার ও কাস্টমার কেয়ার',
    englishLabel: 'Mobile Banking Center',
    icon: Wallet,
    allowPublicPost: false,
    group: 'business_finance',
    groupLabel: 'মোবাইল ফিন্যান্সিয়াল সার্ভিস',
    badge: '🔒 শুধুমাত্র এডমিন',
    adminOnlyReason: 'বিকাশ, নগদ ও রকেটের অফিশিয়াল কাস্টমার কেয়ার সেন্টার তথ্য এডমিন কর্তৃক ভেরিফাইড থাকে।',
    subcategories: ['বিকাশ কাস্টমার সার্ভিস পয়েন্ট', 'নগদ সেবা কেন্দ্র', 'রকেট ও নেক্সাসপে হেল্পপয়েন্ট']
  },
  'courier': {
    id: 'courier',
    label: 'কুরিয়ার ও পার্সেল সার্ভিস',
    englishLabel: 'Courier Services',
    icon: Package,
    allowPublicPost: false,
    group: 'business_finance',
    groupLabel: 'কুরিয়ার ও পার্সেল',
    badge: '🔒 শুধুমাত্র এডমিন',
    adminOnlyReason: 'সুন্দরবন, এসএ পরিবহন, করাতোয়া ও রেডএক্স এর অফিশিয়াল ব্রাঞ্চ নম্বর এডমিন সংরক্ষণ করেন।',
    subcategories: ['সুন্দরবন কুরিয়ার সার্ভিস শাখা', 'এসএ পরিবহন পার্সেল', 'করতোয়া কুরিয়ার', 'ইউএসবি ও পেপারফ্লাই হাব']
  },
  'bus-train': {
    id: 'bus-train',
    label: 'বাস ও ট্রেন কাউন্টার ও সময়সূচি',
    englishLabel: 'Bus & Train Schedule',
    icon: Train,
    allowPublicPost: false,
    group: 'transport',
    groupLabel: 'গণপরিবহন ও রেল',
    badge: '🔒 শুধুমাত্র এডমিন',
    adminOnlyReason: 'কুষ্টিয়া রেলওয়ে স্টেশন, এসবি সুপার ডিলাক্স ও দূরপাল্লার বাসের অফিশিয়াল সময়সূচি এডমিন পরিচালনা করেন।',
    subcategories: ['কুষ্টিয়া কোর্ট রেলওয়ে স্টেশন', 'পোড়াদহ জংশন সময়সূচি', 'ঢাকা-কুষ্টিয়া বাস কাউন্টার (এসবি, শ্যামলী, গ্রিনলাইন)', 'খুলনা ও রাজশাহী রুটের বাস কাউন্টার']
  },
  'tourist-spot': {
    id: 'tourist-spot',
    label: 'দর্শনীয় স্থান ও পর্যটন তথ্য',
    englishLabel: 'Tourist Attractions',
    icon: Landmark,
    allowPublicPost: false,
    group: 'transport',
    groupLabel: 'ঐতিহ্য ও পর্যটন',
    badge: '🔒 শুধুমাত্র এডমিন',
    adminOnlyReason: 'লালন শাহ মাজার, রবীন্দ্রনাথের শিলাইদহ কুঠিবাড়ি ও ঐতিহাসিক দর্শনীয় স্থানের তথ্য এডমিন পরিচালনা করেন।',
    subcategories: ['লালন শাহের মাজার (ছেঁউড়িয়া)', 'শিলাইদহ রবীন্দ্র কুঠিবাড়ি', 'মীর মশাররফ হোসেন স্মৃতি কমপ্লেক্স', 'হার্ডিঞ্জ ব্রিজ ও লালন শাহ সেতু', 'ঝাউদিয়া ঐতিহাসিক শাহী মসজিদ']
  },
  'school-college': {
    id: 'school-college',
    label: 'স্কুল, কলেজ ও মাদ্রাসা ডিরেক্টরি',
    englishLabel: 'Schools & Colleges',
    icon: GraduationCap,
    allowPublicPost: false,
    group: 'education_it',
    groupLabel: 'শিক্ষাপ্রতিষ্ঠান',
    badge: '🔒 শুধুমাত্র এডমিন',
    adminOnlyReason: 'কুষ্টিয়া সরকারি কলেজ, জিলা স্কুল ও অন্যান্য শিক্ষাপ্রতিষ্ঠানের সরকারি ডিরেক্টরি এডমিন নিয়ন্ত্রণ করেন।',
    subcategories: ['কুষ্টিয়া সরকারি কলেজ', 'কুষ্টিয়া জিলা স্কুল', 'কুষ্টিয়া সরকারি বালিকা উচ্চ বিদ্যালয়', 'ইসলামী বিশ্ববিদ্যালয় (ইবি)', 'কুষ্টিয়া পলিটেকনিক ইনস্টিটিউট']
  },
  'education-result': {
    id: 'education-result',
    label: 'শিক্ষাবোর্ড ও পরীক্ষার ফলাফল পোর্টাল',
    englishLabel: 'Education Portal & Results',
    icon: FileText,
    allowPublicPost: false,
    group: 'education_it',
    groupLabel: 'শিক্ষা ও ফলাফল',
    badge: '🔒 শুধুমাত্র এডমিন',
    adminOnlyReason: 'যশোর শিক্ষাবোর্ড ও সরকারি পরীক্ষার ফলাফল সম্পর্কিত অফিশিয়াল পোর্টাল এডমিন কর্তৃক ভেরিফাইড।',
    subcategories: ['যশোর শিক্ষা বোর্ড ফলাফল লিঙ্ক', 'এসএসসি ও এইচএসসি ফলাফল পোর্টাল', 'ডিগ্রি ও অনার্স ভর্তি নির্দেশিকা']
  },
  'internet': {
    id: 'internet',
    label: 'ইন্টারনেট ও ব্রডব্যান্ড আইএসপি',
    englishLabel: 'Broadband Internet',
    icon: Wifi,
    allowPublicPost: false,
    group: 'tech_handyman',
    groupLabel: 'ব্রডব্যান্ড ও নেটওয়ার্ক',
    badge: '🔒 শুধুমাত্র এডমিন',
    adminOnlyReason: 'লাইসেন্সধারী আইএসপি ও ব্রডব্যান্ড সংযোগ প্রদানকারীদের অফিশিয়াল হেল্পলাইন এডমিন কর্তৃক নিয়ন্ত্রিত।',
    subcategories: ['কুষ্টিয়া ক্যাবল ও ইন্টারনেট', 'লিঙ্ক থ্রি কুষ্টিয়া শাখা', 'কার্নিভাল ইন্টারনেট কুষ্টিয়া', 'ডট ইন্টারনেট ও ফাইবার লাইন']
  },
  'utility': {
    id: 'utility',
    label: 'বিদ্যুৎ, গ্যাস ও ওয়াসা অভিযোগ কেন্দ্র',
    englishLabel: 'Utility Services',
    icon: Zap,
    allowPublicPost: false,
    group: 'tech_handyman',
    groupLabel: 'ইউটিলিটি ও বিদ্যুৎ',
    badge: '🔒 শুধুমাত্র এডমিন',
    adminOnlyReason: 'ওজোপাডিকো, কুষ্টিয়া পল্লী বিদ্যুৎ সমিতি ও পানির জরুরি বিদ্যুৎ বিভ্রাট অভিযোগ কেন্দ্র কেবল এডমিন কর্তৃক পরিচালিত।',
    subcategories: ['ওজোপাডিকো কুষ্টিয়া বিদ্যুৎ অভিযোগ কেন্দ্র', 'কুষ্টিয়া পল্লী বিদ্যুৎ সমিতি', 'পৌর পানি সরবরাহ শাখা জরুরি নম্বর', 'এলপিজি গ্যাস ডিলার হটলাইন']
  },
  'agriculture': {
    id: 'agriculture',
    label: 'উপজেলা কৃষি অফিস ও পরামর্শ',
    englishLabel: 'Agriculture Office',
    icon: Sprout,
    allowPublicPost: false,
    group: 'daily_needs',
    groupLabel: 'কৃষি ও সরকারি সেবা',
    badge: '🔒 শুধুমাত্র এডমিন',
    adminOnlyReason: 'কৃষি সম্প্রসারণ অধিদপ্তর ও উপজেলা কৃষি কর্মকর্তার অফিশিয়াল পরামর্শ কেবল এডমিন পোস্ট করেন।',
    subcategories: ['উপজেলা কৃষি কর্মকর্তার কার্যালয়', 'উপসহকারী কৃষি কর্মকর্তা (ইউনিয়ন ব্লক)', 'ধান, ভুট্টা ও তামাক চাষ পরামর্শ', 'সার ও কীটনাশক ডিলার নিয়ন্ত্রণ']
  },
  'fisheries': {
    id: 'fisheries',
    label: 'উপজেলা মৎস্য ও প্রাণিসম্পদ অধিদপ্তর',
    englishLabel: 'Fisheries & Livestock Office',
    icon: Fish,
    allowPublicPost: false,
    group: 'daily_needs',
    groupLabel: 'মৎস্য ও প্রাণিসম্পদ',
    badge: '🔒 শুধুমাত্র এডমিন',
    adminOnlyReason: 'সরকারি মৎস্য অধিদপ্তর ও পশুসম্পদ কর্মকর্তাদের সরকারি যোগাযোগ তথ্য এডমিন কর্তৃক পরিচালিত।',
    subcategories: ['উপজেলা মৎস্য কর্মকর্তার কার্যালয়', 'উপজেলা প্রাণিসম্পদ দপ্তর ও ভেটেরিনারি হাসপাতাল', 'মাছের পোনা ও হ্যাচারি পরামর্শ', 'খামারি প্রণোদনা ও সরকারি সেবা']
  },
  'citizen-fund': {
    id: 'citizen-fund',
    label: 'কুষ্টিয়া সিটিজেন ওয়েলফেয়ার ফান্ড',
    englishLabel: 'Citizen Welfare Fund',
    icon: Heart,
    allowPublicPost: false,
    group: 'emergency',
    groupLabel: 'নাগরিক কল্যাণ তহবিল',
    badge: '🔒 শুধুমাত্র এডমিন',
    adminOnlyReason: 'অসহায় রোগীদের চিকিৎসা অনুদান ও ফান্ড স্বচ্ছ রাখতে কেবল অনুমোদিত এডমিন পোস্ট ও রসিদ প্রকাশ করেন।',
    subcategories: ['জরুরি চিকিৎসা তহবিল', 'অসহায় শিক্ষার্থীর শিক্ষা বৃত্তি', 'শীতবস্ত্র ও প্রাকৃতিক দুর্যোগ ত্রাণ']
  }
};

/**
 * Check if regular public citizens can create posts in this category
 */
export function isCategoryPublicPostable(category: CategoryType | string): boolean {
  const policy = SERVICE_POSTING_POLICIES[category];
  if (!policy) {
    // Default fallback for core or unknown categories: allow if in list
    const publicDefaults = ['house-rent', 'buy-sell', 'jobs', 'lost-found', 'food', 'events', 'electrician', 'plumber', 'driver', 'tutor'];
    return publicDefaults.includes(category);
  }
  return policy.allowPublicPost;
}

/**
 * Check if the given user (based on admin status) is allowed to post in the given category
 */
export function canUserPostInCategory(category: CategoryType | string, isAdmin: boolean): boolean {
  if (isAdmin) return true; // Admins can post in ALL 50 categories
  return isCategoryPublicPostable(category);
}

/**
 * Get all categories where regular public users are allowed to create posts
 */
export function getPublicPostableCategories(): ServicePostingPolicy[] {
  return Object.values(SERVICE_POSTING_POLICIES).filter((c) => c.allowPublicPost);
}

/**
 * Get all categories where only admins are allowed to post
 */
export function getAdminOnlyCategories(): ServicePostingPolicy[] {
  return Object.values(SERVICE_POSTING_POLICIES).filter((c) => !c.allowPublicPost);
}

/**
 * Get categories list for the post form, customized by whether user is admin or citizen
 */
export function getAvailableCategoriesForUser(isAdmin: boolean): {
  publicCategories: ServicePostingPolicy[];
  adminOnlyCategories: ServicePostingPolicy[];
  allAllowedCategories: ServicePostingPolicy[];
} {
  const publicCategories = getPublicPostableCategories();
  const adminOnlyCategories = getAdminOnlyCategories();
  const allAllowedCategories = isAdmin 
    ? [...publicCategories, ...adminOnlyCategories] 
    : publicCategories;

  return {
    publicCategories,
    adminOnlyCategories,
    allAllowedCategories,
  };
}
