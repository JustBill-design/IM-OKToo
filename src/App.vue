<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Calendar', path: '/calendar' },
  { name: 'Forum', path: '/forum' },
  { name: 'Resources', path: '/resources' },
];

const route = useRoute();
const showLayout = computed(() => route.path);
</script>

<template>
  <div v-if="showLayout" class="min-h-screen bg-gray-100 font-sans text-gray-900 flex p-2 sm:p-4 md:p-4">
    <aside class="w-64 bg-gray-800 text-white flex flex-col p-3 rounded-lg shadow-lg">
      <div class="text-xl font-bold mb-6 text-center">IM-OKToo</div>
      <nav class="flex-grow">
        <ul>
          <li v-for="item in navItems" :key="item.name" class="mb-3">
            <router-link
              :to="item.path"
              class="w-full text-left p-2 rounded-lg transition-colors duration-200 text-sm block hover:bg-gray-700"
              active-class="bg-blue-600 hover:bg-blue-700"
            >
              {{ item.name }}
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>
    <main class="flex-grow ml-3 bg-gray-50 rounded-lg shadow-xl overflow-y-auto">
      <div class="flex justify-between items-center p-3 bg-white rounded-t-lg shadow-md">
        <h2 class="text-sm font-semibold text-gray-800">Dashboard</h2>
        <div class="flex items-center space-x-3">
          <button class="text-gray-600 hover:text-blue-600 transition-colors duration-200 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C10.9 2 10 2.9 10 4V5C7.3 5.6 5 8.3 5 11.5V17L3 19V20H21V19L19 17V11.5C19 8.3 16.7 5.6 14 5V4C14 2.9 13.1 2 12 2ZM12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22Z" />
            </svg>
          </button>
          <img
            src="https://placehold.co/36x36/a0c4ff/ffffff?text=JP"
            alt="Profile Picture"
            class="w-9 h-9 rounded-full border-2 border-blue-500 shadow-sm object-cover"
            onerror="this.onerror=null;this.src='https://placehold.co/36x36/cccccc/000000?text=User';"
          />
        </div>
      </div>

      <div class="p-4 space-y-4">
        <router-view />
      </div>
    </main>
  </div>
  <router-view v-else />
</template>

<style>

</style>