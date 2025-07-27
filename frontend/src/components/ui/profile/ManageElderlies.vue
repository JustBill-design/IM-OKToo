<script setup lang="ts">
import { ref } from 'vue'
import type { Elderly } from '../../../types/profiles'

const elderlies = ref<Elderly[]>([])
const newName = ref('')

function add() {
  elderlies.value.push({ id: Date.now(), name: newName.value })
  newName.value = ''
}
function edit(idx: number) {
  const updated = prompt('Edit name', elderlies.value[idx].name)
  if (updated) elderlies.value[idx].name = updated
}
function remove(idx: number) {
  if (confirm('Remove this elder?')) elderlies.value.splice(idx, 1)
}
</script>

<template>
  <div>
    <p class="mb-2">Number of elderlies: <strong>{{ elderlies.length }}</strong></p>
    <ul class="space-y-2 mb-4">
      <li
        v-for="(e, i) in elderlies"
        :key="e.id"
        class="flex justify-between p-3 bg-[#F0F9FF] rounded"
      >
        <span>{{ e.name }}</span>
        <div class="space-x-2">
          <button class="text-sm text-[#3B82F6]" @click="edit(i)">Edit</button>
          <button class="text-sm text-[#FF6F61]" @click="remove(i)">Remove</button>
        </div>
      </li>
    </ul>

    <div class="flex items-center gap-2">
      <input
        type="text"
        v-model="newName"
        placeholder="Add elderly name"
        class="flex-1 border rounded p-2"
      />
      <button
        class="px-4 py-2 bg-[#FF6F61] text-white rounded"
        :disabled="!newName"
        @click="add">
        Add
      </button>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'

// Fake initial data — replace with fetched data later
const elderlies = ref([
  { id: 1, name: 'Ah Ma Tan' },
  { id: 2, name: 'Uncle Lim' }
])

const newElderly = ref('')

function addElderly() {
  elderlies.value.push({ id: Date.now(), name: newElderly.value })
  newElderly.value = ''
}

function editElderly(index) {
  const newName = prompt('Edit name:', elderlies.value[index].name)
  if (newName) elderlies.value[index].name = newName
}

function removeElderly(index) {
  if (confirm('Remove this person from your care list?')) {
    elderlies.value.splice(index, 1)
  }
}
</script>

<style scoped>
.form-card {
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.elderly-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.elderly-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 6px;
}

.actions button {
  margin-left: 0.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.3rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}

.actions .remove {
  background-color: #ef4444;
}

.add-form {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.add-form input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.add-form button {
  background-color: var(--accent-color);
  color: white;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 4px;
}
</style>
