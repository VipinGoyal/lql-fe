"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppointmentCalendar } from "@/components/appointments/AppointmentCalendar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { appointmentsApi } from "@/lib/api/appointments";
import type { CreateAppointmentData } from "@/lib/api/appointments";
import { TimeSlot } from "@/types/appointment";

interface PageProps {
  params: {
    providerId: string;
  };
}

export default function BookAppointmentPage({ params }: PageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const handleSlotSelect = (date: Date, slot: TimeSlot) => {
    setSelectedDate(date);
    setSelectedSlot(slot);
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedSlot) {
      toast({
        title: "Error",
        description: "Please select a date and time slot",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    try {
      const startTime = new Date(selectedSlot.startTime);
      const endTime = new Date(selectedSlot.endTime);

      const appointmentData: CreateAppointmentData = {
        providerId: params.providerId,
        patientId: "1", // TODO: Get from auth context
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        appointmentType: "Regular Checkup",
        chiefComplaint: "Regular checkup",
        notes: "Appointment booked through booking page",
        virtualAppointment: false,
        // date: selectedDate.toISOString().split("T")[0], // Format: YYYY-MM-DD
        // slot: `${selectedSlot.startTime}-${selectedSlot.endTime}`, // Convert TimeSlot to string format
      };

      await appointmentsApi.createAppointment(appointmentData);

      toast({
        title: "Success",
        description: "Appointment booked successfully!",
        variant: "default",
        duration: 5000,
      });
      router.push("/appointments");
    } catch (error) {
      console.error("Error booking appointment:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to book appointment";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book an Appointment</h1>
      <div className="max-w-2xl mx-auto space-y-6">
        <AppointmentCalendar providerId={params.providerId} onSlotSelect={handleSlotSelect} />

        {selectedDate && selectedSlot && (
          <div className="flex justify-end">
            <Button onClick={handleBookAppointment}>Book Appointment</Button>
          </div>
        )}
      </div>
    </div>
  );
}
