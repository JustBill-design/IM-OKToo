<script setup lang="ts">
import { ref, computed } from 'vue';
import { posts as mockPosts } from '@/lib/mock-data';
import type { Post } from '@/types/forum';
import PostItem from '@/components/PostItem.vue';
import { Button } from '@/components/ui/button';

const posts = ref<Post[]>(mockPosts);
const isLoggedIn = ref(false); // change dis to true to see createpost button
const filterCategory = ref('All');
const sortBy = ref('Newest');

const categories = computed(() => ['All', ...new Set(mockPosts.map(p => p.category))]);

const filteredPosts = computed(() => {
  let result = [...posts.value];

  if (filterCategory.value !== 'All') {
    result = result.filter(post => post.category === filterCategory.value);
  }

  result.sort((a, b) => {
    if (sortBy.value === 'Newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy.value === 'Oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy.value === 'Likes') {
      return b.likes - a.likes;
    }
    if (sortBy.value === 'Comments') {
      return b.comments.length - a.comments.length;
    }
    return 0;
  });

  return result;
});

const handleLogin = () => {
  isLoggedIn.value = !isLoggedIn.value;
};
</script>

<template>
  <div class="container p-4 mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-3xl font-bold">Forum</h1>
      <Button v-if="!isLoggedIn" @click="handleLogin">Login</Button>
      <Button v-if="isLoggedIn" @click="handleLogin">Logout</Button>
    </div>

    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-4">
        <div>
          <label for="category-filter" class="mr-2 text-sm font-medium">Category:</label>
          <select id="category-filter" v-model="filterCategory" class="p-2 border rounded">
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
        <div>
          <label for="sort-by" class="mr-2 text-sm font-medium">Sort by:</label>
          <select id="sort-by" v-model="sortBy" class="p-2 border rounded">
            <option>Newest</option>
            <option>Oldest</option>
            <option>Likes</option>
            <option>Comments</option>
          </select>
        </div>
      </div>
      <Button v-if="isLoggedIn">Create post</Button>
    </div>

    <div>
      <PostItem v-for="post in filteredPosts" :key="post.id" :post="post" />
    </div>
  </div>
</template>
