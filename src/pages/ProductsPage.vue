<script setup>
import { storeToRefs } from 'pinia'
import UserView from '../components/UserView.vue'
import AdminView from '../components/AdminView.vue'
import { useAuthStore } from '../stores/auth.js'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
</script>

<template>
  <div class="container">
    <AdminView v-if="user?.isAdmin" />
    <UserView v-else />
  </div>
</template>
