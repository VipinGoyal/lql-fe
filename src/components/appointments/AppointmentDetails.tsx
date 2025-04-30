"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface AppointmentDetailsProps {
  appointment: any; // Type this properly based on your data structure
  onStatusUpdate: (status: string) => void;
}

export function AppointmentDetails({ appointment, onStatusUpdate }: AppointmentDetailsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Appointment Details</CardTitle>
            <Badge>{appointment.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{format(new Date(appointment.startTime), "MMMM d, yyyy")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="font-medium">{format(new Date(appointment.startTime), "h:mm a")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Doctor</p>
              <p className="font-medium">{appointment.provider.user.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Patient</p>
              <p className="font-medium">{appointment.patient.user.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-medium">{appointment.appointmentType}</p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h3 className="font-semibold">Actions</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onStatusUpdate("COMPLETED")}
                disabled={appointment.status === "COMPLETED"}
              >
                Mark as Completed
              </Button>
              <Button
                variant="outline"
                onClick={() => onStatusUpdate("CANCELLED")}
                disabled={appointment.status === "CANCELLED"}
              >
                Cancel Appointment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
