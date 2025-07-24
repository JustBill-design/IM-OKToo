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
            </FormControl>
            </FormItem>
            </FormField>
        </div>
    </div>
</template>