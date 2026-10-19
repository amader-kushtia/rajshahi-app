import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Phone, 
  User, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { 
  WalletTransaction, 
  getAllWalletTransactions, 
  confirmWalletTransaction, 
  rejectWalletTransaction 
} from '../../services/walletService';

export const PaymentHistoryTab: React.FC = () => {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  const loadTxs = () => {
    setTransactions(getAllWalletTransactions());
  };

  useEffect(() => {
    loadTxs();
    const handleUpdate = () => loadTxs();
    window.addEventListener('kushtia-wallet-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('kushtia-wallet-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleConfirm = async (id: string) => {
    if (window.confirm('আপনি কি এই পেমেন্টটি কনফার্ম করতে চান? এটি সঙ্গে সঙ্গে ইউজারের ওয়ালেটে যোগ হয়ে যাবে।')) {
      await confirmWalletTransaction(id, 'Admin');
      loadTxs();
    }
  };

  const handleReject = async (id: string) => {
    if (window.confirm('আপনি কি এই পেমেন্ট রিকোয়েস্টটি বাতিল (রিজেক্ট) করতে চান?')) {
      await rejectWalletTransaction(id, 'Admin');
      loadTxs();
    }
  };

  const filtered = transactions.filter(t => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const matchesSearch = 
      t.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.userPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.senderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-600" />
            <span>ইউজার পেমেন্ট হিস্ট্রি ও ওয়ালেট টপ-আপ</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            ব্যবহারকারীদের বিকাশ ও নগদ পেমেন্ট রিকোয়েস্ট যাচাই করে ওয়ালেট ব্যালেন্স কনফার্ম বা বাতিল করুন
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setFilter('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'pending' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            পেন্ডিং ({transactions.filter(t => t.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'confirmed' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            কনফার্মড
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'rejected' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            বাতিল
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'all' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            সব
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="নাম, ফোন নাম্বার বা ট্রানজাকশন আইডি (TrxID) দিয়ে খুঁজুন..."
          className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
        />
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filtered.map((tx) => (
          <div 
            key={tx.id} 
            className={`bg-white rounded-3xl p-5 border shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              tx.status === 'pending' ? 'border-amber-300 bg-amber-50/20' :
              tx.status === 'confirmed' ? 'border-emerald-200' : 'border-rose-200 bg-rose-50/10'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase ${
                  tx.method === 'bKash' ? 'bg-pink-100 text-pink-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {tx.method}
                </span>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{tx.userName}</span>
                </h3>
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {tx.userPhone || tx.senderNumber}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <div className="bg-slate-100 px-3 py-1 rounded-xl font-mono font-bold text-slate-800">
                  TrxID: <span className="text-emerald-700">{tx.transactionId}</span>
                </div>
                <div className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-xl font-black">
                  পরিমাণ: ৳ {tx.amount}
                </div>
                <div className="text-slate-400">
                  {new Date(tx.createdAt).toLocaleString('bn-BD', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                </div>
              </div>
            </div>

            {/* Status / Actions */}
            <div className="flex items-center gap-3 shrink-0">
              {tx.status === 'pending' ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReject(tx.id)}
                    className="px-4 py-2 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>বাতিল (রিজেক্ট)</span>
                  </button>
                  <button
                    onClick={() => handleConfirm(tx.id)}
                    className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>কনফার্ম (টাকা যোগ করুন)</span>
                  </button>
                </div>
              ) : tx.status === 'confirmed' ? (
                <div className="flex items-center gap-2 bg-emerald-100/80 text-emerald-800 px-4 py-2 rounded-2xl text-xs font-black">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>কনফার্মড ({tx.reviewedBy || 'Admin'})</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-rose-100/80 text-rose-800 px-4 py-2 rounded-2xl text-xs font-black">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>বাতিল করা হয়েছে</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-base font-black text-slate-800">কোনো পেমেন্ট রিকোয়েস্ট পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-500">এই মুহূর্তে ফিল্টারের সাথে মিলে এমন কোনো টপ-আপ হিস্ট্রি নেই।</p>
          </div>
        )}
      </div>
    </div>
  );
};
