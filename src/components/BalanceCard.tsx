import React, { useState, useEffect } from 'react';
import { Wallet, PlusCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { getUserWalletBalance } from '../services/walletService';
import { UserProfile } from '../types';
import { AddBalanceModal } from './AddBalanceModal';
import { useAdminConfig } from '../context/AdminConfigContext';

interface BalanceCardProps {
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ currentUser, onOpenAuth }) => {
  const { themeConfig } = useAdminConfig();
  const [balance, setBalance] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const updateBal = () => {
    if (currentUser) {
      setBalance(getUserWalletBalance(currentUser.uid));
    }
  };

  useEffect(() => {
    updateBal();
    const handleUpdate = () => updateBal();
    window.addEventListener('kushtia-wallet-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('kushtia-wallet-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [currentUser]);

  // If admin toggled off the balance card, don't render it
  if (themeConfig.showBalanceCard === false) {
    return null;
  }

  return (
    <>
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-emerald-950 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden border border-emerald-700/50">
        <div className="absolute right-0 top-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <Wallet className="w-7 h-7 text-amber-300" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">নাগরিক ওয়ালেট ব্যালেন্স</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> সুরক্ষিত
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
                ৳ {balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                if (!currentUser) {
                  onOpenAuth();
                } else {
                  window.dispatchEvent(new CustomEvent('navigate-to-page', { detail: 'add-balance' }));
                }
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-5 h-5" />
              <span>এড ব্যালেন্স</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
