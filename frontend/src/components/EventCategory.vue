<script setup lang="ts">
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

</script>

<template>
    <div class="flex py-2">
        <div class="pr-4 content-center">
        <label class="text-sm font-semibold text-gray-700">Category</label>
        </div>
        <div>
            <FormField v-slot="{componentField}" name="category">
            <FormItem>
            <FormControl>
                <Select v-bind="componentField">     
                    <SelectTrigger class="w-[180px]">
                    <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent class="max-h-60">
                    <SelectGroup>
                        <SelectItem value="Appointments">
                        Appointments
                        </SelectItem>
                        <SelectItem value="Chores & Household Tasks">
                        Chores & Household Tasks
                        </SelectItem>
                        <SelectItem value="Medication & Health Management">
                        Medication & Health Management
                        </SelectItem>
                        <SelectItem value="Rest & Wellness">
                        Rest & Wellness
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