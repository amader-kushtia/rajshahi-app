import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot,
  updateDoc,
  serverTimestamp,
  where,
  limit
} from 'firebase/firestore';
import { db } from '../firebase';
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

// Firestore Collection Names
const COLLECTIONS = {
  FLASH_ALERTS: 'flash_alerts',
  DOCTORS: 'doctors_directory',
  HELPLINES: 'emergency_helplines',
  BLOOD_DONORS: 'blood_donors',
  GRIEVANCE_REPORTS: 'grievance_reports',
  BLOOD_ALERTS: 'blood_emergency_alerts',
  TRANSPORT: 'transport_schedules'
};

const AUTO_APPROVE_KEY = 'rajshahi_posts_auto_approve';

// In-memory cache for synchronous access
let cachedDoctors: Doctor[] = [];
let cachedBloodDonors: BloodDonor[] = [];
let cachedBloodAlerts: BloodEmergencyAlert[] = [];
let cachedGrievances: GrievanceReport[] = [];
let cachedHelplines: EmergencyHelpline[] = [];
let cachedTransport: TransportSchedule[] = [];

// -------------------------------------------------------------
// 1. FLASH ALERT SYSTEM
// -------------------------------------------------------------
export async function fetchFlashAlerts(): Promise<FlashAlert[]> {
  try {
    const q = query(collection(db, COLLECTIONS.FLASH_ALERTS), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const alerts: FlashAlert[] = [];
    snap.forEach(d => alerts.push({ id: d.id, ...d.data() } as FlashAlert));
    return alerts.length > 0 ? alerts : [];
  } catch (e) {
    console.error('Error fetching flash alerts:', e);
    return [];
  }
}

let cachedFlashAlerts: FlashAlert[] = [];

// Initialize cache
if (typeof window !== 'undefined') {
  fetchFlashAlerts().then(alerts => {
    cachedFlashAlerts = alerts;
  });
}

export function getFlashAlerts(): FlashAlert[] {
  return cachedFlashAlerts;
}

export function subscribeToFlashAlerts(callback: (alerts: FlashAlert[]) => void) {
  const q = query(collection(db, COLLECTIONS.FLASH_ALERTS), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const alerts: FlashAlert[] = [];
    snap.forEach(d => alerts.push({ id: d.id, ...d.data() } as FlashAlert));
    cachedFlashAlerts = alerts;
    callback(alerts);
    window.dispatchEvent(new CustomEvent('kushtia-flash-alert-updated', { detail: alerts }));
  });
}

export async function saveFlashAlert(alertData: Partial<FlashAlert>): Promise<FlashAlert> {
  const id = alertData.id || `alert-${Date.now()}`;
  const newAlert = {
    ...alertData,
    id,
    createdAt: alertData.createdAt || Date.now()
  } as FlashAlert;

  if (newAlert.isActive) {
    // Optionally deactivate others
    const alerts = await fetchFlashAlerts();
    for (const a of alerts) {
      if (a.id !== id && a.isActive) {
        await updateDoc(doc(db, COLLECTIONS.FLASH_ALERTS, a.id), { isActive: false });
      }
    }
  }

  await setDoc(doc(db, COLLECTIONS.FLASH_ALERTS, id), newAlert);
  
  addActivityLog({
    type: 'alert_broadcast',
    title: 'ফ্ল্যাশ নোটিশ আপডেট',
    description: `"${newAlert.title}" ফ্ল্যাশ নোটিশ সংরক্ষিত হয়েছে।`,
    actor: 'অ্যাডমিন'
  });

  return newAlert;
}

export async function toggleFlashAlertActive(id: string, currentStatus?: boolean): Promise<boolean> {
  let newStatus: boolean;
  if (currentStatus !== undefined) {
    newStatus = !currentStatus;
  } else {
    const alert = cachedFlashAlerts.find(a => a.id === id);
    newStatus = alert ? !alert.isActive : true;
  }
  
  if (newStatus) {
    const alerts = await fetchFlashAlerts();
    for (const a of alerts) {
      if (a.id !== id && a.isActive) {
        await updateDoc(doc(db, COLLECTIONS.FLASH_ALERTS, a.id), { isActive: false });
      }
    }
  }

  await updateDoc(doc(db, COLLECTIONS.FLASH_ALERTS, id), { isActive: newStatus });
  return newStatus;
}

export async function deleteFlashAlert(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.FLASH_ALERTS, id));
}

