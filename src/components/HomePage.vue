<!-- ========================================
  HOMEPAGE COMPONENT
  Main orchestrator for chatbot and task list
======================================== -->

<script setup lang="ts">
// ========================================
// IMPORTS & DEPENDENCIES
// ========================================
import { ref, watch, onMounted } from 'vue'
import ChatbotWithSpeech from './ChatbotWithSpeech.vue'
import TaskList from './TaskList.vue'

// ========================================
// STATE MANAGEMENT
// ========================================
const TASKS_KEY = 'imoktoo_tasks'
const tasks = ref<{ text: string; done: boolean }[]>([])

// ========================================
// LIFECYCLE HOOKS
// ========================================
onMounted(() => {
  // Load saved tasks from localStorage on component mount
  const saved = localStorage.getItem(TASKS_KEY)
  if (saved) {
    try {
      tasks.value = JSON.parse(saved)
    } catch (e) {
      tasks.value = [] // Fallback on parse error
    }
  }
})

// ========================================
// WATCHERS & REACTIVE UPDATES
// ========================================
watch(tasks, (val) => {
  // Auto-save tasks to localStorage whenever they change
  localStorage.setItem(TASKS_KEY, JSON.stringify(val))
}, { deep: true })

// ========================================
// TASK MANAGEMENT FUNCTIONS
// ========================================
function addTask(task: string) {
  tasks.value.push({ text: task, done: false })
}

function toggleTask(idx: number) {
  tasks.value[idx].done = !tasks.value[idx].done
}

function removeTask(idx: number) {
  tasks.value.splice(idx, 1)
}

function removeTaskByName(taskName: string) {
  // Fuzzy matching for voice commands - finds tasks containing the specified text
  const index = tasks.value.findIndex(task => 
    task.text.toLowerCase().includes(taskName.toLowerCase())
  )
  if (index !== -1) {
    tasks.value.splice(index, 1)
  }
}

function clearAllTasks() {
  tasks.value = []
}
</script>

<!-- ========================================
  TEMPLATE - LAYOUT & STRUCTURE
======================================== -->
<template>
  <div class="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-br from-blue-100 via-white to-red-100 animate-gradient pt-4">
    <!-- Welcome Header -->
    <div class="text-center mb-1 animate-fade-in-up" style="animation-delay: 0.1s;">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-0">
        Welcome back! 👋
      </h1>
      <p class="text-sm md:text-base txt-gray-600 max-w-2xl mx-auto px-1">
        Ready to manage your tasks? Leo the Lion is here to help!
      </p>
    </div>
    
    <!-- Main Content -->
    <div class="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-5xl p-8">
      <!-- Chatbot Component with staggered animation -->
      <div class="animate-fade-in-up" style="animation-delay: 0.2s;">
        <ChatbotWithSpeech 
          @add-task="addTask" 
          @remove-task="removeTaskByName"
          @clear-all-tasks="clearAllTasks"
        />
      </div>
      
      <!-- Task List Component with staggered animation -->
      <div class="animate-fade-in-up" style="animation-delay: 0.4s;">
        <TaskList :tasks="tasks" @add-task="addTask" @toggle-task="toggleTask" @remove-task="removeTask" />
      </div>
    </div>
  </div>
</template>

<!-- ========================================
  STYLES - ANIMATIONS & VISUAL EFFECTS
======================================== -->
<style scoped>
/* ========================================
  ENTRANCE ANIMATIONS
======================================== */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========================================
  BACKGROUND ANIMATIONS
======================================== */
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* ========================================
  ANIMATION CLASSES
======================================== */
.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
  opacity: 0;
}

.animate-gradient {
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

/* ========================================
  GLOBAL TRANSITIONS
======================================== */
* {
  transition: all 0.2s ease-in-out;
}

/* ========================================
  HOVER EFFECTS
======================================== */
.animate-fade-in-up:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>
