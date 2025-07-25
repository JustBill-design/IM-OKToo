<script setup lang="ts">
import {
  DateFormatter,
  getLocalTimeZone,
} from '@internationalized/date'
import { ref, computed } from 'vue'

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
</script>


<template>
    <div class="flex py-2">
        <div class="pr-4 content-center">
        <label class="text-sm font-semibold text-gray-700">Recurring Event?</label>
        </div>
        <div>
            <FormField v-slot="{componentField}" name="recurrence">
            <FormItem>
            <FormControl>
                <Select v-bind="componentField">     
                    <SelectTrigger class="w-[180px]">
                    <SelectValue placeholder="Does not repeat" />
                    </SelectTrigger>
                    <SelectContent class="max-h-60">
                    <SelectGroup>
                        <SelectItem value="FREQ=DAILY;COUNT=1">
                        Does not repeat
                        </SelectItem>
                        <SelectItem value="FREQ=DAILY">
                        Daily
                        </SelectItem>
                        <SelectItem value="FREQ=WEEKLY">
                        Weekly on this day
                        </SelectItem>
                        <SelectItem value="FREQ=MONTHLY">
                        Monthly on this day
                        </SelectItem>
                        <SelectItem value="FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR">
                        Every weekday
                        </SelectItem>
                        <SelectItem value="FREQ=YEARLY">
                        Anually on this day
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