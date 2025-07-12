<script setup lang="ts">
import '@schedule-x/theme-shadcn/dist/index.css'
import { ScheduleXCalendar } from '@schedule-x/vue'
import { createCurrentTimePlugin } from '@schedule-x/current-time'
import { createScrollControllerPlugin } from '@schedule-x/scroll-controller'
import { Button } from "@/components/ui/button"
import {
  createCalendar,
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  createViewList
} from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'
import SideBar from './components/SideBar/SideBar.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const scrollController = createScrollControllerPlugin({
  initialScroll: '07:50'
})

// Do not use a ref here, as the calendar instance is not reactive, and doing so might cause issues
// For updating events, use the events service plugin
const calendarApp = createCalendar({
  views: [
    createViewDay(),
    createViewWeek(),
    createViewList(),
    createViewMonthGrid(),
    createViewMonthAgenda(),
  ],
  events: [
    {
      id: 1,
      title: 'Event 1',
      start: '2023-12-19',
      end: '2023-12-19',
    },
    {
      id: 2,
      title: 'Event 2',
      start: '2023-12-20 12:00',
      end: '2023-12-20 13:00',
    },
  ],
  theme: 'shadcn'
}, [createCurrentTimePlugin(), scrollController])

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
      v-if="route.name !== 'Login'"
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