<script setup lang="ts">
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'

import { Input } from './ui/input'

</script>

<template>
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
</template>