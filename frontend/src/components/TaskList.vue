<!-- ========================================
  TASK LIST COMPONENT
  Traditional task management interface with visual controls
======================================== -->

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Trash } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'add-task', task: string): void
  (e: 'toggle-task', idx: number): void
  (e: 'remove-task', idx: number): void
}>()

const USERNAME = 'testuser'
const tasks = ref<{ id: number; text: string; done: boolean }[]>([])
const newTask = ref('')

async function fetchTasks() {
  try {
    const res = await fetch(`/api/tasks?username=${USERNAME}`)
    if (!res.ok) throw new Error('Network response not ok')
    const data = await res.json()
    tasks.value = data.map((task: any) => ({
      id: task.task_id,
      text: task.task_description,
      done: task.completed === 1
    }))
  } catch (err) {
    console.error('Failed to load tasks:', err)
  }
}

async function addTask() {
  const desc = newTask.value.trim()
  if (!desc) return

  try {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task_description: desc,
        username: USERNAME
      }),
    })
    if (!res.ok) throw new Error('Failed to add task')
    const newEntry = await res.json()
    tasks.value.unshift({
      id: newEntry.task_id,
      text: newEntry.task_description,
      done: newEntry.completed
    })
    emit('add-task', desc)
    newTask.value = ''
  } catch (err) {
    console.error('Failed to add task:', err)
  }
}

async function toggleTask(idx: number) {
  const task = tasks.value[idx]
  try {
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.done }),
    })
    if (!res.ok) throw new Error('Failed to toggle task')
    task.done = !task.done
    emit('toggle-task', idx)
  } catch (err) {
    console.error('Failed to toggle task:', err)
  }
}

async function removeTask(idx: number) {
  const task = tasks.value[idx]
  try {
    const res = await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to remove task')
    tasks.value.splice(idx, 1)
    emit('remove-task', idx)
  } catch (err) {
    console.error('Failed to remove task:', err)
  }
}

onMounted(() => {
  fetchTasks()
})
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
      <li v-for="(task, idx) in tasks" :key="task.id" class="flex items-center gap-3 p-2 rounded hover:bg-gray-50 group animate-task-in transform transition-all duration-300 hover:scale-102">
        <!-- Checkbox -->
        <input 
          type="checkbox" 
          :checked="task.done" 
          @change="toggleTask(idx)" 
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
          @click="removeTask(idx)"  
          class="opacity-60 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-red-100" 
          aria-label="Delete task"
        >
          <Trash class="w-5 h-5 transition-colors duration-300 group-hover:text-red-600" />
        </Button>
      </li>
      
      <!-- Empty State -->
      <li v-if="tasks.length === 0" class="text-muted-foreground text-center py-8 animate-fade-in">
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