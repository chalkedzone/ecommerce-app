import { defineStore } from 'pinia'
import api from '../api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null')
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => !!state.user?.isAdmin
  },

  actions: {
    async register(payload) {
      const { data } = await api.post('/users/register', payload)
      return data
    },

    async login(email, password) {
      const { data } = await api.post('/users/login', { email, password })
      this.token = data.access
      localStorage.setItem('token', this.token)
      await this.fetchProfile()
      return data
    },

    async fetchProfile() {
      const { data } = await api.get('/users/details')
      this.user = data
      localStorage.setItem('user', JSON.stringify(data))
      return data
    },

    async updatePassword(newPassword) {
      const { data } = await api.patch('/users/update-password', { newPassword })
      return data
    },

    async updateProfile(payload) {
      // NOTE: adjust this endpoint if your backend exposes profile updates
      // under a different path (e.g. /users/profile).
      const { data } = await api.patch('/users/update-profile', payload)
      await this.fetchProfile()
      return data
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})
