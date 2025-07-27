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
    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const username = ref('')
const message = ref('')

async function onSubmit() {
  try {
    // Replace with real API call
    await fetch('/api/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value })
    })
    message.value = 'Username updated! Refresh to see changes.'
  } catch (err) {
    message.value = 'Error updating username.'
  }
}
</script>

<style scoped>
.form-card { margin-bottom: 2rem; padding:1rem; background:white; border-radius:6px; box-shadow:0 2px 4px rgba(0,0,0,0.05);}
h3 { margin-bottom: 0.5rem; color: var(--primary-color); }
label { display: block; margin-bottom: 1rem; }
input { width: 100%; padding: 0.5rem; border:1px solid #ccc; border-radius:4px; }
button { background: var(--accent-color); color: white; padding: 0.6rem 1rem; border:none; border-radius:4px; cursor:pointer; }
.message { margin-top:0.5rem; font-size:0.9rem; }
</style>
