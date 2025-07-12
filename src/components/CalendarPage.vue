<script setup lang="ts">
import '@schedule-x/theme-shadcn/dist/index.css'
import CalendarCard from '@/components/CalendarCard.vue'
import EventForm from '@/components/EventForm.vue'

</script>
 
<template>
  <div class="flex min-h-screen bg-gray-50">
    <Sidebar/>
    <main class="flex-1 p-8">
      <div class="min-h-screen py-12 px-4 flex flex-col items-center">
        <!-- Calendar Card -->
        <CalendarCard/>
        <!-- Form Card -->
        <Toaster/>
        <EventForm/>
      </div>
    </main>
  </div>
</template>