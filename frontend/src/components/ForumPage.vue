<template>
    <div class="min-h-screen bg-gray-50">
        <div class="container mx-auto p-6 max-w-4xl">

            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-gray-800 mb-2">IM-OKToo Forum</h1>
                <p class="text-gray-600">Connect and share with our community</p>
            </div>

            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div class="flex items-center">
                        <label for="category-filter" class="mr-2 text-sm font-medium text-gray-700">Category:</label>
                        <select id="category-filter" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option>All Categories</option>
                        </select>
                    </div>
                    <div class="flex items-center">
                        <label for="sort-by" class="mr-2 text-sm font-medium text-gray-700">Sort by:</label>
                        <select id="sort-by" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option>Newest</option>
                            <option>Oldest</option>
                            <option>Most Popular</option>
                        </select>
                    </div>
                </div>
                <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Create Post
                </button>
            </div>

            <div v-if="loading" class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p class="text-gray-600">Loading posts...</p>
            </div>

            <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div class="text-red-600 mb-2">
                    <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <p class="text-red-800 font-medium">Error: {{ error }}</p>
                <button @click="fetchPosts" class="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Try Again
                </button>
            </div>

            <div v-else class="space-y-4">
                <!-- Empty State -->
                <div v-if="posts.length === 0" class="text-center py-12 bg-white rounded-lg shadow-sm border">
                    <div class="text-gray-400 mb-4">
                        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.456L3 21l2.544-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                    <p class="text-gray-500 mb-4">Be the first to start a conversation!</p>
                    <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        Create First Post
                    </button>
                </div>

                <div v-else class="space-y-4">
                    <div v-for="(post, index) in posts" :key="index" 
                         class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
                        
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex items-center space-x-3">
                                <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {{ (post.username || 'U').charAt(0).toUpperCase() }}
                                </div>
                                <div>
                                    <p class="font-medium text-gray-900">{{ post.username || 'Anonymous User' }}</p>
                                    <p class="text-sm text-gray-500">{{ post.created_at }}</p>
                                </div>
                            </div>

                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {{ post.category_name || 'General' }}
                            </span>
                        </div>

                        <div class="mb-4">
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ post.title }}</h3>
                            <p class="text-gray-700 leading-relaxed">{{ post.content }}</p>
                        </div>

                        <!-- Post Footer -->
                        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div class="flex items-center space-x-6 text-sm text-gray-500">
                                <div class="flex items-center space-x-1">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.456L3 21l2.544-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"></path>
                                    </svg>
                                    <span>{{ post.comment_count || 0 }} replies</span>
                                </div>
                                <div class="flex items-center space-x-1">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                    </svg>
                                    <span>{{ post.like_count || 0 }} likes</span>
                                </div>
                            </div>
                            <button class="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                                Read More →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';

export default {
    setup() {
        const posts = ref([])
        const loading = ref(true)
        const error = ref(null)

        const fetchPosts = async () => {
            try {
                loading.value = true
                error.value = null
                const response = await fetch('http://localhost:3001/posts')
                const data = await response.json()
                console.log('Posts data:', data)
                posts.value = data
            } catch (err) {
                console.error('Error fetching posts:', err)
                error.value = err.message
            } finally {
                loading.value = false
            }
        }

        

        onMounted(() => {
            fetchPosts()
        })

        return { 
            posts, 
            loading, 
            error, 
            fetchPosts
        }
    }
}
</script>