<script setup lang="ts">
import { ref } from 'vue'

const file = ref<File| null>(null)
const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  file.value = input.files?.[0] ?? null
}
const upload = () => {
  if (file.value) alert(`Uploading: ${file.value.name}`)
}
</script>

<template>
  <div class="space-y-2 mb-6">
    <label class="font-medium">Edit Profile Photo</label>
    <input type="file" accept="image/*" @change="onFileChange" class="block" />
    <button
      class="px-4 py-2 bg-[#3B82F6] text-white rounded"
      :disabled="!file"
      @click="upload"
    >
      Upload
    </button>
  </div>
</template>
