<script setup>
import { onMounted, ref } from 'vue'
import api from '../api'

const orders = ref([])
const loading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  try {
    const { data } = await api.get('/orders/my-orders')
    orders.value = data.orders
  } catch (err) {
    if (err.response?.status === 404) {
      orders.value = []
    } else {
      errorMessage.value = 'Could not load your orders.'
    }
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <h2 class="title">My Orders</h2>

    <p v-if="loading">Loading orders...</p>
    <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-else-if="orders.length === 0">You haven't placed any orders yet.</p>

    <div v-else class="orders">
      <div v-for="order in orders" :key="order._id" class="order-card">
        <div class="order-head">
          <span>Order #{{ order._id.slice(-6).toUpperCase() }}</span>
          <span class="status">{{ order.status }}</span>
        </div>
        <p class="date">{{ new Date(order.orderedOn).toLocaleString() }}</p>
        <ul>
          <li v-for="item in order.productsOrdered" :key="item.productId">
            {{ item.quantity }} x product ({{ item.productId }}) — ₱{{ item.subtotal }}
          </li>
        </ul>
        <p class="total">Total: <strong>₱{{ order.totalPrice }}</strong></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  text-align: center;
  margin-bottom: 24px;
}
.orders {
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.order-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 16px 18px;
}
.order-head {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
}
.status {
  color: #3b82f6;
}
.date {
  color: #6b7280;
  font-size: 0.85rem;
  margin: 4px 0 10px;
}
ul {
  margin: 0 0 10px;
  padding-left: 18px;
  color: #4b5563;
  font-size: 0.9rem;
}
.total {
  text-align: right;
  color: #f59e0b;
}
.error {
  color: #ef4444;
}
</style>
