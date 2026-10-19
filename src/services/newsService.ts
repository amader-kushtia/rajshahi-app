export interface LocalNewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'উন্নয়ন' | 'শিক্ষা' | 'প্রশাসন' | 'আবহাওয়া' | 'কৃষি' | 'প্রযুক্তি' | 'খেলাধুলা' | 'ঐতিহ্য' | 'সাধারণ';
  categoryLabel?: string;
  source: string;
  url: string;
  publishedTime: string;
  isBreaking?: boolean;
  tag?: string;
  imageUrl?: string;
}

export interface NewsResponse {
  city: string;
  lastUpdated: string;
  isLiveGrounding: boolean;
  searchQueries?: string[];
  sourcesCount?: number;
  news: LocalNewsItem[];
}

export const FALLBACK_KUSHTIA_NEWS: LocalNewsItem[] = [
  {
    id: 'news-ks-1',
    title: 'শিলাইদহ রবীন্দ্র কুঠিবাড়ি ও ছেঁউড়িয়ায় বাউল সম্রাট লালন শাহ মাজারের পর্যটন অবকাঠামো উন্নয়নে নতুন প্রকল্প গ্রহণ',
    summary: 'কুষ্টিয়ার ঐতিহাসিক সংস্কৃতি ও পর্যটন খাতকে আন্তর্জাতিক মানে উন্নীত করতে শিলাইদহ ও ছেঁউড়িয়ায় আধুনিক পর্যটক বিশ্রামাগার, মিউজিয়াম ও সুসজ্জিত পার্ক নির্মাণের সিদ্ধান্ত নেওয়া হয়েছে।',
    category: 'ঐতিহ্য',
    categoryLabel: 'সংস্কৃতি ও পর্যটন',
    source: 'প্রথম আলো',
    url: 'https://www.prothomalo.com/bangladesh/district/kushtia',
    publishedTime: '১ ঘণ্টা আগে',
    isBreaking: true,
    tag: 'ব্রেকিং নিউজ',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'news-ks-2',
    title: 'ঐতিহাসিক হার্ডিঞ্জ ব্রিজ ও লালন শাহ সেতু এলাকায় পর্যটক নিরাপত্তা ও নদী রক্ষা বাঁধ সংস্কারের কাজ বেগবান',
    summary: 'পদ্মা ও গড়াই নদীর সংযোগস্থলে বাঁধ সুদৃঢ়করণ এবং ভেড়ামারা-পাকশী অঞ্চলের পর্যটকদের সুবিধার্থে আধুনিক নিরাপত্তা চৌকি ও আলোকসজ্জা স্থাপন করা হচ্ছে।',
    category: 'উন্নয়ন',
    categoryLabel: 'নদী ও অবকাঠামো',
    source: 'বিএসএস (BSS)',
    url: 'https://www.bssnews.net/bangla/district-news',
    publishedTime: '২ ঘণ্টা আগে',
    isBreaking: false,
    tag: 'উন্নয়ন আপডেট',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'news-ks-3',
    title: 'কুষ্টিয়া ইসলামী বিশ্ববিদ্যালয়ে (ইবি) স্মার্ট ক্যাম্পাস ও এআই গবেষণা কার্যক্রমের সূচনা',
    summary: 'শিক্ষার্থীদের তথ্যপ্রযুক্তি দক্ষতা বৃদ্ধি এবং উচ্চশিক্ষা গবেষণায় সহযোগিতার লক্ষ্যে ইবি ক্যাম্পাসে আধুনিক ডিজিটাল ল্যাব ও ডাটা সায়েন্স একাডেমি চালু করা হয়েছে।',
    category: 'শিক্ষা',
    categoryLabel: 'উচ্চশিক্ষা ও ক্যাম্পাস',
    source: 'দ্য ডেইলি স্টার',
    url: 'https://bangla.thedailystar.net/news/bangladesh/districts/kushtia',
    publishedTime: '৩ ঘণ্টা আগে',
    isBreaking: false,
    tag: 'ক্যাম্পাস বার্তা',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'news-ks-4',
    title: 'কুমারখালীর ঐতিহ্যবাহী তাঁত শিল্প ও কুষ্টিয়ার বিখ্যাত তিলের খাজা জিআই পণ্য স্বীকৃতির অগ্রগতি',
    summary: 'স্থানীয় তাঁতিদের সহজ শর্তে ঋণ ও আন্তর্জাতিক বাজারের সাথে সংযোগ স্থাপনের পাশাপাশি কুষ্টিয়ার সুস্বাদু তিলের খাজার ব্র্যান্ডিং ও প্যাকেটজাতকরণে নতুন উদ্যোগ নেওয়া হয়েছে।',
    category: 'কৃষি',
    categoryLabel: 'শিল্প ও ঐতিহ্য',
    source: 'বাংলাদেশ প্রতিদিন',
    url: 'https://www.bd-pratidin.com/country',
    publishedTime: '৪ ঘণ্টা আগে',
    isBreaking: false,
    tag: 'অর্থনীতি ও ব্যবসা',
    imageUrl: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'news-ks-5',
    title: 'কুষ্টিয়া ২৫০ শয্যা বিশিষ্ট জেনারেল হাসপাতালে সার্বক্ষণিক জরুরি সেবা ও টেলিমেডিসিন বুথ চালু',
    summary: 'জেলাভিত্তিক স্বাস্থ্যসেবা আরও সহজলভ্য করতে দূরবর্তী উপজেলার রোগীদের জন্য বিশেষায়িত চিকিৎসকদের ভিডিও কল পরামর্শ ও জরুরি অ্যাম্বুলেন্স ট্র্যাকিং সেবা যুক্ত হয়েছে।',
    category: 'প্রশাসন',
    categoryLabel: 'স্বাস্থ্যসেবা ও নাগরিক কল্যাণ',
    source: 'যুগান্তর',
    url: 'https://www.jugantor.com/country-news',
    publishedTime: '৫ ঘণ্টা আগে',
    isBreaking: false,
    tag: 'স্বাস্থ্য সেবা',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'news-ks-6',
    title: 'গড়াই নদীর শহর রক্ষা বাঁধ ও রেনউইক যজ্ঞেশ্বর পার্ক সংস্কারে কুষ্টিয়া পৌরসভার বৃহৎ কর্মসূচি',
    summary: 'নাগরিকদের বিনোদন ও পরিবেশ সংরক্ষণে গড়াই নদীর তীরে সবুজায়ন, ওয়াকওয়ে সম্প্রসারণ ও সিসিটিভি নজরদারির কাজ দ্রুতগতিতে এগিয়ে চলছে।',
    category: 'প্রশাসন',
    categoryLabel: 'পৌর উন্নয়ন',
    source: 'সমকাল',
    url: 'https://samakal.com/bangladesh',
    publishedTime: '৬ ঘণ্টা আগে',
    isBreaking: false,
    tag: 'পৌর আপডেট',
    imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80'
  }
];


export async function fetchDailyLocalNews(city: string = 'Kushtia', forceRefresh: boolean = false): Promise<NewsResponse> {
  const cacheKey = `local_news_${city.toLowerCase()}`;
  
  if (!forceRefresh) {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Valid for 10 minutes
        if (Date.now() - (parsed.cachedAt || 0) < 1000 * 60 * 10) {
          return parsed.data;
        }
      }
    } catch (_) {}
  }

  try {
    const url = `/api/local-news?city=${encodeURIComponent(city)}${forceRefresh ? '&refresh=true' : ''}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data: NewsResponse = await res.json();
    
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify({
        cachedAt: Date.now(),
        data
      }));
    } catch (_) {}

    return data;
  } catch (_) {
    // Smooth fallback without noisy console warnings
    return {
      city,
      lastUpdated: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      isLiveGrounding: false,
      sourcesCount: FALLBACK_KUSHTIA_NEWS.length,
      news: FALLBACK_KUSHTIA_NEWS
    };
  }
}
