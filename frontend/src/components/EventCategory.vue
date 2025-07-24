<script setup lang="ts">
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
        <div class="pr-4 content-center w-[75px]">
        <label class="text-sm font-semibold text-gray-700">Elderly</label>
        </div>
        <FormField v-slot="{componentField}" name="elderly">
        <FormItem>
        <FormControl>
            <Select class="w-[280px]" v-bind="componentField">     
                <SelectTrigger class="w-[180px]">
                <SelectValue placeholder="Select elderly" />
                </SelectTrigger>
                <SelectContent class="max-h-60">
                <SelectGroup>
                    <SelectItem value="Sally">
                    Sally
                    </SelectItem>
                    <SelectItem value="June">
                    June
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