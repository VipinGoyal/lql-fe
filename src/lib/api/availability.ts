import { api } from "./api";

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

export interface CreateAvailabilityPatternData {
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

export const availabilityApi = {
  // Set a new availability pattern
  setAvailabilityPattern: async (data: CreateAvailabilityPatternData): Promise<AvailabilityPattern> => {
    const response = await api.post("/availability/patterns", data);
    return response.data;
  },

  // Get all availability patterns for a provider
  getAvailabilityPatterns: async (providerId: string): Promise<AvailabilityPattern[]> => {
    const response = await api.get<{ data: AvailabilityPattern[] }>(`/availability/patterns/${providerId}`);
    return response.data.data;
  },

  // Update an existing availability pattern
  updateAvailabilityPattern: async (
    id: string,
    data: Partial<CreateAvailabilityPatternData>
  ): Promise<AvailabilityPattern> => {
    const response = await api.put(`/availability/patterns/${id}`, data);
    return response.data;
  },

  // Delete an availability pattern
  deleteAvailabilityPattern: async (id: string): Promise<void> => {
    await api.delete(`/availability/patterns/${id}`);
  },

  // Get availability for a specific date range
  getAvailability: async (providerId: string, startDate: string, endDate: string): Promise<DailyAvailability[]> => {
    const response = await api.get(`/availability/${providerId}`, {
      params: { startDate, endDate },
    });
    return response.data;
  },

  getAvailableSlots: async (providerId: string, date: string): Promise<{ slots: TimeSlot[] }> => {
    const response = await api.get(`/availability/slots/${providerId}`, {
      params: { date },
    });
    return response.data;
  },
};
