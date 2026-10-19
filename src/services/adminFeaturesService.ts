import { 
  FlashAlert, 
  GrievanceReport, 
  BloodEmergencyAlert, 
  Doctor, 
  EmergencyHelpline, 
  BloodDonor, 
  PostItem, 
  UserProfile,
  TransportSchedule
} from '../types';
import { DOCTORS_LIST, EMERGENCY_HELPLINES, BLOOD_DONORS, TRANSPORT_SCHEDULES } from '../data/initialData';
import { addActivityLog } from './adminService';
import { postService } from './postService';

// Local Storage Keys
const FLASH_ALERTS_KEY = 'rajshahi_flash_alerts';
const MANAGED_DOCTORS_KEY = 'rajshahi_managed_doctors';
const MANAGED_HELPLINES_KEY = 'rajshahi_managed_helplines';
const MANAGED_DONORS_KEY = 'rajshahi_managed_blood_donors';
const GRIEVANCE_REPORTS_KEY = 'rajshahi_grievance_reports';
const BLOOD_ALERTS_KEY = 'rajshahi_blood_emergency_alerts';
const AUTO_APPROVE_KEY = 'rajshahi_posts_auto_approve';

// Initial Mock Grievance Reports for Realistic Data
const INITIAL_REPORTS: GrievanceReport[] = [
  {
    id: 'rep-1',
    title: 'রেলওয়ে কলোনির ড্রেন উপচে রাস্তায় পানি জমে আছে',
    category: 'drainage',
    description: 'গত ২ দিনের বৃষ্টিতে অফিসার্স কলোনি রোডের ড্রেন বন্ধ হয়ে গেছে এবং রাস্তায় নোংরা পানি জমছে। জরুরি পরিষ্কারের আবেদন।',
    location: 'রেলওয়ে অফিসার্স কলোনি ৩নং গলি',
    reporterName: 'কবিরুল ইসলাম',
    reporterPhone: '01712001122',
    isAnonymous: false,
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=600&auto=format&fit=crop&q=80',
    status: 'in_progress',
    adminNotes: 'পৌরসভার পরিচ্ছন্নতা পরিদর্শককে দায়িত্ব দেওয়া হয়েছে। আগামীকালের মধ্যে পরিষ্কার করা হবে।',
    createdAt: Date.now() - 1000 * 60 * 60 * 18,
    updatedAt: Date.now() - 1000 * 60 * 60 * 2
  },
  {
    id: 'rep-2',
    title: 'বিমানবন্দর রোডের ৩টি গুরুত্বপূর্ণ সড়ক বাতি নষ্ট',
    category: 'street-light',
    description: 'রাত ৮টার পর বিমানবন্দর মেইন রোডের বাঁকে সম্পূর্ণ অন্ধকার থাকে। ছিনতাইয়ের ঝুঁকি বাড়ছে।',
    location: 'বিমানবন্দর রোড, সোনালী মোড় সংলগ্ন',
    reporterName: 'তানভীর হাসান',
    reporterPhone: '01789334455',
    isAnonymous: false,
    status: 'pending',
    createdAt: Date.now() - 1000 * 60 * 60 * 6
  },
  {
    id: 'rep-3',
    title: 'নয়া বাজারে অবৈধ বর্জ্যের স্তূপ অপসারণ প্রয়োজন',
    category: 'waste',
    description: 'নয়া বাজার কাঁচাবাজারের পেছনে ময়লা জমে দুর্গন্ধ ছড়াচ্ছে এবং পথচারীদের চলাচলে সমস্যা হচ্ছে।',
    location: 'নয়া বাজার কাঁচাবাজার সংলগ্ন',
    reporterName: 'নজরুল ইসলাম',
    isAnonymous: true,
    status: 'resolved',
    adminNotes: 'পৌরসভার ট্রাকে বর্জ্য অপসারণ করে ব্লিচিং পাউডার ছিটানো সম্পন্ন হয়েছে।',
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    updatedAt: Date.now() - 1000 * 60 * 60 * 12
  }
];

