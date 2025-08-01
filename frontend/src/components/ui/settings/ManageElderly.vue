<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import type { Elderly } from '../../../types/settings'

const props = defineProps<{ modelValue: Elderly[] }>()
const emit = defineEmits(['update:modelValue'])

const localElderlies = ref<Elderly[]>([...props.modelValue])
watch(localElderlies, (val) => emit('update:modelValue', val), { deep: true })

const newElder = ref<Elderly>({
  id: '',
  name: '',
  age: null,
  medicalCondition: '',
  allergies: ''
})

function add() {
  const { name, age } = newElder.value
  if (!name.trim() || !age || age<0) return
  localElderlies.value.push({ ...newElder.value, id: Date.now().toString() })
  newElder.value = { id: '', name: '', age: null, medicalCondition: '', allergies: '' }
}

function edit(index: number) {
  const newName = prompt('Edit name', localElderlies.value[index].name)
  if (newName) localElderlies.value[index].name = newName
  const newAge = prompt('Edit age', String(localElderlies.value[index].age))
  if (newAge !== null) {
    const ageNum = Number(newAge)
    if (!isNaN(ageNum) && ageNum >= 0) {
      localElderlies.value[index].age = ageNum
    } else {
      alert('Invalid age input. Please enter a valid number.')
    }
  }
  const newCondition = prompt('Edit medical condition', )
  if (newCondition !== null) localElderlies.value[index].medicalCondition = newCondition
  const newAllergies = prompt('Edit allergies', localElderlies.value[index].allergies)
  if (newAllergies !== null) localElderlies.value[index].allergies = newAllergies
}

// function remove(index: number) {
//   if (confirm('Remove this elder?')) localElderlies.value.splice(index, 1)
// }
</script>

<template>
  <div>
    <p class="mb-2">Number of elderlies: <strong>{{ localElderlies.length }}</strong></p>

    <ul class="space-y-2 mb-4">
      <li v-for="(e, i) in localElderlies" :key="e.id" class="flex justify-between p-3 bg-[#F0F9FF] rounded">
        <div>
          <span>{{ e.name }}</span>
          <span class="ml-2 text-gray-500">Age: {{ e.age }}</span>
        </div>
        <div class="space-x-2">
          <button class="text-sm text-[#3B82F6]" @click="edit(i)">Edit</button>
          <!-- <button class="text-sm text-[#FF6F61]" @click="remove(i)">Remove</button> -->
        </div>
      </li>
    </ul>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
      <input v-model="newElder.name" placeholder="Name" class="input" />
      <input v-model.number="newElder.age" type="number" min=0 placeholder="Age" class="input" />      
      <input v-model="newElder.medicalCondition" placeholder="Condition" class="input" />
      <input v-model="newElder.allergies" placeholder="Allergies" class="input" />
    </div>

    <div class="mt-4 flex justify-between items-center">
      <p class="text-sm text-gray-500">Note: You can add elderlies under your care.</p>
      <button
      :disabled="!newElder.name.trim() || newElder.age === null || newElder.age < 0"
      @click="add"
      class="px-4 py-2 bg-[#2C3E50] text-white rounded"> Add
    </button>
    </div>
  </div>
</template>

<style scoped>
.input {
  padding: 0.5rem;
  border: 1px solid #e0f6ff;
  border-radius: 4px;
  width: 100%;
}
</style>
