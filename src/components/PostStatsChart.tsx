import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { PostItem } from '../types';
import { BarChart3, Eye, Heart, Sparkles } from 'lucide-react';

interface PostStatsChartProps {
  posts: PostItem[];
}

export const PostStatsChart: React.FC<PostStatsChartProps> = ({ posts }) => {
  const [metric, setMetric] = useState<'views' | 'likes'>('views');

  // Sort posts by popularity (views or likes) and take top 5
  const topPosts = [...posts]
    .sort((a, b) => {
      if (metric === 'views') {
        return (b.views ?? 0) - (a.views ?? 0);
      }
      return (b.likes ?? 0) - (a.likes ?? 0);
    })
    .slice(0, 5)
    .map(p => ({
      name: p.title.length > 12 ? p.title.substring(0, 12) + '...' : p.title,
      fullTitle: p.title,
      views: p.views ?? 0,
      likes: p.likes ?? 0,
    }));

  if (topPosts.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-pink-200/80/90 shadow-xs relative overflow-hidden mb-4">
      <div className="absolute top-0 right-0 w-28 h-28 bg-amber-50/60 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/60 shadow-xs">
              <BarChart3 className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
                <span>জনপ্রিয়তা বিশ্লেষণ</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                শীর্ষ পোস্টের ভিউ ও লাইক পরিসংখ্যান
              </p>
            </div>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-pink-200/80/60">
            <button
              type="button"
              onClick={() => setMetric('views')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                metric === 'views'
                  ? 'bg-white text-emerald-800 shadow-xs border border-pink-200/80/50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3 h-3 text-slate-400" />
              <span>ভিউ</span>
            </button>
            <button
              type="button"
              onClick={() => setMetric('likes')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                metric === 'likes'
                  ? 'bg-white text-rose-600 shadow-xs border border-pink-200/80/50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Heart className="w-3 h-3 text-rose-500" />
              <span>লাইক</span>
            </button>
          </div>
        </div>

        {/* Chart Container */}
        <div className="h-48 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topPosts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10, fill: '#64748b' }} 
                tickLine={false} 
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#64748b' }} 
                tickLine={false} 
                axisLine={false} 
                allowDecimals={false}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white text-xs p-2.5 rounded-xl shadow-lg border border-slate-800 max-w-xs">
                        <p className="font-bold text-emerald-300 mb-1 truncate">{data.fullTitle}</p>
                        <div className="flex items-center gap-3 font-semibold">
                          <span className="flex items-center gap-1 text-slate-200">
                            <Eye className="w-3 h-3 text-emerald-400" /> ভিউ: {data.views}
                          </span>
                          <span className="flex items-center gap-1 text-rose-400">
                            <Heart className="w-3 h-3 fill-rose-500" /> লাইক: {data.likes}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey={metric} 
                fill={metric === 'views' ? '#059669' : '#e11d48'} 
                radius={[6, 6, 0, 0]} 
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
