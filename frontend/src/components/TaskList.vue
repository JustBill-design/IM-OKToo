<!-- ========================================
  TASK LIST COMPONENT
  Traditional task management interface with visual controls
======================================== -->

<script setup lang="ts">
// ========================================
// IMPORTS & DEPENDENCIES
// ========================================
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-vue-next'

// ========================================
// COMPONENT PROPS & EMITS
// ========================================
const props = defineProps<{ tasks: { text: string; done: boolean }[] }>()
const emit = defineEmits<{ 
  (e: 'add-task', task: string): void
  (e: 'toggle-task', idx: number): void
  (e: 'remove-task', idx: number): void 
}>()

// ========================================
// REACTIVE STATE
// ========================================
const newTask = ref('')

// ========================================
// TASK MANAGEMENT FUNCTIONS
// ========================================
function addTask() {
  if (newTask.value.trim()) {
    emit('add-task', newTask.value.trim())
    newTask.value = ''
  }
}
</script>

<!-- ========================================
  TEMPLATE - UI STRUCTURE
======================================== -->
<template>
  <div class="w-full max-w-sm bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4 h-[30rem] transform transition-all duration-300 hover:shadow-xl">
    <!-- Header -->
    <h2 class="text-xl font-semibold mb-2 animate-fade-in">To-Do List</h2>
    
    <!-- Add Task Form -->
    <form @submit.prevent="addTask" class="flex gap-2">
      <Input v-model="newTask" placeholder="Add a new task..." class="flex-1 transition-all duration-300 focus:ring-2 focus:ring-green-300" />
      <Button type="submit" class="transition-all duration-300 hover:scale-105">Add</Button>
    </form>
    
    <!-- Task List -->
    <ul class="mt-2 flex-1 overflow-y-auto space-y-2">
      <li v-for="(task, idx) in props.tasks" :key="idx" class="flex items-center gap-3 p-2 rounded hover:bg-gray-50 group animate-task-in transform transition-all duration-300 hover:scale-102">
        <!-- Checkbox -->
        <input 
          type="checkbox" 
          :checked="task.done" 
          @change="$emit('toggle-task', idx)" 
          class="accent-primary w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-primary transition-all duration-300 transform hover:scale-110" 
        />
        
        <!-- Task Text -->
        <span 
          :class="{ 'line-through text-muted-foreground': task.done, 'text-gray-900': !task.done }" 
          class="flex-1 text-base transition-all duration-300"
        >
          {{ task.text }}
        </span>
        
        <!-- Delete Button -->
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          @click="$emit('remove-task', idx)" 
          class="opacity-60 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-red-100" 
          aria-label="Delete task"
        >
          <Trash class="w-5 h-5 transition-colors duration-300 group-hover:text-red-600" />
        </Button>
      </li>
      
      <!-- Empty State -->
      <li v-if="props.tasks.length === 0" class="text-muted-foreground text-center py-8 animate-fade-in">
        <div>
          ✨ No tasks yet. Add one above!
        </div>
      </li>
    </ul>
  </div>
</template>

<!-- ========================================
  STYLES - ANIMATIONS & VISUAL EFFECTS
======================================== -->
<style scoped>
/* ========================================
  TASK ITEM ANIMATIONS
======================================== */
@keyframes task-in {
  from {
    opacity: 0;
    transform: translateX(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

/* ========================================
  ENTRANCE ANIMATIONS
======================================== */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========================================
  ANIMATION CLASSES
======================================== */
.animate-task-in {
  animation: task-in 0.4s ease-out forwards;
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

/* ========================================
  SMOOTH SCROLLING
======================================== */
.overflow-y-auto {
  scroll-behavior: smooth;
}

/* ========================================
  CHECKBOX ANIMATIONS
======================================== */
input[type="checkbox"]:checked {
  animation: checkmark 0.3s ease-in-out;
}

@keyframes checkmark {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* ========================================
  HOVER EFFECTS
======================================== */
.hover\:scale-102:hover {
  transform: scale(1.02);
}
</style> 