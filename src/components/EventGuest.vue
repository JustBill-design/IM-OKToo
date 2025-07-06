<script setup lang="ts">
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'

</script>

<template>
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
</template>