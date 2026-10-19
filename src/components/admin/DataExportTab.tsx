import React, { useState } from 'react';
import { 
  Download, 
  FileSpreadsheet, 
  Printer, 
  Database, 
  FileText, 
  Users, 
  Droplet, 
  Stethoscope, 
  ShieldAlert, 
  CheckCircle2,
  HardDrive,
  Calendar
} from 'lucide-react';
import { PostItem, UserProfile } from '../../types';
import { 
  exportPostsCSV, 
  exportBloodDonorsCSV, 
  exportDoctorsCSV, 
  exportGrievanceReportsCSV, 
  exportUsersCSV,
  getManagedBloodDonors,
  getManagedDoctors,
  getGrievanceReports
} from '../../services/adminFeaturesService';
import { getManagedUsers } from '../../services/adminService';

interface DataExportTabProps {
  posts: PostItem[];
}

export const DataExportTab: React.FC<DataExportTabProps> = ({ posts }) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const showFeedback = (label: string) => {
    setDownloadSuccess(label);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 4000);
  };

  const handleExportPosts = () => {
    exportPostsCSV(posts);
    showFeedback('বিজ্ঞাপনের তালিকা');
  };

  const handleExportDonors = () => {
    const donors = getManagedBloodDonors();
    exportBloodDonorsCSV(donors);
    showFeedback('রক্তদাতাদের তালিকা');
  };

  const handleExportDoctors = () => {
    const doctors = getManagedDoctors();
    exportDoctorsCSV(doctors);
    showFeedback('ডাক্তার ডিরেক্টরি');
  };

  const handleExportReports = () => {
    const reports = getGrievanceReports();
    exportGrievanceReportsCSV(reports);
    showFeedback('নাগরিক অভিযোগ ডাটা');
  };

  const handleExportUsers = () => {
    const users = getManagedUsers();
    exportUsersCSV(users);
    showFeedback('নিবন্ধিত ইউজার ডাটা');
  };

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-200/80/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <Database className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900">
              ডেটা এক্সপোর্ট, ব্যাকআপ ও অফিসিয়াল রিপোর্ট
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            অ্যাপের সমস্ত তথ্য এক্সেল (.CSV) বা প্রিন্ট ফরম্যাটে এক ক্লিকে ডাউনলোড করে ব্যাকআপ রাখুন।
          </p>
        </div>

        <button
          onClick={handlePrintSummary}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black flex items-center gap-2 shadow-xs transition-all"
        >
          <Printer className="w-4 h-4 text-emerald-400" />
          <span>অফিসিয়াল রিপোর্ট প্রিন্ট / PDF</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {downloadSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>"{downloadSuccess}" সফলভাবে আপনার ডিভাইসে এক্সেল ফাইল আকারে ডাউনলোড হয়েছে!</span>
        </div>
      )}

      {/* Export Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* 1. Posts & Ads */}
        <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs flex flex-col justify-between hover:border-blue-400 transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900">বিজ্ঞাপন ও পোস্ট ডেটাসেট</h3>
            <p className="text-xs text-slate-500">
              বাসা ভাড়া, কেনাবেচা ও সেবাসমূহের সকল অ্যাক্টিভ পোস্টের পূর্ণাঙ্গ তালিকা।
            </p>
            <div className="text-[11px] font-bold text-slate-700 pt-1">
              মোট রেকর্ড: {posts.length} টি পোস্ট
            </div>
          </div>

          <button
            onClick={handleExportPosts}
            className="mt-4 w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel (.CSV) ডাউনলোড</span>
          </button>
        </div>

        {/* 2. Blood Donors */}
        <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs flex flex-col justify-between hover:border-rose-400 transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <Droplet className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900">রক্তদাতা তালিকা ডাটাবেস</h3>
            <p className="text-xs text-slate-500">
              কুষ্টিয়ায়র সকল নিবন্ধিত রক্তদাতার রক্তের গ্রুপ, এলাকা ও ফোন নম্বর।
            </p>
            <div className="text-[11px] font-bold text-slate-700 pt-1">
              ফরম্যাট: UTF-8 বাংলা সাপোর্টেড
            </div>
          </div>

          <button
            onClick={handleExportDonors}
            className="mt-4 w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>রক্তদাতা তালিকা এক্সপোর্ট</span>
          </button>
        </div>

        {/* 3. Doctors & Helplines */}
        <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs flex flex-col justify-between hover:border-teal-400 transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900">ডাক্তার ও হেল্পলাইন ডিরেক্টরি</h3>
            <p className="text-xs text-slate-500">
              বিশেষজ্ঞ ডাক্তার, চেম্বার লোকেশন, ফোন নম্বর ও জরুরি হেল্পলাইন তালিকা।
            </p>
            <div className="text-[11px] font-bold text-slate-700 pt-1">
              প্রয়োজনীয় জরুরি ব্যাকআপ
            </div>
          </div>

          <button
            onClick={handleExportDoctors}
            className="mt-4 w-full py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ডাক্তার তালিকা এক্সপোর্ট</span>
          </button>
        </div>

        {/* 4. Grievance Reports */}
        <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900">নাগরিক অভিযোগ ও ক্রাইম রিপোর্ট</h3>
            <p className="text-xs text-slate-500">
              নাগরিকদের পাঠানো অভিযোগ, বর্তমান স্ট্যাটাস এবং অ্যাডমিন সমাধান নোট।
            </p>
            <div className="text-[11px] font-bold text-slate-700 pt-1">
              পৌর প্রশাসন ও প্রাতিষ্ঠানিক রেকর্ড
            </div>
          </div>

          <button
            onClick={handleExportReports}
            className="mt-4 w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>অভিযোগ ডেটা এক্সপোর্ট</span>
          </button>
        </div>

        {/* 5. Registered Citizens */}
        <div className="bg-white rounded-3xl p-5 border border-pink-200/80/80 shadow-xs flex flex-col justify-between hover:border-emerald-400 transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900">নিবন্ধিত নাগরিক তালিকা</h3>
            <p className="text-xs text-slate-500">
              অ্যাপে অ্যাকাউন্ট খোলা ব্যবহারকারীদের নাম, মোবাইল, রোল ও অ্যাকাউন্ট স্ট্যাটাস।
            </p>
            <div className="text-[11px] font-bold text-slate-700 pt-1">
              ব্যবহারকারী মেম্বারশিপ তালিকা
            </div>
          </div>

          <button
            onClick={handleExportUsers}
            className="mt-4 w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ইউজার তালিকা এক্সপোর্ট</span>
          </button>
        </div>
      </div>

      {/* Printable Report Summary (Preview Box) */}
      <div className="bg-white rounded-3xl p-6 border border-pink-200/80/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-pink-100 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-900">
              আমার কুষ্টিয়া • সিস্টেম পরিসংখ্যান সারাংশ
            </h3>
            <p className="text-xs text-slate-500">
              অফিসিয়াল রেকর্ড ও প্রিন্ট প্রিভিউ
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
            তারিখ: {new Date().toLocaleDateString('bn-BD')}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
          <div className="p-3 rounded-2xl bg-slate-50 border border-pink-100 text-center">
            <div className="text-lg font-black text-slate-900">{posts.length}</div>
            <div className="text-[11px] text-slate-500 font-medium">মোট বিজ্ঞাপন</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-pink-100 text-center">
            <div className="text-lg font-black text-slate-900">{getManagedBloodDonors().length}</div>
            <div className="text-[11px] text-slate-500 font-medium">রক্তদাতা</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-pink-100 text-center">
            <div className="text-lg font-black text-slate-900">{getManagedDoctors().length}</div>
            <div className="text-[11px] text-slate-500 font-medium">বিশেষজ্ঞ ডাক্তার</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-pink-100 text-center">
            <div className="text-lg font-black text-slate-900">{getGrievanceReports().length}</div>
            <div className="text-[11px] text-slate-500 font-medium">নাগরিক অভিযোগ</div>
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="text-[11px] text-slate-400">
            উক্ত সারাংশটি সৈয়দপুর কানেক্ট অ্যাডমিন প্যানেল থেকে তৈরি হয়েছে।
          </p>
        </div>
      </div>
    </div>
  );
};
