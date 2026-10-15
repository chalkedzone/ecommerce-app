<script setup>
import { ref } from 'vue'
import api from '../api'

const emit = defineEmits(['results', 'cleared'])

const searchTerm = ref('')
const searching = ref(false)
const errorMessage = ref('')

async function handleSearch() {
  const term = searchTerm.value.trim()

  if (!term) {
    emit('cleared')
    return
  }

  searching.value = true
  errorMessage.value = ''
  try {
    const { data } = await api.post('/products/search-by-name', { name: term })
    emit('results', data.products ?? data)
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Search failed'
    emit('results', [])
  } finally {
    searching.value = false
  }
}

function clearSearch() {
  searchTerm.value = ''
  errorMessage.value = ''
  emit('cleared')
}
</script>

<template>
  <div class="search-bar">
    <form class="search-form" @submit.prevent="handleSearch">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search products by name..."
      />
      <button type="submit" class="search-btn" :disabled="searching">
        {{ searching ? 'Searching...' : 'Search' }}
      </button>
      <button
        v-if="searchTerm"
        type="button"
        class="clear-btn"
        @click="clearSearch"
      >
        Clear
      </button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.search-bar {
  max-width: 500px;
  margin: 0 auto 28px;
}
.search-form {
  display: flex;
  gap: 8px;
}
.search-form input {
  flex: 1;
  padding: 9px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.95rem;
}
.search-btn {
  background: #3b82f6;
  color: #fff;
  border: none;
  padding: 9px 18px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}
.search-btn:disabled {
  opacity: 0.7;
  cursor: default;
}
.clear-btn {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  padding: 9px 14px;
  border-radius: 4px;
  cursor: pointer;
}
.error {
  color: #ef4444;
  margin-top: 8px;
  text-align: center;
}
</style>
