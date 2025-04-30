import { api } from "./api";
import { CreateAppointmentData } from "@/lib/api/appointments";
import axios from "axios";
import { Appointment } from "@/types/appointment";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  specialization: string;
  experience: number;
  rating: number;
  availability?: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
  specialties: string[];
  credentials: string[];
  biography: string;
  appointmentTypes: string[];
  availabilityPatterns?: {
    pattern: string;
    daysOfWeek: number[];
    startTime: string;
    endTime: string;
    startDate: Date;
    appointmentTypes: string[];
  }[];
}

interface ProviderAvailability {
  availableSlots: string[];
  date: string;
}

export const providersApi = {
  getAllProviders: async (): Promise<Provider[]> => {
    try {
      const response = await api.get<{ data: { data: Provider[] } }>("/providers");
      return response.data.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch providers");
      }
      throw new Error("An unexpected error occurred");
    }
  },

  getProviderById: async (id: string): Promise<Provider> => {
    try {
      const response = await api.get<{ data: { data: Provider } }>(`/providers/${id}`);
      return response.data.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch provider");
      }
      throw new Error("An unexpected error occurred");
    }
  },

  updateProvider: async (id: string, data: Partial<Provider>): Promise<Provider> => {
    try {
      const response = await api.patch<{ data: Provider }>(`/providers/${id}`, data);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to update provider");
      }
      throw new Error("An unexpected error occurred");
    }
  },

  deleteProvider: async (id: string): Promise<void> => {
    try {
      await api.delete(`/providers/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to delete provider");
      }
      throw new Error("An unexpected error occurred");
    }
  },

  getProviderAvailability: async (
    providerId: string,
    startDate: string,
    endDate: string
  ): Promise<ProviderAvailability[]> => {
    try {
      const response = await api.get<{ data: ProviderAvailability[] }>(`/availability/provider/${providerId}`, {
        params: { startDate, endDate },
      });
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch provider availability");
      }
      throw new Error("An unexpected error occurred");
    }
  },

  createAppointment: async (appointmentData: CreateAppointmentData): Promise<Appointment> => {
    try {
      const response = await api.post<{ data: Appointment }>("/appointments", appointmentData);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to create appointment");
      }
      throw new Error("An unexpected error occurred");
    }
  },
};
