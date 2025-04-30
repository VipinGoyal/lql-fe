import axios from "axios";
import { TEST_APPOINTMENTS, generateTestAvailability } from "@/lib/test-data";
import { api } from "./api";
import type { Appointment, TimeSlot } from "@/types/appointment";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface CreateAppointmentData {
  providerId: string;
  patientId: string;
  startTime: string;
  endTime: string;
  appointmentType: string;
  chiefComplaint: string;
  notes?: string;
  virtualAppointment?: boolean;
  // date: string;
  // slot: string;
}

export interface AvailabilityResponse {
  date: string;
  availableSlots: string[];
}

export interface ExtendedAppointment extends Omit<Appointment, "startTime" | "endTime" | "status"> {
  startTime: string;
  endTime: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  patient: {
    id: string;
    user: {
      name: string;
      email: string;
    };
  };
  provider: {
    id: string;
    user: {
      name: string;
      email: string;
    };
  };
  date: string;
  slot: string;
  followUpNeeded: boolean;
  followUpTimeframe?: string;
  insuranceVerified: boolean;
  copayAmount?: number;
  virtualAppointment: boolean;
  meetingLink?: string;
  createdAt: string;
  updatedAt: string;
}

export const appointmentsApi = {
  async getAvailability(providerId: string, startDate: Date, endDate: Date): Promise<AvailabilityResponse[]> {
    try {
      const response = await api.get<{ data: AvailabilityResponse[] }>(`/availability/provider/${providerId}`, {
        params: { startDate, endDate },
      });
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch availability");
      }
      throw new Error("An unexpected error occurred");
    }
  },

  async getAvailableDates(providerId: string, startDate: Date, endDate: Date): Promise<Date[]> {
    try {
      const response = await api.get<{ data: Date[] }>(`/availability/dates/${providerId}`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      return response.data.data.map((date) => new Date(date));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch available dates");
      }
      throw new Error("An unexpected error occurred");
    }
  },

  getAvailableSlots: async (providerId: string, date: string): Promise<TimeSlot[]> => {
    try {
      const response = await api.get<{ data: { startTime: string; endTime: string }[] }>(
        `/availability/slots/${providerId}`,
        {
          params: {
            date,
            duration: 30, // duration in minutes
          },
        }
      );

      // Map the response to TimeSlot objects with consistent time format
      return response.data.data.map((slot) => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
        isAvailable: true,
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch available slots");
      }
      throw new Error("An unexpected error occurred");
    }
  },

  createAppointment: async (data: CreateAppointmentData): Promise<Appointment> => {
    try {
      const response = await api.post<{ data: Appointment }>("/appointments", data);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to create appointment");
      }
      throw new Error("An unexpected error occurred");
    }
  },

  getAppointments: async (): Promise<Appointment[]> => {
    const response = await api.get("/appointments");
    return response.data.data;
  },

  updateAppointmentStatus: async (
    id: string,
    status: "SCHEDULED" | "COMPLETED" | "CANCELLED"
  ): Promise<Appointment> => {
    const response = await api.patch(`/appointments/${id}/status`, { status });
    return response.data;
  },

  getAppointment: async (id: string): Promise<Appointment> => {
    const response = await api.get(`/appointments/${id}`);
    return response.data.data;
  },
};
