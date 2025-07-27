<template>
  <div class="form-card">
    <h3>Update Profile Photo</h3>
    <input type="file" @change="onFileChange" accept="image/*" />
    <button :disabled="!file" @click="onSubmit">Upload</button>
    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const file = ref(null)
const message = ref('')

function onFileChange(e) {
  file.value = e.target.files[0]
}

async function onSubmit() {
  if (!file.value) return
  const form = new FormData()
  form.append('photo', file.value)
  try {
    await fetch('/api/me/photo', {
      method: 'POST',
      body: form
    })
    message.value = 'Photo updated! Changes upon reload.'
  } catch {
    message.value = 'Upload failed.'
  }
}
</script>

<style scoped>
.form-card { margin-bottom: 2rem; padding:1rem; background:white; border-radius:6px; box-shadow:0 2px 4px rgba(0,0,0,0.05);}
h3 { margin-bottom: 0.5rem; color: var(--primary-color); }
button { margin-top: 1rem; background: var(--accent-color); color: white; padding: 0.6rem 1rem; border:none; border-radius:4px; cursor:pointer; }
.message { margin-top:0.5rem; font-size:0.9rem; }
</style>
