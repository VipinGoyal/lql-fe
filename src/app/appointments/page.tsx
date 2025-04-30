"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppointmentList } from "@/components/appointments/AppointmentList";
import { Button } from "@/components/ui/button";
import { appointmentsApi } from "@/lib/api/appointments";
import { TEST_PROVIDER } from "@/lib/test-data";
import type { Appointment } from "@/lib/api/appointments";

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentsApi.getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Failed to load appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (appointmentId: string) => {
    router.push(`/appointments/${appointmentId}`);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <Button onClick={() => router.push("/doctors")}>Book New Appointment</Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <AppointmentList appointments={appointments} onViewDetails={handleViewDetails} />
      )}
    </div>
  );
}
