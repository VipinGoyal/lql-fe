"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { appointmentsApi } from "@/lib/api/appointments";
import type { TimeSlot } from "@/types/appointment";
import { format, addDays, parse, isSameDay, isToday, startOfDay, endOfDay } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface AppointmentCalendarProps {
  providerId: string;
  onSlotSelect: (date: Date, slot: TimeSlot) => void;
}

export function AppointmentCalendar({ providerId, onSlotSelect }: AppointmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  useEffect(() => {
    loadAvailableDates();
  }, [providerId]);

  useEffect(() => {
    if (selectedDate) {
      loadAvailability();
    }
  }, [selectedDate]);

  const loadAvailableDates = async () => {
    try {
      // Get the next 30 days
      const today = startOfDay(new Date());
      const thirtyDaysFromNow = endOfDay(addDays(today, 30));

      // Get all available dates for the next 30 days
      const dates = await appointmentsApi.getAvailableDates(providerId, today, thirtyDaysFromNow);
      setAvailableDates(dates);
    } catch (error) {
      console.error("Error loading available dates:", error);
    }
  };

  const loadAvailability = async () => {
    if (!selectedDate) return;

    setLoading(true);
    try {
      // Format the date as YYYY-MM-DD to avoid timezone issues
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const slots = await appointmentsApi.getAvailableSlots(providerId, formattedDate);
      setAvailableSlots(slots);
    } catch (error) {
      console.error("Error loading availability:", error);
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleSlotSelect = (date: Date, slot: TimeSlot) => {
    setSelectedSlot(slot);
    onSlotSelect(date, slot);
  };

  const isDateDisabled = (date: Date) => {
    // Disable dates outside the valid range (past dates and dates beyond 30 days)
    const today = startOfDay(new Date());
    const thirtyDaysFromNow = endOfDay(addDays(today, 30));

    // Check if date is in the past or beyond 30 days
    if (date < today || date > thirtyDaysFromNow) {
      return true;
    }

    // Check if date has any available slots
    return !availableDates.some((availableDate) => isSameDay(availableDate, date));
  };

  // Group time slots by morning, afternoon, and evening
  const groupedSlots = availableSlots.reduce(
    (acc, slot) => {
      const hour = new Date(slot.startTime).getHours();
      if (hour < 12) acc.morning.push(slot);
      else if (hour < 17) acc.afternoon.push(slot);
      else acc.evening.push(slot);
      return acc;
    },
    { morning: [] as TimeSlot[], afternoon: [] as TimeSlot[], evening: [] as TimeSlot[] }
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr,400px] gap-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Select a Date</h2>
        <Calendar
          mode="single"
          selected={selectedDate || undefined}
          onSelect={handleDateSelect}
          className="rounded-md border"
          disabled={isDateDisabled}
          fromDate={new Date()}
          toDate={addDays(new Date(), 30)}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Available Times</h2>
        {selectedDate ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <h3 className="font-medium">
                  {isToday(selectedDate) ? "Today" : format(selectedDate, "EEEE, MMMM d")}
                </h3>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-[400px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-6">
                    {/* Morning slots */}
                    {groupedSlots.morning.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">Morning</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {groupedSlots.morning.map((slot, index) => (
                            <Button
                              key={index}
                              variant={
                                selectedSlot && selectedSlot.startTime === slot.startTime ? "default" : "outline"
                              }
                              onClick={() => handleSlotSelect(selectedDate, slot)}
                              className={`w-full ${
                                selectedSlot && selectedSlot.startTime === slot.startTime
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:border-primary hover:text-primary"
                              }`}
                            >
                              {format(new Date(slot.startTime), "h:mm a")}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Afternoon slots */}
                    {groupedSlots.afternoon.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">Afternoon</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {groupedSlots.afternoon.map((slot, index) => (
                            <Button
                              key={index}
                              variant={
                                selectedSlot && selectedSlot.startTime === slot.startTime ? "default" : "outline"
                              }
                              onClick={() => handleSlotSelect(selectedDate, slot)}
                              className={`w-full ${
                                selectedSlot && selectedSlot.startTime === slot.startTime
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:border-primary hover:text-primary"
                              }`}
                            >
                              {format(new Date(slot.startTime), "h:mm a")}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Evening slots */}
                    {groupedSlots.evening.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">Evening</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {groupedSlots.evening.map((slot, index) => (
                            <Button
                              key={index}
                              variant={
                                selectedSlot && selectedSlot.startTime === slot.startTime ? "default" : "outline"
                              }
                              onClick={() => handleSlotSelect(selectedDate, slot)}
                              className={`w-full ${
                                selectedSlot && selectedSlot.startTime === slot.startTime
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:border-primary hover:text-primary"
                              }`}
                            >
                              {format(new Date(slot.startTime), "h:mm a")}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {availableSlots.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        No available times on this date. Please select a different date.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-4 text-muted-foreground">Please select a date to view available times</div>
        )}
      </div>
    </div>
  );
}
