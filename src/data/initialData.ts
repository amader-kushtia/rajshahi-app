import { PostItem, Doctor, BloodDonor, TechnicianService, TransportSchedule, EmergencyHelpline, FundDonation, FundExpense } from '../types';

export const INITIAL_POSTS: PostItem[] = [
  // বাসা ভাড়া
  {
    id: 'rent-1',
    category: 'house-rent',
    title: 'হাউজিং এস্টেট বি-ব্লকে ৩ রুমের আধুনিক ফ্যামিলি ফ্ল্যাট ভাড়া',
    description: 'সম্পূর্ণ টাইলস করা, সার্বক্ষণিক সিসিটিভি ও নিরাপদ পরিবেশ। নিজস্ব সাবমার্সিবল পানির ব্যবস্থা, পর্যাপ্ত আলো-বাতাসযুক্ত বারান্দা ও নিরিবিলি আবাসিক পরিবেশ। সরকারি কর্মকর্তা ও ছোট পরিবারের জন্য উপযুক্ত।',
    price: '১০,৫০০ ৳/মাস',
    location: 'হাউজিং এস্টেট, কুষ্টিয়া',
    subcategory: 'ফ্যামিলি বাসা',
    contactPhone: '01712345678',
    whatsapp: '01712345678',
    facebook: 'https://facebook.com/kushtia',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=450&auto=format&fit=crop&q=70',
    authorName: 'হাফিজুর রহমান',
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    isVerified: true,
    featured: true,
    likes: 42,
    views: 320,
    details: {
      rooms: '৩টি বেডরুম, ১টি ড্রয়িং',
      bathrooms: '২টি (১টি অ্যাটাচড)',
      floor: '৩য় তলা (লিফট নেই)',
    }
  },
  {
    id: 'rent-2',
    category: 'house-rent',
    title: 'কুষ্টিয়া সরকারি কলেজ ও মজমপুর গেটের কাছে ছাত্রদের জন্য ফার্নিশড মেস',
    description: 'খাবার ব্যবস্থা সহ মিল সিস্টেম, হাই স্পিড ওয়াইফাই, ২৪ ঘণ্টা বিদ্যুৎ ও ফিল্টার পানির সুবিধা। কুষ্টিয়া সরকারি কলেজ ও কোর্ট স্টেশনের কাছেই।',
    price: '২,৬০০ ৳/সিট',
    location: 'মজমপুর, কুষ্টিয়া',
    subcategory: 'ব্যাচেলর মেস',
    contactPhone: '01789112233',
    whatsapp: '01789112233',
    facebook: 'https://facebook.com/kushtia',
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=450&auto=format&fit=crop&q=70',
    authorName: 'আব্দুল কাদের',
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
    isVerified: true,
    likes: 18,
    views: 195,
    details: {
      rooms: '২ সিটের বড় রুম',
      bathrooms: 'কমন টয়লেট ও গোসলখানা',
      floor: '২য় তলা',
    }
  },
  {
    id: 'rent-3',
    category: 'house-rent',
    title: 'থানাপাড়া ও গড়াই নদী বাঁধ সংলগ্ন ২ রুমের পরিপাটি সাবলেট ফ্ল্যাট',
    description: 'ছোট ফ্যামিলি বা চাকরিজীবী দম্পতির জন্য অত্যন্ত পরিষ্কার-পরিচ্ছন্ন সাবলেট। আলাদা মিটার এবং প্রিপেইড গ্যাস সিলিন্ডার ব্যবহারের ব্যবস্থা। মনোরম নদীর বাতাস।',
    price: '৬,৫০০ ৳/মাস',
    location: 'থানাপাড়া, কুষ্টিয়া',
    subcategory: 'সাবলেট',
    contactPhone: '01309876543',
    whatsapp: '01309876543',
    facebook: 'https://facebook.com/kushtia',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=450&auto=format&fit=crop&q=70',
    authorName: 'সুমাইয়া পারভীন',
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    isVerified: false,
    likes: 9,
    views: 110,
    details: {
      rooms: '১টি বেডরুম, ডাইনিং স্পেস',
      bathrooms: '১টি এটাচড বাথরুম',
      floor: '৪র্থ তলা',
    }
  },

  // বাই-সেল (Buy-Sell)
  {
    id: 'buy-1',
    category: 'buy-sell',
    title: 'পোড়াদহ হাটের ঐতিহ্যবাহী খাঁটি সুতি তাঁতের শাড়ি ও জামদানি',
    description: 'কুষ্টিয়ার বিখ্যাত কুমারখালী ও পোড়াদহের নিখুঁত বুননের সুতি ও সফট সিল্ক শাড়ি। সরাসরি তাঁতিদের থেকে সংগৃহীত। কুষ্টিয়া সদরে ক্যাশ অন হোম ডেলিভারি ফ্রি।',
    price: '১,৪৫০ ৳',
    location: 'পোড়াদহ / মজমপুর, কুষ্টিয়া',
    subcategory: 'পোশাক ও ফ্যাশন',
    contactPhone: '01911223344',
    whatsapp: '01911223344',
    facebook: 'https://facebook.com/kushtia',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=450&auto=format&fit=crop&q=70',
    authorName: 'কুষ্টিয়া তাঁত সম্ভার',
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    isVerified: true,
    likes: 34,
    views: 240
  },
  {
    id: 'buy-2',
    category: 'buy-sell',
    title: 'কুষ্টিয়া মেট্রো ল-১১ সিরিজের সুজুকি জিক্সার ১৫- এফআই এবিএস বিক্রয়',
    description: 'একদম ফ্রেশ কন্ডিশন, মাত্র ১২,০০০ কিমি চলা। কোনো প্রকার এক্সিডেন্ট হিস্ট্রি নেই। কুষ্টিয়া বিআরটিএ প্রথম মালিকের নামে স্মার্ট কার্ড ট্যাক্স টোকেন ২০২৭ পর্যন্ত আপডেট।',
    price: '১,৭৫,০০০ ৳',
    location: 'কোর্টপাড়া, কুষ্টিয়া',
    subcategory: 'মোটরসাইকেল ও যানবাহন',
    contactPhone: '01755667788',
    whatsapp: '01755667788',
    facebook: 'https://facebook.com/kushtia',
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=450&auto=format&fit=crop&q=70',
    authorName: 'তারেক মাহমুদ',
    createdAt: Date.now() - 1000 * 60 * 60 * 8,
    isVerified: true,
    likes: 29,
    views: 410
  },
  {
    id: 'buy-3',
    category: 'buy-sell',
    title: 'কুষ্টিয়ার বিখ্যাত সুস্বাদু স্পেশাল তিলের খাজা (১ কেজি প্রিমিয়াম বক্স)',
    description: 'কুষ্টিয়ার ঐতিহ্যবাহী স্বাদের আসল মুচমুচে তিলের খাজা। খাঁটি চিনি ও সাদা তিলে প্রস্তুত। কোনো কৃত্রিম গন্ধ বা ক্ষতিকর উপাদান নেই। সারা বাংলাদেশে হোম ডেলিভারি করা হয়।',
    price: '৩৫০ ৳/কেজি',
    location: 'এনএস রোড, কুষ্টিয়া',
    subcategory: 'খাবার ও মিষ্টি',
    contactPhone: '01811223344',
    whatsapp: '01811223344',
    facebook: 'https://facebook.com/kushtia',
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=450&auto=format&fit=crop&q=70',
    authorName: 'দেশ বিখ্যাত খাঁটি খাজা ভান্ডার',
    createdAt: Date.now() - 1000 * 60 * 60 * 18,
    isVerified: true,
    likes: 56,
    views: 520
  },

  // রক্তদাতা / ব্লাড ব্যাংক
  {
    id: 'blood-1',
    category: 'blood',
    title: 'জরুরি ভিত্তিতে ২ ব্যাগ O+ (পজিটিভ) রক্ত প্রয়োজন',
    description: 'কুষ্টিয়া ২৫০ শয্যা জেনারেল হাসপাতালে চিকিৎসাধীন একজন ডেলিভারি রোগীর জন্য জরুরি ভিত্তিতে রক্ত প্রয়োজন। রক্তদাতার যাতায়াত খরচ দেওয়া হবে। অনুগ্রহ করে দ্রুত যোগাযোগ করুন।',
    price: 'জরুরি / বিনামূল্যে',
    location: 'কুষ্টিয়া ২৫০ শয্যা জেনারেল হাসপাতাল',
    subcategory: 'O+ পজিটিভ',
    contactPhone: '01777889900',
    whatsapp: '01777889900',
    facebook: 'https://facebook.com/kushtia',
    imageUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=450&auto=format&fit=crop&q=70',
    authorName: 'স্বেচ্ছাসেবী ব্লাড হেল্পলাইন কুষ্টিয়া',
    createdAt: Date.now() - 1000 * 60 * 45,
    isVerified: true,
    featured: true,
    likes: 88,
    views: 750
  },

  // গোপন তথ্য (Crime Reporter)
  {
    id: 'crime-1',
    category: 'crime-reporter',
    title: 'চৌড়হাস মোড় ও বাসস্ট্যান্ড এলাকায় অতিরিক্ত ভাড়া আদায়ের বিরুদ্ধে অভিযোগ',
    description: 'মজমপুর গেট ও চৌড়হাস মোড়ে কিছু অসাধু পরিবহন চালক অতিরিক্ত ভাড়া দাবি করছে। সাধারণ যাত্রী ও শিক্ষার্থীদের সাথে অসৌজন্যমূলক আচরণ করা হচ্ছে। প্রশাসনের দৃষ্টি আকর্ষণ করছি।',
    price: 'তথ্য অনুসন্ধান',
    location: 'চৌড়হাস মোড়, কুষ্টিয়া',
    subcategory: 'নাগরিক ভোগান্তি',
    contactPhone: '100 (গোপন রিপোর্টার)',
    whatsapp: '100',
    facebook: 'https://facebook.com/kushtia',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=450&auto=format&fit=crop&q=70',
    authorName: 'সচেতন কুষ্টিয়াবাসী',
    createdAt: Date.now() - 1000 * 60 * 60 * 15,
    isVerified: true,
    likes: 73,
    views: 680
  },

  // রেস্টুরেন্ট ও খাবার
  {
    id: 'food-1',
    category: 'food',
    title: 'মৌচাক রেস্তোরাঁ ও ক্যাফে - স্পেশাল কাচ্চি বিরিয়ানি ও বুফে',
    description: 'পরিবার নিয়ে খাওয়ার সেরা পরিবেশ। খাঁটি গাওয়া ঘিয়ের বাসমতি কাচ্চি বিরিয়ানি, চিকেন ফ্রাই, চাইনিজ ও কুষ্টিয়ার বিখ্যাত মিষ্টি ও ফিরনি। এসি হলরুম ও ফ্যামিলি কেবিন সুবিধা।',
    price: '২৯০ ৳ হতে শুরু',
    location: 'মজমপুর গেট, কুষ্টিয়া',
    subcategory: 'ফ্যামিলি ডাইনিং',
    contactPhone: '01711998877',
    whatsapp: '01711998877',
    facebook: 'https://facebook.com/kushtia',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=450&auto=format&fit=crop&q=70',
    authorName: 'মৌচাক রেস্তোরাঁ কর্তৃপক্ষ',
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
    isVerified: true,
    likes: 67,
    views: 890,
    rating: 4.8,
    reviewsCount: 38
  },
  {
    id: 'food-2',
    category: 'food',
    title: 'কুষ্টিয়ার বিখ্যাত সুস্বাদু কুলফি মালাই ও স্পেশাল ক্ষীরসা',
    description: 'আসল গাভির ঘন দুধ, পেস্তা বাদাম ও জাফরানের সংমিশ্রণে তৈরি মুখে লেগে থাকার মতো কুলফি মালাই। যেকোনো অনুষ্ঠান বা গায়ে হলুদে স্পেশাল অর্ডারে সরবরাহ করা হয়।',
    price: '৫০ ৳ / পিস',
    location: 'এনএস রোড / থানা মোড়, কুষ্টিয়া',
    subcategory: 'আইসক্রিম ও ডেজার্ট',
    contactPhone: '01722334455',
    whatsapp: '01722334455',
    facebook: 'https://facebook.com/kushtia',
    imageUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=450&auto=format&fit=crop&q=70',
    authorName: 'কুষ্টিয়া কুলফি মালাই হাউস',
    createdAt: Date.now() - 1000 * 60 * 60 * 16,
    isVerified: true,
    likes: 95,
    views: 1100,
    rating: 4.9,
    reviewsCount: 52
  },

  // চাকরি ও নিয়োগ (Jobs)
  {
    id: 'jobs-1',
    category: 'jobs',
    title: 'কুষ্টিয়া বিসিক শিল্পনগরীতে একাউন্ট্যান্ট ও কম্পিউটার অপারেটর নিয়োগ',
    description: 'একটি প্রতিষ্ঠিত উৎপাদনকারী প্রতিষ্ঠানে একজন অভিজ্ঞ একাউন্ট্যান্ট ও একজন ডাটা এন্ট্রি অপারেটর প্রয়োজন। নূন্যতম ডিগ্রি/বিবিএ পাস এবং ট্যালি সফটওয়্যার চালনায় পারদর্শী হতে হবে।',
    price: '১৮,০০০ - ২৫,০০০ ৳',
    location: 'বিসিক শিল্পনগরী, কুষ্টিয়া',
    subcategory: 'অফিস জব',
    contactPhone: '01733445566',
    whatsapp: '01733445566',
    facebook: 'https://facebook.com/kushtia',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=450&auto=format&fit=crop&q=70',
    authorName: 'এইচআর ডিপার্টমেন্ট',
    createdAt: Date.now() - 1000 * 60 * 60 * 10,
    isVerified: true,
    likes: 41,
    views: 590
  },

  // হারানো ও প্রাপ্তি (Lost and Found)
  {
    id: 'lost-1',
    category: 'lost-found',
    title: 'কুষ্টিয়া কোর্ট স্টেশন সংলগ্ন এলাকায় জরুরি ফাইল ও এনআইডি কার্ড হারানো',
    description: 'আজ সকালে কুষ্টিয়া কোর্ট স্টেশন থেকে মজমপুর যাওয়ার পথে একটি বাদামী রঙের চামড়ার ফাইলে জমির দলিল ও জাতীয় পরিচয়পত্র রয়ে গেছে। সন্ধানদাতাকে উপযুক্ত পুরস্কৃত করা হবে।',
    price: 'পুরস্কার ঘোষিত',
    location: 'কোর্ট স্টেশন চত্বর, কুষ্টিয়া',
    subcategory: 'ডকুমেন্ট ও ফাইল',
    contactPhone: '01799001122',
    whatsapp: '01799001122',
    facebook: 'https://facebook.com/kushtia',
    imageUrl: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=450&auto=format&fit=crop&q=70',
    authorName: 'মোঃ শফিউল আলম',
    createdAt: Date.now() - 1000 * 60 * 60 * 4,
    isVerified: false,
    likes: 25,
    views: 310
  },

  // আইনি সহায়তা (Legal)
  {
    id: 'legal-1',
    category: 'legal',
    title: 'কুষ্টিয়া জেলা ও দায়রা জজ আদালত - অভিজ্ঞ দেওয়ানি ও ফৌজদারি আইনজীবী',
    description: 'জমিজমা সংক্রান্ত জটিলতা, বণ্টননামা, দলিল রেজিস্ট্রি ও ফৌজদারি মামলায় সার্বক্ষণিক বিশ্বস্ত আইনি পরামর্শ ও সমাধান প্রদান করা হয়।',
    price: 'পরামর্শ ফি সাশ্রয়ী',
    location: 'আইনজীবী সমিতি ভবন, কোর্টপাড়া, কুষ্টিয়া',
    subcategory: 'আইনি পরামর্শ',
    contactPhone: '01715667788',
    whatsapp: '01715667788',
    facebook: 'https://facebook.com/kushtia',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=450&auto=format&fit=crop&q=70',
    authorName: 'অ্যাডভোকেট মোঃ মোকাররম হোসেন',
    createdAt: Date.now() - 1000 * 60 * 60 * 20,
    isVerified: true,
    likes: 31,
    views: 280,
    rating: 4.8,
    reviewsCount: 16
  },

  // অনুষ্ঠান ও ডেকোর (Events)
  {
    id: 'events-1',
    category: 'events',
    title: 'রয়াল ইভেন্ট ম্যানেজমেন্ট ও লাইটিং ডেকোরেশন কুষ্টিয়া',
    description: 'বিয়ে, বৌভাত, হলুদ সন্ধ্যা, কর্পোরেট সেমিনার ও জন্মদিন উপলক্ষে আধুনিক স্টেজ ডিজাইন, ফুল সজ্জা, ডিজে ও উন্নত সাউন্ড সিস্টেমের পূর্ণাঙ্গ প্যাকেজ।',
    price: 'প্যাকেজ আলোচনা সাপেক্ষে',
    location: 'এনএস রোড, কুষ্টিয়া',
    subcategory: 'ইভেন্ট ও ডেকোরেশন',
    contactPhone: '01744556677',
    whatsapp: '01744556677',
    facebook: 'https://facebook.com/kushtia',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=450&auto=format&fit=crop&q=70',
    authorName: 'রয়াল ডেকোরেটরস',
    createdAt: Date.now() - 1000 * 60 * 60 * 22,
    isVerified: true,
    likes: 48,
    views: 430,
    rating: 4.9,
    reviewsCount: 22
  },

  // ড্রাইভার (Driver)
  {
    id: 'driver-1',
    category: 'driver',
    title: 'কুষ্টিয়া রেন্ট-এ-কার ও দক্ষ ড্রাইভারসহ এসি মাইক্রোবাস সার্ভিস',
    description: 'কুষ্টিয়া থেকে ঢাকা বিমানবন্দর, বেনাপোল, কুষ্টিয়া ও সমগ্র বাংলাদেশে নোয়া, ভক্সি ও এক্স করোলা কার রিজার্ভ পাওয়া যায়। অভিজ্ঞ ও দক্ষ ড্রাইভার।',
    price: 'ভাড়া আলোচনা সাপেক্ষে',
    location: 'মজমপুর গেট, কুষ্টিয়া',
    subcategory: 'ড্রাইভার ও কার রেন্ট',
    contactPhone: '01712998844',
    whatsapp: '01712998844',
    facebook: 'https://facebook.com/kushtia',
    imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=450&auto=format&fit=crop&q=70',
    authorName: 'কুষ্টিয়া এক্সপ্রেস রেন্ট-এ-কার',
    createdAt: Date.now() - 1000 * 60 * 60 * 14,
    isVerified: true,
    likes: 52,
    views: 490,
    rating: 4.9,
    reviewsCount: 29
  },

  // গৃহশিক্ষক (Tutor)
  {
    id: 'tutor-1',
    category: 'tutor',
    title: 'কুষ্টিয়া সরকারি কলেজের মেধাবী শিক্ষক দ্বারা নবম-দশম ও একাদশ শ্রেণির পদার্থ ও গণিত পড়ানো হয়',
    description: 'বেসিক থেকে সৃজনশীল ও বোর্ড পরীক্ষার পূর্ণাঙ্গ প্রস্তুতি। কুষ্টিয়া শহরের হাউজিং, কোর্টপাড়া ও মজমপুর এলাকায় হোম টিউটর হিসেবে দায়িত্ব সহকারে পড়ানো হয়।',
    price: '৩,৫০০ - ৫,০০০ ৳/মাস',
    location: 'হাউজিং / কোর্টপাড়া, কুষ্টিয়া',
    subcategory: 'বিজ্ঞান বিভাগ',
    contactPhone: '01766778899',
    whatsapp: '01766778899',
    facebook: 'https://facebook.com/kushtia',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=450&auto=format&fit=crop&q=70',
    authorName: 'মাসুদ রানা (বিএসসি অনার্স, পদার্থ)',
    createdAt: Date.now() - 1000 * 60 * 60 * 22,
    isVerified: true,
    likes: 62,
    views: 430,
    rating: 4.9,
    reviewsCount: 14
  }
];

