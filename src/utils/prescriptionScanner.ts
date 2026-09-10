import { DetectedMedication } from '../types';
import { samplePrescriptionPresets } from '../data/mockData';

// Common rural & general medication knowledge base with standard Indian clinical schedules
const COMMON_MEDICATION_CATALOG: Omit<DetectedMedication, 'id' | 'confidence' | 'selected'>[] = [
  {
    name: 'Paracetamol 650mg',
    dosage: '1 Tablet',
    frequency: 'Thrice daily',
    timings: ['Morning', 'Afternoon', 'Bedtime'],
    mealTiming: 'After Food',
    durationDays: 5,
    totalPills: 15,
    notes: 'For fever & pain relief. Maintain at least 6 hours gap between doses.',
    photoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Metformin Hydrochloride 500mg',
    dosage: '1 Tablet',
    frequency: 'Twice daily',
    timings: ['Morning', 'Bedtime'],
    mealTiming: 'After Food',
    durationDays: 30,
    totalPills: 60,
    notes: 'Take with or immediately after food to prevent stomach upset.',
    photoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Pantoprazole Gastro-Resistant 40mg',
    dosage: '1 Tablet',
    frequency: 'Once daily',
    timings: ['Morning'],
    mealTiming: 'Before Food',
    durationDays: 14,
    totalPills: 14,
    notes: 'Take 30 minutes before morning tea/breakfast on empty stomach.',
    photoUrl: 'https://images.unsplash.com/photo-1550572017-ed24c424a1b5?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Amlodipine 5mg',
    dosage: '1 Tablet',
    frequency: 'Once daily',
    timings: ['Morning'],
    mealTiming: 'Before Food',
    durationDays: 30,
    totalPills: 30,
    notes: 'Take regularly at the same time every morning to stabilize blood pressure.',
    photoUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Amoxicillin & Clavulanate 625mg',
    dosage: '1 Tablet',
    frequency: 'Twice daily',
    timings: ['Morning', 'Bedtime'],
    mealTiming: 'After Food',
    durationDays: 7,
    totalPills: 14,
    notes: 'Complete full 7-day course even if fever resolves.',
    photoUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Cetirizine 10mg',
    dosage: '1 Tablet',
    frequency: 'Once daily',
    timings: ['Bedtime'],
    mealTiming: 'After Food',
    durationDays: 5,
    totalPills: 5,
    notes: 'Take before sleep for cold/allergies. May induce mild drowsiness.',
    photoUrl: 'https://images.unsplash.com/photo-1550572017-ed24c424a1b5?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Iron & Folic Acid (IFA) Tablet',
    dosage: '1 Tablet',
    frequency: 'Once daily',
    timings: ['Afternoon'],
    mealTiming: 'After Food',
    durationDays: 60,
    totalPills: 60,
    notes: 'Take after lunch with lemon water. Do not consume tea or dairy within 2 hrs.',
    photoUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Multivitamin & Zinc Capsule',
    dosage: '1 Capsule',
    frequency: 'Once daily',
    timings: ['Afternoon'],
    mealTiming: 'After Food',
    durationDays: 30,
    totalPills: 30,
    notes: 'General immunity & nutritional supplement after meals.',
    photoUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&auto=format&fit=crop&q=80',
  },
];

/**
 * Simulates clinical optical character recognition (OCR) and text parsing
 * for prescription slips or medicine packaging photos.
 */
export async function scanPrescriptionImage(
  imageSource: string,
  fileName?: string
): Promise<{
  doctorName?: string;
  facilityName?: string;
  prescriptionDate?: string;
  medications: DetectedMedication[];
}> {
  // Simulate optical processing latency (600ms - 900ms)
  await new Promise((resolve) => setTimeout(resolve, 800));

  // 1. Check if the image source matches any of our known sample presets
  const matchedPreset = samplePrescriptionPresets.find(
    (p) => p.imageUrl === imageSource || imageSource.includes(p.id)
  );

  if (matchedPreset) {
    return {
      doctorName: matchedPreset.doctorName,
      facilityName: matchedPreset.facility,
      prescriptionDate: matchedPreset.date,
      medications: matchedPreset.detectedMeds.map((m) => ({ ...m, selected: true })),
    };
  }

  // 2. If user uploaded a custom image (camera or file), examine file name hints
  const lowerName = (fileName || '').toLowerCase();

  let selectedTemplates = COMMON_MEDICATION_CATALOG.slice(0, 3);

  if (lowerName.includes('fever') || lowerName.includes('cold') || lowerName.includes('cough')) {
    selectedTemplates = [
      COMMON_MEDICATION_CATALOG[0], // Paracetamol
      COMMON_MEDICATION_CATALOG[4], // Amoxicillin
      COMMON_MEDICATION_CATALOG[5], // Cetirizine
    ];
  } else if (lowerName.includes('bp') || lowerName.includes('sugar') || lowerName.includes('diabetes')) {
    selectedTemplates = [
      COMMON_MEDICATION_CATALOG[1], // Metformin
      COMMON_MEDICATION_CATALOG[3], // Amlodipine
      COMMON_MEDICATION_CATALOG[2], // Pantoprazole
    ];
  } else if (lowerName.includes('women') || lowerName.includes('maternal') || lowerName.includes('pregnancy')) {
    selectedTemplates = [
      COMMON_MEDICATION_CATALOG[6], // IFA
      COMMON_MEDICATION_CATALOG[7], // Multivitamin
    ];
  }

  const generatedMeds: DetectedMedication[] = selectedTemplates.map((tpl, index) => ({
    ...tpl,
    id: `scan-${Date.now()}-${index}`,
    confidence: Math.floor(92 + Math.random() * 7),
    selected: true,
    photoUrl: tpl.photoUrl,
  }));

  return {
    doctorName: 'Dr. Medical Officer (Verified Rx)',
    facilityName: 'Primary / District Health Center',
    prescriptionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    medications: generatedMeds,
  };
}
