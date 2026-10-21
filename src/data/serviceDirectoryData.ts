import { LucideIcon } from 'lucide-react';
import {
  Shield,
  Flame,
  Landmark,
  Wallet,
  Package,
  Printer,
  Laptop,
  FileText,
  Building,
  Plane,
  FileSignature,
  UserCheck,
  Wrench,
  GraduationCap,
  Car,
  Sprout,
  Fish,
  Hotel,
  ShoppingBag,
  Scissors,
  Shirt,
  Sofa,
  Hammer,
  Wifi,
  Eye,
  Smile,
  Dumbbell,
  Trophy,
  Briefcase,
  Stethoscope,
  PhoneCall,
  Droplet,
  HeartHandshake,
  Smartphone,
  Zap,
  Snowflake,
  BookOpen,
  UtensilsCrossed,
  Search,
  Scale,
  ShieldAlert,
  Heart,
  Train,
  MapPin,
  Activity,
  Building2,
  Apple,
  Radio,
  FileQuestion,
  Users
} from 'lucide-react';
import { CategoryType } from '../types';

export type ServiceGroupType =
  | 'emergency'
  | 'govt'
  | 'finance'
  | 'it'
  | 'health'
  | 'transport'
  | 'handyman'
  | 'daily'
  | 'education';

export interface ServiceListingItem {
  id: string;
  title: string;
  subtitle?: string;
  upazila: 'কুষ্টিয়া সদর' | 'কুমারখালী' | 'ভেড়ামারা' | 'মিরপুর' | 'খোকসা' | 'দৌলতপুর' | 'সব উপজেলা';
  address: string;
  phone: string;
  altPhone?: string;
  workingHours?: string;
  badge?: string;
  badgeType?: 'emergency' | 'govt' | 'verified' | 'popular';
  servicesOffered?: string[];
  notes?: string;
  imageUrl?: string;
}

export interface ServiceGuideline {
  step: string;
  desc: string;
}

export interface ServiceDefinition {
  id: CategoryType;
  label: string;
  englishLabel: string;
  tagline: string;
  group: ServiceGroupType;
  groupLabel: string;
  icon: LucideIcon;
  themeColor: {
    text: string;
    bg: string;
    border: string;
    badgeBg: string;
    gradient: string;
  };
  emergencyHotline?: string;
  availableHours: string;
  overview: string;
  guidelines?: ServiceGuideline[];
  onlinePortalUrl?: string;
  onlinePortalTitle?: string;
  listings: ServiceListingItem[];
}

export const SERVICE_GROUPS: { id: 'all' | ServiceGroupType; label: string }[] = [
  { id: 'all', label: 'সকল সেবা' },
  { id: 'emergency', label: 'জরুরি ও নিরাপত্তা' },
  { id: 'govt', label: 'সরকারি দপ্তর' },
  { id: 'finance', label: 'ব্যাংক ও অর্থ' },
  { id: 'health', label: 'স্বাস্থ্য ও চিকিৎসা' },
  { id: 'it', label: 'কম্পিউটার ও আইটি' },
  { id: 'handyman', label: 'মিস্ত্রি ও কারিগরি' },
  { id: 'transport', label: 'যাতায়াত ও ভাড়া' },
  { id: 'education', label: 'শিক্ষা ও ক্যারিয়ার' },
  { id: 'daily', label: 'দৈনন্দিন ও বাজার' },
];

export const ALL_UPAZILAS = [
  'সব উপজেলা',
  'কুষ্টিয়া সদর',
  'কুমারখালী',
  'ভেড়ামারা',
  'মিরপুর',
  'খোকসা',
  'দৌলতপুর',
] as const;

