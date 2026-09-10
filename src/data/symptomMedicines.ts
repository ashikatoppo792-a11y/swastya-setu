import { SuggestedMedicine, SeverityLevel } from '../types';

export interface SymptomMedicineEntry {
  id: string;
  symptomName: string;
  vernacularNames: string[];
  keywords: string[];
  severity: SeverityLevel;
  primaryCondition: string;
  clinicalSummary: string;
  recommendedMedicines: SuggestedMedicine[];
  homeCareTips: string[];
  redFlags: string[];
}

export const SYMPTOM_MEDICINE_DATABASE: SymptomMedicineEntry[] = [
  {
    id: 'fever',
    symptomName: 'Fever, High Temperature & Chills',
    vernacularNames: ['बुखार (Fever)', 'ठंड लगना (Chills)', 'ताप', 'ज्वर'],
    keywords: ['fever', 'high fever', 'temperature', 'chills', 'shivering', 'bukhar', 'tap', 'jwar', 'body heat', 'sweat', '100', '101', '102', '103'],
    severity: 'URGENT',
    primaryCondition: 'Acute Pyrexia / Viral or Bacterial Infection',
    clinicalSummary: 'Body temperature above 99.5°F indicating inflammatory response or microbial infection.',
    recommendedMedicines: [
      {
        id: 'med-pcm-650',
        name: 'Paracetamol 650mg',
        genericName: 'Paracetamol (Acetaminophen) IP 650mg',
        brandExamples: 'Dolo 650, Calpol 650, P-650',
        dosage: '1 Tablet (650mg)',
        form: 'Tablet',
        frequency: 'Every 6-8 hours',
        timings: ['Morning', 'Afternoon', 'Bedtime'],
        mealTiming: 'After Food',
        purpose: 'Lowers fever spikes and relieves associated viral body ache and headache.',
        category: 'OTC',
        safetyWarning: 'Do not exceed 3000mg (4 tablets) in 24 hours. Avoid alcohol. Check liver function if chronic.',
        janAushadhiPrice: '₹12 for strip of 10 (Jan Aushadhi PMBI) vs ₹35 branded',
        isGovtFree: true,
      },
      {
        id: 'med-ors-fever',
        name: 'Oral Rehydration Salts (ORS WHO Formula)',
        genericName: 'Sodium Chloride + Potassium Chloride + Dextrose IP',
        brandExamples: 'Electral, Walyte, ORS-L',
        dosage: '1 Sachet dissolved in 1 Liter clean boiled & cooled water',
        form: 'Sachet',
        frequency: 'As needed',
        timings: ['Morning', 'Afternoon', 'Evening'],
        mealTiming: 'With Water',
        purpose: 'Replenishes vital electrolytes lost through fever sweating and maintains hydration.',
        category: 'OTC',
        safetyWarning: 'Do not boil prepared ORS solution. Consume prepared liter within 24 hours.',
        janAushadhiPrice: '₹4.50 per sachet (Jan Aushadhi) vs ₹22 branded',
        isGovtFree: true,
      },
      {
        id: 'med-meftal-forte',
        name: 'Mefenamic Acid + Paracetamol',
        genericName: 'Mefenamic Acid 500mg + Paracetamol 450mg',
        brandExamples: 'Meftal-Forte, Ponstan',
        dosage: '1 Tablet',
        form: 'Tablet',
        frequency: 'Twice daily',
        timings: ['Morning', 'Bedtime'],
        mealTiming: 'After Food',
        purpose: 'Prescribed for refractory high fever (>102°F) resistant to plain paracetamol with severe aches.',
        category: 'PRESCRIPTION_ONLY',
        safetyWarning: 'Strictly take after food. Do not use if history of peptic ulcer, gastritis, or kidney impairment.',
        janAushadhiPrice: '₹18 for 10 tablets (Jan Aushadhi) vs ₹48 branded',
        isGovtFree: false,
      },
    ],
    homeCareTips: [
      'Forehead cold water sponging with clean cloth (room temperature water, never ice water).',
      'Wear loose, breathable cotton clothing and rest in a well-ventilated room.',
      'Drink plenty of fluid: coconut water, warm thin dal water, lemon water.',
    ],
    redFlags: [
      'Fever > 103°F not responding to antipyretics after 2 hours.',
      'Stiff neck, severe photophobia, or extreme confusion/drowsiness.',
      'Petechiae or purplish skin rash (dengue/meningococcal sign).',
      'Persistent vomiting with inability to retain any liquids.',
    ],
  },
  {
    id: 'cough',
    symptomName: 'Cough, Throat Pain & Congestion',
    vernacularNames: ['खांसी (Cough)', 'गले में दर्द (Sore Throat)', 'कफ (Phlegm)'],
    keywords: ['cough', 'phlegm', 'dry cough', 'wet cough', 'sore throat', 'throat', 'khasi', 'khansi', 'coughing', 'throat pain', 'congestion', 'mucus'],
    severity: 'TELECONSULT',
    primaryCondition: 'Upper Respiratory Tract Infection / Bronchitis',
    clinicalSummary: 'Irritation of pharynx, larynx, or bronchial tract caused by viral exposure or particulate allergens.',
    recommendedMedicines: [
      {
        id: 'med-cough-dry',
        name: 'Dextromethorphan + Chlorpheniramine Syrup',
        genericName: 'Dextromethorphan HBr 10mg + Chlorpheniramine Maleate 2mg / 5ml',
        brandExamples: 'Benadryl DR, Ascoril-D, Chericof',
        dosage: '10 ml (2 teaspoons)',
        form: 'Syrup',
        frequency: 'Thrice daily',
        timings: ['Morning', 'Afternoon', 'Bedtime'],
        mealTiming: 'After Food',
        purpose: 'Suppresses dry tickly cough center in the brain and reduces throat allergic tickle.',
        category: 'OTC',
        safetyWarning: 'May cause mild drowsiness. Avoid driving or operating machinery after dosage.',
        janAushadhiPrice: '₹22 per 100ml bottle (Jan Aushadhi) vs ₹95 branded',
        isGovtFree: true,
      },
      {
        id: 'med-cough-wet',
        name: 'Ambroxol + Terbutaline + Guaiphenesin Syrup',
        genericName: 'Ambroxol 30mg + Guaiphenesin 50mg + Terbutaline 1.25mg / 5ml',
        brandExamples: 'Ascoril-LS, Grilinctus-BM, Macbery',
        dosage: '10 ml (2 teaspoons)',
        form: 'Syrup',
        frequency: 'Thrice daily',
        timings: ['Morning', 'Afternoon', 'Evening'],
        mealTiming: 'After Food',
        purpose: 'Thins and liquefies stubborn chest phlegm, making it easier to cough up.',
        category: 'PRESCRIPTION_ONLY',
        safetyWarning: 'May cause mild hand tremors or palpitations in heart patients due to terbutaline.',
        janAushadhiPrice: '₹28 per 100ml (Jan Aushadhi) vs ₹115 branded',
        isGovtFree: true,
      },
      {
        id: 'med-throat-lozenges',
        name: 'Amylmetacresol & Dichlorobenzyl Alcohol Lozenges',
        genericName: 'Antiseptic Throat Lozenges',
        brandExamples: 'Strepsils, Cofsils, Koflet',
        dosage: '1 Lozenge slowly dissolved in mouth',
        form: 'Tablet',
        frequency: 'Every 6-8 hours',
        timings: ['Morning', 'Afternoon', 'Bedtime'],
        mealTiming: 'With Water',
        purpose: 'Topical antibacterial action that numbs sore throat irritation and reduces inflammation.',
        category: 'OTC',
        safetyWarning: 'Do not swallow whole or chew. Not for children under 5 years.',
        janAushadhiPrice: '₹10 for pack of 8 vs ₹35 branded',
        isGovtFree: true,
      },
    ],
    homeCareTips: [
      'Warm saline gargles: Dissolve 1/2 teaspoon salt in a glass of warm water, gargle 3 times a day.',
      'Steam inhalation twice daily with plain warm water (add eucalyptus drop if available).',
      'Sip warm water with pure honey and a pinch of ground ginger.',
    ],
    redFlags: [
      'Coughing up fresh bright red blood or rust-colored sputum.',
      'Severe shortness of breath, wheezing, or stridor at rest.',
      'Cough lasting longer than 3 weeks without improvement (Tuberculosis screening mandatory).',
    ],
  },
  {
    id: 'cold_allergy',
    symptomName: 'Common Cold, Runny Nose & Sneezing',
    vernacularNames: ['जुकाम / सर्दी (Cold)', 'छींकें (Sneezing)', 'नाक बहना (Runny Nose)'],
    keywords: ['cold', 'runny nose', 'sneezing', 'blocked nose', 'sardi', 'jukam', 'rhinitis', 'allergy', 'allergic', 'watery eyes'],
    severity: 'SELFCARE',
    primaryCondition: 'Acute Rhinitis / Seasonal Allergic Rhinitis',
    clinicalSummary: 'Nasal mucosal inflammation leading to clear rhinorrhea, sneezing, and ocular irritation.',
    recommendedMedicines: [
      {
        id: 'med-cetirizine-10',
        name: 'Cetirizine 10mg',
        genericName: 'Cetirizine Hydrochloride IP 10mg',
        brandExamples: 'Cetzine, Okacet, Alerid',
        dosage: '1 Tablet (10mg)',
        form: 'Tablet',
        frequency: 'Once daily',
        timings: ['Bedtime'],
        mealTiming: 'After Food',
        purpose: 'Blocks histamine H1 receptors to stop incessant sneezing, runny nose, and itchy eyes.',
        category: 'OTC',
        safetyWarning: 'Can cause mild sedation. Best taken at night before sleep.',
        janAushadhiPrice: '₹5 for strip of 10 (Jan Aushadhi) vs ₹24 branded',
        isGovtFree: true,
      },
      {
        id: 'med-saline-nasal',
        name: 'Isotonic Saline Nasal Spray / Drops',
        genericName: 'Sodium Chloride Solution 0.9% w/v',
        brandExamples: 'Solspre, Otrivin S, Nasoclear',
        dosage: '2-3 drops in each nostril',
        form: 'Drops',
        frequency: 'Thrice daily',
        timings: ['Morning', 'Afternoon', 'Bedtime'],
        mealTiming: 'With Water',
        purpose: 'Naturally washes away viral particles, allergens, and crusts without chemical rebound.',
        category: 'OTC',
        safetyWarning: 'Completely safe for children and pregnant women; no chemical vasoconstrictor side effects.',
        janAushadhiPrice: '₹14 per 20ml (Jan Aushadhi) vs ₹60 branded',
        isGovtFree: true,
      },
    ],
    homeCareTips: [
      'Drink hot herbal infusions (tulsi, ginger, black pepper tea).',
      'Sleep with head slightly elevated on pillows to promote sinus drainage.',
      'Avoid sudden shifts from cold air conditioning to hot sun.',
    ],
    redFlags: [
      'Severe pain above eyebrow or cheekbones with purulent greenish-yellow nasal discharge (acute bacterial sinusitis).',
      'Swelling or redness around either eye.',
    ],
  },
  {
    id: 'headache',
    symptomName: 'Headache & Migraine Pain',
    vernacularNames: ['सिर दर्द (Headache)', 'माइग्रेन (Migraine)', 'सिर में भारीपन'],
    keywords: ['headache', 'head ache', 'migraine', 'head pain', 'sar dard', 'sir dard', 'head heaviness', 'throbbing', 'temple pain'],
    severity: 'TELECONSULT',
    primaryCondition: 'Tension Headache / Migraine / Vascular Cephalea',
    clinicalSummary: 'Cranial or cervical muscle contraction or vascular dilation causing pulsatile or diffuse pain.',
    recommendedMedicines: [
      {
        id: 'med-pcm-headache',
        name: 'Paracetamol 650mg',
        genericName: 'Paracetamol IP 650mg',
        brandExamples: 'Dolo 650, Calpol 650',
        dosage: '1 Tablet (650mg)',
        form: 'Tablet',
        frequency: 'Every 6-8 hours',
        timings: ['Morning', 'Bedtime'],
        mealTiming: 'After Food',
        purpose: 'Provides quick central analgesic relief for tension and stress headaches.',
        category: 'OTC',
        safetyWarning: 'Do not take on empty stomach if prone to gastric sensitivity. Maximum 3/day.',
        janAushadhiPrice: '₹12 for 10 tablets (Jan Aushadhi) vs ₹35 branded',
        isGovtFree: true,
      },
      {
        id: 'med-ibuprofen-400',
        name: 'Ibuprofen 400mg',
        genericName: 'Ibuprofen IP 400mg',
        brandExamples: 'Brufen 400, Ibugesic',
        dosage: '1 Tablet (400mg)',
        form: 'Tablet',
        frequency: 'Twice daily',
        timings: ['Morning', 'Bedtime'],
        mealTiming: 'After Food',
        purpose: 'NSAID anti-inflammatory action for throbbing migraine and sinus headaches.',
        category: 'OTC',
        safetyWarning: 'Strictly take AFTER food or with milk. Avoid if you have asthma, stomach ulcer, or kidney disease.',
        janAushadhiPrice: '₹10 for 10 tablets (Jan Aushadhi) vs ₹28 branded',
        isGovtFree: true,
      },
      {
        id: 'med-pain-balm',
        name: 'Herbal Analgesic Balm / Gel',
        genericName: 'Menthol + Camphor + Methyl Salicylate',
        brandExamples: 'Amrutanjan, Tiger Balm, Zandu Balm',
        dosage: 'Gentle massage on forehead and temples',
        form: 'Gel / Ointment',
        frequency: 'As needed',
        timings: ['Afternoon', 'Bedtime'],
        mealTiming: 'With Water',
        purpose: 'Local cooling counter-irritant effect that relieves cranial tension and relaxes muscles.',
        category: 'OTC',
        safetyWarning: 'External use only. Avoid contact with eyes, broken skin, or mucous membranes.',
        janAushadhiPrice: '₹18 per container vs ₹45 branded',
        isGovtFree: true,
      },
    ],
    homeCareTips: [
      'Rest in a quiet, dark, well-ventilated room with eyes closed.',
      'Apply a cold damp towel across forehead or a warm compress on the back of the neck.',
      'Stay well hydrated with at least 2 glasses of water (dehydration is a top headache trigger).',
    ],
    redFlags: [
      'Sudden explosive "thunderclap" headache reaching peak intensity in under 60 seconds.',
      'Headache accompanied by high fever, neck stiffness, confusion, or weakness in limbs.',
      'Headache following head trauma or loss of consciousness.',
    ],
  },
  {
    id: 'acidity',
    symptomName: 'Acidity, Gas & Heartburn (Acid Reflux)',
    vernacularNames: ['एसिडिटी (Acidity)', 'गैस (Gas)', 'पेट में जलन (Heartburn)', 'खट्टी डकार'],
    keywords: ['acidity', 'gas', 'heartburn', 'acid reflux', 'gerd', 'burning chest', 'stomach burning', 'bloating', 'sour burps', 'pet mein jalan', 'indigestion'],
    severity: 'SELFCARE',
    primaryCondition: 'Gastroesophageal Reflux Disease (GERD) / Dyspepsia',
    clinicalSummary: 'Excess gastric acid secretion irritating the stomach lining or refluxing into lower esophagus.',
    recommendedMedicines: [
      {
        id: 'med-pantoprazole-40',
        name: 'Pantoprazole 40mg',
        genericName: 'Pantoprazole Gastro-resistant IP 40mg',
        brandExamples: 'Pan 40, Pantocid 40, Pantodac',
        dosage: '1 Tablet (40mg)',
        form: 'Tablet',
        frequency: 'Once daily',
        timings: ['Morning'],
        mealTiming: 'Before Food',
        purpose: 'Proton Pump Inhibitor (PPI) that suppresses gastric acid secretion for 24 hours.',
        category: 'OTC',
        safetyWarning: 'Take strictly 30 minutes BEFORE breakfast with water. Swallow tablet whole.',
        janAushadhiPrice: '₹14 for strip of 10 (Jan Aushadhi) vs ₹98 branded',
        isGovtFree: true,
      },
      {
        id: 'med-antacid-gel',
        name: 'Antacid Gel Suspension',
        genericName: 'Magaldrate 480mg + Simethicone 20mg / 5ml',
        brandExamples: 'Digene, Gelusil, Mucaine Gel',
        dosage: '10 ml (2 teaspoons)',
        form: 'Syrup',
        frequency: 'Thrice daily',
        timings: ['Morning', 'Afternoon', 'Bedtime'],
        mealTiming: 'After Food',
        purpose: 'Immediately neutralizes existing stomach acid and dissolves trapped gas bubbles.',
        category: 'OTC',
        safetyWarning: 'Shake well before use. Take 15-30 minutes after meals or upon acute burning.',
        janAushadhiPrice: '₹25 per 170ml bottle (Jan Aushadhi) vs ₹120 branded',
        isGovtFree: true,
      },
    ],
    homeCareTips: [
      'Drink a glass of cold milk or fresh coconut water for immediate mucosal soothing.',
      'Eat small, frequent meals rather than large heavy dinners; avoid lying down within 2 hours of eating.',
      'Avoid fried spicy foods, carbonated beverages, excessive tea/coffee, and raw onion.',
    ],
    redFlags: [
      'Chest burning associated with sweating, radiation to left shoulder/jaw, or breathlessness (Rule out heart attack!).',
      'Difficulty or severe pain while swallowing solid foods.',
      'Vomiting blood or passing black tarry stools.',
    ],
  },
  {
    id: 'diarrhea',
    symptomName: 'Diarrhea, Loose Motions & Vomiting',
    vernacularNames: ['दस्त / लूज मोशन (Diarrhea)', 'उल्टी (Vomiting)', 'पेट खराब (Upset Stomach)'],
    keywords: ['diarrhea', 'diarrhoea', 'loose motions', 'dast', 'loose stool', 'vomiting', 'vomit', 'ulti', 'dehydration', 'food poisoning', 'watery stool'],
    severity: 'URGENT',
    primaryCondition: 'Acute Gastroenteritis / Secretory Diarrhea',
    clinicalSummary: 'Rapid intestinal transit with fluid loss and electrolyte depletion caused by contaminated water/food.',
    recommendedMedicines: [
      {
        id: 'med-ors-diarrhea',
        name: 'Oral Rehydration Salts (ORS WHO Formula)',
        genericName: 'WHO Low Osmolarity Oral Rehydration Formula',
        brandExamples: 'Electral, Walyte Sachet',
        dosage: '1 Sachet dissolved in 1 Liter clean boiled & cooled water',
        form: 'Sachet',
        frequency: 'As needed',
        timings: ['Morning', 'Afternoon', 'Evening', 'Bedtime'],
        mealTiming: 'With Water',
        purpose: 'Critical frontline therapy: prevents hypovolemic shock by replenishing sodium, potassium, and glucose.',
        category: 'OTC',
        safetyWarning: 'Drink 200-400ml after every loose stool. Discard leftover solution after 24 hours.',
        janAushadhiPrice: '₹4.50 per sachet (Jan Aushadhi) vs ₹22 branded',
        isGovtFree: true,
      },
      {
        id: 'med-zinc-sulphate',
        name: 'Zinc Sulphate Dispersible 20mg',
        genericName: 'Zinc Sulphate Monohydrate IP 20mg',
        brandExamples: 'Zinconia 20, Zinctec',
        dosage: '1 Tablet daily for 14 days',
        form: 'Tablet',
        frequency: 'Once daily',
        timings: ['Morning'],
        mealTiming: 'After Food',
        purpose: 'Repairs intestinal mucosal lining, shortens diarrhea duration, and prevents recurrence.',
        category: 'OTC',
        safetyWarning: 'Dissolve in a spoonful of clean water or breastmilk for children. Complete full 14-day course.',
        janAushadhiPrice: '₹8 for strip of 10 (Jan Aushadhi) vs ₹42 branded',
        isGovtFree: true,
      },
      {
        id: 'med-ondansetron-4',
        name: 'Ondansetron 4mg',
        genericName: 'Ondansetron Hydrochloride IP 4mg',
        brandExamples: 'Emeset 4, Vomikind',
        dosage: '1 Tablet (4mg)',
        form: 'Tablet',
        frequency: 'Twice daily',
        timings: ['Morning', 'Evening'],
        mealTiming: 'Before Food',
        purpose: 'Fast-acting antiemetic that blocks serotonin 5-HT3 receptors to control persistent nausea and vomiting.',
        category: 'PRESCRIPTION_ONLY',
        safetyWarning: 'Take 30 minutes before oral hydration/meals. Consult doctor if vomiting persists despite medicine.',
        janAushadhiPrice: '₹7 for strip of 10 (Jan Aushadhi) vs ₹55 branded',
        isGovtFree: true,
      },
      {
        id: 'med-probiotics',
        name: 'Probiotic Spores Capsule / Suspension',
        genericName: 'Bacillus Clausii / Lactic Acid Bacillus',
        brandExamples: 'Sporlac, Darolac, Enterogermina',
        dosage: '1 Capsule or Mini Bottle',
        form: 'Tablet',
        frequency: 'Twice daily',
        timings: ['Morning', 'Bedtime'],
        mealTiming: 'After Food',
        purpose: 'Restores beneficial gut flora destroyed by intestinal pathogens or antimicrobial exposure.',
        category: 'OTC',
        safetyWarning: 'Safe for all ages. Can be mixed in lukewarm water or curd.',
        janAushadhiPrice: '₹18 for 10 capsules vs ₹80 branded',
        isGovtFree: true,
      },
    ],
    homeCareTips: [
      'Start ORS immediately — do not wait for dehydration to worsen.',
      'Feed light digestible foods: soft khichdi with curd, boiled rice water (kanji), ripe banana, light coconut water.',
      'Continue breastfeeding continuously if infant or toddler is affected.',
    ],
    redFlags: [
      'Blood or red streaks in stool (dysentery requiring urgent antimicrobial testing).',
      'Sunken eyes, skin pinch goes back very slowly, extreme thirst, no urine for >6 hours (Severe Dehydration).',
      'Inability to drink or retain fluids for more than 4-6 hours.',
    ],
  },
  {
    id: 'stomach_pain',
    symptomName: 'Abdominal Pain & Stomach Cramps',
    vernacularNames: ['पेट दर्द (Stomach Pain)', 'पेट में मरोड़ (Abdominal Cramps)'],
    keywords: ['stomach pain', 'abdominal pain', 'belly pain', 'cramps', 'stomach ache', 'pet dard', 'marod', 'spasm', 'colic'],
    severity: 'URGENT',
    primaryCondition: 'Intestinal Spasm / Renal Colic / Dysmenorrhea',
    clinicalSummary: 'Smooth muscle spasm of gastrointestinal or genitourinary tract producing colicky episodic pain.',
    recommendedMedicines: [
      {
        id: 'med-dicyclomine-pcm',
        name: 'Dicyclomine + Paracetamol',
        genericName: 'Dicyclomine HCl 20mg + Paracetamol 500mg',
        brandExamples: 'Meftal-Spas, Cyclopam, Spasmo-Proxyvon',
        dosage: '1 Tablet',
        form: 'Tablet',
        frequency: 'Twice daily',
        timings: ['Morning', 'Bedtime'],
        mealTiming: 'After Food',
        purpose: 'Relaxes smooth muscle spasm in gut and relieves severe spasmodic stomach cramps or menstrual pain.',
        category: 'PRESCRIPTION_ONLY',
        safetyWarning: 'May cause temporary dry mouth or blurred vision. Do not use in suspected appendicitis or intestinal obstruction.',
        janAushadhiPrice: '₹11 for strip of 10 (Jan Aushadhi) vs ₹48 branded',
        isGovtFree: true,
      },
      {
        id: 'med-drotaverine',
        name: 'Drotaverine 40mg / 80mg',
        genericName: 'Drotaverine Hydrochloride IP',
        brandExamples: 'Drotin, Doverin',
        dosage: '1 Tablet (40mg or 80mg)',
        form: 'Tablet',
        frequency: 'Twice daily',
        timings: ['Morning', 'Bedtime'],
        mealTiming: 'After Food',
        purpose: 'Targeted antispasmodic for smooth muscle colic in renal, biliary, and pelvic organs.',
        category: 'PRESCRIPTION_ONLY',
        safetyWarning: 'Take under doctor guidance. Avoid if severe liver or heart failure.',
        janAushadhiPrice: '₹16 for 10 tablets (Jan Aushadhi) vs ₹70 branded',
        isGovtFree: false,
      },
    ],
    homeCareTips: [
      'Apply a warm water bottle (hot pack) on the abdomen for gentle muscular relaxation.',
      'Sip warm ajwain (carom seed) and cumin water with a pinch of black salt.',
      'Eat light, non-greasy khichdi; avoid dairy and raw cruciferous vegetables.',
    ],
    redFlags: [
      'Sharp sudden pain localized to the right lower abdomen with rebound tenderness (Appendicitis!).',
      'Rigid board-like abdomen or severe pain accompanied by high fever and inability to pass gas.',
    ],
  },
  {
    id: 'skin_rash',
    symptomName: 'Skin Rash, Itching & Allergy (Urticaria)',
    vernacularNames: ['खुजली (Itching)', 'त्वचा पर लाल चकत्ते (Skin Rash)', 'एलर्जी (Allergy)'],
    keywords: ['rash', 'skin rash', 'itching', 'khujli', 'red spots', 'hives', 'urticaria', 'allergy', 'insect bite', 'pruritus', 'dermatitis'],
    severity: 'TELECONSULT',
    primaryCondition: 'Acute Allergic Dermatitis / Pruritus / Urticaria',
    clinicalSummary: 'Mast cell degranulation releasing histamine into epidermis causing erythema, wheals, and intense itching.',
    recommendedMedicines: [
      {
        id: 'med-calamine',
        name: 'Calamine Lotion 8%',
        genericName: 'Calamine IP 8% w/v + Zinc Oxide + Liquid Paraffin',
        brandExamples: 'Lacto Calamine, Calosoft, Caladryl',
        dosage: 'Apply gently with clean cotton twice daily',
        form: 'Gel / Ointment',
        frequency: 'Twice daily',
        timings: ['Morning', 'Bedtime'],
        mealTiming: 'With Water',
        purpose: 'Provides cooling topical relief, soothes irritated skin, and protects against secondary scratch infection.',
        category: 'OTC',
        safetyWarning: 'External use only. Do not apply on open bleeding sores or weeping vesicular lesions.',
        janAushadhiPrice: '₹25 per 100ml (Jan Aushadhi) vs ₹110 branded',
        isGovtFree: true,
      },
      {
        id: 'med-cetirizine-rash',
        name: 'Cetirizine 10mg',
        genericName: 'Cetirizine Hydrochloride IP 10mg',
        brandExamples: 'Cetzine, Okacet',
        dosage: '1 Tablet (10mg)',
        form: 'Tablet',
        frequency: 'Once daily',
        timings: ['Bedtime'],
        mealTiming: 'After Food',
        purpose: 'Reduces systemic histamine, alleviating severe all-over body itching and allergic urticarial hives.',
        category: 'OTC',
        safetyWarning: 'Best taken at bedtime due to mild sedative effect. Avoid alcohol.',
        janAushadhiPrice: '₹5 for strip of 10 (Jan Aushadhi) vs ₹24 branded',
        isGovtFree: true,
      },
    ],
    homeCareTips: [
      'Wear loose, soft cotton clothing; avoid synthetic polyester and wool contact.',
      'Take bath with lukewarm or cool water; avoid harsh perfumed soaps.',
      'Do not scratch itchy areas with fingernails (use a clean cold compress instead to prevent bacterial infection).',
    ],
    redFlags: [
      'Rash accompanied by swelling of the lips, tongue, eyelids, or difficulty breathing (Anaphylaxis - call 108 immediately!).',
      'Rapidly spreading purple or dark bruise-like spots that do not blanch under glass pressure.',
      'Extensive blistering peeling skin (Stevens-Johnson syndrome emergency).',
    ],
  },
  {
    id: 'joint_pain',
    symptomName: 'Joint Pain, Muscle Sprain & Backache',
    vernacularNames: ['जोड़ों का दर्द (Joint Pain)', 'कमर दर्द (Backache)', 'मोच / सूजन (Sprain)'],
    keywords: ['joint pain', 'knee pain', 'back pain', 'backache', 'sprain', 'arthritis', 'gathiya', 'kamar dard', 'muscle pain', 'swelling joint', 'neck pain'],
    severity: 'TELECONSULT',
    primaryCondition: 'Musculoskeletal Strain / Osteoarthritis / Tendonitis',
    clinicalSummary: 'Mechanical strain or articular cartilage inflammation causing localized musculoskeletal ache and stiffness.',
    recommendedMedicines: [
      {
        id: 'med-diclo-gel',
        name: 'Diclofenac Diethylamine Topical Gel 1.16%',
        genericName: 'Diclofenac Diethylamine + Virgin Linseed Oil + Methyl Salicylate',
        brandExamples: 'Volini Gel, Omnigel, Moov',
        dosage: 'Gently rub a thin layer over affected joint 3 times daily',
        form: 'Gel / Ointment',
        frequency: 'Thrice daily',
        timings: ['Morning', 'Afternoon', 'Bedtime'],
        mealTiming: 'With Water',
        purpose: 'Local NSAID penetration reducing joint inflammation and muscle stiffness without gastric side-effects.',
        category: 'OTC',
        safetyWarning: 'Do not massage vigorously on acute sprains. Wash hands after application. Avoid open wounds.',
        janAushadhiPrice: '₹20 per 30g tube (Jan Aushadhi) vs ₹95 branded',
        isGovtFree: true,
      },
      {
        id: 'med-pcm-joint',
        name: 'Paracetamol 650mg',
        genericName: 'Paracetamol IP 650mg',
        brandExamples: 'Dolo 650, Calpol',
        dosage: '1 Tablet (650mg)',
        form: 'Tablet',
        frequency: 'Twice daily',
        timings: ['Morning', 'Bedtime'],
        mealTiming: 'After Food',
        purpose: 'First-line oral analgesic recommended by clinical guidelines for safe osteoarthritis and joint pain management.',
        category: 'OTC',
        safetyWarning: 'Safer on stomach than conventional NSAIDs. Maximum 3 tablets daily.',
        janAushadhiPrice: '₹12 for strip of 10 (Jan Aushadhi) vs ₹35 branded',
        isGovtFree: true,
      },
    ],
    homeCareTips: [
      'For acute sprains (within 48 hours): Follow RICE protocol (Rest, Ice pack for 15 mins, Compression crepe bandage, Elevation).',
      'For chronic knee/back stiffness: Warm hot water fermentation or heating pad for 15 minutes before bed.',
      'Gentle low-impact range-of-motion stretching exercises.',
    ],
    redFlags: [
      'Inability to bear any weight on the leg or joint following a fall (possible fracture).',
      'Hot, intensely swollen, red joint with high fever (Septic Arthritis emergency).',
    ],
  },
  {
    id: 'emergency_cardiac',
    symptomName: 'Severe Chest Pain, Breathlessness & Heart Emergency',
    vernacularNames: ['सीने में दर्द (Chest Pain)', 'सांस फूलना (Shortness of Breath)', 'दिल का दौरा (Heart Attack)'],
    keywords: ['chest', 'chest pain', 'heart', 'heart attack', 'cardiac', 'sweating', 'breathless', 'shortness of breath', 'left arm', 'suffocation', 'stroke'],
    severity: 'EMERGENCY',
    primaryCondition: 'Acute Coronary Syndrome / Myocardial Infarction / Pulmonary Edema',
    clinicalSummary: 'Life-threatening cardiac or vascular ischemia requiring emergency hospital catheterization or thrombolysis.',
    recommendedMedicines: [
      {
        id: 'med-aspirin-emergency',
        name: 'Aspirin (Disprin / Soluble Aspirin) 300mg',
        genericName: 'Acetylsalicylic Acid (Aspirin) IP 300mg - 325mg',
        brandExamples: 'Disprin 350mg, Ecosprin 325mg, Loprin',
        dosage: '1 Soluble Tablet chewed or dissolved in 1/4 glass of water immediately',
        form: 'Tablet',
        frequency: 'As needed',
        timings: ['Morning'],
        mealTiming: 'With Water',
        purpose: 'Anti-platelet agent: prevents clot progression inside coronary arteries during acute heart attack.',
        category: 'FIRST_AID',
        safetyWarning: 'EMERGENCY FIRST AID ONLY while waiting for 108 Ambulance dispatch. Do NOT take if known active bleeding ulcer or aspirin allergy.',
        janAushadhiPrice: '₹3 for strip of 10 (Jan Aushadhi) vs ₹12 branded',
        isGovtFree: true,
      },
      {
        id: 'med-sorbitrate-emergency',
        name: 'Isosorbide Dinitrate (Sorbitrate) 5mg',
        genericName: 'Isosorbide Dinitrate 5mg Sublingual Tablet',
        brandExamples: 'Sorbitrate 5mg, Isordil',
        dosage: '1 Tablet placed under the tongue (sublingually)',
        form: 'Tablet',
        frequency: 'As needed',
        timings: ['Morning'],
        mealTiming: 'With Water',
        purpose: 'Coronary vasodilator: relaxes coronary arteries to restore immediate oxygenated blood flow to myocardium.',
        category: 'PRESCRIPTION_ONLY',
        safetyWarning: 'Only for patients with known diagnosed cardiac angina under prior physician prescription. Keep patient seated (may cause dizziness/BP drop).',
        janAushadhiPrice: '₹9 for strip of 10 (Jan Aushadhi) vs ₹32 branded',
        isGovtFree: true,
      },
    ],
    homeCareTips: [
      'Call Emergency 108 Ambulance immediately — every minute saves cardiac muscle.',
      'Keep patient resting quietly in a half-seated upright position (propped up with pillows).',
      'Loosen tight collar, belt, and clothing. Ensure maximum fresh air circulation.',
    ],
    redFlags: [
      'Heavy pressure, squeezing, or crushing pain in center of chest radiating to left arm, neck, jaw, or back.',
      'Chest pain accompanied by cold profuse sweating, extreme nausea, lightheadedness, or gray pallor.',
      'Acute shortness of breath at rest.',
    ],
  },
];

