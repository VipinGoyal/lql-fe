import { PatientWithDetails } from "@/types/patient";
import { formatDate } from "@/lib/utils/date";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface PatientCardProps {
  patient: PatientWithDetails;
  onClick: () => void;
}

export default function PatientCard({ patient, onClick }: PatientCardProps) {
  return (
    <Card onClick={onClick} className="hover:bg-accent/50 transition-colors cursor-pointer">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Avatar className="h-12 w-12">
          <AvatarImage src={patient.user.profileImage} alt={patient.user.name} />
          <AvatarFallback>{patient.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold leading-none">{patient.user.name}</h3>
          <p className="text-sm text-muted-foreground">
            {formatDate(new Date(patient.dateOfBirth))} • {patient.gender}
          </p>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Appointments</p>
            <p className="text-lg font-medium leading-none">{patient.appointments.length}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Records</p>
            <p className="text-lg font-medium leading-none">{patient.medicalRecords.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
