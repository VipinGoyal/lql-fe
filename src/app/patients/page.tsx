import PatientList from "@/components/patients/PatientList";

export default function PatientsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
      </div>
      <PatientList />
    </div>
  );
}
