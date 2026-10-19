import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  Copy, 
  Check, 
  Send, 
  AlertCircle, 
  Sparkles,
  Phone,
  ShieldCheck
} from 'lucide-react';
import { submitWalletTopUp, getUserWalletBalance } from '../services/walletService';
import { UserProfile } from '../types';

interface AddBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
}

export const AddBalanceModal: React.FC<AddBalanceModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenAuth
}) => {
  const [method, setMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [amount, setAmount] = useState('500');
  const [senderNumber, setSenderNumber] = useState(currentUser?.phone || '');
  const [transactionId, setTransactionId] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const agentNumbers = {
    bKash: '01711234567',
    Nagad: '01811234567'
  };

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!senderNumber || senderNumber.length < 10) {
      setError('সঠিক প্রেরক (Sender) মোবাইল নাম্বার দিন');
      return;
    }
    if (!transactionId || transactionId.length < 5) {
      setError('সঠিক ট্রানজাকশন আইডি (TrxID) দিন');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('সঠিক টাকার পরিমাণ দিন');
      return;
    }

    setError('');
    await submitWalletTopUp({
      userId: currentUser.uid,
      userName: currentUser.displayName || 'নাগরিক',
      userPhone: senderNumber,
      method,
      senderNumber,
      transactionId,
      amount: numAmount
    });

    setSubmitted(true);
  };

  const currentBalance = currentUser ? getUserWalletBalance(currentUser.uid) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative overflow-hidden space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">ওয়ালেটে টাকা যোগ করুন</h2>
              <p className="text-xs text-slate-500 font-medium">বর্তমান ব্যালেন্স: <span className="font-black text-emerald-700">৳ {currentBalance}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-2xl font-black shadow-lg shadow-emerald-600/30">
              ✓
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-emerald-900">টপ-আপ রিকোয়েস্ট সফলভাবে জমা হয়েছে!</h3>
              <p className="text-xs text-emerald-700 max-w-xs mx-auto">
                আপনার পেমেন্ট পেন্ডিং রয়েছে। অ্যাডমিন প্যানেল থেকে যাচাই করে দ্রুত আপনার ওয়ালেটে টাকা যোগ করা হবে।
              </p>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                setTransactionId('');
                onClose();
              }}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all"
            >
              ঠিক আছে
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Method Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">পেমেন্ট মাধ্যম সিলেক্ট করুন</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMethod('bKash')}
                  className={`p-3.5 rounded-2xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    method === 'bKash' 
                      ? 'border-pink-600 bg-pink-50 text-pink-700 shadow-sm' 
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-pink-600" />
                  <span>বিকাশ (bKash)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('Nagad')}
                  className={`p-3.5 rounded-2xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    method === 'Nagad' 
                      ? 'border-orange-600 bg-orange-50 text-orange-700 shadow-sm' 
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-orange-600" />
                  <span>নগদ (Nagad)</span>
                </button>
              </div>
            </div>

            {/* Instructions & One-Click Copy Number */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs text-slate-700">
              <p className="font-black text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>টাকা পাঠানোর নিয়ম ও নাম্বার:</span>
              </p>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 font-medium">
                <li>আপনার <span className="font-bold text-slate-900">{method}</span> অ্যাপ থেকে <b>Send Money</b> করুন।</li>
                <li>নিচের এজেন্ট/পার্সোনাল নাম্বারে টাকা পাঠান।</li>
                <li>টাকা পাঠানোর পর প্রাপ্ত <b>TrxID</b> (ট্রানজাকশন আইডি) নিচে লিখুন।</li>
              </ol>

              <div className="bg-white border border-emerald-200 rounded-xl p-3 flex items-center justify-between gap-3 shadow-2xs">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{method} সেন্ড মানি নাম্বার:</p>
                  <p className="text-base font-black font-mono text-emerald-800">{agentNumbers[method]}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(agentNumbers[method])}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    copiedNumber ? 'bg-emerald-600 text-white' : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700'
                  }`}
                >
                  {copiedNumber ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedNumber ? 'কপি হয়েছে!' : 'এক ক্লিকে কপি'}</span>
                </button>
              </div>
            </div>

            {/* Form Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">টাকার পরিমাণ (৳)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="যেমন: 500"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">আপনার মোবাইল নাম্বার</label>
                <input
                  type="text"
                  value={senderNumber}
                  onChange={(e) => setSenderNumber(e.target.value)}
                  placeholder="যেমন: 01700000000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">ট্রানজাকশন আইডি (TrxID)</label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                placeholder="যেমন: 9N78GH23KL"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {error && (
              <p className="text-xs text-rose-600 font-bold flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>টপ-আপ রিকোয়েস্ট সাবমিট করুন</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
