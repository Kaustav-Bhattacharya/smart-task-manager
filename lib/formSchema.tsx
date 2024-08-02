"use client";

import { z } from "zod";

export const taskFormSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(50, { message: "Title is too long" }),
  description: z.string().min(1, { message: "Description is required" }),
  dueDate: z.date({
    required_error: "A date of completion is required.",
  }),
  priority: z.string().min(1, { message: "Priority is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  lat: z.number().optional(), // Optional latitude
  lng: z.number().optional(), // Optional longitude
});