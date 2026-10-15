<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'

const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()

function handleLogout() {
  auth.logout()
  cart.reset()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar">
    <router-link to="/products" class="brand">CAPSTONE 3</router-link>

    <div class="links">
      <router-link v-if="!auth.isAdmin" to="/products">Products</router-link>
      <router-link v-if="auth.isAdmin" to="/products">Admin Dashboard</router-link>

      <template v-if="auth.isLoggedIn">
        <router-link v-if="!auth.isAdmin" to="/cart">Cart</router-link>
        <router-link v-if="!auth.isAdmin" to="/orders">My Orders</router-link>
        <router-link to="/profile">Profile</router-link>
        <span class="user-chip" v-if="auth.user">Hi, {{ auth.user.firstName }}</span>
        <button class="link-btn" @click="handleLogout">Logout</button>
      </template>

      <template v-else>
        <router-link to="/login">Login</router-link>
        <router-link to="/register">Register</router-link>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 32px;
  background: #1f2937;
  color: #fff;
}
.brand {
  font-weight: 700;
  font-size: 1.2rem;
  color: #60a5fa;
  text-decoration: none;
}
.links {
  display: flex;
  align-items: center;
  gap: 20px;
}
.links a {
  color: #e5e7eb;
  text-decoration: none;
  font-weight: 500;
}
.links a.router-link-active {
  color: #60a5fa;
}
.link-btn {
  background: #ef4444;
  color: #fff;
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}
.user-chip {
  color: #9ca3af;
  font-size: 0.9rem;
}
</style>