// -------------------------------------------------------------
// 2. POST MODERATION & APPROVAL QUEUE
// -------------------------------------------------------------
export function getAutoApproveSetting(): boolean {
  try {
    const val = localStorage.getItem(AUTO_APPROVE_KEY);
    return val === 'true'; 
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
    isVerified: true,
    approvedAt: Date.now()
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
export async function getManagedDoctors(): Promise<Doctor[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.DOCTORS));
    const doctors: Doctor[] = [];
    snap.forEach(d => doctors.push({ id: d.id, ...d.data() } as Doctor));
    
    if (doctors.length === 0) {
      // Seed initial data
      for (const docItem of DOCTORS_LIST) {
        await setDoc(doc(db, COLLECTIONS.DOCTORS, docItem.id), docItem);
        doctors.push(docItem);
      }
    }
    return doctors;
  } catch {
    return DOCTORS_LIST;
  }
}

export function getDoctors(): Doctor[] {
  return cachedDoctors.length > 0 ? cachedDoctors : DOCTORS_LIST;
}

export function subscribeToDoctors(callback: (doctors: Doctor[]) => void) {
  return onSnapshot(collection(db, COLLECTIONS.DOCTORS), (snap) => {
    const doctors: Doctor[] = [];
    snap.forEach(d => doctors.push({ id: d.id, ...d.data() } as Doctor));
    cachedDoctors = doctors;
    callback(doctors);
  });
}

export async function saveDoctor(doctorData: Partial<Doctor>): Promise<Doctor> {
  const id = doctorData.id || `doc-${Date.now()}`;
  const updatedDoctor = {
    ...doctorData,
    id,
    isVerified: doctorData.isVerified ?? true
  } as Doctor;

  await setDoc(doc(db, COLLECTIONS.DOCTORS, id), updatedDoctor);

  addActivityLog({
    type: 'doctor_updated',
    title: 'ডাক্তার প্রোফাইল আপডেট',
    description: `"${updatedDoctor.name}" এর তথ্য সফলভাবে সংরক্ষণ করা হয়েছে।`,
    actor: 'অ্যাডমিন'
  });

  return updatedDoctor;
}

export async function deleteDoctor(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.DOCTORS, id));
}

export async function getManagedHelplines(): Promise<EmergencyHelpline[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.HELPLINES));
    const helplines: EmergencyHelpline[] = [];
    snap.forEach(d => helplines.push({ id: d.id, ...d.data() } as EmergencyHelpline));
    
    if (helplines.length === 0) {
      for (const item of EMERGENCY_HELPLINES) {
        await setDoc(doc(db, COLLECTIONS.HELPLINES, item.id), item);
        helplines.push(item);
      }
    }
    return helplines;
  } catch {
    return EMERGENCY_HELPLINES;
  }
}

export function getHelplines(): EmergencyHelpline[] {
  return cachedHelplines.length > 0 ? cachedHelplines : EMERGENCY_HELPLINES;
}

export function subscribeToHelplines(callback: (helplines: EmergencyHelpline[]) => void) {
  return onSnapshot(collection(db, COLLECTIONS.HELPLINES), (snap) => {
    const helplines: EmergencyHelpline[] = [];
    snap.forEach(d => helplines.push({ id: d.id, ...d.data() } as EmergencyHelpline));
    cachedHelplines = helplines;
    callback(helplines);
  });
}

export async function saveHelpline(helplineData: Partial<EmergencyHelpline>): Promise<EmergencyHelpline> {
  const id = helplineData.id || `em-${Date.now()}`;
  const updatedHelpline = {
    ...helplineData,
    id
  } as EmergencyHelpline;

  await setDoc(doc(db, COLLECTIONS.HELPLINES, id), updatedHelpline);

  addActivityLog({
    type: 'helpline_updated',
    title: 'হেল্পলাইন আপডেট',
    description: `"${updatedHelpline.title}" হেল্পলাইন নম্বর সংরক্ষিত হয়েছে।`,
    actor: 'অ্যাডমিন'
  });

  return updatedHelpline;
}

export async function deleteHelpline(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.HELPLINES, id));
}

