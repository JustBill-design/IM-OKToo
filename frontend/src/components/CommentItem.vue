<script setup lang="ts">
import { defineProps } from 'vue';
import type { Comment } from '@/types/forum';

const props = defineProps<{
  comment: Comment;
}>();
</script>

<template>
  <div class="flex items-start my-4 space-x-3">
    <div class="flex-1">
      <div class="flex items-center">
        <span class="font-semibold">{{ props.comment.user.name }}</span>
        <span class="ml-2 text-xs text-gray-500">{{ new Date(props.comment.createdAt).toLocaleString() }}</span>
      </div>
      <p class="text-gray-800">{{ props.comment.text }}</p>
    </div>
  </div>
</template>
