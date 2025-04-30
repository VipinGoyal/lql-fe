export interface AvailabilityPattern {
  id: string;
  providerId: string;
  pattern: "WEEKLY" | "BIWEEKLY" | "ONE_TIME";
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  startDate: string;
  endDate?: string;
  appointmentTypes: string[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface DailyAvailability {
  date: string;
  slots: TimeSlot[];
}