// -------------------------------------------------------------
// 4. GRIEVANCE & CITIZEN REPORTS DESK
// -------------------------------------------------------------
export async function getGrievanceReports(): Promise<GrievanceReport[]> {
  try {
    const q = query(collection(db, COLLECTIONS.GRIEVANCE_REPORTS), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const reports: GrievanceReport[] = [];
    snap.forEach(d => reports.push({ id: d.id, ...d.data() } as GrievanceReport));
    return reports;
  } catch {
    return [];
  }
}

export function getGrievances(): GrievanceReport[] {
  return cachedGrievances;
}

export function subscribeToGrievances(callback: (reports: GrievanceReport[]) => void) {
  const q = query(collection(db, COLLECTIONS.GRIEVANCE_REPORTS), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const reports: GrievanceReport[] = [];
    snap.forEach(d => reports.push({ id: d.id, ...d.data() } as GrievanceReport));
    cachedGrievances = reports;
    callback(reports);
  });
}

export async function createGrievanceReport(report: Omit<GrievanceReport, 'id' | 'createdAt' | 'status'>): Promise<GrievanceReport> {
  const id = `rep-${Date.now()}`;
  const newReport: GrievanceReport = {
    ...report,
    id,
    status: 'pending',
    createdAt: Date.now()
  };
  await setDoc(doc(db, COLLECTIONS.GRIEVANCE_REPORTS, id), newReport);
  return newReport;
}

export async function updateGrievanceStatus(
  id: string, 
  status: GrievanceReport['status'], 
  adminNotes?: string
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.GRIEVANCE_REPORTS, id), {
    status,
    adminNotes: adminNotes ?? null,
    updatedAt: Date.now()
  });

  addActivityLog({
    type: 'report_status_changed',
    title: 'নাগরিক অভিযোগ আপডেট',
    description: `অভিযোগ আইডি #${id} এর স্ট্যাটাস পরিবর্তিত হয়েছে (${status})।`,
    actor: 'অ্যাডমিন'
  });
}

export async function deleteGrievanceReport(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.GRIEVANCE_REPORTS, id));
}

// -------------------------------------------------------------
// 5. BLOOD DONORS & EMERGENCY BLOOD ALERT DESK
// -------------------------------------------------------------
export async function getManagedBloodDonors(): Promise<BloodDonor[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.BLOOD_DONORS));
    const donors: BloodDonor[] = [];
    snap.forEach(d => donors.push({ id: d.id, ...d.data() } as BloodDonor));
    
    if (donors.length === 0) {
      for (const d of BLOOD_DONORS) {
        await setDoc(doc(db, COLLECTIONS.BLOOD_DONORS, d.id), d);
        donors.push(d);
      }
    }
    return donors;
  } catch {
    return BLOOD_DONORS;
  }
}

export function getBloodDonors(): BloodDonor[] {
  return cachedBloodDonors.length > 0 ? cachedBloodDonors : BLOOD_DONORS;
}

export function subscribeToBloodDonors(callback: (donors: BloodDonor[]) => void) {
  return onSnapshot(collection(db, COLLECTIONS.BLOOD_DONORS), (snap) => {
    const donors: BloodDonor[] = [];
    snap.forEach(d => donors.push({ id: d.id, ...d.data() } as BloodDonor));
    cachedBloodDonors = donors;
    callback(donors);
  });
}

export async function saveBloodDonor(donorData: Partial<BloodDonor>): Promise<BloodDonor> {
  const id = donorData.id || `blood-${Date.now()}`;
  const updatedDonor = {
    ...donorData,
    id,
    isAvailable: donorData.isAvailable ?? true,
    totalDonations: donorData.totalDonations || 0
  } as BloodDonor;

  await setDoc(doc(db, COLLECTIONS.BLOOD_DONORS, id), updatedDonor);
  return updatedDonor;
}

export async function toggleBloodDonorAvailability(id: string, currentStatus?: boolean): Promise<boolean> {
  let newStatus: boolean;
  if (currentStatus !== undefined) {
    newStatus = !currentStatus;
  } else {
    const donor = cachedBloodDonors.find(d => d.id === id);
    newStatus = donor ? !donor.isAvailable : false;
  }
  await updateDoc(doc(db, COLLECTIONS.BLOOD_DONORS, id), { isAvailable: newStatus });
  return newStatus;
}

export async function deleteBloodDonor(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.BLOOD_DONORS, id));
}

