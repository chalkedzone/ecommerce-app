<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'
import { useAuthStore } from '../stores/auth'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'

const router = useRouter()
const auth = useAuthStore()
const notyf = new Notyf({ duration: 2500, position: { x: 'right', y: 'bottom' }, ripple: true })

const users = ref([])
const loading = ref(true)
const errorMessage = ref('')
const updatingId = ref(null)

async function loadUsers() {
  loading.value = true
  try {
    const { data } = await api.get('/users/all')
    users.value = data.users ?? data
  } catch (err) {
    if (err.response?.status === 404) {
      users.value = []
    } else {
      errorMessage.value = 'Could not load users.'
    }
  } finally {
    loading.value = false
  }
}

onMounted(loadUsers)

async function toggleAdmin(user) {
  const action = user.isAdmin ? 'set-as-customer' : 'set-as-admin'
  updatingId.value = user._id
  try {
    await api.patch(`/users/${user._id}/${action}`)
    notyf.success(
      user.isAdmin ? 'User removed as admin' : 'User set as admin successfully'
    )
    await loadUsers()
  } catch (err) {
    notyf.error(err.response?.data?.message || err.response?.data?.error || 'Action failed')
  } finally {
    updatingId.value = null
  }
}
</script>

<template>
  <div>
    <div class="header-row">
      <h1 class="title">Registered Users</h1>
      <button class="back-btn" @click="router.push({ name: 'products' })">
        Back to Dashboard
      </button>
    </div>

    <p v-if="loading">Loading users...</p>
    <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-else-if="users.length === 0">No registered users found.</p>

    <table v-else class="users-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Mobile Number</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in users" :key="u._id">
          <td>{{ u.firstName }} {{ u.lastName }}</td>
          <td>{{ u.email }}</td>
          <td>{{ u.mobileNo }}</td>
          <td>
            <span :class="['role-badge', u.isAdmin ? 'admin' : 'customer']">
              {{ u.isAdmin ? 'Admin' : 'Customer' }}
            </span>
          </td>
          <td>
            <button
              v-if="u._id !== auth.user?._id"
              :class="['toggle-btn', u.isAdmin ? 'demote-btn' : 'promote-btn']"
              :disabled="updatingId === u._id"
              @click="toggleAdmin(u)"
            >
              {{
                updatingId === u._id
                  ? 'Updating...'
                  : u.isAdmin
                  ? 'Remove Admin'
                  : 'Make Admin'
              }}
            </button>
            <span v-else class="self-note">You</span>
          </td>
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
.users-table {
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
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.9rem;
}
thead th {
  background: #111827;
  color: #fff;
  font-weight: 700;
}
tbody tr:nth-child(even) {
  background: #f9fafb;
}
.role-badge {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}
.role-badge.admin {
  background: #dbeafe;
  color: #2563eb;
}
.role-badge.customer {
  background: #f3f4f6;
  color: #4b5563;
}
.toggle-btn {
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
}
.toggle-btn:disabled {
  opacity: 0.7;
  cursor: default;
}
.promote-btn {
  background: #3b82f6;
  color: #fff;
}
.demote-btn {
  background: #ef4444;
  color: #fff;
}
.self-note {
  color: #9ca3af;
  font-size: 0.85rem;
}
.error {
  color: #ef4444;
}
</style>
