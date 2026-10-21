export type CategoryType = 
  | 'home' | 'post-detail' | 'house-rent' | 'buy-sell' | 'doctor' | 'blood' | 'blood-request' | 'transport' | 'services' 
  | 'emergency' | 'crime-reporter' | 'create-post' | 'categories' | 'profile' | 'developer' | 'notifications' 
  | 'notification-settings' | 'search' | 'saved-posts' | 'help-support' | 'terms-privacy' | 'sponsored-details' | 'mason' 
  | 'mobile-maker' | 'electrician' | 'plumber' | 'ac-mechanic' | 'driver' | 'tutor' | 'vet' | 'food' | 'jobs' 
  | 'lost-found' | 'legal' | 'events' | 'volunteers' | 'citizen-fund' | 'login' | 'register' | 'share-app' | 'tourism' 
  | 'place-detail' | 'upazila-detail' | 'admin-panel' | 'add-balance'
  | 'tourist-spot' | 'bus-train' | 'hospital' | 'local-news' | 'ambulance' | 'diagnostic' | 'pharmacy' | 'mother-child-health' 
  | 'nursing' | 'counseling' | 'ngo' | 'volunteer' | 'govt-office' | 'birth-death' | 'nid-voter' | 'land-office' | 'municipality' 
  | 'passport-visa' | 'police' | 'fire-service' | 'business-directory' | 'business-ad' | 'bank-atm' | 'mobile-banking' 
  | 'courier' | 'computer-print' | 'freelancing' | 'car-repair' | 'school-college' | 'education-result' | 'car-rental' 
  | 'agriculture' | 'fisheries' | 'hotel' | 'grocery' | 'vegetables' | 'beauty-parlor' | 'laundry' | 'furniture' 
  | 'hardware' | 'internet' | 'utility' | 'eye-care' | 'dental-care' | 'fitness' | 'sports'
  | 'union-parishad' | 'cng-auto';


export interface UserProfile {
  uid: string;
  citizenId?: string;
  displayName: string;
  email?: string | null;
  photoURL?: string | null;
  isVerified?: boolean;
  phone?: string;
  gender?: string;
  ward?: string;
  address?: string;
  role?: 'citizen' | 'admin' | 'moderator';
  status?: 'active' | 'blocked' | 'temporary_ban';
  isFlagged?: boolean;
  flagReason?: string;
  flagCount?: number;
  banExpiresAt?: number;
  banReason?: string;
  bannedAt?: number;
  joinedAt?: number;
  lastActiveAt?: number;
}

export interface DailyTrendItem {
  dateKey: string;
  dayLabel: string;
  fullDate: string;
  activeUsers: number;
  registrations: number;
}

export interface UserMetricsSummary {
  totalUsers: number;
  totalActiveUsers: number;
  totalBlockedUsers: number;
  totalTemporaryBannedUsers: number;
  totalVerifiedUsers: number;
  totalFlaggedUsers: number;
  activeTodayCount: number;
  registeredTodayCount: number;
  registeredPast7DaysCount: number;
  registeredPast30DaysCount: number;
  rolesBreakdown: {
    citizen: number;
    moderator: number;
    admin: number;
  };
  dailyTrends?: DailyTrendItem[];
  updatedAt: number;
  lastUpdatedFormatted: string;
  source: 'cloud_function_trigger' | 'background_sync_listener' | 'local_cache';
}

export interface ServiceReview {
  id: string;
  targetId: string;
  targetType?: 'technician' | 'post';
  userId: string;
  userName: string;
  userPhoto?: string;
  userEmail?: string;
  rating: number; // 1 to 5
  comment?: string;
  createdAt: number;
  updatedAt?: number;
}

export interface ReviewItem {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number; // 1-5
  comment: string;
  createdAt: number;
}