export const KUSHTIA_AREAS = [
  'মজমপুর গেট',
  'কোর্টপাড়া',
  'এনএস রোড',
  'হাউজিং এস্টেট',
  'থানাপাড়া',
  'কালিশংকরপুর',
  'মিলপাড়া',
  'চৌড়হাস',
  'বটতৈল মোড়',
  'কাস্টমস মোড়',
  'হরিপুর ব্রিজ সংলগ্ন',
  'কুমারখালী বাজার',
  'ছেঁউড়িয়া (লালন মাজার)',
  'পোড়াদহ কাপড়ের হাট',
  'ভেড়ামারা বাজার ও রেলগেট',
  'খোকসা জানিপুর',
  'দৌলতপুর আল্লারদর্গা'
];

export const RAJSHAHI_AREAS = KUSHTIA_AREAS;

export const DOCTORS_LIST: Doctor[] = [
  {
    id: 'doc-1',
    name: 'ডাঃ মোঃ আব্দুল হামিদ',
    speciality: 'মেডিসিন ও বক্ষব্যাধি বিশেষজ্ঞ',
    degree: 'এমবিবিএস (ডিএমসি), বিসিএস (স্বাস্থ্য), এফসিপিএস (মেডিসিন)',
    hospital: 'কুষ্টিয়া ২৫০ শয্যা জেনারেল হাসপাতাল',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, মজমপুর, কুষ্টিয়া',
    visitingHours: 'প্রতিদিন বিকাল ৪:০০ টা - রাত ৮:৩০ টা (শুক্রবার বন্ধ)',
    serialNumber: '01715889900',
    fee: '৭০০ ৳',
    availableDays: 'শনিবার হতে বৃহস্পতিবার',
    isVerified: true
  },
  {
    id: 'doc-2',
    name: 'ডাঃ ফারহানা ইয়াসমিন',
    speciality: 'স্ত্রী রোগ ও প্রসূতিবিদ্যা বিশেষজ্ঞ (গাইনী)',
    degree: 'এমবিবিএস, ডিজিও, এফসিপিএস (গাইনী অ্যান্ড অবস)',
    hospital: 'কুষ্টিয়া মেডিকেল কলেজ হাসপাতাল',
    chamber: 'ডক্টরস ল্যাব ও ডায়াগনস্টিক, কোর্টপাড়া, কুষ্টিয়া',
    visitingHours: 'প্রতিদিন দুপুর ৩:০০ টা - সন্ধ্যা ৭:০০ টা',
    serialNumber: '01733667788',
    fee: '৮০০ ৳',
    availableDays: 'প্রতিদিন',
    isVerified: true
  },
  {
    id: 'doc-3',
    name: 'ডাঃ আসিফ ইমরান',
    speciality: 'অর্থোপেডিক ও ট্রমা সার্জন (হাড়ভাঙ্গা ও বাত বিশেষজ্ঞ)',
    degree: 'এমবিবিএস, এমএস (অর্থোপেডিক সার্জারি)',
    hospital: 'কুষ্টিয়া ২৫০ শয্যা বিশিষ্ট জেনারেল হাসপাতাল',
    chamber: 'ল্যাব এইড ডায়াগনস্টিক, মজমপুর গেট, কুষ্টিয়া',
    visitingHours: 'বিকাল ৫:০০ টা - রাত ৯:০০ টা',
    serialNumber: '01744112233',
    fee: '৭০০ ৳',
    availableDays: 'শনিবার হতে বুধবার',
    isVerified: true
  },
  {
    id: 'doc-4',
    name: 'ডাঃ নুসরাত জাহান',
    speciality: 'নবজাতক ও শিশু রোগ বিশেষজ্ঞ',
    degree: 'এমবিবিএস, ডিসিএইচ, এফসিপিএস (শিশু)',
    hospital: 'কুষ্টিয়া মেডিকেল কলেজ হাসপাতাল',
    chamber: 'মাদার অ্যান্ড চাইল্ড কেয়ার, থানা মোড়, কুষ্টিয়া',
    visitingHours: 'সকাল ১০:০০ টা - দুপুর ১:০০ টা ও বিকাল ৫:০০ - রাত ৮:০০',
    serialNumber: '01766554433',
    fee: '৬০০ ৳',
    availableDays: 'সপ্তাহের ৬ দিন',
    isVerified: true
  }
];

