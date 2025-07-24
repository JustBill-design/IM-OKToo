<template>
    <Button 
        type="submit" 
        @click="fetchCalendarData"
        class="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition">
        Connect to Google Calendar
    </Button>
</template>

<script setup lang="ts">
    const fetchCalendarData = async () => {
    window.location.href = "http://localhost:3001/calendar/authgooglecalendar";
    }
</script>
