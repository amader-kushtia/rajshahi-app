import { SponsoredItem, CURRENT_SPONSORED_CAMPAIGN } from '../data/sponsoredData';
import { addActivityLog } from './adminService';

const SPONSORED_STORAGE_KEY = 'rajshahi_connect_sponsored_campaigns';
const ACTIVE_SPONSORED_ID_KEY = 'rajshahi_connect_active_sponsored_id';

// Initial seed campaigns
const SEED_SPONSORED_CAMPAIGNS: (SponsoredItem & { isActive: boolean; createdAt: number })[] = [
  {
    ...CURRENT_SPONSORED_CAMPAIGN,
    isActive: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5
  },
  {
    id: 'rajshahi-tech-zone',
    businessName: 'কুষ্টিয়া টেক জোন & কম্পিউটার সিটি',
    badge: 'এক্সক্লুসিভ স্পন্সর',
    tagline: 'ল্যাপটপ, ডেস্কটপ ও স্মার্ট গ্যাজেটে নিশ্চিত ধামাকা ক্যাশব্যাক!',
    shortDescription: 'কুষ্টিয়ার বিশ্বস্ত আইটি শপ। সকল অরিজিনাল কম্পিউটার এক্সেসরিজ ও অফিশিয়াল ওয়ারেন্টি সেবা।',
    fullDescription: 'কুষ্টিয়া টেক জোন নিয়ে এলো বিশেষ স্টুডেন্ট ও ফ্রিল্যান্সার অফার। এইচপি, ডেল, আসুস ল্যাপটপে বিনামূল্যে ব্যাকপ্যাক ও মাউস সহ সকল সার্ভিসিংয়ে ২০% মূল্যছাড়। আজই ভিজিট করুন আমাদের শোরুমে।',
    discountBadge: '২৫% ক্যাশব্যাক',
    couponCode: 'TECHRAJ25',
    validTill: '১৫ এপ্রিল ২০২৬ পর্যন্ত',
    location: 'নিউ মার্কেট রোড, কুষ্টিয়া',
    phone: '01712003344',
    whatsapp: '8801712003344',
    email: 'techzone.rajshahi@gmail.com',
    openingHours: 'সকাল ৯:৩০ - রাত ৯:০০ (শুক্রবার বিকেল ৩:০০ হতে)',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=450&auto=format&fit=crop&q=70',
        caption: 'ল্যাপটপ ও গ্যাজেট ডিসপ্লে জোন'
      },
      {
        url: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=450&auto=format&fit=crop&q=70',
        caption: 'এক্সক্লুসিভ এক্সেসরিজ ও গেমিং কর্নার'
      }
    ],
    facilities: [
      'অফিশিয়াল আন্তর্জাতিক ব্র্যান্ড ওয়ারেন্টি',
      '০% সুদে সহজ কিস্তি (ইএমআই) সুবিধা',
      'দ্রুততম ল্যাপটপ ও মাদারবোর্ড রিপেয়ার সার্ভিস',
      'ক্যাশ অন ডেলিভারি (কুষ্টিয়া শহর জুড়ে)'
    ],
    deals: [
      {
        id: 'tz-1',
        title: 'ওয়্যারলেস আরজিবি গেমিং মাউস',
        originalPrice: '১,২০০ ৳',
        offerPrice: '৭৫০ ৳',
        tag: 'হট ডিল',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80'
      }
    ],
    isActive: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2
  }
];

export interface ManagedSponsoredCampaign extends SponsoredItem {
  isActive: boolean;
  createdAt: number;
}

// 1. Get all sponsored campaigns
export function getAllSponsoredCampaigns(): ManagedSponsoredCampaign[] {
  try {
    const raw = localStorage.getItem(SPONSORED_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading sponsored campaigns from storage', e);
  }
  return SEED_SPONSORED_CAMPAIGNS;
}

// 2. Save all campaigns
export function saveAllSponsoredCampaigns(campaigns: ManagedSponsoredCampaign[]) {
  try {
    localStorage.setItem(SPONSORED_STORAGE_KEY, JSON.stringify(campaigns));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sponsored-campaigns-updated', { detail: campaigns }));
      window.dispatchEvent(new Event('storage'));
    }
  } catch (e) {
    console.warn('Error saving sponsored campaigns', e);
  }
}

