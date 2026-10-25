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
    title: 'কুষ্টিয়ায় আধুনিক পর্যটন কেন্দ্র ও লালন একাডেমির উন্নয়ন প্রকল্প অনুমোদিত',
    summary: 'ছেঁউড়িয়ায় লালন শাহের মাজার ও সংলগ্ন এলাকায় পর্যটকদের জন্য আধুনিক সুযোগ-সুবিধা সম্বলিত কমপ্লেক্স নির্মাণের কাজ শুরু হতে যাচ্ছে।',
    category: 'ঐতিহ্য',
    source: 'কুষ্টিয়া কন্ঠ',
    url: 'https://www.prothomalo.com/bangladesh/district/kushtia',
    publishedTime: '২ ঘণ্টা আগে',
    isBreaking: true,
    tag: 'ব্রেকিং নিউজ'
  },
  {
    id: 'news-ks-2',
    title: 'গড়াই নদীর শহর রক্ষা বাঁধ সংস্কারে পানি উন্নয়ন বোর্ডের বৃহৎ উদ্যোগ',
    summary: 'আসন্ন বর্ষা মৌসুমে শহর রক্ষা বাঁধের ঝুঁকিপূর্ণ পয়েন্টগুলোতে জিওব্যাগ ডাম্পিং ও ব্লক বসানোর কাজ দ্রুতগতিতে চলছে।',
    category: 'উন্নয়ন',
    source: 'বিএসএস',
    url: 'https://www.bssnews.net/bangla/district-news',
    publishedTime: '৫ ঘণ্টা আগে',
    isBreaking: false,
    tag: 'উন্নয়ন আপডেট'
  },
  {
    id: 'news-ks-3',
    title: 'ইসলামী বিশ্ববিদ্যালয় (ইবি) ক্যাম্পাসে ডিজিটাল লাইব্রেরি ও স্মার্ট ল্যাবের উদ্বোধন',
    summary: 'শিক্ষার্থীদের উন্নত গবেষণা ও পড়াশোনার পরিবেশ নিশ্চিতে ইবি কর্তৃপক্ষ অত্যাধুনিক ডিজিটাল সেবা সম্বলিত লাইব্রেরি চালু করেছে।',
    category: 'শিক্ষা',
    source: 'দ্য ডেইলি স্টার',
    url: 'https://bangla.thedailystar.net/news/bangladesh/districts/kushtia',
    publishedTime: '৮ ঘণ্টা আগে',
    isBreaking: false,
    tag: 'শিক্ষা সংবাদ'
  }
];


import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export async function fetchAutomatedNewsFromFirestore(city: string = 'Kushtia', maxCount: number = 10): Promise<LocalNewsItem[]> {
  try {
    const postsRef = collection(db, 'posts');
    // Simplified query to avoid composite index requirements
    // Multiple 'where' clauses on equality and 'orderBy' on a different field usually requires an index
    const q = query(
      postsRef, 
      where('category', '==', 'news'),
      limit(100) // Fetch more than maxCount to filter/sort in memory
    );
    
    const snapshot = await getDocs(q);
    let results: LocalNewsItem[] = [];
    
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      // Filter by location in memory
      if (data.location === city) {
        results.push({
          id: data.id || docSnap.id,
          title: data.title || '',
          summary: data.description || '',
          category: 'উন্নয়ন',
          source: data.authorName || data.source || 'আমার কুষ্টিয়া খবর',
          url: data.url || '',
          publishedTime: data.timestampMillis ? new Date(data.timestampMillis).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date(data.timestampMillis).toLocaleDateString('bn-BD') : 'আজকের খবর',
          isBreaking: !!data.featured,
          tag: data.tag || (data.featured ? 'ব্রেকিং নিউজ' : 'তাজা আপডেট'),
          imageUrl: data.imageUrl,
          // Add raw timestamp for sorting
          _timestamp: data.timestampMillis || 0
        } as any);
      }
    });
    
    // Sort by timestamp descending in memory
    results.sort((a, b) => (b as any)._timestamp - (a as any)._timestamp);
    
    return results.slice(0, maxCount);
  } catch (err) {
    console.error('Error fetching automated news from Firestore:', err);
    return [];
  }
}

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

  // Try to get "recorded" news from Firestore first to complement AI results
  const firestoreNews = await fetchAutomatedNewsFromFirestore(city);

  try {
    const url = `/api/local-news?city=${encodeURIComponent(city)}${forceRefresh ? '&refresh=true' : ''}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const aiData: NewsResponse = await res.json();
    
    // Merge results, prioritizing AI results for "live" feel but including Firestore ones for "recorded" feel
    // Remove duplicates by title
    const seenTitles = new Set<string>();
    const combinedNews: LocalNewsItem[] = [];
    
    aiData.news.forEach(item => {
      seenTitles.add(item.title.trim());
      combinedNews.push(item);
    });
    
    firestoreNews.forEach(item => {
      if (!seenTitles.has(item.title.trim())) {
        combinedNews.push(item);
      }
    });

    const data: NewsResponse = {
      ...aiData,
      news: combinedNews.slice(0, 15) // Limit to top 15
    };
    
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify({
        cachedAt: Date.now(),
        data
      }));
    } catch (_) {}

    return data;
  } catch (_) {
    // If AI fails, use Firestore news as primary fallback, then hardcoded fallback
    const fallbackNews = firestoreNews.length > 0 ? firestoreNews : FALLBACK_KUSHTIA_NEWS;
    
    return {
      city,
      lastUpdated: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      isLiveGrounding: false,
      sourcesCount: fallbackNews.length,
      news: fallbackNews
    };
  }
}
