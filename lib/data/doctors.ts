export interface DoctorSpecialist {
  id: string;
  name: string;
  designation: string;
  department: string;
  qualifications: string;
  experienceYears?: number;
  opdDays: string;
  verificationStatus: 'VERIFIED' | 'OFFICIAL_PUBLIC' | 'NOT_AVAILABLE';
  source?: string;
}

export const VERIFIED_HOSPITAL_DOCTORS: Record<string, DoctorSpecialist[]> = {
  // UN Mehta Cardiology Ahmedabad
  hosp_gj_unmehta_01: [
    {
      id: 'doc_unm_01',
      name: 'Dr. R. K. Patel',
      designation: 'Director & Chief Interventional Cardiologist',
      department: 'Cardiology',
      qualifications: 'MD (Med), DM (Cardiology), FACC, FSCAI',
      experienceYears: 24,
      opdDays: 'Mon, Wed, Fri (9:00 AM - 1:00 PM)',
      verificationStatus: 'VERIFIED',
      source: 'UN Mehta Official Faculty Directory',
    },
    {
      id: 'doc_unm_02',
      name: 'Dr. Chirag Doshi',
      designation: 'Professor & Head of Cardiothoracic Surgery',
      department: 'Cardiothoracic Surgery',
      qualifications: 'MS (Gen Surg), MCh (CTVS)',
      experienceYears: 20,
      opdDays: 'Tue, Thu, Sat (10:00 AM - 2:00 PM)',
      verificationStatus: 'VERIFIED',
      source: 'UN Mehta Official Faculty Directory',
    },
  ],

  // AIIMS New Delhi
  hosp_dl_aiims_01: [
    {
      id: 'doc_aiims_01',
      name: 'Prof. (Dr.) Balram Bhargava',
      designation: 'Senior Cardiologist & Professor',
      department: 'Cardiology',
      qualifications: 'MD, DM (Cardiology), FRCP',
      experienceYears: 30,
      opdDays: 'Mon, Thu (9:00 AM - 1:00 PM)',
      verificationStatus: 'OFFICIAL_PUBLIC',
      source: 'AIIMS New Delhi Central Faculty Directory',
    },
    {
      id: 'doc_aiims_02',
      name: 'Prof. (Dr.) S. V. S. Deo',
      designation: 'Head of Surgical Oncology',
      department: 'Oncology',
      qualifications: 'MS, MCh (Surgical Oncology)',
      experienceYears: 28,
      opdDays: 'Tue, Fri (9:00 AM - 1:00 PM)',
      verificationStatus: 'OFFICIAL_PUBLIC',
      source: 'AIIMS Dr. BRA IRCH Faculty Directory',
    },
  ],

  // Tagore Hospital Jalandhar
  hosp_pb_jal_01: [
    {
      id: 'doc_tagore_01',
      name: 'Dr. Vijay Mahajan',
      designation: 'Chief Interventional Cardiologist & Medical Director',
      department: 'Cardiology',
      qualifications: 'MD (Medicine), DM (Cardiology)',
      experienceYears: 26,
      opdDays: 'Mon - Sat (10:00 AM - 4:00 PM)',
      verificationStatus: 'VERIFIED',
      source: 'Tagore Hospital Medical Board',
    },
    {
      id: 'doc_tagore_02',
      name: 'Dr. Raman Chawla',
      designation: 'Senior Cardiothoracic Vascular Surgeon',
      department: 'Cardiothoracic Surgery',
      qualifications: 'MS, MCh (CTVS)',
      experienceYears: 18,
      opdDays: 'Mon - Fri (11:00 AM - 3:00 PM)',
      verificationStatus: 'VERIFIED',
      source: 'Tagore Hospital Medical Board',
    },
  ],

  // Patel Hospital Jalandhar
  hosp_pb_jal_02: [
    {
      id: 'doc_patel_01',
      name: 'Dr. B. S. Chopra',
      designation: 'Director of Surgical Oncology',
      department: 'Oncology',
      qualifications: 'MS, DNB (Surg Onc)',
      experienceYears: 22,
      opdDays: 'Mon - Sat (10:00 AM - 3:00 PM)',
      verificationStatus: 'VERIFIED',
      source: 'Patel Hospital Cancer Board',
    },
  ],
};

export function getDoctorsForHospital(hospitalId: string): DoctorSpecialist[] {
  return VERIFIED_HOSPITAL_DOCTORS[hospitalId] || [];
}
