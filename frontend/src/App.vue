<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import SideBar from './components/SideBar/SideBar.vue'

const route = useRoute()

// Track sidebar state for main content adjustment
const sidebarCollapsed = ref(true)

// Handle sidebar menu selection
const handleMenuSelection = (item: string) => {
  console.log('Selected menu item:', item)
  // Add your navigation logic here if needed
}

// Handle sidebar state changes
const handleSidebarStateChange = (isCollapsed: boolean) => {
  sidebarCollapsed.value = isCollapsed
}
</script>

<template>
  <div class="app-layout">
    <!-- Sidebar - only show when NOT on login page -->
    <SideBar 
      v-if="route.name !== 'Login' && route.name !== 'Registration'"
      @menu-item-selected="handleMenuSelection" 
      @sidebar-state-changed="handleSidebarStateChange" 
    />

    <!-- Main Content Area -->
    <div 
      class="main-content" 
      :class="{ 
        'main-content-collapsed': sidebarCollapsed && route.name !== 'Login',
        'main-content-full': route.name === 'Login'
      }"
    >
      <div v-if="$route.path === '/resources'">
        <div style="margin-top: 1rem;">
          <router-link to="/resources">
            <Button>Go to Resources</Button>
          </router-link>
        </div>
      </div>
      <!-- Router View for all pages -->
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: 280px;
  /* Expanded sidebar width */
  padding: 1rem;
  overflow-y: auto;
  transition: margin-left 0.3s ease;
}

.main-content-collapsed {
  margin-left: 60px;
  /* Collapsed sidebar width */
}

/* Full width for login page */
.main-content-full {
  margin-left: 0;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .main-content,
  .main-content-collapsed {
    margin-left: 0;
  }
}

.event {
  padding: 0.25rem 0.5rem;
  background: #345678;
  color: white;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
}
</style>