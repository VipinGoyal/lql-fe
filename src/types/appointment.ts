import { User } from "@/types/user";

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Appointment {
  id: string;
  providerId: string;
  patientId: string;
  startTime: Date;
  endTime: Date;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  type: string;
  notes?: string;
  appointmentType: string;
  chiefComplaint: string;
  provider: {
    id: string;
    user: {
      name: string;
      email: string;
    };
  };
  patient: {
    id: string;
    user: {
      name: string;
      email: string;
    };
  };
}