/**
 * Match a freeform symptom query against our clinical database
 * and return matching medicines, remedies, and red flags.
 */
export function getSuggestedMedicinesForQuery(query: string): {
  matchedEntry: SymptomMedicineEntry | null;
  medicines: SuggestedMedicine[];
  homeCareTips: string[];
  redFlags: string[];
} {
  const clean = query.trim().toLowerCase();
  if (!clean) {
    return {
      matchedEntry: null,
      medicines: [],
      homeCareTips: [],
      redFlags: [],
    };
  }

  // Find the best matching entry
  let bestEntry: SymptomMedicineEntry | null = null;
  let highestMatchCount = 0;

  for (const entry of SYMPTOM_MEDICINE_DATABASE) {
    let matchCount = 0;

    // Check direct symptom name
    if (clean.includes(entry.id) || clean.includes(entry.symptomName.toLowerCase())) {
      matchCount += 3;
    }

    // Check keywords
    for (const kw of entry.keywords) {
      if (clean.includes(kw)) {
        matchCount += 2;
      }
    }

    // Check vernacular names
    for (const v of entry.vernacularNames) {
      if (clean.includes(v.toLowerCase())) {
        matchCount += 3;
      }
    }

    if (matchCount > highestMatchCount) {
      highestMatchCount = matchCount;
      bestEntry = entry;
    }
  }

  // Fallback: If no single entry got high points, check multi-word matching
  if (!bestEntry) {
    for (const entry of SYMPTOM_MEDICINE_DATABASE) {
      for (const kw of entry.keywords) {
        if (kw.split(' ').some((word) => word.length >= 4 && clean.includes(word))) {
          bestEntry = entry;
          break;
        }
      }
      if (bestEntry) break;
    }
  }

  // If found, return its data, otherwise return safe general first-aid medicines
  if (bestEntry) {
    return {
      matchedEntry: bestEntry,
      medicines: bestEntry.recommendedMedicines,
      homeCareTips: bestEntry.homeCareTips,
      redFlags: bestEntry.redFlags,
    };
  }

  // General fallback for unspecified mild complaints
  return {
    matchedEntry: null,
    medicines: [
      {
        id: 'med-fallback-pcm',
        name: 'Paracetamol 500mg',
        genericName: 'Paracetamol IP 500mg',
        brandExamples: 'Crocin 500, Calpol 500',
        dosage: '1 Tablet',
        form: 'Tablet',
        frequency: 'As needed',
        timings: ['Morning', 'Bedtime'],
        mealTiming: 'After Food',
        purpose: 'First-line relief for general mild pain, discomfort, or low-grade pyrexia.',
        category: 'OTC',
        safetyWarning: 'Do not exceed 2500mg/day. Drink plenty of water.',
        janAushadhiPrice: '₹9 for strip of 10 (Jan Aushadhi)',
        isGovtFree: true,
      },
      {
        id: 'med-fallback-ors',
        name: 'Oral Rehydration Solution (ORS)',
        genericName: 'WHO Electrolyte Maintenance Formula',
        brandExamples: 'Electral Sachet',
        dosage: '1 Sachet in 1L clean drinking water',
        form: 'Sachet',
        frequency: 'As needed',
        timings: ['Morning', 'Afternoon', 'Evening'],
        mealTiming: 'With Water',
        purpose: 'Maintains optimal fluid and electrolyte balance during general malaise.',
        category: 'OTC',
        safetyWarning: 'Safe for all age groups.',
        janAushadhiPrice: '₹4.50 per sachet',
        isGovtFree: true,
      },
    ],
    homeCareTips: [
      'Stay well hydrated with boiled lukewarm water and light nourishment.',
      'Take 8 hours of adequate rest.',
      'If symptoms do not improve within 48 hours, schedule an e-Sanjeevani teleconsultation.',
    ],
    redFlags: [
      'Sudden high fever or breathlessness.',
      'Severe localized persistent pain.',
    ],
  };
}

