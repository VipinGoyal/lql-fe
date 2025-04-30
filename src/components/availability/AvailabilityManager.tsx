"use client";

import React, { useState, useEffect } from "react";
import { Button, Card, Form, Input, Select, DatePicker, TimePicker } from "antd";
import { availabilityApi } from "@/lib/api/availability";
import { message } from "antd";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { availabilityApi as oldAvailabilityApi } from "@/lib/api/availability";
import type { AvailabilityPattern, DailyAvailability } from "@/types/availability";
import { format } from "date-fns";

interface AvailabilityManagerProps {
  providerId: string;
}

const AvailabilityManager: React.FC<AvailabilityManagerProps> = ({ providerId }) => {
  const [form] = Form.useForm();
  const [patterns, setPatterns] = useState<AvailabilityPattern[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<AvailabilityPattern | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPatterns();
  }, [providerId]);

  const loadPatterns = async () => {
    try {
      setLoading(true);
      const data = await availabilityApi.getAvailabilityPatterns(providerId);
      console.log("patterns", data);
      setPatterns(data);
    } catch (error) {
      setError("Failed to load availability patterns");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      console.log("values", values);
      const { startTime, endTime } = values;
      const startTimeString = startTime.format("HH:mm");
      const endTimeString = endTime.format("HH:mm");

      console.log("startTimeString", startTimeString);
      console.log("endTimeString", endTimeString);

      await availabilityApi.setAvailabilityPattern({
        providerId,
        ...values,
        startTime: startTimeString,
        endTime: endTimeString,
        daysOfWeek: values.daysOfWeek.map(Number),
      });
      message.success("Availability pattern created successfully");
      form.resetFields();
      loadPatterns();
    } catch (error) {
      setError("Failed to create availability pattern");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (patternId: string) => {
    try {
      setLoading(true);
      await availabilityApi.deleteAvailabilityPattern(patternId);
      await loadPatterns();
    } catch (err) {
      setError("Failed to delete availability pattern");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Manage Availability">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="pattern" label="Pattern" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="WEEKLY">Weekly</Select.Option>
            <Select.Option value="BIWEEKLY">Bi-weekly</Select.Option>
            <Select.Option value="ONE_TIME">One-time</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="daysOfWeek" label="Days of Week" rules={[{ required: true }]}>
          <Select mode="multiple">
            <Select.Option value={0}>Sunday</Select.Option>
            <Select.Option value={1}>Monday</Select.Option>
            <Select.Option value={2}>Tuesday</Select.Option>
            <Select.Option value={3}>Wednesday</Select.Option>
            <Select.Option value={4}>Thursday</Select.Option>
            <Select.Option value={5}>Friday</Select.Option>
            <Select.Option value={6}>Saturday</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="startTime" label="Start Time" rules={[{ required: true }]}>
          <TimePicker format="HH:mm" />
        </Form.Item>

        <Form.Item name="endTime" label="End Time" rules={[{ required: true }]}>
          <TimePicker format="HH:mm" />
        </Form.Item>

        <Form.Item name="startDate" label="Start Date" rules={[{ required: true }]}>
          <DatePicker />
        </Form.Item>

        <Form.Item name="endDate" label="End Date (Optional)">
          <DatePicker />
        </Form.Item>

        <Form.Item name="appointmentTypes" label="Appointment Types" rules={[{ required: true }]}>
          <Select mode="multiple">
            <Select.Option value="REGULAR">Regular</Select.Option>
            <Select.Option value="FOLLOW_UP">Follow-up</Select.Option>
            <Select.Option value="SPECIALIST">Specialist</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save Pattern
          </Button>
        </Form.Item>
      </Form>

      <Card title="Current Patterns" className="mt-4">
        {patterns.map((pattern: any) => (
          <Card.Grid key={pattern.id} style={{ width: "25%", textAlign: "center" }}>
            <p>
              <strong>Pattern:</strong> {pattern.pattern}
            </p>
            <p>
              <strong>Days:</strong> {pattern.daysOfWeek.join(", ")}
            </p>
            <p>
              <strong>Time:</strong> {pattern.startTime} - {pattern.endTime}
            </p>
            <p>
              <strong>Types:</strong> {pattern.appointmentTypes.join(", ")}
            </p>
          </Card.Grid>
        ))}
      </Card>
    </Card>
  );
};

export default AvailabilityManager;
