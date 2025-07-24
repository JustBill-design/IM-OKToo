<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto p-6 max-w-4xl">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">IM-OKToo Forum</h1>
        <p class="text-gray-600">Connect and share with our community</p>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-600">Loading posts...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p class="text-red-800 font-medium">Error: {{ error }}</p>
        <button @click="fetchPosts"
          class="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
          Try Again
        </button>
      </div>

      <div v-else class="space-y-4">
        <div v-if="posts.length === 0" class="text-center py-12 bg-white rounded-lg shadow-sm border">
          <h3 class="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
          <p class="text-gray-500 mb-4">Be the first to start a conversation!</p>
          <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Create First Post
          </button>
        </div>

        <div v-else>
          <div v-for="(post, index) in posts" :key="index"
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {{ (post.username || 'U').charAt(0).toUpperCase() }}
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ post.post_author || 'Anonymous User' }}</p>
                  <p class="text-sm text-gray-500">{{ formatDate(post.created_at) }}</p>
                </div>
              </div>
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ post.category_name || 'General' }}
              </span>
            </div>

            <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ post.title }}</h3>
            <p class="text-gray-700">
              {{ post.content.slice(0, 100) }}<span v-if="post.content.length > 100">...</span>
            </p>

            <transition name="collapse">
              <div v-if="openStates[index]" class="mt-4 text-gray-700">

                <!-- Comments section -->
                <div v-if="loadingComments[post.post_id]">
                  <p class="text-sm text-gray-400">Loading comments...</p>
                </div>
                <div v-else>
                  <div v-if="comments[post.post_id]?.length > 0" class="space-y-3">
                    <div v-for="(comment, cIndex) in comments[post.post_id]" :key="cIndex"
                      class="border rounded-md p-3 bg-gray-50">
                      <p class="text-sm font-medium text-gray-800">
                        {{ getCommentAuthor(comment) }}
                      </p>
                      <p class="text-sm text-gray-600">
                        {{ getCommentContent(comment) }}
                      </p>
                      <p class="text-xs text-gray-400">
                        {{ formatDate(comment.created_at) }}
                      </p>
                    </div>
                  </div>
                  <div v-else class="text-sm text-gray-400">No comments yet.</div>
                </div>
              </div>
            </transition>

            <div class="flex items-center justify-between pt-4 border-t border-gray-100 text-sm text-gray-500">
              <div class="flex items-center space-x-6">
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.456L3 21l2.544-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                  </svg>
                  <button @click="toggle(index, post.post_id)">{{ post.comments_count || 0 }} replies</button>
                </div>
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{{ post.likes_count || 0 }} likes</span>
                </div>
              </div>

              <button @click="toggle(index, post.post_id)"
                class="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                {{ openStates[index] ? 'Read Less ←' : 'Read More →' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const posts = ref<any[]>([])
    const loading = ref(true)
    const error = ref<string | null>(null)
    const openStates = ref<boolean[]>([])
    const comments = ref<Record<number, any[]>>({})
    const loadingComments = ref<Record<number, boolean>>({})

    const fetchPosts = async () => {
      try {
        loading.value = true
        error.value = null
        const response = await fetch('http://localhost:3001/posts')
        const data = await response.json()
        posts.value = data
        openStates.value = Array(data.length).fill(false)
      } catch (err: any) {
        error.value = err.message || 'Failed to fetch posts'
      } finally {
        loading.value = false
      }
    }

    const toggle = async (index: number, postId: number) => {
      openStates.value[index] = !openStates.value[index]

      if (openStates.value[index] && !comments.value[postId]) {
        loadingComments.value[postId] = true
        try {
          const res = await fetch(`http://localhost:3001/posts/${postId}/comments`)
          const data = await res.json()
          console.log('Comments data:', data) // Debug log to see the structure
          // Extract the actual comments from the first element of the array
          comments.value[postId] = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : data
        } catch (err) {
          console.error('Failed to load comments', err)
          comments.value[postId] = []
        } finally {
          loadingComments.value[postId] = false
        }
      }
    }

    // Helper function to safely get comment content
    const getCommentContent = (comment: any): string => {
      return comment.content || 'No comment text provided.'
    }

    // Helper function to safely get comment author
    const getCommentAuthor = (comment: any): string => {
      return comment.username || 'Anonymous'
    }

    const formatDate = (isoString: string): string => {
      if (!isoString) return 'Unknown date'
      const date = new Date(isoString)
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }

    onMounted(() => {
      fetchPosts()
    })

    return {
      posts,
      loading,
      error,
      fetchPosts,
      openStates,
      toggle,
      formatDate,
      comments,
      loadingComments,
      getCommentContent,   
      getCommentAuthor     
    }
  }
}
</script>

<style scoped>
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease;
}

.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}
</style>