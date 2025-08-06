<template>
  <div class="settings-container">
    <h1 class="settings-title">Settings</h1>

    <!-- Profile Display Section -->
    <!-- <section class="profile-section">
      <h2 class="settings-content">Edit your profile details here</h2>
    </section> -->

      <!-- Username section -->
      <!-- <div class="settings-grid">
      <div class="setting-card">
        <h2 class="section-label">Update Username</h2>
        <EditUsernameForm v-model="username"/>
      </div> -->

      <!-- Email section -->
    <!-- <div class="setting-card">
        <h2 class="section-label">Update Email</h2>
        <p class="profile-email">Current email: {{ email }}</p>
        <ChangeEmailForm v-model="email"/>
    </div> -->

    <!-- Password section -->
    <!-- <div class="setting-card">
        <h2 class="section-label">Update Password</h2>
        <ChangePasswordForm v-model="password"/>
      </div>
    </div> -->

    <!-- Elderly management-->
    <div class ="elderly-management-header">
      <h2 class="section-label">Manage Elderly</h2>
      <p class="section-description">Add and manage elderly under your care.</p>
    <section class="elderly-management">
      <ManageElderly username=current_user />
    </section>
    </div>

    <!-- Danger Zone: Delete section -->
    <!-- <div class="card destructive-card">
      <h2 class="delete-account">Delete Account</h2>
      <p class="danger-description">This action is irreversible. Please proceed with caution.</p>
      <DeleteAccount @delete="remove" />
    </div> -->
  </div>
</template>


<script setup>

import { ref, reactive, onMounted } from 'vue'
// import FormField from './FormField.vue'
// import EditUsernameForm from './EditUsernameForm.vue'
// import ChangeEmailForm from './ChangeEmailForm.vue'
// import ChangePasswordForm from './ChangePasswordForm.vue'
import ManageElderly from './ManageElderly.vue'
// import DeleteAccount from './DeleteAccount.vue'

// const showUsernameForm = ref(false)
// const showEmailForm = ref(false)
// const showPasswordForm = ref(false)

// // IDK IF WE NEED THIS
const current_user = ref('');
// const email = ref('')
current_user.value = localStorage.getItem('username');

const usernameMessage = ref('')
// const emailMessage = ref('')
// const passwordMessage = ref('')
const elderlies = ref([]) // Array to hold elderly data
const elderlyForm = reactive({
  name: '',
  age: '',
  medicalCondition: '',
  allergies: ''
})

// const currentUsername = ref('current username')
// const currentEmail = ref('someone@example.com')

// const profileImageSrc = computed(() => {
//   return profileImage.value && profileImage.value.trim() !== '' 
//     ? profileImage.value 
//     : new URL('../assets/lionmascot.png', import.meta.url).href
// })

// onMounted(async () => {
//   try {
//     const storedUsername = localStorage.getItem('username')
//     const isGoogleAuth = localStorage.getItem('googleAuth') === 'true'
    
//     if (storedUsername) {
//       username.value = storedUsername
//       if (isGoogleAuth) {
//         email.value = storedUsername 
//       } else {
//         email.value = localStorage.getItem('email') || `${storedUsername}@mymail.sutd.edu.sg`
//       }
//     } else {
//       username.value = 'test User'
//       email.value = 'user@mymail.sutd.edu.sg'
//     }
//     try {
//       const response = await fetch('/api/me')
//       if (response.ok) {
//         const userData = await response.json()
//         username.value = userData.username
//         email.value = userData.email
//         profileImage.value = userData.profileImage
//       }
//     } catch (apiError) {
//       console.log('API not available, using local data')
//     }
//   } catch (error) {
//     console.error('Failed to load user data:', error)
//     // Set fallback values
//     username.value = 'test User'
//     email.value = 'user@mymail.sutd.edu.sg'
//   }
// })
</script>

<style scoped>
.settings-container {
  max-width: 900px;
  margin: auto;
  padding: 2rem;
  background-color: #e0f6ff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.settings-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.settings-content {
  font-size: 1.4rem;
  font-weight: 500;
  color: #000000;
  margin-bottom: 1.75rem;
}

.settings-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;
}

.setting-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.profile-section {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.section-label {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.profile-avatar img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #2c3e50;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.profile-email {
  font-size: 1rem;
  color: #2c3e50;
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
  background-color: #4a6b8a;
  margin: 2rem 0;
}

.danger-zone, .danger-title {
  color: #dc2626;
}

.danger-description {
  color: #9ca3af;
  margin-bottom: 1rem;
}

.delete-account {
  font-size: 1.25rem;
  font-weight: 600;
  color: #dc2626;
  margin-bottom: 0.5rem;
}

</style>