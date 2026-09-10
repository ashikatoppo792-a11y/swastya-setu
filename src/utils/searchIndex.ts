import { NavTab } from '../types';
import {
  mockCenters,
  mockDoctors,
  mockBloodBanks,
  mockDonors,
  mockBloodCamps,
  initialReminders,
  mockWomensTips,
} from '../data/mockData';

export type SearchCategory =
  | 'hospital'
  | 'doctor'
  | 'symptom'
  | 'medicine'
  | 'blood'
  | 'womens';

export interface SearchResultItem {
  id: string;
  category: SearchCategory;
  title: string;
  subtitle: string;
  badge?: string;
  badgeType?: 'emergency' | 'urgent' | 'success' | 'neutral' | 'teleconsult';
  targetTab: NavTab;
  actionPayload?: {
    symptomText?: string;
    centerSearchQuery?: string;
    bloodGroup?: string;
    medicineName?: string;
  };
}

// Curated list of clinical symptoms & emergency queries
// Curated list of clinical symptoms & emergency queries with suggested medicines
const COMMON_SYMPTOMS_INDEX = [
  {
    title: 'Severe Chest Pain & Sweating',
    subtitle: 'Emergency 108 Alert • Aspirin chewable first aid while awaiting ambulance',
    badge: 'CRITICAL EMERGENCY',
    badgeType: 'emergency' as const,
    keywords: ['chest', 'heart', 'attack', 'pain', 'sweating', 'cardiac', 'left arm'],
  },
  {
    title: 'High Fever with Chills (103°F)',
    subtitle: 'Suggested Meds: Paracetamol 650mg (Dolo), ORS • Urgent PHC screening',
    badge: 'URGENT EVALUATION',
    badgeType: 'urgent' as const,
    keywords: ['fever', 'chills', 'high fever', 'temperature', 'shivering', '103', '102', 'bukhar'],
  },
  {
    title: 'Sudden Shortness of Breath',
    subtitle: 'Respiratory Distress • Emergency 108 / Urgent Oxygen Evaluation',
    badge: 'CRITICAL EMERGENCY',
    badgeType: 'emergency' as const,
    keywords: ['breath', 'breathing', 'shortness of breath', 'asthma', 'suffocation'],
  },
  {
    title: 'Diarrhea & Loose Motions',
    subtitle: 'Suggested Meds: WHO-ORS Electral, Zinc Sulphate 20mg • Rehydration',
    badge: 'URGENT',
    badgeType: 'urgent' as const,
    keywords: ['diarrhea', 'diarrhoea', 'loose motions', 'dast', 'watery stool', 'loose motion'],
  },
  {
    title: 'Severe Abdominal Pain & Vomiting',
    subtitle: 'Suggested Meds: Meftal-Spas, Ondansetron • Urgent Clinic Check',
    badge: 'URGENT',
    badgeType: 'urgent' as const,
    keywords: ['abdomen', 'stomach', 'vomiting', 'pain', 'belly', 'cramps', 'pet dard', 'ulti'],
  },
  {
    title: 'Persistent Cough with Phlegm',
    subtitle: 'Suggested Meds: Cough Expectorant, Saline Gargles • Teleconsult Doctor',
    badge: 'TELECONSULT',
    badgeType: 'teleconsult' as const,
    keywords: ['cough', 'phlegm', 'cold', 'throat', 'chest congestion', 'khasi', 'sore throat'],
  },
  {
    title: 'Severe Headache & Migraine',
    subtitle: 'Suggested Meds: Paracetamol 650mg, Herbal Pain Balm • Rest in quiet',
    badge: 'TELECONSULT',
    badgeType: 'teleconsult' as const,
    keywords: ['headache', 'dizzy', 'head', 'migraine', 'vertigo', 'bp', 'sar dard'],
  },
  {
    title: 'Acidity, Gas & Heartburn',
    subtitle: 'Suggested Meds: Pantoprazole 40mg, Antacid Gel (Digene) • Fast Relief',
    badge: 'SELFCARE',
    badgeType: 'success' as const,
    keywords: ['acidity', 'gas', 'heartburn', 'acid reflux', 'bloating', 'burning chest'],
  },
  {
    title: 'Skin Rash & Allergic Itching',
    subtitle: 'Suggested Meds: Calamine Lotion, Cetirizine 10mg • Cooling Relief',
    badge: 'TELECONSULT',
    badgeType: 'teleconsult' as const,
    keywords: ['rash', 'skin rash', 'itching', 'khujli', 'allergy', 'hives', 'urticaria'],
  },
  {
    title: 'Child Dehydration & Lethargy',
    subtitle: 'Pediatric Warning • Immediate ORS & Primary Health Clinic Visit',
    badge: 'URGENT',
    badgeType: 'urgent' as const,
    keywords: ['child', 'baby', 'dehydration', 'loose motions', 'diarrhea', 'not drinking'],
  },
];

