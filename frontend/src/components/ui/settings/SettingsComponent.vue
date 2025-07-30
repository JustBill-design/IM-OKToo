<template>
  <div class="settings-container">
    <h1 class="settings-title">Settings</h1>

    <!-- Profile Display Section -->
    <div class="profile-section">
      <div class="profile-avatar">
        <img :src='/src/assets/default.png' :alt="username || 'Profile'" />
      </div>
      <div class="profile-info">
        <h2 class="profile-name">{{ username || 'Loading...' }}</h2>
        <p class="profile-email">{{ email || 'Loading...' }}</p>
        
        <!-- Photo uploader if you want to include it -->
        <!-- <EditPhotoUploader /> -->
        
        <ChangePasswordForm/>
        <ChangeEmailForm/>
        <EditUsernameForm/>
      </div>
    </div>

    <!-- Elderly management-->
    <div class="elderly-management">
      <h2 class="section-title">Elderly Management</h2>
      <p class="section-description">Manage your elderly care details below</p>
      <hr class="divider" />
      <h3 class="subsection-title">Elder Care Details</h3>
      <ManageElderly />
    </div>

    <EditUsernameForm />
    <ChangeEmailForm/>
    <ChangePasswordForm />

    <!-- Danger Zone -->
    <div class="danger-zone">
      <hr class="divider" />
      <h2 class="section-title danger-title">Delete Account</h2>
      <DeleteAccount />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EditUsernameForm from './EditUsernameForm.vue'
import ChangeEmailForm from './ChangeEmailForm.vue'
import ChangePasswordForm from './ChangePasswordForm.vue'
// import EditPhotoUploader from './EditPhotoUploader.vue' // Uncomment if using
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
    const storedUsername = localStorage.getItem('username')
    const isGoogleAuth = localStorage.getItem('googleAuth') === 'true'
    
    if (storedUsername) {
      username.value = storedUsername
      if (isGoogleAuth) {
        email.value = storedUsername 
      } else {
        email.value = localStorage.getItem('email') || `${storedUsername}@mymail.sutd.edu.sg`
      }
    } else {
      username.value = 'test User'
      email.value = 'user@mymail.sutd.edu.sg'
    }
    try {
      const response = await fetch('/api/me')
      if (response.ok) {
        const userData = await response.json()
        username.value = userData.username
        email.value = userData.email
        profileImage.value = userData.profileImage
      }
    } catch (apiError) {
      console.log('API not available, using local data')
    }
  } catch (error) {
    console.error('Failed to load user data:', error)
    // Set fallback values
    username.value = 'test User'
    email.value = 'user@mymail.sutd.edu.sg'
  }
})
</script>

<style scoped>
.settings-container {
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
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.profile-avatar img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #4a6b8a;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #4a6b8a;
  margin: 0 0 0.5rem 0;
}

.profile-email {
  font-size: 1rem;
  color: #64748b;
  margin: 0 0 1.5rem 0;
}

.elderly-management {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.subsection-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #4a6b8a;
}

.section-description {
  color: #64748b;
  margin-bottom: 1rem;
}

.divider {
  border: none;
  height: 1px;
  background-color: #e2e8f0;
  margin: 2rem 0;
}

.danger-zone .danger-title {
  color: #dc2626;
}
</style>