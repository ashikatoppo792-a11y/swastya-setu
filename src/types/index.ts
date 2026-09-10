export type SupportedLanguage = 'en' | 'hi' | 'bn' | 'te' | 'ta' | 'mr';

export type NavTab =
  | 'telehealth'
  | 'appointments'
  | 'triage'
  | 'medicine'
  | 'blood'
  | 'records'
  | 'womens'
  | 'elder';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

export interface HealthcareCenter {
  id: string;
  name: string;
  type: 'PHC' | 'CHC' | 'SubCenter' | 'DistrictHospital' | 'AyushClinic';
  address: string;
  district: string;
  state: string;
  distanceKm: number;
  isEmergency24x7: boolean;
  ayushmanEmpaneled: boolean;
  totalBeds: number;
  availableBeds: number;
  phone: string;
  doctorsCount: number;
  latitude: number;
  longitude: number;
}

export interface TelehealthDoctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experienceYears: number;
  languages: string[];
  rating: number;
  fee: number;
  isOnline: boolean;
  nextSlot: string;
  avatar: string;
}

export interface TelehealthAppointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  patientName: string;
  patientAge: number;
  patientPhone: string;
  date: string;
  timeSlot: string;
  isLowBandwidth: boolean;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  meetLink: string;
}

export type HospitalCrowdLevel = 'LOW' | 'MODERATE' | 'HIGH';

export interface HospitalDepartment {
  id: string;
  name: string;
  icon: string;
  description: string;
  roomFloor: string;
  activeDoctorsCount: number;
  avgWaitMinutes: number;
  crowdLevel: HospitalCrowdLevel;
}

export interface HospitalDoctor {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string;
  hospitalName: string;
  qualification: string;
  experienceYears: number;
  languages: string[];
  roomNumber: string;
  rating: number;
  avatar: string;
  availableDays: string[];
  morningSlots: string[];
  afternoonSlots: string[];
  isAvailableToday: boolean;
}

export interface HospitalAppointment {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  hospitalName: string;
  department: string;
  departmentId: string;
  doctorId: string;
  doctorName: string;
  doctorAvatar: string;
  doctorRoom: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. '10:30 AM'
  estimatedQueueNumber: number;
  isPriorityAdvance: boolean; // True if booked 2+ days ahead
  bookedInAdvanceDays: number;
  crowdStatusAtBooking: HospitalCrowdLevel;
  status: 'CONFIRMED' | 'RESCHEDULED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  reasonForVisit?: string;
}

export type SeverityLevel = 'EMERGENCY' | 'URGENT' | 'TELECONSULT' | 'SELFCARE';

export interface SuggestedMedicine {
  id: string;
  name: string;
  genericName: string;
  brandExamples: string; // e.g. 'Dolo 650, Calpol 650'
  dosage: string; // e.g. '650 mg'
  form: 'Tablet' | 'Syrup' | 'Sachet' | 'Drops' | 'Gel / Ointment' | 'Inhaler';
  frequency: 'Once daily' | 'Twice daily' | 'Thrice daily' | 'As needed' | 'Every 6-8 hours';
  timings: ('Morning' | 'Afternoon' | 'Evening' | 'Bedtime')[];
  mealTiming: 'Before Food' | 'After Food' | 'With Food' | 'With Water';
  purpose: string;
  category: 'OTC' | 'PRESCRIPTION_ONLY' | 'FIRST_AID';
  safetyWarning: string;
  janAushadhiPrice?: string;
  isGovtFree?: boolean;
}

export interface TriageResult {
  id: string;
  query: string;
  detectedSymptoms: string[];
  severity: SeverityLevel;
  title: string;
  description: string;
  immediateAction: string;
  redFlags: string[];
  recommendedCare: string;
  homeRemedies?: string[];
  suggestedMedicines?: SuggestedMedicine[];
  printableSlipId: string;
  timestamp: string;
}

export interface MedicineReminder {
  id: string;
  name: string;
  dosage: string;
  frequency: 'Once daily' | 'Twice daily' | 'Thrice daily' | 'As needed';
  timings: ('Morning' | 'Afternoon' | 'Evening' | 'Bedtime')[];
  mealTiming: 'Before Food' | 'After Food' | 'With Food' | 'With Water';
  startDate: string;
  durationDays: number;
  totalPills: number;
  remainingPills: number;
  isTakenToday: { [timeSlot: string]: boolean };
  caregiverPhone?: string;
  colorTag: string;
  photoUrl?: string; // Photo of the pill strip, tablet, or bottle
  prescriptionPhotoUrl?: string; // Photo of the prescription slip it was parsed from
  specialInstructions?: string;
  detectedFromPrescription?: boolean;
}