export const SERVICES_DIRECTORY: Record<string, ServiceDefinition> = {
  // 1. পুলিশ
  police: {
    id: 'police',
    label: 'পুলিশ ও থানা',
    englishLabel: 'Police Stations & Helpdesk',
    tagline: 'নিকটস্থ থানা, ওসির মোবাইল নম্বর ও জরুরি ডিউটি অফিসার হটলাইন',
    group: 'emergency',
    groupLabel: 'জরুরি ও নিরাপত্তা',
    icon: Shield,
    themeColor: {
      text: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badgeBg: 'bg-blue-600 text-white',
      gradient: 'from-blue-600 to-indigo-800',
    },
    emergencyHotline: '999',
    availableHours: '২৪ ঘণ্টা খোলা',
    overview:
      'যে কোনো অপরাধ, চুরি, ছিনতাই, আইনি অভিযোগ বা জরুরি পুলিশি সহায়তায় নিকটস্থ থানার ডিউটি অফিসার বা ওসির নম্বরে সরাসরি কল দিন। অনলাইন জিডির মাধ্যমে ঘরে বসেই জিডি করতে পারেন।',
    onlinePortalUrl: 'https://gd.police.gov.bd',
    onlinePortalTitle: 'অনলাইন জিডি পোর্টাল',
    guidelines: [
      { step: 'জরুরি বিপদে', desc: 'সরাসরি জাতীয় হেল্পলাইন ৯৯৯ অথবা ওসির মোবাইল নম্বরে কল দিন।' },
      { step: 'হারানো বিজ্ঞপ্তি / জিডি', desc: 'আইডি কার্ড, পাসপোর্ট, সার্টিফিকেট হারালে অনলাইনে বা সরাসরি থানায় সাধারণ ডায়েরি (GD) করুন।' },
      { step: 'অভিযোগ দায়ের', desc: 'লিখিত অভিযোগ নিয়ে ডিউটি অফিসারকে জমা দিয়ে ডায়েরি নম্বর সংগ্রহ করুন।' },
    ],
    listings: [
      {
        id: 'pol-1',
        title: 'কুষ্টিয়া সদর মডেল থানা',
        upazila: 'কুষ্টিয়া সদর',
        address: 'থানাপাড়া রোড, কুষ্টিয়া সদর',
        phone: '01320-146000',
        altPhone: '01320-146006',
        workingHours: '২৪/৭ ডিউটি অফিসার',
        badge: 'মডেল থানা',
        badgeType: 'emergency',
        servicesOffered: ['জরুরি পুলিশি টহল', 'জিডি এন্ট্রি', 'মামলা ও অভিযোগ গ্রহণ', 'নারী ও শিশু ডেস্ক'],
      },
      {
        id: 'pol-2',
        title: 'কুমারখালী থানা',
        upazila: 'কুমারখালী',
        address: 'কুমারখালী বাজার সংলগ্ন, কুমারখালী',
        phone: '01320-146050',
        altPhone: '01320-146056',
        workingHours: '২৪ ঘণ্টা খোলা',
        badge: 'থানা হটলাইন',
        badgeType: 'emergency',
        servicesOffered: ['আইন-শৃঙ্খলা নিয়ন্ত্রণ', 'তদন্ত', 'পাহারা ও টহল'],
      },
      {
        id: 'pol-3',
        title: 'ভেড়ামারা থানা',
        upazila: 'ভেড়ামারা',
        address: 'ভেড়ামারা বাসস্ট্যান্ড মোড়, ভেড়ামারা',
        phone: '01320-146100',
        altPhone: '01320-146106',
        workingHours: '২৪ ঘণ্টা খোলা',
        badge: 'থানা হটলাইন',
        badgeType: 'emergency',
        servicesOffered: ['জিডি গ্রহণ', 'জরুরি রেসপন্স', 'টহল'],
      },
      {
        id: 'pol-4',
        title: 'মিরপুর থানা',
        upazila: 'মিরপুর',
        address: 'মিরপুর পৌর চত্বর, মিরপুর',
        phone: '01320-146150',
        workingHours: '২৪ ঘণ্টা খোলা',
        badge: 'জরুরি সেবা',
        badgeType: 'emergency',
        servicesOffered: ['অভিযোগ দায়ের', 'তদন্ত ও মামলা'],
      },
      {
        id: 'pol-5',
        title: 'খোকসা থানা',
        upazila: 'খোকসা',
        address: 'খোকসা বাজার রোড, খোকসা',
        phone: '01320-146200',
        workingHours: '২৪ ঘণ্টা খোলা',
        badge: 'থানা',
        badgeType: 'emergency',
        servicesOffered: ['টহল পুলিশ', 'জিডি গ্রহণ'],
      },
      {
        id: 'pol-6',
        title: 'দৌলতপুর থানা',
        upazila: 'দৌলতপুর',
        address: 'দৌলতপুর সদর, কুষ্টিয়া',
        phone: '01320-146250',
        workingHours: '২৪ ঘণ্টা খোলা',
        badge: 'সীমান্তবর্তী থানা',
        badgeType: 'emergency',
        servicesOffered: ['আইন-শৃঙ্খলা রক্ষা', 'জরুরি টহল'],
      },
    ],
  },

  // 2. ফায়ার সার্ভিস
  'fire-service': {
    id: 'fire-service',
    label: 'ফায়ার সার্ভিস ও সিভিল ডিফেন্স',
    englishLabel: 'Fire Service & Civil Defence',
    tagline: 'দমকল স্টেশন, উদ্ধারকারী দল ও ২৪/৭ জরুরি হটলাইন',
    group: 'emergency',
    groupLabel: 'জরুরি ও নিরাপত্তা',
    icon: Flame,
    themeColor: {
      text: 'text-red-700',
      bg: 'bg-red-50',
      border: 'border-red-200',
      badgeBg: 'bg-red-600 text-white',
      gradient: 'from-red-600 to-rose-800',
    },
    emergencyHotline: '16163',
    availableHours: '২৪ ঘণ্টা খোলা',
    overview:
      'আগুন লাগা, সড়ক দুর্ঘটনা, ভবন ধস, গ্যাস সিলিন্ডার লিকেজ বা যে কোনো দুর্যোগে ফায়ার সার্ভিসের স্পেশাল রেসকিউ টিমকে তৎক্ষণাৎ খবর দিন।',
    guidelines: [
      { step: 'আগুন দেখলে', desc: 'শান্ত থাকুন, অবিলম্বে ৯৯৯ অথবা নিকটস্থ ফায়ার কন্ট্রোল রুমে সুনির্দিষ্ট স্থান উল্লেখ করে জানান।' },
      { step: 'গ্যাস বা বিদ্যুতের আগুন', desc: 'পানি ব্যবহার করবেন না, মেইন সুইচ বন্ধ করুন এবং ভেজা বালু বা কার্বন ডাই-অক্সাইড সিলিন্ডার ব্যবহার করুন।' },
    ],
    listings: [
      {
        id: 'fire-1',
        title: 'কুষ্টিয়া ফায়ার সার্ভিস স্টেশন',
        upazila: 'কুষ্টিয়া সদর',
        address: 'মজলমপুর, কুষ্টিয়া সদর',
        phone: '01712-409949',
        altPhone: '02-477782222',
        workingHours: '২৪ ঘণ্টা রেডি',
        badge: 'কেন্দ্রীয় স্টেশন',
        badgeType: 'emergency',
        servicesOffered: ['অগ্নি নির্বাপণ', 'দুর্ঘটনায় উদ্ধার', 'অ্যাম্বুলেন্স সাপোর্ট'],
      },
      {
        id: 'fire-2',
        title: 'কুমারখালী ফায়ার স্টেশন',
        upazila: 'কুমারখালী',
        address: 'উপজেলা পরিষদ রোড, কুমারখালী',
        phone: '01730-002441',
        workingHours: '২৪ ঘণ্টা খোলা',
        badge: 'জরুরি রেসকিউ',
        badgeType: 'emergency',
        servicesOffered: ['অগ্নি নির্বাপণ ও উদ্ধার'],
      },
      {
        id: 'fire-3',
        title: 'ভেড়ামারা ফায়ার স্টেশন',
        upazila: 'ভেড়ামারা',
        address: 'জিকে রোড, ভেড়ামারা',
        phone: '01730-002442',
        workingHours: '২৪ ঘণ্টা খোলা',
        badge: 'রেসকিউ টিম',
        badgeType: 'emergency',
        servicesOffered: ['ফায়ার ও রোড এক্সিডেন্ট উদ্ধার'],
      },
    ],
  },

  // 3. ব্যাংক ও এটিএম
  'bank-atm': {
    id: 'bank-atm',
    label: 'ব্যাংক ও এটিএম',
    englishLabel: 'Banks & ATM Booths',
    tagline: 'স্থানীয় সকল ব্যাংক শাখা, এটিএম বুথ ও কার্ড হেল্পলাইন',
    group: 'finance',
    groupLabel: 'ব্যাংক ও অর্থ',
    icon: Landmark,
    themeColor: {
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      badgeBg: 'bg-emerald-600 text-white',
      gradient: 'from-emerald-600 to-teal-800',
    },
    emergencyHotline: '16216',
    availableHours: 'রবি-বৃহস্পতি ১০:০০ - ০৪:০০ (ATM ২৪/৭)',
    overview:
      'কুষ্টিয়া জেলার সোনালী, ইসলামী, ডাচ-বাংলা, ব্র্যাক, সিটিসহ সকল ব্যাংকের শাখা এবং ২৪ ঘণ্টার সচল এটিএম বুথের অবস্থান ও জরুরি কার্ড ব্লক হেল্পলাইন।',
    guidelines: [
      { step: 'কার্ড আটকে গেলে', desc: 'বুথ ত্যাগ করার আগে সাথে সাথে ব্যাংকের কার্ড হেল্পলাইনে কল করে কার্ড সাময়িক লক করুন।' },
      { step: 'নতুন হিসাব খুলতে', desc: 'জাতীয় পরিচয়পত্র, ২ কপি ছবি ও নমিনির এনআইডিসহ যেকোনো শাখায় যোগাযোগ করুন।' },
    ],
    listings: [
      {
        id: 'bnk-1',
        title: 'সোনালী ব্যাংক পিএলসি - প্রধান শাখা',
        upazila: 'কুষ্টিয়া সদর',
        address: 'এনএস রোড, পাঁচ রাস্তার মোড়, কুষ্টিয়া সদর',
        phone: '02-477781050',
        workingHours: 'রবি-বৃহস্পতি ১০:০০ - ০৪:০০',
        badge: 'সরকারি ব্যাংক',
        badgeType: 'govt',
        servicesOffered: ['সরকারি চালান', 'ট্রেজারি চালন', 'রেমিট্যান্স', 'সঞ্চয়পত্র', '২৪/৭ এটিএম'],
      },
      {
        id: 'bnk-2',
        title: 'ডাচ-বাংলা ব্যাংক (DBBL) ও ফাস্টট্র্যাক',
        upazila: 'কুষ্টিয়া সদর',
        address: 'কলেজ মোড়, সিরাজউদ্দৌলা রোড, কুষ্টিয়া',
        phone: '16216',
        workingHours: 'বুথ ও সিআরএম ২৪ ঘণ্টা খোলা',
        badge: 'টাকা জমা ও উত্তোলন',
        badgeType: 'popular',
        servicesOffered: ['২৪/৭ ক্যাশ ডিপোজিট (CRM)', 'নেক্সাস পে', 'এটিএম বুথ', 'রেমিট্যান্স'],
      },
      {
        id: 'bnk-3',
        title: 'ইসলামী ব্যাংক বাংলাদেশ পিএলসি',
        upazila: 'কুষ্টিয়া সদর',
        address: 'বঙ্গবন্ধু রোড, মজমপুর গেট, কুষ্টিয়া',
        phone: '16259',
        workingHours: '১০:০০ - ০৪:০০',
        badge: 'শাখা ও এটিএম',
        badgeType: 'popular',
        servicesOffered: ['ইসলামী ব্যাংকিং', 'রেমিট্যান্স সেবা', 'হজ ডিপোজিট', 'এটিএম'],
      },
      {
        id: 'bnk-4',
        title: 'ব্র্যাক ব্যাংক কুষ্টিয়া শাখা ও বুথ',
        upazila: 'কুষ্টিয়া সদর',
        address: 'এনএস রোড, থানা মোড় সংলগ্ন',
        phone: '16221',
        workingHours: '১০:০০ - ০৪:০০',
        badge: 'রিটেইল ব্যাংকিং',
        servicesOffered: ['ব্যক্তিগত ঋণ', 'আন্তর্জাতিক কার্ড', 'সিআরএম ডিপোজিট'],
      },
    ],
  },

  // 4. মোবাইল ব্যাংকিং
  'mobile-banking': {
    id: 'mobile-banking',
    label: 'মোবাইল ব্যাংকিং (MFS)',
    englishLabel: 'bKash, Nagad, Rocket Care',
    tagline: 'বিকাশ, নগদ, রকেট কাস্টমার কেয়ার ও এজেন্ট পয়েন্ট',
    group: 'finance',
    groupLabel: 'ব্যাংক ও অর্থ',
    icon: Wallet,
    themeColor: {
      text: 'text-pink-700',
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      badgeBg: 'bg-pink-600 text-white',
      gradient: 'from-pink-600 to-rose-700',
    },
    emergencyHotline: '16247',
    availableHours: 'সকাল ৯:০০ - রাত ৮:০০',
    overview:
      'বিকাশ, নগদ বা রকেট অ্যাকাউন্ট সংক্রান্ত পিন রিসেট, ভুল নম্বরে টাকা চলে যাওয়া, লিমিট সমস্যা বা ফ্রড সংক্রান্ত অভিযোগে কাস্টমার কেয়ারে যোগাযোগ করুন।',
    guidelines: [
      { step: 'পিন গোপন রাখুন', desc: 'বিকাশ বা নগদ কর্মকর্তা কখনো পিন বা ওটিপি চাইবে না। কাউকে পিন দেবেন না।' },
      { step: 'ভুল নম্বরে টাকা গেলে', desc: 'অবিলম্বে সংশ্লিষ্ট এমএফএস হেল্পলাইনে ফোন করে লেনদেন আইডি প্রদান করুন।' },
    ],
    listings: [
      {
        id: 'mfs-1',
        title: 'বিকাশ গ্রাহক সেবা কেন্দ্র (Customer Care)',
        upazila: 'কুষ্টিয়া সদর',
        address: 'মজমপুর গেট, কুষ্টিয়া সদর',
        phone: '16247',
        workingHours: 'সকাল ৯:০০ - সন্ধ্যা ৬:০০ (শনি-বৃহস্পতি)',
        badge: 'অফিসিয়াল কেয়ার',
        badgeType: 'verified',
        servicesOffered: ['পিন রিসেট', 'অ্যাকাউন্ট ভেরিফিকেশন', 'নম্বর পরিবর্তন', 'স্টেটমেন্ট'],
      },
      {
        id: 'mfs-2',
        title: 'নগদ কাস্টমার সাপোর্ট পয়েন্ট',
        upazila: 'কুষ্টিয়া সদর',
        address: 'এনএস রোড, কোর্ট চত্বর সংলগ্ন',
        phone: '16167',
        workingHours: 'সকাল ৯:৩০ - বিকাল ৫:৩০',
        badge: 'অফিসিয়াল নগদ',
        badgeType: 'verified',
        servicesOffered: ['কেওয়াইসি আপডেট', 'পিন পুনরুদ্ধার', 'উদ্যোক্তা সাপোর্ট'],
      },
    ],
  },

  // 5. কুরিয়ার ও পার্সেল
  courier: {
    id: 'courier',
    label: 'কুরিয়ার ও পার্সেল সার্ভিস',
    englishLabel: 'Courier & Parcel Services',
    tagline: 'সুন্দরবন, এসএ পরিবহন, রেডেক্স, স্টিডফাস্ট শাখা ও পার্সেল ট্র্যাকিং',
    group: 'transport',
    groupLabel: 'যাতায়াত ও ভাড়া',
    icon: Package,
    themeColor: {
      text: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      badgeBg: 'bg-amber-600 text-white',
      gradient: 'from-amber-600 to-orange-700',
    },
    availableHours: 'সকাল ৮:০০ - রাত ৯:০০',
    overview:
      'দেশ-বিদেশে চিঠিপত্র, পার্সেল, অনলাইন অর্ডারের ডেলিভারি ও পণ্য বুকিংয়ের জন্য কুষ্টিয়ার শীর্ষস্থানীয় কুরিয়ার শাখাগুলোর নম্বর ও অবস্থান।',
    listings: [
      {
        id: 'cur-1',
        title: 'সুন্দরবন কুরিয়ার সার্ভিস - প্রধান শাখা',
        upazila: 'কুষ্টিয়া সদর',
        address: 'মজমপুর বাসস্ট্যান্ড, কুষ্টিয়া সদর',
        phone: '01711-234567',
        altPhone: '02-477781200',
        workingHours: 'সকাল ৮:৩০ - রাত ৮:৩০',
        badge: 'সারাদেশে ডেলিভারি',
        badgeType: 'popular',
        servicesOffered: ['ডকুমেন্ট ও পার্সেল', 'কন্ডিশন পার্সেল', 'হোম ডেলিভারি'],
      },
      {
        id: 'cur-2',
        title: 'এস. এ পরিবহন কুরিয়ার',
        upazila: 'কুষ্টিয়া সদর',
        address: 'পুরাতন বাসস্ট্যান্ড মোড়, কুষ্টিয়া',
        phone: '01711-987654',
        workingHours: 'সকাল ৯:০০ - রাত ৯:০০',
        badge: 'পার্সেল ও মানি ট্রান্সফার',
        servicesOffered: ['ভারী পার্সেল বুকিং', 'মানি ট্রান্সফার'],
      },
      {
        id: 'cur-3',
        title: 'স্টিডফাস্ট কুরিয়ার হাব (Steadfast)',
        upazila: 'কুষ্টিয়া সদর',
        address: 'কাটাখানা মোড়, কুষ্টিয়া',
        phone: '09678-045045',
        workingHours: 'সকাল ৯:০০ - রাত ৮:০০',
        badge: 'ই-কমার্স হাব',
        servicesOffered: ['ই-কমার্স মার্চেন্ট ডেলিভারি', 'পরের দিন ডেলিভারি'],
      },
    ],
  },

  // 6. কম্পিউটার ও প্রিন্ট
  'computer-print': {
    id: 'computer-print',
    label: 'কম্পিউটার, ফটোকপি ও প্রিন্টিং',
    englishLabel: 'Computer, Photocopy & Printing',
    tagline: 'অনলাইন আবেদন, ফটোকপি, কালার প্রিন্ট ও কম্পিউটার প্রশিক্ষণ',
    group: 'it',
    groupLabel: 'কম্পিউটার ও আইটি',
    icon: Printer,
    themeColor: {
      text: 'text-indigo-700',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      badgeBg: 'bg-indigo-600 text-white',
      gradient: 'from-indigo-600 to-blue-800',
    },
    availableHours: 'সকাল ৮:০০ - রাত ১০:০০',
    overview:
      'চাকরির অনলাইন আবেদন, ছবি প্রিন্ট, লেমিনেটিং, জরুরি কম্পোজ, রেজ্যুম মেকিং ও কালার ফটোকপির জন্য স্থানীয় বিশ্বস্ত কম্পিউটার শপ।',
    listings: [
      {
        id: 'cmp-1',
        title: 'আইটি কর্নার ও ডিজিটাল সেবা',
        upazila: 'কুষ্টিয়া সদর',
        address: 'কোর্ট স্টেশন চত্বর, কুষ্টিয়া সদর',
        phone: '01712-334455',
        workingHours: 'সকাল ৮:৩০ - রাত ৯:৩০',
        badge: 'অনলাইন আবেদন স্পেশালিস্ট',
        badgeType: 'verified',
        servicesOffered: ['সরকারি চাকরির আবেদন', 'পাসপোর্ট ফরম ফিলাপ', 'হাই-স্পিড ফটোকপি', 'কালার প্রিন্ট'],
      },
      {
        id: 'cmp-2',
        title: 'প্রিন্ট পয়েন্ট ও গ্রাফিক্স হাউস',
        upazila: 'কুষ্টিয়া সদর',
        address: 'এনএস রোড, থানা মোড়',
        phone: '01819-556677',
        workingHours: 'সকাল ৯:০০ - রাত ১০:০০',
        badge: 'ব্যানার ও কার্ড প্রিন্ট',
        servicesOffered: ['ভিজিটিং কার্ড', 'ক্যাশমেমো প্রিন্ট', 'পিভিসি ব্যানার'],
      },
    ],
  },

  // 7. ফ্রিল্যান্সিং ও আইটি
  freelancing: {
    id: 'freelancing',
    label: 'ফ্রিল্যান্সিং ও আইটি সাপোর্ট',
    englishLabel: 'Freelancing & IT Hub',
    tagline: 'আইটি ট্রেনিং, ওয়েব ডেভেলপমেন্ট, কো-ওয়ার্কিং স্পেস ও গাইডলাইন',
    group: 'it',
    groupLabel: 'কম্পিউটার ও আইটি',
    icon: Laptop,
    themeColor: {
      text: 'text-violet-700',
      bg: 'bg-violet-50',
      border: 'border-violet-200',
      badgeBg: 'bg-violet-600 text-white',
      gradient: 'from-violet-600 to-purple-800',
    },
    availableHours: 'সকাল ১০:০০ - রাত ৮:০০',
    overview:
      'ওয়েব ডিজাইন, ডিজিটাল মার্কেটিং, গ্রাফিক্স ডিজাইন প্রশিক্ষণ, রেমিট্যান্স উত্তোলন গাইড এবং তরুণদের ফ্রিল্যান্সিং ক্যারিয়ার সহায়তা।',
    listings: [
      {
        id: 'fl-1',
        title: 'কুষ্টিয়া ফ্রিল্যান্সার্স হাব ও কো-ওয়ার্কিং',
        upazila: 'কুষ্টিয়া সদর',
        address: 'মজমপুর গেট, কুষ্টিয়া',
        phone: '01710-112233',
        workingHours: 'সকাল ১০:০০ - রাত ৯:০০',
        badge: 'হাই-স্পিড ইন্টারনেট ও স্পেস',
        badgeType: 'verified',
        servicesOffered: ['কো-ওয়ার্কিং ডেস্ক', 'ফ্রিল্যান্সিং মেন্টরিং', 'ওয়েব ডেভেলপমেন্ট'],
      },
      {
        id: 'fl-2',
        title: 'ডিজিটাল স্কিল একাডেমি',
        upazila: 'কুষ্টিয়া সদর',
        address: 'কলেজ মোড়, কুষ্টিয়া',
        phone: '01911-223344',
        workingHours: 'সকাল ৯:০০ - সন্ধ্যা ৭:০০',
        badge: 'দক্ষতা উন্নয়ন',
        servicesOffered: ['গ্রাফিক্স ডিজাইন', 'এসইও ও মার্কেটিং', 'পাইথন প্রোগ্রামিং'],
      },
    ],
  },

  // 8. ভূমি অফিস ও নামজারি
  'land-office': {
    id: 'land-office',
    label: 'ভূমি অফিস ও নামজারি',
    englishLabel: 'AC Land & Land Registry',
    tagline: 'ই-নামজারি, খতিয়ান, ভূমি উন্নয়ন কর ও রেজিস্ট্রেশন তথ্য',
    group: 'govt',
    groupLabel: 'সরকারি দপ্তর',
    icon: FileText,
    themeColor: {
      text: 'text-teal-700',
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      badgeBg: 'bg-teal-600 text-white',
      gradient: 'from-teal-600 to-emerald-800',
    },
    emergencyHotline: '16122',
    availableHours: 'রবি-বৃহস্পতি ০৯:০০ - ০৫:০০',
    overview:
      'ই-নামজারি (Mutation), দাগ-খতিয়ান অনুসন্ধান, অনলাইনে ভূমি উন্নয়ন কর পরিশোধ ও সাব-রেজিস্ট্রার অফিসের জরুরি তথ্য ও সেবা সহায়িকা।',
    onlinePortalUrl: 'https://mutation.land.gov.bd',
    onlinePortalTitle: 'ই-নামজারি অনলাইন পোর্টাল',
    guidelines: [
      { step: 'নামজারি আবেদন', desc: 'অনলাইনে জাতীয় পরিচয়পত্র, দলিলের কপি ও খাজনার রসিদ দিয়ে আবেদন করুন। ফি সরকারিভাবে নির্ধারিত।' },
      { step: 'খাজনা পরিশোধ', desc: 'ldtax.gov.bd পোর্টাল বা ১৬১২২ তে ফোন করে নিজের খতিয়ান অনুযায়ী অনলাইন খাজনা দিন।' },
    ],
    listings: [
      {
        id: 'lnd-1',
        title: 'উপজেলা ভূমি অফিস (এসি ল্যান্ড), কুষ্টিয়া সদর',
        upazila: 'কুষ্টিয়া সদর',
        address: 'কালেক্টরেট চত্বর, কুষ্টিয়া',
        phone: '01713-300101',
        workingHours: 'রবি-বৃহস্পতি ০৯:০০ - ০৫:০০',
        badge: 'সরকারি অফিস',
        badgeType: 'govt',
        servicesOffered: ['ই-নামজারি অনুমোদন', 'মিসকেস শুনানি', 'খতিয়ান সংশোধন'],
      },
      {
        id: 'lnd-2',
        title: 'কুমারখালী উপজেলা ভূমি অফিস',
        upazila: 'কুমারখালী',
        address: 'উপজেলা পরিষদ চত্বর, কুমারখালী',
        phone: '01713-300102',
        workingHours: '০৯:০০ - ০৫:০০',
        badge: 'এসি ল্যান্ড অফিস',
        badgeType: 'govt',
        servicesOffered: ['ভূমি নামজারি', 'পর্চা বিতরণ'],
      },
    ],
  },

  // 9. পৌরসভা
  municipality: {
    id: 'municipality',
    label: 'পৌরসভা ও নগর সেবা',
    englishLabel: 'Municipality Services',
    tagline: 'ট্রেড লাইসেন্স, নাগরিক সনদ, পানি সরবরাহ ও পরিষ্কার-পরিচ্ছন্নতা',
    group: 'govt',
    groupLabel: 'সরকারি দপ্তর',
    icon: Building,
    themeColor: {
      text: 'text-sky-700',
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      badgeBg: 'bg-sky-600 text-white',
      gradient: 'from-sky-600 to-blue-800',
    },
    availableHours: 'রবি-বৃহস্পতি ০৯:০০ - ০৫:০০',
    overview:
      'ট্রেড লাইসেন্স নবায়ন, পানির লাইন সমস্যা, ময়লা পরিষ্কার, ড্রেনেজ ব্যবস্থা ও ওয়ার্ড কাউন্সিলরের সাথে যোগাযোগ করুন।',
    listings: [
      {
        id: 'mun-1',
        title: 'কুষ্টিয়া পৌরসভা কার্যালয়',
        upazila: 'কুষ্টিয়া সদর',
        address: 'এনএস রোড, কুষ্টিয়া সদর',
        phone: '02-477781001',
        altPhone: '01711-445566',
        workingHours: 'রবি-বৃহস্পতি ০৯:০০ - ০৫:০০',
        badge: 'পৌর কার্যালয়',
        badgeType: 'govt',
        servicesOffered: ['ট্রেড লাইসেন্স', 'নাগরিকত্ব সনদ', 'পয়ঃনিষ্কাশন ও সড়ক বাতি', 'পানি সরবরাহ লাইন'],
      },
      {
        id: 'mun-2',
        title: 'কুমারখালী পৌরসভা',
        upazila: 'কুমারখালী',
        address: 'কুমারখালী বাজার, কুষ্টিয়া',
        phone: '071-61022',
        workingHours: '০৯:০০ - ০৫:০০',
        badge: 'পৌর কার্যালয়',
        badgeType: 'govt',
        servicesOffered: ['নাগরিক সনদ', 'ট্যাক্স মূল্যায়ন', 'পরিচ্ছন্নতা'],
      },
    ],
  },

  // ইউনিয়ন পরিষদ সেবা
  'union-parishad': {
    id: 'union-parishad',
    label: 'ইউনিয়ন পরিষদ সেবা',
    englishLabel: 'Union Parishad Services',
    tagline: 'নাগরিক সনদ, ওয়ারিশান সার্টিফিকেট, জন্ম-মৃত্যু নিবন্ধন ও সামাজিক নিরাপত্তা ভাতা',
    group: 'govt',
    groupLabel: 'সরকারি দপ্তর',
    icon: Building,
    themeColor: {
      text: 'text-indigo-700',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      badgeBg: 'bg-indigo-600 text-white',
      gradient: 'from-indigo-600 to-purple-800',
    },
    availableHours: 'রবি-বৃহস্পতি ০৯:০০ - ০৪:০০',
    overview: 'কুষ্টিয়া জেলার বিভিন্ন ইউনিয়ন পরিষদের চেয়ারম্যান, সচিব ও ডিজিটাল সেন্টারের মাধ্যমে নাগরিক সেবা, ট্রেড লাইসেন্স, এবং সনদ প্রদান করা হয়।',
    listings: [
      {
        id: 'up-1',
        title: 'ঝাউদিয়া ইউনিয়ন পরিষদ কার্যালয়',
        upazila: 'কুষ্টিয়া সদর',
        address: 'ঝাউদিয়া বাজার, কুষ্টিয়া সদর',
        phone: '01711-889900',
        workingHours: 'রবি-বৃহস্পতি ০৯:০০ - ০৪:০০',
        badge: 'ইউপি কার্যালয়',
        badgeType: 'govt',
        servicesOffered: ['নাগরিক সনদ', 'ওয়ারিশান সার্টিফিকেট', 'জন্ম নিবন্ধন', 'সামাজিক নিরাপত্তা ভাতা'],
        imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80'
      },
      {
        id: 'up-2',
        title: 'জগতি ইউনিয়ন পরিষদ ও ডিজিটাল সেন্টার',
        upazila: 'কুষ্টিয়া সদর',
        address: 'জগতি, কুষ্টিয়া সদর',
        phone: '01811-223344',
        workingHours: 'রবি-বৃহস্পতি ০৯:০০ - ০৪:০০',
        badge: 'ডিজিটাল সেন্টার',
        badgeType: 'govt',
        servicesOffered: ['অনলাইন আবেদন', 'ট্রেড লাইসেন্স', 'সনদপত্র সত্যায়ন'],
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80'
      }
    ]
  },

  // আবাসিক হোটেল সেবা
  'residential-hotel': {
    id: 'residential-hotel',
    label: 'আবাসিক হোটেল সেবা',
    englishLabel: 'Residential Hotel Service',
    tagline: 'নিরাপদ ও আরামদায়ক আবাসন, এসি/নন-এসি রুম ও গেস্টহাউস বুকিং',
    group: 'transport',
    groupLabel: 'ভ্রমণ ও আবাসন',
    icon: Building2,
    themeColor: {
      text: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      badgeBg: 'bg-rose-600 text-white',
      gradient: 'from-rose-600 to-pink-800',
    },
    availableHours: '২৪ ঘণ্টা খোলা',
    overview: 'কুষ্টিয়া শহর ও উপজেলা সদরের মানসম্মত আবাসিক হোটেল, গেস্টহাউস এবং ভিআইপি রুম বুকিংয়ের তথ্য।',
    listings: [
      {
        id: 'hot-1',
        title: 'হোটেল রিভার ভিউ (এসি/নন-এসি)',
        upazila: 'কুষ্টিয়া সদর',
        address: 'বড় বাজার সংলগ্ন, এনএস রোড, কুষ্টিয়া',
        phone: '01712-334455',
        altPhone: '071-62345',
        workingHours: '২৪ ঘণ্টা খোলা',
        badge: 'জনপ্রিয় হোটেল',
        badgeType: 'popular',
        servicesOffered: ['এসি ভিআইপি রুম', 'নন-এসি বাজেট রুম', 'কনফারেন্স রুম', '২৪ ঘণ্টা রুম সার্ভিস'],
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'
      },
      {
        id: 'hot-2',
        title: 'কুষ্টিয়া গেস্টহাউস ও আবাসিক',
        upazila: 'কুষ্টিয়া সদর',
        address: 'মজমপুর গেট, কুষ্টিয়া',
        phone: '01911-556677',
        workingHours: '২৪ ঘণ্টা খোলা',
        badge: 'নিরাপদ আবাসন',
        badgeType: 'verified',
        servicesOffered: ['ফ্যামিলি স্যুট', 'সিঙ্গেল রুম', 'গাড়ী পার্কিং সুবিধা', 'নিরাপদ পরিবেশ'],
        imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80'
      }
    ]
  },

  // 10. পাসপোর্ট ও ভিসা
  'passport-visa': {
    id: 'passport-visa',
    label: 'পাসপোর্ট ও ভিসা সেবা',
    englishLabel: 'Regional Passport Office',
    tagline: 'ই-পাসপোর্ট আবেদন, নবায়ন, সংশোধন ও ভিসা তথ্য গাইড',
    group: 'govt',
    groupLabel: 'সরকারি দপ্তর',
    icon: Plane,
    themeColor: {
      text: 'text-cyan-700',
      bg: 'bg-cyan-50',
      border: 'border-cyan-200',
      badgeBg: 'bg-cyan-600 text-white',
      gradient: 'from-cyan-600 to-teal-800',
    },
    availableHours: 'রবি-বৃহস্পতি ০৯:০০ - ০৫:০০',
    overview:
      'ই-পাসপোর্ট নতুন আবেদন, মেয়াদোত্তীর্ণ পাসপোর্ট রিনিউ, ফি জমা দেওয়া ও ফিঙ্গারপ্রিন্ট দেয়ার সরকারি নিয়মাবলী।',
    onlinePortalUrl: 'https://epassport.gov.bd',
    onlinePortalTitle: 'ই-পাসপোর্ট সরকারি পোর্টাল',
    guidelines: [
      { step: 'অনলাইন ফরম পূরণ', desc: 'epassport.gov.bd তে নির্ভুল তথ্য দিয়ে আবেদন করুন। কোন দালাল ধরবেন না।' },
      { step: 'ব্যাংক ফি প্রদান', desc: 'এ-চালানের মাধ্যমে সোনালী, ওয়ান ব্যাংক বা অনলাইনে সরকারি ফি পরিশোধ করুন।' },
      { step: 'বায়োমেট্রিক প্রদান', desc: 'আবেদনপত্রের প্রিন্ট কপি ও চালান স্লিপ নিয়ে নির্ধারিত তারিখে পাসপোর্ট অফিসে যান।' },
    ],
    listings: [
      {
        id: 'psp-1',
        title: 'আঞ্চলিক পাসপোর্ট অফিস, কুষ্টিয়া',
        upazila: 'কুষ্টিয়া সদর',
        address: 'কালিশংকরপুর, পুলিশ লাইন্স সংলগ্ন, কুষ্টিয়া',
        phone: '02-477782333',
        workingHours: 'রবি-বৃহস্পতি ০৯:০০ - ০৪:৩০',
        badge: 'সরকারি পাসপোর্ট অফিস',
        badgeType: 'govt',
        servicesOffered: ['ই-পাসপোর্ট বায়োমেট্রিক', 'পাসপোর্ট ডেলিভারি', 'জরুরি ও সাধারণ পাসপোর্ট'],
      },
    ],
  },

  // 11. জন্ম ও মৃত্যু নিবন্ধন
  'birth-death': {
    id: 'birth-death',
    label: 'জন্ম ও মৃত্যু নিবন্ধন',
    englishLabel: 'Birth & Death Registration',
    tagline: 'নতুন জন্ম সনদ, ভুল সংশোধন ও মৃত্যু সনদ সংগ্রহ',
    group: 'govt',
    groupLabel: 'সরকারি দপ্তর',
    icon: FileSignature,
    themeColor: {
      text: 'text-purple-700',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      badgeBg: 'bg-purple-600 text-white',
      gradient: 'from-purple-600 to-indigo-800',
    },
    availableHours: 'রবি-বৃহস্পতি ০৯:০০ - ০৫:০০',
    overview:
      'শিশুর জন্মের ৪৫ দিনের মধ্যে বিনামূল্যে জন্ম নিবন্ধন করুন। নামের বানান বা বয়স সংশোধনের জন্য অনলাইনে আবেদন জমা দিতে হয়।',
    onlinePortalUrl: 'https://bdris.gov.bd',
    onlinePortalTitle: 'জন্ম ও মৃত্যু নিবন্ধন পোর্টাল',
    listings: [
      {
        id: 'bd-1',
        title: 'পৌরসভা / ইউনিয়ন পরিষদ জন্ম নিবন্ধন শাখা',
        upazila: 'কুষ্টিয়া সদর',
        address: 'সংশ্লিষ্ট পৌরসভা বা ইউনিয়ন পরিষদ কার্যালয়',
        phone: '16122',
        workingHours: 'সকাল ৯:০০ - বিকাল ৫:০০',
        badge: 'ইউনিয়ন ও পৌর শাখা',
        badgeType: 'govt',
        servicesOffered: ['নতুন জন্ম নিবন্ধন', 'সনদপত্র প্রিন্ট', 'সংশোধন ফরম ভেরিফিকেশন'],
      },
    ],
  },

  // 12. এনআইডি ও ভোটার সেবা
  'nid-voter': {
    id: 'nid-voter',
    label: 'এনআইডি ও ভোটার সেবা',
    englishLabel: 'National ID & Voter Wing',
    tagline: 'নতুন ভোটার অন্তর্ভুক্তি, স্মার্ট কার্ড বিতরণ ও সংশোধন',
    group: 'govt',
    groupLabel: 'সরকারি দপ্তর',
    icon: UserCheck,
    themeColor: {
      text: 'text-green-700',
      bg: 'bg-green-50',
      border: 'border-green-200',
      badgeBg: 'bg-green-600 text-white',
      gradient: 'from-green-600 to-emerald-800',
    },
    emergencyHotline: '105',
    availableHours: 'রবি-বৃহস্পতি ০৯:০০ - ০৫:০০',
    overview:
      'ভোটার তালিকায় নাম তোলা, হারানো জাতীয় পরিচয়পত্র অনলাইন কপি ডাউনলোড ও তথ্য সংশোধনের জন্য নির্বাচন অফিসে যোগাযোগ করুন।',
    onlinePortalUrl: 'https://services.nidw.gov.bd',
    onlinePortalTitle: 'এনআইডি উইং পোর্টাল',
    listings: [
      {
        id: 'nid-1',
        title: 'উপজেলা নির্বাচন কার্যালয়, কুষ্টিয়া সদর',
        upazila: 'কুষ্টিয়া সদর',
        address: 'কালেক্টরেট ভবন সংলগ্ন, কুষ্টিয়া',
        phone: '105',
        workingHours: '০৯:০০ - ০৫:০০',
        badge: 'নির্বাচন কমিশন শাখা',
        badgeType: 'govt',
        servicesOffered: ['নতুন ভোটার রেজিস্ট্রেশন', 'স্মার্ট কার্ড বিতরণ', 'ভোটার স্থানান্তর'],
      },
    ],
  },

  // 13. অটোমোবাইল ও গাড়ি মেরামত
  'car-repair': {
    id: 'car-repair',
    label: 'গাড়ি মেরামত ও ওয়ার্কশপ',
    englishLabel: 'Automobile & Garage',
    tagline: 'প্রাইভেট কার, মাইক্রোবাস ও মোটরবাইক সার্ভিসিং ওয়ার্কশপ',
    group: 'transport',
    groupLabel: 'যাতায়াত ও ভাড়া',
    icon: Wrench,
    themeColor: {
      text: 'text-orange-700',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      badgeBg: 'bg-orange-600 text-white',
      gradient: 'from-orange-600 to-amber-700',
    },
    availableHours: 'সকাল ৮:০০ - রাত ৯:০০',
    overview:
      'গাড়ি রাস্তায় নষ্ট হলে জরুরি মেকানিক সাপোর্ট, ডেন্টিং-পেইন্টিং, ইঞ্জিন মেরামত ও বাইক সার্ভিসিং সেন্টার।',
    listings: [
      {
        id: 'cr-1',
        title: 'কুষ্টিয়া মডার্ন অটো ওয়ার্কশপ',
        upazila: 'কুষ্টিয়া সদর',
        address: 'বাইপাস রোড, মজমপুর, কুষ্টিয়া',
        phone: '01715-443322',
        workingHours: 'সকাল ৮:০০ - রাত ৯:০০',
        badge: 'জরুরি অন-রোড সার্ভিস',
        badgeType: 'popular',
        servicesOffered: ['ইঞ্জিন টিউনিং', 'এসি মেরামত', 'ডেন্টিং পেইন্টিং', 'কম্পিউটার স্ক্যানিং'],
      },
      {
        id: 'cr-2',
        title: 'ইয়ামাহা ও বাজাজ মোটরবাইক সার্ভিস পয়েন্ট',
        upazila: 'কুষ্টিয়া সদর',
        address: 'এনএস রোড, থানা মোড়',
        phone: '01914-556677',
        workingHours: 'সকাল ৯:০০ - রাত ৮:৩০',
        badge: 'অরিজিনাল পার্টস',
        servicesOffered: ['বাইক ইঞ্জিন সার্ভিসিং', 'মবিল পরিবর্তন', 'ইলেকট্রিক ওয়্যারিং'],
      },
    ],
  },

  // 14. স্কুল ও কলেজ
  'school-college': {
    id: 'school-college',
    label: 'স্কুল ও কলেজ',
    englishLabel: 'Schools & Colleges',
    tagline: 'কুষ্টিয়া সরকারি কলেজ, জিলা স্কুল, বিশ্ববিদ্যালয় ও শীর্ষ শিক্ষাপ্রতিষ্ঠান',
    group: 'education',
    groupLabel: 'শিক্ষা ও ক্যারিয়ার',
    icon: GraduationCap,
    themeColor: {
      text: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badgeBg: 'bg-blue-600 text-white',
      gradient: 'from-blue-600 to-sky-700',
    },
    availableHours: 'সকাল ৯:০০ - বিকাল ৪:০০',
    overview:
      'কুষ্টিয়া জেলার বিখ্যাত কুষ্টিয়া সরকারি কলেজ, কুষ্টিয়া জিলা স্কুল, ইসলামী বিশ্ববিদ্যালয় ও বিভিন্ন শিক্ষা প্রতিষ্ঠানের তথ্য।',
    listings: [
      {
        id: 'sc-1',
        title: 'কুষ্টিয়া সরকারি কলেজ',
        upazila: 'কুষ্টিয়া সদর',
        address: 'কলেজ মোড়, কুষ্টিয়া সদর',
        phone: '02-477781045',
        workingHours: 'সকাল ৯:০০ - বিকাল ৪:০০',
        badge: 'ঐতিহ্যবাহী কলেজ',
        badgeType: 'govt',
        servicesOffered: ['উচ্চ মাধ্যমিক', 'স্নাতক (সম্মান)', 'স্নাতকোত্তর', 'জাতীয় বিশ্ববিদ্যালয় অধিভুক্ত'],
      },
      {
        id: 'sc-2',
        title: 'কুষ্টিয়া জিলা স্কুল',
        upazila: 'কুষ্টিয়া সদর',
        address: 'স্কুল রোড, কোর্ট পাড়া, কুষ্টিয়া',
        phone: '071-61540',
        workingHours: 'সকাল ১০:০০ - বিকাল ৪:০০',
        badge: 'সেরা বিদ্যালয়',
        badgeType: 'govt',
        servicesOffered: ['৬ষ্ঠ থেকে ১০ম শ্রেণি', 'বিজ্ঞান ও মানবিক শাখা'],
      },
      {
        id: 'sc-3',
        title: 'ইসলামী বিশ্ববিদ্যালয় (ইবি)',
        upazila: 'কুষ্টিয়া সদর',
        address: 'শান্তিডাঙ্গা, কুষ্টিয়া',
        phone: '071-74900',
        workingHours: 'অফিস সময়',
        badge: 'পাবলিক বিশ্ববিদ্যালয়',
        badgeType: 'govt',
        servicesOffered: ['উচ্চশিক্ষা ও গবেষণা', '৩৪টি বিভাগ'],
      },
    ],
  },

  // 15. গাড়ি ভাড়া ও রেন্ট-এ-কার
  'car-rental': {
    id: 'car-rental',
    label: 'রেন্ট-এ-কার ও গাড়ি ভাড়া',
    englishLabel: 'Rent-A-Car Services',
    tagline: 'হাইয়েস, নোয়া, প্রাইভেট কার, অ্যাম্বুলেন্স ও পিকআপ ভাড়া',
    group: 'transport',
    groupLabel: 'যাতায়াত ও ভাড়া',
    icon: Car,
    themeColor: {
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      badgeBg: 'bg-emerald-600 text-white',
      gradient: 'from-emerald-600 to-green-700',
    },
    availableHours: '২৪ ঘণ্টা বুকিং চালু',
    overview:
      'ঢাকা বিমানবন্দর ড্রপ, পারিবারিক ভ্রমণ, রোগী পরিবহন বা বিয়ে-শাদীর জন্য কুষ্টিয়ার নির্ভরযোগ্য রেন্ট-এ-কার সেবা। অভিজ্ঞ ড্রাইভারসহ গাড়ি পাওয়া যায়।',
    listings: [
      {
        id: 'rent-1',
        title: 'কুষ্টিয়া রয়েল রেন্ট-এ-কার',
        upazila: 'কুষ্টিয়া সদর',
        address: 'মজমপুর বাসস্ট্যান্ড, কুষ্টিয়া',
        phone: '01712-889900',
        altPhone: '01911-889900',
        workingHours: '২৪ ঘণ্টা বুকিং',
        badge: 'এসি প্রাইভেট কার ও নোয়া',
        badgeType: 'popular',
        servicesOffered: ['ঢাকা এয়ারপোর্ট ড্রপ', 'দিনচুক্তি ভ্রমণ', 'পেশাদার ড্রাইভার', 'জরুরি অ্যাম্বুলেন্স'],
      },
      {
        id: 'rent-2',
        title: 'পদ্মা ট্রাভেলস কার রেন্টাল',
        upazila: 'কুষ্টিয়া সদর',
        address: 'পুরাতন বাস টার্মিনাল, কুষ্টিয়া',
        phone: '01817-667788',
        workingHours: '২৪ ঘণ্টা',
        badge: 'মাইক্রোবাস ও হাইস',
        servicesOffered: ['পারিবারিক ট্যুর', 'বিয়ের গাড়ি বুকিং'],
      },
    ],
  },

  // 16. কৃষি ও সার-বীজ
  agriculture: {
    id: 'agriculture',
    label: 'কৃষি ও সার-বীজ সেবা',
    englishLabel: 'Agriculture & Extension',
    tagline: 'উপজেলা কৃষি অফিস, কীটনাশক ও উন্নত জাতের বীজ সহায়িকা',
    group: 'daily',
    groupLabel: 'দৈনন্দিন ও বাজার',
    icon: Sprout,
    themeColor: {
      text: 'text-lime-700',
      bg: 'bg-lime-50',
      border: 'border-lime-200',
      badgeBg: 'bg-lime-600 text-white',
      gradient: 'from-lime-600 to-emerald-700',
    },
    emergencyHotline: '16123',
    availableHours: 'সকাল ৯:০০ - বিকাল ৫:০০',
    overview:
      'ফসলের রোগবালাই দমন, সরকারি ভর্তুকিযুক্ত সার ও বীজ সহায়তা পেতে উপজেলা কৃষি সম্প্রসারণ অফিস ও কৃষক কল সেন্টারে কল দিন।',
    listings: [
      {
        id: 'agr-1',
        title: 'উপজেলা কৃষি সম্প্রসারণ কার্যালয়',
        upazila: 'কুষ্টিয়া সদর',
        address: 'উপজেলা পরিষদ চত্বর, কুষ্টিয়া সদর',
        phone: '16123',
        workingHours: 'রবি-বৃহস্পতি ০৯:০০ - ০৫:০০',
        badge: 'কৃষি সম্প্রসারণ অফিস',
        badgeType: 'govt',
        servicesOffered: ['ফসল পরামর্শ', 'কীটনাশক অনুমোদন', 'প্রণোদনা বীজ ও সার'],
      },
    ],
  },

  // 17. মৎস্য ও পোল্ট্রি
  fisheries: {
    id: 'fisheries',
    label: 'মৎস্য ও পোল্ট্রি সেবা',
    englishLabel: 'Fisheries & Livestock',
    tagline: 'মাছ চাষ, পোল্ট্রি ফিড, ওষুধ ও মৎস্য কর্মকর্তা পরামর্শ',
    group: 'daily',
    groupLabel: 'দৈনন্দিন ও বাজার',
    icon: Fish,
    themeColor: {
      text: 'text-cyan-700',
      bg: 'bg-cyan-50',
      border: 'border-cyan-200',
      badgeBg: 'bg-cyan-600 text-white',
      gradient: 'from-cyan-600 to-sky-700',
    },
    availableHours: 'সকাল ৯:০০ - বিকাল ৫:০০',
    overview:
      'পুকুরে মাছের পোনা ছাড়া, মাছের রোগ নিয়ন্ত্রণ, বায়োফ্লক পরামর্শ ও প্রাণিসম্পদ চিকিৎসা।',
    listings: [
      {
        id: 'fsh-1',
        title: 'উপজেলা মৎস্য কর্মকর্তার কার্যালয়',
        upazila: 'কুষ্টিয়া সদর',
        address: 'কালেক্টরেট চত্বর, কুষ্টিয়া সদর',
        phone: '071-62022',
        workingHours: '০৯:০০ - ০৫:০০',
        badge: 'সরকারি মৎস্য দপ্তর',
        badgeType: 'govt',
        servicesOffered: ['পোনা মাছের জাত পরামর্শ', 'পুকুর প্রস্তুতি', 'লাইসেন্স প্রদান'],
      },
    ],
  },

  // 18. সিএনজি ও অটো বাইক
  'cng-auto': {
    id: 'cng-auto',
    label: 'সিএনজি ও অটো বাইক',
    englishLabel: 'CNG & Auto Bike',
    tagline: 'কুষ্টিয়া শহর ও বিভিন্ন রুটের সিএনজি, অটো রিকশা ও ইজিবাইক স্ট্যান্ড এবং ভাড়ার তালিকা',
    group: 'transport',
    groupLabel: 'যাতায়াত ও ভাড়া',
    icon: Car,
    themeColor: {
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      badgeBg: 'bg-emerald-700 text-white',
      gradient: 'from-emerald-600 to-teal-800',
    },
    availableHours: '২৪ ঘণ্টা',
    overview:
      'কুষ্টিয়া পৌরসভা ও বিভিন্ন উপজেলা রুটে চলাচলকারী সিএনজি অটোরিকশা, ব্যাটারিচালিত অটো বাইক ও ইজিবাইক স্ট্যান্ডের তথ্য এবং নির্ধারিত ভাড়া।',
    listings: [
      {
        id: 'cng-1',
        title: 'মজমপুর গেট সিএনজি ও অটো স্ট্যান্ড',
        upazila: 'কুষ্টিয়া সদর',
        address: 'মজমপুর গেট, কুষ্টিয়া সদর',
        phone: '01712-112233',
        workingHours: 'সকাল ৬টা - রাত ১০টা',
        badge: 'প্রধান স্ট্যান্ড',
        badgeType: 'popular',
        servicesOffered: ['শহর ও উপজেলা রুট', 'রিজার্ভ সিএনজি', 'ভাড়া তালিকা নিয়ন্ত্রণ'],
        imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80'
      },
      {
        id: 'cng-2',
        title: 'বড় বাজার অটো বাইক স্ট্যান্ড',
        upazila: 'কুষ্টিয়া সদর',
        address: 'বড় বাজার সংলগ্ন, এনএস রোড, কুষ্টিয়া',
        phone: '01718-445566',
        workingHours: '২৪ ঘণ্টা',
        badge: 'ইজিবাইক ও রিকশা',
        badgeType: 'verified',
        servicesOffered: ['লোকাল প্যাসেঞ্জার', 'মালপত্র পরিবহন', 'মাসিক চুক্তি'],
        imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80'
      }
    ],
  },

  // 19. মুদি বাজার ও সুপারশপ
  grocery: {
    id: 'grocery',
    label: 'মুদি বাজার ও সুপারশপ',
    englishLabel: 'Grocery & Super Shop',
    tagline: 'দৈনন্দিন চাল, ডাল, তেল, মসলা ও হোম ডেলিভারি সুপারশপ',
    group: 'daily',
    groupLabel: 'দৈনন্দিন ও বাজার',
    icon: ShoppingBag,
    themeColor: {
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      badgeBg: 'bg-emerald-600 text-white',
      gradient: 'from-emerald-600 to-teal-700',
    },
    availableHours: 'সকাল ৮:০০ - রাত ১০:০০',
    overview:
      'কুষ্টিয়া শহরের সেরা পাইকারি ও খুচরা মুদি দোকান এবং ক্যাশ অন ডেলিভারি গ্রোসারি শপ।',
    listings: [
      {
        id: 'grc-1',
        title: 'কুষ্টিয়া সুপার মার্কেট গ্রোসারি',
        upazila: 'কুষ্টিয়া সদর',
        address: 'বড় বাজার, কুষ্টিয়া সদর',
        phone: '01715-112233',
        workingHours: 'সকাল ৮:০০ - রাত ১০:০০',
        badge: 'হোম ডেলিভারি সুবিধা',
        badgeType: 'verified',
        servicesOffered: ['খাঁটি সরিষার তেল', 'মিনিকেট চাল', 'সকল নিত্যপণ্য'],
      },
    ],
  },

  // 20. শাক-সবজি ও কাঁচাবাজার
  vegetables: {
    id: 'vegetables',
    label: 'কাঁচাবাজার ও শাক-সবজি',
    englishLabel: 'Fresh Vegetables & Market',
    tagline: 'টাটকা মৌসুমি শাক-সবজি, ফলমূল ও দৈনিক পাইকারি বাজার',
    group: 'daily',
    groupLabel: 'দৈনন্দিন ও বাজার',
    icon: Apple,
    themeColor: {
      text: 'text-green-700',
      bg: 'bg-green-50',
      border: 'border-green-200',
      badgeBg: 'bg-green-600 text-white',
      gradient: 'from-green-600 to-lime-700',
    },
    availableHours: 'ভোর ৬:০০ - রাত ৯:০০',
    overview:
      'সরাসরি কৃষকের মাঠ থেকে আসা টাটকা শাক-সবজি ও ফলের নির্ভরযোগ্য পাইকারি আড়ত ও খুচরা বাজার।',
    listings: [
      {
        id: 'veg-1',
        title: 'কুষ্টিয়া পৌর কাঁচাবাজার',
        upazila: 'কুষ্টিয়া সদর',
        address: 'কাটায়খানা মোড়, কুষ্টিয়া সদর',
        phone: '01716-223344',
        workingHours: 'ভোর ৬:০০ - রাত ৮:০০',
        badge: 'টাটকা সবজি বাজার',
        badgeType: 'popular',
        servicesOffered: ['শাকসবজি পাইকারি ও খুচরা', 'মৌসুমি ফল'],
      },
    ],
  },

  // 21. বিউটি পার্লার ও সেলুন
  'beauty-parlor': {
    id: 'beauty-parlor',
    label: 'বিউটি পার্লার ও সেলুন',
    englishLabel: 'Beauty Parlour & Salon',
    tagline: 'ব্রাইডাল মেকআপ, স্কিন কেয়ার, হেয়ার কাট ও ফেসিয়াল স্পেশালিস্ট',
    group: 'daily',
    groupLabel: 'দৈনন্দিন ও বাজার',
    icon: Scissors,
    themeColor: {
      text: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      badgeBg: 'bg-rose-600 text-white',
      gradient: 'from-rose-600 to-pink-700',
    },
    availableHours: 'সকাল ১০:০০ - রাত ৮:৩০',
    overview:
      'বিয়ের ব্রাইডাল লুক, পার্টি মেকআপ, হেয়ার ট্রিটমেন্ট, মেনস সেলুন ও পার্লার সেবা।',
    listings: [
      {
        id: 'bt-1',
        title: 'রূপসী বিউটি পার্লার ও স্পা',
        upazila: 'কুষ্টিয়া সদর',
        address: 'কলেজ মোড়, সিরাজউদ্দৌলা রোড, কুষ্টিয়া',
        phone: '01712-778899',
        workingHours: 'সকাল ১০:০০ - রাত ৮:০০',
        badge: 'ব্রাইডাল স্পেশালিস্ট',
        badgeType: 'popular',
        servicesOffered: ['ব্রাইডাল মেকআপ', 'হাইড্রো ফেসিয়াল', 'রিবন্ডিং ও হেয়ার কালার'],
      },
      {
        id: 'bt-2',
        title: 'রয়েল মেনস সেলুন',
        upazila: 'কুষ্টিয়া সদর',
        address: 'মজমপুর গেট, কুষ্টিয়া',
        phone: '01811-334455',
        workingHours: 'সকাল ৯:০০ - রাত ১০:০০',
        badge: 'আধুনিক মেনস সেলুন',
        servicesOffered: ['হেয়ার কাট ও স্পা', 'ফেসিয়াল ও দাড়ি ট্রিমিং'],
      },
    ],
  },

  // 22. লন্ড্রি ও ড্রাই ক্লিন
  laundry: {
    id: 'laundry',
    label: 'লন্ড্রি ও ড্রাই ক্লিন',
    englishLabel: 'Laundry & Dry Cleaners',
    tagline: 'স্যুট-কোট ড্রাই ওয়াশ, আয়রন ও দ্রুত হোম ডেলিভারি',
    group: 'daily',
    groupLabel: 'দৈনন্দিন ও বাজার',
    icon: Shirt,
    themeColor: {
      text: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badgeBg: 'bg-blue-600 text-white',
      gradient: 'from-blue-600 to-indigo-700',
    },
    availableHours: 'সকাল ৯:০০ - রাত ৯:০০',
    overview:
      'শীতের ভারী কম্বল, কোর্ট-ব্লেজার, শাড়ি ও দৈনিক কাপড়ের নিখুঁত ড্রাই ক্লিন ও স্টিম আয়রন।',
    listings: [
      {
        id: 'lnd-1',
        title: 'কুষ্টিয়া ড্রাই ক্লিনার্স',
        upazila: 'কুষ্টিয়া সদর',
        address: 'এনএস রোড, থানা মোড় সংলগ্ন',
        phone: '01714-889900',
        workingHours: 'সকাল ৯:০০ - রাত ৯:০০',
        badge: 'স্টিম ওয়াশ স্পেশালিস্ট',
        servicesOffered: ['স্যুট ড্রাই ওয়াশ', 'শাড়ি রোল পলিশ', 'কম্বল ওয়াশ'],
      },
    ],
  },

  // 23. ফার্নিচার ও আসবাবপত্র
  furniture: {
    id: 'furniture',
    label: 'আসবাবপত্র ও ফার্নিচার',
    englishLabel: 'Furniture & Interior',
    tagline: 'সেগুন কাঠের খাট, ওয়ারড্রব, সোফা ও আধুনিক হোম ইন্টেরিয়র',
    group: 'daily',
    groupLabel: 'দৈনন্দিন ও বাজার',
    icon: Sofa,
    themeColor: {
      text: 'text-amber-900',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      badgeBg: 'bg-amber-800 text-white',
      gradient: 'from-amber-800 to-stone-900',
    },
    availableHours: 'সকাল ৯:০০ - রাত ৮:৩০',
    overview:
      'টেকসই কাঠের খাট, ডাইনিং টেবিল, ড্রেসিং টেবিল ও অফিস ফার্নিচারের শীর্ষস্থানীয় শোরুম।',
    listings: [
      {
        id: 'frn-1',
        title: 'অটবি ও হাতিল ফার্নিচার গ্যালারি',
        upazila: 'কুষ্টিয়া সদর',
        address: 'মজমপুর মোড়, কুষ্টিয়া সদর',
        phone: '01718-445566',
        workingHours: 'সকাল ৯:৩০ - রাত ৮:৩০',
        badge: 'ব্র্যান্ড ফার্নিচার',
        badgeType: 'verified',
        servicesOffered: ['অফিস ডেকোরেশন', 'হোম ফার্নিচার', 'ওয়ারেন্টি সাপোর্ট'],
      },
    ],
  },

  // 24. হার্ডওয়্যার ও স্যানিটারি
  hardware: {
    id: 'hardware',
    label: 'হার্ডওয়্যার ও স্যানিটারি',
    englishLabel: 'Hardware & Sanitary',
    tagline: 'রং, সিমেন্ট, রড, পাইপ ফিটিংস ও বাথরুম স্যানিটারি সামগ্রী',
    group: 'handyman',
    groupLabel: 'মিস্ত্রি ও কারিগরি',
    icon: Hammer,
    themeColor: {
      text: 'text-stone-800',
      bg: 'bg-stone-100',
      border: 'border-stone-300',
      badgeBg: 'bg-stone-700 text-white',
      gradient: 'from-stone-700 to-slate-900',
    },
    availableHours: 'সকাল ৮:০০ - রাত ৮:০০',
    overview:
      'বাড়ি নির্মাণ সামগ্রী, বার্জার/এশিয়ান পেইন্টস, জিআই পাইপ, পিভিসি পাইপ ও যাবতীয় হার্ডওয়্যার পণ্যের দোকান।',
    listings: [
      {
        id: 'hrd-1',
        title: 'জনতা হার্ডওয়্যার ও পেইন্ট সেন্টার',
        upazila: 'কুষ্টিয়া সদর',
        address: 'এনএস রোড, বড় বাজার, কুষ্টিয়া',
        phone: '01711-887766',
        workingHours: 'সকাল ৮:০০ - রাত ৮:০০',
        badge: 'পাইকারি ও খুচরা',
        servicesOffered: ['কালার ম্যাচিং পেইন্ট', 'স্যানিটারি ফিটিংস', 'বৈদ্যুতিক তার'],
      },
    ],
  },

  // 25. ইন্টারনেট ও ব্রডব্যান্ড
  internet: {
    id: 'internet',
    label: 'ইন্টারনেট ও ব্রডব্যান্ড',
    englishLabel: 'Internet & Broadband ISPs',
    tagline: 'উচ্চগতির ফাইবার অপটিক ইন্টারনেট ও ওয়াই-ফাই কানেকশন',
    group: 'it',
    groupLabel: 'কম্পিউটার ও আইটি',
    icon: Wifi,
    themeColor: {
      text: 'text-indigo-700',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      badgeBg: 'bg-indigo-600 text-white',
      gradient: 'from-indigo-600 to-sky-700',
    },
    availableHours: '২৪/৭ সাপোর্ট হেল্পলাইন',
    overview:
      'বাসা ও অফিসের জন্য বাফারহীন ইন্টারনেট সংযোগ, দ্রুতগতির রাউটার সেটআপ ও জরুরি অপটিক্যাল ফাইবার লাইন মেরামতের আইএসপি।',
    listings: [
      {
        id: 'net-1',
        title: 'কুষ্টিয়া অনলাইন ব্রডব্যান্ড নেটওয়ার্ক',
        upazila: 'কুষ্টিয়া সদর',
        address: 'মজমপুর গেট, কুষ্টিয়া',
        phone: '01712-001122',
        altPhone: '01912-001122',
        workingHours: '২৪ ঘণ্টা টেক সাপোর্ট',
        badge: 'ফাইবার অপটিক সংযোগ',
        badgeType: 'verified',
        servicesOffered: ['আনলিমিটেড ইন্টারনেট', 'বিডিএক্স ও ইউটিউব স্পিড', '২৪ ঘণ্টা অন-কল সাপোর্ট'],
      },
      {
        id: 'net-2',
        title: 'লিংক থ্রি ও কার্নিভাল আইএসপি',
        upazila: 'কুষ্টিয়া সদর',
        address: 'কলেজ মোড়, কুষ্টিয়া',
        phone: '09604-000000',
        workingHours: 'অফিস সকাল ৯:০০ - রাত ৮:০০',
        badge: 'কর্পোরেট ব্রডব্যান্ড',
        servicesOffered: ['গেমিং ব্যান্ডউইথ', 'রিয়েল আইপি সুবিধা'],
      },
    ],
  },

  // 26. চক্ষু সেবা
  'eye-care': {
    id: 'eye-care',
    label: 'চক্ষু সেবা ও চশমা',
    englishLabel: 'Eye Hospital & Optics',
    tagline: 'দৃষ্টি পরীক্ষা, ছানি অপারেশন, চোখের ড্রপ ও প্রেসক্রিপশন চশমা',
    group: 'health',
    groupLabel: 'স্বাস্থ্য ও চিকিৎসা',
    icon: Eye,
    themeColor: {
      text: 'text-teal-700',
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      badgeBg: 'bg-teal-600 text-white',
      gradient: 'from-teal-600 to-cyan-700',
    },
    availableHours: 'সকাল ৯:০০ - রাত ৮:০০',
    overview:
      'কম্পিউটারাইজড চোখ পরীক্ষা, পাওয়ার চশমা তৈরি ও বিশেষজ্ঞ চক্ষু সার্জন দ্বারা ফ্যাকো ও লেন্স প্রতিস্থাপন চিকিৎসা।',
    listings: [
      {
        id: 'eye-1',
        title: 'কুষ্টিয়া চক্ষু হাসপাতাল',
        upazila: 'কুষ্টিয়া সদর',
        address: 'কালিশংকরপুর, কুষ্টিয়া সদর',
        phone: '02-477781400',
        workingHours: 'সকাল ৮:০০ - বিকাল ৩:০০',
        badge: 'বিশেষায়িত চক্ষু হাসপাতাল',
        badgeType: 'verified',
        servicesOffered: ['ছানি অপারেশন (ফ্যাকো)', 'গ্লুকোমা চিকিৎসা', 'চশমার পাওয়ার নির্ধারণ'],
      },
      {
        id: 'eye-2',
        title: 'দৃষ্টি অপটিক্স ও কন্টাক্ট লেন্স',
        upazila: 'কুষ্টিয়া সদর',
        address: 'এনএস রোড, থানা মোড়',
        phone: '01716-554433',
        workingHours: 'সকাল ৯:০০ - রাত ৯:০০',
        badge: 'কম্পিউটারাইজড পাওয়ার চেক',
        servicesOffered: ['প্রেসক্রিপশন ফ্রেম', 'ব্লু-কাট লেন্স', 'সানগ্লাস'],
      },
    ],
  },

  // 27. দাঁতের সেবা ও ডেন্টাল
  'dental-care': {
    id: 'dental-care',
    label: 'ডেন্টাল ক্লিনিক ও দাঁতের সেবা',
    englishLabel: 'Dental Care & Surgery',
    tagline: 'দাঁত তোলা, রুট ক্যানেল, স্কেলিং ও ডেন্টাল ইমপ্ল্যান্ট বিশেষজ্ঞ',
    group: 'health',
    groupLabel: 'স্বাস্থ্য ও চিকিৎসা',
    icon: Smile,
    themeColor: {
      text: 'text-sky-700',
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      badgeBg: 'bg-sky-600 text-white',
      gradient: 'from-sky-600 to-blue-700',
    },
    availableHours: 'সকাল ৯:০০ - রাত ৮:০০',
    overview:
      'বিডিএস ডেন্টাল সার্জন দ্বারা ব্যথাহীন দাঁত তোলা, রুট ক্যানেল, ক্যাপ পরানো ও দাঁত পরিষ্কার (স্কেলিং)।',
    listings: [
      {
        id: 'dnt-1',
        title: 'কুষ্টিয়া ডেন্টাল কেয়ার ও ইমপ্ল্যান্ট সেন্টার',
        upazila: 'কুষ্টিয়া সদর',
        address: 'সিরাজউদ্দৌলা রোড, হাসপাতাল মোড়, কুষ্টিয়া',
        phone: '01712-445588',
        workingHours: 'বিকাল ৩:০০ - রাত ৯:০০',
        badge: 'বিডিএস ডেন্টাল সার্জন',
        badgeType: 'verified',
        servicesOffered: ['রুট ক্যানেল ট্রিটমেন্ট', 'দাঁতের স্কেলিং ও পলিশিং', 'দাঁতের ক্যাপ'],
      },
    ],
  },

  // 28. জিম ও ফিটনেস
  fitness: {
    id: 'fitness',
    label: 'জিম ও ফিটনেস সেন্টার',
    englishLabel: 'Gym & Fitness Center',
    tagline: 'বডি বিল্ডিং, ওয়েট লস, কার্ডিও ওয়ার্কআউট ও ট্রেইনার গাইড',
    group: 'daily',
    groupLabel: 'দৈনন্দিন ও বাজার',
    icon: Dumbbell,
    themeColor: {
      text: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      badgeBg: 'bg-rose-600 text-white',
      gradient: 'from-rose-600 to-red-700',
    },
    availableHours: 'সকাল ৬:০০ - রাত ১০:০০',
    overview:
      'আধুনিক ব্যায়ামাগার, মহিলা ও পুরুষের আলাদা শিফট এবং দক্ষ ট্রেইনারের তত্ত্বাবধানে বডি ফিটনেস ট্রেনিং।',
    listings: [
      {
        id: 'fit-1',
        title: 'আয়রন ফিটনেস ক্লাব ও জিম',
        upazila: 'কুষ্টিয়া সদর',
        address: 'মজমপুর গেট, কুষ্টিয়া',
        phone: '01717-332211',
        workingHours: 'সকাল ৬:০০-১০:০০ এবং বিকাল ৪:০০-রাত ১০:০০',
        badge: 'আধুনিক যন্ত্রপাতি ও এসি জিম',
        badgeType: 'popular',
        servicesOffered: ['ওয়েট ট্রেনিং', 'কার্ডিও ট্রেডমিল', 'ডায়েট প্ল্যান ও ট্রেইনার'],
      },
    ],
  },

  // 29. খেলাধুলা ও স্পোর্টস
  sports: {
    id: 'sports',
    label: 'খেলাধুলা ও স্পোর্টস ক্লাব',
    englishLabel: 'Sports Club & Gear',
    tagline: 'ক্রিকেট ও ফুটবল সরঞ্জাম, টুর্নামেন্ট ও স্পোর্টস একাডেমি',
    group: 'daily',
    groupLabel: 'দৈনন্দিন ও বাজার',
    icon: Trophy,
    themeColor: {
      text: 'text-yellow-700',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      badgeBg: 'bg-yellow-600 text-white',
      gradient: 'from-yellow-600 to-amber-700',
    },
    availableHours: 'সকাল ৯:০০ - রাত ৮:০০',
    overview:
      'ক্রিকেট ব্যাট, বল, জার্সি, ট্রফি এবং কুষ্টিয়া জেলা ক্রীড়া সংস্থার স্টেডিয়াম ও প্রশিক্ষণ ক্লাবের তথ্য।',
    listings: [
      {
        id: 'spr-1',
        title: 'কুষ্টিয়া জেলা ক্রীড়া সংস্থা ও স্টেডিয়াম',
        upazila: 'কুষ্টিয়া সদর',
        address: 'কুষ্টিয়া স্টেডিয়াম সংলগ্ন, কুষ্টিয়া',
        phone: '071-61122',
        workingHours: 'সকাল ৯:০০ - বিকাল ৫:০০',
        badge: 'জেলা ক্রীড়া সংস্থা',
        badgeType: 'govt',
        servicesOffered: ['ক্রিকেট ও ফুটবল প্রশিক্ষণ', 'মাঠ বুকিং', 'টুর্নামেন্ট আয়োজন'],
      },
      {
        id: 'spr-2',
        title: 'উইনার স্পোর্টস জোন',
        upazila: 'কুষ্টিয়া সদর',
        address: 'এনএস রোড, থানা মোড়',
        phone: '01719-778899',
        workingHours: 'সকাল ১০:০০ - রাত ৯:০০',
        badge: 'অরিজিনাল স্পোর্টস গিয়ার',
        servicesOffered: ['ক্রিকেট ব্যাট ও কিটব্যাগ', 'কাস্টমাইজড জার্সি প্রিন্টিং'],
      },
    ],
  },

  // 30. বাণিজ্যিক ডিরেক্টরি
  'business-directory': {
    id: 'business-directory',
    label: 'বাণিজ্যিক ডিরেক্টরি',
    englishLabel: 'Business Directory & Ads',
    tagline: 'কুষ্টিয়ার স্থানীয় ব্যবসা প্রতিষ্ঠান, পাইকারি আড়ত ও উদ্যোক্তা তালিকা',
    group: 'finance',
    groupLabel: 'ব্যাংক ও অর্থ',
    icon: Briefcase,
    themeColor: {
      text: 'text-blue-800',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badgeBg: 'bg-blue-700 text-white',
      gradient: 'from-blue-700 to-slate-800',
    },
    availableHours: '২৪/৭ ডিরেক্টরি লাইভ',
    overview:
      'কুষ্টিয়া জেলার বিশিষ্ট মিল-কারখানা, তাঁত শিল্প, চালকল, মিষ্টির দোকান (তিলের খাজা), ও ব্যবসায়ী সমিতির ফোন নম্বর ও ঠিকানা।',
    listings: [
      {
        id: 'bs-1',
        title: 'কুষ্টিয়া চেম্বার অব কমার্স অ্যান্ড ইন্ডাস্ট্রিজ',
        upazila: 'কুষ্টিয়া সদর',
        address: 'এনএস রোড, কুষ্টিয়া সদর',
        phone: '02-477781030',
        workingHours: 'রবি-বৃহস্পতি ০৯:০০ - ০৫:০০',
        badge: 'ব্যবসায়ী সমিতি',
        badgeType: 'govt',
        servicesOffered: ['ট্রেড সার্টিফিকেট', 'ব্যবসায়িক পরামর্শ', 'মেলা ও বাণিজ্য প্রদর্শনী'],
      },
      {
        id: 'bs-2',
        title: 'কুষ্টিয়ার বিখ্যাত তিলের খাজা আড়ত',
        upazila: 'কুষ্টিয়া সদর',
        address: 'মজমপুর ও বড় বাজার, কুষ্টিয়া',
        phone: '01711-224466',
        workingHours: 'সকাল ৮:০০ - রাত ৯:০০',
        badge: 'ঐতিহ্যবাহী খাবার',
        badgeType: 'popular',
        servicesOffered: ['অরিজিনাল তিলের খাজা', 'সারাদেশে পাইকারি ও খুচরা পার্সেল'],
      },
    ],
  },

  // 31. হাসপাতাল ও ক্লিনিক
  hospital: {
    id: 'hospital',
    label: 'হাসপাতাল ও ক্লিনিক',
    englishLabel: 'Hospitals & Medical Centers',
    tagline: '২৫০ শয্যা জেনারেল হাসপাতাল, ডায়াগনস্টিক ও জরুরি কেবিন',
    group: 'health',
    groupLabel: 'স্বাস্থ্য ও চিকিৎসা',
    icon: Building2,
    themeColor: {
      text: 'text-red-700',
      bg: 'bg-red-50',
      border: 'border-red-200',
      badgeBg: 'bg-red-600 text-white',
      gradient: 'from-red-600 to-rose-700',
    },
    emergencyHotline: '01712-409949',
    availableHours: 'জরুরি বিভাগ ২৪ ঘণ্টা খোলা',
    overview:
      'কুষ্টিয়া ২৫০ শয্যা বিশিষ্ট সদর হাসপাতাল ও বিভিন্ন বেসরকারি ক্লিনিকের ইমার্জেন্সি সাপোর্ট, আইসিইউ ও অ্যাম্বুলেন্স।',
    listings: [
      {
        id: 'hsp-1',
        title: 'কুষ্টিয়া ২৫০ শয্যা বিশিষ্ট জেনারেল হাসপাতাল',
        upazila: 'কুষ্টিয়া সদর',
        address: 'হাসপাতাল মোড়, সিরাজউদ্দৌলা রোড, কুষ্টিয়া',
        phone: '02-477781020',
        altPhone: '01712-000000',
        workingHours: '২৪ ঘণ্টা জরুরি বিভাগ',
        badge: 'সরকারি প্রধান হাসপাতাল',
        badgeType: 'emergency',
        servicesOffered: ['জরুরি বিভাগ ও ওটি', 'আইসিইউ ও সিসিইউ', 'প্যাথলজি ও এক্স-রে', 'সরকারি ওষুধ'],
      },
    ],
  },

  // 32. ডাক্তার ও বিশেষজ্ঞ
  doctor: {
    id: 'doctor',
    label: 'ডাক্তার ও বিশেষজ্ঞ',
    englishLabel: 'Doctors & Specialists',
    tagline: 'মেডিসিন, হৃদরোগ, শিশু, গাইনি ও সার্জারি বিশেষজ্ঞের সিরিয়াল',
    group: 'health',
    groupLabel: 'স্বাস্থ্য ও চিকিৎসা',
    icon: Stethoscope,
    themeColor: {
      text: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badgeBg: 'bg-blue-600 text-white',
      gradient: 'from-blue-600 to-indigo-700',
    },
    availableHours: 'সিরিয়াল সকাল ৮:০০ - রাত ৮:০০',
    overview:
      'কুষ্টিয়া মেডিকেল কলেজ ও সদর হাসপাতালের স্বনামধন্য ডাক্তারদের চেম্বার, ভিজিটিং সময় ও সিরিয়ালের নম্বর।',
    listings: [
      {
        id: 'doc-1',
        title: 'মেডিসিন ও ডায়াবেটিস বিশেষজ্ঞ চেম্বার',
        upazila: 'কুষ্টিয়া সদর',
        address: 'হাসপাতাল মোড়, কুষ্টিয়া',
        phone: '01713-998877',
        workingHours: 'প্রতিদিন বিকাল ৪:০০ - রাত ৯:০০',
        badge: 'এমবিবিএস, এফসিপিএস',
        badgeType: 'verified',
        servicesOffered: ['ডায়াবেটিস নিয়ন্ত্রণ', 'উচ্চ রক্তচাপ চিকিৎসা', 'সাধারণ রোগ পরীক্ষা'],
      },
    ],
  },

  // 33. রক্তদাতা
  blood: {
    id: 'blood',
    label: 'রক্তদাতা ও ব্লাড ব্যাংক',
    englishLabel: 'Blood Donors & Blood Bank',
    tagline: 'জরুরি রক্তের প্রয়োজনে রক্তদাতা অনুসন্ধান ও সন্ধান',
    group: 'emergency',
    groupLabel: 'জরুরি ও নিরাপত্তা',
    icon: Droplet,
    themeColor: {
      text: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      badgeBg: 'bg-rose-600 text-white',
      gradient: 'from-rose-600 to-red-700',
    },
    emergencyHotline: '01700-000000',
    availableHours: '২৪ ঘণ্টা ফ্রি রক্ত সহায়তা',
    overview:
      'কুষ্টিয়ার স্বেচ্ছাসেবী রক্তদাতা ফোরাম ও ব্লাড ব্যাংকের সাথে অবিলম্বে যোগাযোগ করে যেকোনো গ্রুপের রক্ত সংগ্রহ করুন।',
    listings: [
      {
        id: 'bld-1',
        title: 'কুষ্টিয়া রেড ক্রিসেন্ট ব্লাড সেন্টার',
        upazila: 'কুষ্টিয়া সদর',
        address: 'রেড ক্রিসেন্ট ভবন, মজমপুর, কুষ্টিয়া',
        phone: '01711-002244',
        workingHours: '২৪ ঘণ্টা হটলাইন',
        badge: 'ব্লাড ব্যাংক',
        badgeType: 'emergency',
        servicesOffered: ['ক্রসম্যাচিং ও স্ক্রিনিং', 'প্লাটিলেট ও হোল ব্লাড', 'স্বেচ্ছায় রক্তদান'],
      },
    ],
  },

  // 34. রক্তের অনুরোধ
  'blood-request': {
    id: 'blood-request',
    label: 'রক্তের লাইভ অনুরোধ',
    englishLabel: 'Live Blood Requests',
    tagline: 'জরুরি রোগীর রক্তের প্রয়োজনীয়তার লাইভ বোর্ড ও নোটিফিকেশন',
    group: 'emergency',
    groupLabel: 'জরুরি ও নিরাপত্তা',
    icon: HeartHandshake,
    themeColor: {
      text: 'text-red-700',
      bg: 'bg-red-50',
      border: 'border-red-200',
      badgeBg: 'bg-red-600 text-white',
      gradient: 'from-red-600 to-rose-700',
    },
    availableHours: 'লাইভ বোর্ড ২৪/৭ আপডেট',
    overview:
      'কুষ্টিয়া জেলার বিভিন্ন হাসপাতালে চিকিৎসাধীন জরুরি রোগীদের রক্তের সরাসরি রিকোয়েস্ট পোস্ট ও সহায়তা প্রদান।',
    listings: [
      {
        id: 'brq-1',
        title: 'জরুরি ব্লাড রেসপন্স টিম, কুষ্টিয়া',
        upazila: 'কুষ্টিয়া সদর',
        address: 'সদর হাসপাতাল সংলগ্ন',
        phone: '01715-990011',
        workingHours: '২৪ ঘণ্টা অন-কল',
        badge: 'স্বেচ্ছাসেবী হেল্পলাইন',
        badgeType: 'emergency',
        servicesOffered: ['জরুরি রক্তদাতা ম্যানেজ', 'হাসপাতালে সরাসরি যোগাযোগ'],
      },
    ],
  },

  // 35. জরুরি হেল্পলাইন (৯৯৯)
  emergency: {
    id: 'emergency',
    label: 'জরুরি হেল্পলাইন সেবা (৯৯৯)',
    englishLabel: 'Emergency Helplines',
    tagline: 'জাতীয় ৯৯৯, নারী নির্যাতন প্রতিরোধ ১০৯ ও বিদ্যুৎ জরুরি নম্বর',
    group: 'emergency',
    groupLabel: 'জরুরি ও নিরাপত্তা',
    icon: PhoneCall,
    themeColor: {
      text: 'text-red-700',
      bg: 'bg-red-50',
      border: 'border-red-200',
      badgeBg: 'bg-red-600 text-white',
      gradient: 'from-red-600 to-rose-800',
    },
    emergencyHotline: '999',
    availableHours: '২৪/৭ টোল-ফ্রি',
    overview:
      'পুলিশ, অ্যাম্বুলেন্স, ফায়ার সার্ভিস, নারী ও শিশু নির্যাতন প্রতিরোধে সরকারি টোল-ফ্রি নম্বর।',
    listings: [
      {
        id: 'emg-1',
        title: 'জাতীয় জরুরি সেবা ৯৯৯ (টোল-ফ্রি)',
        upazila: 'সব উপজেলা',
        address: 'সারাদেশে যেকোনো ফোন থেকে সরাসরি',
        phone: '999',
        workingHours: '২৪ ঘণ্টা নিরবচ্ছিন্ন',
        badge: 'জাতীয় হটলাইন',
        badgeType: 'emergency',
        servicesOffered: ['পুলিশ সহায়তা', 'ফায়ার সার্ভিস', 'অ্যাম্বুলেন্স কল'],
      },
      {
        id: 'emg-2',
        title: 'নারী ও শিশু নির্যাতন প্রতিরোধ ১০৯',
        upazila: 'সব উপজেলা',
        address: 'জাতীয় হেল্পলাইন',
        phone: '109',
        workingHours: '২৪ ঘণ্টা টোল-ফ্রি',
        badge: 'সরকারি হেল্পলাইন',
        badgeType: 'govt',
        servicesOffered: ['বাল্যবিয়ে প্রতিরোধ', 'নির্যাতন প্রতিকার ও আইনি সহায়তা'],
      },
    ],
  },

  // 36. মোবাইল মেকার
  'mobile-maker': {
    id: 'mobile-maker',
    label: 'মোবাইল মেরামত ও পার্টস',
    englishLabel: 'Mobile Phone Servicing',
    tagline: 'ডিসপ্লে পরিবর্তন, সফটওয়্যার ফ্ল্যাশ, মাদারবোর্ড ও চার্জিং সকেট মেরামত',
    group: 'handyman',
    groupLabel: 'মিস্ত্রি ও কারিগরি',
    icon: Smartphone,
    themeColor: {
      text: 'text-indigo-700',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      badgeBg: 'bg-indigo-600 text-white',
      gradient: 'from-indigo-600 to-purple-700',
    },
    availableHours: 'সকাল ১০:০০ - রাত ৯:০০',
    overview:
      'আইফোন, স্যামসাং, শাওমি ও অন্যান্য স্মার্টফোনের অরিজিনাল ডিসপ্লে ফিটিং ও সফটওয়্যার আনলক।',
    listings: [
      {
        id: 'mb-1',
        title: 'কুষ্টিয়া মোবাইল কেয়ার ও মাস্টার ল্যাব',
        upazila: 'কুষ্টিয়া সদর',
        address: 'এনএস রোড, কোর্ট স্টেশন মার্কেট, কুষ্টিয়া',
        phone: '01712-667788',
        workingHours: 'সকাল ১০:০০ - রাত ৯:০০',
        badge: 'লেজার ডিসপ্লে ও আইসি স্পেশালিস্ট',
        badgeType: 'verified',
        servicesOffered: ['অরিজিনাল ডিসপ্লে প্রতিস্থাপন', 'মাদারবোর্ড মেরামত', 'এফআরপি আনলক ও ফ্ল্যাশ'],
      },
    ],
  },

  // 37. ইলেকট্রিশিয়ান
  electrician: {
    id: 'electrician',
    label: 'ইলেকট্রিশিয়ান ও ওয়্যারিং',
    englishLabel: 'Electrician & Home Wiring',
    tagline: 'বাসা-বাড়ির শর্ট-সার্কিট, ওয়্যারিং, ফ্যান, লাইট ও মোটর মিস্ত্রি',
    group: 'handyman',
    groupLabel: 'মিস্ত্রি ও কারিগরি',
    icon: Zap,
    themeColor: {
      text: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      badgeBg: 'bg-amber-600 text-white',
      gradient: 'from-amber-600 to-yellow-700',
    },
    availableHours: 'সকাল ৮:০০ - রাত ১০:০০ (অন-কল ২৪/৭)',
    overview:
      'বিদ্যুৎ না থাকা, মিটার মেরামত, সাব-মার্সিবল মোটর ওয়্যারিং ও জরুরি ইলেকট্রিক সমস্যা সমাধানে দক্ষ ইলেকট্রিশিয়ান।',
    listings: [
      {
        id: 'el-1',
        title: 'মাস্টার ইলেকট্রিক ও অন-কল মিস্ত্রি সার্ভিস',
        upazila: 'কুষ্টিয়া সদর',
        address: 'মজমপুর, কুষ্টিয়া সদর',
        phone: '01719-334411',
        workingHours: 'সকাল ৮:০০ - রাত ১০:০০',
        badge: 'অন-কল হোম সার্ভিস',
        badgeType: 'popular',
        servicesOffered: ['নতুন বাসা ওয়্যারিং', 'সার্কিট ব্রেকার সমস্যা', 'আইপিএস ও ইউপিএস ইনস্টলেশন'],
      },
    ],
  },

  // 38. প্লাম্বার ও পাইপ ফিটিং
  plumber: {
    id: 'plumber',
    label: 'প্লাম্বার ও পাইপ ফিটিং',
    englishLabel: 'Plumber & Sanitary Fitting',
    tagline: 'পানির পাইপ লিক, বেসিন, কমোড ও পানির পাম্প সার্ভিসিং',
    group: 'handyman',
    groupLabel: 'মিস্ত্রি ও কারিগরি',
    icon: Wrench,
    themeColor: {
      text: 'text-cyan-700',
      bg: 'bg-cyan-50',
      border: 'border-cyan-200',
      badgeBg: 'bg-cyan-600 text-white',
      gradient: 'from-cyan-600 to-blue-700',
    },
    availableHours: 'সকাল ৮:০০ - রাত ৮:০০',
    overview:
      'বাথরুম স্যানিটারি ফিটিংস, পানির ট্যাংকি ওয়াশ, মোটরের পাইপ সংযোগ ও লিকেজ বন্ধে অভিজ্ঞ প্লাম্বার।',
    listings: [
      {
        id: 'plm-1',
        title: 'কুষ্টিয়া স্যানিটারি ও প্লাম্বিং ওয়ার্কস',
        upazila: 'কুষ্টিয়া সদর',
        address: 'কাটাখানা মোড়, কুষ্টিয়া সদর',
        phone: '01815-223344',
        workingHours: 'সকাল ৮:০০ - রাত ৮:০০',
        badge: 'অভিজ্ঞ প্লাম্বার',
        badgeType: 'verified',
        servicesOffered: ['পানির লাইন লিকেজ মেরামত', 'গিজার স্থাপন', 'টয়লেট স্যানিটারি ফিটিং'],
      },
    ],
  },

  // 39. এসি ও ফ্রিজ মেকানিক
  'ac-mechanic': {
    id: 'ac-mechanic',
    label: 'এসি ও ফ্রিজ মেকানিক',
    englishLabel: 'AC & Refrigerator Repair',
    tagline: 'এসি গ্যাস রিফিল, সার্ভিসিং ও ডিপ ফ্রিজ কুলিং মেরামত',
    group: 'handyman',
    groupLabel: 'মিস্ত্রি ও কারিগরি',
    icon: Snowflake,
    themeColor: {
      text: 'text-sky-700',
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      badgeBg: 'bg-sky-600 text-white',
      gradient: 'from-sky-600 to-indigo-700',
    },
    availableHours: 'সকাল ৯:০০ - রাত ৯:০০',
    overview:
      'বাসা ও অফিসের ইনভার্টার/নন-ইনভার্টার এসি ইন্সটলেশন, সার্ভিসিং, গ্যাস চার্জ এবং ফ্রিজ ঠাণ্ডা না হওয়া সমস্যার তাৎক্ষণিক সমাধান।',
    listings: [
      {
        id: 'ac-1',
        title: 'কুলিং কেয়ার এসি ও রেফ্রিজারেশন',
        upazila: 'কুষ্টিয়া সদর',
        address: 'বাইপাস মোড়, মজমপুর, কুষ্টিয়া',
        phone: '01718-990022',
        workingHours: 'সকাল ৯:০০ - রাত ৯:০০',
        badge: 'হোম সার্ভিস উপলব্ধ',
        badgeType: 'popular',
        servicesOffered: ['এসি মাস্টার সার্ভিসিং', 'গ্যাস রিফিল', 'ফ্রিজ গ্যাস ও কম্প্রেসার মেরামত'],
      },
    ],
  },

  // 40. ড্রাইভার
  driver: {
    id: 'driver',
    label: 'পেশাদার ড্রাইভার',
    englishLabel: 'Professional Drivers',
    tagline: 'অভিজ্ঞ প্রাইভেট কার, মাইক্রোবাস ও মাসিক চুক্তির ড্রাইভার',
    group: 'transport',
    groupLabel: 'যাতায়াত ও ভাড়া',
    icon: Car,
    themeColor: {
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      badgeBg: 'bg-emerald-600 text-white',
      gradient: 'from-emerald-600 to-teal-700',
    },
    availableHours: '২৪ ঘণ্টা অন-কল বুকিং',
    overview:
      'বৈধ ড্রাইভিং লাইসেন্সধারী দক্ষ চালক দৈনিক, দূরপাল্লার ট্রিপ বা মাসিক ভিত্তিতে ড্রাইভার হায়ার করুন।',
    listings: [
      {
        id: 'drv-1',
        title: 'কুষ্টিয়া ড্রাইভার কল্যাণ সমিতি',
        upazila: 'কুষ্টিয়া সদর',
        address: 'মজমপুর বাস টার্মিনাল চত্বর, কুষ্টিয়া',
        phone: '01714-332211',
        workingHours: '২৪ ঘণ্টা যোগাযোগ',
        badge: 'লাইসেন্সধারী ও ভেরিফাইড',
        badgeType: 'verified',
        servicesOffered: ['দৈনিক কার ড্রাইভার', 'ঢাকা ট্রিপ অভিজ্ঞ ড্রাইভার', 'মাসিক চুক্তিভিত্তিক চালক'],
      },
    ],
  },

  // 41. গৃহশিক্ষক ও গৃহশিক্ষিকা
  tutor: {
    id: 'tutor',
    label: 'গৃহশিক্ষক ও টিউটর',
    englishLabel: 'Home Tutors & Mentors',
    tagline: 'গণিত, ইংরেজি, বিজ্ঞান ও বিভিন্ন শ্রেণির অভিজ্ঞ টিউটর সন্ধান',
    group: 'education',
    groupLabel: 'শিক্ষা ও ক্যারিয়ার',
    icon: BookOpen,
    themeColor: {
      text: 'text-purple-700',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      badgeBg: 'bg-purple-600 text-white',
      gradient: 'from-purple-600 to-pink-700',
    },
    availableHours: 'সকাল ৯:০০ - রাত ৯:০০',
    overview:
      'ইবি ও কুষ্টিয়া সরকারি কলেজের মেধাবী শিক্ষার্থী এবং অভিজ্ঞ শিক্ষকদের মাধ্যমে নার্সারি থেকে এইচএসসি পর্যন্ত হোম ও অনলাইন টিউশন।',
    listings: [
      {
        id: 'tut-1',
        title: 'কুষ্টিয়া টিউটর মিডিয়া ও কেয়ার',
        upazila: 'কুষ্টিয়া সদর',
        address: 'কলেজ মোড়, কুষ্টিয়া সদর',
        phone: '01719-887766',
        workingHours: 'সকাল ১০:০০ - রাত ৮:০০',
        badge: 'মেধাবী টিউটর প্রদান',
        badgeType: 'verified',
        servicesOffered: ['১ম-১০ম শ্রেণি অল সাবজেক্ট', 'এইচএসসি ফিজিক্স/কেমিস্ট্রি/ম্যাথ', 'ইংরেজি স্পোকেন'],
      },
    ],
  },

  // 42. রেস্তোরাঁ ও খাবার
  food: {
    id: 'food',
    label: 'রেস্তোরাঁ ও হোমমেড খাবার',
    englishLabel: 'Restaurants & Home Catering',
    tagline: 'কুষ্টিয়ার কুলফি মালাই, কাচ্চি বিরিয়ানি ও হোম ডেলিভারি খাবার',
    group: 'daily',
    groupLabel: 'দৈনন্দিন ও বাজার',
    icon: UtensilsCrossed,
    themeColor: {
      text: 'text-orange-700',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      badgeBg: 'bg-orange-600 text-white',
      gradient: 'from-orange-600 to-red-700',
    },
    availableHours: 'সকাল ১০:০০ - রাত ১১:০০',
    overview:
      'স্বাদ ও ঐতিহ্যে ভরপুর কুষ্টিয়ার সুস্বাদু খাবার, পার্টি ক্যাটারিং ও দ্রুত হোম ডেলিভারি সেবা।',
    listings: [
      {
        id: 'fd-1',
        title: 'কুষ্টিয়া রাজমহল রেস্তোরাঁ ও ক্যাফে',
        upazila: 'কুষ্টিয়া সদর',
        address: 'এনএস রোড, থানা মোড়, কুষ্টিয়া',
        phone: '01712-443355',
        workingHours: 'সকাল ১০:০০ - রাত ১০:৩০',
        badge: 'পরিচ্ছন্ন ও সুস্বাদু খাবার',
        badgeType: 'popular',
        servicesOffered: ['বিরিয়ানি ও কাচ্চি', 'চাইনিজ ও ফাস্ট ফুড', 'ক্যাটারিং সার্ভিস'],
      },
    ],
  },

  // 43. হারানো ও প্রাপ্তি
  'lost-found': {
    id: 'lost-found',
    label: 'হারানো ও প্রাপ্তি ডেস্ক',
    englishLabel: 'Lost & Found Notice',
    tagline: 'হারিয়ে যাওয়া বা খুঁজে পাওয়া কাগজপত্র, মোবাইল ও ব্যক্তির তথ্য প্রচার',
    group: 'emergency',
    groupLabel: 'জরুরি ও নিরাপত্তা',
    icon: Search,
    themeColor: {
      text: 'text-teal-700',
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      badgeBg: 'bg-teal-600 text-white',
      gradient: 'from-teal-600 to-emerald-700',
    },
    availableHours: '২৪ ঘণ্টা নোটিশ লাইভ',
    overview:
      'এনআইডি, শিক্ষাসনদ, ব্যাগ বা প্রয়োজনীয় জিনিসপত্র হারিয়ে গেলে বা কুড়িয়ে পেলে জনস্বার্থে তাৎক্ষণিক বিজ্ঞপ্তি প্রকাশ করুন।',
    listings: [
      {
        id: 'lf-1',
        title: 'নাগরিক হারানো ও প্রাপ্তি হেল্পডেস্ক',
        upazila: 'সব উপজেলা',
        address: 'অনলাইন নাগরিক সেবা প্ল্যাটফর্ম',
        phone: '01700-000000',
        workingHours: '২৪/৭ লাইভ',
        badge: 'জনস্বার্থে সেবা',
        servicesOffered: ['হারানো পোস্ট অনুমোদন', 'উদ্ধার ও হস্তান্তর সহায়তা'],
      },
    ],
  },

  // 44. আইনি সহায়তা ও উকিল
  legal: {
    id: 'legal',
    label: 'আইনি সহায়তা ও অ্যাডভোকেট',
    englishLabel: 'Legal Aid & Advocates',
    tagline: 'কুষ্টিয়া জজ কোর্ট, দেওয়ানি, ফৌজদারি ও দলিলের অভিজ্ঞ আইনজীবী',
    group: 'govt',
    groupLabel: 'সরকারি দপ্তর',
    icon: Scale,
    themeColor: {
      text: 'text-stone-800',
      bg: 'bg-stone-100',
      border: 'border-stone-300',
      badgeBg: 'bg-stone-700 text-white',
      gradient: 'from-stone-700 to-slate-800',
    },
    availableHours: 'সকাল ১০:০০ - সন্ধ্যা ৭:০০',
    overview:
      'জমি-জমা সংক্রান্ত সমস্যা, পারিবারিক আইন, দেওয়ানি ও ফৌজদারি মামলায় অভিজ্ঞ আইনজীবীর পরামর্শ ও সরকারি লিগ্যাল এইড।',
    listings: [
      {
        id: 'lg-1',
        title: 'জেলা লিগ্যাল এইড অফিস (বিনামূল্যে আইনি সেবা)',
        upazila: 'কুষ্টিয়া সদর',
        address: 'জেলা ও দায়রা জজ আদালত ভবন, কুষ্টিয়া',
        phone: '16430',
        workingHours: 'রবি-বৃহস্পতি ০৯:০০ - ০৫:০০',
        badge: 'সরকারি বিনামূল্যে আইনি সেবা',
        badgeType: 'govt',
        servicesOffered: ['বিনামূল্যে আইনজীবী নিয়োগ', 'আপস-মীমাংসা', 'আইনি পরামর্শ'],
      },
    ],
  },

  // 45. ক্রাইম রিপোর্টার
  'crime-reporter': {
    id: 'crime-reporter',
    label: 'ক্রাইম রিপোর্টার ও অভিযোগ',
    englishLabel: 'Crime Reporter & Grievance',
    tagline: 'পরিচয় গোপন রেখে অপরাধ, মাদক, ইভটিজিং ও নাগরিক সমস্যা রিপোর্ট',
    group: 'emergency',
    groupLabel: 'জরুরি ও নিরাপত্তা',
    icon: ShieldAlert,
    themeColor: {
      text: 'text-purple-700',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      badgeBg: 'bg-purple-600 text-white',
      gradient: 'from-purple-600 to-red-700',
    },
    availableHours: 'গোপন রিপোর্ট ২৪ ঘণ্টা চালু',
    overview:
      'আপনার এলাকার মাদক ব্যবসা, চাঁদাবাজি, কিশোর গ্যাং বা যে কোনো অন্যায় সম্পর্কে সংশ্লিষ্ট কর্তৃপক্ষকে নিরাপদভাবে অবগত করুন।',
    listings: [
      {
        id: 'crp-1',
        title: 'র‍্যাব-১২ কুষ্টিয়া ক্যাম্প কন্ট্রোল রুম',
        upazila: 'কুষ্টিয়া সদর',
        address: 'সিপাহীপাড়া, কুষ্টিয়া সদর',
        phone: '01777-711200',
        workingHours: '২৪ ঘণ্টা হটলাইন',
        badge: 'র‍্যাব কন্ট্রোল রুম',
        badgeType: 'emergency',
        servicesOffered: ['মাদক বিরোধী অভিযান', 'সন্ত্রাস দমন', 'গোপন তথ্য যাচাই'],
      },
    ],
  },

  // 46. সিটিজেন ফান্ড
  'citizen-fund': {
    id: 'citizen-fund',
    label: 'সিটিজেন রিলিফ ফান্ড',
    englishLabel: 'Citizen Relief & Donation',
    tagline: 'অসহায় রোগীদের চিকিৎসা ও দুর্যোগে স্বচ্ছ নাগরিক সহায়তা তহবিল',
    group: 'emergency',
    groupLabel: 'জরুরি ও নিরাপত্তা',
    icon: Heart,
    themeColor: {
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      badgeBg: 'bg-emerald-600 text-white',
      gradient: 'from-emerald-600 to-teal-700',
    },
    availableHours: 'অনলাইন অনুদান ২৪/৭',
    overview:
      '১০০% স্বচ্ছতার সাথে দরিদ্র রোগী, পথশিশু ও শীতার্ত মানুষের সরাসরি সহায়তা প্রদানে নাগরিক ফান্ডে অংশ নিন।',
    listings: [
      {
        id: 'cf-1',
        title: 'কুষ্টিয়া মানবকল্যাণ ও সিটিজেন ট্রাস্ট',
        upazila: 'কুষ্টিয়া সদর',
        address: 'থানাপাড়া, কুষ্টিয়া',
        phone: '01711-550099',
        workingHours: 'সকাল ৯:০০ - সন্ধ্যা ৬:০০',
        badge: 'স্বচ্ছ নাগরিক তহবিল',
        badgeType: 'verified',
        servicesOffered: ['দরিদ্র চিকিৎসা অনুদান', 'শিক্ষা সহায়তা', 'ত্রাণ বিতরণ'],
      },
    ],
  },

  // 47. সরকারি অফিস
  'govt-office': {
    id: 'govt-office',
    label: 'জেলা ও উপজেলা প্রশাসন',
    englishLabel: 'DC & UNO Offices',
    tagline: 'জেলা প্রশাসক (ডিসি), ইউএনও কার্যালয় ও সরকারি সিটিজেন চার্টার',
    group: 'govt',
    groupLabel: 'সরকারি দপ্তর',
    icon: Landmark,
    themeColor: {
      text: 'text-green-800',
      bg: 'bg-green-50',
      border: 'border-green-200',
      badgeBg: 'bg-green-700 text-white',
      gradient: 'from-green-700 to-emerald-900',
    },
    availableHours: 'রবি-বৃহস্পতি ০৯:০০ - ০৫:০০',
    overview:
      'কুষ্টিয়া জেলা প্রশাসকের কার্যালয়, উপজেলা নির্বাহী কর্মকর্তা (ইউএনও) এবং প্রধান প্রশাসনিক ভবনের ফোন নম্বর ও সরাসরি সাক্ষাতের তথ্য।',
    listings: [
      {
        id: 'gvt-1',
        title: 'জেলা প্রশাসকের কার্যালয় (ডিসি অফিস), কুষ্টিয়া',
        upazila: 'কুষ্টিয়া সদর',
        address: 'কালেক্টরেট ভবন, কুষ্টিয়া সদর',
        phone: '02-477781000',
        altPhone: '01713-300100',
        workingHours: 'রবি-বৃহস্পতি ০৯:০০ - ০৫:০০',
        badge: 'জেলা প্রশাসন প্রধান',
        badgeType: 'govt',
        servicesOffered: ['জেলা নাগরিক সেবা', 'গণশুনানি (প্রতি বুধবার)', 'ত্রাণ ও দুর্যোগ ব্যবস্থাপনা'],
      },
      {
        id: 'gvt-2',
        title: 'উপজেলা নির্বাহী অফিসার (ইউএনও) কার্যালয়, কুষ্টিয়া সদর',
        upazila: 'কুষ্টিয়া সদর',
        address: 'উপজেলা পরিষদ চত্বর, কুষ্টিয়া সদর',
        phone: '01713-300110',
        workingHours: '০৯:০০ - ০৫:০০',
        badge: 'ইউএনও কার্যালয়',
        badgeType: 'govt',
        servicesOffered: ['উপজেলা প্রশাসনিক তদারকি', 'সরাসরি অভিযোগ গ্রহণ'],
      },
    ],
  },

  // 48. বাস ও ট্রেন
  'bus-train': {
    id: 'bus-train',
    label: 'বাস ও ট্রেন সময়সূচী',
    englishLabel: 'Bus & Train Schedules',
    tagline: 'কুষ্টিয়া কোর্ট ও পোড়াদহ জংশনের ট্রেন এবং ঢাকাগামী বাস টিকিট কাউন্টার',
    group: 'transport',
    groupLabel: 'যাতায়াত ও ভাড়া',
    icon: Train,
    themeColor: {
      text: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badgeBg: 'bg-blue-600 text-white',
      gradient: 'from-blue-600 to-indigo-800',
    },
    emergencyHotline: '131',
    availableHours: '২৪ ঘণ্টা রেল ও বাস সেবা',
    overview:
      'সুন্দরবন এক্সপ্রেস, বেনাপোল এক্সপ্রেস, মধুমতি এক্সপ্রেস ট্রেনের শিডিউল এবং এসবি, হানিফ, শ্যামলী বাসের কাউন্টার নম্বর।',
    onlinePortalUrl: 'https://eticket.railway.gov.bd',
    onlinePortalTitle: 'বাংলাদেশ রেলওয়ে অনলাইন টিকিট',
    listings: [
      {
        id: 'bt-1',
        title: 'কুষ্টিয়া কোর্ট রেলওয়ে স্টেশন',
        upazila: 'কুষ্টিয়া সদর',
        address: 'কোর্ট পাড়া, কুষ্টিয়া সদর',
        phone: '071-61500',
        workingHours: '২৪ ঘণ্টা ট্রেন চলাচল',
        badge: 'রেলওয়ে স্টেশন',
        badgeType: 'popular',
        servicesOffered: ['আন্তঃনগর ট্রেন টিকিট', 'যাত্রী বিশ্রামাগার', 'পার্সেল বুকিং'],
      },
      {
        id: 'bt-2',
        title: 'পোড়াদহ রেলওয়ে জংশন',
        upazila: 'মিরপুর',
        address: 'পোড়াদহ, মিরপুর, কুষ্টিয়া',
        phone: '071-63000',
        workingHours: '২৪ ঘণ্টা সচল',
        badge: 'প্রধান রেল জংশন',
        badgeType: 'popular',
        servicesOffered: ['উত্তর ও দক্ষিণাঞ্চলের ট্রেন কানেকশন', 'অনলাইন টিকিট প্রিন্ট'],
      },
      {
        id: 'bt-3',
        title: 'এসবি সুপার ডিলাক্স বাস কাউন্টার',
        upazila: 'কুষ্টিয়া সদর',
        address: 'মজমপুর বাসস্ট্যান্ড, কুষ্টিয়া',
        phone: '01711-404040',
        workingHours: 'সকাল ৫:০০ - রাত ১২:০০',
        badge: 'কুষ্টিয়া-ঢাকা রুট',
        badgeType: 'popular',
        servicesOffered: ['এসি ও নন-এসি বাস', 'অনলাইন অগ্রিম টিকিট'],
      },
    ],
  },

  // 49. দর্শনীয় স্থান
  'tourist-spot': {
    id: 'tourist-spot',
    label: 'দর্শনীয় স্থান ও পর্যটন',
    englishLabel: 'Tourist Attractions',
    tagline: 'বাউল সম্রাট লালন শাহ মাজার, রবীন্দ্রনাথের শিলাইদহ কুঠিবাড়ি ও গড়াই নদী',
    group: 'transport',
    groupLabel: 'যাতায়াত ও ভাড়া',
    icon: MapPin,
    themeColor: {
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      badgeBg: 'bg-emerald-600 text-white',
      gradient: 'from-emerald-600 to-teal-800',
    },
    availableHours: 'সকাল ৯:০০ - সন্ধ্যা ৬:০০',
    overview:
      'কুষ্টিয়া জেলার বিশ্ববিখ্যাত লালন শাহের মাজার (ছেউড়িয়া), শিলাইদহ রবীন্দ্র কুঠিবাড়ি, মীর মশাররফ হোসেনের স্মৃতি কমপ্লেক্স ও হার্ডিঞ্জ ব্রিজের বিস্তারিত তথ্য ও রুট গাইড।',
    listings: [
      {
        id: 'tr-1',
        title: 'বাউল সম্রাট লালন শাহের মাজার',
        upazila: 'কুমারখালী',
        address: 'ছেউড়িয়া, কুমারখালী, কুষ্টিয়া',
        phone: '01711-003355',
        workingHours: 'সকাল ৮:০০ - রাত ৯:০০',
        badge: 'বিশ্ব ঐতিহ্য ও সাংস্কৃতিক কেন্দ্র',
        badgeType: 'popular',
        servicesOffered: ['লালন সংগ্রহশালা', 'মুক্তমঞ্চ', 'বাউল গানের আসর', 'গাইড সেবা'],
      },
      {
        id: 'tr-2',
        title: 'শিলাইদহ রবীন্দ্র কুঠিবাড়ি',
        upazila: 'কুমারখালী',
        address: 'শিলাইদহ, কুমারখালী, কুষ্টিয়া',
        phone: '071-61011',
        workingHours: 'সকাল ৯:০০ - বিকাল ৫:০০ (রবিবার বন্ধ)',
        badge: 'প্রত্নতত্ত্ব অধিদপ্তর',
        badgeType: 'govt',
        servicesOffered: ['কবিগুরুর ব্যবহৃত সামগ্রী জাদুঘর', 'পদ্মাবোট স্মৃতি', 'ঐতিহাসিক দিঘি'],
      },
    ],
  },

  // 50. রাজমিস্ত্রি ও নির্মাণ কর্মী
  mason: {
    id: 'mason',
    label: 'রাজমিস্ত্রি ও নির্মাণ কর্মী',
    englishLabel: 'Masons & Construction Workers',
    tagline: 'বিল্ডিং ছাদ ঢালাই, ইটের গাঁথুনি, টাইলস ফিটিং ও রঙ মিস্ত্রি',
    group: 'handyman',
    groupLabel: 'মিস্ত্রি ও কারিগরি',
    icon: Hammer,
    themeColor: {
      text: 'text-stone-800',
      bg: 'bg-stone-100',
      border: 'border-stone-300',
      badgeBg: 'bg-stone-700 text-white',
      gradient: 'from-stone-700 to-amber-900',
    },
    availableHours: 'সকাল ৭:০০ - সন্ধ্যা ৭:০০',
    overview:
      'বাড়ি নির্মাণ, ছাদ ঢালাই, প্লাস্টার, ফ্লোর টাইলস বসানো ও সীমানা প্রাচীর নির্মাণের দক্ষ রাজমিস্ত্রি ও সহকারী দল।',
    listings: [
      {
        id: 'msn-1',
        title: 'কুষ্টিয়া নির্মাণ কারিগর ও রাজমিস্ত্রি দল',
        upazila: 'কুষ্টিয়া সদর',
        address: 'মজমপুর ও কাটাখানা, কুষ্টিয়া',
        phone: '01718-220011',
        workingHours: 'সকাল ৭:০০ - সন্ধ্যা ৬:০০',
        badge: 'অভিজ্ঞ হেডার মিস্ত্রি',
        badgeType: 'verified',
        servicesOffered: ['ছাদ ঢালাই ও সেন্টারিং', 'টাইলস ও মার্বেল ফিটিং', 'প্লাস্টার ও গাথুনি'],
      },
    ],
  },
};
