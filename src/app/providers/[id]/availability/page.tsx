import React from "react";
import AvailabilityManager from "@/components/availability/AvailabilityManager";

interface ProviderAvailabilityPageProps {
  params: {
    id: string;
  };
}

export default function ProviderAvailabilityPage({ params }: ProviderAvailabilityPageProps) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Provider Availability</h1>
      <AvailabilityManager providerId={params.id} />
    </div>
  );
}
