<template>
    <div class="settings-container"></div>
        <h1 class="settings-header">Settings</h1>
        
        <div class="settings-content"></div>
            <h2 class="profile-header">Profile</h2>
            <template>
  <div class="settings-container">
    <h1 class="settings-header">Settings</h1>

    <div class="settings-section">
      <h2>Edit Profile</h2>
      <button @click="editUsername">Edit Username</button>
      <button @click="editPhoto">Edit Profile Photo</button>
      <button @click="editPassword">Change Password</button>
    </div>

    <div class="settings-section">
      <h2>Manage Care</h2>
      <button @click="addPerson">Add Person Under Your Care</button>
    </div>
  </div>
</template>

<script setup>
function editUsername() {
  alert("Navigate to edit username")
}

function editPhoto() {
  alert("Open photo uploader")
}

function editPassword() {
  alert("Navigate to password change")
}

function addPerson() {
  alert("Open add person form")
}
</script>

<style scoped>
.settings-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
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
