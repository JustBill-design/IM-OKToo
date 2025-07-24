<script setup lang="ts">
import EventTitle from './EventTitle.vue'
import EventDateTimeRange from './EventDateTimeRange.vue'
import EventElderly from './EventElderly.vue'
import EventCaretaker from './EventCaretaker.vue'
import EventLocation from './EventLocation.vue'
import EventDescription from './EventDescription.vue'
import EventRecurrence from './EventRecurrence.vue'
import EventCategory from './EventCategory.vue'
import EventGuest from './EventGuest.vue'

import { Button } from "./ui/button"
import { useForm, FormProvider, Form } from 'vee-validate'
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

const d = new Date()
let year = d.getFullYear();

const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const formSchema = toTypedSchema(z.object({
  title: z.string(),
  category: z.string(),
  elderly: z.string(),
  caretaker: z.string(),
  startDate: z.object({
    era: z.literal("AD"),
    year: z.coerce.number().int().min(year),
    month: z.coerce.number().int(),
    day: z.coerce.number().int(),
  }).refine(
    ({ year, month, day }) => {
      const inputDate = new Date(year, month - 1, day);
      return inputDate >= getToday();
    },
    { message: "Start date cannot be in the past" }
  ),
  startTime: z.string(),
  endDate: z.object({
    era: z.literal("AD"),
    year: z.coerce.number().int().min(year),
    month: z.coerce.number().int(),
    day: z.coerce.number().int(),
  }).refine(
    ({ year, month, day }) => {
      const inputDate = new Date(year, month - 1, day);
      return inputDate >= getToday();
    },
    { message: "Start date cannot be in the past" }
  ),
  endTime: z.string(),
  guests: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  recurrence: z.string().optional(),
}).superRefine((data, ctx) => {
  const start = new Date(data.startDate.year, data.startDate.month - 1, data.startDate.day)
  const end = new Date(data.endDate.year, data.endDate.month - 1, data.endDate.day)
  const startTime = data.startTime
  const endTime = data.endTime
  const guests = data.guests

  if (!data.startDate || !data.endDate) return

  // 1. End date must not be before start date
  if (end < start) {
    ctx.addIssue({
      code: "custom",
      path: ['endDate'],
      message: 'End date must not be before start date',
    })
  }

  // 2. If same day, end time must not be before start time
  if (
    start.toDateString() === end.toDateString() &&
    startTime &&
    endTime &&
    endTime < startTime
  ) {
    ctx.addIssue({
      code: "custom",
      path: ['endDate'],
      message: 'End time must not be before start time',
    })
  }

  console.log(guests)
  // 3. Check that the emails in guests are valid if provided
  if (guests && guests.trim().length > 0) {
    const emails = guests.split(',').map(e => e.trim());
    const invalids = emails.filter(email => !z.string().email().safeParse(email).success);

    if (invalids.length > 0) {
      ctx.addIssue({
        code: "custom",
        path: ["guests"],
        message: 'Emails provided are invalid',
      })
    }
  }

}))

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(async (values) => {
  console.log(values)
}) 
</script>

<template>
    <div class="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Create Event</h2>
        <Form :form="form">
        <form @submit.prevent="onSubmit" class="space-y-6">
        <EventTitle/>
        <EventCategory/>
        <EventElderly/>
        <EventCaretaker/>
        <EventDateTimeRange/>
        <EventGuest/>
        <EventLocation/>
        <EventDescription/>
        <EventRecurrence/>

        <Button type="submit" class="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition">
            Create Event
        </Button>
        </form>
        </Form>
    </div>
</template>