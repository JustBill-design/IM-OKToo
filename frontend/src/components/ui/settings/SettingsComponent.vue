<template>
  <div class="settings-container">
    <h1 class="settings-title">Settings</h1>

    <!-- Profile Display Section -->
    <div class="profile-section">
      <div class="profile-avatar">
        <img :src="profileImageSrc" :alt="username || 'Profile'" />
      </div>
      <div class="profile-info">
        <h2 class="profile-name">{{ username || 'Loading...' }}</h2>
        <p class="profile-email">{{ email || 'Loading...' }}</p>
      </div>
      <div class="profile-actions">
        <EditPhotoUploader />
        <button @click="$emit('edit-profile')">Edit Profile</button>
      </div>
    </div>
    <!-- Elderly management-->
    <div class="elderly-management">
      <h2 class="text-xl font-semibold mb-4">Elderly Management</h2>
      <p class="text-gray-600 mb-4">Manage your elderly care details below</p>
      <hr class="my-8" />
      <h2 class="text-xl font-semibold mb-4">Elder Care Details</h2>
      <ManageElderly />

    <!-- Danger Zone -->
    <div class="delete-account">
      <hr class="my-8" />
      <h2 class="text-xl font-semibold mb-4 text-red-600">Delete Account</h2>
      <DeleteAccount />
    </div>
  </div>

          


    <EditUsernameForm />
    <ChangeEmailForm/>
    <ChangePasswordForm />
    <EditPhotoUploader />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EditUsernameForm from './EditUsernameForm.vue'
import ChangeEmailForm from './ChangeEmailForm.vue'
import ChangePasswordForm from './ChangePasswordForm.vue'
import EditPhotoUploader from './EditPhotoUploader.vue'
import ManageElderly from './ManageElderly.vue'
import DeleteAccount from './DeleteAccount.vue'

const username = ref('')
const email = ref('')
const profileImage = ref('')

const profileImageSrc = computed(() => {
  return profileImage.value && profileImage.value.trim() !== '' 
    ? profileImage.value 
    : new URL('../assets/lionmascot.png', import.meta.url).href
})

onMounted(async () => {
  try {
    const response = await fetch('/api/me')
    const userData = await response.json()
    username.value = userData.username
    email.value = userData.email
    profileImage.value = userData.profileImage
  } catch (error) {
    console.error('Failed to load user data:', error)
  }
})
</script>

<style scoped>
.settings-wrapper {
  max-width: 900px;
  margin: auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.settings-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.profile-avatar img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #4a6b8a;
}

.profile-info h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #4a6b8a;
}

.profile-info p {
  font-size: 1rem;
  color: #2c3e50;
}

.form-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.danger-zone .section-title {
  color: #ff6b47;
}
</style>
