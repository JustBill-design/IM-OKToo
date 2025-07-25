<script setup lang="ts">
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

</script>

<template>
    <div class="flex py-2">
        <div class="pr-4 content-center w-[75px]">
        <label class="text-sm font-semibold text-gray-700">Category</label>
        </div>
        <FormField v-slot="{componentField}" name="category">
        <FormItem>
        <FormControl>
            <Select class="w-[280px]" v-bind="componentField">     
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
        <FormMessage class="text-red-500 text-xs mt-1"/>
        </FormItem>
        </FormField>
    </div>
</template>