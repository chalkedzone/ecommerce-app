<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import UpdateProfile from '../components/UpdateProfile.vue'
import ChangePassword from '../components/ChangePassword.vue'

const auth = useAuthStore()

const activePanel = ref(null)

const details = computed(() => {
  const user = auth.user || {}
  return [
    { label: 'First Name', value: user.firstName },
    { label: 'Last Name', value: user.lastName },
    { label: 'Email', value: user.email },
    { label: 'Mobile Number', value: user.mobileNo },
    { label: 'Role', value: user.isAdmin ? 'Admin' : 'Customer' }
  ]
})

function openProfileForm() {
  activePanel.value = activePanel.value === 'profile' ? null : 'profile'
}

function openPasswordForm() {
  activePanel.value = activePanel.value === 'password' ? null : 'password'
}

function closePanel() {
  activePanel.value = null
}
</script>

<template>
  <div>
    <h1 class="title">My Profile</h1>

    <div v-if="auth.user" class="details-card">
      <div v-for="detail in details" :key="detail.label" class="detail-row">
        <span class="label">{{ detail.label }}</span>
        <span class="value">{{ detail.value }}</span>
      </div>
    </div>
    <p v-else class="error">No profile information available.</p>

    <div class="toolbar">
      <button class="profile-btn" @click="openProfileForm">Update Profile</button>
      <button class="password-btn" @click="openPasswordForm">Change Password</button>
    </div>

    <UpdateProfile v-if="activePanel === 'profile'" @close="closePanel" />
    <ChangePassword v-if="activePanel === 'password'" @close="closePanel" />
  </div>
</template>

<style scoped>
.title {
  text-align: center;
  margin-bottom: 24px;
}
.details-card {
  max-width: 480px;
  margin: 0 auto 24px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}
.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid #e5e7eb;
}
.detail-row:last-child {
  border-bottom: none;
}
.label {
  font-weight: 600;
  color: #374151;
}
.value {
  color: #6b7280;
}
.toolbar {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 24px;
}
.profile-btn {
  background: #3b82f6;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}
.password-btn {
  background: #f59e0b;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}
.error {
  text-align: center;
  color: #ef4444;
}
</style>
