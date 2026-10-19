export interface SponsoredItem {
  id: string;
  businessName: string;
  badge: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  discountBadge: string;
  couponCode: string;
  validTill: string;
  location: string;
  phone: string;
  whatsapp: string;
  email: string;
  openingHours: string;
  images: {
    url: string;
    caption: string;
  }[];
  facilities: string[];
  deals: {
    id: string;
    title: string;
    originalPrice: string;
    offerPrice: string;
    tag: string;
    image: string;
  }[];
}

export const CURRENT_SPONSORED_CAMPAIGN: SponsoredItem = {
  id: 'kushtia-super-mall-2026',
  businessName: 'কুষ্টিয়া সুপার মল ও মেগা ফ্যাশন পয়েন্ট',
  badge: 'ভেরিফাইড স্পনসরড পার্টনার',
  tagline: 'ঈদ ও শীতের মেগা ধামাকা অফার! সেরা মানের পোশাকে ৫০% পর্যন্ত ছাড়',
  shortDescription: 'শীত ও উৎসবের কেনাকাটায় সেরা ছাড়! আজই ভিজিট করুন কুষ্টিয়ার সর্ববৃহৎ আধুনিক ফ্যাশন শপিং কমপ্লেক্সে।',
  fullDescription: 'কুষ্টিয়া শহরের প্রাণকেন্দ্রে অবস্থিত "কুষ্টিয়া সুপার মল ও মেগা ফ্যাশন পয়েন্ট" নিয়ে এসেছে এই মৌসুমের সবচেয়ে আকর্ষণীয় কেনাকাটার উৎসব। পুরুষ, নারী ও শিশুদের আধুনিক ফ্যাশনেবল পোশাক, দেশি-বিদেশি প্রিমিয়াম ব্র্যান্ডের জুতা, কসমেটিকস এবং লাইফস্টাইল এক্সেসরিজ এখন পাওয়া যাচ্ছে সাশ্রয়ী মূল্যে। আমাদের রয়েছে সম্পূর্ণ শীতাতপ নিয়ন্ত্রিত আধুনিক শোরুম, বাচ্চাদের খেলার কিডস জোন এবং মনোরম ফুড কর্নার।',
  discountBadge: 'সর্বোচ্চ ৫০% পর্যন্ত মেগা ছাড়',
  couponCode: 'KUSHTIA50',
  validTill: '৩০ মার্চ ২০২৬ পর্যন্ত প্রযোজ্য',
  location: 'নিউ মার্কেট মোড় (রেলওয়ে স্টেশন সংলগ্ন), কুষ্টিয়া',
  phone: '01712345678',
  whatsapp: '8801712345678',
  email: 'kushtiasupermall@gmail.com',
  openingHours: 'প্রতিদিন সকাল ৯:৩০ টা হতে রাত ১০:৩০ টা (শুক্রবার সহ খোলা)',
  images: [
    {
      url: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=450&auto=format&fit=crop&q=70',
      caption: 'কুষ্টিয়া সুপার মলের আধুনিক ও সুপরিসর শোরুম'
    },
    {
      url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=450&auto=format&fit=crop&q=70',
      caption: 'এক্সক্লুসিভ জেন্টস ও উইমেন্স ক্লোথিং সেকশন'
    },
    {
      url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=450&auto=format&fit=crop&q=70',
      caption: 'নতুন কালেকশন ও ট্রেন্ডি ক্যাজুয়াল ফ্যাশন'
    },
    {
      url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=450&auto=format&fit=crop&q=70',
      caption: 'ব্র্যান্ডেড জুতো ও লেদার এক্সেসরিজ ডিসপ্লে'
    },
    {
      url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=450&auto=format&fit=crop&q=70',
      caption: 'বিউটি, পারফিউম ও লাইফস্টাইল কর্ণার'
    }
  ],
  facilities: [
    'সম্পূর্ণ সেন্ট্রাল এয়ার কন্ডিশনড (AC) পরিবেশ',
    'নিরাপদ আধুনিক লিফট ও সার্বক্ষণিক সিসিটিভি ক্যামেরা',
    'পর্যাপ্ত বাইক ও প্রাইভেট কার ফ্রি পার্কিং',
    'বিকাশ, নগদ, রকেট, ডেবিট ও ক্রেডিট কার্ড পেমেন্ট সুবিধা',
    'বাচ্চাদের জন্য নিরাপদ কিডস প্লে-জোন',
    'পরিচ্ছন্ন ট্রায়াল রুম ও ওয়াশরুম সুবিধা'
  ],
  deals: [
    {
      id: 'd-1',
      title: 'জেন্টস প্রিমিয়াম ক্যাজুয়াল ও পার্টি ব্লেজার',
      originalPrice: '৳৩,২০০',
      offerPrice: '৳১,৯৫০',
      tag: '৪০% ছাড়',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'd-2',
      title: 'এক্সক্লুসিভ উইমেন্স পার্টি থ্রি-পিস ও কুর্তি',
      originalPrice: '৳২,৬০০',
      offerPrice: '৳১,৫৫০',
      tag: '৩৫% ছাড়',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'd-3',
      title: 'বাচ্চাদের স্টাইলিশ উইন্টার জ্যাকেট ও হুডি সেট',
      originalPrice: '৳১,২০০',
      offerPrice: '৳৬৫০',
      tag: '৫০% ছাড়',
      image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'd-4',
      title: 'আরামদায়ক লেদার ক্যাজুয়াল স্নিকার্স ও জুতা',
      originalPrice: '৳২,১০০',
      offerPrice: '৳১,২৫০',
      tag: '৪০% ছাড়',
      image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&auto=format&fit=crop&q=80'
    }
  ]
};