export async function getBloodEmergencyAlerts(): Promise<BloodEmergencyAlert[]> {
  try {
    const q = query(collection(db, COLLECTIONS.BLOOD_ALERTS), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const alerts: BloodEmergencyAlert[] = [];
    snap.forEach(d => alerts.push({ id: d.id, ...d.data() } as BloodEmergencyAlert));
    return alerts;
  } catch {
    return [];
  }
}

export function getBloodAlerts(): BloodEmergencyAlert[] {
  return cachedBloodAlerts;
}

export function subscribeToBloodAlerts(callback: (alerts: BloodEmergencyAlert[]) => void) {
  const q = query(collection(db, COLLECTIONS.BLOOD_ALERTS), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const alerts: BloodEmergencyAlert[] = [];
    snap.forEach(d => alerts.push({ id: d.id, ...d.data() } as BloodEmergencyAlert));
    cachedBloodAlerts = alerts;
    callback(alerts);
    window.dispatchEvent(new CustomEvent('kushtia-blood-updated', { detail: alerts }));
  });
}

export async function createBloodEmergencyAlert(data: Omit<BloodEmergencyAlert, 'id' | 'createdAt'>): Promise<BloodEmergencyAlert> {
  const id = `blood-alert-${Date.now()}`;
  const newAlert: BloodEmergencyAlert = {
    ...data,
    id,
    createdAt: Date.now()
  };
  await setDoc(doc(db, COLLECTIONS.BLOOD_ALERTS, id), newAlert);

  addActivityLog({
    type: 'blood_alert_created',
    title: 'জরুরি রক্তের ডাক',
    description: `${data.patientName} এর জন্য ${data.bloodGroup} রক্তের জরুরি ডাক পোস্ট করা হয়েছে।`,
    actor: 'অ্যাডমিন'
  });

  return newAlert;
}

export async function toggleBloodAlertStatus(id: string, currentStatus?: boolean): Promise<boolean> {
  let newStatus: boolean;
  if (currentStatus !== undefined) {
    newStatus = !currentStatus;
  } else {
    const alert = cachedBloodAlerts.find(a => a.id === id);
    newStatus = alert ? !alert.isActive : false;
  }
  await updateDoc(doc(db, COLLECTIONS.BLOOD_ALERTS, id), { isActive: newStatus });
  return newStatus;
}

export async function deleteBloodEmergencyAlert(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.BLOOD_ALERTS, id));
}

// -------------------------------------------------------------
// TRANSPORT SCHEDULE MANAGEMENT SERVICE
// -------------------------------------------------------------
const TRANSPORT_STORAGE_KEY = 'kushtia_transport_schedules_cache_v2';
const TRANSPORT_DELETED_IDS_KEY = 'kushtia_transport_deleted_ids_v2';
const TRANSPORT_INITIALIZED_KEY = 'kushtia_transport_initialized_flag_v2';

const transportSubscribers = new Set<(transports: TransportSchedule[]) => void>();

export function getDeletedTransportIds(): Set<string> {
  try {
    const raw = localStorage.getItem(TRANSPORT_DELETED_IDS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return new Set(parsed);
    }
  } catch (e) {
    console.warn('Could not read deleted transport IDs', e);
  }
  return new Set();
}

export function recordDeletedTransportId(id: string) {
  try {
    const set = getDeletedTransportIds();
    set.add(id);
    localStorage.setItem(TRANSPORT_DELETED_IDS_KEY, JSON.stringify(Array.from(set)));
  } catch (e) {
    console.warn('Could not record deleted transport ID', e);
  }
}

export function recordDeletedTransportIds(ids: string[]) {
  try {
    const set = getDeletedTransportIds();
    ids.forEach(id => set.add(id));
    localStorage.setItem(TRANSPORT_DELETED_IDS_KEY, JSON.stringify(Array.from(set)));
  } catch (e) {
    console.warn('Could not record deleted transport IDs', e);
  }
}

export function isTransportInitialized(): boolean {
  try {
    return localStorage.getItem(TRANSPORT_INITIALIZED_KEY) === 'true';
  } catch (_) {
    return false;
  }
}

export function markTransportInitialized() {
  try {
    localStorage.setItem(TRANSPORT_INITIALIZED_KEY, 'true');
  } catch (_) {}
}

function notifyTransportSubscribers(data: TransportSchedule[]) {
  transportSubscribers.forEach(cb => {
    try { cb(data); } catch (_) {}
  });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('kushtia-transport-updated', { detail: data }));
  }
}