export const BLOOD_DONORS: BloodDonor[] = [
  {
    id: 'bd-1',
    name: 'তানভীর হাসান',
    bloodGroup: 'O+',
    phone: '01712998877',
    location: 'মজমপুর, কুষ্টিয়া',
    lastDonationDate: '১৫ নভেম্বর, ২০২৫',
    totalDonations: 8,
    isAvailable: true
  },
  {
    id: 'bd-2',
    name: 'রাশেদুল ইসলাম',
    bloodGroup: 'A+',
    phone: '01799887766',
    location: 'হাউজিং এস্টেট, কুষ্টিয়া',
    lastDonationDate: '১০ অক্টোবর, ২০২৫',
    totalDonations: 12,
    isAvailable: true
  },
  {
    id: 'bd-3',
    name: 'মাহমুদুল হক',
    bloodGroup: 'B+',
    phone: '01822334455',
    location: 'কোর্টপাড়া, কুষ্টিয়া',
    lastDonationDate: '২০ ডিসেম্বর, ২০২৫',
    totalDonations: 5,
    isAvailable: true
  },
  {
    id: 'bd-4',
    name: 'সামিয়া আক্তার',
    bloodGroup: 'AB+',
    phone: '01911445566',
    location: 'কুমারখালী বাজার, কুষ্টিয়া',
    lastDonationDate: '০৫ জানুয়ারি, ২০২৬',
    totalDonations: 4,
    isAvailable: false
  },
  {
    id: 'bd-5',
    name: 'জাহিদুল ইসলাম',
    bloodGroup: 'O-',
    phone: '01633221100',
    location: 'পোড়াদহ, কুষ্টিয়া',
    lastDonationDate: '০১ সেপ্টেম্বর, ২০২৫',
    totalDonations: 15,
    isAvailable: true
  }
];

