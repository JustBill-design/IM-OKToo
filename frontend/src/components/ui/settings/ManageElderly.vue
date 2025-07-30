<script setup lang="ts">
import { ref } from 'vue'
import type { Elderly } from '../../../types/settings'

const elderlies = ref<Elderly[]>([])
const newName = ref('')

function add() {
  elderlies.value.push({ id: Date.now().toString(), name: newName.value, age: 0, medicalCondition: '', allergies: '' })
  newName.value = ''
}
function edit(idx: number) {
  const updated = prompt('Edit name', elderlies.value[idx].name)
  if (updated) elderlies.value[idx].name = updated
}
// function remove(idx: number) {
//   if (confirm('Remove this elder?')) elderlies.value.splice(idx, 1)
// }
</script>

<template>
  <div>
    <p class="mb-2">Number of elderlies: <strong>{{ elderlies.length }}</strong></p>
    <ul class="space-y-2 mb-4">
      <li
        v-for="(e, i) in elderlies"
        :key="e.id"
        class="flex justify-between p-3 bg-[#F0F9FF] rounded"
      >
        <span>{{ e.name }}</span>
        <div class="space-x-2">
          <button class="text-sm text-[#3B82F6]" @click="edit(i)">Edit</button>
          <!-- <button class="text-sm text-[#FF6F61]" @click="remove(i)">Remove</button> -->
        </div>
      </li>
    </ul>

    <div class="flex items-center gap-2">
      <input
        type="text"
        v-model="newName"
        placeholder="Add elderly name"
        class="flex-1 border rounded p-2"
      />
      <button
        class="px-4 py-2 bg-[#FF6F61] text-white rounded"
        :disabled="!newName"
        @click="add"
      >
        Add
      </button>
    </div>
    <p class="mt-4 text-sm text-gray-500">
      Note: You can add elderlies under your care.
    </p>
  </div>
</template>
