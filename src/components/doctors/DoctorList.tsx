"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProviderWithDetails } from "@/types/provider";
import { providersApi } from "@/lib/api/providers";
import DoctorCard from "./DoctorCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function DoctorList() {
  const router = useRouter();
  const [providers, setProviders] = useState<ProviderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await providersApi.getAllProviders();
      if (data && Array.isArray(data)) {
        setProviders(data);
      } else {
        setError("Invalid data format received from server");
      }
    } catch (err) {
      console.error("Error loading providers:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load providers. Please check if the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4 p-6 border rounded-lg">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-background border rounded-lg space-y-4">
        <p className="text-destructive font-medium">Error: {error}</p>
        <p className="text-sm text-muted-foreground">
          Please ensure the backend server is running at http://localhost:3000
        </p>
        <Button variant="outline" onClick={loadProviders}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map((provider) => (
          <DoctorCard key={provider.id} provider={provider} onClick={() => router.push(`/doctors/${provider.id}`)} />
        ))}
      </div>
      {providers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No healthcare providers found</p>
        </div>
      )}
    </div>
  );
}
