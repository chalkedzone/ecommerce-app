<script setup>
import { ref } from 'vue'
import api from '../api'

const emit = defineEmits(['results', 'cleared'])

const minPrice = ref('')
const maxPrice = ref('')
const filtering = ref(false)
const errorMessage = ref('')

async function handleFilter() {
  const min = minPrice.value === '' ? null : Number(minPrice.value)
  const max = maxPrice.value === '' ? null : Number(maxPrice.value)

  if (min === null && max === null) {
    emit('cleared')
    return
  }

  if (min !== null && max !== null && min > max) {
    errorMessage.value = 'Minimum price cannot be greater than maximum price'
    return
  }

  filtering.value = true
  errorMessage.value = ''
  try {
    const { data } = await api.post('/products/search-by-price', {
      minPrice: min,
      maxPrice: max
    })
    emit('results', data.products ?? data)
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Filter failed'
    emit('results', [])
  } finally {
    filtering.value = false
  }
}

function clearFilter() {
  minPrice.value = ''
  maxPrice.value = ''
  errorMessage.value = ''
  emit('cleared')
}
</script>

<template>
  <div class="filter-bar">
    <form class="filter-form" @submit.prevent="handleFilter">
      <input v-model="minPrice" type="number" min="0" placeholder="Min price" />
      <span class="dash">–</span>
      <input v-model="maxPrice" type="number" min="0" placeholder="Max price" />
      <button type="submit" class="filter-btn" :disabled="filtering">
        {{ filtering ? 'Filtering...' : 'Filter' }}
      </button>
      <button
        v-if="minPrice || maxPrice"
        type="button"
        class="clear-btn"
        @click="clearFilter"
      >
        Clear
      </button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.filter-bar {
  max-width: 500px;
  margin: 0 auto 28px;
}
.filter-form {
  display: flex;
  align-items: center;
  gap: 8px;
}
.filter-form input {
  flex: 1;
  min-width: 0;
  padding: 9px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.95rem;
}
.dash {
  color: #9ca3af;
}
.filter-btn {
  background: #3b82f6;
  color: #fff;
  border: none;
  padding: 9px 18px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;
}
.filter-btn:disabled {
  opacity: 0.7;
  cursor: default;
}
.clear-btn {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  padding: 9px 14px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}
.error {
  color: #ef4444;
  margin-top: 8px;
  text-align: center;
}
</style>
