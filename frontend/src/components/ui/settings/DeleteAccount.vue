<script setup lang="ts">
const remove = () => {
  if (confirm('Are you sure you want to delete your account?')) {
    alert('Account deletion triggered')
  }
}
</script>

<template>
  <div class="mt-4">
    <button
      class="px-4 py-2 bg-[#FF6F61] text-white rounded w-full"
      @click="remove">
      Delete Account
    </button>
  </div>
</template>
