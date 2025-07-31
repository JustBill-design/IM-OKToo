<template>
    <!-- <h3 class="form-title">Update Email</h3>
    <p class="current-info">Current email: <strong>{{ props.initialEmail }}</strong></p> -->
    <div class="button-container">
      <button @click="toggleForm" class="toggle-btn">
        {{ showForm ? 'Back' : 'Edit Email' }}
      </button>
    </div>

    <form v-if="showForm" @submit.prevent="handleSubmit" class="form">
      <div class="input-group">
        <label>New Email</label>
        <input v-model="newEmail" type="email" required />
      </div>
      <div class="input-group">
        <label>Confirm Email</label>
        <input v-model="confirmEmail" type="email" required />
      </div>
      <button type="submit" class="submit-btn" :disabled="isLoading">
        {{ isLoading ? 'Updating...' : 'Update Email' }}
      </button>
    </form>

    <p v-if="message" :class="['message', messageType]">{{ message }}</p>

</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  initialEmail: String
})

const emit = defineEmits(['update:email'])

const newEmail = ref(props.initialEmail || '')
const confirmEmail = ref('')
const showForm = ref(false)
const message = ref('')
const messageType = ref('')
const isLoading = ref(false)

watch(() => props.initialEmail, (val) => {
  newEmail.value = val
})

function toggleForm() {
  showForm.value = !showForm.value
  message.value = ''
  if (!showForm.value) {
    newEmail.value = props.initialEmail || ''
    confirmEmail.value = ''
  }
}

async function handleSubmit() {
  message.value = ''
  if (!newEmail.value || !confirmEmail.value) {
    message.value = 'Please fill in all fields.'
    messageType.value = 'error'
    return
  }
  if (newEmail.value !== confirmEmail.value) {
    message.value = 'Emails do not match.'
    messageType.value = 'error'
    return
  }

  isLoading.value = true
  try {
    const response = await fetch('/api/me/email', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newEmail: newEmail.value })
    })
    if (response.ok) {
      message.value = 'Email updated! Please verify it in your inbox.'
      messageType.value = 'success'
      emit('update:email', newEmail.value)
      showForm.value = false
    } else {
      const error = await response.json()
      message.value = error.message || 'Failed to update email.'
      messageType.value = 'error'
    }
  } catch {
    message.value = 'Network error. Please try again.'
    messageType.value = 'error'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.form-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #2c3e50;
}

.current-info {
  color: #6b7280;
  margin-bottom: 1rem;
  font-size: 0.95rem;
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
  justify-content: flex-start;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.25rem;
}

label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #374151;
}

input[type="email"] {
  padding: 0.5rem 0.75rem;
  border: 1.5px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  background: #f9fafb;
}
input:focus {
  outline: none;
  background: #fff;
  border-color: #2563eb;
}
.button-container {
  /* text-align: left;
   */
  max-width: 600px;
  margin: 1rem 0;
  padding: 1rem;
}
.submit-btn {
  background: #2c3e50;
  color: white;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.submit-btn:hover {
  background: #1f2937;
}

.message {
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  border-radius: 4px;
  text-align: center;
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
