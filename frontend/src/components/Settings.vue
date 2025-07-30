<template>
  <div class="settings-page">
    <SettingsComponent />
  </div>
</template>

<script setup lang="ts">
  import {SettingsComponent} from './ui/settings'
</script>

<style>

.page-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}
.page-title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}
</style>
