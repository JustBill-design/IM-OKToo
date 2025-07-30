<!-- <template>
    <div class="settings-container"></div>
        <h1 class="settings-header">Settings</h1>
        
        <div class="settings-content"></div>
            <h2 class="profile-header">Profile</h2>
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
</template> -->
<template>
  <SettingsComponent/>
</template>

<script setup>
  import {SettingsComponent} from './ui/settings'
</script>

<style>

</style>
