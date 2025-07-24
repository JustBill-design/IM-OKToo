<script setup lang="ts">
import {
  DateFormatter,
  getLocalTimeZone,
  today
} from '@internationalized/date'
import { ref, computed } from 'vue'
import { cn } from '@/utils'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select'

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Calendar } from './ui/calendar'
import { Button } from "./ui/button"
import { CalendarIcon } from 'lucide-vue-next'

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const getToday = () => {
  const today = new Date();
  return today;
};

const startPopoverOpen = ref(false)
const endPopoverOpen = ref(false)

const timeOptions = computed(() => {
  const options = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hour = h.toString().padStart(2, '0')
      const minute = m.toString().padStart(2, '0')
      options.push(`${hour}:${minute}`)
    }
  }
  return options
})

</script>


<template>
    <label class="text-sm font-semibold text-gray-700">Start Date and Time</label>
    <div class="flex py-2">
        <div class="pr-4">
            <!-- Start Date Picker -->
            <FormField v-slot="{componentField}" name="startDate">
            <FormItem>
            <FormControl>
                <Popover v-model:open="startPopoverOpen">
                    <PopoverTrigger as-child>
                    <Button
                        variant="outline"
                        :class="cn(
                        'w-[280px] justify-start text-left font-normal',
                        !componentField.modelValue && 'text-muted-foreground',
                        )"
                    >
                        <CalendarIcon class="mr-2 h-4 w-4" />
                        {{ componentField.modelValue ? df.format(componentField.modelValue.toDate(getLocalTimeZone())) : "Pick a date" }}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0">
                    <Calendar 
                        :modelValue="componentField.modelValue" 
                        :min-value="today(getLocalTimeZone())"
                        initial-focus 
                        @update:modelValue="date => {componentField.onChange(date); startPopoverOpen=false}"/>
                    </PopoverContent>
                </Popover>
            </FormControl>
            <FormMessage class="text-red-500 text-xs mt-1"/>
            </FormItem>
            </FormField>
        </div>

        <div>
            <!-- Start Time Picker -->
            <FormField v-slot="{componentField}" name="startTime">
            <FormItem>
            <FormControl>
                <Select v-bind="componentField">
                    <SelectTrigger class="w-[180px]">
                    <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                    <SelectContent class="max-h-60">
                    <SelectGroup>
                        <SelectLabel>Time (15 min intervals)</SelectLabel>
                        <SelectItem
                        v-for="time in timeOptions"
                        :key="time"
                        :value="time"
                        >
                        {{ time }}
                        </SelectItem>
                    </SelectGroup>
                    </SelectContent>
                </Select>
            </FormControl>
            </FormItem>
            </FormField>
        </div>
    </div>

    <label class="text-sm font-semibold text-gray-700">End Date and Time</label>
    <div class="flex py-2">
        <div class="pr-4">
        <!-- End Date Picker -->
            <FormField v-slot="{componentField}" name="endDate">
            <FormItem>
            <FormControl>
                <Popover v-model:open="endPopoverOpen">
                    <PopoverTrigger as-child>
                    <Button
                        variant="outline"
                        :class="cn(
                        'w-[280px] justify-start text-left font-normal',
                        !componentField.modelValue && 'text-muted-foreground',
                        )"
                    >
                        <CalendarIcon class="mr-2 h-4 w-4" />
                        {{ componentField.modelValue ? df.format(componentField.modelValue.toDate(getLocalTimeZone())) : "Pick a date" }}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0">
                    <Calendar 
                        :modelValue="componentField.modelValue" 
                        :min-value="today(getLocalTimeZone())"
                        initial-focus
                        @update:modelValue="date => {componentField.onChange(date); endPopoverOpen=false}"/>
                    </PopoverContent>
                </Popover>
            </FormControl>
            <FormMessage class="text-red-500 text-xs mt-1"/>
            </FormItem>
            </FormField>
        </div>

        <div>
            <!-- End Time Picker -->
            <FormField v-slot="{componentField}" name="endTime">
            <FormItem>
            <FormControl>
                <Select v-bind="componentField">
                    <SelectTrigger class="w-[180px]">
                    <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                    <SelectContent class="max-h-60">
                    <SelectGroup>
                        <SelectLabel>Time (15 min intervals)</SelectLabel>
                        <SelectItem
                        v-for="time in timeOptions"
                        :key="time"
                        :value="time"
                        >
                        {{ time }}
                        </SelectItem>
                    </SelectGroup>
                    </SelectContent>
                </Select>
            </FormControl>
            </FormItem>
            </FormField>
        </div>
    </div>
</template>