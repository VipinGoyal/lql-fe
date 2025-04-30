import React, { useState, useEffect } from "react";
import { Card, Button, Spin, Empty } from "antd";
import { availabilityApi } from "@/lib/api/availability";
import type { TimeSlot } from "@/types/availability";
import { format } from "date-fns";

interface TimeSlotSelectorProps {
  providerId: string;
  selectedDate: Date;
  onSlotSelect: (slot: TimeSlot) => void;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({ providerId, selectedDate, onSlotSelect }) => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAvailableSlots();
  }, [providerId, selectedDate]);

  const loadAvailableSlots = async () => {
    try {
      setLoading(true);
      setError(null);
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const data = await availabilityApi.getAvailableSlots(providerId, dateStr);
      setSlots(data.slots);
    } catch (err) {
      setError("Failed to load available slots");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  if (slots.length === 0) {
    return <Empty description="No available slots for this date" className="my-8" />;
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {slots.map((slot, index) => (
        <Button
          key={index}
          type={slot.isAvailable ? "primary" : "default"}
          disabled={!slot.isAvailable}
          onClick={() => onSlotSelect(slot)}
          className="h-16"
        >
          {slot.startTime} - {slot.endTime}
        </Button>
      ))}
    </div>
  );
};

export default TimeSlotSelector;