// Initial Flash Alerts
const INITIAL_FLASH_ALERTS: FlashAlert[] = [
  {
    id: 'flash-1',
    title: 'পৌর এলাকায় আগামীকাল জরুরি বিদ্যুৎ মেইনটেন্যান্স',
    message: 'কুষ্টিয়া গ্রিড উপকেন্দ্রের বার্ষিক রক্ষণাবেক্ষণ কাজের জন্য আগামীকাল সকাল ৮টা থেকে দুপুর ২টা পর্যন্ত মুন্সিপাড়া ও বাবুপাড়া এলাকায় বিদ্যুৎ সরবরাহ বন্ধ থাকবে।',
    type: 'electricity',
    isActive: true,
    actionText: 'জরুরি হেল্পলাইন',
    actionLink: 'emergency',
    createdAt: Date.now() - 1000 * 60 * 60 * 5
  },
  {
    id: 'flash-2',
    title: 'আবহাওয়া বার্তা: ভারী বৃষ্টিপাত ও বজ্রপাতের সতর্কতা',
    message: 'রংপুর বিভাগসহ কুষ্টিয়া অঞ্চলে আগামী ২৪ ঘণ্টায় দমকা হাওয়াসহ ভারী বর্ষণের সম্ভাবনা রয়েছে। খোলা মাঠে অবস্থান পরিহার করুন।',
    type: 'weather',
    isActive: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24
  }
];

// Initial Blood Emergency Alerts
const INITIAL_BLOOD_ALERTS: BloodEmergencyAlert[] = [
  {
    id: 'blood-alert-1',
    patientName: 'মোছাঃ রোকেয়া বেগম (৫৫)',
    bloodGroup: 'B+',
    bagsNeeded: 2,
    hospital: 'কুষ্টিয়া ১০০ শয্যা সরকারি হাসপাতাল',
    reason: 'জরুরি সার্জারি অপারেশন',
    urgency: 'জরুরি (১ ঘণ্টার মধ্যে)',
    contactPhone: '01712998877',
    alternatePhone: '01712998800',
    location: 'হাসপাতাল রোড, সার্জারি ওয়ার্ড',
    createdAt: Date.now() - 1000 * 60 * 45,
    isActive: true
  }
];

// -------------------------------------------------------------
// 1. FLASH ALERT SYSTEM
// -------------------------------------------------------------
export function getFlashAlerts(): FlashAlert[] {
  try {
    const data = localStorage.getItem(FLASH_ALERTS_KEY);
    return data ? JSON.parse(data) : INITIAL_FLASH_ALERTS;
  } catch (e) {
    return INITIAL_FLASH_ALERTS;
  }
}

export function getActiveFlashAlert(): FlashAlert | null {
  const alerts = getFlashAlerts();
  return alerts.find(a => a.isActive) || null;
}

export function saveFlashAlert(alertData: Partial<FlashAlert>): FlashAlert {
  const list = getFlashAlerts();
  let updatedAlert: FlashAlert;

  if (alertData.id) {
    updatedAlert = {
      ...list.find(a => a.id === alertData.id)!,
      ...alertData,
      createdAt: alertData.createdAt || Date.now()
    };
    const newList = list.map(a => a.id === alertData.id ? updatedAlert : a);
    localStorage.setItem(FLASH_ALERTS_KEY, JSON.stringify(newList));
  } else {
    updatedAlert = {
      id: `alert-${Date.now()}`,
      title: alertData.title || 'জরুরি নোটিশ',
      message: alertData.message || '',
      type: alertData.type || 'emergency',
      isActive: alertData.isActive ?? true,
      actionText: alertData.actionText,
      actionLink: alertData.actionLink,
      createdAt: Date.now()
    };
    // If activating new alert, optionally set other active alerts to false
    if (updatedAlert.isActive) {
      list.forEach(a => a.isActive = false);
    }
    const newList = [updatedAlert, ...list];
    localStorage.setItem(FLASH_ALERTS_KEY, JSON.stringify(newList));
  }

  window.dispatchEvent(new Event('rajshahi-flash-alert-updated'));
  addActivityLog({
    type: 'alert_broadcast',
    title: 'ফ্ল্যাশ নোটিশ আপডেট',
    description: `"${updatedAlert.title}" ফ্ল্যাশ নোটিশ সংরক্ষিত হয়েছে।`,
    actor: 'অ্যাডমিন'
  });

  return updatedAlert;
}

