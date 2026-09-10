import {
  HospitalDepartment,
  HospitalDoctor,
  HospitalAppointment,
  HospitalCrowdLevel,
} from '../types';

export interface HospitalProfile {
  id: string;
  name: string;
  type: string;
  district: string;
  crowdLevel: HospitalCrowdLevel;
  walkInWaitMinutes: number;
  totalDoctorsOnDuty: number;
  emergencyStatus: string;
}

export const MOCK_HOSPITALS: HospitalProfile[] = [
  {
    id: 'hosp-1',
    name: 'District Civil Hospital Anand',
    type: 'District Hospital (Govt)',
    district: 'Anand, Gujarat',
    crowdLevel: 'HIGH',
    walkInWaitMinutes: 95,
    totalDoctorsOnDuty: 28,
    emergencyStatus: '24x7 Trauma & Emergency Active',
  },
  {
    id: 'hosp-2',
    name: 'Community Health Centre (CHC) Karamsad',
    type: 'Community Health Centre',
    district: 'Karamsad, Gujarat',
    crowdLevel: 'MODERATE',
    walkInWaitMinutes: 40,
    totalDoctorsOnDuty: 12,
    emergencyStatus: 'Emergency OPD Open',
  },
  {
    id: 'hosp-3',
    name: 'Petlad Sub-District Hospital',
    type: 'Sub-District Hospital',
    district: 'Petlad, Anand',
    crowdLevel: 'LOW',
    walkInWaitMinutes: 15,
    totalDoctorsOnDuty: 16,
    emergencyStatus: '24x7 Ambulance Active',
  },
];

export const MOCK_DEPARTMENTS: HospitalDepartment[] = [
  {
    id: 'dept-gen',
    name: 'General Medicine OPD',
    icon: 'Stethoscope',
    description: 'Fever, diabetes, hypertension, seasonal infections & preventive health',
    roomFloor: 'Room 104, Ground Floor',
    activeDoctorsCount: 4,
    avgWaitMinutes: 85,
    crowdLevel: 'HIGH',
  },
  {
    id: 'dept-ortho',
    name: 'Orthopedics & Joint Clinic',
    icon: 'Bone',
    description: 'Fractures, joint pains, backache, arthritis & bone density check',
    roomFloor: 'Room 112, Ground Floor',
    activeDoctorsCount: 3,
    avgWaitMinutes: 75,
    crowdLevel: 'HIGH',
  },
  {
    id: 'dept-ped',
    name: 'Pediatrics & Child Health',
    icon: 'Baby',
    description: 'Child vaccinations, newborn growth, pediatric fever & nutrition',
    roomFloor: 'Room 108, Ground Floor',
    activeDoctorsCount: 3,
    avgWaitMinutes: 45,
    crowdLevel: 'MODERATE',
  },
  {
    id: 'dept-gyn',
    name: 'Obstetrics & Gynecology',
    icon: 'HeartHandshake',
    description: 'Antenatal checkups, safe motherhood, ultrasound & women wellness',
    roomFloor: 'Room 202, 1st Floor',
    activeDoctorsCount: 3,
    avgWaitMinutes: 50,
    crowdLevel: 'MODERATE',
  },
  {
    id: 'dept-cardio',
    name: 'Cardiology & Chest Clinic',
    icon: 'Activity',
    description: 'ECG, heart screening, post-stroke recovery & breathlessness evaluation',
    roomFloor: 'Room 214, 2nd Floor',
    activeDoctorsCount: 2,
    avgWaitMinutes: 90,
    crowdLevel: 'HIGH',
  },
  {
    id: 'dept-ent',
    name: 'ENT & Eye OPD',
    icon: 'Eye',
    description: 'Ear discharge, vision screening, cataract evaluation & tonsils',
    roomFloor: 'Room 118, 1st Floor',
    activeDoctorsCount: 2,
    avgWaitMinutes: 25,
    crowdLevel: 'LOW',
  },
];

