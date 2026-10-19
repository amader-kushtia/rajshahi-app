import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Phone, 
  MapPin, 
  Trash2, 
  FileText, 
  Filter, 
  Search,
  MessageSquare,
  ShieldAlert,
  Send,
  ExternalLink,
  ChevronRight,
  User
} from 'lucide-react';
import { GrievanceReport } from '../../types';
import { 
  getGrievanceReports, 
  updateGrievanceStatus, 
  deleteGrievanceReport 
} from '../../services/adminFeaturesService';

export const GrievanceDeskTab: React.FC = () => {
  const [reports, setReports] = useState<GrievanceReport[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active Action Note Drawer/Modal
  const [selectedReport, setSelectedReport] = useState<GrievanceReport | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  const loadReports = () => {
    setReports(getGrievanceReports());
  };

  useEffect(() => {
    loadReports();
    const handleUpdate = () => loadReports();
    window.addEventListener('kushtia-grievance-updated', handleUpdate);
    return () => window.removeEventListener('kushtia-grievance-updated', handleUpdate);
  }, []);

  const handleUpdateStatus = (id: string, newStatus: GrievanceReport['status']) => {
    updateGrievanceStatus(id, newStatus);
  };

  const handleSaveAdminNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    updateGrievanceStatus(selectedReport.id, selectedReport.status, adminNoteInput.trim());
    setSelectedReport(null);
    setAdminNoteInput('');
  };

  // Filter calculations
  const filtered = reports.filter(r => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reporterName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const inProgressCount = reports.filter(r => r.status === 'in_progress').length;
  const resolvedCount = reports.filter(r => r.status === 'resolved').length;

  const getStatusBadge = (status: GrievanceReport['status']) => {
    switch (status) {
      case 'resolved':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          label: 'নিষ্পন্ন (Resolved)',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        };
      case 'in_progress':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          label: 'প্রক্রিয়াধীন (In Progress)',
          icon: <Clock className="w-3.5 h-3.5 text-amber-600" />
        };
      case 'dismissed':
        return {
          bg: 'bg-slate-100 text-slate-700 border-pink-200/80',
          label: 'বাতিল (Dismissed)',
          icon: <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
        };
      default:
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          label: 'অপেক্ষমাণ (Pending)',
          icon: <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
        };
    }
  };

  const getCategoryLabel = (cat: GrievanceReport['category']) => {
    switch (cat) {
      case 'drainage': return 'ড্রেনেজ ও জলাবদ্ধতা';
      case 'street-light': return 'সড়ক বাতি সমস্যা';
      case 'waste': return 'বর্জ্য ও পরিচ্ছন্নতা';
      case 'crime': return 'অপরাধ ও আইনশৃঙ্খলা';
      case 'corruption': return 'অনিয়ম ও দুর্নীতি';
      case 'traffic': return 'যানজট ও সড়ক';
      default: return 'নাগরিক সেবা';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-200/80/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">
              নাগরিক অভিযোগ ও ফিডব্যাক ট্র্যাকিং ডেস্ক
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            শহরের বাসিন্দাদের ড্রেন, সড়ক বাতি বা অপরাধ সংক্রান্ত রিপোর্ট পর্যালোচনা ও সমাধান করুন।
          </p>
        </div>

        {/* Counter Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3.5 py-1.5 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-bold text-rose-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            <span>অপেক্ষমাণ: {pendingCount}</span>
          </div>
          <div className="px-3.5 py-1.5 bg-amber-50 border border-amber-100 rounded-2xl text-xs font-bold text-amber-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>প্রক্রিয়াধীন: {inProgressCount}</span>
          </div>
          <div className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>নিষ্পন্ন: {resolvedCount}</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-3xl p-3 border border-pink-200/80/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            সব অভিযোগ ({reports.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              statusFilter === 'pending'
                ? 'bg-rose-700 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            অপেক্ষমাণ ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              statusFilter === 'in_progress'
                ? 'bg-amber-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            প্রক্রিয়াধীন ({inProgressCount})
          </button>
          <button
            onClick={() => setStatusFilter('resolved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              statusFilter === 'resolved'
                ? 'bg-emerald-700 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            নিষ্পন্ন ({resolvedCount})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="অভিযোগ খুঁজুন..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-pink-200/80 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
          />
        </div>
      </div>

      {/* Reports Feed */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-pink-200/80/80">
          <p className="text-xs text-slate-500 font-medium">এই ফিল্টারে কোনো অভিযোগ পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((report) => {
            const badge = getStatusBadge(report.status);
            return (
              <div 
                key={report.id}
                className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs flex flex-col justify-between space-y-3 hover:border-pink-300 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {getCategoryLabel(report.category)}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${badge.bg}`}>
                      {badge.icon}
                      <span>{badge.label}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 leading-snug">
                    {report.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {report.description}
                  </p>

                  {report.imageUrl && (
                    <div className="pt-1">
                      <img 
                        src={report.imageUrl} 
                        alt="Evidence" 
                        className="w-full h-36 object-cover rounded-2xl border border-pink-200/80"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  <div className="pt-2 border-t border-pink-100 space-y-1 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                      <span className="font-semibold text-slate-700">{report.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{report.isAnonymous ? 'নাম প্রকাশে অনিচ্ছুক' : report.reporterName}</span>
                      </div>
                      <span>{new Date(report.createdAt).toLocaleDateString('bn-BD')}</span>
                    </div>

                    {report.reporterPhone && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-slate-600 font-bold">ফোন: {report.reporterPhone}</span>
                        <a 
                          href={`tel:${report.reporterPhone}`}
                          className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-[10px] font-bold hover:bg-emerald-100"
                        >
                          কল করুন
                        </a>
                      </div>
                    )}

                    {report.adminNotes && (
                      <div className="mt-2 p-2.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 space-y-0.5">
                        <span className="font-bold block">অ্যাডমিন অ্যাকশন নোট:</span>
                        <p>{report.adminNotes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Switcher Controls */}
                <div className="pt-3 border-t border-pink-100 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    {report.status !== 'in_progress' && (
                      <button
                        onClick={() => handleUpdateStatus(report.id, 'in_progress')}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 transition-all"
                      >
                        তদন্ত শুরু
                      </button>
                    )}
                    {report.status !== 'resolved' && (
                      <button
                        onClick={() => handleUpdateStatus(report.id, 'resolved')}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-all"
                      >
                        সমাধান সম্পন্ন
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setSelectedReport(report);
                        setAdminNoteInput(report.adminNotes || '');
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>নোট</span>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('আপনি কি এই অভিযোগটি মুছে ফেলতে চান?')) {
                          deleteGrievanceReport(report.id);
                        }
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="মুছুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADMIN NOTE MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-pink-200/80">
            <h3 className="text-sm font-black text-slate-900">
              অ্যাডমিন অ্যাকশন নোট যুক্ত করুন
            </h3>
            <p className="text-xs text-slate-500">
              অভিযোগ: <span className="font-bold text-slate-700">{selectedReport.title}</span>
            </p>

            <form onSubmit={handleSaveAdminNote} className="space-y-3">
              <textarea
                rows={4}
                required
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
                placeholder="যেমন: সংশ্লিষ্ট পৌর ওয়ার্ড কাউন্সিলর এবং পরিচ্ছন্ন টিমকে জানানো হয়েছে..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-pink-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-hidden resize-none"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black"
                >
                  নোট সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
