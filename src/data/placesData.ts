import kushtiaSadarImg from './../assets/images/kushtia_sadar_real_1792162949613.jpg';
import kumarkhaliImg from './../assets/images/kumarkhali_real_1792162972148.jpg';
import bheramaraImg from './../assets/images/bheramara_real_1792162988221.jpg';
import mirpurImg from './../assets/images/mirpur_real_1792163005012.jpg';
import khoksaImg from './../assets/images/khoksa_real_1792163021767.jpg';
import daulatpurImg from './../assets/images/daulatpur_real_1792163040379.jpg';
import lalonShrineImg from './../assets/images/lalon_shrine_kushtia_1792231883136.jpg';
import shilaidahaImg from './../assets/images/shilaidaha_kuthibari_kushtia_1792231900441.jpg';
import hardingeBridgeImg from './../assets/images/hardinge_bridge_kushtia_1792231913948.jpg';
import islamicUniImg from './../assets/images/islamic_university_kushtia_1792231929697.jpg';
import goraiBridgeImg from './../assets/images/gorai_bridge_kushtia_1792231944105.jpg';
import mirMosharrafImg from './../assets/images/mir_mosharraf_kushtia_1792231960121.jpg';
import renwickParkImg from './../assets/images/renwick_park_kushtia_1792231975956.jpg';
import kangalHarinathImg from './../assets/images/kangal_harinath_kushtia_1792231993301.jpg';
import jhaudiaMosqueImg from './../assets/images/jhaudia_mosque_kushtia_1792232030902.jpg';
import tagoreLodgeImg from './../assets/images/tagore_lodge_kushtia_1792232046055.jpg';

export interface PlaceItem {
  id: string;
  name: string;
  englishName: string;
  upazilaId: string;
  upazilaName: string;
  category: 'heritage' | 'nature' | 'education' | 'entertainment' | 'religious';
  categoryLabel: string;
  tagline: string;
  coverImage: string;
  galleryImages: string[];
  distanceFromZeroPoint: string;
  travelTime: string;
  entryFee: string;
  timings: string;
  established: string;
  architecture: string;
  overview: string;
  history: string;
  keyHighlights: string[];
  howToGo: {
    bus: string;
    localTransport: string;
    fareEstimate: string;
    routeTip: string;
  };
  tips: string[];
  nearbyAttractions: { name: string; distance: string; placeId?: string }[];
  emergencyContacts: {
    title: string;
    phone: string;
    role: string;
  }[];
  rating: number;
  reviewsCount: number;
  googleMapUrl: string;
}

export interface UpazilaItem {
  id: string;
  name: string;
  fullName: string;
  englishName: string;
  coverImage: string;
  galleryImages: string[];
  area: string;
  population: string;
  unionsCount: string;
  literacyRate: string;
  postCode: string;
  famousFor: string[];
  overview: string;
  history: string;
  rivers: string[];
  economy: string;
  topPlaceIds: string[];
  transportInfo: string;
  administrativeContacts: {
    designation: string;
    name?: string;
    phone: string;
    office: string;
  }[];
  emergencyContacts: {
    service: string;
    phone: string;
  }[];
  googleMapUrl: string;
}

