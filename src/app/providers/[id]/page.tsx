"use client";

import { useEffect, useState } from "react";
import { providersApi, Provider } from "@/lib/api/providers";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ProviderDetailPage() {
  const params = useParams();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const data = await providersApi.getProviderById(params.id as string);
        setProvider(data);
      } catch (err) {
        setError("Failed to load provider details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading provider details...</div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error || "Provider not found"}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/providers" className="text-blue-500 hover:text-blue-600">
          ← Back to Providers
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{provider.user.name}</h1>
            <p className="text-gray-600">{provider.user.email}</p>
          </div>
          <Link
            href={`/providers/${provider.id}/availability`}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Manage Availability
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">Specialties</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {provider.specialties.map((specialty, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700">Credentials</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {provider.credentials.map((credential, index) => (
                    <span key={index} className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
                      {credential}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700">Biography</h3>
                <p className="mt-1 text-gray-600">{provider.biography}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Availability</h2>
            <div className="space-y-4">
              {provider.availabilityPatterns?.map((pattern, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-2">
                    Pattern {index + 1}: {pattern.pattern}
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Days:</span>{" "}
                      {pattern.daysOfWeek
                        .map((day) => {
                          const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                          return days[day - 1];
                        })
                        .join(", ")}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span> {pattern.startTime} - {pattern.endTime}
                    </p>
                    <p>
                      <span className="font-medium">Appointment Types:</span> {pattern.appointmentTypes.join(", ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
