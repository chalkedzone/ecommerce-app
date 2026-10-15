<script setup>
import { reactive, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'

const auth = useAuthStore()
const notyf = new Notyf({ duration: 2500, position: { x: 'right', y: 'bottom' }, ripple: true })

const emit = defineEmits(['close', 'updated'])

const form = reactive({
  firstName: auth.user?.firstName || '',
  lastName: auth.user?.lastName || '',
  email: auth.user?.email || '',
  mobileNo: auth.user?.mobileNo || ''
})

const saving = ref(false)

function validate() {
  if (!form.firstName || !form.lastName || !form.email || !form.mobileNo) {
    return 'All fields are required'
  }
  if (!form.email.includes('@')) {
    return 'Email invalid'
  }
  if (form.mobileNo.length !== 11) {
    return 'Mobile number invalid'
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
    await auth.updateProfile({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      mobileNo: form.mobileNo
    })
    notyf.success('Profile updated successfully')
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
    <h3>Update Profile</h3>
    <form @submit.prevent="handleSubmit" class="form">
      <label>First Name:</label>
      <input v-model="form.firstName" type="text" placeholder="First Name" />

      <label>Last Name:</label>
      <input v-model="form.lastName" type="text" placeholder="Last Name" />

      <label>Email:</label>
      <input v-model="form.email" type="email" placeholder="Email" />

      <label>Mobile Number:</label>
      <input v-model="form.mobileNo" type="text" placeholder="11 digit mobile number" />

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