export const TECHNICIANS_LIST: TechnicianService[] = [
  {
    id: 'tech-1',
    name: 'মোঃ রফিক ইলেকট্রিক্যাল',
    profession: 'দক্ষ ইলেকট্রিশিয়ান',
    skills: ['হাউস ওয়্যারিং', 'শর্ট সার্কিট মেরামত', 'আইপিএস ও ইউপিএস ইনস্টলেশন', 'সুইচবোর্ড ফিটিং'],
    area: 'মজমপুর ও হাউজিং, কুষ্টিয়া',
    phone: '01711223344',
    whatsapp: '01711223344',
    facebook: 'https://facebook.com/kushtia',
    experience: '৮ বছরের অভিজ্ঞতা',
    rating: 4.8,
    reviewsCount: 140,
    availableNow: true
  },
  {
    id: 'tech-2',
    name: 'সাদ্দাম স্যানিটারি ও প্লাম্বিং',
    profession: 'অভিজ্ঞ প্লাম্বার',
    skills: ['পাইপ লিকেজ ফিক্স', 'কমোড ও বেসিন ইনস্টল', 'সাবমার্সিবল মোটর মেরামত', 'পানির লাইন ওয়্যারিং'],
    area: 'কোর্টপাড়া ও থানা মোড়, কুষ্টিয়া',
    phone: '01722334455',
    whatsapp: '01722334455',
    facebook: 'https://facebook.com/kushtia',
    experience: '১০ বছরের অভিজ্ঞতা',
    rating: 4.9,
    reviewsCount: 165,
    availableNow: true
  },
  {
    id: 'tech-3',
    name: 'কুলিং কেয়ার এয়ারকন্ডিশন',
    profession: 'এসি ও ফ্রিজ মেকানিক',
    skills: ['এসি গ্যাস রিফিল', 'ইনভার্টার ফ্রিজ মেরামত', 'কম্প্রেসার প্রতিস্থাপন', 'ডিপ ক্লিনিং'],
    area: 'সমগ্র কুষ্টিয়া শহর ও আশেপাশের এলাকা',
    phone: '01733445566',
    whatsapp: '01733445566',
    facebook: 'https://facebook.com/kushtia',
    experience: '৭ বছরের অভিজ্ঞতা',
    rating: 4.7,
    reviewsCount: 98,
    availableNow: true
  },
  {
    id: 'tech-4',
    name: 'কুষ্টিয়া ডিজিটাল টেক অ্যান্ড মোবাইল মেকার',
    profession: 'অ্যাডভান্সড মোবাইল মেকার',
    skills: ['ডিসপ্লে ও টাচ চেঞ্জ', 'আইসি লেভেল রিপেয়ারিং', 'চার্জিং পোর্ট ফিক্স', 'মাদারবোর্ড সার্ভিসিং'],
    area: 'এনএস রোড, কুষ্টিয়া',
    phone: '01789112233',
    whatsapp: '01789112233',
    facebook: 'https://facebook.com/kushtia',
    experience: '১২ বছরের অভিজ্ঞতা',
    rating: 4.9,
    reviewsCount: 220,
    availableNow: true
  }
];

