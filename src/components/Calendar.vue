<script setup lang="ts">
import '@schedule-x/theme-shadcn/dist/index.css'
import { ScheduleXCalendar } from '@schedule-x/vue'
import { createCurrentTimePlugin } from '@schedule-x/current-time'
import { createScrollControllerPlugin } from '@schedule-x/scroll-controller'
import { Button } from "@/components/ui/button"
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
  <ScheduleXCalendar :calendar-app="calendarApp">
    <template #timeGridEvent="{ calendarEvent }">
      <div class="event">
        {{ calendarEvent.title }}
      </div>
    </template>
  </ScheduleXCalendar>
</template>
