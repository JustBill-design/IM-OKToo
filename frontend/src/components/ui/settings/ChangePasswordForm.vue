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
      <button type="submit" :disabled="isLoading">{{ isLoading ? 'Changing...':'Change password' }}</button>
    </form>
    <p v-if="message" :class="['message', messageType]">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const current = ref('')
const newPass = ref('')
const message = ref('')
const isLoading = ref(false)

async function onSubmit() {
  if (newPass.value.length < 6) {
    message.value = 'Password must be at least 6 characters.'
    message.type = 'error'
    return
  }
  try {
    isLoading.value = true
    message.value = ''

    const response = await fetch('http://localhost:3001/api/me/password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: current.value, newPassword: newPass.value })
    })
    if (response.ok) {
      const data = response.json()
      message.value = 'Password successfully changed!'
      message.type = 'success'
      current.value = ''
      newPass.value = ''
    } else {
      const errorData = await response.json()
      message.value = 'Failed to change password. Please try again.'
      message.type = 'error'
      throw new Error(errorData.message)
    }
  } catch {
    message.value = 'Failed to change password. Please try again.'
    message.type = 'error'
  } finally {
    isLoading.value = false
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
