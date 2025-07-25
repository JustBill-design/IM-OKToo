<script setup lang="ts">
import EventTitle from './EditEvent/EventTitle.vue'
import EventDateTimeRange from './EditEvent/EventDateTimeRange.vue'
import EventElderly from './EditEvent/EventElderly.vue'
import EventCaretaker from './EditEvent/EventCaretaker.vue'
import EventLocation from './EditEvent/EventLocation.vue'
import EventDescription from './EditEvent/EventDescription.vue'
import EventRecurrence from './EditEvent/EventRecurrence.vue'
import EventCategory from './EditEvent/EventCategory.vue'
import EventGuest from './EditEvent/EventGuest.vue'

import { Button } from "@/components/ui/button"
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { X, Pencil, Clock9, HandHelping, User, Trash2, MapPin } from 'lucide-vue-next'

import { parseDate } from '@internationalized/date'

type calendarEvent = {
    id: number;
    title: string;
    start: string;
    end: string;
    people: string[];
    location?: string;
    description?: string;
    guests?: string;
    calendarId: string;
}

// For prefilling values
const { event } = defineProps<{ event: calendarEvent }>()
const startDate = new Date(event.start);
const endDate = new Date(event.end);


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
    { message: "End date cannot be in the past" }
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
    initialValues: {
        title: event.title.split(":")[1],
        category: event.category,
        elderly: event.title.split(":")[0],
        caretaker: event.people[0],
        startDate: parseDate(event.start.split(" ")[0]),
        endDate: parseDate(event.end.split(" ")[0]),
        startTime: event.start.split(" ")[1],
        endTime: event.end.split(" ")[1],
        guests: event.guests,
        location: event.location,
        description: event.description,
    },
    validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(async (values) => {
  
  const response = await fetch("http://localhost:3001/calendar/add",
  {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
          'Content-type': 'application/json'
      }              
  });
})

</script>

<template>
    <div>
        <div class="flex justify-end space-x-2 my-2">
            <Button class="px-2" variant="outline" size="icon">
            <Pencil />
            </Button>
            <Button class="px-2" variant="outline" size="icon">
            <Trash2 />
            </Button>
            <Button @click="showPopover = false" variant="outline" size="icon">
            <X/>
            </Button>
        </div>
        <div class="h-96 overflow-y-auto p-4 bg-white rounded shadow">
            <form @submit.prevent="onSubmit" class="space-y-2">
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
        </div>
    </div>
</template>