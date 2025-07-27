<template>
  <div class="form-card">
    <h3>Change Email</h3>
    <form @submit.prevent="onSubmit">
      <label>
        New Email:
        <input v-model="newEmail" type="email" required />
      </label>
      <label>
        Current Password (for verification):
        <input v-model="password" type="password" required />
      </label>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Updating...' : 'Change Email' }}
      </button>
    </form>
    <p v-if="message" :class="['message', messageType]">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const newEmail = ref('')
const password = ref('')
const message = ref('')
const messageType = ref('') 
const isLoading = ref(false)

async function onSubmit() {
    message.value = '' // clear previous message

    if (!newEmail.value || !password.value) {
        message.value = 'Please fill in all fields.'
        messageType.value = 'error'
        return
    }

    isLoading.value = true
    message.value = ''

    try {
    const response = await fetch('/api/me/email', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
        newEmail: newEmail.value, 
        password: password.value 
        })
    })

    if (response.ok) {
        message.value = 'Email updated! Please check your inbox to verify the new email.'
        messageType.value = 'success'
        newEmail.value = ''
        password.value = ''
    } else {
        const error = await response.json()
        message.value = error.message || 'Failed to update email.'
        messageType.value = 'error'
    }
    } catch (error) {
        message.value = 'Network error. Please try again.'
        messageType.value = 'error'
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