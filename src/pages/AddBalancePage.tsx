import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  Copy, 
  Check, 
  Send, 
  ArrowLeft
} from 'lucide-react';
import { submitWalletTopUp, getUserWalletBalance } from '../services/walletService';
import { UserProfile } from '../types';

interface AddBalancePageProps {
  currentUser: UserProfile | null;
  onBack: () => void;
  onOpenAuth: () => void;
}

export const AddBalancePage: React.FC<AddBalancePageProps> = ({
  currentUser,
  onBack,
  onOpenAuth
}) => {
  const [method, setMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [amount, setAmount] = useState('500');
  const [senderNumber, setSenderNumber] = useState(currentUser?.phone || '');
  const [transactionId, setTransactionId] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

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
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-lg mx-auto bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100">
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </button>
          <h2 className="text-xl font-black text-slate-900">টাকা যোগ করুন</h2>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-2xl font-black shadow-lg shadow-emerald-600/30">
              ✓
            </div>
            <h3 className="text-lg font-black text-emerald-900">টপ-আপ রিকোয়েস্ট সফল!</h3>
            <p className="text-xs text-emerald-700">অ্যাডমিন যাচাই করে দ্রুত ব্যালেন্স আপডেট করে দিবে।</p>
            <button onClick={onBack} className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-bold">ঠিক আছে</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">পেমেন্ট মাধ্যম</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setMethod('bKash')} className={`p-3.5 rounded-2xl border-2 font-bold text-sm ${method === 'bKash' ? 'border-pink-600 bg-pink-50 text-pink-700' : 'border-slate-200'}`}>বিকাশ</button>
                <button type="button" onClick={() => setMethod('Nagad')} className={`p-3.5 rounded-2xl border-2 font-bold text-sm ${method === 'Nagad' ? 'border-orange-600 bg-orange-50 text-orange-700' : 'border-slate-200'}`}>নগদ</button>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <p className="text-xs font-bold text-slate-800">পেমেন্ট নিয়ম:</p>
              <p className="text-xs text-slate-600">১. {method} অ্যাপ থেকে Send Money করুন এই নম্বরে:</p>
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                <span className="font-mono font-bold text-lg">{agentNumbers[method]}</span>
                <button type="button" onClick={() => handleCopy(agentNumbers[method])} className="text-emerald-600">
                  {copiedNumber ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">টাকার পরিমাণ (৳)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-4 rounded-2xl border border-slate-200" placeholder="টাকার পরিমাণ" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">আপনার মোবাইল নাম্বার</label>
              <input type="text" value={senderNumber} onChange={(e) => setSenderNumber(e.target.value)} className="w-full p-4 rounded-2xl border border-slate-200" placeholder="017..." />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">ট্রানজাকশন আইডি (TrxID)</label>
              <input type="text" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} className="w-full p-4 rounded-2xl border border-slate-200" placeholder="TrxID" />
            </div>

            {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

            <button type="submit" className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black flex items-center justify-center gap-2">
              <Send className="w-5 h-5" /> জমা দিন
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
