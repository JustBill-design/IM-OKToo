<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-vue-next'

const props = defineProps<{ tasks: { text: string; done: boolean }[] }>()
const emit = defineEmits<{ (e: 'add-task', task: string): void; (e: 'toggle-task', idx: number): void; (e: 'remove-task', idx: number): void }>()

const newTask = ref('')

function addTask() {
  if (newTask.value.trim()) {
    emit('add-task', newTask.value.trim())
    newTask.value = ''
  }
}
</script>

<template>
  <div class="w-full max-w-sm bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4 h-[32rem]">
    <h2 class="text-xl font-semibold mb-2">To-Do List</h2>
    <form @submit.prevent="addTask" class="flex gap-2">
      <Input v-model="newTask" placeholder="Add a new task..." class="flex-1" />
      <Button type="submit">Add</Button>
    </form>
    <ul class="mt-2 flex-1 overflow-y-auto space-y-2">
      <li v-for="(task, idx) in props.tasks" :key="idx" class="flex items-center gap-3 p-2 rounded hover:bg-gray-50 group">
        <input type="checkbox" :checked="task.done" @change="$emit('toggle-task', idx)" class="accent-primary w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-primary" />
        <span :class="{ 'line-through text-muted-foreground': task.done, 'text-gray-900': !task.done }" class="flex-1 text-base">{{ task.text }}</span>
        <Button type="button" variant="ghost" size="sm" @click="$emit('remove-task', idx)" class="opacity-60 group-hover:opacity-100" aria-label="Delete task">
          <Trash class="w-5 h-5" />
        </Button>
      </li>
      <li v-if="props.tasks.length === 0" class="text-muted-foreground text-center py-8">No tasks yet. Add one above!</li>
    </ul>
  </div>
</template> 