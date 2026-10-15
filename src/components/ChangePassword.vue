<script setup>
import { reactive, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'

const auth = useAuthStore()
const notyf = new Notyf({ duration: 2500, position: { x: 'right', y: 'bottom' }, ripple: true })

const emit = defineEmits(['close', 'updated'])

const form = reactive({
  newPassword: '',
  verifyPassword: ''
})

const saving = ref(false)

function validate() {
  if (!form.newPassword || !form.verifyPassword) {
    return 'Please fill out both fields'
  }
  if (form.newPassword.length < 8) {
    return 'Password must be at least 8 characters long'
  }
  if (form.newPassword !== form.verifyPassword) {
    return 'Passwords must match'
  }
  return ''
}

async function handleSubmit() {
  const error = validate()
  if (error) {
    notyf.error(error)
    return
  }

  saving.value = true
  try {
    await auth.updatePassword(form.newPassword)
    notyf.success('Password updated successfully')
    form.newPassword = ''
    form.verifyPassword = ''
    emit('updated')
    emit('close')
  } catch (err) {
    notyf.error(err.response?.data?.message || err.response?.data?.error || 'Update failed')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="form-panel">
    <h3>Change Password</h3>
    <form @submit.prevent="handleSubmit" class="form">
      <label>New Password:</label>
      <input v-model="form.newPassword" type="password" placeholder="Enter new password" />

      <label>Verify Password:</label>
      <input v-model="form.verifyPassword" type="password" placeholder="Verify new password" />

      <div class="form-actions">
        <button type="submit" class="save-btn" :disabled="saving">
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
        <button type="button" class="cancel-btn" @click="emit('close')">Cancel</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-panel {
  max-width: 480px;
  margin: 0 auto 30px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 20px 24px;
}
h3 {
  margin-top: 0;
  margin-bottom: 16px;
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
.form-actions {
  display: flex;
  gap: 8px;
  margin-top: 20px;
}
.save-btn {
  background: #3b82f6;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}
.save-btn:disabled {
  opacity: 0.7;
  cursor: default;
}
.cancel-btn {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
