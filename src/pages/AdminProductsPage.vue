<script setup>
import { onMounted, reactive, ref } from 'vue'
import api from '../api'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'

const notyf = new Notyf({ duration: 2500, position: { x: 'right', y: 'bottom' }, ripple: true })

const products = ref([])
const loading = ref(true)
const errorMessage = ref('')

const editingId = ref(null)
const form = reactive({ name: '', description: '', price: '' })
const saving = ref(false)

async function loadProducts() {
  loading.value = true
  try {
    const { data } = await api.get('/products/all')
    products.value = data
  } catch (err) {
    if (err.response?.status === 404) {
      products.value = []
    } else {
      errorMessage.value = 'Could not load products.'
    }
  } finally {
    loading.value = false
  }
}

onMounted(loadProducts)

function resetForm() {
  editingId.value = null
  form.name = ''
  form.description = ''
  form.price = ''
}

function startEdit(product) {
  editingId.value = product._id
  form.name = product.name
  form.description = product.description
  form.price = product.price
}

async function handleSubmit() {
  if (!form.name || !form.description || !form.price) {
    notyf.error('All fields are required')
    return
  }

  saving.value = true
  try {
    if (editingId.value) {
      await api.patch(`/products/${editingId.value}/update`, {
        name: form.name,
        description: form.description,
        price: Number(form.price)
      })
      notyf.success('Product updated successfully')
    } else {
      await api.post('/products', {
        name: form.name,
        description: form.description,
        price: Number(form.price)
      })
      notyf.success('Product created successfully')
    }
    resetForm()
    await loadProducts()
  } catch (err) {
    notyf.error(err.response?.data?.message || err.response?.data?.error || 'Save failed')
  } finally {
    saving.value = false
  }
}

async function toggleActive(product) {
  const action = product.isActive ? 'archive' : 'activate'
  try {
    await api.patch(`/products/${product._id}/${action}`)
    notyf.success(`Product ${action}d successfully`)
    await loadProducts()
  } catch (err) {
    notyf.error(err.response?.data?.message || 'Action failed')
  }
}
</script>

<template>
  <div>
    <h2 class="title">Admin Dashboard — Products</h2>

    <div class="form-panel">
      <h3>{{ editingId ? 'Edit Product' : 'Create Product' }}</h3>
      <form @submit.prevent="handleSubmit" class="form">
        <input v-model="form.name" id="product_name" type="text" placeholder="Product name" />
        <input v-model="form.description" type="text" placeholder="Description" />
        <input v-model="form.price" type="number" min="0" placeholder="Price" />
        <div class="form-actions">
          <button type="submit" class="save-btn" :disabled="saving">
            {{ saving ? 'Saving...' : editingId ? 'Update' : 'Create' }}
          </button>
          <button v-if="editingId" type="button" class="cancel-btn" @click="resetForm">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <p v-if="loading">Loading products...</p>
    <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>

    <table v-else class="products-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product._id">
          <td>{{ product.name }}</td>
          <td>₱{{ product.price }}</td>
          <td>
            <span :class="['badge', product.isActive ? 'active' : 'inactive']">
              {{ product.isActive ? 'Active' : 'Archived' }}
            </span>
          </td>
          <td class="actions">
            <button 
            class="edit-btn"
            @click="startEdit(product)">Edit</button>
            <button 
            :class="['toggle-btn', product.isActive ? 'disable-state' : 'activate-state']"
            @click="toggleActive(product)">
              {{ product.isActive ? 'Disable' : 'Activate' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.title {
  text-align: center;
  margin-bottom: 24px;
}
.form-panel {
  max-width: 700px;
  margin: 0 auto 30px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 16px 20px;
}
.form {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}
.form input {
  flex: 1;
  min-width: 140px;
  padding: 9px 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}
.form-actions {
  display: flex;
  gap: 8px;
}
.save-btn {
  background: #3b82f6;
  color: #fff;
  border: none;
  padding: 9px 18px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}
.save-btn:disabled {
  opacity: 0.7;
}
.cancel-btn {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  padding: 9px 14px;
  border-radius: 4px;
  cursor: pointer;
}
.products-table {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  border-collapse: collapse;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}
th,
td {
  text-align: left;
  padding: 10px 14px;
  border-bottom: 1px solid #e5e7eb;
}
th {
  background: #f9fafb;
}
.badge {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}
.badge.active {
  background: #dcfce7;
  color: #16a34a;
}
.badge.inactive {
  background: #fee2e2;
  color: #dc2626;
}
.actions {
  display: flex;
  gap: 8px;
}
.edit-btn {
  background: #3b82f6;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}
.toggle-btn.disable-state {
  background: #fee2e2;
  border: 1px solid #fca5a5;
  color: #dc2626;
}
.toggle-btn.activate-state {
  background: #dcfce7;
  border: 1px solid #86efac;
  color: #16a34a;
}
.error {
  color: #ef4444;
}
</style>