export interface PostItem {
  id: string;
  category: CategoryType;
  title: string;
  description: string;
  price?: string;
  location: string;
  mapCoordinates?: { lat: number; lng: number };
  subcategory?: string;
  contactPhone: string;
  whatsapp?: string;
  facebook?: string;
  imageUrl?: string;
  authorName: string;
  authorPhone?: string;
  authorPhoto?: string;
  authorId?: string;
  isAnonymous?: boolean;
  createdAt: number;
  isVerified?: boolean;
  isSponsored?: boolean;
  sponsoredUntil?: number;
  status?: 'pending' | 'approved' | 'rejected' | 'draft';
  approvedAt?: number;
  approvedBy?: string;
  rejectionReason?: string;
  featured?: boolean;
  expiryDate?: number;
  isDraft?: boolean;
  likes?: number;
  views?: number;
  shares?: number;
  viewsLast24h?: number;
  lastViewUpdate?: number;
  rating?: number;
  reviewsCount?: number;
  reviews?: ServiceReview[];
  details?: {
    rooms?: string;
    bathrooms?: string;
    floor?: string;
    condition?: 'ব্যবহৃত' | 'নতুন' | 'রিফার্বিশড' | 'অরিজিনাল কন্ডিশন' | string;
    speciality?: string;
    degree?: string;
    chamber?: string;
    chamberTime?: string;
    bloodGroup?: string;
    lastDonated?: string;
    serviceType?: string;
    experienceYears?: string;
    experience?: string;
    driverLicense?: string;
    tutorSubject?: string;
    transportType?: 'বাস' | 'ট্রেন' | 'বিমান' | 'প্রাইভেট কার' | string;
    departure?: string;
    destination?: string;
    scheduleTime?: string;
    trainCode?: string;
    offDay?: string;
    crimeCategory?: 'চুরি/ডাকাতি' | 'মাদক' | 'ইভটিজিং' | 'প্রতারণা' | 'অন্যান্য' | 'মাদক ব্যবসা' | 'চাঁদাবাজি' | string;
    evidenceType?: string;
    jobType?: 'ফুল-টাইম' | 'পার্ট-টাইম' | 'চুক্তিভিত্তিক' | 'ইন্টার্নশিপ' | string;
    jobSalary?: string;
    jobDeadline?: string;
    companyName?: string;
    lostFoundType?: 'lost' | 'found';
    lostDate?: string;
    itemType?: string;
    foodType?: string;
    cuisine?: string;
    deliveryAvailable?: boolean;
    menuHighlights?: string;
    lawyerCourt?: string;
    lawyerSpeciality?: string;
    decoratorService?: string;
    eventCapacity?: string;
    bloodBagsNeeded?: string;
    hospitalName?: string;
    patientProblem?: string;
    bloodUrgency?: 'জরুরী (১ ঘন্টার মধ্যে)' | 'আজকের মধ্যে' | 'আগামীকাল' | 'জরুরি (আজই)' | string;
    menuItems?: { name: string; price: string; ingredients?: string }[];
    [key: string]: any;
  };
}

export interface PostDraftItem {
  id: string;
  category: CategoryType;
  title: string;
  description: string;
  price?: string;
  location: string;
  customLocation?: string;
  subcategory?: string;
  contactPhone?: string;
  whatsapp?: string;
  isAnonymous?: boolean;
  imagePreview?: string | null;
  details?: Record<string, any>;
  savedAt: number;
  updatedAt: number;
  authorId?: string;
  authorName?: string;
  isAutoSaved?: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  speciality: string;
  degree: string;
  hospital: string;
  chamber: string;
  visitingHours: string;
  serialNumber: string;
  fee: string;
  availableDays: string;
  isVerified: boolean;
}

export interface BloodDonor {
  id: string;
  name: string;
  bloodGroup: string;
  location: string;
  phone: string;
  lastDonationDate?: string;
  isAvailable: boolean;
  totalDonations: number;
}

export interface TechnicianService {
  id: string;
  name: string;
  profession: string;
  skills: string[];
  area: string;
  phone: string;
  whatsapp?: string;
  facebook?: string;
  experience: string;
  rating: number;
  reviewsCount: number;
  availableNow: boolean;
  reviews?: ServiceReview[];
  authorId?: string;
  imageUrl?: string;
}

export interface TransportSchedule {
  id: string;
  type: 'বাস' | 'ট্রেন' | 'বিমান' | 'কার রেন্ট' | 'মাইক্রোবাস';
  name: string;
  code?: string;
  route: string;
  departureTime: string;
  arrivalTime: string;
  offDay: string;
  fareList: { class: string; fare: string }[];
  bookingPhone?: string;
}

export interface EmergencyHelpline {
  id: string;
  title: string;
  dept: string;
  number: string;
  alternateNumber?: string;
  address: string;
  availableHours: string;
  iconName: string;
}

export interface FundDonation {
  id: string;
  donorName: string;
  donorPhone: string;
  amount: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Cash';
  transactionId: string;
  isAnonymous: boolean;
  status: 'pending' | 'approved' | 'rejected';
  note?: string;
  createdAt: number;
  approvedAt?: number;
  approvedBy?: string;
}

export interface FundExpense {
  id: string;
  title: string;
  description: string;
  amount: number;
  date: string;
  category: 'মেডিকেল সাহায্য' | 'খাদ্য বিতরণ' | 'শিক্ষা সহায়তা' | 'শীতবস্ত্র' | 'জরুরি পুনর্বাসন' | 'অন্যান্য' | 'শীতবস্ত্র বিতরণ' | 'চিকিৎসা সহায়তা';
  receiptUrl?: string;
  spendingProofUrl?: string;
  location?: string;
  verifiedBy?: string;
  createdAt: number;
}

