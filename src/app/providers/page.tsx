"use client";

import { useEffect, useState } from "react";
import { providersApi, Provider } from "@/lib/api/providers";
import Link from "next/link";

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await providersApi.getAllProviders();
        setProviders(data);
      } catch (err) {
        setError("Failed to load providers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading providers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Healthcare Providers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <div key={provider.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">{provider.user.name}</h2>
            <div className="mb-4">
              <h3 className="font-medium text-gray-700">Specialties:</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {provider.specialties.map((specialty, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <h3 className="font-medium text-gray-700">Credentials:</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {provider.credentials.map((credential, index) => (
                  <span key={index} className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
                    {credential}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-gray-600 mb-6 line-clamp-3">{provider.biography}</p>
            <div className="flex gap-4">
              <Link
                href={`/providers/${provider.id}`}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                View Profile
              </Link>
              <Link
                href={`/providers/${provider.id}/availability`}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              >
                Manage Availability
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
