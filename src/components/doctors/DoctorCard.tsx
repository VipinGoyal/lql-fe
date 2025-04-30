import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ProviderWithDetails } from "@/types/provider";

interface DoctorCardProps {
  provider: ProviderWithDetails;
  onClick: () => void;
}

export default function DoctorCard({ provider, onClick }: DoctorCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{provider.user.name}</h3>
            <p className="text-sm text-muted-foreground">{provider.specialties.join(", ")}</p>
          </div>
          {provider.rating && (
            <Badge variant="secondary">
              ★ {provider.rating.toFixed(1)} ({provider.reviewCount})
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm line-clamp-3">{provider.biography}</p>
          <div className="flex flex-wrap gap-1">
            {provider.credentials.map((credential, index) => (
              <Badge key={index} variant="outline">
                {credential}
              </Badge>
            ))}
          </div>
        </div>
        <Button onClick={onClick} className="w-full">
          Book Appointment
        </Button>
      </CardContent>
    </Card>
  );
}