export async function getManagedTransport(): Promise<TransportSchedule[]> {
  const deletedIds = getDeletedTransportIds();
  const initialized = isTransportInitialized();

  try {
    const snap = await getDocs(collection(db, COLLECTIONS.TRANSPORT));
    const transports: TransportSchedule[] = [];
    snap.forEach(d => {
      if (!deletedIds.has(d.id)) {
        transports.push({ id: d.id, ...d.data() } as TransportSchedule);
      }
    });
    
    // Only seed ONCE if the system has NEVER been initialized and Firestore is completely empty
    // If the user has initialized or cleared all items, transports.length === 0 is INTENTIONAL and must STAY EMPTY!
    if (!initialized && transports.length === 0) {
      markTransportInitialized();
      const initialBatch = TRANSPORT_SCHEDULES.filter(t => !deletedIds.has(t.id));
      for (const t of initialBatch) {
        setDoc(doc(db, COLLECTIONS.TRANSPORT, t.id), t).catch(err => {
          console.warn('Initial transport seed doc write warning:', err);
        });
        transports.push(t);
      }
    } else {
      markTransportInitialized();
    }

    cachedTransport = transports;
    try {
      localStorage.setItem(TRANSPORT_STORAGE_KEY, JSON.stringify(transports));
    } catch (_) {}

    return transports;
  } catch (e) {
    console.warn('Network error reading transport schedules, using local cache:', e);
    // Return filtered local in-memory cache, never raw default data that resurrects deleted items!
    return cachedTransport.filter(t => !deletedIds.has(t.id));
  }
}

export function subscribeToTransport(callback: (transports: TransportSchedule[]) => void) {
  const deletedIds = getDeletedTransportIds();
  // 1. Immediately emit current cached data (0ms instant render)
  const current = cachedTransport.filter(t => !deletedIds.has(t.id));
  callback(current);

  // 2. Add to active in-memory subscriber set
  transportSubscribers.add(callback);

  // 3. Listen to Firestore snapshot in real time
  const unsub = onSnapshot(collection(db, COLLECTIONS.TRANSPORT), (snap) => {
    const activeDeleted = getDeletedTransportIds();
    const transports: TransportSchedule[] = [];
    snap.forEach(d => {
      if (!activeDeleted.has(d.id)) {
        transports.push({ id: d.id, ...d.data() } as TransportSchedule);
      }
    });

    const initialized = isTransportInitialized();
    if (!initialized && transports.length === 0) {
      markTransportInitialized();
      for (const t of TRANSPORT_SCHEDULES) {
        if (!activeDeleted.has(t.id)) {
          setDoc(doc(db, COLLECTIONS.TRANSPORT, t.id), t).catch(() => {});
          transports.push(t);
        }
      }
    } else {
      markTransportInitialized();
    }

    cachedTransport = transports;
    try {
      localStorage.setItem(TRANSPORT_STORAGE_KEY, JSON.stringify(transports));
    } catch (_) {}

    notifyTransportSubscribers(transports);
  }, (err) => {
    console.warn('Firestore transport subscription network fallback:', err);
    callback(cachedTransport.filter(t => !getDeletedTransportIds().has(t.id)));
  });

  return () => {
    transportSubscribers.delete(callback);
    unsub();
  };
}

