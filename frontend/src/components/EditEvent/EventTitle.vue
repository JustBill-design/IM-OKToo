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
    <div class="flex items-center">
        <div class="pr-4 content-center w-[75px]">
        <label class="text-sm font-semibold text-gray-700">Event:</label>
        </div>
        <FormField v-slot="{ componentField }" name="title" class="flex-1">
            <FormItem class="flex-1">
            <FormControl>
                <Input
                class="flex-1 min-w-0"
                type="text"
                placeholder="Add Title"
                v-bind="componentField"
                />
            </FormControl>
            <FormMessage class="text-red-500 text-xs mt-1" />
            </FormItem>
        </FormField>
    </div>
</template>