export interface DetectedMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: 'Once daily' | 'Twice daily' | 'Thrice daily' | 'As needed';
  timings: ('Morning' | 'Afternoon' | 'Evening' | 'Bedtime')[];
  mealTiming: 'Before Food' | 'After Food' | 'With Food';
  durationDays: number;
  totalPills: number;
  confidence: number;
  notes?: string;
  photoUrl?: string;
  selected?: boolean;
}

export interface PrescriptionPreset {
  id: string;
  title: string;
  subtitle: string;
  doctorName: string;
  facility: string;
  date: string;
  imageUrl: string;
  detectedMeds: DetectedMedication[];
}

export interface BloodBankStock {
  id: string;
  bloodBankName: string;
  hospitalAffiliation: string;
  address: string;
  district: string;
  phone: string;
  distanceKm: number;
  isGovernment: boolean;
  stock: Record<BloodGroup, number>;
  lastUpdated: string;
}

export interface BloodDonor {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  age: number;
  gender: string;
  district: string;
  phone: string;
  lastDonated: string;
  isAvailable: boolean;
  distanceKm: number;
}

export interface EmergencyBloodRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  hospitalName: string;
  district: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MODERATE';
  contactPhone: string;
  createdAt: string;
  status: 'BROADCASTED' | 'DONOR_FOUND' | 'FULFILLED';
  donorsResponded: number;
}

export interface BloodDonationCamp {
  id: string;
  title: string;
  organizer: string;
  hospitalPartner: string;
  venue: string;
  address: string;
  district: string;
  state: string;
  date: string;
  startTime: string;
  endTime: string;
  targetUnits: number;
  registeredDonorsCount: number;
  timeSlots: string[];
  perks: string[];
  contactPhone: string;
  urgentBloodGroups?: BloodGroup[];
  bannerGradient?: string;
  status: 'UPCOMING' | 'TODAY' | 'COMPLETED';
}

export interface CampRegistration {
  id: string;
  campId: string;
  campTitle: string;
  campVenue: string;
  campDate: string;
  organizer: string;
  donorName: string;
  bloodGroup: BloodGroup;
  donorAge: number;
  donorGender: string;
  donorPhone: string;
  timeSlot: string;
  passCode: string;
  registeredAt: string;
  status: 'CONFIRMED' | 'ATTENDED' | 'CANCELLED';
  healthChecklistAgreed: boolean;
}

export type RecordCategory = 'Prescription' | 'LabReport' | 'Vaccination' | 'DischargeSummary' | 'Imaging';

export interface HealthRecord {
  id: string;
  title: string;
  category: RecordCategory;
  doctorOrLab: string;
  date: string;
  notes: string;
  vitalsSnapshot?: {
    bp?: string;
    pulse?: string;
    sugar?: string;
    weight?: string;
  };
}

export interface UserProfile {
  abhaId: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: BloodGroup;
  emergencyContact: string;
  caregiverName: string;
  caregiverPhone: string;
  allergies: string[];
  chronicConditions: string[];
}

export interface WomensHealthTip {
  id: string;
  category: 'menstrual' | 'pregnancy' | 'postpartum' | 'mental_health' | 'nutrition';
  title: string;
  summary: string;
  content: string;
  stageBadge: string;
}

export interface FemaleSpecialist {
  id: string;
  name: string;
  role: 'Gynecologist' | 'ASHA Worker' | 'ANM Nurse' | 'Pediatrician';
  facilityName: string;
  experience: string;
  phone: string;
  languages: string[];
  isAvailable: boolean;
}

export interface ElderDailyLog {
  id: string;
  date: string;
  mood: 'great' | 'good' | 'neutral' | 'unwell';
  bpSystolic?: number;
  bpDiastolic?: number;
  sugarLevel?: number;
  waterGlasses: number;
  walkMinutes: number;
  notes: string;
}

export interface CaregiverAlert {
  id: string;
  timestamp: string;
  type: 'SOS' | 'MISSED_MEDICINE' | 'HIGH_BP' | 'APPOINTMENT';
  title: string;
  message: string;
  isRead: boolean;
}

export interface OpdDepartment {
  id: string;
  hospitalName: string;
  departmentName: string;
  doctorName: string;
  roomNumber: string;
  currentToken: number;
  totalIssued: number;
  avgMinutesPerPatient: number;
  status: 'NORMAL' | 'BUSY' | 'OVERCROWDED';
}

export interface UserQueueToken {
  id: string;
  departmentId: string;
  hospitalName: string;
  departmentName: string;
  doctorName: string;
  roomNumber: string;
  tokenNumber: number;
  patientName: string;
  patientPhone: string;
  currentServingToken: number;
  estimatedWaitMinutes: number;
  issuedAt: string;
  status: 'WAITING' | 'SERVING' | 'DONE';
}