export function toggleFlashAlertActive(id: string): boolean {
  const list = getFlashAlerts();
  let newStatus = false;
  const updated = list.map(a => {
    if (a.id === id) {
      newStatus = !a.isActive;
      return { ...a, isActive: newStatus };
    }
    // Only one active at a time for clarity
    return newStatus ? { ...a, isActive: false } : a;
  });
  localStorage.setItem(FLASH_ALERTS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('rajshahi-flash-alert-updated'));
  return newStatus;
}

/**
 * Web Audio Siren Generator for Emergency Flash Broadcast
 */
export function playSirenTone(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.linearRampToValueAtTime(880, now + 0.35);
    osc.frequency.linearRampToValueAtTime(440, now + 0.7);
    osc.frequency.linearRampToValueAtTime(880, now + 1.05);
    osc.frequency.linearRampToValueAtTime(440, now + 1.4);
    osc.frequency.linearRampToValueAtTime(880, now + 1.75);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 2.0);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 2.1);
  } catch (err) {
    console.error('Siren Audio error:', err);
  }
}

export function deleteFlashAlert(id: string): void {
  const list = getFlashAlerts().filter(a => a.id !== id);
  localStorage.setItem(FLASH_ALERTS_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('rajshahi-flash-alert-updated'));
}

// -------------------------------------------------------------
// 2. POST MODERATION & APPROVAL QUEUE
// -------------------------------------------------------------
export function getAutoApproveSetting(): boolean {
  try {
    const val = localStorage.getItem(AUTO_APPROVE_KEY);
    return val === 'true'; // Default is false: posts must be approved by admin before going public
  } catch {
    return false;
  }
}

export function setAutoApproveSetting(enabled: boolean): void {
  localStorage.setItem(AUTO_APPROVE_KEY, String(enabled));
}

export async function approvePost(postId: string): Promise<void> {
  await postService.updatePost(postId, {
    status: 'approved',
    isVerified: true
  });

  addActivityLog({
    type: 'post_approved',
    title: 'বিজ্ঞাপন অনুমোদন সম্পন্ন',
    description: `পোস্ট আইডি #${postId} অ্যাডমিন কর্তৃক অনুমোদিত হয়েছে।`,
    actor: 'অ্যাডমিন'
  });
}

export async function rejectPost(postId: string, reason?: string): Promise<void> {
  await postService.updatePost(postId, {
    status: 'rejected',
    rejectionReason: reason || 'বিজ্ঞাপনের বিবরণ নীতিমালার পরিপন্থী বা অসম্পূর্ণ।'
  });

  addActivityLog({
    type: 'post_rejected',
    title: 'বিজ্ঞাপন প্রত্যাখ্যান করা হয়েছে',
    description: `পোস্ট আইডি #${postId} বাতিল করা হয়েছে। কারণ: ${reason || 'নীতিমালা লঙ্ঘন'}`,
    actor: 'অ্যাডমিন'
  });
}

// -------------------------------------------------------------
// 3. DOCTORS & EMERGENCY DIRECTORY MANAGEMENT
// -------------------------------------------------------------
export function getManagedDoctors(): Doctor[] {
  try {
    const data = localStorage.getItem(MANAGED_DOCTORS_KEY);
    return data ? JSON.parse(data) : DOCTORS_LIST;
  } catch {
    return DOCTORS_LIST;
  }
}

export function saveDoctor(doctorData: Partial<Doctor>): Doctor {
  const list = getManagedDoctors();
  let updatedDoctor: Doctor;

  if (doctorData.id) {
    updatedDoctor = {
      ...list.find(d => d.id === doctorData.id)!,
      ...doctorData
    } as Doctor;
    const newList = list.map(d => d.id === doctorData.id ? updatedDoctor : d);
    localStorage.setItem(MANAGED_DOCTORS_KEY, JSON.stringify(newList));
  } else {
    updatedDoctor = {
      id: `doc-${Date.now()}`,
      name: doctorData.name || 'ডাঃ নতুন ডাক্তার',
      speciality: doctorData.speciality || 'জেনারেল ফিজিশিয়ান',
      degree: doctorData.degree || 'এমবিবিএস',
      hospital: doctorData.hospital || 'কুষ্টিয়া হাসপাতাল',
      chamber: doctorData.chamber || 'কুষ্টিয়া',
      visitingHours: doctorData.visitingHours || 'বিকাল ৫:০০ - রাত ৮:০০',
      serialNumber: doctorData.serialNumber || '01712000000',
      fee: doctorData.fee || '৫০০ ৳',
      availableDays: doctorData.availableDays || 'প্রতিদিন',
      isVerified: doctorData.isVerified ?? true
    };
    const newList = [updatedDoctor, ...list];
    localStorage.setItem(MANAGED_DOCTORS_KEY, JSON.stringify(newList));
  }

  window.dispatchEvent(new Event('rajshahi-directory-updated'));
  addActivityLog({
    type: 'doctor_updated',
    title: 'ডাক্তার প্রোফাইল আপডেট',
    description: `"${updatedDoctor.name}" এর তথ্য সফলভাবে সংরক্ষণ করা হয়েছে।`,
    actor: 'অ্যাডমিন'
  });

  return updatedDoctor;
}