export const MOCK_HOSPITAL_DOCTORS: HospitalDoctor[] = [
  {
    id: 'doc-vk-mehta',
    name: 'Dr. V. K. Mehta',
    departmentId: 'dept-gen',
    departmentName: 'General Medicine OPD',
    hospitalName: 'District Civil Hospital Anand',
    qualification: 'MBBS, MD (Senior Physician, 22 yrs exp)',
    experienceYears: 22,
    languages: ['Hindi', 'Gujarati', 'English'],
    roomNumber: 'Room 104',
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    morningSlots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
    afternoonSlots: ['02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'],
    isAvailableToday: true,
  },
  {
    id: 'doc-ananya-sharma',
    name: 'Dr. Ananya Sharma',
    departmentId: 'dept-gen',
    departmentName: 'General Medicine OPD',
    hospitalName: 'District Civil Hospital Anand',
    qualification: 'MBBS, MD (Family Medicine, AIIMS)',
    experienceYears: 11,
    languages: ['Hindi', 'English', 'Gujarati'],
    roomNumber: 'Room 105',
    rating: 4.85,
    avatar: 'https://images.unsplash.com/photo-1594824813591-965383562626?w=200&auto=format&fit=crop&q=80',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    morningSlots: ['09:15 AM', '09:45 AM', '10:15 AM', '10:45 AM', '11:15 AM', '11:45 AM'],
    afternoonSlots: ['02:15 PM', '02:45 PM', '03:15 PM', '03:45 PM', '04:15 PM'],
    isAvailableToday: true,
  },
  {
    id: 'doc-hitesh-shah',
    name: 'Dr. Hitesh Shah',
    departmentId: 'dept-ortho',
    departmentName: 'Orthopedics & Joint Clinic',
    hospitalName: 'District Civil Hospital Anand',
    qualification: 'MBBS, MS (Orthopedics, Joint Replacement)',
    experienceYears: 18,
    languages: ['Gujarati', 'Hindi', 'English'],
    roomNumber: 'Room 112',
    rating: 4.92,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80',
    availableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    morningSlots: ['09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
    afternoonSlots: ['02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'],
    isAvailableToday: true,
  },
  {
    id: 'doc-rajesh-patel',
    name: 'Dr. Rajesh Patel',
    departmentId: 'dept-ped',
    departmentName: 'Pediatrics & Child Health',
    hospitalName: 'District Civil Hospital Anand',
    qualification: 'MBBS, DCH, MD (Pediatrics)',
    experienceYears: 13,
    languages: ['Gujarati', 'Hindi', 'English'],
    roomNumber: 'Room 108',
    rating: 4.88,
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&auto=format&fit=crop&q=80',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    morningSlots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'],
    afternoonSlots: ['02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'],
    isAvailableToday: true,
  },
  {
    id: 'doc-sunita-deshmukh',
    name: 'Dr. Sunita Deshmukh',
    departmentId: 'dept-gyn',
    departmentName: 'Obstetrics & Gynecology',
    hospitalName: 'District Civil Hospital Anand',
    qualification: 'MBBS, DGO, DNB (Maternal Fetal Health)',
    experienceYears: 15,
    languages: ['Hindi', 'Marathi', 'English'],
    roomNumber: 'Room 202',
    rating: 4.95,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    morningSlots: ['09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
    afternoonSlots: ['02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'],
    isAvailableToday: true,
  },
  {
    id: 'doc-arvind-rao',
    name: 'Dr. Arvind Rao',
    departmentId: 'dept-cardio',
    departmentName: 'Cardiology & Chest Clinic',
    hospitalName: 'District Civil Hospital Anand',
    qualification: 'MBBS, MD, DM (Cardiology, AIIMS)',
    experienceYears: 19,
    languages: ['Hindi', 'Telugu', 'English'],
    roomNumber: 'Room 214',
    rating: 4.93,
    avatar: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&auto=format&fit=crop&q=80',
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    morningSlots: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
    afternoonSlots: ['02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'],
    isAvailableToday: true,
  },
  {
    id: 'doc-priya-nambiar',
    name: 'Dr. Priya Nambiar',
    departmentId: 'dept-ent',
    departmentName: 'ENT & Eye OPD',
    hospitalName: 'District Civil Hospital Anand',
    qualification: 'MBBS, MS (Ophthalmology & ENT)',
    experienceYears: 9,
    languages: ['Hindi', 'Malayalam', 'English'],
    roomNumber: 'Room 118',
    rating: 4.82,
    avatar: 'https://images.unsplash.com/photo-1594824813591-965383562626?w=200&auto=format&fit=crop&q=80',
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    morningSlots: ['09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'],
    afternoonSlots: ['02:00 PM', '02:30 PM', '03:00 PM'],
    isAvailableToday: true,
  },
];

// Calculate advance days from current date
export function getAdvanceDays(targetDateStr: string): number {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDateStr + 'T00:00:00');
    const diffMs = target.getTime() - today.getTime();
    return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
  } catch {
    return 0;
  }
}

// Generate future booking dates (Next 7 days)
export function getUpcomingBookingDates(): Array<{
  dateStr: string;
  dayName: string;
  formattedDate: string;
  advanceDays: number;
  isAdvancePrioritized: boolean; // >= 2 days in advance
  isToday: boolean;
  isTomorrow: boolean;
}> {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    dates.push({
      dateStr,
      dayName,
      formattedDate,
      advanceDays: i,
      isAdvancePrioritized: i >= 2,
      isToday: i === 0,
      isTomorrow: i === 1,
    });
  }

  return dates;
}

// Pre-seeded initial appointments for realistic demo
export function getInitialHospitalAppointments(): HospitalAppointment[] {
  const dates = getUpcomingBookingDates();
  const advanceDate = dates[2]?.dateStr || dates[1]?.dateStr || '2026-09-12';

  return [
    {
      id: 'APT-2026-8814',
      patientName: 'Rameshwar Sharma',
      patientAge: 64,
      patientGender: 'Male',
      patientPhone: '+91 98765 43210',
      hospitalName: 'District Civil Hospital Anand',
      department: 'General Medicine OPD',
      departmentId: 'dept-gen',
      doctorId: 'doc-vk-mehta',
      doctorName: 'Dr. V. K. Mehta',
      doctorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
      doctorRoom: 'Room 104 (Ground Floor)',
      date: advanceDate,
      timeSlot: '10:00 AM',
      estimatedQueueNumber: 4,
      isPriorityAdvance: true,
      bookedInAdvanceDays: 2,
      crowdStatusAtBooking: 'HIGH',
      status: 'CONFIRMED',
      createdAt: '2026-09-09',
      reasonForVisit: 'Monthly hypertension and diabetes routine follow-up',
    },
  ];
}
