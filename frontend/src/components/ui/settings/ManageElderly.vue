<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, onMounted, computed } from 'vue'
import type { Elderly } from '../../../types/settings'

const props = defineProps(['username']);
const emit = defineEmits(['update:username']);

const isLoading = ref(false)
const username = ref(props.username)
const elderly_data = ref<{
  fullname: string,
  age: number,
  medical_condition: string,
  allergies: string
}[]>([]);
const newElder = ref({
  fullname: '',
  age: null,
  medical_condition: '',
  allergies: ''
})
watch(() => props.username, (newVal) => {
  username.value = newVal;
})

onMounted(async () => {
  getElderly();
})

// const localElderlies = ref<Elderly[]>([...props.modelValue])
// watch(localElderlies, (val) => emit('update:modelValue', val), { deep: true })

// const newElder = ref<Elderly>({
//   id: '',
//   name: '',
//   age: null,
//   medicalCondition: '',
//   allergies: ''
// })

async function getElderly() {
  try {
    const response = await fetch('http://localhost:3001/settings/getElderly', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value
      })
    })
    if (response.ok) {
      const data = await response.json();
      elderly_data.value = Array.isArray(data) ? data : [];
    } else {
      console.error('Failed to fetch elderly data:', response.status);
      elderly_data.value = [];
    }
  } catch (error) {
    throw new Error(error.message);
    elderly_data.value = [];
  }
}

function getAgeByName(fullname) {
  const elderly = elderly_data.value.find(e => e.fullname===fullname);
  return elderly ? elderly.age.toString() : '';
}

function getConditionByName(fullname) {
  const elderly = elderly_data.value.find(e => e.fullname===fullname);
  return elderly ? elderly.medical_condition : '';
}

function getAllergyByName(fullname) {
  const elderly = elderly_data.value.find(e => e.fullname===fullname);
  return elderly ? elderly.allergies : '';
}

async function add() {
  const { fullname, age } = newElder.value
  if (!fullname.trim() || !age || age<0) return
  
  try {
    isLoading.value = true
    const response = await fetch('http://localhost:3001/settings/addElderly', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        newElder: newElder.value
      })
    });
    if (response.ok) {
      const message = await response.text();
      alert(message);
      newElder.value = { fullname: '', age: null, medical_condition: '', allergies: '' }
    } else {
      const errorMessage = await response.text();
      alert("Failed to add elderly: " + errorMessage);
    }
  } catch (error) {
    alert("Failed to add elderly: " + error.message);
  } finally {
    isLoading.value = false;
  }
}

/*
async function edit(fullname: string) {
  const changes = {}; 

  // get current elderly data
  const currentElderly = elderly_data.value.find(e => e.fullname === fullname);
  if (!currentElderly) {
    alert('Elderly person not found');
    return;
  }

  // change name
  const newName = prompt('Edit name', fullname)
  changes['fullname'] = newName?.trim();
  // change age
  const newAgeString = prompt('Edit age', getAgeByName(fullname))
  if (newAgeString !== null) {
    const newAge = Number(newAgeString)
    if (!isNaN(newAge) && newAge >= 0) {
      changes['age'] = newAge;
    } else {
      alert('Invalid age input. Please enter a valid number.')
    }
  }
  // change medical condition
  changes['medical_condition'] = prompt('Edit medical condition', getConditionByName(fullname))
  // changes['medical_condition'] = newCondition;
  changes['allergies'] = prompt('Edit allergies', getAllergyByName(fullname))
  // changes['allergies'] = newAllergies;
  // add to db
  try {
    const response = await fetch('http://localhost:3001/settings/editElderly', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullname: fullname,
        changes: changes
      })
    });
    const message = await response.text();
    alert(message);
  } catch (error) {
    alert("Failed to edit details: " + error.message);
  }
}
  */

async function edit(fullname: string) {
  const changes = {}; 
  
  // Get current data for the elderly person
  const currentElderly = elderly_data.value.find(e => e.fullname === fullname);
  if (!currentElderly) {
    alert('Elderly person not found');
    return;
  }
  
  // change name
  const newName = prompt('Edit name', fullname);
  if (newName !== null && newName.trim() !== '') {
    changes['fullname'] = newName.trim();
  }
  
  // change age
  const newAgeString = prompt('Edit age', currentElderly.age.toString());
  if (newAgeString !== null) {
    const newAge = Number(newAgeString)
    if (!isNaN(newAge) && newAge >= 0) {
      changes['age'] = newAge;
    } else if (newAgeString.trim() !== '') {
      alert('Invalid age input. Please enter a valid number.')
      return;
    }
  }
  
  // change medical condition
  const newCondition = prompt('Edit medical condition', currentElderly.medical_condition || '');
  if (newCondition !== null) {
    changes['medical_condition'] = newCondition;
  }
  
  // change allergies
  const newAllergies = prompt('Edit allergies', currentElderly.allergies || '');
  if (newAllergies !== null) {
    changes['allergies'] = newAllergies;
  }
  
  // Only proceed if there are changes
  if (Object.keys(changes).length === 0) {
    return;
  }
  
  // add to db
  try {
    const response = await fetch('http://localhost:3001/settings/editElderly', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        current_name: fullname,  
        changes: changes
      })
    });
    
    if (response.ok) {
      const message = await response.text();
      alert(message);
      // Refresh the list after successful edit
      await getElderly();
    } else {
      const errorMessage = await response.text();
      alert("Failed to edit details: " + errorMessage);
    }
  } catch (error) {
    alert("Failed to edit details: " + error.message);
  }
}

// function remove(index: number) {
//   if (confirm('Remove this elder?')) localElderlies.value.splice(index, 1)
// }
</script>

<template>
  <div>
    <p class="mb-2">Number of elderlies: <strong>{{ elderly_data.length }}</strong></p>

    <ul class="space-y-2 mb-4">
      <!-- <li v-for="(e, i) in localElderlies" :key="e.id" class="flex justify-between p-3 bg-[#F0F9FF] rounded"> -->
      <li v-for="e in elderly_data" class="flex justify-between p-3 bg-[#F0F9FF] rounded">
        <div>
          <span>{{ e.fullname }}</span>
          <span class="ml-2 text-gray-500">Age: {{ e.age }}</span>
          <span class="ml-2 text-gray-500">Medical Condition: {{ e.medical_condition ? e.medical_condition:"None" }}</span>
          <span class="ml-2 text-gray-500">Allergies: {{ e.allergies ? e.allergies:"None" }}</span>
        </div>
        <div class="space-x-2">
          <button class="text-sm text-[#3B82F6]" @click="edit(e.fullname)">Edit</button>
          <!-- <button class="text-sm text-[#FF6F61]" @click="remove(i)">Remove</button> -->
        </div>
      </li>
    </ul>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
      <input v-model="newElder.fullname" placeholder="Full Name" class="input" />
      <input v-model.number="newElder.age" type="number" min=0 placeholder="Age" class="input" />      
      <input v-model="newElder.medical_condition" placeholder="Condition" class="input" />
      <input v-model="newElder.allergies" placeholder="Allergies" class="input" />
    </div>

    <div class="mt-4 flex justify-between items-center">
      <p class="text-sm text-gray-500">Note: You can add elderlies under your care.</p>
      <button type="submit"
      :disabled="!newElder.fullname.trim() || newElder.age === null || newElder.age < 0 || isLoading"
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
button:hover:not(:disabled) {
  background-color: #2563eb;
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  transform: none;
}
</style>
