<template>
    <div class="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6 mb-8">
        <Button 
            type="submit" 
            @click="fetchCalendarData"
            class="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition">
            Connect to Google Calendar
        </Button>
    </div>
</template>

<script setup lang="ts">
import { Button } from './ui/button';

const fetchCalendarData = async () => {
window.location.href = "http://localhost:3001/calendar/authgooglecalendar";
}

</script>
