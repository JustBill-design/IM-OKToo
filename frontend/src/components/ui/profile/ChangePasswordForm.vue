<script setup lang="ts">
import { ref } from 'vue'

const current = ref('')
const newPass = ref('')
const confirmPass = ref('')

const change = () => {
  if (newPass.value !== confirmPass.value) {
    alert('Passwords do not match')
  } else {
    alert('Password changed!')
  }
}
</script>

<template>
  <div class="space-y-2 mb-6">
    <label class="font-medium">Change Password</label>
    <input type="password" v-model="current" placeholder="Current password" class="border rounded w-full p-2" />
    <input type="password" v-model="newPass" placeholder="New password" class="border rounded w-full p-2" />
    <input type="password" v-model="confirmPass" placeholder="Confirm password" class="border rounded w-full p-2" />
    <button class="px-4 py-2 bg-[#3B82F6] text-white rounded w-full" @click="change">
      Change Password
    </button>
  </div>
</template>
