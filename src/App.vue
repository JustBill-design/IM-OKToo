<script setup lang="ts">
import { ref } from 'vue'; // Import ref for reactive variables
import { Button } from "@/components/ui/button" // Assuming this path is correct for your Shadcn Button

// --- Landing Page Feature States and Logic ---

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface Activity {
  id: number;
  text: string;
  timestamp: string;
}

// State variables for the landing page
const activePage = ref<string>('home');
const userName = ref<string>('Caregiver'); // This represents the logged-in caregiver's name
const careRecipientName = ref<string>('Alex'); // Name of the person being cared for
const chatInput = ref<string>('');
const chatHistory = ref<ChatMessage[]>([]);
// Removed isLoading as there's no API call to wait for
const wellbeingStatus = ref<string>('');

// Navigation items for the sidebar
const navItems: string[] = ['home', 'tasks', 'wellbeing', 'resources', 'community', 'settings'];

// Mock data for tasks and recent activity - UPDATED for a single care recipient
const todayTasks = ref<Task[]>([
  { id: 1, text: 'Administer morning medication to Alex', completed: false },
  { id: 2, text: 'Prepare lunch for Alex', completed: false },
  { id: 3, text: 'Assist Alex with physical therapy exercises', completed: false },
  { id: 4, text: 'Schedule Alex\'s doctor\'s appointment', completed: false },
]);

const recentActivity = ref<Activity[]>([
  { id: 1, text: 'Completed Alex\'s morning medication', timestamp: '2 hours ago' },
  { id: 2, text: 'Helped Alex with bathing', timestamp: '4 hours ago' },
  { id: 3, text: 'Updated Alex\'s care plan', timestamp: 'Yesterday' },
]);

const moods: string[] = ['Great', 'Good', 'Okay', 'Stressed', 'Tired'];

// Function to handle sending a message to the chatbot - API call removed
const sendMessage = (message: string) => { // No longer async
  if (!message.trim()) return;

  chatHistory.value.push({ role: 'user', text: message });
  chatInput.value = '';
  // No isLoading.value = true/false as there's no API call
  // No try/catch for API errors
  // No bot response from API, so no push for bot role here
};

// Function to simulate speech-to-text input
const handleSpeechToText = () => {
  const speechInput = prompt("Simulating Speech-to-Text: Please type your message here:");
  if (speechInput) {
    sendMessage(speechInput);
  }
};

