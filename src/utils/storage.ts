import {
  UserProfile,
  HealthRecord,
  MedicineReminder,
  UserQueueToken,
  ElderDailyLog,
  EmergencyBloodRequest,
  TelehealthAppointment,
  HospitalAppointment,
  HospitalCrowdLevel,
  BloodDonationCamp,
  CampRegistration,
} from '../types';
import {
  initialUserProfile,
  initialRecords,
  initialReminders,
  initialActiveToken,
  mockBloodCamps,
  initialCampRegistrations,
} from '../data/mockData';
import { getInitialHospitalAppointments } from '../data/appointmentData';

const KEYS = {
  PROFILE: 'swastya_profile',
  RECORDS: 'swastya_records',
  REMINDERS: 'swastya_reminders',
  ACTIVE_TOKEN: 'swastya_active_token',
  ELDER_LOGS: 'swastya_elder_logs',
  BLOOD_REQUESTS: 'swastya_blood_requests',
  BLOOD_CAMPS: 'swastya_blood_camps',
  CAMP_REGISTRATIONS: 'swastya_camp_registrations',
  APPOINTMENTS: 'swastya_appointments',
  HOSPITAL_APPOINTMENTS: 'swastya_hospital_appointments',
  HOSPITAL_CROWD: 'swastya_hospital_crowd',
  ELDER_MODE: 'swastya_elder_mode',
  LANGUAGE: 'swastya_lang',
};

export const storage = {
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(KEYS.PROFILE);
      return data ? JSON.parse(data) : initialUserProfile;
    } catch {
      return initialUserProfile;
    }
  },
  saveProfile(profile: UserProfile): void {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  },

  getRecords(): HealthRecord[] {
    try {
      const data = localStorage.getItem(KEYS.RECORDS);
      return data ? JSON.parse(data) : initialRecords;
    } catch {
      return initialRecords;
    }
  },
  saveRecords(records: HealthRecord[]): void {
    localStorage.setItem(KEYS.RECORDS, JSON.stringify(records));
  },

  getReminders(): MedicineReminder[] {
    try {
      const data = localStorage.getItem(KEYS.REMINDERS);
      return data ? JSON.parse(data) : initialReminders;
    } catch {
      return initialReminders;
    }
  },
  saveReminders(reminders: MedicineReminder[]): void {
    localStorage.setItem(KEYS.REMINDERS, JSON.stringify(reminders));
  },

  getActiveToken(): UserQueueToken | null {
    try {
      const data = localStorage.getItem(KEYS.ACTIVE_TOKEN);
      return data ? JSON.parse(data) : initialActiveToken;
    } catch {
      return initialActiveToken;
    }
  },
  saveActiveToken(token: UserQueueToken | null): void {
    if (token) {
      localStorage.setItem(KEYS.ACTIVE_TOKEN, JSON.stringify(token));
    } else {
      localStorage.removeItem(KEYS.ACTIVE_TOKEN);
    }
  },

  getElderLogs(): ElderDailyLog[] {
    try {
      const data = localStorage.getItem(KEYS.ELDER_LOGS);
      if (data) return JSON.parse(data);
      // default mock initial elder log
      return [
        {
          id: 'elog-1',
          date: 'Today, 8:30 AM',
          mood: 'good',
          bpSystolic: 132,
          bpDiastolic: 84,
          sugarLevel: 138,
          waterGlasses: 5,
          walkMinutes: 20,
          notes: 'Walked in garden, had morning tea and took morning tablet.',
        },
      ];
    } catch {
      return [];
    }
  },
  saveElderLogs(logs: ElderDailyLog[]): void {
    localStorage.setItem(KEYS.ELDER_LOGS, JSON.stringify(logs));
  },

  getBloodRequests(): EmergencyBloodRequest[] {
    try {
      const data = localStorage.getItem(KEYS.BLOOD_REQUESTS);
      if (data) return JSON.parse(data);
      return [
        {
          id: 'req-1',
          patientName: 'Rukmini Devi',
          bloodGroup: 'O-',
          unitsNeeded: 2,
          hospitalName: 'District Civil Hospital Anand',
          district: 'Anand',
          urgency: 'CRITICAL',
          contactPhone: '+91 94280 88912',
          createdAt: '15 mins ago',
          status: 'BROADCASTED',
          donorsResponded: 1,
        },
      ];
    } catch {
      return [];
    }
  },
  saveBloodRequests(reqs: EmergencyBloodRequest[]): void {
    localStorage.setItem(KEYS.BLOOD_REQUESTS, JSON.stringify(reqs));
  },

  getAppointments(): TelehealthAppointment[] {
    try {
      const data = localStorage.getItem(KEYS.APPOINTMENTS);
      if (data) return JSON.parse(data);
      return [
        {
          id: 'apt-1',
          doctorId: 'd1',
          doctorName: 'Dr. Ananya Sharma',
          specialty: 'General Physician / Rural Medicine',
          patientName: 'Rameshwar Sharma',
          patientAge: 64,
          patientPhone: '+91 98765 43210',
          date: '2026-09-10',
          timeSlot: '02:30 PM',
          isLowBandwidth: true,
          status: 'SCHEDULED',
          meetLink: 'https://swastyasetu.telehealth.in/room/apt-1',
        },
      ];
    } catch {
      return [];
    }
  },
  saveAppointments(apts: TelehealthAppointment[]): void {
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(apts));
  },

  getHospitalAppointments(): HospitalAppointment[] {
    try {
      const data = localStorage.getItem(KEYS.HOSPITAL_APPOINTMENTS);
      if (data) return JSON.parse(data);
      const initial = getInitialHospitalAppointments();
      this.saveHospitalAppointments(initial);
      return initial;
    } catch {
      return getInitialHospitalAppointments();
    }
  },

  saveHospitalAppointments(apts: HospitalAppointment[]): void {
    localStorage.setItem(KEYS.HOSPITAL_APPOINTMENTS, JSON.stringify(apts));
  },

  getHospitalCrowdStatus(): HospitalCrowdLevel {
    try {
      const data = localStorage.getItem(KEYS.HOSPITAL_CROWD);
      if (data === 'LOW' || data === 'MODERATE' || data === 'HIGH') {
        return data;
      }
      return 'HIGH'; // Default to HIGH to showcase crowd reduction logic
    } catch {
      return 'HIGH';
    }
  },

  saveHospitalCrowdStatus(level: HospitalCrowdLevel): void {
    localStorage.setItem(KEYS.HOSPITAL_CROWD, level);
  },

  getBloodCamps(): BloodDonationCamp[] {
    try {
      const data = localStorage.getItem(KEYS.BLOOD_CAMPS);
      if (data) return JSON.parse(data);
      this.saveBloodCamps(mockBloodCamps);
      return mockBloodCamps;
    } catch {
      return mockBloodCamps;
    }
  },

  saveBloodCamps(camps: BloodDonationCamp[]): void {
    localStorage.setItem(KEYS.BLOOD_CAMPS, JSON.stringify(camps));
  },

  getCampRegistrations(): CampRegistration[] {
    try {
      const data = localStorage.getItem(KEYS.CAMP_REGISTRATIONS);
      if (data) return JSON.parse(data);
      this.saveCampRegistrations(initialCampRegistrations);
      return initialCampRegistrations;
    } catch {
      return initialCampRegistrations;
    }
  },

  saveCampRegistrations(regs: CampRegistration[]): void {
    localStorage.setItem(KEYS.CAMP_REGISTRATIONS, JSON.stringify(regs));
  },
};