export const TRANSPORT_SCHEDULES: TransportSchedule[] = [
  {
    id: 'tr-1',
    type: 'ট্রেন',
    name: 'সুন্দরবন এক্সপ্রেস (Sundarban Express)',
    code: '৭২৫/৭২৬',
    route: 'খুলনা ⇄ ঢাকা (পোড়াদহ জংশন হয়ে)',
    departureTime: 'পোড়াদহ ছাড়ার সময়: দুপুর০১:১০',
    arrivalTime: 'ঢাকা পৌঁছার সময়: সন্ধ্যা ০৬:৫০',
    offDay: 'মঙ্গলবার',
    fareList: [
      { class: 'শোভন চেয়ার', fare: '৪৬৫ ৳' },
      { class: 'স্নিগ্ধা (এসি)', fare: '৮৯০ ৳' },
      { class: 'এসি বার্থ / কেবিন', fare: '১,৩৪০ ৳' }
    ],
    bookingPhone: '131 (রেলওয়ে হটলাইন)'
  },
  {
    id: 'tr-2',
    type: 'ট্রেন',
    name: 'বেনাপোল এক্সপ্রেস (Benapole Express)',
    code: '৭৯৫/৭৯৬',
    route: 'বেনাপোল ⇄ ঢাকা (পোড়াদহ হয়ে)',
    departureTime: 'পোড়াদহ ছাড়ার সময়: বিকাল ০৩:৪০',
    arrivalTime: 'ঢাকা পৌঁছার সময়: রাত ০৯:০০',
    offDay: 'বুধবার',
    fareList: [
      { class: 'শোভন চেয়ার', fare: '৪৭০ ৳' },
      { class: 'স্নিগ্ধা (এসি)', fare: '৯০০ ৳' }
    ],
    bookingPhone: '131'
  },
  {
    id: 'tr-3',
    type: 'ট্রেন',
    name: 'মধুমতি এক্সপ্রেস (Madhumati Express)',
    code: '৭৫৫/৭৫৬',
    route: 'ঢাকা ⇄ কুষ্টিয়া (কুষ্টিয়া কোর্ট স্টেশন হয়ে)',
    departureTime: 'কুষ্টিয়া কোর্ট ছাড়ার সময়: সকাল ০৮:৪০',
    arrivalTime: 'কুষ্টিয়া পৌঁছার সময়: সকাল ১০:৩০',
    offDay: 'বৃহস্পতিবার',
    fareList: [
      { class: 'শোভন চেয়ার', fare: '১৮০ ৳' },
      { class: 'স্নিগ্ধা (এসি)', fare: '৩৫০ ৳' }
    ],
    bookingPhone: '131'
  },
  {
    id: 'tr-4',
    type: 'ট্রেন',
    name: 'চিত্রা এক্সপ্রেস (Chitra Express)',
    code: '৭৬৩/৭৬৪',
    route: 'খুলনা ⇄ ঢাকা (পোড়াদহ হয়ে)',
    departureTime: 'পোড়াদহ ছাড়ার সময়: সকাল ১১:৩০',
    arrivalTime: 'ঢাকা পৌঁছার সময়: বিকাল ০৫:২০',
    offDay: 'সোমবার',
    fareList: [
      { class: 'শোভন চেয়ার', fare: '৪৬৫ ৳' },
      { class: 'স্নিগ্ধা (এসি)', fare: '৮৯০ ৳' }
    ],
    bookingPhone: '131'
  },
  {
    id: 'tr-5',
    type: 'বাস',
    name: 'এসবি সুপার ডিলাক্স (SB Super Deluxe)',
    code: 'মজমপুর গেট কাউন্টার, কুষ্টিয়া',
    route: 'কুষ্টিয়া ⇄ ঢাকা (গাবতলী / কল্যাণপুর / সাভার)',
    departureTime: 'প্রতি ৩০ মিনিট পর পর ২৪ ঘণ্টা বাস ছাড়ে',
    arrivalTime: 'সময় লাগে: পদ্মা সেতু হয়ে মাত্র ৩.৫ থেকে ৪ ঘণ্টা',
    offDay: 'সপ্তাহের ৭ দিনই চলাচল করে',
    fareList: [
      { class: 'ইকোনমি চেয়ার কোচ', fare: '৬৫০ ৳' },
      { class: 'এসি হুন্দাই লাক্সারি', fare: '১,০০০ ৳' }
    ],
    bookingPhone: '01711223399 (এসবি সুপার ডিলাক্স কুষ্টিয়া)'
  },
  {
    id: 'tr-6',
    type: 'বাস',
    name: 'শ্যামলী পরিবহন ও হানিফ এন্টারপ্রাইজ',
    code: 'মজমপুর বাস টার্মিনাল, কুষ্টিয়া',
    route: 'কুষ্টিয়া ⇄ ঢাকা, চট্টগ্রাম ও সিলেট',
    departureTime: 'সকাল ৬:০০ হতে রাত ১২:০০ পর্যন্ত প্রতি ২০ মিনিট পর পর',
    arrivalTime: 'দ্রুততম ও আরামদায়ক এক্সপ্রেস সার্ভিস',
    offDay: 'প্রতিদিন চালু',
    fareList: [
      { class: 'নন-এসি চেয়ার', fare: '৬৫০ ৳' },
      { class: 'এসি বিজনেস ক্লাস', fare: '১,১০০ ৳' }
    ],
    bookingPhone: '01712445566 (মজমপুর কাউন্টার)'
  },
  {
    id: 'tr-7',
    type: 'মাইক্রোবাস',
    name: 'কুষ্টিয়া এক্সপ্রেস রেন্ট-এ-কার সার্ভিস',
    code: 'Kushtia Rent-A-Car',
    route: 'কুষ্টিয়া ⇄ ঢাকা, মেহেরপুর, চুয়াডাঙ্গা, ঝিনাইদহ ও সমগ্র বাংলাদেশ',
    departureTime: 'যে কোনো সময় কল করলেই গাড়ি হাজির (২৪/৭)',
    arrivalTime: 'এসি নোয়া, প্রিমিও ও হাইয়েস মাইক্রোবাস',
    offDay: '২৪ ঘণ্টা খোলা',
    fareList: [
      { class: 'ঝিনাইদহ ড্রপ (প্রাইভেট কার)', fare: '১,১০০ ৳' },
      { class: 'ঢাকা ড্রপ (নোয়া এসি)', fare: '৬,০০০ ৳' },
      { class: 'সারাদিন লোকাল কুষ্টিয়া দর্শন', fare: '৩,৫০০ ৳' }
    ],
    bookingPhone: '01712998844'
  }
];

