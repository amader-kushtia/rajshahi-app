import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Search, 
  Filter, 
  RefreshCw, 
  Trash2, 
  Palette, 
  LogIn, 
  UserX, 
  CheckCircle2, 
  XCircle, 
  FileText,
  AlertTriangle,
  Clock,
  Calendar,
  Layers,
  ChevronDown,
  Info
} from 'lucide-react';
import { ActivityLog } from '../../types';
import { fetchActivityLogsFromFirestore } from '../../services/adminService';

export const SystemAuditLogTab: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedActor, setSelectedActor] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const loadLogs = async (isSync = false) => {
    if (isSync) {
      setSyncing(true);
    } else {
      setLoading(true);
    }
    try {
      const fetchedLogs = await fetchActivityLogsFromFirestore();
      // Sort chronologically (latest first)
      const sortedLogs = [...fetchedLogs].sort((a, b) => b.timestamp - a.timestamp);
      setLogs(sortedLogs);
    } catch (err) {
      console.error('Error loading audit logs:', err);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleRefresh = () => {
    loadLogs(true);
  };

  // Helper to get formatted date string
  const formatDateTime = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch {
      return 'অজানা সময়';
    }
  };

  // Helper to get relative time
  const getRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 1) return 'এইমাত্র';
    if (mins < 60) return `${mins} মিনিট আগে`;
    if (hours < 24) return `${hours} ঘণ্টা আগে`;
    return `${days} দিন আগে`;
  };

  // Log Type icon and colors dictionary
  const getLogMeta = (type: ActivityLog['type'] | 'login_attempt') => {
    switch (type) {
      case 'post_deleted':
        return {
          icon: <Trash2 className="w-4 h-4 text-rose-600" />,
          bgColor: 'bg-rose-50 dark:bg-rose-950/20',
          borderColor: 'border-rose-100 dark:border-rose-900/30',
          textColor: 'text-rose-700 dark:text-rose-400',
          label: 'পোস্ট অপসারণ'
        };
      case 'theme_updated':
        return {
          icon: <Palette className="w-4 h-4 text-amber-600" />,
          bgColor: 'bg-amber-50 dark:bg-amber-950/20',
          borderColor: 'border-amber-100 dark:border-amber-900/30',
          textColor: 'text-amber-700 dark:text-amber-400',
          label: 'থিম পরিবর্তন'
        };
      case 'login_attempt':
        return {
          icon: <LogIn className="w-4 h-4 text-emerald-600" />,
          bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
          borderColor: 'border-emerald-100 dark:border-emerald-900/30',
          textColor: 'text-emerald-700 dark:text-emerald-400',
          label: 'লগইন চেষ্টা'
        };
      case 'user_status_changed':
        return {
          icon: <UserX className="w-4 h-4 text-indigo-600" />,
          bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
          borderColor: 'border-indigo-100 dark:border-indigo-900/30',
          textColor: 'text-indigo-700 dark:text-indigo-400',
          label: 'ইউজার স্ট্যাটাস'
        };
      case 'post_approved':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-teal-600" />,
          bgColor: 'bg-teal-50 dark:bg-teal-950/20',
          borderColor: 'border-teal-100 dark:border-teal-900/30',
          textColor: 'text-teal-700 dark:text-teal-400',
          label: 'পোস্ট অনুমোদন'
        };
      case 'post_rejected':
        return {
          icon: <XCircle className="w-4 h-4 text-rose-500" />,
          bgColor: 'bg-rose-50/70 dark:bg-rose-950/10',
          borderColor: 'border-rose-100/50 dark:border-rose-900/20',
          textColor: 'text-rose-600 dark:text-rose-400',
          label: 'পোস্ট বাতিল'
        };
      default:
        return {
          icon: <FileText className="w-4 h-4 text-slate-600" />,
          bgColor: 'bg-slate-100 dark:bg-slate-800/50',
          borderColor: 'border-pink-200/80 dark:border-slate-800',
          textColor: 'text-slate-700 dark:text-slate-300',
          label: 'অন্যান্য অ্যাকশন'
        };
    }
  };

  // Get unique list of actors for filters
  const actors = Array.from(new Set(logs.map(l => l.actor || 'অজ্ঞাত')));

  // Statistics calculation
  const stats = {
    total: logs.length,
    deletions: logs.filter(l => l.type === 'post_deleted').length,
    themeChanges: logs.filter(l => l.type === 'theme_updated').length,
    loginAttempts: logs.filter(l => l.type === 'login_attempt').length,
    loginSuccess: logs.filter(l => l.type === 'login_attempt' && l.title.includes('সফল')).length,
    loginFailure: logs.filter(l => l.type === 'login_attempt' && l.title.includes('ব্যর্থ')).length,
  };

  // Filter and search logic
  const filteredLogs = logs.filter(log => {
    // 1. Text Search query
    const matchSearch = 
      log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.actor || '').toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Filter by Type
    const matchType = selectedType === 'all' || log.type === selectedType;

    // 3. Filter by Actor
    const matchActor = selectedActor === 'all' || log.actor === selectedActor;

    // 4. Filter by Timeframe
    let matchTime = true;
    if (selectedTimeframe !== 'all') {
      const logDate = new Date(log.timestamp);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedTimeframe === 'today') {
        matchTime = logDate >= today;
      } else if (selectedTimeframe === 'yesterday') {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        matchTime = logDate >= yesterday && logDate < today;
      } else if (selectedTimeframe === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        matchTime = logDate >= oneWeekAgo;
      }
    }

    return matchSearch && matchType && matchActor && matchTime;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Widget */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-pink-200/80/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              সিস্টেম অডিট লগ (System Audit Log)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ফায়ারস্টোর ডাটাবেজ থেকে সরাসরি সংগৃহীত অ্যাডমিন প্যানেলের সমস্ত অ্যাক্টিভিটি হিস্ট্রি
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={syncing || loading}
          className="self-start sm:self-auto py-2.5 px-5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-black flex items-center gap-2 text-slate-700 dark:text-slate-200 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
          <span>{syncing ? 'সিনক্রোনাইজ হচ্ছে...' : 'ফায়ারস্টোর সিঙ্ক করুন'}</span>
        </button>
      </div>

      {/* Audit Stats Dashboard Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Logs */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-pink-200/80/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-pink-100 dark:border-slate-700 shrink-0">
            <Layers className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">সর্বমোট লগ</span>
            <span className="text-lg font-black text-slate-800 dark:text-white">{stats.total} টি</span>
          </div>
        </div>

        {/* Post Deletions */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-pink-200/80/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center border border-rose-100 dark:border-rose-900/30 shrink-0">
            <Trash2 className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">পোস্ট ডিলিট</span>
            <span className="text-lg font-black text-rose-700 dark:text-rose-400">{stats.deletions} বার</span>
          </div>
        </div>

        {/* Theme Changes */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-pink-200/80/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center border border-amber-100 dark:border-amber-900/30 shrink-0">
            <Palette className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">থিম কাস্টমাইজ</span>
            <span className="text-lg font-black text-amber-700 dark:text-amber-400">{stats.themeChanges} বার</span>
          </div>
        </div>

        {/* Login Attempts */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-pink-200/80/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/30 shrink-0">
            <LogIn className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">লগইন প্রচেষ্টা</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-800 dark:text-white">{stats.loginAttempts} বার</span>
              {stats.loginFailure > 0 && (
                <span className="text-[9px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/20 px-1 rounded">
                  {stats.loginFailure} ব্যর্থ
                </span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Control Filters Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-pink-200/80/80 dark:border-slate-800 shadow-xs space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Text Search Inputs */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="অ্যাকশন টাইটেল, ডেসক্রিপশন বা এডমিন ইমেইল দিয়ে খুঁজুন..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-pink-200/80 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-pink-600 focus:bg-white dark:focus:bg-slate-800 dark:text-white transition-all"
            />
          </div>

          {/* Type dropdown */}
          <div className="md:col-span-3">
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full appearance-none px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-pink-200/80 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-pink-600 dark:text-white"
              >
                <option value="all">সকল অ্যাকশন টাইপ (All Types)</option>
                <option value="post_deleted">পোস্ট ডিলিট (Post Deleted)</option>
                <option value="theme_updated">থিম ও সেটিংস পরিবর্তন (Theme Updated)</option>
                <option value="login_attempt">লগইন চেষ্টা (Login Attempts)</option>
                <option value="user_status_changed">ইউজার স্ট্যাটাস পরিবর্তন (User Status)</option>
                <option value="post_approved">পোস্ট অনুমোদন (Post Approved)</option>
                <option value="post_rejected">পোস্ট বাতিল (Post Rejected)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-4 pointer-events-none" />
            </div>
          </div>

          {/* Actor Filter dropdown */}
          <div className="md:col-span-2">
            <div className="relative">
              <select
                value={selectedActor}
                onChange={(e) => setSelectedActor(e.target.value)}
                className="w-full appearance-none px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-pink-200/80 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-pink-600 dark:text-white"
              >
                <option value="all">সকল এডমিন (All Actors)</option>
                {actors.map(actor => (
                  <option key={actor} value={actor}>{actor}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-4 pointer-events-none" />
            </div>
          </div>

          {/* Timeframe selector dropdown */}
          <div className="md:col-span-2">
            <div className="relative">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="w-full appearance-none px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-pink-200/80 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-pink-600 dark:text-white"
              >
                <option value="all">সকল সময় (All Time)</option>
                <option value="today">আজকে (Today)</option>
                <option value="yesterday">গতকাল (Yesterday)</option>
                <option value="week">গত ৭ দিন (Last 7 Days)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-4 pointer-events-none" />
            </div>
          </div>

        </div>

      </div>

      {/* Logs Chronological Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-pink-200/80/80 dark:border-slate-800 shadow-xs overflow-hidden">
        
        {loading ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-pink-200/80 border-t-emerald-600 rounded-full animate-spin mx-auto" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">
              অডিট লগ লোড হচ্ছে...
            </p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-dashed border-pink-200/80 dark:border-slate-700 flex items-center justify-center mx-auto text-slate-400">
              <Info className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">কোনো অডিট লগ পাওয়া যায়নি</h4>
              <p className="text-xs text-slate-400 max-w-[280px] mx-auto leading-normal">
                প্রদত্ত ফিল্টার বা সার্চ কিওয়ার্ড অনুযায়ী কোনো হিস্ট্রি পাওয়া যায়নি। অন্য কিওয়ার্ড দিয়ে চেষ্টা করুন।
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredLogs.map((log) => {
              const meta = getLogMeta(log.type);
              const isExpanded = expandedLogId === log.id;
              const isFailedLogin = log.type === 'login_attempt' && log.title.includes('ব্যর্থ');

              return (
                <div 
                  key={log.id} 
                  className={`p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all ${
                    isExpanded ? 'bg-slate-50/40 dark:bg-slate-800/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    
                    {/* Badge Icon indicator */}
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${meta.bgColor} ${meta.borderColor}`}>
                      {meta.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      
                      {/* Log Action and Actor header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                            {log.title}
                          </span>
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${meta.bgColor} ${meta.textColor} border ${meta.borderColor}`}>
                            {meta.label}
                          </span>
                        </div>

                        {/* Timing stamps */}
                        <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold" title={formatDateTime(log.timestamp)}>
                            {getRelativeTime(log.timestamp)}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className={`text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium leading-normal ${
                        isExpanded ? '' : 'line-clamp-2 sm:line-clamp-1'
                      }`}>
                        {log.description}
                      </p>

                      {/* Details toggler expand */}
                      <div className="mt-2.5 flex items-center justify-between">
                        
                        {/* Actor badge */}
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                          <span className="text-[9px] bg-slate-100 dark:bg-slate-800 border border-pink-200/80 dark:border-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">
                            এডমিন: {log.actor || 'অজ্ঞাত'}
                          </span>
                        </div>

                        {/* Interactive Toggle Button */}
                        <button
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                          className="text-[10px] font-black text-slate-500 hover:text-emerald-600 flex items-center gap-1 transition-colors"
                        >
                          <span>{isExpanded ? 'সংক্ষেপ করুন' : 'বিস্তারিত বিবরণ দেখুন'}</span>
                          <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>

                      </div>

                      {/* Expandable details segment */}
                      {isExpanded && (
                        <div className="mt-4 p-3.5 bg-white dark:bg-slate-950 rounded-2xl border border-pink-200/80 dark:border-slate-800 space-y-3.5 text-[11px] leading-relaxed animate-in slide-in-from-top duration-200">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div>
                              <span className="text-slate-400 font-bold block mb-0.5">লগ আইডি</span>
                              <code className="text-slate-700 dark:text-slate-300 font-mono font-bold bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                {log.id}
                              </code>
                            </div>
                            <div>
                              <span className="text-slate-400 font-bold block mb-0.5">সঠিক সময়কাল (Timestamp)</span>
                              <span className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                {formatDateTime(log.timestamp)}
                              </span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-pink-100 dark:border-slate-800">
                            <span className="text-slate-400 font-bold block mb-1">অ্যাক্টিভিটি বিবরণ</span>
                            <p className="text-slate-800 dark:text-slate-200 font-bold bg-slate-50/50 dark:bg-slate-800/40 p-3 rounded-xl border border-pink-100 dark:border-slate-800">
                              {log.description}
                            </p>
                          </div>

                          {isFailedLogin && (
                            <div className="p-3 bg-rose-50/30 dark:bg-rose-950/10 border border-rose-100/30 dark:border-rose-900/10 rounded-xl flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                              <p className="text-rose-700 dark:text-rose-400 leading-normal font-medium">
                                নিরাপত্তা সংকেত: এই লগইন চেষ্টাটি ব্যর্থ হয়েছে। কোনো অননুমোদিত ব্যক্তি অ্যাডমিন প্যানেলে ভুল পাসওয়ার্ড বা ইমেইল দিয়ে অ্যাক্সেসের চেষ্টা করে থাকতে পারে।
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
};
