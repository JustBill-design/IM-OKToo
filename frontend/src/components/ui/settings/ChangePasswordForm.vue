<template>
  <div class="password-wrapper">
    <!-- <h3 class="form-title">Change Password</h3> -->

    <button v-if="!showForm" @click="toggleForm" class="toggle-btn">
      Change Password
    </button>

    <form v-if="showForm" @submit.prevent="onSubmit" class="form">
      <div class="input-group">
        <label>Old Password</label>
        <input v-model="currentPassword" type="password" required />
      </div>
      <div class="input-group">
        <label>New Password</label>
        <input v-model="newPassword" type="password" required />
      </div>
      <div class="input-group">
        <label>Confirm New Password</label>
        <input v-model="confirmPassword" type="password" required />
      </div>

      <div class="button-group">
        <button type="submit" class="submit-btn">Update Password</button>
        <button type="button" @click="toggleForm" class="back-btn">Back</button>
      </div>
    </form>

    <p v-if="message" :class="['message', messageType]">{{ message }}</p>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'

const showForm = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const message = ref('')
const messageType = ref('')

function toggleForm() {
  // console.log("toggle form clicked")// for debugging
  showForm.value = !showForm.value
  message.value = ''
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}

async function onSubmit() {
  message.value = ''
  if (newPassword.value.length < 6) {
    message.value = 'Password must be at least 6 characters.'
    messageType.value = 'error'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    message.value = 'Passwords do not match.'
    messageType.value = 'error'
    return
  }

  try {
    const res = await fetch('/api/me/password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: currentPassword.value,
        newPassword: newPassword.value
      })
    })
    if (res.ok) {
      message.value = 'Password changed successfully!'
      messageType.value = 'success'
      toggleForm()
    } else {
      message.value = 'Failed to change password.'
      messageType.value = 'error'
    }
  } catch {
    message.value = 'Network error. Please try again.'
    messageType.value = 'error'
  }
}
</script>

<style scoped>
.password-wrapper {
  max-width: 600px;
  margin: 1rem 0;
  padding: 1rem;
}

.form-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #2c3e50;
}

.toggle-btn {
  margin-bottom: 1rem;
  background: #2c3e50;
  color: white;
  font-weight: 500;
  padding: 0.5rem 1.2rem;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}
.toggle-btn:hover {
  background: #1f2937;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #374151;
}

input[type="password"] {
  padding: 0.5rem 0.75rem;
  border: 1.5px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  background: #f9fafb;
}
input:focus {
  outline: none;
  background: #fff;
  border-color: #2c3e50;
}

.button-group {
  display: flex;
  gap: 1rem;
}

.submit-btn,
.back-btn {
  background: #2c3e50;
  color: white;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.submit-btn:hover,
.back-btn:hover {
  background: #1f2937;
}

.message {
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  border-radius: 4px;
  text-align: left;
  max-width: 500px;
  width: 100%;
}
.message.success {
  background: #ecfdf5;
  color: #15803d;
  border: 1px solid #bbf7d0;
}
.message.error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}
</style>