"use client";

import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Appointment } from "@/types/appointment";

interface AppointmentListProps {
  appointments: Appointment[];
  onViewDetails: (appointmentId: string) => void;
}

export function AppointmentList({ appointments, onViewDetails }: AppointmentListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Doctor</TableHead>
          <TableHead>Patient</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appointment) => (
          <TableRow key={appointment.id}>
            <TableCell>{format(new Date(appointment.startTime), "MMM d, yyyy")}</TableCell>
            <TableCell>{format(new Date(appointment.startTime), "h:mm a")}</TableCell>
            <TableCell>{appointment.provider.user.name}</TableCell>
            <TableCell>{appointment.patient.user.name}</TableCell>
            <TableCell>{appointment.appointmentType}</TableCell>
            <TableCell>
              <Badge variant={appointment.status === "SCHEDULED" ? "default" : "secondary"}>{appointment.status}</Badge>
            </TableCell>
            <TableCell>
              <Button variant="outline" size="sm" onClick={() => onViewDetails(appointment.id)}>
                View Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
