import { addDays, setHours, setMinutes } from "date-fns";

export const TEST_USER = {
  id: "test-user-1",
  email: "patient1@example.com",
  name: "Amit Jain",
  role: "PATIENT",
};

export const TEST_PROVIDER = {
  id: "test-provider-1",
  userId: TEST_USER.id,
  specialties: ["General Medicine", "Family Practice"],
  credentials: ["MD", "FACP"],
  npiNumber: "1234567890",
  appointmentTypes: ["Regular Checkup", "Follow-up", "Consultation", "Urgent Care"],
};

export const generateTestAvailability = (startDate: Date = new Date()) => {
  const availability = [];
  for (let i = 0; i < 14; i++) {
    const date = addDays(startDate, i);
    const slots = [];

    // Generate slots from 9 AM to 5 PM
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const startTime = setMinutes(setHours(date, hour), minute);
        const endTime = setMinutes(setHours(date, hour), minute + 30);

        slots.push({
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          isAvailable: Math.random() > 0.3, // 70% chance of being available
        });
      }
    }

    availability.push({
      date,
      slots,
    });
  }
  return availability;
};

export const TEST_APPOINTMENTS = [
  {
    id: "apt-1",
    patientId: "patient-1",
    providerId: TEST_PROVIDER.id,
    appointmentType: "Regular Checkup",
    startTime: addDays(new Date(), 1).toISOString(),
    endTime: addDays(new Date(), 1).toISOString(),
    status: "SCHEDULED",
    patient: {
      id: "patient-1",
      user: {
        name: "Alice Johnson",
        email: "alice@example.com",
      },
    },
  },
  // Add more test appointments...
];
