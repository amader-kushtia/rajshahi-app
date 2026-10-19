import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-[100] animate-in slide-in-from-bottom-2 fade-in">
      <div className="bg-slate-800 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3">
        <div className="bg-red-500/20 p-2 rounded-full">
          <WifiOff className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <p className="text-sm font-bold">ইন্টারনেট সংযোগ নেই</p>
          <p className="text-[11px] text-slate-300">অফলাইন মোডে জরুরি নম্বরগুলো দেখা যাবে</p>
        </div>
      </div>
    </div>
  );
};
