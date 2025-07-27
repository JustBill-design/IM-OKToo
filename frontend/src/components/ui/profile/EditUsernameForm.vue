<script setup lang="ts">
import { ref } from 'vue'

const username = ref('')
const save = () => {
  // call API or emit event
  alert(`Saving new username: ${username.value}`)
}
</script>

<template>
  <div class="space-y-2 mb-6">
    <label class="font-medium">Edit Username</label>
    <input v-model="username" class="border rounded p-2 w-full" placeholder="New username" />
    <button class="px-4 py-2 bg-[#3B82F6] text-white rounded w-full" @click="save">Save</button>
  </div>
</template>
