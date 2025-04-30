import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold">
              HealthCare
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/appointments"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Appointments
              </Link>
              <Link
                href="/patients"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Patients
              </Link>
              <Link
                href="/doctors"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Doctors
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/signin">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
