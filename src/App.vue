<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <header class="sticky top-0 z-40 w-full border-b bg-background">
      <div class="container flex items-center h-16 space-x-4 sm:justify-between sm:space-x-0">
        <div class="flex gap-6 md:gap-10">
          <a href="/" class="flex items-center space-x-2">
            <span class="inline-block font-bold">IM-OKToo</span>
          </a>
          <nav class="flex gap-6">
            <router-link to="/" class="text-sm font-medium transition-colors hover:text-primary">Home</router-link>
            <router-link to="/calendar" class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Calendar</router-link>
            <router-link to="/forum" class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Forum</router-link>
            <router-link to="/resources" class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Resources</router-link>
          </nav>
        </div>
      </div>
    </header>
    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>