export function deleteDoctor(id: string): void {
  const list = getManagedDoctors().filter(d => d.id !== id);
  localStorage.setItem(MANAGED_DOCTORS_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('rajshahi-directory-updated'));
}

export function getManagedHelplines(): EmergencyHelpline[] {
  try {
    const data = localStorage.getItem(MANAGED_HELPLINES_KEY);
    return data ? JSON.parse(data) : EMERGENCY_HELPLINES;
  } catch {
    return EMERGENCY_HELPLINES;
  }
}

export function saveHelpline(helplineData: Partial<EmergencyHelpline>): EmergencyHelpline {
  const list = getManagedHelplines();
  let updatedHelpline: EmergencyHelpline;

  if (helplineData.id) {
    updatedHelpline = {
      ...list.find(h => h.id === helplineData.id)!,
      ...helplineData
    } as EmergencyHelpline;
    const newList = list.map(h => h.id === helplineData.id ? updatedHelpline : h);
    localStorage.setItem(MANAGED_HELPLINES_KEY, JSON.stringify(newList));
  } else {
    updatedHelpline = {
      id: `em-${Date.now()}`,
      title: helplineData.title || 'জরুরি সেবা',
      dept: helplineData.dept || 'কুষ্টিয়া প্রশাসন',
      number: helplineData.number || '999',
      alternateNumber: helplineData.alternateNumber || '',
      address: helplineData.address || 'কুষ্টিয়া',
      availableHours: helplineData.availableHours || '২৪ ঘণ্টা',
      iconName: helplineData.iconName || 'ShieldAlert'
    };
    const newList = [updatedHelpline, ...list];
    localStorage.setItem(MANAGED_HELPLINES_KEY, JSON.stringify(newList));
  }

  window.dispatchEvent(new Event('rajshahi-directory-updated'));
  addActivityLog({
    type: 'helpline_updated',
    title: 'হেল্পলাইন আপডেট',
    description: `"${updatedHelpline.title}" হেল্পলাইন নম্বর সংরক্ষিত হয়েছে।`,
    actor: 'অ্যাডমিন'
  });

  return updatedHelpline;
}

export function deleteHelpline(id: string): void {
  const list = getManagedHelplines().filter(h => h.id !== id);
  localStorage.setItem(MANAGED_HELPLINES_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('rajshahi-directory-updated'));
}

// -------------------------------------------------------------
// 4. GRIEVANCE & CITIZEN REPORTS DESK
// -------------------------------------------------------------
export function getGrievanceReports(): GrievanceReport[] {
  try {
    const data = localStorage.getItem(GRIEVANCE_REPORTS_KEY);
    return data ? JSON.parse(data) : INITIAL_REPORTS;
  } catch {
    return INITIAL_REPORTS;
  }
}

export function createGrievanceReport(report: Omit<GrievanceReport, 'id' | 'createdAt' | 'status'>): GrievanceReport {
  const list = getGrievanceReports();
  const newReport: GrievanceReport = {
    ...report,
    id: `rep-${Date.now()}`,
    status: 'pending',
    createdAt: Date.now()
  };
  const newList = [newReport, ...list];
  localStorage.setItem(GRIEVANCE_REPORTS_KEY, JSON.stringify(newList));
  window.dispatchEvent(new Event('rajshahi-grievance-updated'));
  return newReport;
}

