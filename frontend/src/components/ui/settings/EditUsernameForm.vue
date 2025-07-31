<template>
  <div class="form-card">
    <button @click="toggleForm" class="toggle-btn">
      {{ showForm ? 'Cancel' : 'Edit Username' }}
    </button>

    <form v-if="showForm" @submit.prevent="handleSubmit" class="form">
      <div class="input-group">
        <label>New Username</label>
        <input v-model="username" type="text" required />
      </div>
      <button type="submit" class="submit-btn">Update Username</button>
    </form>

    <p v-if="message" :class="['message', messageType]">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  initialUsername: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:username'])

const username = ref(props.initialUsername)
const showForm = ref(false)
const message = ref('')
const messageType = ref('')
const isLoading = ref(false)

watch(() => props.initialUsername, (newVal) => {
  username.value = newVal
})

function toggleForm() {
  showForm.value = !showForm.value
  message.value = ''
}

async function handleSubmit() {
  message.value = ''
  try {
    await fetch('/api/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value })
    })

    emit('update:username', username.value)
    message.value = 'Username updated successfully!'
    messageType.value = 'success'
  } catch (err) {
    message.value = 'Error updating username. Please try again.'
    messageType.value = 'error'
  } finally {
    isLoading = false
  }
}
</script>

<style scoped>
.form-card {
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

h3 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.input-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.toggle-btn {
  background: #4b5563;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 1rem;
}

.toggle-btn:hover {
  background-color: #374151;
}

.submit-btn {
  background: #2c3e50;
  color: #fff;
  padding: 0.6rem 1.5rem;
  border-radius: 5px;
  border: none;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover {
  background: #1f2937;
}

.message {
  margin-top: 0.75rem;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.success {
  background-color: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.error {
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}
</style>
