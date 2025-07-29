<template>
  <div class="flex h-screen overflow-hidden" :style="{ backgroundColor: activeColor, transition: 'background-color 0.7s ease' }">
    <aside class="absolute top-0 left-0 z-10 flex items-center h-full p-6 w-72">
      <nav class="space-y-4">
        <button
          v-for="resource in resources"
          :key="resource.name"
          @click="selectResource(resource.component)"
          class="w-full text-left transition-all duration-500 ease-in-out group"
          :class="{ 
            'text-gray-900 font-bold': activeComponent === resource.component, 
            'text-gray-500/60 hover:text-gray-900/80': activeComponent !== resource.component 
          }"
        >
          <span class="text-lg">{{ resource.name }}</span>
        </button>
      </nav>
    </aside>
    <main class="flex-1 relative" @wheel.prevent="handleWheel">
      <div class="relative h-full ml-72">
        <transition-group name="fade-dramatic">
          <section
            v-for="resource in resources"
            v-show="activeComponent === resource.component"
            :key="resource.component"
            class="absolute inset-0 p-12 flex items-center justify-center"
          >
            <div class="w-full max-w-4xl">
                <component :is="components[resource.component]" />
            </div>
          </section>
        </transition-group>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Resource1 from './resources/Resource1.vue';
import Resource2 from './resources/Resource2.vue';
import Resource3 from './resources/Resource3.vue';
import Resource4 from './resources/Resource4.vue';
import Resource5 from './resources/Resource5.vue';
import Resource6 from './resources/Resource6.vue';
import FindUs from './resources/FindUs.vue';

const components = {
  Resource1,
  Resource2,
  Resource3,
  Resource4,
  Resource5,
  Resource6,
  FindUs,
};

type ResourceComponentName = keyof typeof components;

const resources: { name: string, component: ResourceComponentName, color: string }[] = [
  { name: 'Resource 1', component: 'Resource1', color: '#F0F9FF' },
  { name: 'Resource 2', component: 'Resource2', color: '#D9FFD9' },
  { name: 'Community Care Services', component: 'Resource3', color: '#FFE8EE' },
  { name: 'Personal Wellness', component: 'Resource4', color: '#FFCD70' },
  { name: 'News and Events', component: 'Resource5', color: '#F0D9FF' },
  { name: 'Contact Us', component: 'Resource6', color: '#BAC6FF' },
  { name: 'Find Us', component: 'FindUs', color: '#F4FFF0' },
];

const activeComponent = ref<ResourceComponentName>('Resource1');
let isWheeling = false;

const activeColor = computed(() => {
  const activeResource = resources.find(r => r.component === activeComponent.value);
  return activeResource ? activeResource.color : '#ffffff';
});

const selectResource = (componentName: ResourceComponentName) => {
  activeComponent.value = componentName;
};

const handleWheel = (event: WheelEvent) => {
  if (isWheeling) return;
  isWheeling = true;
  setTimeout(() => { isWheeling = false; }, 800);
  const currentIndex = resources.findIndex(r => r.component === activeComponent.value);
  if (event.deltaY > 0) {
    if (currentIndex < resources.length - 1) {
      activeComponent.value = resources[currentIndex + 1].component;
    }
  } else {
    if (currentIndex > 0) {
      activeComponent.value = resources[currentIndex - 1].component;
    }
  }
};
</script>
<style scoped>
.fade-dramatic-enter-active {
  transition: opacity 0.8s ease-in-out 0.4s;
}
.fade-dramatic-leave-active {
  transition: opacity 0.4s ease-in-out;
}
.fade-dramatic-enter-from,
.fade-dramatic-leave-to {
  opacity: 0;
}
</style>
