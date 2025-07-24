<script setup lang="ts">
import '@schedule-x/theme-shadcn/dist/index.css'
import CalendarCard from './CalendarCard.vue'
import EventForm from './EventForm.vue'
import UpcomingAppointments from './UpcomingAppointments.vue'
import GoogleCalendar from './GoogleCalendar.vue'

</script>
 
<template>
  <div class="flex min-h-screen bg-gray-50">
    <Sidebar/>
    <main class="flex-1 p-8">
      <div class="min-h-screen py-12 px-4 flex flex-col items-center">
        <!-- Calendar Card -->
        <CalendarCard/>
        <!-- Upcoming Appointments -->
        <UpcomingAppointments/>
        <!-- Form Card -->
        <EventForm/>
        <GoogleCalendar/>
      </div>
    </main>
  </div>
</template>