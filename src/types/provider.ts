import { User } from "./user";

export interface Provider {
  id: string;
  userId: string;
  specialties: string[];
  credentials: string[];
  npiNumber: string;
  acceptedInsurance: string[];
  biography: string;
  education: string[];
  hospitalAffiliations: string[];
  languages: string[];
  appointmentTypes: string[];
}