export const EMERGENCY_HELPLINES: EmergencyHelpline[] = [
  {
    id: 'em-1',
    title: 'জাতীয় জরুরি সেবা (পুলিশ, অ্যাম্বুলেন্স, ফায়ার)',
    dept: 'বাংলাদেশ সরকার',
    number: '999',
    alternateNumber: '112',
    address: 'সারাদেশব্যাপী টোল-ফ্রি',
    availableHours: '২৪ ঘণ্টা সার্বক্ষণিক',
    iconName: 'ShieldAlert'
  },
  {
    id: 'em-2',
    title: 'কুষ্টিয়া সদর মডেল থানা পুলিশ কন্ট্রোল রুম',
    dept: 'বাংলাদেশ পুলিশ, কুষ্টিয়া',
    number: '01320146000',
    alternateNumber: '071-62222',
    address: 'থানাপাড়া, কুষ্টিয়া সদর',
    availableHours: '২৪ ঘণ্টা ডিউটি অফিসার প্রস্তুত',
    iconName: 'ShieldCheck'
  },
  {
    id: 'em-3',
    title: 'কুষ্টিয়া ফায়ার সার্ভিস ও সিভিল ডিফেন্স',
    dept: 'ফায়ার স্টেশন কন্ট্রোল রুম',
    number: '01716123456',
    alternateNumber: '071-61222',
    address: 'মজমপুর সংলগ্ন, কুষ্টিয়া',
    availableHours: 'জরুরি অগ্নিনির্বাপণ ও উদ্ধার ২৪/৭',
    iconName: 'Flame'
  },
  {
    id: 'em-4',
    title: 'কুষ্টিয়া ২৫০ শয্যা বিশিষ্ট জেনারেল হাসপাতাল',
    dept: 'স্বাস্থ্য অধিদপ্তর, কুষ্টিয়া',
    number: '071-62402',
    alternateNumber: '01712443322',
    address: 'হাসপাতাল মোড়, কুষ্টিয়া সদর',
    availableHours: 'জরুরি বিভাগ ২৪ ঘণ্টা খোলা',
    iconName: 'Hospital'
  },
  {
    id: 'em-5',
    title: 'কুষ্টিয়া জরুরি অ্যাম্বুলেন্স সেবা (লাইফ সাপোর্ট)',
    dept: 'রেড ক্রিসেন্ট ও বেসরকারি অ্যাম্বুলেন্স সার্ভিস',
    number: '01711224455',
    alternateNumber: '01722889900',
    address: 'হাসপাতাল রোড, কুষ্টিয়া',
    availableHours: '২৪ ঘণ্টা কুষ্টিয়া ও ঢাকা শিফট',
    iconName: 'Ambulance'
  },
  {
    id: 'em-6',
    title: 'ওজোপাডিকো বিদ্যুৎ অভিযোগ কেন্দ্র (WZPDCL Kushtia)',
    dept: 'ওয়েস্ট জোন পাওয়ার ডিস্ট্রিবিউশন কোম্পানি',
    number: '16117',
    alternateNumber: '01713889900',
    address: 'বিদ্যুৎ ভবন, কুষ্টিয়া',
    availableHours: '২৪ ঘণ্টা বিদ্যুৎ বিভ্রাট অভিযোগ',
    iconName: 'Zap'
  },
  {
    id: 'em-7',
    title: 'জেলা প্রশাসক (DC) অফিস, কুষ্টিয়া',
    dept: 'জেলা প্রশাসন কুষ্টিয়া',
    number: '071-61700',
    alternateNumber: '01713300099',
    address: 'কালেক্টরেট ভবন, কুষ্টিয়া',
    availableHours: 'অফিস চলাকালীন ও জরুরি কন্ট্রোল রুম',
    iconName: 'Building'
  },
  {
    id: 'em-8',
    title: 'নারী ও শিশু নির্যাতন প্রতিরোধ হেল্পলাইন',
    dept: 'মহিলা ও শিশু বিষয়ক মন্ত্রণালয়',
    number: '109',
    alternateNumber: '1098 (চাইল্ড হেল্পলাইন)',
    address: 'টোল-ফ্রি জাতীয় সেবা',
    availableHours: '২৪ ঘণ্টা সেবা',
    iconName: 'HeartHandshake'
  }
];

