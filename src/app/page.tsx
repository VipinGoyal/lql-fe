import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">Advanced Healthcare Management System</h1>
            <p className="text-xl text-gray-600">
              Streamline your healthcare practice with our comprehensive management solution
            </p>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/appointments">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/doctors">View Providers</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/images/healthcare-hero.jpg"
              alt="Healthcare Management"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-lg">
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                <Image src={feature.image} alt={feature.title} fill className="object-cover" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
              <ul className="mt-4 space-y-2">
                {feature.points.map((point, idx) => (
                  <li key={idx} className="flex items-center text-gray-600">
                    <span className="mr-2">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    title: "Appointment Management",
    description: "Schedule and manage patient appointments efficiently",
    image: "/images/appointment.jpg",
    points: ["Smart scheduling system", "Automated reminders", "Real-time availability"],
  },
  {
    title: "Patient Records",
    description: "Secure and organized patient information management",
    image: "/images/patient-records.jpg",
    points: ["Digital health records", "Medical history tracking", "Secure data storage"],
  },
  {
    title: "Healthcare Analytics",
    description: "Data-driven insights for better healthcare delivery",
    image: "/images/healthcare-analytics.jpg",
    points: ["Performance metrics", "Patient outcome tracking", "Resource optimization"],
  },
];