export function searchAllEntities(query: string): SearchResultItem[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  const results: SearchResultItem[] = [];

  // 1. Search Symptoms & Conditions
  COMMON_SYMPTOMS_INDEX.forEach((s, idx) => {
    const matchesTitle = s.title.toLowerCase().includes(clean);
    const matchesSubtitle = s.subtitle.toLowerCase().includes(clean);
    const matchesKeyword = s.keywords.some((kw) => kw.includes(clean) || clean.includes(kw));

    if (matchesTitle || matchesSubtitle || matchesKeyword) {
      results.push({
        id: `symp-${idx}`,
        category: 'symptom',
        title: s.title,
        subtitle: s.subtitle,
        badge: s.badge,
        badgeType: s.badgeType,
        targetTab: 'triage',
        actionPayload: { symptomText: s.title },
      });
    }
  });

  // 2. Search Healthcare Centers & Hospitals (from both mockCenters and MOCK_HOSPITALS)
  mockCenters.forEach((center) => {
    const matches =
      center.name.toLowerCase().includes(clean) ||
      center.district.toLowerCase().includes(clean) ||
      center.address.toLowerCase().includes(clean) ||
      center.type.toLowerCase().includes(clean);

    if (matches) {
      results.push({
        id: `center-${center.id}`,
        category: 'hospital',
        title: center.name,
        subtitle: `${center.type} • ${center.distanceKm} km away in ${center.district} • ${center.availableBeds} beds free`,
        badge: center.isEmergency24x7 ? '24x7 Emergency' : 'PHC Govt',
        badgeType: center.isEmergency24x7 ? 'emergency' : 'success',
        targetTab: 'telehealth',
        actionPayload: { centerSearchQuery: center.name },
      });
    }
  });

  // 3. Search Telehealth Doctors
  mockDoctors.forEach((doc) => {
    const matches =
      doc.name.toLowerCase().includes(clean) ||
      doc.specialty.toLowerCase().includes(clean) ||
      doc.qualification.toLowerCase().includes(clean) ||
      clean.includes('doctor') ||
      clean.includes('physician') ||
      clean.includes('consult');

    if (matches) {
      results.push({
        id: `doc-${doc.id}`,
        category: 'doctor',
        title: `${doc.name} (${doc.specialty})`,
        subtitle: `Next Slot: ${doc.nextSlot} • ${doc.experienceYears}y exp • Free Teleconsult`,
        badge: 'Online Consult',
        badgeType: 'teleconsult',
        targetTab: 'telehealth',
      });
    }
  });

  // 3b. Search Doctor Appointments & Hospital OPD Advance Booking
  if (
    clean.includes('appoint') ||
    clean.includes('book') ||
    clean.includes('opd') ||
    clean.includes('queue') ||
    clean.includes('token') ||
    clean.includes('hospital doctor')
  ) {
    results.push({
      id: 'search-book-doctor',
      category: 'doctor',
      title: 'Book Hospital Doctor Appointment',
      subtitle: 'Skip crowded OPD queues • Select Department & 2+ Days Advance Priority Slots',
      badge: 'Advance Booking',
      badgeType: 'success',
      targetTab: 'appointments',
    });
  }

  // 4. Search Blood Availability, Blood Groups & Donors
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const matchedBloodGroup = bloodGroups.find(
    (g) => g.toLowerCase() === clean || clean === `blood ${g.toLowerCase()}` || clean === `${g.toLowerCase()} blood`
  );

  if (matchedBloodGroup || clean.includes('blood') || clean.includes('donor') || clean.includes('khoon')) {
    const targetGroup = matchedBloodGroup || 'O+';
    results.push({
      id: `blood-stock-${targetGroup}`,
      category: 'blood',
      title: `Blood Group ${targetGroup} Availability`,
      subtitle: `View live units in Civil Hospital Blood Bank & nearby donor directory`,
      badge: 'Live Stock',
      badgeType: 'emergency',
      targetTab: 'blood',
      actionPayload: { bloodGroup: targetGroup },
    });
  }

  // Also search individual blood banks
  mockBloodBanks.forEach((bank) => {
    if (
      bank.bloodBankName.toLowerCase().includes(clean) ||
      bank.hospitalAffiliation.toLowerCase().includes(clean)
    ) {
      results.push({
        id: `bb-${bank.id}`,
        category: 'blood',
        title: bank.bloodBankName,
        subtitle: `${bank.address} • Phone: ${bank.phone} • ${bank.distanceKm} km`,
        badge: 'Blood Bank',
        badgeType: 'emergency',
        targetTab: 'blood',
      });
    }
  });

  // Search Blood Donation Camps
  mockBloodCamps.forEach((camp) => {
    if (
      camp.title.toLowerCase().includes(clean) ||
      camp.venue.toLowerCase().includes(clean) ||
      camp.organizer.toLowerCase().includes(clean) ||
      camp.district.toLowerCase().includes(clean) ||
      clean.includes('camp') ||
      clean.includes('raktdaan') ||
      clean.includes('donation drive')
    ) {
      results.push({
        id: `camp-${camp.id}`,
        category: 'blood',
        title: `Blood Camp: ${camp.title}`,
        subtitle: `${camp.date} at ${camp.venue}, ${camp.district} • By ${camp.organizer}`,
        badge: 'Donation Camp',
        badgeType: 'success',
        targetTab: 'blood',
      });
    }
  });

  // 5. Search Medicines & Prescriptions
  initialReminders.forEach((med) => {
    const matches =
      med.name.toLowerCase().includes(clean) ||
      clean.includes('medicine') ||
      clean.includes('pill') ||
      clean.includes('metformin') ||
      clean.includes('amlodipine');

    if (matches) {
      results.push({
        id: `med-${med.id}`,
        category: 'medicine',
        title: `${med.name} (${med.dosage})`,
        subtitle: `Schedule: ${med.timings.join(', ')} • ${med.mealTiming} • ${med.remainingPills} pills left`,
        badge: 'Pill Reminder',
        badgeType: 'success',
        targetTab: 'medicine',
        actionPayload: { medicineName: med.name },
      });
    }
  });

  // 7. Search Women's Health Topics & Guides
  mockWomensTips.forEach((tip) => {
    const matches =
      tip.title.toLowerCase().includes(clean) ||
      tip.summary.toLowerCase().includes(clean) ||
      clean.includes('women') ||
      clean.includes('maternal') ||
      clean.includes('pregnancy') ||
      clean.includes('period') ||
      clean.includes('cycle');

    if (matches) {
      results.push({
        id: `wom-${tip.id}`,
        category: 'womens',
        title: tip.title,
        subtitle: tip.summary,
        badge: tip.stageBadge,
        badgeType: 'neutral',
        targetTab: 'womens',
      });
    }
  });

  // Return top 8 matches capped for clean UI display
  return results.slice(0, 8);
}
