<template>
  <div class="page-container">
    <h1 class="page-title">Settings</h1>

    <!-- Profile Display Section -->
    <div class="profile-section">
      <div class="profile-avatar">
        <img :src="profileImageSrc" :alt="username || 'Profile'" />
      </div>
      <div class="profile-info">
        <h2 class="profile-name">{{ username || 'Loading...' }}</h2>
        <p class="profile-email">{{ email || 'Loading...' }}</p>
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
import { SettingsComponent } from './index'   <!-- if using index.ts -->
import EditUsernameForm from './EditUsernameForm.vue'
import ChangeEmailForm from './ChangeEmailForm.vue'
import ChangePasswordForm from './ChangePasswordForm.vue'
import EditPhotoUploader from './EditPhotoUploader.vue'
import ChangeEmailForm from './ChangeEmailForm.vue'

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
/* reuse your page-container, page-title styles from before */
/* .page-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}*/
.settings-container {
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  animation: fadeInDown 1s;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.settings-header {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.settings-section {
  margin-bottom: 2rem;
}

.settings-section h2 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

button {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #2563eb;
}
</style>
