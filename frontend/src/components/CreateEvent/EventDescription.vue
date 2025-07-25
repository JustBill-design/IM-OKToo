<script setup lang="ts">
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

</script>

<template>
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
</template>