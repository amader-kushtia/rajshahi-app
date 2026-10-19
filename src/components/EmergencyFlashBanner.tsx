import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  PhoneCall, 
  X, 
  Droplet, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { 
  getFlashAlerts, 
  getBloodEmergencyAlerts, 
  playSirenTone
} from '../services/adminFeaturesService';
import { FlashAlert, BloodEmergencyAlert } from '../types';

interface EmergencyFlashBannerProps {
  onNavigateEmergency?: () => void;
  onNavigateBlood?: () => void;
}

export const EmergencyFlashBanner: React.FC<EmergencyFlashBannerProps> = ({
  onNavigateEmergency,
  onNavigateBlood
}) => {
  const [activeAlert, setActiveAlert] = useState<FlashAlert | null>(() => {
    const alerts = getFlashAlerts();
    return alerts.find(a => a.isActive) || null;
  });

  const [activeBlood, setActiveBlood] = useState<BloodEmergencyAlert | null>(() => {
    const bloodAlerts = getBloodEmergencyAlerts();
    return bloodAlerts.find(b => b.isActive) || null;
  });

  const [isDismissed, setIsDismissed] = useState(false);
  const [isPlayingSiren, setIsPlayingSiren] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      const alerts = getFlashAlerts();
      const current = alerts.find(a => a.isActive) || null;
      setActiveAlert(current);
      if (current) setIsDismissed(false);

      const bloods = getBloodEmergencyAlerts();
      setActiveBlood(bloods.find(b => b.isActive) || null);
    };

    window.addEventListener('kushtia-broadcast-updated', handleUpdate);
    window.addEventListener('kushtia-flash-alert-updated', handleUpdate);
    window.addEventListener('kushtia-blood-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('kushtia-broadcast-updated', handleUpdate);
      window.removeEventListener('kushtia-flash-alert-updated', handleUpdate);
      window.removeEventListener('kushtia-blood-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleTestSiren = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingSiren(true);
    playSirenTone();
    setTimeout(() => setIsPlayingSiren(false), 2500);
  };

  if (isDismissed) return null;

  return (
    <div className="space-y-2">
      {/* 1. Flash Siren Alert (Highest Severity) */}
      {activeAlert && (
        <div 
          className={`p-3.5 rounded-2xl text-white shadow-lg border relative overflow-hidden transition-all ${
            activeAlert.severity === 'critical'
              ? 'bg-gradient-to-r from-red-700 via-rose-700 to-red-800 border-red-500 shadow-red-900/30 animate-pulse'
              : 'bg-gradient-to-r from-amber-600 to-orange-700 border-amber-400 shadow-amber-900/30'
          }`}
        >
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-start gap-2.5 min-w-0 flex-1">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xs shrink-0 mt-0.5">
                <Radio className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white text-red-700">
                    জরুরি ফ্ল্যাশ ঘোষণা
                  </span>
                  <span className="text-[10px] text-white/80">
                    {new Date(activeAlert.createdAt).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h4 className="text-sm font-black text-white mt-1 leading-snug">
                  {activeAlert.title}
                </h4>
                
                <p className="text-xs text-white/95 mt-1 leading-relaxed whitespace-pre-line font-medium">
                  {activeAlert.message}
                </p>

                {activeAlert.instructions && (
                  <div className="mt-2 p-2 rounded-xl bg-black/20 border border-white/20 text-[11px] text-white/90">
                    <span className="font-bold text-amber-200">করণীয়: </span>
                    {activeAlert.instructions}
                  </div>
                )}

                {/* Quick Siren button */}
                {activeAlert.withSiren && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      onClick={handleTestSiren}
                      className="px-2.5 py-1 rounded-xl bg-white/25 hover:bg-white/35 text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors border border-white/30"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isPlayingSiren ? 'সাইরেন বাজছে...' : 'জরুরি সাইরেন শুনুন'}</span>
                    </button>
                    <a
                      href="tel:999"
                      className="px-2.5 py-1 rounded-xl bg-white text-red-700 text-[11px] font-black flex items-center gap-1 shadow-xs hover:bg-red-50 transition-colors"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>হেল্পলাইন ৯৯৯</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-lg bg-white/15 hover:bg-white/30 text-white transition-colors shrink-0"
              title="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Emergency Blood Call Banner */}
      {activeBlood && (
        <div 
          onClick={onNavigateBlood}
          className="p-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md border border-rose-400 flex items-center justify-between gap-2.5 cursor-pointer hover:opacity-95 transition-all"
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Droplet className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-white text-rose-700">
                  জরুরি রক্ত প্রয়োজন
                </span>
                <span className="text-xs font-black bg-rose-900/60 px-2 py-0.5 rounded-full border border-white/30">
                  {activeBlood.bloodGroup}
                </span>
              </div>
              <p className="text-xs font-bold text-white truncate mt-0.5">
                রোগী: {activeBlood.patientName} ({activeBlood.hospital})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-black bg-white text-rose-700 px-2.5 py-1.5 rounded-xl shrink-0 shadow-xs">
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">যোগাযোগ</span>
          </div>
        </div>
      )}
    </div>
  );
};
