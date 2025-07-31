<script setup lang="ts">
import lionMascot from '@/assets/lionfamily.jpg'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion'

const defaultValue = 'item-1'

const accordionItems = [
  { value: 'item-1', title: 'Ye Ye', content: 'Yes. It adheres to the WAI-ARIA design pattern.' },
  { value: 'item-2', title: 'Bill', content: 'Yes. It\'s unstyled by default, giving you freedom over the look and feel.' },
  { value: 'item-3', title: 'Natasha', content: 'Yes! You can use the transition prop to configure the animation.' },
]

</script>

<template>
  <div class="flex min-h-screen">
    <div class="flex flex-col flex-1 space-y-8 items-center">
      <Card class="w-full h-[500px] mx-auto">
        <CardHeader>
          <CardTitle class="text-3xl font-semibold">Family</CardTitle>
          <CardDescription class="text-lg mt-1">family_name</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex justify-center items-center w-full">
            <div class="w-80 h-80 mb-4 flex justify-center items-center">
              <img
                :src="lionMascot"
                alt="Lion mascot"
                draggable="false"
                class="object-contain w-full h-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="w-full h-[500px] mx-auto">
        <CardHeader>
          <CardTitle class="text-3xl font-semibold">Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex space-x-4 mb-4">
            <div class="font-semibold">Address</div>
            <div>address_field</div>
          </div>

          <div class="flex space-x-4 mb-4">
            <div class="font-semibold">Contact No</div>
            <div>contact_no</div>
          </div>

          <div class="flex space-x-4 mb-4">
            <div class="font-semibold">Email</div>
            <div>email</div>
          </div>

          <hr class="mb-4"></hr>

          <div class="flex space-x-4 mb-4">
            <div class="w-32 font-semibold">Description</div>
          </div>

          <div class="flex space-x-4 mb-4">
            <div class="flex-1 break-words">
              description
            </div>
          </div>
          
        </CardContent>
      </Card>
    </div>

    <div class="flex flex-col flex-1 space-y-8 ml-10 items-center">
      <Card class="w-full h-[500px] mx-auto">
        <CardHeader>
          <CardTitle class="text-3xl font-semibold">Caretakers</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" class="w-full" collapsible :default-value="defaultValue">
            <AccordionItem v-for="item in accordionItems" :key="item.value" :value="item.value">
              <AccordionTrigger>{{ item.title }}</AccordionTrigger>
              <AccordionContent>
                {{ item.content }}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card class="w-full h-[500px] mx-auto">
        <CardHeader>
          <CardTitle class="text-3xl font-semibold">Elderly</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" class="w-full" collapsible :default-value="defaultValue">
            <AccordionItem v-for="item in accordionItems" :key="item.value" :value="item.value">
              <AccordionTrigger>{{ item.title }}</AccordionTrigger>
              <AccordionContent>
                {{ item.content }}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  </div>

</template>

