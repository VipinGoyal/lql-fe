"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { availabilityApi } from "@/lib/api/availability";
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

export default function AvailabilityManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [patterns, setPatterns] = useState<any[]>([]);
  const [providerId, setProviderId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Form state
  const [pattern, setPattern] = useState<"WEEKLY" | "BIWEEKLY" | "ONE_TIME">("WEEKLY");
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("17:00");
  const [startDate, setStartDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState<string>("");
  const [appointmentTypes, setAppointmentTypes] = useState<string[]>(["REGULAR", "FOLLOW_UP"]);

  useEffect(() => {
    // In a real app, get the provider ID from auth context
    // For now, we'll use a hardcoded ID from the seed data
    setProviderId("1"); // Assuming the first provider has ID 1
    loadAvailabilityPatterns();
  }, []);

  const loadAvailabilityPatterns = async () => {
    if (!providerId) return;

    try {
      setLoading(true);
      const data = await availabilityApi.getAvailabilityPatterns(providerId);
      setPatterns(data);
    } catch (error) {
      console.error("Error loading availability patterns:", error);
      toast({
        title: "Error",
        description: "Failed to load availability patterns",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDayToggle = (day: number) => {
    if (daysOfWeek.includes(day)) {
      setDaysOfWeek(daysOfWeek.filter((d) => d !== day));
    } else {
      setDaysOfWeek([...daysOfWeek, day].sort());
    }
  };

  const handleAppointmentTypeToggle = (type: string) => {
    if (appointmentTypes.includes(type)) {
      setAppointmentTypes(appointmentTypes.filter((t) => t !== type));
    } else {
      setAppointmentTypes([...appointmentTypes, type]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await availabilityApi.setAvailabilityPattern({
        providerId,
        pattern,
        daysOfWeek,
        startTime,
        endTime,
        startDate,
        endDate: endDate || undefined,
        appointmentTypes,
      });

      toast({
        title: "Success",
        description: "Availability pattern created successfully",
      });

      // Reset form
      setPattern("WEEKLY");
      setDaysOfWeek([]);
      setStartTime("09:00");
      setEndTime("17:00");
      setStartDate(format(new Date(), "yyyy-MM-dd"));
      setEndDate("");
      setAppointmentTypes(["REGULAR", "FOLLOW_UP"]);

      // Reload patterns
      loadAvailabilityPatterns();
    } catch (error) {
      console.error("Error creating availability pattern:", error);
      toast({
        title: "Error",
        description: "Failed to create availability pattern",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePattern = async (id: string) => {
    try {
      setLoading(true);
      await availabilityApi.deleteAvailabilityPattern(id);

      toast({
        title: "Success",
        description: "Availability pattern deleted successfully",
      });

      // Reload patterns
      loadAvailabilityPatterns();
    } catch (error) {
      console.error("Error deleting availability pattern:", error);
      toast({
        title: "Error",
        description: "Failed to delete availability pattern",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Availability</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Add Availability Pattern</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="pattern">Pattern Type</Label>
                  <Select
                    value={pattern}
                    onValueChange={(value: "WEEKLY" | "BIWEEKLY" | "ONE_TIME") => setPattern(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select pattern type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                      <SelectItem value="BIWEEKLY">Bi-weekly</SelectItem>
                      <SelectItem value="ONE_TIME">One-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {pattern !== "ONE_TIME" && (
                  <div className="space-y-2">
                    <Label>Days of Week</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {dayNames.map((day, index) => (
                        <div key={day} className="flex items-center space-x-2">
                          <Checkbox
                            id={`day-${index}`}
                            checked={daysOfWeek.includes(index)}
                            onCheckedChange={() => handleDayToggle(index)}
                          />
                          <label htmlFor={`day-${index}`} className="text-sm">
                            {day}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(parseISO(startDate), "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={parseISO(startDate)}
                          onSelect={(date) => date && setStartDate(format(date, "yyyy-MM-dd"))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>End Date (Optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(parseISO(endDate), "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate ? parseISO(endDate) : undefined}
                          onSelect={(date) => date && setEndDate(format(date, "yyyy-MM-dd"))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Appointment Types</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["REGULAR", "FOLLOW_UP", "CONSULTATION", "PROCEDURE", "VACCINATION"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={appointmentTypes.includes(type)}
                          onCheckedChange={() => handleAppointmentTypeToggle(type)}
                        />
                        <label htmlFor={`type-${type}`} className="text-sm">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Pattern"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Current Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-[200px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : patterns.length > 0 ? (
                <div className="space-y-4">
                  {patterns.map((pattern) => (
                    <div key={pattern.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{pattern.pattern}</h3>
                          <p className="text-sm text-muted-foreground">
                            {pattern.startTime} - {pattern.endTime}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(parseISO(pattern.startDate), "MMM d, yyyy")}
                            {pattern.endDate && ` - ${format(parseISO(pattern.endDate), "MMM d, yyyy")}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Days: {pattern.daysOfWeek.map((day: number) => dayNames[day]).join(", ")}
                          </p>
                          <p className="text-sm text-muted-foreground">Types: {pattern.appointmentTypes.join(", ")}</p>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => handleDeletePattern(pattern.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No availability patterns found. Add your first pattern above.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