export async function saveTransport(transData: Partial<TransportSchedule>): Promise<TransportSchedule> {
  const id = transData.id || `tr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const updated = {
    ...transData,
    id
  } as TransportSchedule;

  markTransportInitialized();

  // 1. Remove from deleted IDs set if it was previously deleted
  try {
    const deleted = getDeletedTransportIds();
    if (deleted.has(id)) {
      deleted.delete(id);
      localStorage.setItem(TRANSPORT_DELETED_IDS_KEY, JSON.stringify(Array.from(deleted)));
    }
  } catch (_) {}

  // 2. Optimistically update in-memory cache and localStorage IMMEDIATELY (0ms)
  const existingIdx = cachedTransport.findIndex(t => t.id === id);
  if (existingIdx >= 0) {
    cachedTransport = [
      ...cachedTransport.slice(0, existingIdx),
      updated,
      ...cachedTransport.slice(existingIdx + 1)
    ];
  } else {
    cachedTransport = [updated, ...cachedTransport];
  }

  try {
    localStorage.setItem(TRANSPORT_STORAGE_KEY, JSON.stringify(cachedTransport));
  } catch (_) {}

  // 3. Immediately notify all UI components and dispatch global custom event
  notifyTransportSubscribers(cachedTransport);

  // 4. Save to remote Firestore
  try {
    await setDoc(doc(db, COLLECTIONS.TRANSPORT, id), updated);
  } catch (err) {
    console.warn('Could not sync transport to Firestore (local save active):', err);
  }

  addActivityLog({
    type: 'transport_updated',
    title: 'যাতায়াত শিডিউল আপডেট',
    description: `${updated.name} (${updated.type}) সফলভাবে সংরক্ষণ করা হয়েছে।`,
    actor: 'অ্যাডমিন'
  });

  return updated;
}

export async function deleteTransport(id: string): Promise<void> {
  markTransportInitialized();

  // 1. Permanently register deleted ID so it NEVER resurrects
  recordDeletedTransportId(id);

  // 2. Optimistically remove from in-memory cache and localStorage IMMEDIATELY (0ms)
  cachedTransport = cachedTransport.filter(t => t.id !== id);
  try {
    localStorage.setItem(TRANSPORT_STORAGE_KEY, JSON.stringify(cachedTransport));
  } catch (_) {}

  // 3. Immediately notify all UI components and dispatch global custom event
  notifyTransportSubscribers(cachedTransport);

  // 4. Delete from remote Firestore
  try {
    await deleteDoc(doc(db, COLLECTIONS.TRANSPORT, id));
  } catch (e) {
    console.warn('Could not delete from Firestore (local removal complete):', e);
  }

  addActivityLog({
    type: 'transport_updated',
    title: 'যাতায়াত শিডিউল ডিলিট',
    description: `শিডিউল আইডি: ${id} সফলভাবে মুছে ফেলা হয়েছে।`,
    actor: 'অ্যাডমিন'
  });
}

export async function deleteAllTransportsBatch(): Promise<void> {
  markTransportInitialized();
  const allIds = cachedTransport.map(t => t.id);
  recordDeletedTransportIds(allIds);

  cachedTransport = [];
  try {
    localStorage.setItem(TRANSPORT_STORAGE_KEY, JSON.stringify([]));
  } catch (_) {}

  notifyTransportSubscribers([]);

  // Delete from remote Firestore
  for (const id of allIds) {
    deleteDoc(doc(db, COLLECTIONS.TRANSPORT, id)).catch(() => {});
  }

  addActivityLog({
    type: 'transport_updated',
    title: 'সকল যাতায়াত শিডিউল ডিলিট',
    description: 'যাতায়াত ও সময়সূচীর সকল রেকর্ড এডমিন প্যানেল থেকে মুছে ফেলা হয়েছে।',
    actor: 'অ্যাডমিন'
  });
}

export async function restoreDefaultTransports(): Promise<TransportSchedule[]> {
  try {
    localStorage.removeItem(TRANSPORT_DELETED_IDS_KEY);
    localStorage.removeItem(TRANSPORT_STORAGE_KEY);
  } catch (_) {}
  markTransportInitialized();

  cachedTransport = [...TRANSPORT_SCHEDULES];
  try {
    localStorage.setItem(TRANSPORT_STORAGE_KEY, JSON.stringify(cachedTransport));
  } catch (_) {}

  notifyTransportSubscribers(cachedTransport);

  for (const t of TRANSPORT_SCHEDULES) {
    setDoc(doc(db, COLLECTIONS.TRANSPORT, t.id), t).catch(() => {});
  }

  addActivityLog({
    type: 'transport_updated',
    title: 'ডিফল্ট যাতায়াত শিডিউল রিস্টোর',
    description: 'কুষ্টিয়া যাতায়াত ও টিকেটিং ডিফল্ট শিডিউলসমূহ সফলভাবে রিস্টোর করা হয়েছে।',
    actor: 'অ্যাডমিন'
  });

  return cachedTransport;
}

// -------------------------------------------------------------
// 6. CSV & SPREADSHEET EXPORT ENGINE
// -------------------------------------------------------------
export function downloadCSV(filename: string, rows: (string | number)[][]): void {
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
  downloadCSV('kushtia_connect_posts', [headers, ...rows]);
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
  downloadCSV('kushtia_blood_donors', [headers, ...rows]);
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
  downloadCSV('kushtia_doctors_directory', [headers, ...rows]);
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
  downloadCSV('kushtia_citizen_reports', [headers, ...rows]);
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
  downloadCSV('kushtia_registered_citizens', [headers, ...rows]);
}

export function playSirenTone() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
    if (!AudioContextClass) return;
    
    const audioCtx = new AudioContextClass();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    const now = audioCtx.currentTime;
    
    // Create a siren effect (whoop whoop)
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.5);
    osc.frequency.exponentialRampToValueAtTime(440, now + 1.0);
    osc.frequency.exponentialRampToValueAtTime(880, now + 1.5);
    osc.frequency.exponentialRampToValueAtTime(440, now + 2.0);
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 2.4);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(now + 2.5);
  } catch (e) {
    console.warn('Audio siren failed:', e);
  }
}