export function updateGrievanceStatus(
  id: string, 
  status: GrievanceReport['status'], 
  adminNotes?: string
): GrievanceReport | null {
  const list = getGrievanceReports();
  const target = list.find(r => r.id === id);
  if (!target) return null;

  const updated: GrievanceReport = {
    ...target,
    status,
    adminNotes: adminNotes !== undefined ? adminNotes : target.adminNotes,
    updatedAt: Date.now()
  };

  const newList = list.map(r => r.id === id ? updated : r);
  localStorage.setItem(GRIEVANCE_REPORTS_KEY, JSON.stringify(newList));
  window.dispatchEvent(new Event('rajshahi-grievance-updated'));

  addActivityLog({
    type: 'report_status_changed',
    title: 'নাগরিক অভিযোগ আপডেট',
    description: `"${target.title}" অভিযোগের স্ট্যাটাস পরিবর্তিত হয়েছে (${status})।`,
    actor: 'অ্যাডমিন'
  });

  return updated;
}

export function deleteGrievanceReport(id: string): void {
  const list = getGrievanceReports().filter(r => r.id !== id);
  localStorage.setItem(GRIEVANCE_REPORTS_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('rajshahi-grievance-updated'));
}

// -------------------------------------------------------------
// 5. BLOOD DONORS & EMERGENCY BLOOD ALERT DESK
// -------------------------------------------------------------
export function getManagedBloodDonors(): BloodDonor[] {
  try {
    const data = localStorage.getItem(MANAGED_DONORS_KEY);
    return data ? JSON.parse(data) : BLOOD_DONORS;
  } catch {
    return BLOOD_DONORS;
  }
}

export function saveBloodDonor(donorData: Partial<BloodDonor>): BloodDonor {
  const list = getManagedBloodDonors();
  let updatedDonor: BloodDonor;

  if (donorData.id) {
    updatedDonor = {
      ...list.find(d => d.id === donorData.id)!,
      ...donorData
    } as BloodDonor;
    const newList = list.map(d => d.id === donorData.id ? updatedDonor : d);
    localStorage.setItem(MANAGED_DONORS_KEY, JSON.stringify(newList));
  } else {
    updatedDonor = {
      id: `blood-${Date.now()}`,
      name: donorData.name || 'স্বেচ্ছাসেবী রক্তদাতা',
      bloodGroup: donorData.bloodGroup || 'O+',
      location: donorData.location || 'কুষ্টিয়া',
      phone: donorData.phone || '01712000000',
      lastDonationDate: donorData.lastDonationDate || '১ মাস পূর্বে',
      isAvailable: donorData.isAvailable ?? true,
      totalDonations: donorData.totalDonations || 1
    };
    const newList = [updatedDonor, ...list];
    localStorage.setItem(MANAGED_DONORS_KEY, JSON.stringify(newList));
  }

  window.dispatchEvent(new Event('rajshahi-blood-updated'));
  return updatedDonor;
}

export function toggleBloodDonorAvailability(id: string): boolean {
  const list = getManagedBloodDonors();
  let status = false;
  const updated = list.map(d => {
    if (d.id === id) {
      status = !d.isAvailable;
      return { ...d, isAvailable: status };
    }
    return d;
  });
  localStorage.setItem(MANAGED_DONORS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('rajshahi-blood-updated'));
  return status;
}

export function deleteBloodDonor(id: string): void {
  const list = getManagedBloodDonors().filter(d => d.id !== id);
  localStorage.setItem(MANAGED_DONORS_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('rajshahi-blood-updated'));
}

export function getBloodEmergencyAlerts(): BloodEmergencyAlert[] {
  try {
    const data = localStorage.getItem(BLOOD_ALERTS_KEY);
    return data ? JSON.parse(data) : INITIAL_BLOOD_ALERTS;
  } catch {
    return INITIAL_BLOOD_ALERTS;
  }
}

export function createBloodEmergencyAlert(data: Omit<BloodEmergencyAlert, 'id' | 'createdAt'>): BloodEmergencyAlert {
  const list = getBloodEmergencyAlerts();
  const newAlert: BloodEmergencyAlert = {
    ...data,
    id: `blood-alert-${Date.now()}`,
    createdAt: Date.now()
  };
  const newList = [newAlert, ...list];
  localStorage.setItem(BLOOD_ALERTS_KEY, JSON.stringify(newList));
  window.dispatchEvent(new Event('rajshahi-blood-alert-updated'));

  addActivityLog({
    type: 'blood_alert_created',
    title: 'জরুরি রক্তের ডাক',
    description: `${data.patientName} এর জন্য ${data.bloodGroup} রক্তের জরুরি ডাক পোস্ট করা হয়েছে।`,
    actor: 'অ্যাডমিন'
  });

  return newAlert;
}

