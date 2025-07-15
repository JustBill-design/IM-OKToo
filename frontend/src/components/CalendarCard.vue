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

const getToday = () => {
  const today = new Date();
  return today;
};

const scrollController = createScrollControllerPlugin({
  initialScroll: '07:00'
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
  // Monday, July 14, 2025
  { id: 1, title: 'Prepare Breakfast', start: '2025-07-14 07:00', end: '2025-07-14 07:30' },
  { id: 2, title: 'Serve Breakfast', start: '2025-07-14 07:30', end: '2025-07-14 08:00' },
  { id: 4, title: 'Laundry', start: '2025-07-14 10:00', end: '2025-07-14 11:00' },
  { id: 5, title: 'Grocery Shopping', start: '2025-07-14 11:30', end: '2025-07-14 12:30' },
  { id: 6, title: 'Clean Living Area', start: '2025-07-14 14:00', end: '2025-07-14 15:00' },
  { id: 7, title: 'Cook Dinner', start: '2025-07-14 16:00', end: '2025-07-14 17:00' },
  { id: 8, title: 'Wash Dishes', start: '2025-07-14 18:00', end: '2025-07-14 18:30' },

  // Tuesday, July 15, 2025
  { id: 9, title: 'Prepare Breakfast', start: '2025-07-15 07:00', end: '2025-07-15 07:30' },
  { id: 10, title: 'Serve Breakfast', start: '2025-07-15 07:30', end: '2025-07-15 08:00' },
  { id: 12, title: 'Laundry', start: '2025-07-15 10:00', end: '2025-07-15 11:00' },
  { id: 13, title: 'Clean Living Area', start: '2025-07-15 14:00', end: '2025-07-15 15:00' },
  { id: 14, title: 'Cook Dinner', start: '2025-07-15 16:00', end: '2025-07-15 17:00' },
  { id: 15, title: 'Wash Dishes', start: '2025-07-15 18:00', end: '2025-07-15 18:30' },

  // Wednesday, July 16, 2025
  { id: 16, title: 'Prepare Breakfast', start: '2025-07-16 07:00', end: '2025-07-16 07:30' },
  { id: 17, title: 'Serve Breakfast', start: '2025-07-16 07:30', end: '2025-07-16 08:00' },
  { id: 19, title: 'Grocery Shopping', start: '2025-07-16 11:30', end: '2025-07-16 12:30' },
  { id: 20, title: 'Clean Living Area', start: '2025-07-16 14:00', end: '2025-07-16 15:00' },
  { id: 21, title: 'Cook Dinner', start: '2025-07-16 16:00', end: '2025-07-16 17:00' },
  { id: 22, title: 'Wash Dishes', start: '2025-07-16 18:00', end: '2025-07-16 18:30' },

  // Thursday, July 17, 2025
  { id: 23, title: 'Prepare Breakfast', start: '2025-07-17 07:00', end: '2025-07-17 07:30', },
  { id: 24, title: 'Serve Breakfast', start: '2025-07-17 07:30', end: '2025-07-17 08:00', },
  { id: 26, title: 'Laundry', start: '2025-07-17 10:00', end: '2025-07-17 11:00' },
  { id: 27, title: 'Clean Living Area', start: '2025-07-17 14:00', end: '2025-07-17 15:00', },
  { id: 28, title: 'Cook Dinner', start: '2025-07-17 16:00', end: '2025-07-17 17:00', },
  { id: 29, title: 'Wash Dishes', start: '2025-07-17 18:00', end: '2025-07-17 18:30', },

  // Friday, July 18, 2025
  { id: 30, title: 'Prepare Breakfast', start: '2025-07-18 07:00', end: '2025-07-18 07:30', },
  { id: 31, title: 'Serve Breakfast', start: '2025-07-18 07:30', end: '2025-07-18 08:00', },
  { id: 33, title: 'Laundry', start: '2025-07-18 10:00', end: '2025-07-18 11:30', },
  { id: 34, title: 'Grocery Shopping', start: '2025-07-18 11:30', end: '2025-07-18 12:30' },
  { id: 35, title: 'Clean Living Area', start: '2025-07-18 14:00', end: '2025-07-18 15:00' },
  { id: 36, title: 'Cook Dinner', start: '2025-07-18 16:00', end: '2025-07-18 17:00' },
  { id: 37, title: 'Wash Dishes', start: '2025-07-18 18:00', end: '2025-07-18 18:30' },
  ],
}, [createCurrentTimePlugin(), scrollController])

</script>

<template>
    <div class="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Daily Routine</h2>
        <div class="w-full overflow-x-auto">
        <ScheduleXCalendar :calendar-app="calendarApp">
        </ScheduleXCalendar>
        </div>
    </div>
</template>