<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ChatbotWithSpeech from './ChatbotWithSpeech.vue'
import TaskList from './TaskList.vue'

// Ref to get a direct instance of the TaskList component
const taskListRef = ref<InstanceType<typeof TaskList> | null>(null)

// State for logged-in username, primarily for conditional rendering
const loggedInUsername = ref<string | null>(null);

// Helper to get username safely from localStorage
function getUsernameFromLocalStorage(): string | null {
    const user = localStorage.getItem("username");
    return user === 'undefined' ? null : user;
}

// Check login status on mount
onMounted(() => {
    loggedInUsername.value = getUsernameFromLocalStorage();
});


// Chatbot Event Handlers - DELEGATING TO TASKLIST


// Handle 'add-task' event from Chatbot
async function handleAddTask(taskDescription: string) {
  if (!loggedInUsername.value) { // Good practice to check login status before action
      alert('Please log in to add tasks.');
      return;
  }
  if (taskListRef.value) {
    // Call the addTask method exposed by TaskList.vue
    await taskListRef.value.addTask(taskDescription);
  } else {
    console.error("TaskList component ref is null. Cannot add task.");
  }
}

// Handle 'remove-task' event from Chatbot
async function handleRemoveTaskByName(taskName: string) {
  if (!loggedInUsername.value) {
      alert('Please log in to remove tasks.');
      return;
  }
  if (taskListRef.value) {
    // Call the removeTaskByName method exposed by TaskList.vue
    await taskListRef.value.removeTaskByName(taskName);
  } else {
    console.error("TaskList component ref is null. Cannot remove task by name.");
  }
}

</script>

<template>
  <div class="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-br from-blue-100 via-white to-red-100 animate-gradient pt-4">
    <div class="text-center mb-1 animate-fade-in-up" style="animation-delay: 0.1s;">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-0">
        Welcome back! 👋
      </h1>
      <p class="text-sm md:text-base txt-gray-600 max-w-2xl mx-auto px-1">
        Ready to manage your tasks? Leo the Lion is here to help!
      </p>
    </div>

    <div class="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-5xl p-8">
      <div class="animate-fade-in-up" style="animation-delay: 0.2s;">
        <ChatbotWithSpeech
          @add-task="handleAddTask"
          @remove-task="handleRemoveTaskByName"
          
        />
      </div>

      <div class="animate-fade-in-up" style="animation-delay: 0.4s;">
        <template v-if="loggedInUsername">
            <TaskList ref="taskListRef" />
        </template>
        <template v-else>
            <div class="w-full max-w-sm bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center h-[30rem] text-center">
                <p class="text-lg text-gray-600 mb-4">Please log in to view and manage your tasks.</p>
                <router-link to="/login" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200">
                    Go to Login
                </router-link>
            </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
  opacity: 0;
}
.animate-gradient {
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}
* { transition: all 0.2s ease-in-out; }
.animate-fade-in-up:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>