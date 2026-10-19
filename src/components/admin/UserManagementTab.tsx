import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  Mail, 
  Calendar,
  UserCheck,
  UserX,
  X,
  Filter,
  RefreshCw,
  Flag,
  Clock,
  Ban,
  CheckSquare,
  Square,
  AlertTriangle,
  Info,
  ChevronDown,
  Activity,
  ChevronUp,
  Building,
  Copy,
  Check
} from 'lucide-react';
import { UserProfile } from '../../types';
import { 
  getManagedUsers, 
  fetchManagedUsersFromFirestore,
  toggleUserBlocked, 
  toggleUserVerified, 
  addActivityLog,
  applyBulkTemporaryBan,
  applyBulkUnban,
  applyBulkPermanentBlock,
  toggleUserFlag
} from '../../services/adminService';
import { BulkTemporaryBanModal } from './BulkTemporaryBanModal';
import { UserActivityWidget } from './UserActivityWidget';
import { 
  startUserMetricsBackgroundListener, 
  pushUserMetricsSummaryToFirestore 
} from '../../services/userMetricsService';

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button 
      onClick={handleCopy}
      className="ml-1 p-1 hover:bg-white/20 rounded transition-colors text-white/70 hover:text-white"
      title="ID কপি করুন"
    >
      {copied ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
    </button>
  );
};

