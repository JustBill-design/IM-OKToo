<script setup lang="ts">
import EditUsernameForm from './EditUsernameForm.vue'
import EditPhotoUploader from './EditPhotoUploader.vue'
import ChangePasswordForm from './ChangePasswordForm.vue'
import ManageElderlies from './ManageElderlies.vue'
</script>

<template>
  <div class="min-h-screen bg-[#ffffff] py-8 flex justify-center">
    <div class="w-full max-w-4xl bg-white rounded-xl shadow-md p-8 space-y-10">
      <h1 class="text-2xl font-semibold text-[#1e3a8a]">Settings</h1>

      <section>
        <h2 class="text-xl font-semibold mb-4">Account Management</h2>
        <EditUsernameForm />
        <EditPhotoUploader />
        <ChangePasswordForm />
        <DeleteAccountForm />
      </section>

      <section class="mt-10">
        <h2 class="text-xl font-semibold mb-4">Elder Care Details</h2>
        <ManageElderlies />
      </section>
    </div>
  </div>
</template>
