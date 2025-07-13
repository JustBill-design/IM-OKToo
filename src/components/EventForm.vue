<script setup lang="ts">
import EventTitle from '@/components/EventTitle.vue'
import EventDateTimeRange from '@/components/EventDateTimeRange.vue'
import EventElderly from './EventElderly.vue'
import EventCaretaker from './EventCaretaker.vue'
import EventLocation from '@/components/EventLocation.vue'
import EventDescription from '@/components/EventDescription.vue'
import EventRecurrence from '@/components/EventRecurrence.vue'
import EventCategory from './EventCategory.vue'

import { Button } from "@/components/ui/button"
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'


const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to midnight
  return today;
};

const formSchema = toTypedSchema(z.object({
  title: z.string().min(1, 'Title is required'),
  startTime: z.string(),
  endTime: z.string(),
  elderly: z.string(),
  caretaker: z.string(),
  location: z.string().optional(),
  description: z.string().optional(),
  recurrence: z.string().optional(),
}))

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted:', values)
})

</script>

<template>
    <div class="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Create Event</h2>
        <form @submit.prevent="onSubmit" class="space-y-6">
        <EventTitle/>
        <EventCategory/>
        <EventDateTimeRange/>
        <EventElderly/>
        <EventCaretaker/>
        <EventLocation/>
        <EventDescription/>
        <EventRecurrence/>
        <pre>{{ form.values }}</pre>

        <Button type="submit" class="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition">
            Create Event
        </Button>
        </form>
    </div>
</template>