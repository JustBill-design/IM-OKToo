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
    <FormField v-slot="{ componentField }" name="title">
        <FormItem>
        <FormLabel class="font-semibold text-gray-700">Event Title</FormLabel>
        <FormControl>
            <Input
            type="text"
            placeholder="Add Title"
            v-bind="componentField"
            class="mt-2 w-full"
            />
        </FormControl>
        <FormMessage class="text-red-500 text-xs mt-1" />
        </FormItem>
    </FormField>
</template>