export const UserManagementTab: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>(() => getManagedUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'flagged' | 'temp_ban' | 'verified' | 'unverified' | 'blocked'>('all');
  const [selectedUids, setSelectedUids] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showActivityWidget, setShowActivityWidget] = useState<boolean>(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 50;

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  // Modal state for Temporary Ban
  const [isTempBanModalOpen, setIsTempBanModalOpen] = useState<boolean>(false);
  const [tempBanTargetUsers, setTempBanTargetUsers] = useState<UserProfile[]>([]);

  // Listen for storage/user updates & activate metrics background synchronization
  useEffect(() => {
    const handleUpdate = () => {
      setUsers(getManagedUsers());
    };

    fetchManagedUsersFromFirestore().then(realUsers => {
      if (realUsers && realUsers.length > 0) {
        setUsers(realUsers);
        pushUserMetricsSummaryToFirestore(realUsers, 'background_sync_listener').catch(() => {});
      }
    });

    const stopMetricsListener = startUserMetricsBackgroundListener();
    window.addEventListener('kushtia-users-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      stopMetricsListener();
      window.removeEventListener('kushtia-users-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleStatus = (user: UserProfile) => {
    const updated = toggleUserBlocked(user.uid);
    setUsers(updated);
    pushUserMetricsSummaryToFirestore(updated, 'background_sync_listener').catch(() => {});
    showToast(`"${user.displayName}" এর একাউন্ট স্ট্যাটাস পরিবর্তন করা হয়েছে।`);
  };

  const handleToggleVerify = (user: UserProfile) => {
    const updated = toggleUserVerified(user.uid);
    setUsers(updated);
    pushUserMetricsSummaryToFirestore(updated, 'background_sync_listener').catch(() => {});
    showToast(`"${user.displayName}" এর ভেরিফিকেশন স্ট্যাটাস আপডেট করা হয়েছে।`);
  };

  const handleToggleFlag = (user: UserProfile) => {
    const updated = toggleUserFlag(user.uid);
    setUsers(updated);
    pushUserMetricsSummaryToFirestore(updated, 'background_sync_listener').catch(() => {});
    const isNowFlagged = !user.isFlagged;
    showToast(`"${user.displayName}" কে ${isNowFlagged ? 'ফ্ল্যাগ' : 'আন-ফ্ল্যাগ'} করা হয়েছে।`);
  };

  // Single user Temporary Ban trigger
  const handleSingleTempBan = (user: UserProfile) => {
    setTempBanTargetUsers([user]);
    setIsTempBanModalOpen(true);
  };

  // Bulk selection handlers
  const handleToggleSelect = (uid: string) => {
    setSelectedUids(prev => 
      prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
    );
  };

  const handleSelectAllVisible = () => {
    if (selectedUids.length === filteredUsers.length && filteredUsers.length > 0) {
      setSelectedUids([]);
    } else {
      setSelectedUids(filteredUsers.map(u => u.uid));
    }
  };

  const handleSelectAllFlagged = () => {
    const flaggedUids = users.filter(u => u.isFlagged).map(u => u.uid);
    setSelectedUids(flaggedUids);
    if (flaggedUids.length > 0) {
      showToast(`${flaggedUids.length} জন ফ্ল্যাগড ইউজার নির্বাচন করা হয়েছে।`);
    } else {
      showToast('বর্তমানে কোনো ফ্ল্যাগড ইউজার নেই।');
    }
  };

  const handleClearSelection = () => {
    setSelectedUids([]);
  };

  // Open Bulk Temporary Ban Modal
  const handleOpenBulkTempBanModal = () => {
    const targets = users.filter(u => selectedUids.includes(u.uid));
    if (targets.length === 0) {
      showToast('অনুগ্রহ করে অন্তত একজন ইউজার নির্বাচন করুন।');
      return;
    }
    setTempBanTargetUsers(targets);
    setIsTempBanModalOpen(true);
  };

  // Execute Bulk Temporary Ban
  const handleConfirmBulkBanned = (durationHours: number, reason: string) => {
    const targetUids = tempBanTargetUsers.map(u => u.uid);
    const updated = applyBulkTemporaryBan(targetUids, durationHours, reason);
    setUsers(updated);
    pushUserMetricsSummaryToFirestore(updated, 'background_sync_listener').catch(() => {});
    setSelectedUids([]);
    showToast(`সফলভাবে ${targetUids.length} জন ইউজারকে ${durationHours} ঘণ্টার জন্য সাময়িক ব্যান করা হয়েছে।`);
  };

  // Execute Bulk Unban (Restore to active)
  const handleBulkUnban = () => {
    if (selectedUids.length === 0) return;
    const updated = applyBulkUnban(selectedUids);
    setUsers(updated);
    pushUserMetricsSummaryToFirestore(updated, 'background_sync_listener').catch(() => {});
    const count = selectedUids.length;
    setSelectedUids([]);
    showToast(`${count} জন ইউজারকে সফলভাবে আনব্যান ও সক্রিয় করা হয়েছে।`);
  };

  // Execute Bulk Permanent Block
  const handleBulkPermanentBlock = () => {
    if (selectedUids.length === 0) return;
    if (!window.confirm(`আপনি কি নিশ্চিত যে নির্বাচিত ${selectedUids.length} জন ইউজারকে স্থায়ীভাবে ব্লক করতে চান?`)) {
      return;
    }
    const updated = applyBulkPermanentBlock(selectedUids);
    setUsers(updated);
    pushUserMetricsSummaryToFirestore(updated, 'background_sync_listener').catch(() => {});
    const count = selectedUids.length;
    setSelectedUids([]);
    showToast(`${count} জন ইউজারকে স্থায়ীভাবে ব্লক করা হয়েছে।`);
  };

  // Filtered users calculation
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const term = searchTerm.trim().toLowerCase();
      
      const matchesSearch = !term || (
        (u.displayName && u.displayName.toLowerCase().includes(term)) ||
        (u.phone && u.phone.toLowerCase().includes(term)) ||
        (u.email && u.email.toLowerCase().includes(term)) ||
        (u.citizenId && u.citizenId.toLowerCase().includes(term)) ||
        (u.ward && u.ward.toLowerCase().includes(term)) ||
        (u.flagReason && u.flagReason.toLowerCase().includes(term))
      );

      if (!matchesSearch) return false;

      if (filterType === 'flagged') return u.isFlagged === true;
      if (filterType === 'temp_ban') return u.status === 'temporary_ban';
      if (filterType === 'verified') return u.isVerified === true;
      if (filterType === 'unverified') return !u.isVerified;
      if (filterType === 'blocked') return u.status === 'blocked';

      return true;
    });
  }, [users, searchTerm, filterType]);

  const flaggedCount = users.filter(u => u.isFlagged).length;
  const tempBannedCount = users.filter(u => u.status === 'temporary_ban').length;
  const verifiedCount = users.filter(u => u.isVerified).length;
  const blockedCount = users.filter(u => u.status === 'blocked').length;

  // Selected counts
  const selectedFlaggedCount = users.filter(u => selectedUids.includes(u.uid) && u.isFlagged).length;

  const formatBanRemaining = (expiresAt?: number): string => {
    if (!expiresAt) return '';
    const diff = expiresAt - Date.now();
    if (diff <= 0) return 'মেয়াদ উত্তীর্ণ';
    const hours = Math.ceil(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours} ঘণ্টা বাকি`;
    const days = Math.ceil(hours / 24);
    return `${days} দিন বাকি`;
  };

  const UserItemRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const user = filteredUsers[index];
    if (!user) return null;
    const isSelected = selectedUids.includes(user.uid);
    const isTempBanned = user.status === 'temporary_ban';
    const isBlocked = user.status === 'blocked';
    const banRemaining = isTempBanned ? formatBanRemaining(user.banExpiresAt) : '';

    return (
      <div style={style} className="px-2">
        <div
          className={`bg-white rounded-2xl p-4 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
            isSelected 
              ? 'border-amber-400 bg-amber-50/20 ring-1 ring-amber-400' 
              : user.isFlagged
                ? 'border-amber-200 hover:border-amber-300'
                : 'border-pink-200/80/80 hover:border-pink-300'
          }`}
        >
          {/* Checkbox & User Basic Info */}
          <div className="flex items-start sm:items-center gap-3">
            <button
              type="button"
              onClick={() => handleToggleSelect(user.uid)}
              className="mt-1 sm:mt-0 p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            >
              {isSelected ? (
                <CheckSquare className="w-5 h-5 text-amber-600" />
              ) : (
                <Square className="w-5 h-5 text-slate-300 hover:text-slate-400" />
              )}
            </button>

            <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-900 font-black text-sm flex items-center justify-center shrink-0 border border-emerald-200 overflow-hidden">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
              ) : (
                user.displayName?.charAt(0) || 'U'
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="text-xs font-bold text-slate-900">{user.displayName}</h4>
                {user.citizenId && (
                  <span className="flex items-center px-1.5 py-0.5 rounded-md bg-slate-900 text-white text-[9px] font-mono font-bold tracking-wider">
                    {user.citizenId}
                    <CopyButton text={user.citizenId} />
                  </span>
                )}
                {user.isFlagged && (
                  <span className="flex items-center gap-1 text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300" title={user.flagReason || 'স্প্যামিং বা সন্দেহজনক কার্যকলাপের ফ্ল্যাগ'}>
                    <Flag className="w-3 h-3 text-amber-700 fill-amber-700" />
                    <span>ফ্ল্যাগড {user.flagCount ? `(${user.flagCount})` : ''}</span>
                  </span>
                )}
                {user.isVerified ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>ভেরিফায়েড</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                    সাধারণ মেম্বার
                  </span>
                )}
                {isTempBanned && (
                  <span className="flex items-center gap-1 text-[10px] font-black text-orange-900 bg-orange-100 px-2 py-0.5 rounded-md border border-orange-300" title={user.banReason ? `কারণ: ${user.banReason}` : 'সাময়িক ব্যান কার্যকর'}>
                    <Clock className="w-3 h-3 text-orange-600" />
                    <span>সাময়িক ব্যান {banRemaining ? `(${banRemaining})` : ''}</span>
                  </span>
                )}
                {isBlocked && (
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                    স্থায়ী ব্লক (Blocked)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 flex-wrap">
                <span className="flex items-center gap-1 font-mono font-medium text-slate-700">
                  <Phone className="w-3 h-3 text-emerald-600" />
                  {user.phone || 'ফোন নেই'}
                </span>
                {user.ward && (
                  <span className="flex items-center gap-1 font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md">
                    <Building className="w-3 h-3 text-slate-400" />
                    {user.ward}
                  </span>
                )}
                {user.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" />
                    {user.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0 flex-wrap">
            <button
              onClick={() => handleToggleFlag(user)}
              className={`p-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 ${
                user.isFlagged
                  ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                  : 'bg-slate-50 text-slate-600 border-pink-200/80 hover:bg-slate-100'
              }`}
              title={user.isFlagged ? 'ফ্ল্যাগ বাতিল করুন' : 'সন্দেহজনক হিসেবে ফ্ল্যাগ করুন'}
            >
              <Flag className={`w-3.5 h-3.5 ${user.isFlagged ? 'text-amber-700 fill-amber-700' : 'text-slate-400'}`} />
              <span className="text-[11px]">{user.isFlagged ? 'ফ্ল্যাগড' : 'ফ্ল্যাগ'}</span>
            </button>
            <button
              onClick={() => handleSingleTempBan(user)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 ${
                isTempBanned
                  ? 'bg-orange-600 text-white border-orange-700 shadow-xs'
                  : 'bg-orange-50 text-orange-900 border-orange-200 hover:bg-orange-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isTempBanned ? 'ব্যান মেয়াদ পরিবর্তন' : 'সাময়িক ব্যান'}</span>
            </button>
            <button
              onClick={() => handleToggleVerify(user)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                user.isVerified
                  ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              {user.isVerified ? 'আনভেরিফাই' : 'ভেরিফাই'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="UserManagementTab space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-500/30 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* User Activity & Registration Trends Line Chart Widget */}
      {showActivityWidget && (
        <UserActivityWidget users={users} />
      )}

      {/* Header & Dedicated User Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900">ইউজার ও নাগরিক মেম্বার ডিরেক্টরি</h3>
              <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                মোট {users.length} জন
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              ফ্ল্যাগড ইউজার নির্বাচন করে বাল্ক সাময়িক ব্যান (Temporary Ban) প্রয়োগ করুন ও স্ট্যাটাস পরিচালনা করুন
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Toggle User Activity Chart */}
            <button
              type="button"
              onClick={() => setShowActivityWidget(!showActivityWidget)}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                showActivityWidget
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
              title={showActivityWidget ? 'অ্যাক্টিভিটি চার্ট লুকান' : 'অ্যাক্টিভিটি চার্ট খুলুন'}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{showActivityWidget ? 'অ্যাক্টিভিটি চার্ট খোলা' : 'অ্যাক্টিভিটি চার্ট দেখুন'}</span>
              {showActivityWidget ? (
                <ChevronUp className="w-3 h-3 text-slate-400" />
              ) : (
                <ChevronDown className="w-3 h-3 text-emerald-600" />
              )}
            </button>


            {flaggedCount > 0 && (
              <button
                onClick={() => setFilterType('flagged')}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border flex items-center gap-1.5 transition-all ${
                  filterType === 'flagged' 
                    ? 'bg-amber-600 text-white border-amber-700' 
                    : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                }`}
              >
                <Flag className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                <span>{flaggedCount} জন ফ্ল্যাগড ইউজার</span>
              </button>
            )}

            {tempBannedCount > 0 && (
              <button
                onClick={() => setFilterType('temp_ban')}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border flex items-center gap-1.5 transition-all ${
                  filterType === 'temp_ban' 
                    ? 'bg-orange-600 text-white border-orange-700' 
                    : 'bg-orange-50 text-orange-900 border-orange-300 hover:bg-orange-100'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                <span>{tempBannedCount} সাময়িক ব্যান</span>
              </button>
            )}

            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{verifiedCount} ভেরিফায়েড</span>
            </span>

            {blockedCount > 0 && (
              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>{blockedCount} স্থায়ী স্থগিত</span>
              </span>
            )}
          </div>
        </div>

        {/* Dedicated Search Bar Field */}
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ইউজারের নাম, মোবাইল নম্বর অথবা ফ্ল্যাগ কারণ লিখে খুঁজুন..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-pink-200/80 rounded-2xl text-xs font-medium focus:outline-none focus:border-pink-600 focus:bg-white focus:ring-2 focus:ring-pink-500/10 transition-all text-slate-800 placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                title="সার্চ মুছুন"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              সব ({users.length})
            </button>

            <button
              onClick={() => setFilterType('flagged')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                filterType === 'flagged'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Flag className="w-3 h-3 text-amber-600 fill-amber-600" />
              <span>ফ্ল্যাগড ({flaggedCount})</span>
            </button>

            <button
              onClick={() => setFilterType('temp_ban')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                filterType === 'temp_ban'
                  ? 'bg-orange-600 text-white'
                  : 'bg-orange-50 text-orange-900 hover:bg-orange-100 border border-orange-200'
              }`}
            >
              <Clock className="w-3 h-3 text-orange-600" />
              <span>সাময়িক ব্যান ({tempBannedCount})</span>
            </button>

            <button
              onClick={() => setFilterType('verified')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filterType === 'verified'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
              }`}
            >
              ভেরিফায়েড ({verifiedCount})
            </button>

            <button
              onClick={() => setFilterType('unverified')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filterType === 'unverified'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              সাধারণ ({users.length - verifiedCount})
            </button>

            {blockedCount > 0 && (
              <button
                onClick={() => setFilterType('blocked')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  filterType === 'blocked'
                    ? 'bg-rose-700 text-white'
                    : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200/60'
                }`}
              >
                স্থায়ী ব্লক ({blockedCount})
              </button>
            )}
          </div>
        </div>

        {/* Quick Bulk Selection Tools & Filter info */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-pink-100 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAllVisible}
              className="flex items-center gap-1.5 font-bold text-slate-700 hover:text-emerald-700 transition-colors"
            >
              {filteredUsers.length > 0 && selectedUids.length === filteredUsers.length ? (
                <CheckSquare className="w-4 h-4 text-emerald-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>
                {filteredUsers.length > 0 && selectedUids.length === filteredUsers.length
                  ? 'সব আনসিলেক্ট করুন'
                  : `দৃশ্যমান সব সিলেক্ট করুন (${filteredUsers.length})`}
              </span>
            </button>

            <span className="text-slate-300">|</span>

            <button
              onClick={handleSelectAllFlagged}
              className="flex items-center gap-1.5 font-bold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors"
            >
              <Flag className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
              <span>সকল ফ্ল্যাগড ইউজার নির্বাচন ({flaggedCount} জন)</span>
            </button>
          </div>

          {(searchTerm || filterType !== 'all') && (
            <div className="flex items-center gap-2 text-slate-500">
              <span>
                ফলাফল: <strong className="text-slate-900 font-bold">{filteredUsers.length}</strong> জন
              </span>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                }}
                className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>রিসেট</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating / Sticky Bulk Action Bar when users are selected */}
      {selectedUids.length > 0 && (
        <div className="sticky top-2 z-30 bg-slate-900 text-white rounded-2xl p-4 shadow-xl border border-amber-500/40 flex flex-col md:flex-row items-center justify-between gap-3 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white">
                  {selectedUids.length} জন ইউজার নির্বাচিত
                </span>
                {selectedFlaggedCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    {selectedFlaggedCount} জন ফ্ল্যাগড
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                বাল্ক অ্যাকশন বেছে নিন: সাময়িক ব্যান মেয়াদ নির্ধারণ অথবা সক্রিয়করণ
              </p>
            </div>
          </div>

          {/* Bulk Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
            {/* Primary Action: Temporary Ban */}
            <button
              onClick={handleOpenBulkTempBanModal}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md transition-all shadow-amber-500/20"
            >
              <Clock className="w-4 h-4" />
              <span>সাময়িক ব্যান করুন (Temporary Ban)</span>
            </button>

            {/* Unban / Activate */}
            <button
              onClick={handleBulkUnban}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="নির্বাচিত ইউজারদের আনব্যান করে সক্রিয় করুন"
            >
              <UserCheck className="w-4 h-4" />
              <span>সক্রিয় / আনব্যান</span>
            </button>

            {/* Permanent Block */}
            <button
              onClick={handleBulkPermanentBlock}
              className="px-3 py-2 bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="স্থায়ীভাবে ব্লক করুন"
            >
              <UserX className="w-3.5 h-3.5 text-rose-400" />
              <span>স্থায়ী ব্লক</span>
            </button>

            {/* Clear selection */}
            <button
              onClick={handleClearSelection}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              title="নির্বাচন বাতিল করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="space-y-2.5">
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center space-y-3 border border-pink-200/80/80">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">কোনো ইউজার পাওয়া যায়নি</h4>
              <p className="text-xs text-slate-500 mt-1">
                অনুসন্ধান বা ফিল্টারের শর্ত অনুযায়ী কোনো মেম্বার পাওয়া যায়নি।
              </p>
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              সকল ইউজার দেখুন
            </button>
          </div>
        ) : (
          filteredUsers
            .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
            .map((user, idx) => {
            const isSelected = selectedUids.includes(user.uid);
            const isTempBanned = user.status === 'temporary_ban';
            const isBlocked = user.status === 'blocked';
            const banRemaining = isTempBanned ? formatBanRemaining(user.banExpiresAt) : '';

            return (
              <div
                key={`${user.uid}-${idx}`}
                className={`bg-white rounded-2xl p-4 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
                  isSelected 
                    ? 'border-amber-400 bg-amber-50/20 ring-1 ring-amber-400' 
                    : user.isFlagged
                      ? 'border-amber-200 hover:border-amber-300'
                      : 'border-pink-200/80/80 hover:border-pink-300'
                }`}
              >
                {/* Checkbox & User Basic Info */}
                <div className="flex items-start sm:items-center gap-3">
                  {/* Select Checkbox */}
                  <button
                    type="button"
                    onClick={() => handleToggleSelect(user.uid)}
                    className="mt-1 sm:mt-0 p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 text-amber-600" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                    )}
                  </button>

                  <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-900 font-black text-sm flex items-center justify-center shrink-0 border border-emerald-200 overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                    ) : (
                      user.displayName?.charAt(0) || 'U'
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs font-bold text-slate-900">{user.displayName}</h4>
                      
                      {/* Citizen ID Badge */}
                      {user.citizenId && (
                        <span className="flex items-center px-1.5 py-0.5 rounded-md bg-slate-900 text-white text-[9px] font-mono font-bold tracking-wider">
                          {user.citizenId}
                          <CopyButton text={user.citizenId} />
                        </span>
                      )}

                      {/* Flagged Badge */}
                      {user.isFlagged && (
                        <span 
                          className="flex items-center gap-1 text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300"
                          title={user.flagReason || 'স্প্যামিং বা সন্দেহজনক কার্যকলাপের ফ্ল্যাগ'}
                        >
                          <Flag className="w-3 h-3 text-amber-700 fill-amber-700" />
                          <span>ফ্ল্যাগড {user.flagCount ? `(${user.flagCount})` : ''}</span>
                        </span>
                      )}

                      {/* Verification Badge */}
                      {user.isVerified ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>ভেরিফায়েড</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                          সাধারণ মেম্বার
                        </span>
                      )}

                      {/* Status Badges */}
                      {isTempBanned && (
                        <span 
                          className="flex items-center gap-1 text-[10px] font-black text-orange-900 bg-orange-100 px-2 py-0.5 rounded-md border border-orange-300"
                          title={user.banReason ? `কারণ: ${user.banReason}` : 'সাময়িক ব্যান কার্যকর'}
                        >
                          <Clock className="w-3 h-3 text-orange-600" />
                          <span>সাময়িক ব্যান {banRemaining ? `(${banRemaining})` : ''}</span>
                        </span>
                      )}

                      {isBlocked && (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                          স্থায়ী ব্লক (Blocked)
                        </span>
                      )}
                    </div>

                    {/* Flag Reason if present */}
                    {user.isFlagged && user.flagReason && (
                      <p className="text-[11px] text-amber-800 font-medium mt-0.5 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                        <span>ফ্ল্যাগ কারণ: {user.flagReason}</span>
                      </p>
                    )}

                    {/* Ban reason if temporary ban */}
                    {isTempBanned && user.banReason && (
                      <p className="text-[11px] text-orange-800 font-medium mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-orange-600 shrink-0" />
                        <span>ব্যানের কারণ: {user.banReason}</span>
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 font-mono font-medium text-slate-700">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        {user.phone || 'ফোন নেই'}
                      </span>
                      {user.ward && (
                        <span className="flex items-center gap-1 font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md">
                          <Building className="w-3 h-3 text-slate-400" />
                          {user.ward}
                        </span>
                      )}
                      {user.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {user.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Individual Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0 flex-wrap">
                  {/* Flag Toggle Button */}
                  <button
                    onClick={() => handleToggleFlag(user)}
                    className={`p-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 ${
                      user.isFlagged
                        ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                        : 'bg-slate-50 text-slate-600 border-pink-200/80 hover:bg-slate-100'
                    }`}
                    title={user.isFlagged ? 'ফ্ল্যাগ বাতিল করুন' : 'সন্দেহজনক হিসেবে ফ্ল্যাগ করুন'}
                  >
                    <Flag className={`w-3.5 h-3.5 ${user.isFlagged ? 'text-amber-700 fill-amber-700' : 'text-slate-400'}`} />
                    <span className="text-[11px]">{user.isFlagged ? 'ফ্ল্যাগড' : 'ফ্ল্যাগ'}</span>
                  </button>

                  {/* Temporary Ban Button */}
                  <button
                    onClick={() => handleSingleTempBan(user)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 ${
                      isTempBanned
                        ? 'bg-orange-600 text-white border-orange-700 shadow-xs'
                        : 'bg-orange-50 text-orange-900 border-orange-200 hover:bg-orange-100'
                    }`}
                    title="এই ইউজারের জন্য সাময়িক ব্যান মেয়াদ সেট করুন"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{isTempBanned ? 'ব্যান মেয়াদ পরিবর্তন' : 'সাময়িক ব্যান'}</span>
                  </button>

                  {/* Access Switch (Active vs Blocked) */}
                  <div 
                    className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-pink-200/80 transition-colors cursor-pointer"
                    onClick={() => handleToggleStatus(user)}
                    title={user.status !== 'blocked' ? 'অ্যাকাউন্ট অ্যাক্সেস বন্ধ করতে ক্লিক করুন' : 'অ্যাকাউন্ট অ্যাক্সেস পুনরায় চালু করতে ক্লিক করুন'}
                  >
                    <div className="text-right select-none">
                      <span className="block text-[9px] font-bold text-slate-500 leading-tight">অ্যাক্সেস</span>
                      <span className={`text-[10px] font-black leading-tight ${user.status !== 'blocked' ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {user.status !== 'blocked' ? 'চালু' : 'স্থগিত'}
                      </span>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={user.status !== 'blocked'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(user);
                      }}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        user.status !== 'blocked' ? 'bg-emerald-600' : 'bg-slate-300 hover:bg-slate-400'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          user.status !== 'blocked' ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Verify button */}
                  <button
                    onClick={() => handleToggleVerify(user)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      user.isVerified
                        ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                    title={user.isVerified ? 'ভেরিফিকেশন ব্যাজ বাতিল করুন' : 'নাগরিককে ভেরিফায়েড ব্যাজ দিন'}
                  >
                    {user.isVerified ? 'আনভেরিফাই' : 'ভেরিফাই'}
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Pagination Controls */}
        {filteredUsers.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-pink-200/80 shadow-xs mt-4">
            <span className="text-xs font-bold text-slate-600">
              পাতা {currentPage} / {Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)} (মোট {filteredUsers.length} জন)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-xl text-xs font-bold text-slate-700 transition-colors"
              >
                আগের পাতা
              </button>
              <button
                type="button"
                disabled={currentPage >= Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 rounded-xl text-xs font-bold text-white transition-colors"
              >
                পরের পাতা
              </button>
            </div>
          </div>
        )}
      </div>

      {/* BulkTemporaryBanModal Component */}
      <BulkTemporaryBanModal
        isOpen={isTempBanModalOpen}
        onClose={() => {
          setIsTempBanModalOpen(false);
          setTempBanTargetUsers([]);
        }}
        selectedUsers={tempBanTargetUsers}
        onConfirmBan={handleConfirmBulkBanned}
      />
    </div>
  );
};
