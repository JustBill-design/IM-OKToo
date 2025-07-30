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

const USERNAME = ref<string | null>(null); // Make it a ref to be reactive if needed later
const tasks = ref<{ id: number; text: string; done: boolean }[]>([])
const newTask = ref('')

// Helper to get username safely
function getCurrentUsername(): string | null {
    const user = localStorage.getItem("username");
    return user === 'undefined' ? null : user; // Handle "undefined" string if it occurs
}

async function fetchTasks() {
  const currentUser = getCurrentUsername();
    if (!currentUser) {
        // Handle case where user is not logged in (e.g., clear tasks, show message)
        tasks.value = [];
        console.warn("No user logged in. Cannot fetch tasks.");
        return;
    }
  try {
    const res = await fetch(`/api/tasks?username=${currentUser}`)
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

async function addTask(descriptionFromParent?: string) {
  const currentUser = getCurrentUsername();
    if (!currentUser) {
        alert('Please log in to add tasks.');
        return;
    }

  const desc = descriptionFromParent !== undefined && descriptionFromParent.trim() !== ''
                 ? descriptionFromParent.trim()
                 : newTask.value.trim();
  if (!desc){alert('Task description cannot be empty.');
    return;
  } 

  try {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task_description: desc,
        username: currentUser
      }),
    })
    if (!res.ok) throw new Error('Failed to add task')
    const newEntry = await res.json()
    tasks.value.unshift({
      id: newEntry.task_id,
      text: newEntry.task_description,
      done: newEntry.completed
    })
    newTask.value = ''
  } catch (err) {
    console.error('Failed to add task:', err)
  }
}

async function toggleTask(idx: number) {
    const currentUser = getCurrentUsername();
    if (!currentUser) {
        alert('Please log in to toggle tasks.');
        return;
    }
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
  const currentUser = getCurrentUsername();
    if (!currentUser) {
        alert('Please log in to remove tasks.');
        return;
    }
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

async function removeTaskByName(taskName: string) {
    const currentUser = getCurrentUsername();
    if (!currentUser) {
        alert('Please log in to remove tasks.');
        return;
    }

    const lowerCaseTaskName = taskName.toLowerCase().trim();
    // Find all tasks that partially match the given name
    const tasksToRemove = tasks.value.filter(task =>
        task.text.toLowerCase().includes(lowerCaseTaskName)
    );

    if (tasksToRemove.length === 0) {
        alert(`Task "${taskName}" not found.`);
        console.warn(`No task found matching "${taskName}" for removal.`);
        return;
    }

    // Iterate and remove each matching task
    for (const task of tasksToRemove) {
        try {
            const res = await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' });
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to remove task '${task.text}': ${errorText}`);
            }
            console.log(`Task '${task.text}' removed successfully.`);
        } catch (err) {
            console.error(`Error removing task '${task.text}':`, err);
            alert(`Error removing task '${task.text}'. See console.`);
        }
    }
    // After attempting all removals, re-fetch to update the list
    await fetchTasks();
    if (tasksToRemove.length > 0) {
        alert(`${tasksToRemove.length} task(s) matching "${taskName}" removed.`);
    }
}

async function clearAllTasks() {
    const currentUser = getCurrentUsername();
    if (!currentUser) {
        alert('Please log in to clear tasks.');
        return;
    }

    if (tasks.value.length === 0) {
        alert('No tasks to clear.');
        return;
    }


    const tasksSnapshot = [...tasks.value]; // Work on a copy to avoid mutation issues during loop
    for (const task of tasksSnapshot) {
        try {
            const res = await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' });
            if (!res.ok) {
                const errorText = await res.text();
                // Log and potentially alert, but continue trying to delete others
                console.error(`Failed to delete task ID ${task.id}: ${errorText}`);
            }
        } catch (err) {
            console.error(`Error deleting task ID ${task.id}:`, err);
        }
    }
    // After attempting to delete all, re-fetch to synchronize UI with DB
    await fetchTasks();
    alert('All tasks cleared!');
  }

onMounted(() => {
  USERNAME.value = getCurrentUsername(); // Set the ref value on mount
  fetchTasks(); // Initial fetch
})

// Expose the methods 
defineExpose({
  addTask,           // Allows parent to call taskListRef.value.addTask()
  toggleTask,        // Allows parent to call taskListRef.value.toggleTask()
  removeTask,        // Allows parent to call taskListRef.value.removeTask()
  removeTaskByName,
  clearAllTasks,     // Allows parent to call taskListRef.value.clearAllTasks() 
  fetchTasks         // Allows parent to call taskListRef.value.fetchTasks()
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