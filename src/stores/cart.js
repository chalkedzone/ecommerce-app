import { defineStore } from 'pinia'
import api from '../api'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: null, 
    items: [], 
    loading: false
  }),

  getters: {
    itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) => state.cart?.totalPrice || 0
  },

  actions: {
    async enrichItems(cartItems) {
      const enriched = await Promise.all(
        cartItems.map(async (item) => {
          try {
            const { data: product } = await api.get(`/products/${item.productId}`)
            return { ...item, product }
          } catch (err) {
            return { ...item, product: null }
          }
        })
      )
      this.items = enriched
    },

    async fetchCart() {
      this.loading = true
      try {
        const { data } = await api.get('/cart/get-cart')
        this.cart = data.cart
        await this.enrichItems(data.cart.cartItems)
      } catch (err) {
        if (err.response?.status === 404) {
          this.cart = null
          this.items = []
        } else {
          throw err
        }
      } finally {
        this.loading = false
      }
    },

    async addToCart(product, quantity) {
      const subtotal = product.price * quantity
      const { data } = await api.post('/cart/add-to-cart', {
        productId: product._id,
        price: product.price,
        quantity,
        subtotal
      })
      this.cart = data.cart
      await this.enrichItems(data.cart.cartItems)
      return data
    },

    async updateQuantity(productId, newQuantity) {
      const { data } = await api.patch('/cart/update-cart-quantity', {
        productId,
        newQuantity
      })
      this.cart = data.updatedCart
      await this.enrichItems(data.updatedCart.cartItems)
      return data
    },

    async removeItem(productId) {
      const { data } = await api.patch(`/cart/${productId}/remove-from-cart`)
      this.cart = data.updatedCart
      await this.enrichItems(data.updatedCart.cartItems)
      return data
    },

    async clearCart() {
      const { data } = await api.put('/cart/clear-cart')
      this.cart = data.cart || null
      this.items = []
      return data
    },

    reset() {
      this.cart = null
      this.items = []
    }
  }
})
