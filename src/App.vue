<script setup lang="ts">
import '@schedule-x/theme-shadcn/dist/index.css'
import Sidebar from './components/Sidebar.vue'
import CalendarCard from './components/CalendarCard.vue'
import EventTitle from './components/EventTitle.vue'
import EventDateTimeRange from './components/EventDateTimeRange.vue'

import { Button } from "@/components/ui/button"
import { useForm } from 'vee-validate'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

const form = useForm()

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted!', values)
})

</script>
 
<template>
  <div class="flex min-h-screen bg-gray-50">
    <Sidebar/>
    <main class="flex-1 p-8">
      <div class="min-h-screen py-12 px-4 flex flex-col items-center">
        <!-- Calendar Card -->
        <CalendarCard/>
        <!-- Form Card -->
        <div class="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8">
          <h2 class="text-2xl font-bold mb-6 text-gray-800">Create Event</h2>
          <form @submit.prevent="onSubmit" class="space-y-6">
            <!-- Event Title -->
            <EventTitle/>
            <EventDateTimeRange/>
            
            
          

            <!-- Add Guests (comma-separated emails) -->
            <FormField v-slot="{ componentField }" name="guests">
              <FormItem>
                <FormLabel class="font-semibold text-gray-700">Add Guests</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="guest1@example.com, guest2@example.com"
                    v-bind="componentField"
                    class="mt-2 w-full"
                  />
                </FormControl>
                <FormDescription class="text-sm text-gray-500 mt-1">
                  Separate emails with commas.
                </FormDescription>
                <FormMessage class="text-red-500 text-xs mt-1" />
              </FormItem>
            </FormField>

            <!-- Location -->
            <FormField v-slot="{ componentField }" name="location">
              <FormItem>
                <FormLabel class="font-semibold text-gray-700">Location</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Add Location"
                    v-bind="componentField"
                    class="mt-2 w-full"
                  />
                </FormControl>
                <FormMessage class="text-red-500 text-xs mt-1" />
              </FormItem>
            </FormField>

            <!-- Description -->
            <FormField v-slot="{ componentField }" name="description">
              <FormItem>
                <FormLabel class="font-semibold text-gray-700">Description</FormLabel>
                <FormControl>
                  <textarea
                    placeholder="Add Description"
                    v-bind="componentField"
                    class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    rows="3"
                  />
                </FormControl>
                <FormMessage class="text-red-500 text-xs mt-1" />
              </FormItem>
            </FormField>

            <div class="flex py-2">
              <div class="pr-4 content-center">
                <label class="text-sm font-semibold text-gray-700">Recurring Event?</label>
              </div>
              <div>
                <!-- Time Picker -->
                <Select>     
                  <SelectTrigger class="w-[180px]">
                    <SelectValue placeholder="Does not repeat" />
                  </SelectTrigger>
                  <SelectContent class="max-h-60">
                    <SelectGroup>
                      <SelectItem value="Does not repeat">
                        Does not repeat
                      </SelectItem>
                      <SelectItem value="Daily">
                        Daily
                      </SelectItem>
                      <SelectItem value="Weekly on this day">
                        Weekly on this day
                      </SelectItem>
                      <SelectItem value="Monthly on this day">
                        Monthly on this day
                      </SelectItem>
                      <SelectItem value="Every weekday">
                        Every weekday
                      </SelectItem>
                      <SelectItem value="Anually on this day">
                        Anually on this day
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" class="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition">
              Create Event
            </Button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>