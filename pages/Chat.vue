<template>
    <div>
        <input v-model="userInput" type="text" placeholder="Enter your search" />
        <button @click="categorize">Categorize</button>
        <div v-if="category">Category: {{ category }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useFetch } from '#app';

interface ApiResponse {
    category?: string;
    error?: string;
}

const userInput = ref('');
const category = ref<string>('');

const categorize = async () => {
    // Here we use useFetch and define the expected return type inline
    const { data, error } = await useFetch<ApiResponse>('/api/categorize', {
        method: 'POST',
        body: { input: userInput.value },
    });

    if (error.value) {
        console.error('Fetch error:', error.value);
    } else {
        // Directly access the category from data.value if it exists
        category.value = data.value?.category ?? 'Unknown'; // Handle the case where category might be undefined
    }
};
</script>