export const KUSHTIA_PLACES: Record<string, PlaceItem> = {
  'lalon-shrine': {
    id: 'lalon-shrine',
    name: 'বাউল সম্রাট ফকির লালন শাহের মাজার',
    englishName: 'Lalon Shah Mazar & Akhra',
    upazilaId: 'kumarkhali',
    upazilaName: 'কুমারখালী উপজেলা',
    category: 'religious',
    categoryLabel: 'আধ্যাত্মিক ও সাংস্কৃতিক ঐতিহ্য',
    tagline: 'মানবতাবাদী বাউল ভাবধারার বিশ্বখ্যাত আধ্যাত্মিক মিলনকেন্দ্র',
    coverImage: lalonShrineImg,
    galleryImages: [
      lalonShrineImg,
      kumarkhaliImg
    ],
    distanceFromZeroPoint: 'কুষ্টিয়া মজমপুর থেকে ৪.৫ কিমি',
    travelTime: '১৫-২০ মিনিট (ইজিবাইক / অটোরিকশা)',
    entryFee: 'বিনামূল্যে উন্মুক্ত (জাদুঘর ফি: ২০ টাকা)',
    timings: 'প্রতিদিন সকাল ৬:০০ টা থেকে রাত ১০:০০ টা পর্যন্ত',
    established: '১৮৯০ খ্রিষ্টাব্দ (আধুনিক কমপ্লেক্স ও একাডেমি ১৯৬৩ সালে)',
    architecture: 'শুভ্র গম্বুজবিশিষ্ট শান্ত সমাধি কমপ্লেক্স, লালন একাডেমি মিলনায়তন ও গবেষণাগার',
    overview: 'কুষ্টিয়া শহরতলীর কুমারখালী উপজেলার ছেঁউড়িয়া গ্রামে অবস্থিত বাউল সাধক ফকির লালন শাহের সমাধি। এখানে প্রতি বছর দোল পূর্ণিমা ও লালন তিরোধান দিবসে দেশ-বিদেশের লক্ষাধিক বাউল, ভক্ত ও গবেষকের সমাগম ঘটে। মানবপ্রেম, জাতপাতহীন সমাজ ও অসাম্প্রদায়িক চেতনার সুর এখানে চির অম্লান।',
    history: 'ফকির লালন শাহ ১৭৭৪ থেকে ১৮৯০ পর্যন্ত বেঁচে ছিলেন। তিনি বাংলা গানের জগতে মানবতাবাদী দেহতত্ত্ব ও আধ্যাত্মিক গানের অনন্য রূপকার। মৃত্যুর পর তাঁর সমাধি ঘিরে এই আখড়া গড়ে ওঠে। ইউনেস্কো লালন গীতিকে বিশ্বের অস্পৃশ্য সাংস্কৃতিক ঐতিহ্য (Intangible Cultural Heritage) হিসেবে স্বীকৃতি দিয়েছে।',
    keyHighlights: [
      'ফকির লালন শাহ এবং তাঁর সহচর সাধকদের সমাধি সৌধ',
      'লালন গবেষণাকেন্দ্র ও দুর্লভ স্মৃতিবিজড়িত বাদ্যযন্ত্রের জাদুঘর',
      'প্রতিদিন বিকেলে বাউলদের কণ্ঠে একতারা ও দোতারার সরাসরি লালনগীতি পরিবেশন',
      'মরমী সাধকদের ধ্যানমগ্ন শান্ত বৃক্ষছায়াঘেরা প্রাঙ্গণ',
      'লাইব্রেরি ও লালন একাডেমি উন্মুক্ত মঞ্চ'
    ],
    howToGo: {
      bus: 'কুষ্টিয়া শহরের মজমপুর গেট বা কোর্ট চত্বর থেকে ছেঁউড়িয়া গামী যেকোনো অটোরিকশায় সরাসরি যাওয়া যায়।',
      localTransport: 'ইজিবাইক বা সিএনজি ভাড়া জনপ্রতি ১৫-২০ টাকা, রিজার্ভ নিলে ৮০-১২০ টাকা।',
      fareEstimate: '২০ ৳ (জনপ্রতি)',
      routeTip: 'মজমপুর গেট ➔ চৌড়হাস ➔ ছেঁউড়িয়া লালন মাজার রোড'
    },
    tips: [
      'মাজার প্রাঙ্গণে জুতো খুলে প্রবেশ করতে হয় এবং ভাবগম্ভীর পরিবেশ বজায় রাখা কাম্য।',
      'প্রতি বছর অক্টোবর মাসে লালন তিরোধান উৎসব এবং মার্চে দোল উৎসবে লালন মেলা অনুষ্ঠিত হয়।',
      'সন্ধ্যায় আখড়ায় সরাসরি বাউল গানের সুর শোনা সবচেয়ে মনোমুগ্ধকর অভিজ্ঞতা দেয়।'
    ],
    nearbyAttractions: [
      { name: 'শিলাইদহ রবীন্দ্র কুঠিবাড়ি', distance: '১২ কিমি', placeId: 'shilaidaha-kuthibari' },
      { name: 'মীর মশাররফ হোসেনের বাস্তুভিটা', distance: '৮ কিমি', placeId: 'mir-mosharraf-bastu' },
      { name: 'গড়াই নদী ও কুষ্টিয়া পৌর পার্ক', distance: '৩ কিমি', placeId: 'gorai-bridge-park' }
    ],
    emergencyContacts: [
      { title: 'লালন একাডেমি তত্ত্বাবধায়ক', phone: '01712-445566', role: 'প্রশাসনিক কর্মকর্তা' },
      { title: 'কুমারখালী থানা পুলিশ', phone: '01320-146300', role: 'নিরাপত্তা ফাঁড়ি' },
      { title: 'জরুরি অ্যাম্বুলেন্স সেবা', phone: '01711-224455', role: 'মেডিকেল টিম' }
    ],
    rating: 4.9,
    reviewsCount: 1450,
    googleMapUrl: 'https://maps.google.com/?q=Lalon+Shah+Mazar+Cheuriya+Kushtia'
  },

  'shilaidaha-kuthibari': {
    id: 'shilaidaha-kuthibari',
    name: 'বিশ্বকবি রবীন্দ্রনাথ ঠাকুরের শিলাইদহ কুঠিবাড়ি',
    englishName: 'Rabindranath Tagore Shilaidaha Kuthibari',
    upazilaId: 'kumarkhali',
    upazilaName: 'কুমারখালী উপজেলা',
    category: 'heritage',
    categoryLabel: 'বিশ্বসাহিত্য ও ঐতিহাসিক রাজকীয় স্থাপত্য',
    tagline: 'যেখানে রচিত হয়েছিল বিশ্ব সাহিত্যের অমূল্য গীতাঞ্জলির কবিতা',
    coverImage: shilaidahaImg,
    galleryImages: [
      shilaidahaImg,
      kumarkhaliImg
    ],
    distanceFromZeroPoint: 'কুষ্টিয়া শহর থেকে ১৬ কিমি',
    travelTime: '৩৫-৪০ মিনিট',
    entryFee: 'দেশি পর্যটক: ৩০ ৳, বিদেশি: ৫০০ ৳, শিক্ষার্থী: ১০ ৳',
    timings: 'গ্রীষ্মকাল: সকাল ১০:০০ - সন্ধ্যা ৬:০০, শীতকাল: সকাল ৯:০০ - বিকাল ৫:০০ (রবিবার পূর্ণ ও সোমবার অর্ধদিবস বন্ধ)',
    established: '১৮৯২ খ্রিষ্টাব্দে ঠাকুর পরিবারের জমিদারী তদারকির জন্য নির্মিত',
    architecture: 'ত্রিতল পিরামিড সাদৃশ্য মনোরম ছাদ ও ইন্দো-ইউরোপীয় স্থাপত্যশৈলী, চারপাশে সুদৃশ্য আম্রকানন ও পদ্মপুকুর',
    overview: 'বিশ্বকবি রবীন্দ্রনাথ ঠাকুর ১৮৮৯ থেকে ১৯০১ পর্যন্ত বহুবার শিলাইদহে অবস্থান করেছেন। এই মনোরম কুঠিবাড়িতে বসেই তিনি গীতাঞ্জলি, সোনার তরী, চৈতালী, চিত্রা, কথা ও কাহিনী সহ অসংখ্য বিখ্যাত কাব্যগ্রন্থ ও ছোটগল্প রচনা করেছিলেন।',
    history: 'পূর্বে পদ্মা নদীর তীব্র ভাঙনে আদি কুঠিবাড়িটি বিলীন হয়ে গেলে ১৮৯২ সালে বর্তমান কুঠিবাড়িটি নির্মাণ করা হয়। দোতলা ও ত্রিতল এই ভবনে কবির ব্যবহৃত পালকি, পদ্মা বোটের রেপ্লিকা, খাট, আরামকেদারা, চিঠিপত্র ও দুর্লভ চিত্রকর্ম সংরক্ষিত রয়েছে।',
    keyHighlights: [
      'রবীন্দ্রনাথ ঠাকুরের ব্যবহৃত পালকি, কাঠের খাট ও লেখার টেবিল',
      'কবির পদ্মা বোটের ভাসমান স্মৃতিচিহ্ন ও ঐতিহাসিক পদ্মদীঘি',
      'গীতাঞ্জলির ইংরেজি অনুবাদের স্মৃতিবিজড়িত নিরিবিলি চিলেকোঠার কক্ষ',
      'প্রত্নতত্ত্ব অধিদপ্তর পরিচালিত সমৃদ্ধ রবীন্দ্র জাদুঘর',
      'বিশাল ছায়াঘেরা আমবাগান ও বকুলতলা'
    ],
    howToGo: {
      bus: 'কুষ্টিয়া মজমপুর থেকে শিলাইদহগামী লোকাল বাস বা আলাউদ্দিন নগর হয়ে ইজিবাইকে যাওয়া যায়।',
      localTransport: 'কুষ্টিয়া খেয়াঘাট পার হয়ে সোজা অটোরিকশায় অথবা কুমারখালী বাজার হয়ে শিলাইদহ কুঠিবাড়ি।',
      fareEstimate: '৪০-৬০ ৳ (জনপ্রতি)',
      routeTip: 'কুষ্টিয়া ➔ কুমারখালী ব্রিজ / আলাউদ্দিন নগর ➔ শিলাইদহ রবীন্দ্র কুঠিবাড়ি'
    },
    tips: [
      'রবিবার সম্পূর্ণ বন্ধ এবং সোমবার দুপুর ২টা পর্যন্ত বন্ধ থাকে। ভ্রমণের পরিকল্পনা করার সময় এটি মাথায় রাখুন।',
      'কুঠিবাড়ির চত্বরে ছবি তোলার জন্য চমৎকার আলোকসজ্জা ও বাগান রয়েছে।',
      'আশেপাশের দোকানে খাঁটি কুষ্টিয়ার তিলের খাজা ও স্থানীয় তাজা খেজুরের গুড় পাওয়া যায়।'
    ],
    nearbyAttractions: [
      { name: 'ফকির লালন শাহের মাজার', distance: '১২ কিমি', placeId: 'lalon-shrine' },
      { name: 'কাঙ্গাল হরিনাথ স্মৃতি জাদুঘর', distance: '৫ কিমি', placeId: 'kangal-harinath-museum' },
      { name: 'মীর মশাররফ হোসেনের বাস্তুভিটা', distance: '১৪ কিমি', placeId: 'mir-mosharraf-bastu' }
    ],
    emergencyContacts: [
      { title: 'কুঠিবাড়ি কাস্টোডিয়ান অফিস', phone: '01715-998877', role: 'প্রত্নতত্ত্ব কর্মকর্তা' },
      { title: 'ট্যুরিস্ট পুলিশ কন্ট্রোল', phone: '01320-146310', role: 'পর্যটক সুরক্ষা' }
    ],
    rating: 4.8,
    reviewsCount: 1620,
    googleMapUrl: 'https://maps.google.com/?q=Rabindranath+Tagore+Shilaidaha+Kuthibari'
  },

  'hardinge-bridge': {
    id: 'hardinge-bridge',
    name: 'ঐতিহাসিক হার্ডিঞ্জ ব্রিজ ও লালন শাহ সেতু',
    englishName: 'Historic Hardinge Bridge & Lalon Shah Bridge',
    upazilaId: 'bheramara',
    upazilaName: 'ভেড়ামারা উপজেলা',
    category: 'heritage',
    categoryLabel: 'প্রকৌশল বিস্ময় ও নদী সৌন্দর্য',
    tagline: 'শতবর্ষী লৌহ কাঠামোর ঐতিহাসিক রেল সেতু ও পদ্মার সুবিশাল রূপ',
    coverImage: hardingeBridgeImg,
    galleryImages: [
      hardingeBridgeImg,
      bheramaraImg
    ],
    distanceFromZeroPoint: 'কুষ্টিয়া শহর থেকে ২৫ কিমি',
    travelTime: '৪০-৪৫ মিনিট',
    entryFee: 'সম্পূর্ণ বিনামূল্যে',
    timings: 'সার্বক্ষণিক উন্মুক্ত (সূর্যাস্তের সময় সবচেয়ে দৃষ্টিনন্দন)',
    established: '১৯১৫ খ্রিষ্টাব্দ (হার্ডিঞ্জ ব্রিজ) ও ২০০৪ খ্রিষ্টাব্দ (লালন শাহ সেতু)',
    architecture: '১.৮ কিমি দীর্ঘ ট্রাস ডিজাইনের ইস্পাত নির্মিত ব্রিটিশ রেলওয়ে প্রকৌশলের কালজয়ী নিদর্শন',
    overview: 'পদ্মা নদীর উপর অবস্থিত শতাব্দী প্রাচীন হার্ডিঞ্জ ব্রিজ এবং তার পাশেই আধুনিক লালন শাহ সড়ক সেতু। ব্রিটিশ প্রকৌশলের এক অপূর্ব সৃষ্টি যা কুষ্টিয়ার ভেড়ামারা ও পাবনার পাকশীকে যুক্ত করেছে। বিকেলে পদ্মার চরে বসে ব্রিজ ও নদীর মনোরম সূর্যাস্ত দেখা ভ্রমণপিপাসুদের অন্যতম আকর্ষণ।',
    history: 'তৎকালীন ভাইসরয় লর্ড হার্ডিঞ্জের নামানুসারে ১৯১০ সালে নির্মাণ কাজ শুরু হয়ে ১৯১৫ সালে এটি উদ্বোধন করা হয়। মহান মুক্তিযুদ্ধে ১৯৭১ সালে পাকিস্তানি বাহিনীর বিরুদ্ধে যুদ্ধের সময় ব্রিজের কয়েকটি স্প্যান ক্ষতিগ্রস্ত হয় যা স্বাধীনতার পর দ্রুত সংস্কার করা হয়।',
    keyHighlights: [
      '১০০ বছরের বেশি পুরনো ব্রিটিশ আমলের ঐতিহ্যবাহী রেল সেতু',
      'পাশেই অবস্থিত আধুনিক চার লেনের দৃষ্টিনন্দন লালন শাহ সেতু',
      'পদ্মা নদীর বুকে বালুচর, নৌকা ভ্রমণ এবং তাজা রূপচাঁদা ও ইলিশের স্বাদ',
      'পাকশী রেলওয়ে রিসোর্ট ও শতবর্ষী বিশাল রেইনট্রি গাছের ছায়া',
      'ছবি ও ভিডিওগ্রাফির জন্য চমৎকার প্রাকৃতিক ভিউপয়েন্ট'
    ],
    howToGo: {
      bus: 'কুষ্টিয়া মজমপুর থেকে ভেড়ামারামুখী বাসে ভেড়ামারা বাজার বা সরাসরি লালন শাহ সেতু টোল প্লাজায় নামা যায়।',
      localTransport: 'কুষ্টিয়া থেকে সিএনজি বা প্রাইভেট কারে সোজা ব্রিজের চত্বরে যাওয়া যায়।',
      fareEstimate: '৫০-৭০ ৳ (জনপ্রতি)',
      routeTip: 'কুষ্টিয়া শহর ➔ ভেড়ামারা বাইপাস ➔ লালন শাহ সেতু গোলচত্বর / হার্ডিঞ্জ ব্রিজ নদী ঘাট'
    },
    tips: [
      'রেল লাইনের ওপর হাঁটা বা বিপজ্জনক সেলফি তোলা সম্পূর্ণ নিষিদ্ধ ও দণ্ডনীয়।',
      'পদ্মার চরে সূর্যাস্ত দেখতে হলে বিকাল ৪টার মধ্যে পৌঁছানো সবচেয়ে ভালো।',
      'নদী তীরবর্তী দোকানে স্থানীয় মিষ্টি এবং নদীর তাজা ভাজা মাছের স্বাদ নিতে ভুলবেন না।'
    ],
    nearbyAttractions: [
      { name: 'ঘোড়াদহ বিল ও পদ্মার চর', distance: '১২ কিমি' },
      { name: 'কুষ্টিয়া পৌর পার্ক', distance: '২৫ কিমি', placeId: 'gorai-bridge-park' },
      { name: 'রূপপুর পারমাণবিক বিদ্যুৎ কেন্দ্র ভিউপয়েন্ট', distance: '৩ কিমি' }
    ],
    emergencyContacts: [
      { title: 'পাকশী জিআরপি পুলিশ ফাঁড়ি', phone: '01711-332211', role: 'রেলওয়ে নিরাপত্তা' },
      { title: 'ভেড়ামারা থানা পুলিশ', phone: '01320-146400', role: 'আইনশৃঙ্খলা' }
    ],
    rating: 4.9,
    reviewsCount: 1890,
    googleMapUrl: 'https://maps.google.com/?q=Hardinge+Bridge+Paksey+Kushtia'
  },

  'mir-mosharraf-bastu': {
    id: 'mir-mosharraf-bastu',
    name: 'সাহিত্যিক মীর মশাররফ হোসেনের বাস্তুভিটা',
    englishName: 'Mir Mosharraf Hossain Memorial Center',
    upazilaId: 'kumarkhali',
    upazilaName: 'কুমারখালী উপজেলা',
    category: 'heritage',
    categoryLabel: 'সাহিত্য ও সাংস্কৃতিক ঐতিহ্য',
    tagline: 'বিষাদ-সিন্ধুর অমর স্রষ্টার স্মৃতিবিজড়িত লাহিনীপাড়া',
    coverImage: mirMosharrafImg,
    galleryImages: [
      mirMosharrafImg,
      kumarkhaliImg
    ],
    distanceFromZeroPoint: 'কুষ্টিয়া শহর থেকে ৬ কিমি',
    travelTime: '১৫-২০ মিনিট',
    entryFee: 'বিনামূল্যে',
    timings: 'সকাল ৯:০০ - বিকাল ৫:০০ (শুক্রবার ও সরকারি ছুটির দিন ব্যতীত)',
    established: 'আধুনিক স্মৃতি কমপ্লেক্স ১৯৯৯ খ্রিষ্টাব্দে',
    architecture: 'শান্ত সুনিবিড় গ্রামীণ ছায়াঘেরা স্মৃতি লাইব্রেরি, মিলনায়তন ও প্রাথমিক বিদ্যালয়ের প্রাঙ্গণ',
    overview: 'বাংলা সাহিত্যের শ্রেষ্ঠ ঔপন্যাসিক ও "বিষাদ-সিন্ধু" রচয়িতা মীর মশাররফ হোসেনের জন্মস্থান কুষ্টিয়ার কুমারখালী উপজেলার লাহিনীপাড়া গ্রামে। এখানে তাঁর স্মৃতিতে প্রতিষ্ঠিত হয়েছে একটি সমৃদ্ধ লাইব্রেরি ও জাদুঘর কমপ্লেক্স।',
    history: 'মীর মশাররফ হোসেন ১৮৪৭ সালের ১৩ নভেম্বর লাহিনীপাড়ায় জন্মগ্রহণ করেন। তিনি বাংলা গদ্য সাহিত্যের আধুনিকায়নে পথিকৃতের ভূমিকা পালন করেন। তাঁর জমিদার দর্পণ, রত্নাবতী ও বিষাদ-সিন্ধু বাংলা সাহিত্যের চিরকালীন রত্ন।',
    keyHighlights: [
      'সাহিত্যিক মীর মশাররফ হোসেনের ব্যবহৃত স্মৃতিচিহ্ন ও আদি বাস্তুভিটা',
      'স্মৃতি লাইব্রেরি ও গবেষণাকেন্দ্র',
      'মনোরম গ্রামীণ প্রাকৃতিক শান্ত পরিবেশ',
      'বার্ষিক মীর মশাররফ জন্ম ও মৃত্যুবার্ষিকী সাহিত্য মেলা'
    ],
    howToGo: {
      bus: 'কুষ্টিয়া মজমপুর থেকে কুমারখালী রোডে লাহিনীপাড়া মোড়ে নামলেই কয়েক কদম দূরে বাস্তুভিটা।',
      localTransport: 'ইজিবাইক বা অটোরিকশায় সরাসরি লাহিনীপাড়া যাওয়া যায়।',
      fareEstimate: '২০ ৳ (জনপ্রতি)',
      routeTip: 'কুষ্টিয়া সদর ➔ লাহিনীপাড়া মীর মশাররফ গেট'
    },
    tips: [
      'শিক্ষার্থীদের জন্য বাংলা সাহিত্যের ইতিহাস জানার এক অনন্য শিক্ষামূলক স্থান।',
      'লাইব্রেরিতে মীর মশাররফ হোসেনের দুর্লভ বই ও পাণ্ডুলিপি অধ্যয়ন করা যায়।'
    ],
    nearbyAttractions: [
      { name: 'লালন শাহের মাজার (ছেঁউড়িয়া)', distance: '৩ কিমি', placeId: 'lalon-shrine' },
      { name: 'শিলাইদহ রবীন্দ্র কুঠিবাড়ি', distance: '১০ কিমি', placeId: 'shilaidaha-kuthibari' }
    ],
    emergencyContacts: [
      { title: 'স্মৃতি জাদুঘর কর্মকর্তা', phone: '01712-887766', role: 'কেয়ারটেকার' },
      { title: 'কুমারখালী থানা', phone: '01320-146300', role: 'পুলিশ ডিউটি অফিসার' }
    ],
    rating: 4.6,
    reviewsCount: 420,
    googleMapUrl: 'https://maps.google.com/?q=Mir+Mosharraf+Hossain+Bastubhitai+Kushtia'
  },

  'gorai-bridge-park': {
    id: 'gorai-bridge-park',
    name: 'কুষ্টিয়া পৌর পার্ক ও গড়াই নদী তীর',
    englishName: 'Kushtia Poura Park & Gorai River Bank',
    upazilaId: 'kushtia-sadar',
    upazilaName: 'কুষ্টিয়া সদর',
    category: 'nature',
    categoryLabel: 'প্রকৃতি ও চিত্তবিনোদন',
    tagline: 'গড়াই নদীর মুক্ত বাতাস, ঝুলন্ত বাঁধ ও শহরের মনোরম পার্ক',
    coverImage: renwickParkImg,
    galleryImages: [
      renwickParkImg,
      goraiBridgeImg,
      kushtiaSadarImg
    ],
    distanceFromZeroPoint: 'কুষ্টিয়া শহরের কেন্দ্রবিন্দুতে (১ কিমি)',
    travelTime: '৫ মিনিট',
    entryFee: 'পার্ক প্রবেশ ফি: ১০ ৳ (নদী বাঁধ উন্মুক্ত)',
    timings: 'সকাল ৬:০০ - রাত ৯:০০ টা',
    established: 'কুষ্টিয়া পৌরসভা কর্তৃক সুসজ্জিত বিনোদন কেন্দ্র',
    architecture: 'নদী রক্ষা বাঁধ, ওয়াকওয়ে, শিশুদের রাইডস ও বৃক্ষশোভিত বসার চত্বর',
    overview: 'কুষ্টিয়া শহরের পাশ দিয়ে বয়ে যাওয়া ঐতিহাসিক গড়াই নদীর কোল ঘেঁষে গড়ে উঠেছে কুষ্টিয়া পৌর পার্ক ও বাঁধ এলাকা। বিকেল বেলা শহরের মানুষ এখানে বিশুদ্ধ বাতাস ও সূর্যাস্তের রূপ উপভোগ করতে ভিড় করেন। নদী ভ্রমণের জন্য এখানে রয়েছে সুন্দর ইঞ্জিন বোট।',
    history: 'গড়াই নদী পদ্মা নদীর একটি গুরুত্বপূর্ণ শাখা। ব্রিটিশ আমলে এই নদী দিয়েই স্টিমার চলাচল করত। বর্তমানে শহরের মানুষের প্রধান স্বাস্থ্যকর ভ্রমণ ও বিনোদন স্থানে পরিণত হয়েছে এই বাঁধ এলাকা।',
    keyHighlights: [
      'গড়াই নদীর শান্ত জলরাশি ও সূর্যাস্তের অসাধারণ রূপ',
      'নদী তীরবর্তী বাঁধের ওপর বাঁধাই করা আধুনিক ওয়াকওয়ে',
      'নৌকায় নদী ভ্রমণ ও স্থানীয় ফুচকা-চটপটি ও চা-আড্ডার পরিবেশ',
      'শিশুদের খেলাধুলার রাইডস ও সবুজ বাগান'
    ],
    howToGo: {
      bus: 'কুষ্টিয়া শহরের যেকোনো প্রান্ত থেকে রিকশা বা পায়ে হেঁটেই পৌর পার্ক ও নদী বাঁধে পৌঁছানো যায়।',
      localTransport: 'রিকশা ভাড়া ১৫-২০ টাকা।',
      fareEstimate: '১৫ ৳',
      routeTip: 'এনএস রোড / থানা মোড় ➔ কুষ্টিয়া পৌর পার্ক'
    },
    tips: [
      'বিকেল ৫টা থেকে রাত ৮টা পর্যন্ত পরিবেশ সবচেয়ে জমজমাট থাকে।',
      'নদীতে নামার সময় ও নৌকায় ভ্রমণের সময় অবশ্যই লাইফ জ্যাকেট বা সতর্কতা অবলম্বন করুন।'
    ],
    nearbyAttractions: [
      { name: 'টেগর লজ', distance: '১ কিমি', placeId: 'tagore-lodge' },
      { name: 'লালন শাহের মাজার', distance: '৪ কিমি', placeId: 'lalon-shrine' }
    ],
    emergencyContacts: [
      { title: 'কুষ্টিয়া পৌরসভা নিরাপত্তা', phone: '071-62020', role: 'পৌর কর্মকর্তা' },
      { title: 'কুষ্টিয়া সদর মডেল থানা', phone: '01320-146000', role: 'জরুরি সেবা' }
    ],
    rating: 4.7,
    reviewsCount: 890,
    googleMapUrl: 'https://maps.google.com/?q=Kushtia+Poura+Park+Gorai+River'
  },

  'kangal-harinath-museum': {
    id: 'kangal-harinath-museum',
    name: 'কাঙ্গাল হরিনাথ স্মৃতি জাদুঘর ও ছাপাখানা',
    englishName: 'Kangal Harinath Memorial Museum',
    upazilaId: 'kumarkhali',
    upazilaName: 'কুমারখালী উপজেলা',
    category: 'education',
    categoryLabel: 'ঐতিহাসিক ও সাংবাদিকতার পথিকৃৎ',
    tagline: 'গ্রামীণ সাংবাদিকতার জনক কাঙ্গাল হরিনাথ ও ঐতিহাসিক এম এন প্রেস',
    coverImage: kangalHarinathImg,
    galleryImages: [
      kangalHarinathImg,
      kumarkhaliImg
    ],
    distanceFromZeroPoint: 'কুষ্টিয়া শহর থেকে ১৫ কিমি',
    travelTime: '৩০-৩৫ মিনিট',
    entryFee: 'বিনামূল্যে উন্মুক্ত',
    timings: 'সকাল ৯:০০ - বিকাল ৫:০০ (সরকারি কর্মদিবস)',
    established: '১৮৭৩ খ্রিষ্টাব্দের ঐতিহাসিক প্রেস ও আধুনিক স্মৃতি জাদুঘর ২০১৩ সালে',
    architecture: 'আধুনিক দোতলা জাদুঘর ভবন ও কাঙ্গাল কুটির স্মৃতি অঙ্গন',
    overview: 'বাংলার গ্রামীণ সাংবাদিকতার অগ্রদূত কাঙ্গাল হরিনাথ মজুমদার কুমারখালীতে বসে প্রকাশ করেছিলেন ঐতিহাসিক "গ্রামবার্তা প্রকাশিকা" পত্রিকা। ব্রিটিশ নীলকর ও শোষক জমিদারদের বিরুদ্ধে কলম ধরা এই মহান ব্যক্তির ব্যবহৃত কাঠের ছাপাখানা ও স্মৃতিচিহ্ন এখানে সংরক্ষিত।',
    history: 'কাঙ্গাল হরিনাথ (১৮৩৩-১৮৯৬) নিঃস্বার্থভাবে দরিদ্র কৃষক ও প্রজাদের অধিকারের জন্য জীবন উৎসর্গ করেন। তাঁর প্রতিষ্ঠিত এম এন প্রেস তৎকালীন বাংলার সাহিত্য, লালন সঙ্গীত প্রচার ও গণমানুষের জাগরণে অসামান্য অবদান রেখেছিল।',
    keyHighlights: [
      'ঐতিহাসিক ১৮৭৩ সালের দুর্লভ কাঠের হস্তচালিত ছাপাখানা (এম এন প্রেস)',
      'গ্রামবার্তা প্রকাশিকা পত্রিকার আদি কপি ও পান্ডুলিপি',
      'কাঙ্গাল হরিনাথের জীবনী ও তাঁর বাউল গান রচনার ইতিহাস',
      'জাতীয় জাদুঘর নিয়ন্ত্রিত সংরক্ষিত ঐতিহ্য'
    ],
    howToGo: {
      bus: 'কুষ্টিয়া থেকে কুমারখালীগামী বাসে কুমারখালী কাঙ্গাল হরিনাথ মোড়ে নামতে হবে।',
      localTransport: 'কুমারখালী বাজার থেকে পায়ে হেঁটে বা রিকশায় ৫ মিনিট।',
      fareEstimate: '৩০ ৳',
      routeTip: 'কুষ্টিয়া ➔ কুমারখালী বাজার ➔ কাঙ্গাল হরিনাথ মোড়'
    },
    tips: [
      'সাংবাদিকতা ও ইতিহাসের গবেষকদের জন্য এটি অবশ্য দর্শনীয় এক তীর্থভূমি।'
    ],
    nearbyAttractions: [
      { name: 'শিলাইদহ রবীন্দ্র কুঠিবাড়ি', distance: '৫ কিমি', placeId: 'shilaidaha-kuthibari' },
      { name: 'লালন শাহের মাজার', distance: '১০ কিমি', placeId: 'lalon-shrine' }
    ],
    emergencyContacts: [
      { title: 'জাদুঘর কর্মকর্তা', phone: '01718-223344', role: 'তত্ত্বাবধায়ক' },
      { title: 'কুমারখালী থানা', phone: '01320-146300', role: 'আইনশৃঙ্খলা' }
    ],
    rating: 4.8,
    reviewsCount: 310,
    googleMapUrl: 'https://maps.google.com/?q=Kangal+Harinath+Museum+Kumarkhali+Kushtia'
  },

  'jhaudia-shahi-mosque': {
    id: 'jhaudia-shahi-mosque',
    name: 'ঐতিহাসিক ঝাউদিয়া শাহী মসজিদ',
    englishName: 'Historic Jhaudia Shahi Mosque',
    upazilaId: 'kushtia-sadar',
    upazilaName: 'কুষ্টিয়া সদর',
    category: 'religious',
    categoryLabel: 'মুঘল স্থাপত্য ও ঐতিহাসিক মসজিদ',
    tagline: 'মোঘল আমলের কারুকার্যময় গম্বুজবিশিষ্ট প্রাচীন শাহী মসজিদ',
    coverImage: jhaudiaMosqueImg,
    galleryImages: [
      jhaudiaMosqueImg,
      kushtiaSadarImg
    ],
    distanceFromZeroPoint: 'কুষ্টিয়া শহর থেকে ২১ কিমি',
    travelTime: '৪৫ মিনিট',
    entryFee: 'বিনামূল্যে উন্মুক্ত',
    timings: 'নামাজের সময়সহ সার্বক্ষণিক উন্মুক্ত',
    established: 'মুঘল সম্রাট আওরঙ্গজেবের শাসনামল (আনুমানিক ১৬৮০-১৭০৭ খ্রিষ্টাব্দ)',
    architecture: 'তিন গম্বুজবিশিষ্ট প্রাচীন মোঘল পোড়ামাটির স্থাপত্যশৈলী ও কারুকার্যখচিত চুন-সুরকির দেয়াল',
    overview: 'কুষ্টিয়া সদর উপজেলার ঝাউদিয়া গ্রামে অবস্থিত এই ঐতিহাসিক শাহী মসজিদ প্রত্নতত্ত্ব অধিদপ্তরের একটি সংরক্ষিত নিদর্শন। জনশ্রুতি রয়েছে এটি পীর শাহ সুফি আব্দুল গণির প্রার্থনাস্থল ছিল। দূর-দূরান্ত থেকে মানুষ এখানে মানত ও জুমার নামাজ আদায় করতে আসেন।',
    history: 'মোঘল স্থাপত্যরীতি অনুযায়ী নির্মিত এই মসজিদটির দেয়ালগুলো অত্যন্ত প্রশস্ত এবং এর ছাদে রয়েছে তিনটি চমৎকার গম্বুজ। মসজিদের পাশে একটি প্রাচীন দীঘি ও সুফি সাধকের মাজার রয়েছে।',
    keyHighlights: [
      'মোঘল আমলের নিখুঁত তিন গম্বুজ ও চুন-সুরকির প্রাচীন গাঁথুনি',
      'মসজিদ সংলগ্ন ঐতিহাসিক শান্ত দিঘী ও সুফি সাধকের সমাধি',
      'প্রত্নতত্ত্ব অধিদপ্তর কর্তৃক সংরক্ষিত জাতীয় পুরাকীর্তি'
    ],
    howToGo: {
      bus: 'কুষ্টিয়া মজমপুর থেকে ঝাউদিয়াগামী লোকাল বাস বা ইজিবাইকে যাওয়া যায়।',
      localTransport: 'সিএনজি বা ব্যাটারিচালিত অটোরিকশায় ঝাউদিয়া বাজার।',
      fareEstimate: '৪০-৫০ ৳',
      routeTip: 'কুষ্টিয়া শহর ➔ বটতৈল মোড় ➔ ঝাউদিয়া শাহী মসজিদ'
    },
    tips: [
      'শুক্রবার জুমার নামাজের সময় প্রচুর মুসল্লি সমবেত হন।',
      'শালীন পোশাক পরিধান করে মসজিদের পবিত্রতা রক্ষা করুন।'
    ],
    nearbyAttractions: [
      { name: 'কুষ্টিয়া পৌর পার্ক', distance: '২০ কিমি', placeId: 'gorai-bridge-park' }
    ],
    emergencyContacts: [
      { title: 'মসজিদ পরিচালনা কমিটি', phone: '01714-556677', role: 'সভাপতি' },
      { title: 'ঝাউদিয়া পুলিশ ক্যাম্প', phone: '01320-146020', role: 'নিরাপত্তা' }
    ],
    rating: 4.8,
    reviewsCount: 520,
    googleMapUrl: 'https://maps.google.com/?q=Jhaudia+Shahi+Mosque+Kushtia'
  },

  'tagore-lodge': {
    id: 'tagore-lodge',
    name: 'ঐতিহাসিক টেগর লজ',
    englishName: 'Historic Tagore Lodge',
    upazilaId: 'kushtia-sadar',
    upazilaName: 'কুষ্টিয়া সদর',
    category: 'heritage',
    categoryLabel: 'ঠাকুর পরিবারের কুষ্টিয়া ব্যবসায়িক ভবন',
    tagline: 'রবীন্দ্রনাথ ঠাকুরের কুষ্টিয়া শহরের ব্যবসায়িক ও সাহিত্য আড্ডা কেন্দ্র',
    coverImage: tagoreLodgeImg,
    galleryImages: [
      tagoreLodgeImg,
      kushtiaSadarImg
    ],
    distanceFromZeroPoint: 'কুষ্টিয়া মিলপাড়ায় (১.৫ কিমি)',
    travelTime: '৮ মিনিট',
    entryFee: 'বিনামূল্যে',
    timings: 'সকাল ৯:০০ - বিকাল ৫:০০',
    established: '১৮৯৫ খ্রিষ্টাব্দ',
    architecture: 'দোতলা প্রাচীন ভিক্টোরিয়ান ও ঔপনিবেশিক শৈলীর ইটের ভবন',
    overview: 'কুষ্টিয়া শহরের মিলপাড়া এলাকায় অবস্থিত টেগর লজ। বিশ্বকবি রবীন্দ্রনাথ ঠাকুর এবং তাঁর ভাই জ্যোতিরিন্দ্রনাথ ঠাকুর কুষ্টিয়ায় তাঁদের পারিবারিক ব্যবসা (টেগর অ্যান্ড কোম্পানি) পরিচালনার জন্য এই সুরম্য দোতলা ভবনটি তৈরি করেছিলেন। কবি শিলাইদহ থেকে শহরের কাজে এলে এখানেই রাত্রিযাপন করতেন।',
    history: 'ঠাকুর পরিবারের ব্যবসায়ী উদ্যোগ ও পাট ব্যবসার প্রধান অফিস হিসেবে এই টেগর লজ ব্যবহৃত হতো। এখানে কবির বহু স্মৃতি ও চিঠিপত্রের উল্লেখ রয়েছে। বর্তমানে এটি প্রত্নতত্ত্ব অধিদপ্তরের মাধ্যমে সংরক্ষিত হচ্ছে।',
    keyHighlights: [
      'ঠাকুর পরিবারের কুষ্টিয়া শহরের একমাত্র ঐতিহাসিক স্মৃতিসৌধ',
      'ভিক্টোরিয়ান আমলের কারুকার্যখচিত বারান্দা ও কাঠের সিঁড়ি',
      'কুষ্টিয়া শহরের প্রাণকেন্দ্রে অবস্থিত হওয়ায় সহজে যাতায়াতযোগ্য'
    ],
    howToGo: {
      bus: 'কুষ্টিয়া শহরের যে কোনো স্থান থেকে রিকশায় মিলপাড়া টেগর লজ যাওয়া যায়।',
      localTransport: 'রিকশা ভাড়া ১৫-২০ টাকা।',
      fareEstimate: '২০ ৳',
      routeTip: 'থানা মোড় ➔ মিলপাড়া রেলগেট ➔ টেগর লজ'
    },
    tips: [
      'রবীন্দ্রপ্রেমীদের জন্য শিলাইদহের পাশাপাশি শহরের এই লজটি দেখা অত্যন্ত তাৎপর্যপূর্ণ।'
    ],
    nearbyAttractions: [
      { name: 'কুষ্টিয়া পৌর পার্ক ও গড়াই বাঁধ', distance: '১.৫ কিমি', placeId: 'gorai-bridge-park' },
      { name: 'লালন শাহের মাজার', distance: '৩ কিমি', placeId: 'lalon-shrine' }
    ],
    emergencyContacts: [
      { title: 'কুষ্টিয়া সদর থানা', phone: '01320-146000', role: 'পুলিশ' }
    ],
    rating: 4.6,
    reviewsCount: 380,
    googleMapUrl: 'https://maps.google.com/?q=Tagore+Lodge+Kushtia'
  }
};

