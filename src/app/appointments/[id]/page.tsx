"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { appointmentsApi } from "@/lib/api/appointments";
import type { Appointment } from "@/types/appointment";
import { useToast } from "@/hooks/use-toast";

interface PageProps {
  params: {
    id: string;
  };
}

export default function AppointmentDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointment();
  }, [params.id]);

  const loadAppointment = async () => {
    try {
      setLoading(true);
      const data = await appointmentsApi.getAppointment(params.id);
      setAppointment(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load appointment details",
        variant: "destructive",
      });
      router.push("/appointments");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/4 bg-muted rounded" />
          <div className="h-[200px] bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Appointment not found</h2>
          <Button onClick={() => router.push("/appointments")} className="mt-4">
            Back to Appointments
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Appointment Details</h1>
        <Button variant="outline" onClick={() => router.push("/appointments")}>
          Back to Appointments
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium text-muted-foreground">Date & Time</h3>
              <p>{format(new Date(appointment.startTime), "PPP")}</p>
              <p>
                {format(new Date(appointment.startTime), "h:mm a")} - {format(new Date(appointment.endTime), "h:mm a")}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-muted-foreground">Status</h3>
              <Badge
                variant={
                  appointment.status === "SCHEDULED"
                    ? "default"
                    : appointment.status === "COMPLETED"
                    ? "secondary"
                    : "destructive"
                }
              >
                {appointment.status}
              </Badge>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-muted-foreground">Doctor</h3>
              <p>{appointment.provider.user.name}</p>
              <p className="text-sm text-muted-foreground">{appointment.provider.user.email}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-muted-foreground">Patient</h3>
              <p>{appointment.patient.user.name}</p>
              <p className="text-sm text-muted-foreground">{appointment.patient.user.email}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-muted-foreground">Appointment Type</h3>
              <p>{appointment.appointmentType}</p>
            </div>

            {appointment.chiefComplaint && (
              <div className="col-span-2 space-y-2">
                <h3 className="font-medium text-muted-foreground">Chief Complaint</h3>
                <p>{appointment.chiefComplaint}</p>
              </div>
            )}

            {appointment.notes && (
              <div className="col-span-2 space-y-2">
                <h3 className="font-medium text-muted-foreground">Notes</h3>
                <p>{appointment.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
