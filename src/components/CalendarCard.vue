<script setup lang="ts">
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

</script>

<template>
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
</template>