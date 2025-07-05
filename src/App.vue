<script setup lang="ts">
import '@schedule-x/theme-shadcn/dist/index.css'
import { ScheduleXCalendar } from '@schedule-x/vue'
import { createCurrentTimePlugin } from '@schedule-x/current-time'
import { createScrollControllerPlugin } from '@schedule-x/scroll-controller'
import {
  createCalendar,
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  createViewList
} from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'

import { Button } from "@/components/ui/button"
import { useForm } from 'vee-validate'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Calendar } from './components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover'
import { CalendarIcon } from 'lucide-vue-next'

import {
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
} from '@internationalized/date'
import { ref } from 'vue'
import { cn } from '@/utils'

const scrollController = createScrollControllerPlugin({
  initialScroll: '07:50'
})

// Do not use a ref here, as the calendar instance is not reactive, and doing so might cause issues
// For updating events, use the events service plugin
const calendarApp = createCalendar({
  views: [
    createViewDay(),
    createViewWeek(),
    createViewList(),
    createViewMonthGrid(),
    createViewMonthAgenda(),
  ],
  events: [
    {
      id: 1,
      title: 'Event 1',
      start: '2023-12-19',
      end: '2023-12-19',
    },
    {
      id: 2,
      title: 'Event 2',
      start: '2023-12-20 12:00',
      end: '2023-12-20 13:00',
    },
  ],
  theme: 'shadcn'
}, [createCurrentTimePlugin(), scrollController])

const form = useForm()

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted!', values)
})

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const value = ref<DateValue>()

</script>
 
<template>
  <div class="flex min-h-screen bg-gray-50">
    <aside class="w-64 bg-white shadow-lg p-6 flex flex-col">
      <h2 class="text-xl font-bold mb-8">Sidebar</h2>
      <nav class="flex flex-col gap-4">
        <a href="#" class="text-gray-700 hover:text-primary">Dashboard</a>
        <a href="#" class="text-gray-700 hover:text-primary">Calendar</a>
        <a href="#" class="text-gray-700 hover:text-primary">Settings</a>
      </nav>
    </aside>

    <main class="flex-1 p-8">
      <div class="min-h-screen py-12 px-4 flex flex-col items-center">
        <!-- Calendar Card -->
        <div class="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Daily Routine</h2>
          <div class="w-full overflow-x-auto">
            <ScheduleXCalendar :calendar-app="calendarApp">
              <template #timeGridEvent="{ calendarEvent }">
                <div class="event px-2 py-1 bg-primary/10 rounded text-primary font-medium">
                  {{ calendarEvent.title }}
                </div>
              </template>
            </ScheduleXCalendar>
          </div>
        </div>

        <!-- Form Card -->
        <div class="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8">
          <h2 class="text-2xl font-bold mb-6 text-gray-800">Create Event</h2>
          <form @submit.prevent="onSubmit" class="space-y-6">
            <!-- Event Title -->
            <FormField v-slot="{ componentField }" name="title">
              <FormItem>
                <FormLabel class="font-semibold text-gray-700">Event Title</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Add Title"
                    v-bind="componentField"
                    class="mt-2 w-full"
                  />
                </FormControl>
                <FormMessage class="text-red-500 text-xs mt-1" />
              </FormItem>
            </FormField>

            <!-- Date Picker -->
            <Popover>
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  :class="cn(
                    'w-[280px] justify-start text-left font-normal',
                    !value && 'text-muted-foreground',
                  )"
                >
                  <CalendarIcon class="mr-2 h-4 w-4" />
                  {{ value ? df.format(value.toDate(getLocalTimeZone())) : "Pick a date" }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0">
                <Calendar v-model="value" initial-focus />
              </PopoverContent>
            </Popover>

            <!-- Time Picker -->
            <FormField v-slot="{ componentField }" name="time">
              <FormItem>
                <FormLabel class="font-semibold text-gray-700">Time</FormLabel>
                <FormControl>
                  <TimePicker v-bind="componentField" class="mt-2 w-full" />
                </FormControl>
                <FormMessage class="text-red-500 text-xs mt-1" />
              </FormItem>
            </FormField>

            <!-- Add Guests (comma-separated emails) -->
            <FormField v-slot="{ componentField }" name="guests">
              <FormItem>
                <FormLabel class="font-semibold text-gray-700">Add Guests</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="guest1@example.com, guest2@example.com"
                    v-bind="componentField"
                    class="mt-2 w-full"
                  />
                </FormControl>
                <FormDescription class="text-sm text-gray-500 mt-1">
                  Separate emails with commas.
                </FormDescription>
                <FormMessage class="text-red-500 text-xs mt-1" />
              </FormItem>
            </FormField>

            <!-- Location -->
            <FormField v-slot="{ componentField }" name="location">
              <FormItem>
                <FormLabel class="font-semibold text-gray-700">Location</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Add Location"
                    v-bind="componentField"
                    class="mt-2 w-full"
                  />
                </FormControl>
                <FormMessage class="text-red-500 text-xs mt-1" />
              </FormItem>
            </FormField>

            <!-- Description -->
            <FormField v-slot="{ componentField }" name="description">
              <FormItem>
                <FormLabel class="font-semibold text-gray-700">Description</FormLabel>
                <FormControl>
                  <textarea
                    placeholder="Add Description"
                    v-bind="componentField"
                    class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    rows="3"
                  />
                </FormControl>
                <FormMessage class="text-red-500 text-xs mt-1" />
              </FormItem>
            </FormField>

            <!-- Recurring Event Switch -->
            <FormField v-slot="{ componentField }" name="recurring">
              <FormItem>
                <FormLabel class="font-semibold text-gray-700">Recurring Event?</FormLabel>
                <FormControl>
                  <input
                    type="checkbox"
                    v-bind="componentField"
                    class="mt-2"
                    v-model="isRecurring"
                  />
                </FormControl>
              </FormItem>
            </FormField>

            <!-- Repeat Options (shown if recurring) -->
            <div v-if="isRecurring" class="space-y-2">
              <FormField v-slot="{ componentField }" name="repeatType">
                <FormItem>
                  <FormLabel class="font-semibold text-gray-700">Repeat</FormLabel>
                  <FormControl>
                    <select v-bind="componentField" class="mt-2 w-full border border-gray-300 rounded-md">
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="custom">Custom</option>
                    </select>
                  </FormControl>
                </FormItem>
              </FormField>
            </div>

            <Button type="submit" class="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition">
              Create Event
            </Button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>