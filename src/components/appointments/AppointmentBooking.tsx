import React, { useState } from "react";
import { Card, Form, Input, Select, DatePicker, Button, message } from "antd";
import { appointmentsApi } from "@/lib/api/appointments";
import TimeSlotSelector from "./TimeSlotSelector";
import type { TimeSlot } from "@/types/availability";
import { format } from "date-fns";
import dayjs from "dayjs";

interface AppointmentBookingProps {
  providerId: string;
  patientId: string;
  onSuccess?: () => void;
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ providerId, patientId, onSuccess }) => {
  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    if (!selectedSlot) {
      message.error("Please select a time slot");
      return;
    }

    try {
      setLoading(true);
      const appointmentData = {
        patientId,
        providerId,
        appointmentType: values.appointmentType,
        chiefComplaint: values.chiefComplaint,
        // date: format(selectedDate, "yyyy-MM-dd"),
        startTime: `${format(selectedDate, "yyyy-MM-dd")}T${selectedSlot.startTime}`,
        endTime: `${format(selectedDate, "yyyy-MM-dd")}T${selectedSlot.endTime}`,
        // slot: `${selectedSlot.startTime}-${selectedSlot.endTime}`,
        notes: values.notes,
      };

      await appointmentsApi.createAppointment(appointmentData);
      message.success("Appointment booked successfully");
      form.resetFields();
      setSelectedSlot(null);
      onSuccess?.();
    } catch (error) {
      message.error("Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Book Appointment">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="appointmentType" label="Appointment Type" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="REGULAR">Regular Checkup</Select.Option>
            <Select.Option value="FOLLOW_UP">Follow-up</Select.Option>
            <Select.Option value="SPECIALIST">Specialist Consultation</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="date" label="Date" rules={[{ required: true }]}>
          <DatePicker
            onChange={(date) => date && setSelectedDate(date.toDate())}
            disabledDate={(current) => {
              return current && current.isBefore(dayjs(), "day");
            }}
          />
        </Form.Item>

        <Form.Item label="Available Time Slots" required>
          <TimeSlotSelector providerId={providerId} selectedDate={selectedDate} onSlotSelect={setSelectedSlot} />
        </Form.Item>

        <Form.Item name="chiefComplaint" label="Chief Complaint" rules={[{ required: true }]}>
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item name="notes" label="Additional Notes">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Book Appointment
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AppointmentBooking;
