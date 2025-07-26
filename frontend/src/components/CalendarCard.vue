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
  createViewList,
  CalendarEventExternal
} from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'
import { format } from 'date-fns'
import { onMounted, ref } from 'vue'
import { X, Clock9, HandHelping, User, Trash2, MapPin } from 'lucide-vue-next'
import { Button } from './ui/button'
import { createEventRecurrencePlugin} from "@schedule-x/event-recurrence";

import type { CalendarApp } from '@schedule-x/calendar'

type CalendarEvent = {
    id: number;
    title: string;
    category: string;
    start: string;
    end: string;
    people: string[];
    location?: string;
    description?: string;
    guests?: string;
    calendarId: string;
    rrule: string;
}

const getToday = () => {
  const today = new Date();
  return today;
};

const getTime = () => {
  let hours;

  if (getToday().getHours() < 2) {
    hours = "00";
  }
  else
  {
    hours = String(getToday().getHours()-2).padStart(2, "0");
  }
  const minutes = String(getToday().getMinutes()).padStart(2, "0");
  const now = hours + ':' + minutes;
  return now;
}

const scrollController = createScrollControllerPlugin({
  initialScroll: getTime() 
})

let isCalendarReady = ref(false)
let showPopover = ref(false)
let popoverEvent = ref<CalendarEventExternal | null>(null)
let popoverPosition = ref({x:0, y:0})

let calendarApp: CalendarApp | null = null;

async function retrieveEvents() {

  const events: CalendarEvent[] = [];

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
    e.category = dept.category
    e.rrule = dept.recurrence;

    // Checks to determine if description is present
    if (e.description) {
      e.description = dept.description;
    }

    // Checks to determine if location is present
    if (e.location) {
      e.location = dept.location;
    }

    // Checks to determine if guests is/are present
    if (e.guests) {
      e.guests = dept.guests;
    }
    
    // Determine the calendarId to use based on the category from db
    if (dept.category === "Google Sync") {
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

    const startampm = start.getHours() >= 12 ? 'PM' : 'AM';
    const starthour12 = start.getHours() % 12 || 12;

    const endampm = end.getHours() >= 12 ? 'PM' : 'AM';
    const endhour12 = end.getHours() % 12 || 12

    // Create the formatted date for the popover
    if (start.toDateString() === end.toDateString()) {
      const formatted_string = start.toDateString() + " " + starthour12 + ":" + String(start.getMinutes()).padStart(2, "0") + " " + startampm + " - " + endhour12 + ":" + String(end.getMinutes()).padStart(2, "0") + " " + endampm;
      e.formattedDate = formatted_string;
    }
    else {
      const formatted_string = start.toDateString() + " " + starthour12 + ":" + String(start.getMinutes()).padStart(2, "0") + " " + startampm + " - " + end.toDateString() + endhour12 + ":" + String(end.getMinutes()).padStart(2, "0") + " " + endampm;
      e.formattedDate = formatted_string;
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
    callbacks: {
      onEventClick(calendarEvent, e: UIEvent) {
        const mouseEvent = e as MouseEvent;
        popoverEvent.value = calendarEvent;
        showPopover.value = true;

        popoverPosition.value = {
          x: mouseEvent.pageX,
          y: mouseEvent.pageY,
        };
      },
    }
  }, [createEventRecurrencePlugin(), createCurrentTimePlugin(), scrollController])
  isCalendarReady.value = true
})

</script>

<template>
    <div class="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Daily Routine</h2>
        <div class="w-full">
          <div class="flex justify-center items-center sx-vue-calendar-wrapper" v-if="!isCalendarReady">
            <!-- Loading spinner or message -->
            <img src="../assets/loading.gif">
          </div>
          <ScheduleXCalendar
            v-else
            v-if="calendarApp"
            :calendar-app="calendarApp"
          />
          <Teleport to="body">
            <div v-if="showPopover" :style="{ position: 'absolute', left: popoverPosition.x + 'px', top: popoverPosition.y + 'px', zIndex: 9999 }" class="bg-white rounded-md shadow-lg p-4">
              <div class="flex justify-end space-x-2 my-2">
                <Button class="px-2" variant="outline" size="icon">
                  <Trash2 />
                </Button>
                <Button @click="showPopover = false" variant="outline" size="icon">
                  <X/>
                </Button>
              </div>
              <div class="font-semibold my-2">{{ popoverEvent?.title }}</div>
              <div class="flex gap-x-4 my-2">
                <Clock9 />
                <div>{{ popoverEvent?.formattedDate }}</div>
              </div>
              <div class="flex gap-x-4" v-if="popoverEvent?.location">
                <MapPin />
                <div>{{ popoverEvent?.location }}</div>
              </div>
              <div class="flex gap-x-4">
                <HandHelping />
                <div>{{ popoverEvent?.people }}</div>
              </div>
              <div class="flex gap-x-4" v-if="popoverEvent?.guests">
                <User />
                <div>{{ popoverEvent?.guests }}</div>
              </div>
              <!-- add more fields as needed -->
            </div>
          </Teleport>
        </div>
    </div>
</template>