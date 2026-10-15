<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'
import { useCartStore } from '../stores/cart'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'

const notyf = new Notyf({ duration: 2500, position: { x: 'right', y: 'bottom' }, ripple: true })

const cart = useCartStore()
const router = useRouter()

const errorMessage = ref('')
const checkingOut = ref(false)

onMounted(async () => {
  try {
    await cart.fetchCart()
  } catch (err) {
    errorMessage.value = 'Could not load your cart.'
  }
})

async function updateQty(productId, newQuantity) {
  if (newQuantity < 1) return
  try {
    await cart.updateQuantity(productId, newQuantity)
  } catch (err) {
    notyf.error(err.response?.data?.message || 'Could not update quantity')
  }
}

async function removeItem(productId) {
  try {
    await cart.removeItem(productId)
    notyf.success('Item removed from cart')
  } catch (err) {
    notyf.error(err.response?.data?.message || 'Could not remove item')
  }
}

async function clearCart() {
  try {
    await cart.clearCart()
    notyf.success('Cart cleared')
  } catch (err) {
    notyf.error(err.response?.data?.message || 'Could not clear cart')
  }
}

async function checkout() {
  checkingOut.value = true
  try {
    await api.post('/orders/checkout')
    notyf.success('Ordered Successfully')
    await cart.clearCart()
    router.push('/orders')
  } catch (err) {
    notyf.error(err.response?.data?.error || 'Checkout failed')
  } finally {
    checkingOut.value = false
  }
}
</script>

<template>
  <div>
    <h2 class="title">My Cart</h2>

    <p v-if="cart.loading">Loading cart...</p>
    <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-else-if="cart.items.length === 0">Your cart is empty.</p>

    <div v-else class="cart">
      <div v-for="item in cart.items" :key="item.productId" class="cart-row">
        <div class="info">
          <p class="name">{{ item.product?.name || 'Unknown product' }}</p>
          <p class="unit-price" v-if="item.product">₱{{ item.product.price }} each</p>
        </div>

        <div class="qty-control">
          <button @click="updateQty(item.productId, item.quantity - 1)">-</button>
          <span>{{ item.quantity }}</span>
          <button @click="updateQty(item.productId, item.quantity + 1)">+</button>
        </div>

        <div class="subtotal">₱{{ item.subtotal }}</div>

        <button class="remove-btn" @click="removeItem(item.productId)">Remove</button>
      </div>

      <div class="cart-summary">
        <button class="clear-btn" @click="clearCart">Clear Cart</button>
        <div class="total">
          <span>Total: </span>
          <strong>₱{{ cart.totalPrice }}</strong>
        </div>
        <button class="checkout-btn" :disabled="checkingOut" @click="checkout">
          {{ checkingOut ? 'Placing order...' : 'Checkout' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  text-align: center;
  margin-bottom: 24px;
}
.cart {
  max-width: 700px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}
.cart-row {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
  border-bottom: 1px solid #e5e7eb;
}
.name {
  font-weight: 600;
  margin: 0;
}
.unit-price {
  margin: 2px 0 0;
  font-size: 0.85rem;
  color: #6b7280;
}
.qty-control {
  display: flex;
  align-items: center;
  gap: 8px;
}
.qty-control button {
  width: 26px;
  height: 26px;
  border: 1px solid #d1d5db;
  background: #f3f4f6;
  cursor: pointer;
  border-radius: 4px;
}
.subtotal {
  color: #f59e0b;
  font-weight: 700;
}
.remove-btn {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-weight: 600;
}
.cart-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  background: #f9fafb;
}
.clear-btn {
  background: none;
  border: 1px solid #d1d5db;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
}
.checkout-btn {
  background: #22c55e;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
}
.checkout-btn:disabled {
  opacity: 0.7;
  cursor: default;
}
.error {
  color: #ef4444;
}
</style>