// 3. Get currently active campaign for Citizen App
export function getActiveSponsoredCampaign(): SponsoredItem {
  const all = getAllSponsoredCampaigns();
  const active = all.find(c => c.isActive);
  if (active) {
    return active;
  }
  return all[0] || CURRENT_SPONSORED_CAMPAIGN;
}

// 4. Set a campaign as the active one
export function setActiveSponsoredCampaign(campaignId: string): ManagedSponsoredCampaign[] {
  const all = getAllSponsoredCampaigns();
  const updated = all.map(c => ({
    ...c,
    isActive: c.id === campaignId
  }));
  saveAllSponsoredCampaigns(updated);
  localStorage.setItem(ACTIVE_SPONSORED_ID_KEY, campaignId);
  
  const target = all.find(c => c.id === campaignId);
  if (target) {
    addActivityLog({
      type: 'campaign_activated',
      title: 'স্পন্সরড ক্যাম্পেইন চালু করা হয়েছে',
      description: `"${target.businessName}" এর স্পন্সরড বিজ্ঞাপন মূল অ্যাপে সক্রিয় করা হয়েছে।`,
      actor: 'এডমিন'
    });
  }
  return updated;
}

// 5. Add new sponsored campaign
export function createSponsoredCampaign(campaignData: Omit<ManagedSponsoredCampaign, 'id' | 'createdAt'>): ManagedSponsoredCampaign[] {
  const newCampaign: ManagedSponsoredCampaign = {
    ...campaignData,
    id: 'spons-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    createdAt: Date.now()
  };

  const current = getAllSponsoredCampaigns();
  const updated = newCampaign.isActive
    ? [newCampaign, ...current.map(c => ({ ...c, isActive: false }))]: [newCampaign, ...current];

  saveAllSponsoredCampaigns(updated);
  
  addActivityLog({
    type: 'campaign_created',
    title: 'নতুন স্পন্সরড বিজ্ঞাপন যুক্ত হয়েছে',
    description: `"${newCampaign.businessName}" স্পন্সরড সিস্টেমে তালিকাভুক্ত হয়েছে।`,
    actor: 'এডমিন'
  });

  return updated;
}

// 6. Update existing sponsored campaign
export function updateSponsoredCampaign(
  id: string, 
  data: Partial<ManagedSponsoredCampaign>
): ManagedSponsoredCampaign[] {
  const current = getAllSponsoredCampaigns();
  const updated = current.map(c => {
    if (c.id === id) {
      return { ...c, ...data };
    }
    if (data.isActive && c.id !== id) {
      return { ...c, isActive: false };
    }
    return c;
  });

  saveAllSponsoredCampaigns(updated);
  
  addActivityLog({
    type: 'campaign_updated',
    title: 'স্পন্সরড ক্যাম্পেইন এডিট করা হয়েছে',
    description: `স্পন্সর আইডি ${id} এর বিবরণ ও অফার আপডেট করা হয়েছে।`,
    actor: 'এডমিন'
  });

  return updated;
}

// 7. Delete sponsored campaign
export function deleteSponsoredCampaign(id: string): ManagedSponsoredCampaign[] {
  const current = getAllSponsoredCampaigns();
  const target = current.find(c => c.id === id);
  let updated = current.filter(c => c.id !== id);

  if (target?.isActive && updated.length > 0) {
    updated[0].isActive = true;
  }

  saveAllSponsoredCampaigns(updated);

  if (target) {
    addActivityLog({
      type: 'campaign_deleted',
      title: 'স্পন্সরড ক্যাম্পেইন মুছে ফেলা হয়েছে',
      description: `"${target.businessName}" এর বিজ্ঞাপন স্পন্সরড লিস্ট থেকে রিমুভ করা হয়েছে।`,
      actor: 'এডমিন'
    });
  }

  return updated;
}

// 8. Toggle active status
export function toggleSponsoredActiveStatus(id: string): ManagedSponsoredCampaign[] {
  const current = getAllSponsoredCampaigns();
  const target = current.find(c => c.id === id);
  if (!target) return current;

  const newStatus = !target.isActive;
  const updated = current.map(c => {
    if (c.id === id) {
      return { ...c, isActive: newStatus };
    }
    if (newStatus && c.id !== id) {
      return { ...c, isActive: false };
    }
    return c;
  });

  saveAllSponsoredCampaigns(updated);
  return updated;
}
