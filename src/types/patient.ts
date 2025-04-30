export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  profileImage?: string;
}

export interface Patient {
  id: string;
  userId: string;
  dateOfBirth: string;
  gender: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  preferredPharmacy: {
    name: string;
    address: string;
    phone: string;
  };
  user: User;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  providerId: string;
  date: string;
  symptoms: string[];
  diagnosis: string[];
  treatment: string;
  followUpInstructions?: string;
  vitalSigns: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    respiratoryRate: number;
  };
}

export interface PatientWithDetails extends Patient {
  medicalRecords: MedicalRecord[];
  appointments: any[]; // We'll type this properly when implementing appointments
  insuranceInfo: any[]; // We'll type this properly when implementing insurance
}
