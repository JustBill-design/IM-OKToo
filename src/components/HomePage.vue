<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import ChatbotWithSpeech from './ChatbotWithSpeech.vue'
import TaskList from './TaskList.vue'

const TASKS_KEY = 'imoktoo_tasks'
const tasks = ref<{ text: string; done: boolean }[]>([])

onMounted(() => {
  const saved = localStorage.getItem(TASKS_KEY)
  if (saved) {
    try {
      tasks.value = JSON.parse(saved)
    } catch (e) {
      tasks.value = []
    }
  }
})

watch(tasks, (val) => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(val))
}, { deep: true })

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

<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-red-100">
    <div class="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-5xl p-8">
      <ChatbotWithSpeech 
        @add-task="addTask" 
        @remove-task="removeTaskByName"
        @clear-all-tasks="clearAllTasks"
      />
      <TaskList :tasks="tasks" @add-task="addTask" @toggle-task="toggleTask" @remove-task="removeTask" />
    </div>
  </div>
</template>