export const DEVELOPER_INFO = {
  name: 'আমার কুষ্টিয়া টিম',
  age: 0,
  profession: 'অলাভজনক প্ল্যাটফর্ম',
  school: 'কুষ্টিয়া',
  address: 'কুষ্টিয়া',
  relationshipStatus: 'N/A',
  whatsapp1: '',
  whatsapp2: '',
  whatsappLink1: '',
  whatsappLink2: '',
  bioBengali: 'কুষ্টিয়াকে নিরাপদ, সমৃদ্ধ ও প্রযুক্তিবান্ধব করে গড়ে তোলার লক্ষ্যে আমার কুষ্টিয়া প্ল্যাটফর্মটি পরিচালিত হচ্ছে। এটি একটি অলাভজনক উদ্যোগ।',
  avatar: ''
};

export const INITIAL_DONATIONS: FundDonation[] = [
  {
    id: 'don-1',
    donorName: 'মোঃ রফিক হাসান',
    donorPhone: '01711223344',
    amount: 5000,
    paymentMethod: 'bKash',
    transactionId: '8BK72910QA',
    isAnonymous: false,
    status: 'approved',
    note: 'কুষ্টিয়ার অসহায় রোগীদের চিকিৎসার জন্য ক্ষুদ্র অনুদান',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
    approvedAt: Date.now() - 1000 * 60 * 60 * 24 * 14 + 1000 * 60 * 30,
    approvedBy: 'অ্যাডমিন ভেরিফাইড'
  },
  {
    id: 'don-2',
    donorName: 'সুহৃদ কুষ্টিয়াবাসী',
    donorPhone: '01700000000',
    amount: 10000,
    paymentMethod: 'Nagad',
    transactionId: 'NG918340LM',
    isAnonymous: true,
    status: 'approved',
    note: 'গড়াই নদী তীরবর্তী ছিন্নমূল মানুষের শীতবস্ত্র বিতরণ তহবিলে সাদাকাহ',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    approvedAt: Date.now() - 1000 * 60 * 60 * 24 * 10 + 1000 * 60 * 45,
    approvedBy: 'অ্যাডমিন ভেরিফাইড'
  },
  {
    id: 'don-3',
    donorName: 'তানভীর আহমেদ',
    donorPhone: '01822334455',
    amount: 3000,
    paymentMethod: 'bKash',
    transactionId: '8BK45109PK',
    isAnonymous: false,
    status: 'approved',
    note: 'ছেঁউড়িয়া এতিমখানার শিশুদের একবেলার খাবারের জন্য',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    approvedAt: Date.now() - 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 20,
    approvedBy: 'অ্যাডমিন ভেরিফাইড'
  }
];

