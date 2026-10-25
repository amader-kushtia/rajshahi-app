import React, { useState } from 'react';
import { X, Smartphone, Monitor, RefreshCw, ExternalLink, Sparkles, MapPin, Phone } from 'lucide-react';
import { AppThemeConfig, PostItem } from '../../types';
import { BannerAds } from '../BannerAds';
import { getActiveSponsoredCampaign } from '../../services/sponsoredService';
import { SponsoredDetailsPage } from '../../pages/SponsoredDetailsPage';

interface CitizenAppPreviewModalProps {
  appTheme: AppThemeConfig;
  posts: PostItem[];
  onClose: () => void;
}

export const CitizenAppPreviewModal: React.FC<CitizenAppPreviewModalProps> = ({
  appTheme,
  posts,
  onClose
}) => {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet'>('mobile');
  const [showSponsoredDetails, setShowSponsoredDetails] = useState(false);
  const activeSponsored = getActiveSponsoredCampaign();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 rounded-3xl max-w-4xl w-full h-[92vh] flex flex-col border border-slate-800 shadow-2xl overflow-hidden">
        {/* Top bar of modal */}
        <div className="px-5 py-3 bg-slate-950 flex items-center justify-between border-b border-slate-800 text-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
              <Smartphone className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-white">সিটিজেন অ্যাপ লাইভ প্রিভিউ</h3>
              <p className="text-[10px] text-slate-400">অ্যাডমিন পরিবর্তনগুলো নাগরিকরা সরাসরি যেভাবে দেখবে</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-800 p-0.5 rounded-xl flex items-center gap-1">
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  deviceMode === 'mobile' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                মোবাইল
              </button>
              <button
                onClick={() => setDeviceMode('tablet')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  deviceMode === 'tablet' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                ট্যাবলেট
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Device Frame Viewport */}
        <div className="flex-1 overflow-y-auto bg-slate-950/60 p-4 flex justify-center items-start">
          <div
            className={`w-full bg-[#F4F6F4] text-slate-800 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 transition-all ${
              deviceMode === 'mobile' ? 'max-w-md min-h-[680px]' : 'max-w-2xl min-h-[720px]'
            }`}
          >
            {/* Header Simulator */}
            <div className="bg-emerald-800 text-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black">আমার কুষ্টিয়া</h4>
                  <p className="text-[10px] text-emerald-200">{appTheme.tagline}</p>
                </div>
                <div className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded-full backdrop-blur-xs">
                  {appTheme.cityName || 'কুষ্টিয়া'}
                </div>
              </div>

              {/* Scrolling Notice Marquee in Preview */}
              {appTheme.isMarqueeActive && (
                <div className="mt-2.5 bg-black/20 text-white text-[11px] py-1 px-2.5 rounded-xl overflow-hidden whitespace-nowrap">
                  <div className="animate-marquee inline-block">
                    {appTheme.marqueeAnnouncement}
                  </div>
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="p-3.5 space-y-3">
              {showSponsoredDetails ? (
                <SponsoredDetailsPage onBack={() => setShowSponsoredDetails(false)} />
              ) : (
                <>
                  {/* Emergency Alert if active */}
                  {appTheme.isEmergencyAlertActive && appTheme.emergencyAlert && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-2xl text-[11px] text-rose-800 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                      <span>{appTheme.emergencyAlert}</span>
                    </div>
                  )}

                  {/* SPONSORED BANNER */}
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 mb-1 flex items-center justify-between">
                      <span>স্পন্সরড ব্যানার (Live)</span>
                      <span className="text-[10px] text-amber-700">ক্লিক করে ডিটেইলস দেখুন</span>
                    </div>
                    <BannerAds onOpenDetails={() => setShowSponsoredDetails(true)} />
                  </div>

                  {/* Posts Feed in citizen app */}
                  <div className="space-y-2">
                    <div className="text-xs font-black text-slate-800 flex items-center justify-between">
                      <span>সর্বশেষ পোস্টসমূহ ({posts.length})</span>
                      <span className="text-[10px] font-bold text-emerald-700">সকল নাগরিক সেবা</span>
                    </div>

                    {posts.slice(0, 5).map(post => (
                      <div key={post.id} className="p-3 bg-white rounded-2xl border border-pink-200/80/80 shadow-xs flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                            {post.category}
                          </span>
                          <div className="text-xs font-bold text-slate-900 truncate mt-0.5">{post.title}</div>
                          <div className="text-[10px] text-slate-500 truncate mt-0.5">
                            {post.location} • {post.price || 'আলোচনা সাপেক্ষে'}
                          </div>
                        </div>
                        {post.imageUrl && (
                          <img src={post.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover border border-pink-100 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
