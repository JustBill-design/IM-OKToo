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
        <label class="text-sm font-semibold text-gray-700">Caretaker</label>
        </div>
        <div>
            <FormField v-slot="{componentField}" name="caretaker">
            <FormItem>
            <FormControl>
                <Select v-bind="componentField">     
                    <SelectTrigger class="w-[180px]">
                    <SelectValue placeholder="Select caretaker" />
                    </SelectTrigger>
                    <SelectContent class="max-h-60">
                    <SelectGroup>
                        <SelectItem value="Bob">
                        Bob
                        </SelectItem>
                        <SelectItem value="Ah Min">
                        Ah Min
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