// Admin Panel specific interfaces
export type ThemeColorKey = 'pink' | 'emerald' | 'blue' | 'indigo' | 'rose' | 'amber' | 'teal' | 'purple';
export type ThemeColor = ThemeColorKey;

export interface AppThemeConfig {
  themeKey: ThemeColorKey;
  primaryColor: string;
  primaryHover: string;
  primaryLight: string;
  primaryGradient: string;
  accentBadge: string;
  appName: string;
  tagline: string;
  marqueeAnnouncement: string;
  isMarqueeActive: boolean;
  emergencyAlert: string;
  isEmergencyAlertActive: boolean;
  isMemberPostingAllowed?: boolean;
  disabledFeatures?: string[];
  cityName?: string;
  emergencyContacts?: {
    police?: string;
    fire?: string;
    hospital?: string;
    ambulance?: string;
    electricity?: string;
    bloodHelpline?: string;
  };
  policePhone?: string;
  fireServicePhone?: string;
  hospitalPhone?: string;
  ambulancePhone?: string;
  electricityPhone?: string;
  bloodHelplinePhone?: string;
  // Entry / Welcome Popup Modal configuration
  isWelcomePopupActive?: boolean;
  welcomePopupTitle?: string;
  welcomePopupMessage?: string;
  welcomePopupButtonText?: string;
  welcomePopupBadge?: string;
  welcomePopupActionText?: string;
  welcomePopupActionUrl?: string;
  // Support Helpline configuration
  supportPhone?: string;
  isSupportActive?: boolean;
  supportLabel?: string;
  isWhatsAppSupportActive?: boolean;
  supportFacebookUrl?: string;
  isFacebookSupportActive?: boolean;
  supportFacebookLabel?: string;
  adminProfilePic?: string;
  volunteerPopupActive: boolean;
  volunteerPopupMessage: string;
  volunteerContactNumber: string;
  showBalanceCard?: boolean;
  // Emergency Features
  isEmergencyNoticeActive?: boolean;
  emergencyNoticeTitle?: string;
  emergencyNoticeMessage?: string;
  isEmergencyBloodDonorActive?: boolean;
  emergencyBloodDonorMessage?: string;
  isPatientBloodRequestActive?: boolean;
  patientName?: string;
  patientBloodGroup?: string;
  patientAge?: string;
  patientContactNumber?: string;
  showDemoData?: boolean;
  homeBannerUrl?: string;
  autoApprove?: boolean;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  method: 'bKash' | 'Nagad';
  senderNumber: string;
  transactionId: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: number;
  reviewedAt?: number;
  reviewedBy?: string;
}

export interface FlashAlert {
  id: string;
  title: string;
  message: string;
  type: 'emergency' | 'warning' | 'info' | 'weather' | 'electricity';
  isActive: boolean;
  actionText?: string;
  actionLink?: string;
  severity?: 'critical' | 'warning' | 'info';
  withSiren?: boolean;
  instructions?: string;
  createdAt: number;
}

export interface GrievanceReport {
  id: string;
  title: string;
  category: 'drainage' | 'street-light' | 'waste' | 'crime' | 'corruption' | 'traffic' | 'other';
  description: string;
  location: string;
  reporterName: string;
  reporterPhone?: string;
  isAnonymous?: boolean;
  imageUrl?: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'dismissed';
  adminNotes?: string;
  createdAt: number;
  updatedAt?: number;
}

export interface BloodEmergencyAlert {
  id: string;
  patientName: string;
  bloodGroup: string;
  bagsNeeded: number;
  hospital: string;
  reason: string;
  urgency: 'জরুরি (১ ঘণ্টার মধ্যে)' | 'আজকের মধ্যে' | 'আগামীকাল';
  contactPhone: string;
  alternatePhone?: string;
  location: string;
  createdAt: number;
  isActive: boolean;
}

export interface ActivityLog {
  id: string;
  type: 
    | 'post_created' 
    | 'post_deleted' 
    | 'post_updated' 
    | 'post_approved'
    | 'post_rejected'
    | 'user_registered' 
    | 'user_status_changed' 
    | 'theme_updated' 
    | 'pin_changed' 
    | 'category_updated'
    | 'campaign_created'
    | 'campaign_updated'
    | 'campaign_deleted'
    | 'campaign_activated'
    | 'alert_broadcast'
    | 'doctor_updated'
    | 'helpline_updated'
    | 'report_status_changed'
    | 'blood_alert_created'
    | 'login_attempt'
    | 'data_exported';
  title: string;
  description: string;
  timestamp: number;
  actor: string;
}

export interface Volunteer {
  id: string;
  name: string;
  photoURL: string;
  whatsapp: string;
  address?: string;
  isVerified?: boolean;
  joinedAt: number;
}

export interface AdminStats {
  totalMembers: number;
  joinedToday: number;
  totalPosts: number;
  totalCategories: number;
  activeCitizens: number;
  pendingReports: number;
}