// Function to handle profile picture click - still navigates to 'settings'
const handleProfileClick = () => {
  activePage.value = 'settings';
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 font-sans text-gray-900 flex p-2 sm:p-4 md:p-4">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-800 text-white flex flex-col p-3 rounded-lg shadow-lg">
      <div class="text-xl font-bold mb-6 text-center">IMOK-Too</div>
      <nav class="flex-grow">
        <ul>
          <li v-for="item in navItems" :key="item" class="mb-3">
            <button
              @click="activePage = item"
              :class="[
                'w-full text-left p-2 rounded-lg transition-colors duration-200 text-sm',
                activePage === item ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-gray-700'
              ]"
            >
              {{ item.charAt(0).toUpperCase() + item.slice(1) }}
            </button>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-grow ml-3 bg-gray-50 rounded-lg shadow-xl overflow-y-auto">
      <!-- Header with Profile Pic and Bell Icon -->
      <div class="flex justify-between items-center p-3 bg-white rounded-t-lg shadow-md">
        <h2 class="text-sm font-semibold text-gray-800">Dashboard</h2>
        <div class="flex items-center space-x-3">
          <!-- Bell Icon -->
          <button class="text-gray-600 hover:text-blue-600 transition-colors duration-200 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C10.9 2 10 2.9 10 4V5C7.3 5.6 5 8.3 5 11.5V17L3 19V20H21V19L19 17V11.5C19 8.3 16.7 5.6 14 5V4C14 2.9 13.1 2 12 2ZM12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22Z" />
            </svg>
          </button>
          <!-- Profile Picture (Clickable for Settings) -->
          <img
            src="https://placehold.co/36x36/a0c4ff/ffffff?text=JP"
            alt="Profile Picture"
            class="w-9 h-9 rounded-full border-2 border-blue-500 shadow-sm object-cover cursor-pointer"
            onerror="this.onerror=null;this.src='https://placehold.co/36x36/cccccc/000000?text=User';"
            @click="handleProfileClick"
          />
        </div>
      </div>

      <div class="p-4 space-y-4">
        <!-- Home Page Content -->
        <template v-if="activePage === 'home'">
          <!-- Welcome Back Section -->
          <div class="bg-white p-4 rounded-lg shadow-md">
            <h1 class="text-2xl font-bold text-gray-800">Welcome Back, {{ userName }}! How is {{ careRecipientName }} doing today?</h1>
          </div>

          <!-- Chatbot Section -->
          <div class="bg-white p-4 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold mb-3 text-gray-800">Chat with AI Assistant</h2>
            <div class="h-48 overflow-y-auto border border-gray-300 p-3 rounded-lg mb-3 bg-gray-50">
              <p v-if="chatHistory.length === 0" class="text-gray-500 italic text-sm">Start a conversation...</p>
              <div
                v-for="(msg, index) in chatHistory"
                :key="index"
                :class="['mb-1', msg.role === 'user' ? 'text-right' : 'text-left']"
              >
                <span
                  :class="[
                    'inline-block p-1.5 rounded-lg text-sm',
                    msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                  ]"
                >
                  {{ msg.text }}
                </span>
              </div>
              <!-- Removed isLoading spinner -->
            </div>
            <div class="flex items-center space-x-2">
              <input
                type="text"
                v-model="chatInput"
                @keyup.enter="sendMessage(chatInput)"
                placeholder="Type your message..."
                class="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                @click="sendMessage(chatInput)"
                class="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md text-sm"
              >
                Send
              </button>
              <button
                @click="handleSpeechToText"
                class="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md flex items-center text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7.001 7.001 0 006 6.93V17h4v-2.07z" clip-rule="evenodd" />
                </svg>
                Speech
              </button>
            </div>
          </div>

          <!-- Today's Focus Section -->
          <div class="bg-white p-4 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold mb-3 text-gray-800">Today's Focus</h2>
            <ul class="space-y-2">
              <li v-for="task in todayTasks" :key="task.id" class="flex items-center bg-gray-100 p-2 rounded-lg text-sm">
                <input type="checkbox" class="mr-2 h-4 w-4 text-blue-600 rounded" v-model="task.completed" />
                <span class="text-gray-700">{{ task.text }}</span>
              </li>
            </ul>
          </div>

          <!-- Recent Activity Section -->
          <div class="bg-white p-4 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold mb-3 text-gray-800">Recent Activity</h2>
            <ul class="space-y-2">
              <li v-for="activity in recentActivity" :key="activity.id" class="bg-gray-100 p-2 rounded-lg flex justify-between items-center text-sm">
                <span class="text-gray-700">{{ activity.text }}</span>
                <span class="text-xs text-gray-500">{{ activity.timestamp }}</span>
              </li>
            </ul>
          </div>

          <!-- The "Click me" button is kept as it's part of your original template -->
          <div class="mt-3 text-center">
            <Button class="px-3 py-1.5 text-sm">Click me</Button>
          </div>
        </template>

        <!-- Other Pages Content -->
        <template v-else-if="activePage === 'tasks'">
          <div class="p-6">
            <h1 class="text-2xl font-bold text-gray-800">Task List</h1>
            <p class="mt-3 text-gray-700 text-sm">View and manage all your tasks.</p>
          </div>
        </template>
        <template v-else-if="activePage === 'wellbeing'">
          <div class="p-6">
            <h1 class="text-2xl font-bold text-gray-800">Wellbeing Overview</h1>
            <p class="mt-3 text-gray-700 text-sm">Track and manage your wellbeing here.</p>
          </div>
        </template>
        <template v-else-if="activePage === 'resources'">
          <div class="p-6">
            <h1 class="text-2xl font-bold text-gray-800">Resources</h1>
            <p class="mt-3 text-gray-700 text-sm">Find helpful resources and guides.</p>
          </div>
        </template>
        <template v-else-if="activePage === 'community'">
          <div class="p-6">
            <h1 class="text-2xl font-bold text-gray-800">Community Forum</h1>
            <p class="mt-3 text-gray-700 text-sm">Connect with other caregivers.</p>
          </div>
        </template>
        <template v-else-if="activePage === 'settings'">
          <div class="p-6">
            <h1 class="text-2xl font-bold text-gray-800">Settings</h1>
            <p class="mt-3 text-gray-700 text-sm">Adjust your application settings.</p>
          </div>
        </template>
      </div>
    </main>
  </div>
</template>

<style>
/* You can add custom styles here if needed, but Tailwind CSS handles most of it */
/* Ensure Inter font is used via Tailwind config or global CSS if not already */
</style>
