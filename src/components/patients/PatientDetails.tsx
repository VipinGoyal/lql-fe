"use client";

import { useState, useEffect } from "react";
import { PatientWithDetails } from "@/types/patient";
import { patientsApi } from "@/lib/api/patients";
import { formatDate } from "@/lib/utils/date";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

interface PatientDetailsProps {
  patientId: string;
}

export default function PatientDetails({ patientId }: PatientDetailsProps) {
  const [patient, setPatient] = useState<PatientWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPatient();
  }, [patientId]);

  const loadPatient = async () => {
    try {
      setLoading(true);
      const data = await patientsApi.getPatientById(patientId);
      setPatient(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load patient details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4">
          <p className="text-destructive">{error}</p>
          <Button variant="outline" onClick={loadPatient}>
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!patient) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <Avatar className="h-16 w-16">
            <AvatarImage src={patient.user.profileImage} alt={patient.user.name} />
            <AvatarFallback>{patient.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold">{patient.user.name}</h1>
            <p className="text-muted-foreground">
              {formatDate(new Date(patient.dateOfBirth))} • {patient.gender}
            </p>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Contact Information</h2>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{patient.user.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="font-medium">{patient.user.phone}</p>
          </div>
          <div className="md:col-span-2 space-y-1">
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="font-medium">
              {patient.user.address.street}, {patient.user.address.city},{patient.user.address.state}{" "}
              {patient.user.address.zipCode}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Emergency Contact</h2>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{patient.emergencyContact.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Relationship</p>
            <p className="font-medium">{patient.emergencyContact.relationship}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="font-medium">{patient.emergencyContact.phone}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Medical Records</h2>
        </CardHeader>
        <CardContent>
          {patient.medicalRecords.length > 0 ? (
            <div className="space-y-4">
              {patient.medicalRecords.map((record) => (
                <div key={record.id} className="space-y-2">
                  <p className="text-sm text-muted-foreground">{formatDate(new Date(record.date))}</p>
                  <p className="font-medium">Diagnosis: {record.diagnosis.join(", ")}</p>
                  <p className="text-sm">{record.treatment}</p>
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No medical records available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
