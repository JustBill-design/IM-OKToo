<template>
  <div class="form-card">
    <h3>Change Password</h3>
    <form @submit.prevent="onSubmit">
      <label>
        Current Password:
        <input v-model="current" type="password" required minlength="6" />
      </label>
      <label>
        New Password:
        <input v-model="newPass" type="password" required minlength="6" />
      </label>
      <button type="submit">Change Password</button>
    </form>
    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const current = ref('')
const newPass = ref('')
const message = ref('')

async function onSubmit() {
  if (newPass.value.length < 6) {
    message.value = 'Password must be at least 6 characters.'
    return
  }
  try {
    await fetch('/api/me/password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: current.value, newPassword: newPass.value })
    })
    message.value = 'Password changed! Please log in again.'
  } catch {
    message.value = 'Failed to change password.'
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
