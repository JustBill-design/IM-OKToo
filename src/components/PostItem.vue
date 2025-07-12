<script setup lang="ts">
import { defineProps, ref } from 'vue';
import type { Post } from '@/types/forum';
import { Eye, MessageSquare, ThumbsUp } from 'lucide-vue-next';
import CommentItem from './CommentItem.vue';

const props = defineProps<{
  post: Post;
}>();

const isExpanded = ref(false);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<template>
  <div class="p-4 my-2 border rounded-lg">
    <div @click="toggleExpand" class="cursor-pointer">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <span class="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">{{ post.category }}</span>
          <h3 class="ml-4 text-lg font-bold">{{ post.title }}</h3>
        </div>
        <div class="flex items-center space-x-4 text-sm text-gray-500">
          <div class="flex items-center">
            <Eye class="w-4 h-4 mr-1" />
            <span>{{ post.views }}</span>
          </div>
          <div class="flex items-center">
            <ThumbsUp class="w-4 h-4 mr-1" />
            <span>{{ post.likes }}</span>
          </div>
          <div class="flex items-center">
            <MessageSquare class="w-4 h-4 mr-1" />
            <span>{{ post.comments.length }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isExpanded" class="mt-4">
      <p>{{ post.content }}</p>
      <div class="mt-2 text-sm text-gray-500">
        <span>Posted by {{ post.user.name }} on {{ new Date(post.createdAt).toLocaleDateString() }}</span>
      </div>
      <div class="mt-4">
        <h4 class="font-bold">Comments</h4>
        <div v-if="post.comments.length > 0">
          <CommentItem v-for="comment in post.comments" :key="comment.id" :comment="comment" />
        </div>
        <p v-else class="text-sm text-gray-500">No comments yet.</p>
      </div>
    </div>
  </div>
</template>