export function toggleBloodAlertStatus(id: string): boolean {
  const list = getBloodEmergencyAlerts();
  let status = false;
  const updated = list.map(a => {
    if (a.id === id) {
      status = !a.isActive;
      return { ...a, isActive: status };
    }
    return a;
  });
  localStorage.setItem(BLOOD_ALERTS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('rajshahi-blood-alert-updated'));
  return status;
}

export function deleteBloodEmergencyAlert(id: string): void {
  const list = getBloodEmergencyAlerts().filter(a => a.id !== id);
  localStorage.setItem(BLOOD_ALERTS_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('rajshahi-blood-alert-updated'));
}

// -------------------------------------------------------------
// 6. CSV & SPREADSHEET EXPORT ENGINE (EXCEL COMPATIBLE UTF-8 BOM)
// -------------------------------------------------------------
export function downloadCSV(filename: string, rows: (string | number)[][]): void {
  // Prepend UTF-8 BOM so Excel opens Bengali characters properly
  const BOM = '\uFEFF';
  const csvContent = rows
    .map(row => 
      row
        .map(val => {
          const stringVal = String(val ?? '').replace(/"/g, '""');
          return `"${stringVal}"`;
        })
        .join(',')
    )
    .join('\r\n');

  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  addActivityLog({
    type: 'data_exported',
    title: 'ডেটা এক্সপোর্ট সম্পন্ন',
    description: `"${filename}" ডেটাসেট সফলভাবে CSV/Excel ফরম্যাটে ডাউনলোড করা হয়েছে।`,
    actor: 'অ্যাডমিন'
  });
}

export function exportPostsCSV(posts: PostItem[]): void {
  const headers = ['আইডি', 'ক্যাটাগরি', 'শিরোনাম', 'মূল্য/ভাড়া', 'লোকেশন', 'যোগাযোগ ফোন', 'লেখক', 'তারিখ', 'স্ট্যাটাস', 'ভেরিফাইড'];
  const rows = posts.map(p => [
    p.id,
    p.category,
    p.title,
    p.price || 'প্রযোজ্য নয়',
    p.location,
    p.contactPhone,
    p.authorName,
    new Date(p.createdAt).toLocaleDateString('bn-BD'),
    p.status || 'approved',
    p.isVerified ? 'হ্যাঁ' : 'না'
  ]);
  downloadCSV('rajshahi_connect_posts', [headers, ...rows]);
}

export function exportBloodDonorsCSV(donors: BloodDonor[]): void {
  const headers = ['আইডি', 'নাম', 'রক্তের গ্রুপ', 'এলাকা/লোকেশন', 'মোবাইল নম্বর', 'মোট রক্তদান', 'সর্বশেষ রক্তদান', 'উপলব্ধতা'];
  const rows = donors.map(d => [
    d.id,
    d.name,
    d.bloodGroup,
    d.location,
    d.phone,
    d.totalDonations,
    d.lastDonationDate || 'জানা নেই',
    d.isAvailable ? 'প্রস্তুত' : 'অনুপলব্ধ'
  ]);
  downloadCSV('rajshahi_blood_donors', [headers, ...rows]);
}

export function exportDoctorsCSV(doctors: Doctor[]): void {
  const headers = ['আইডি', 'নাম', 'বিশেষজ্ঞতা', 'ডিগ্রি', 'হাসপাতাল', 'চেম্বার ও ঠিকানা', 'সাক্ষাতের সময়', 'সিরিয়াল নম্বর', 'ফি'];
  const rows = doctors.map(d => [
    d.id,
    d.name,
    d.speciality,
    d.degree,
    d.hospital,
    d.chamber,
    d.visitingHours,
    d.serialNumber,
    d.fee
  ]);
  downloadCSV('rajshahi_doctors_directory', [headers, ...rows]);
}

export function exportGrievanceReportsCSV(reports: GrievanceReport[]): void {
  const headers = ['আইডি', 'শিরোনাম', 'বিভাগ', 'লোকেশন', 'বর্ণনা', 'প্রতিবেদক', 'ফোন', 'স্ট্যাটাস', 'অ্যাডমিন নোট', 'তারিখ'];
  const rows = reports.map(r => [
    r.id,
    r.title,
    r.category,
    r.location,
    r.description,
    r.reporterName,
    r.reporterPhone || 'গোপন',
    r.status,
    r.adminNotes || '',
    new Date(r.createdAt).toLocaleDateString('bn-BD')
  ]);
  downloadCSV('rajshahi_citizen_reports', [headers, ...rows]);
}

export function exportUsersCSV(users: UserProfile[]): void {
  const headers = ['ইউজার আইডি', 'নাম', 'ইমেইল', 'মোবাইল নম্বর', 'রোল', 'স্ট্যাটাস', 'ভেরিফাইড', 'যুক্ত হয়েছেন'];
  const rows = users.map(u => [
    u.uid,
    u.displayName,
    u.email || 'নাই',
    u.phone || 'দেওয়া হয়নি',
    u.role || 'citizen',
    u.status || 'active',
    u.isVerified ? 'হ্যাঁ' : 'না',
    u.joinedAt ? new Date(u.joinedAt).toLocaleDateString('bn-BD') : 'সম্প্রতি'
  ]);
  downloadCSV('rajshahi_registered_citizens', [headers, ...rows]);
}

// -------------------------------------------------------------
// TRANSPORT SCHEDULE MANAGEMENT SERVICE
// -------------------------------------------------------------
const MANAGED_TRANSPORT_KEY = 'rajshahi_managed_transport';

export function getManagedTransport(): TransportSchedule[] {
  try {
    const data = localStorage.getItem(MANAGED_TRANSPORT_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {}
  return TRANSPORT_SCHEDULES;
}

export function saveTransport(transData: Partial<TransportSchedule>): TransportSchedule {
  const list = getManagedTransport();
  let updated: TransportSchedule;
  if (transData.id) {
    updated = {
      ...list.find(t => t.id === transData.id)!,
      ...transData,
    } as TransportSchedule;
    const newList = list.map(t => t.id === transData.id ? updated : t);
    localStorage.setItem(MANAGED_TRANSPORT_KEY, JSON.stringify(newList));
    addActivityLog({
      type: 'user_registered',
      title: 'যাতায়াত শিডিউল আপডেট',
      description: `${updated.name} (${updated.type}) আপডেট করা হয়েছে।`,
      actor: 'অ্যাডমিন'
    });
  } else {
    updated = {
      id: `tr-${Date.now()}`,
      type: transData.type || 'বাস',
      name: transData.name || 'নতুন পরিবহন',
      code: transData.code || '',
      route: transData.route || 'কুষ্টিয়া ⇄ ঢাকা',
      departureTime: transData.departureTime || 'সকাল ৮:০০',
      arrivalTime: transData.arrivalTime || 'সন্ধ্যা ৬:০০',
      offDay: transData.offDay || 'নেই',
      fareList: transData.fareList || [{ class: 'সাধারণ', fare: '৫০০ ৳' }],
      bookingPhone: transData.bookingPhone || '01700000000'
    };
    const newList = [updated, ...list];
    localStorage.setItem(MANAGED_TRANSPORT_KEY, JSON.stringify(newList));
    addActivityLog({
      type: 'user_registered',
      title: 'নতুন যাতায়াত শিডিউল',
      description: `${updated.name} (${updated.type}) যোগ করা হয়েছে।`,
      actor: 'অ্যাডমিন'
    });
  }
  window.dispatchEvent(new CustomEvent('rajshahi-transport-updated'));
  return updated;
}

export function deleteTransport(id: string): void {
  const list = getManagedTransport();
  const item = list.find(t => t.id === id);
  const newList = list.filter(t => t.id !== id);
  localStorage.setItem(MANAGED_TRANSPORT_KEY, JSON.stringify(newList));
  if (item) {
    addActivityLog({
      type: 'user_registered',
      title: 'যাতায়াত শিডিউল ডিলিট',
      description: `${item.name} ডিলিট করা হয়েছে।`,
      actor: 'অ্যাডমিন'
    });
  }
  window.dispatchEvent(new CustomEvent('rajshahi-transport-updated'));
}
