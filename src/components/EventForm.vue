<script setup lang="ts">
import EventTitle from './components/EventTitle.vue'
import EventDateTimeRange from './components/EventDateTimeRange.vue'
import EventGuest from './components/EventGuest.vue'
import EventLocation from './components/EventLocation.vue'
import EventDescription from './components/EventDescription.vue'
import EventRecurrence from './components/EventRecurrence.vue'

import { Button } from "@/components/ui/button"
import { useForm } from 'vee-validate'

const form = useForm()

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted!', values)
})


</script>

<template>
    <div class="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Create Event</h2>
        <form @submit.prevent="onSubmit" class="space-y-6">
        <EventTitle/>
        <EventDateTimeRange/>
        <EventGuest/>
        <EventLocation/>
        <EventDescription/>
        <EventRecurrence/>

        <Button type="submit" class="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition">
            Create Event
        </Button>
        </form>
    </div>
</template>