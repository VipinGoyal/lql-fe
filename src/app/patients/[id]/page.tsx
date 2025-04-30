import { Suspense } from "react";
import Link from "next/link";
import PatientDetails from "@/components/patients/PatientDetails";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface PatientPageProps {
  params: {
    id: string;
  };
}

export default function PatientPage({ params }: PatientPageProps) {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/patients">
          <Button variant="outline">← Back to Patients</Button>
        </Link>
      </div>
      <Suspense
        fallback={
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
            ))}
          </div>
        }
      >
        <PatientDetails patientId={params.id} />
      </Suspense>
    </div>
  );
}
