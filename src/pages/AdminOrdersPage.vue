<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'

const router = useRouter()

const orders = ref([])
const loading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  try {
    const { data } = await api.get('/orders/all-orders')
    orders.value = data.orders ?? data
  } catch (err) {
    if (err.response?.status === 404) {
      orders.value = []
    } else {
      errorMessage.value = 'Could not load orders.'
    }
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <div class="header-row">
      <h1 class="title">User Orders</h1>
      <button class="back-btn" @click="router.push({ name: 'products' })">
        Back to Dashboard
      </button>
    </div>

    <p v-if="loading">Loading orders...</p>
    <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-else-if="orders.length === 0">No orders have been placed yet.</p>

    <table v-else class="orders-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>User</th>
          <th>Items</th>
          <th>Total</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order._id">
          <td class="mono">{{ order._id }}</td>
          <td class="mono">{{ order.userId }}</td>
          <td>
            <ul class="items">
              <li v-for="item in order.productsOrdered" :key="item.productId">
                {{ item.quantity }} x {{ item.productId }} — ₱{{ item.subtotal }}
              </li>
            </ul>
          </td>
          <td>₱{{ order.totalPrice }}</td>
          <td>
            <span class="status-badge">{{ order.status }}</span>
          </td>
          <td>{{ new Date(order.orderedOn).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.header-row {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 24px;
}
.title {
  text-align: center;
  margin: 0;
}
.back-btn {
  position: absolute;
  right: 0;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}
.orders-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}
th,
td {
  text-align: left;
  padding: 10px 14px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.88rem;
  vertical-align: top;
}
thead th {
  background: #111827;
  color: #fff;
  font-weight: 700;
}
tbody tr:nth-child(even) {
  background: #f9fafb;
}
.mono {
  font-family: monospace;
  font-size: 0.78rem;
  color: #6b7280;
  word-break: break-all;
}
.items {
  margin: 0;
  padding-left: 16px;
  color: #4b5563;
}
.status-badge {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  background: #dbeafe;
  color: #2563eb;
  text-transform: capitalize;
}
.error {
  color: #ef4444;
}
</style>
