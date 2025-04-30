import DoctorList from "@/components/doctors/DoctorList";

export default function DoctorsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Healthcare Providers</h1>
      </div>
      <DoctorList />
    </div>
  );
}
