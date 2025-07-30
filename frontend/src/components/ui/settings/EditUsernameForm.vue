<template>
  <div class="form-card">
    <h3>Edit Username</h3>
    <form @submit.prevent="onSubmit">
      <label>
        New Username:
        <input v-model="username" type="text" required />
      </label>
      <button type="submit">Save</button>
    </form>
    <p v-if="message" :class="['message', messageType]">{{ message }}</p>
    
  </div>
</template>

<script setup>
import { ref } from 'vue'
const username = ref('')
const message = ref('')
const messageType = ref('')

async function onSubmit() {
  message.value = '' // clear previous message
  try {
    // Replace with real API call
    await fetch('/api/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value })
    })
    message.value = 'Username updated! Refresh to see changes.'
    messageType.value = 'success'
  } catch (err) {
    message.value = 'Error updating username.'
    messageType.value = 'error'
  }
}
</script>

<style scoped>
.form-card { margin-bottom: 2rem; padding:1rem; background:white; border-radius:6px; box-shadow:0 2px 4px rgba(0,0,0,0.05);}
h3 { margin-bottom: 0.5rem; color: var(--primary-color); }
label { display: block; margin-bottom: 1rem; }
input { width: 100%; padding: 0.5rem; border:1px solid #ccc; border-radius:4px; }
button { background: var(--accent-color); color: white; padding: 0.6rem 1rem; border:none; border-radius:4px; cursor:pointer; }
button:hover { background-color: #2563eb; transform: translateY(-1px); }
button:active { transform: translateY(0); }
.message { margin-top:0.5rem; font-size:0.9rem; padding: 0.5rem; border-radius: 4px; }
.message.success { background-color: #f0f9ff; color: #0369a1; border: 1px solid #bae6fd; }
.message.error { background-color: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
button:disabled { background-color: #9ca3af; cursor: not-allowed; transform: none; }
</style>
