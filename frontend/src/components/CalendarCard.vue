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
import { format } from 'date-fns'
import { onMounted, ref } from 'vue'
import type { CalendarApp } from '@schedule-x/calendar'

const getToday = () => {
  const today = new Date();
  return today;
};

const scrollController = createScrollControllerPlugin({
  initialScroll: '07:00'
})

const isCalendarReady = ref(false)
let calendarApp: CalendarApp | null = null;

async function retrieveEvents() {

  const events =[];

  const response = await fetch(`http://localhost:3001/calendar/all`,
  {
      method: 'GET',
      headers: {
          'Content-type': 'application/json'
      }              
  });

  var json = await response.json();

  for (let i = 0; i < json.length; i++) {
    
    const dept = json[i];
    const e = {} as any;

    const start = new Date(dept.start);
    const end = new Date(dept.end);

    e.id = parseInt(dept.event_id);
    e.title = dept.title;
    e.start = format(start, 'yyyy-MM-dd HH:mm');
    e.end = format(end, 'yyyy-MM-dd HH:mm');
    e.people = [dept.caretaker];

    if (e.description) {
      e.description = dept.description;
    }

    if (e.location) {
      e.location = dept.location;
    }

    if (e.guests) {
      e.guests = dept.guests;
    }
    
    if (dept.category === "primary") {
      e.calendarId = "primary"
    }
    else if (dept.category === "Appointments") {
      e.calendarId = "appointments"
    }
    else if (dept.category === "Chores & Household Tasks") {
      e.calendarId = "chores"
    }
    else if (dept.category === "Medication & Health Management") {
      e.calendarId = "health"
    }
    else {
      e.calendarId = "wellness"
    }

    events.push(e);
  }

  return events;
}

onMounted(async () => {
  const events = await retrieveEvents();

  // Do not use a ref here, as the calendar instance is not reactive, and doing so might cause issues
  // For updating events, use the events service plugin
  calendarApp = createCalendar({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewList(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    calendars: {
      primary: {
        colorName: 'primary',
        lightColors: {
          main: '#4A6B8A',
          container: '#A1B7CC',
          onContainer: '#000000',
        },
      },
      appointments: {
        colorName: 'appointments',
        lightColors: {
          main: '#FF6B47',
          container: '#FF9A7B',
          onContainer: '#000000',
        },
      },
      chores: {
        colorName: 'chores',
        lightColors: {
          main: '#87CEEB',
          container: '#BFE7F8',
          onContainer: '#000000',
        },
      },
      health: {
        colorName: 'health',
        lightColors: {
          main: '#80DAFF',
          container: '#E0F6FF',
          onContainer: '#000000',
        },
      },
      wellness: {
        colorName: 'wellness',
        lightColors: {
          main: '#2C3E50',
          container: '#788A9C',
          onContainer: '#000000',
        },
      },
    },
    weekOptions: {
      gridHeight: 3500,
    },
    events: events,
  }, [createCurrentTimePlugin(), scrollController])
  isCalendarReady.value = true
})

</script>

<template>
    <div class="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Daily Routine</h2>
        <div class="w-full overflow-x-auto">
          <div class="flex justify-center items-center sx-vue-calendar-wrapper" v-if="!isCalendarReady">
            <!-- Loading spinner or message -->
            <img src="../assets/loading.gif">
          </div>
          <ScheduleXCalendar
            v-else
            :calendar-app="calendarApp"
          />
        </div>
    </div>
</template>