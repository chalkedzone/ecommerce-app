<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'

const notyf = new Notyf({ duration: 2500, position: { x: 'right', y: 'bottom' }, ripple: true })

const props = defineProps({
  productId: { type: String, required: true }
})

const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()

const product = ref(null)
const quantity = ref(1)
const loading = ref(true)
const notFound = ref(false)
const adding = ref(false)

onMounted(async () => {
  try {
    const { data } = await api.get(`/products/${props.productId}`)
    product.value = data
  } catch (err) {
    notFound.value = true
  } finally {
    loading.value = false
  }
})

function decrement() {
  if (quantity.value > 1) quantity.value--
}

function increment() {
  quantity.value++
}

async function handleAddToCart() {
  if (!auth.isLoggedIn) {
    router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
    return
  }

  adding.value = true
  try {
    await cart.addToCart(product.value, quantity.value)
    notyf.success('Added to Cart.')
  } catch (err) {
    notyf.error(err.response?.data?.message || 'Could not add to cart')
  } finally {
    adding.value = false
  }
}
</script>

<template>
  <div>
    <p v-if="loading">Loading product...</p>
    <p v-else-if="notFound">Product not found.</p>

    <div v-else class="product-panel">
      <div class="header">{{ product.name.toUpperCase() }}</div>
      <div class="body">
        <p class="description">{{ product.description }}</p>
        <p class="price">Price: ₱{{ product.price }}</p>

        <p class="qty-label">Quantity:</p>
        <div class="qty-control">
          <button @click="decrement">-</button>
          <input type="number" v-model.number="quantity" min="1" />
          <button @click="increment">+</button>
        </div>
      </div>
      <div class="footer">
        <button class="add-btn" :disabled="adding" @click="handleAddToCart">
          {{ adding ? 'Adding...' : 'Add to Cart' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-panel {
  max-width: 700px;
  margin: 0 auto;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  background: #fff;
}
.header {
  background: #1f2937;
  color: #fff;
  text-align: center;
  padding: 14px;
  font-weight: 700;
}
.body {
  padding: 20px;
}
.description {
  color: #4b5563;
  margin-bottom: 16px;
}
.price {
  color: #f59e0b;
  font-weight: 700;
}
.qty-label {
  margin-top: 12px;
  margin-bottom: 6px;
}
.qty-control {
  display: flex;
  align-items: center;
  gap: 0;
  width: fit-content;
}
.qty-control button {
  width: 34px;
  height: 34px;
  background: #1f2937;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
}
.qty-control input {
  width: 60px;
  height: 34px;
  text-align: center;
  border: 1px solid #d1d5db;
  border-left: none;
  border-right: none;
}
.footer {
  padding: 14px 20px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}
.add-btn {
  background: #3b82f6;
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
}
.add-btn:disabled {
  opacity: 0.7;
  cursor: default;
}
</style>
