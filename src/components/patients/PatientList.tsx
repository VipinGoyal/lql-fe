"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PatientWithDetails } from "@/types/patient";
import { patientsApi } from "@/lib/api/patients";
import PatientCard from "./PatientCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function PatientList() {
  const router = useRouter();
  const [patients, setPatients] = useState<PatientWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await patientsApi.getAllPatients();
      setPatients(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-[150px] w-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-background border rounded-lg space-y-4">
        <p className="text-destructive">{error}</p>
        <Button variant="outline" onClick={loadPatients}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.map((patient) => (
          <PatientCard key={patient.id} patient={patient} onClick={() => router.push(`/patients/${patient.id}`)} />
        ))}
      </div>
      {patients.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No patients found</p>
        </div>
      )}
    </div>
  );
}
