"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { CreateAppointmentData } from "@/lib/api/appointments";
import { appointmentsApi } from "@/lib/api/appointments";
import { Button } from "@/components/ui/button";
import { TimeSlot } from "@/types/appointment";
import { AppointmentCalendar } from "@/components/appointments/AppointmentCalendar";
import { providersApi, Provider } from "@/lib/api/providers";

interface PageProps {
  params: {
    id: string;
  };
}

export default function DoctorPage({ params }: PageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  useEffect(() => {
    loadProvider();
  }, [params.id]);

  const loadProvider = async () => {
    try {
      const data = await providersApi.getProviderById(params.id);
      setProvider(data);
    } catch (error) {
      console.error("Error loading provider:", error);
      toast({
        title: "Error",
        description: "Failed to load provider details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
        providerId: params.id,
        patientId: "1", // TODO: Get from auth context
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        appointmentType: "Regular Checkup",
        chiefComplaint: "Regular checkup",
        notes: "Appointment booked through doctor's page",
        virtualAppointment: false,
        // date: selectedDate.toISOString().split("T")[0],
        // slot: `${selectedSlot.startTime}-${selectedSlot.endTime}`,
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600">Provider not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold mb-4">{provider.user.name}</h1>
            <p className="text-muted-foreground mb-2">Specialization: {provider.specialties.join(", ")}</p>
            {/* <p className="text-muted-foreground">Experience: {provider.yearsOfExperience} years</p> */}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Book an Appointment</h2>
          <AppointmentCalendar providerId={params.id} onSlotSelect={handleSlotSelect} />

          {selectedDate && selectedSlot && (
            <div className="flex justify-end">
              <Button onClick={handleBookAppointment}>Book Appointment</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
