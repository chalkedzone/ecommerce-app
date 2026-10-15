<script setup>
import { reactive, ref, watch, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const notyf = new Notyf({ duration: 2500, position: { x: 'right', y: 'bottom' }, ripple: true })

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  mobileNo: '',
  password: '',
  verifyPassword: ''
})

const isEnabled = ref(false)
const loading = ref(false)

function validate() {
  if (
    !form.firstName ||
    !form.lastName ||
    !form.email ||
    !form.mobileNo ||
    !form.password ||
    !form.verifyPassword
  ) {
    return 'Please enter your registration details'
  }
  if (!form.email.includes('@')) {
    return 'Email invalid'
  }
  if (form.mobileNo.length !== 11) {
    return 'Mobile number invalid'
  }
  if (form.password.length < 8) {
    return 'Password must be at least 8 characters long'
  }
  if (form.password !== form.verifyPassword) {
    return 'Passwords must match'
  }
  return ''
}

watch(
  () => ({ ...form }),
  () => {
    isEnabled.value = validate() === ''
  },
  { deep: true }
)

async function handleSubmit() {
  const error = validate()
  if (error) {
    notyf.error(error)
    return
  }

  loading.value = true
  try {
    await auth.register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      mobileNo: form.mobileNo,
      password: form.password
    })

    notyf.success('Registration Successful')

    form.firstName = ''
    form.lastName = ''
    form.email = ''
    form.mobileNo = ''
    form.password = ''
    form.verifyPassword = ''

    router.push('/login')
  } catch (err) {
    notyf.error(
      err.response?.data?.error || err.response?.data?.message || 'Registration failed'
    )
  } finally {
    loading.value = false
  }
}

onBeforeMount(() => {
  if (auth.isLoggedIn) {
    router.push('/products')
  }
})
</script>

<template>
  <div class="form-wrapper">
    <h2>Register</h2>
    <form @submit.prevent="handleSubmit" class="form">
      <label>First Name:</label>
      <input v-model="form.firstName" type="text" placeholder="Enter your First Name" />

      <label>Last Name:</label>
      <input v-model="form.lastName" type="text" placeholder="Enter your Last Name" />

      <label>Email:</label>
      <input v-model="form.email" type="email" placeholder="Enter your email" />

      <label>Mobile Number:</label>
      <input v-model="form.mobileNo" type="text" placeholder="Enter your 11 digit mobile number" />

      <label>Password:</label>
      <input v-model="form.password" type="password" placeholder="Enter your password" />

      <label>Verify Password:</label>
      <input v-model="form.verifyPassword" type="password" placeholder="Verify your password" />

      <button type="submit" class="submit-btn" :disabled="!isEnabled || loading">
        {{ loading ? 'Submitting...' : 'Register' }}
      </button>
    </form>

    <p class="switch-link">
      Already have an account? <router-link to="/login">Click here</router-link> to log in.
    </p>
  </div>
</template>

<style scoped>
.form-wrapper {
  max-width: 480px;
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
.submit-btn {
  margin-top: 20px;
  padding: 12px;
  background: #ef4444;
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