export const INITIAL_FUND_EXPENSES: FundExpense[] = [
  {
    id: 'exp-1',
    title: 'কুষ্টিয়া গড়াই নদী রক্ষা বাঁধ সংলগ্ন ৭০টি ছিন্নমূল পরিবারের মাঝে কম্বল বিতরণ',
    description: 'তীব্র শৈত্যপ্রবাহে কুষ্টিয়া গড়াই নদী বাঁধ ও মিলপাড়া এলাকার শীতার্ত ছিন্নমূল মানুষের মাঝে যাচাই-বাছাইপূর্বক ৭০ পিস উন্নতমানের গরম কম্বল বিতরণ করা হয়েছে।',
    amount: 5200,
    date: '১৫ জানুয়ারি, ২০২৬',
    category: 'শীতবস্ত্র বিতরণ',
    location: 'গড়াই নদী বাঁধ, কুষ্টিয়া',
    receiptUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=450&auto=format&fit=crop&q=70',
    spendingProofUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=450&auto=format&fit=crop&q=70',
    verifiedBy: 'তহবিল তদারকি পরিষদ',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12
  },
  {
    id: 'exp-2',
    title: 'কুষ্টিয়া ২৫০ শয্যা হাসপাতালে চিকিৎসাধীন দরিদ্র রোগীর ওষুধ সহায়তা',
    description: 'হাসপাতালে চিকিৎসাধীন অসচ্ছল রোগীর প্রয়োজনীয় ইনজেকশন ও রক্ত পরীক্ষার সকল খরচ মেটাতে এই ফান্ড সরাসরি হস্তান্তর করা হয়েছে।',
    amount: 3500,
    date: '২৮ ফেব্রুয়ারি, ২০২৬',
    category: 'চিকিৎসা সহায়তা',
    location: 'কুষ্টিয়া ২৫০ শয্যা জেনারেল হাসপাতাল',
    receiptUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=450&auto=format&fit=crop&q=70',
    spendingProofUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=450&auto=format&fit=crop&q=70',
    verifiedBy: 'তহবিল তদারকি পরিষদ',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6
  }
];