export const KUSHTIA_UPAZILAS: Record<string, UpazilaItem> = {
  'kushtia-sadar': {
    id: 'kushtia-sadar',
    name: 'কুষ্টিয়া সদর',
    fullName: 'কুষ্টিয়া সদর উপজেলা',
    englishName: 'Kushtia Sadar Upazila & Pourashava',
    coverImage: kushtiaSadarImg,
    galleryImages: [
      kushtiaSadarImg,
      bheramaraImg
    ],
    area: '৩১৬.২৬ বর্গকিলোমিটার',
    population: 'প্রায় ৫,৫০,০০০ জন',
    unionsCount: '১৪টি ইউনিয়ন ও ১টি প্রথম শ্রেণীর পৌরসভা (২১টি ওয়ার্ড)',
    literacyRate: '৬৯.৫%',
    postCode: '৭০০০',
    famousFor: [
      'কুষ্টিয়ার বিখ্যাত তিলের খাজা ও খাঁটি কুলফি মালাই',
      'গড়াই নদী তীর ও পৌর পার্ক',
      'ঐতিহাসিক টেগর লজ ও ঝাউদিয়া শাহী মসজিদ',
      'বিসিক শিল্পনগরী ও তামাক শিল্প'
    ],
    overview: 'কুষ্টিয়া সদর উপজেলা কুষ্টিয়া জেলার প্রশাসনিক, বাণিজ্যিক ও শিক্ষা কেন্দ্রবিন্দু। গড়াই নদীর অববাহিকায় গড়ে ওঠা এই পরিপাটি শহরটি শিল্প, সাহিত্য ও বাউল সংস্কৃতির প্রাণভোমরা হিসেবে সারা দেশে পরিচিত।',
    history: '১৮৬১ সালে কুষ্টিয়া পৌরসভা গঠিত হয় যা বাংলাদেশের অন্যতম প্রাচীন পৌরসভা। ১৮৬৯ সালে কুষ্টিয়া রেলওয়ে সংযোগ স্থাপিত হলে এটি তৎকালীন পূর্ববঙ্গের অন্যতম বৃহত্তম বাণিজ্য কেন্দ্রে রূপ লাভ করে।',
    rivers: ['গড়াই নদী', 'কালিগঙ্গা নদী'],
    economy: 'কৃষি, চালের আড়ত, বস্ত্র ও পোশাক, বিখ্যাত তিলের খাজা প্রস্তুত শিল্প, কেমিক্যাল ও ক্ষুদ্র ও মাঝারি শিল্প।',
    topPlaceIds: ['gorai-bridge-park', 'tagore-lodge', 'jhaudia-shahi-mosque'],
    transportInfo: 'কুষ্টিয়া মজমপুর গেট আন্তঃজেলা বাস টার্মিনাল এবং কুষ্টিয়া কোর্ট স্টেশন ও কুষ্টিয়া স্টেশন থেকে সমগ্র দেশের সাথে সরাসরি যোগাযোগ।',
    administrativeContacts: [
      { designation: 'উপজেলা নির্বাহী অফিসার (ইউএনও)', phone: '01713-300100', office: 'ইউএনও কার্যালয়, কুষ্টিয়া সদর' },
      { designation: 'সহকারী কমিশনার (ভূমি)', phone: '01713-300105', office: 'উপজেলা ভূমি অফিস' },
      { designation: 'অফিসার ইনচার্জ (ওসি)', phone: '01320-146000', office: 'কুষ্টিয়া সদর মডেল থানা' }
    ],
    emergencyContacts: [
      { service: 'কুষ্টিয়া ২৫০ শয্যা জেনারেল হাসপাতাল', phone: '071-62402' },
      { service: 'কুষ্টিয়া ফায়ার সার্ভিস স্টেশন', phone: '01716-123456' },
      { service: 'বিদ্যুৎ অভিযোগ কেন্দ্র (WZPDCL)', phone: '16117' }
    ],
    googleMapUrl: 'https://maps.google.com/?q=Kushtia+Sadar+Pourashava'
  },

  'kumarkhali': {
    id: 'kumarkhali',
    name: 'কুমারখালী',
    fullName: 'কুমারখালী উপজেলা',
    englishName: 'Kumarkhali Upazila',
    coverImage: kumarkhaliImg,
    galleryImages: [
      kumarkhaliImg,
      daulatpurImg
    ],
    area: '২৫৮.৩৭ বর্গকিলোমিটার',
    population: 'প্রায় ৩,৮০,০০০ জন',
    unionsCount: '১১টি ইউনিয়ন ও ১টি পৌরসভা',
    literacyRate: '৬২.৮%',
    postCode: '৭০১০',
    famousFor: [
      'বাউল সম্রাট ফকির লালন শাহের মাজার (ছেঁউড়িয়া)',
      'বিশ্বকবি রবীন্দ্রনাথ ঠাকুরের শিলাইদহ কুঠিবাড়ি',
      'ঐতিহ্যবাহী হাতে বোনা উন্নতমানের তাঁত বস্ত্র ও লুঙ্গি',
      'কাঙ্গাল হরিনাথ স্মৃতি জাদুঘর ও মীর মশাররফ হোসেনের বাস্তুভিটা'
    ],
    overview: 'কুমারখালীকে বলা হয় বাংলার লোকসংস্কৃতি ও সাহিত্যের রাজধানী। বাউল লালন শাহ, কবিগুরু রবীন্দ্রনাথ, সাংবাদিক কাঙ্গাল হরিনাথ এবং বিষাদ-সিন্ধুর রচয়িতা মীর মশাররফ হোসেনের মতো দিকপালদের পদচিহ্নধন্য এই পূণ্যভূমি। এখানকার তৈরি তাঁতের লুঙ্গি ও গামছা সারাদেশে সমাদৃত।',
    history: 'প্রাচীনকালে কুমারখালী নদীবন্দর হিসেবে সুপরিচিত ছিল। ১৮৫৭ সালে মহকুমা হিসেবে যাত্রা শুরু করে কুমারখালী। ব্রিটিশ বিরোধী নীল বিদ্রোহ ও গ্রামীণ সাংবাদিকতার জন্মও হয়েছিল এই মাটিতে।',
    rivers: ['পদ্মা নদী', 'গড়াই নদী', 'কালিগঙ্গা'],
    economy: 'হস্তচালিত ও বিদ্যুৎচালিত তাঁত শিল্প (কুমারখালীর লুঙ্গি ও চাদর), কৃষি ও দুগ্ধ উৎপাদন।',
    topPlaceIds: ['lalon-shrine', 'shilaidaha-kuthibari', 'mir-mosharraf-bastu', 'kangal-harinath-museum'],
    transportInfo: 'কুষ্টিয়া শহর থেকে কুমারখালী বাজার বা ছেঁউড়িয়া হয়ে প্রতিনিয়ত লোকাল বাস, সিএনজি ও ইজিবাইক চলাচল করে। কুমারখালী রেলওয়ে স্টেশন থেকেও ট্রেন চলাচল রয়েছে।',
    administrativeContacts: [
      { designation: 'উপজেলা নির্বাহী অফিসার (ইউএনও)', phone: '01713-300120', office: 'ইউএনও কার্যালয়, কুমারখালী' },
      { designation: 'অফিসার ইনচার্জ (ওসি)', phone: '01320-146300', office: 'কুমারখালী থানা' }
    ],
    emergencyContacts: [
      { service: 'কুমারখালী উপজেলা স্বাস্থ্য কমপ্লেক্স', phone: '01730-324888' },
      { service: 'কুমারখালী ফায়ার সার্ভিস স্টেশন', phone: '01724-998877' }
    ],
    googleMapUrl: 'https://maps.google.com/?q=Kumarkhali+Upazila+Complex+Kushtia'
  },

  'bheramara': {
    id: 'bheramara',
    name: 'ভেড়ামারা',
    fullName: 'ভেড়ামারা উপজেলা',
    englishName: 'Bheramara Upazila',
    coverImage: bheramaraImg,
    galleryImages: [
      bheramaraImg
    ],
    area: '১৫৩.৭২ বর্গকিলোমিটার',
    population: 'প্রায় ২,২০,০০০ জন',
    unionsCount: '৬টি ইউনিয়ন ও ১টি পৌরসভা',
    literacyRate: '৬৩.৫%',
    postCode: '৭০৪০',
    famousFor: [
      'শতবর্ষী হার্ডিঞ্জ ব্রিজ ও চার লেনের লালন শাহ সেতু',
      'দেশের বৃহত্তম গঙ্গা-কপোতাক্ষ সেচ প্রকল্প (জিকে প্রজেক্ট) পাম্প হাউস',
      'ভেড়ামারা বিদ্যুৎ উৎপাদন কেন্দ্র',
      'পদ্মা নদীর রূপালী ইলিশ ও সুস্বাদু মিষ্টি'
    ],
    overview: 'ভেড়ামারা উপজেলা উত্তরবঙ্গ ও দক্ষিণবঙ্গের প্রধান সেতুবন্ধন। পদ্মা নদীর তীরে অবস্থিত ঐতিহাসিক হার্ডিঞ্জ ব্রিজ ও লালন শাহ সেতু এই উপজেলার প্রবেশদ্বারে অবস্থিত। দেশের বৃহত্তম আধুনিক কৃষি সেচ প্রকল্প জিকে প্রকল্প পাম্প হাউস এখানেই অবস্থিত।',
    history: '১৯৮৩ সালে ভেড়ামারা থানাকে উপজেলায় উন্নীত করা হয়। ব্রিটিশ আমলে হার্ডিঞ্জ ব্রিজ নির্মাণের মধ্য দিয়ে ভেড়ামারা রেল যোগাযোগ ও বাণিজ্যে যুগান্তকারী গুরুত্ব অর্জন করে।',
    rivers: ['পদ্মা নদী', 'হিসনা নদী'],
    economy: 'কৃষি, ফলমূল (লিচু ও আম), পদ্মা নদীর মৎস্য শিকার ও বৃহৎ বিদ্যুৎ উৎপাদন খাত।',
    topPlaceIds: ['hardinge-bridge'],
    transportInfo: 'কুষ্টিয়া থেকে বাস ও সিএনজিতে মাত্র ৪০ মিনিটে ভেড়ামারা এবং লালন শাহ সেতুতে পৌঁছানো যায়। ভেড়ামারা রেলওয়ে স্টেশনে আন্তঃনগর ট্রেন থামে।',
    administrativeContacts: [
      { designation: 'উপজেলা নির্বাহী অফিসার (ইউএনও)', phone: '01713-300140', office: 'ইউএনও ভবন, ভেড়ামারা' },
      { designation: 'অফিসার ইনচার্জ (ওসি)', phone: '01320-146400', office: 'ভেড়ামারা থানা' }
    ],
    emergencyContacts: [
      { service: 'ভেড়ামারা উপজেলা স্বাস্থ্য কমপ্লেক্স', phone: '01712-990011' },
      { service: 'ভেড়ামারা ফায়ার সার্ভিস স্টেশন', phone: '01720-334455' }
    ],
    googleMapUrl: 'https://maps.google.com/?q=Bheramara+Upazila+Kushtia'
  },

  'mirpur': {
    id: 'mirpur',
    name: 'মিরপুর',
    fullName: 'মিরপুর উপজেলা',
    englishName: 'Mirpur Upazila',
    coverImage: mirpurImg,
    galleryImages: [
      mirpurImg
    ],
    area: '৩১৭.৩৫ বর্গকিলোমিটার',
    population: 'প্রায় ৩,৫০,০০০ জন',
    unionsCount: '১৩টি ইউনিয়ন ও ১টি পৌরসভা',
    literacyRate: '৫৮.২%',
    postCode: '৭০৩০',
    famousFor: [
      'দেশের ঐতিহ্যবাহী ও ব্যস্ততম পোড়াদহ রেলওয়ে জংশন',
      'বৃহত্তম পাইকারি কাপড়ের হাট (পোড়াদহ কাপড়ের হাট)',
      'কৃষি ও সুস্বাদু কাঁচা মরিচ, গম ও ডাল উৎপাদন',
      'আমলা সরকারি কলেজ ও ঐতিহ্যবাহী বিদ্যাপীঠ'
    ],
    overview: 'মিরপুর উপজেলা কুষ্টিয়ার বৃহত্তম কৃষি ও বাণিজ্যিক কেন্দ্রগুলোর একটি। এর পোড়াদহ কাপড়ের হাট বাংলাদেশের উত্তর ও দক্ষিণবঙ্গের অন্যতম প্রধান পাইকারি কাপড়ের বাজার যেখানে দেশের নানা প্রান্ত থেকে ব্যবসায়ীরা আসেন। পোড়াদহ জংশন বাংলাদেশের অন্যতম প্রাচীন রেলওয়ে জংশন।',
    history: 'মিরপুর উপজেলা ১৯৮৩ সালে প্রতিষ্ঠিত হয়। ইতিহাস সাক্ষ্য দেয় পোড়াদহ ব্রিটিশ আমল থেকেই রেলপথের প্রধান জংশন হিসেবে খ্যাত ছিল।',
    rivers: ['পদ্মা নদী', 'সাগরখালী নদী', 'হিসনা'],
    economy: 'পোড়াদহ বস্ত্র ব্যবসা, চালকল শিল্প, তামাক ও ডাল-মসলা বাণিজ্য।',
    topPlaceIds: ['poradah-cloth-market'],
    transportInfo: 'পোড়াদহ জংশনে দেশের প্রায় সব প্রধান আন্তঃনগর ট্রেন থামে। এছাড়া কুষ্টিয়া মজমপুর থেকে নিয়মিত বাস ও সিএনজি চালু রয়েছে।',
    administrativeContacts: [
      { designation: 'উপজেলা নির্বাহী অফিসার (ইউএনও)', phone: '01713-300130', office: 'ইউএনও কার্যালয়, মিরপুর' },
      { designation: 'অফিসার ইনচার্জ (ওসি)', phone: '01320-146500', office: 'মিরপুর থানা' }
    ],
    emergencyContacts: [
      { service: 'মিরপুর উপজেলা স্বাস্থ্য কমপ্লেক্স', phone: '01715-667788' },
      { service: 'মিরপুর ফায়ার সার্ভিস', phone: '01730-889922' }
    ],
    googleMapUrl: 'https://maps.google.com/?q=Mirpur+Upazila+Kushtia'
  },

  'khoksa': {
    id: 'khoksa',
    name: 'খোকসা',
    fullName: 'খোকসা উপজেলা',
    englishName: 'Khoksa Upazila',
    coverImage: khoksaImg,
    galleryImages: [
      khoksaImg
    ],
    area: '১০৬.৭০ বর্গকিলোমিটার',
    population: 'প্রায় ১,৪০,০০০ জন',
    unionsCount: '৯টি ইউনিয়ন ও ১টি পৌরসভা',
    literacyRate: '৬২.১%',
    postCode: '৭০২০',
    famousFor: [
      'শতবর্ষী ঐতিহ্যবাহী খোকসা কালীপূজা ও মেলা',
      'গড়াই নদীর তীরে মনোরম প্রাকৃতিক পরিবেশ',
      'হাতে বোনা সুতি গামছা ও চাঁদর',
      'সুস্বাদু মিষ্টি ও দুগ্ধজাত খাবার'
    ],
    overview: 'খোকসা কুষ্টিয়া জেলার পূর্ব প্রান্তে রাজবাড়ী জেলা সংলগ্ন শান্ত শ্যামল উপজেলা। গড়াই নদীর অববাহিকায় অবস্থিত এই উপজেলায় হিন্দু সম্প্রদায়ের ঐতিহাসিক খোকসা কালীপূজা ও শতবর্ষী গ্রামীণ মেলা অনুষ্ঠিত হয়।',
    history: 'খোকসা থানা গঠিত হয় ১৯৫৫ সালে এবং ১৯৮৩ সালে উপজেলায় উন্নীত হয়। এটি লোকসংস্কৃতি ও সাম্প্রদায়িক সম্প্রীতির এক অনন্য উদাহরণ।',
    rivers: ['গড়াই নদী'],
    economy: 'কৃষি, আখ চাষ ও গুড় তৈরি, তাঁত বস্ত্র ও মৎস্য চাষ।',
    topPlaceIds: ['gorai-bridge-park'],
    transportInfo: 'কুষ্টিয়া মজমপুর থেকে কুমারখালী হয়ে রাজবাড়ী রোডে বাসে খোকসা যাওয়া যায়। খোকসা রেলওয়ে স্টেশনও রয়েছে।',
    administrativeContacts: [
      { designation: 'উপজেলা নির্বাহী অফিসার (ইউএনও)', phone: '01713-300150', office: 'ইউএনও কার্যালয়, খোকসা' },
      { designation: 'অফিসার ইনচার্জ (ওসি)', phone: '01320-146600', office: 'খোকসা থানা' }
    ],
    emergencyContacts: [
      { service: 'খোকসা উপজেলা স্বাস্থ্য কমপ্লেক্স', phone: '01714-332211' },
      { service: 'খোকসা ফায়ার স্টেশন', phone: '01725-667788' }
    ],
    googleMapUrl: 'https://maps.google.com/?q=Khoksa+Upazila+Kushtia'
  },

  'daulatpur': {
    id: 'daulatpur',
    name: 'দৌলতপুর',
    fullName: 'দৌলতপুর উপজেলা',
    englishName: 'Daulatpur Upazila',
    coverImage: daulatpurImg,
    galleryImages: [
      daulatpurImg
    ],
    area: '৪৬৮.৭৬ বর্গকিলোমিটার',
    population: 'প্রায় ৫,১০,০০০ জন',
    unionsCount: '১৪টি ইউনিয়ন',
    literacyRate: '৫৬.৪%',
    postCode: '৭০৫০',
    famousFor: [
      'পদ্মার বিস্তীর্ণ চিলমারী চর ও প্রাকৃতিক দৃশ্য',
      'কুষ্টিয়ার বৃহত্তম আয়তনের সীমান্ত উপজেলা',
      'তামাক, গম, ভুট্টা ও পাট ফসলের উর্বর ভূমি',
      'আল্লারদর্গা বাজার ও প্রাণচাঞ্চল্য'
    ],
    overview: 'দৌলতপুর কুষ্টিয়া জেলার আয়তনের দিক থেকে সর্ববৃহৎ উপজেলা। ভারতের পশ্চিমবঙ্গ সীমান্ত ঘেঁষা এই উপজেলা পদ্মা নদীর সুবিশাল চরাঞ্চল ও উর্বর কৃষিক্ষেত্র নিয়ে গঠিত। আল্লারদর্গা ও প্রাগপুর এই উপজেলার অন্যতম বাণিজ্যিক কেন্দ্র।',
    history: 'দৌলতপুর প্রাচীনকাল থেকেই কৃষিনির্ভর গুরুত্বপূর্ণ জনপদ। ১৯৭১ সালের মুক্তিযুদ্ধে দৌলতপুরের সীমান্ত এলাকা দিয়ে মুক্তিযোদ্ধারা বীরত্বপূর্ণ অভিযান পরিচালনা করেছিলেন।',
    rivers: ['পদ্মা নদী', 'মাথাভাঙ্গা নদী'],
    economy: 'কৃষি, তামাক চাষ, ধান-পাট-ভুট্টা ও সীমান্ত বাণিজ্য।',
    topPlaceIds: ['hardinge-bridge'],
    transportInfo: 'কুষ্টিয়া শহর ও ভেড়ামারা হয়ে নিয়মিত বাস ও সিএনজি দৌলতপুর এবং আল্লারদর্গায় চলাচল করে।',
    administrativeContacts: [
      { designation: 'উপজেলা নির্বাহী অফিসার (ইউএনও)', phone: '01713-300160', office: 'ইউএনও অফিস, দৌলতপুর' },
      { designation: 'অফিসার ইনচার্জ (ওসি)', phone: '01320-146700', office: 'দৌলতপুর থানা' }
    ],
    emergencyContacts: [
      { service: 'দৌলতপুর উপজেলা স্বাস্থ্য কমপ্লেক্স', phone: '01711-889900' },
      { service: 'দৌলতপুর ফায়ার সার্ভিস স্টেশন', phone: '01726-554433' }
    ],
    googleMapUrl: 'https://maps.google.com/?q=Daulatpur+Upazila+Kushtia'
  }
};

export const RAJSHAHI_PLACES = KUSHTIA_PLACES;
export const RAJSHAHI_UPAZILAS = KUSHTIA_UPAZILAS;

