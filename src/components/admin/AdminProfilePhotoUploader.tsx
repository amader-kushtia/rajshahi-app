import React, { useState } from 'react';
import { Camera, Upload, CheckCircle2, Loader2, Trash2 } from 'lucide-react';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface AdminProfilePhotoUploaderProps {
  currentPhotoUrl?: string;
  onPhotoUploaded: (url: string) => void;
}

export const AdminProfilePhotoUploader: React.FC<AdminProfilePhotoUploaderProps> = ({
  currentPhotoUrl,
  onPhotoUploaded
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('দয়া করে একটি বৈধ ছবি (Image) নির্বাচন করুন।');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('ছবির সাইজ ৫ মেগাবাইটের কম হতে হবে।');
      return;
    }

    setError(null);
    setSuccess(null);
    setUploading(true);

    // Instant Local Preview using FileReader
    const previewReader = new FileReader();
    previewReader.onload = (pe) => {
      setLocalPreview(pe.target?.result as string);
    };
    previewReader.readAsDataURL(file);

    try {
      // 1. Try Firebase Storage upload with a 4-second timeout
      const uploadWithTimeout = async () => {
        try {
          const storageRef = ref(storage, `admin_profiles/admin_avatar_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`);
          
          // Race between upload and a 4s timeout
          const uploadPromise = uploadBytes(storageRef, file);
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Firebase Storage timeout')), 4000)
          );

          const snapshot = await Promise.race([uploadPromise, timeoutPromise]) as any;
          const downloadUrl = await getDownloadURL(snapshot.ref);
          
          onPhotoUploaded(downloadUrl);
          setSuccess('প্রোফাইল ছবি সফলভাবে ফায়ারস্টোরেজে আপলোড হয়েছে!');
          setUploading(false);
          return true;
        } catch (storageErr) {
          console.warn('Firebase storage attempt failed or timed out:', storageErr);
          return false;
        }
      };

      const storageSuccess = await uploadWithTimeout();
      if (storageSuccess) return;

      // 2. Fallback: Convert image to DataURL (Base64) if storage failed or timed out
      console.log('Falling back to Base64 for profile photo...');
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64String = uploadEvent.target?.result as string;
        if (base64String) {
          onPhotoUploaded(base64String);
          setSuccess('প্রোফাইল ছবি সফলভাবে সংরক্ষিত হয়েছে!');
        } else {
          setError('ছবি প্রসেস করতে সমস্যা হয়েছে।');
        }
        setUploading(false);
      };
      reader.onerror = () => {
        setError('ছবি পড়তে সমস্যা হয়েছে।');
        setUploading(false);
      };
      reader.readAsDataURL(file);

    } catch (err: any) {
      console.error('Photo processing error:', err);
      setError('ছবি আপলোড করতে সমস্যা হয়েছে। দয়া করে অন্য ছবি চেষ্টা করুন।');
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/55 border border-pink-200/80 dark:border-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-black text-slate-900 dark:text-white">ফায়ারস্টোরেজ প্রোফাইল ছবি আপলোড</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">আপনার ডিভাইস থেকে সরাসরি ছবি আপলোড করে স্টোরেজে সংরক্ষণ করুন।</p>
        </div>
        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-500 bg-slate-900 flex items-center justify-center shadow-md relative">
          {(localPreview || currentPhotoUrl) ? (
            <img src={localPreview || currentPhotoUrl} alt="Admin Profile" className="w-full h-full object-cover" />
          ) : (
            <Camera className="w-6 h-6 text-emerald-400" />
          )}
          {uploading && (
            <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer shadow-lg shadow-emerald-600/20 transition-all ${uploading ? 'opacity-70 cursor-not-allowed' : ''}`}>
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>আপলোড হচ্ছে...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>নতুন ছবি নির্বাচন ও আপলোড করুন</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {currentPhotoUrl && (
          <button
            type="button"
            onClick={() => onPhotoUploaded('')}
            className="px-4 py-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-bold transition-all hover:bg-rose-100 flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>রিমুভ</span>
          </button>
        )}
      </div>
    </div>
  );
};