/**
 * Return quick autocomplete hints for live symptom typing
 */
export function getLiveSymptomSuggestions(input: string): Array<{
  symptomTitle: string;
  matchedKeywords: string[];
  suggestedPillPreview: string;
  severity: SeverityLevel;
}> {
  const clean = input.trim().toLowerCase();
  if (clean.length < 2) return [];

  const matches: Array<{
    symptomTitle: string;
    matchedKeywords: string[];
    suggestedPillPreview: string;
    severity: SeverityLevel;
  }> = [];

  for (const entry of SYMPTOM_MEDICINE_DATABASE) {
    const isMatched =
      entry.keywords.some((kw) => kw.includes(clean) || clean.includes(kw)) ||
      entry.symptomName.toLowerCase().includes(clean) ||
      entry.vernacularNames.some((vn) => vn.toLowerCase().includes(clean));

    if (isMatched) {
      const topPills = entry.recommendedMedicines
        .slice(0, 2)
        .map((m) => m.name.split(' ')[0] + ' ' + (m.brandExamples.split(',')[0] || ''))
        .join(', ');

      matches.push({
        symptomTitle: entry.symptomName,
        matchedKeywords: entry.keywords.filter((kw) => kw.includes(clean) || clean.includes(kw)).slice(0, 3),
        suggestedPillPreview: topPills,
        severity: entry.severity,
      });
    }
  }

  return matches.slice(0, 4);
}
