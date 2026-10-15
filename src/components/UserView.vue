<script setup>
import { onMounted, ref } from 'vue'
import api from '../api.js'
import ProductComponent from './ProductComponent.vue'
import ProductSearch from './ProductSearch.vue'
import ProductFilterByPrice from './ProductFilterByPrice.vue'

const products = ref([])
const searchResults = ref(null)
const loading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  try {
    const { data } = await api.get('/products/active')
    products.value = data
  } catch (err) {
    if (err.response?.status === 404) {
      products.value = []
    } else {
      errorMessage.value = 'Could not load products.'
    }
  } finally {
    loading.value = false
  }
})

function handleSearchResults(results) {
  searchResults.value = results
}

function handleSearchCleared() {
  searchResults.value = null
}
</script>

<template>
  <div>
    <h2 class="title">Our Products</h2>

    <ProductSearch @results="handleSearchResults" @cleared="handleSearchCleared" />
    <ProductFilterByPrice @results="handleSearchResults" @cleared="handleSearchCleared" />

    <p v-if="loading">Loading products...</p>
    <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-else-if="(searchResults ?? products).length === 0">
      {{ searchResults ? 'No products matched.' : 'No active products found.' }}
    </p>

    <div v-else class="grid">
      <ProductComponent
        v-for="product in (searchResults ?? products)"
        :key="product._id"
        :product="product"
      />
    </div>
  </div>
</template>

<style scoped>
.title {
  text-align: center;
  margin-bottom: 24px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}
.error {
  color: #ef4444;
}
</style>
