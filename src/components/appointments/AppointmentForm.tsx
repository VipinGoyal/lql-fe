import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";

interface AppointmentFormProps {
  providerId: string;
  selectedDate?: Date;
  selectedSlot?: string;
  appointmentTypes: string[];
  onSubmit: (data: AppointmentFormData) => Promise<void>;
}

interface AppointmentFormData {
  providerId: string;
  date: Date;
  slot: string;
  appointmentType: string;
}

export function AppointmentForm({
  providerId,
  selectedDate,
  selectedSlot,
  appointmentTypes,
  onSubmit,
}: AppointmentFormProps) {
  const [date, setDate] = useState<Date | undefined>(selectedDate);
  const [slot, setSlot] = useState<string>(selectedSlot || "");
  const [appointmentType, setAppointmentType] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Time slots from 9 AM to 5 PM
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !slot || !appointmentType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const appointmentData: AppointmentFormData = {
        providerId,
        date,
        slot,
        appointmentType,
      };

      await onSubmit(appointmentData);

      toast({
        title: "Success",
        description: "Appointment booked successfully!",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to book appointment. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900">Book Appointment</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Date</label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            disabled={(date) => date < new Date()}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Select Time Slot</label>
          <Select value={slot} onValueChange={setSlot}>
            <SelectTrigger>
              <SelectValue placeholder="Select a time slot" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((timeSlot) => (
                <SelectItem key={timeSlot} value={timeSlot}>
                  {timeSlot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Appointment Type</label>
          <Select value={appointmentType} onValueChange={setAppointmentType}>
            <SelectTrigger>
              <SelectValue placeholder="Select appointment type" />
            </SelectTrigger>
            <SelectContent>
              {appointmentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Booking..." : "Book Appointment"}
        </Button>
      </div>
    </form>
  );
}
