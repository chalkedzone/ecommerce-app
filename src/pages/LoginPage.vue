<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const form = reactive({ email: '', password: '' })
const errorMessage = ref('')
const loading = ref(false)

async function handleSubmit() {
  errorMessage.value = ''
  if (!form.email || !form.password) {
    errorMessage.value = 'Please enter your email and password'
    return
  }

  loading.value = true
  try {
    await auth.login(form.email, form.password)
    const redirect = route.query.redirect || '/products'
    router.push(redirect)
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="form-wrapper">
    <h2>Log In</h2>
    <form @submit.prevent="handleSubmit" class="form">
      <label>Email:</label>
      <input v-model="form.email" type="email" placeholder="Enter your email" />

      <label>Password:</label>
      <input v-model="form.password" type="password" placeholder="Enter your password" />

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <button type="submit" class="submit-btn" :disabled="loading">Submit</button>
    </form>

    <p class="switch-link">
      Don't have an account yet? <router-link to="/register">Click here</router-link> to register.
    </p>
  </div>
</template>

<style scoped>
.form-wrapper {
  max-width: 420px;
  margin: 0 auto;
  background: #fff;
  padding: 28px 32px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}
h2 {
  text-align: center;
  margin-bottom: 20px;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
label {
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 10px;
}
input {
  padding: 9px 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.95rem;
}
.error {
  color: #ef4444;
  font-size: 0.85rem;
  margin: 8px 0 0;
}
.submit-btn {
  margin-top: 20px;
  padding: 12px;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
}
.submit-btn:disabled {
  opacity: 0.7;
  cursor: default;
}
.switch-link {
  text-align: center;
  margin-top: 18px;
  font-size: 0.9rem;
}
</style>
