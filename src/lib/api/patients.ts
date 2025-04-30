import axios from "axios";
import { Patient, PatientWithDetails } from "@/types/patient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const patientsApi = {
  async getAllPatients(): Promise<PatientWithDetails[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/patients`);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error("No patients found");
      }
      throw new Error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "Failed to fetch patients"
          : "An unexpected error occurred"
      );
    }
  },

  async getPatientById(id: string): Promise<PatientWithDetails> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/patients/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "Failed to fetch patient"
          : "An unexpected error occurred"
      );
    }
  },

  async getPatientMedicalRecords(patientId: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/patients/${patientId}/records`);
      return response.data.data;
    } catch (error) {
      throw new Error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "Failed to fetch medical records"
          : "An unexpected error occurred"
      );
    }
  },
};
