<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'

const router = useRouter()
const notyf = new Notyf({ duration: 2500, position: { x: 'right', y: 'bottom' }, ripple: true })

const products = ref([])
const loading = ref(true)
const errorMessage = ref('')

const showForm = ref(false)
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

function openCreateForm() {
  resetForm()
  showForm.value = true
}

function startEdit(product) {
  editingId.value = product._id
  form.name = product.name
  form.description = product.description
  form.price = product.price
  showForm.value = true
}

function cancelForm() {
  resetForm()
  showForm.value = false
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
    showForm.value = false
    await loadProducts()
  } catch (err) {
    notyf.error(err.response?.data?.message || err.response?.data?.error || 'Save failed')
  } finally {
    saving.value = false
  }
}

async function handleToggleAvailability(product) {
  const action = product.isActive ? 'archive' : 'activate'
  try {
    await api.patch(`/products/${product._id}/${action}`)
    notyf.success(`Product ${action}d successfully`)
    await loadProducts()
  } catch (err) {
    notyf.error(err.response?.data?.message || 'Action failed')
  }
}

function goToOrders() {
  router.push({ name: 'admin-orders' })
}

function goToUsers() {
  router.push({ name: 'admin-users' })
}
</script>

<template>
  <div>
    <h1 class="title">Admin Dashboard</h1>

    <div class="toolbar">
      <button class="add-btn" @click="openCreateForm">Add New Product</button>
      <button class="orders-btn" @click="goToOrders">Show User Orders</button>
      <button class="users-btn" @click="goToUsers">Show All Users</button>
    </div>

    <div v-if="showForm" class="form-panel">
      <h3>{{ editingId ? 'Update Product' : 'Create Product' }}</h3>
      <form @submit.prevent="handleSubmit" class="form">
        <div>
          <div>
            <label for="">Name:</label>
          </div>
          <div>
            <input v-model="form.name" type="text" placeholder="Product name" />
          </div>
        </div>

        <div>
          <div>
            <label for="">Description:</label>
          </div>
          <div>
            <input v-model="form.description" type="text" placeholder="Description" />
          </div>
        </div>

        <div>
          <div>
            <label for="">Price:</label>
          </div>
          <div>
             <input v-model="form.price" type="number" min="0" placeholder="Price" />
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="save-btn" :disabled="saving">
            {{ saving ? 'Saving...' : editingId ? 'Update' : 'Create' }}
          </button>
          <button type="button" class="cancel-btn" @click="cancelForm">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <p v-if="loading">Loading products...</p>
    <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-else-if="products.length === 0">No products found.</p>

    <table v-else class="products-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Availability</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product._id">
          <td class="name-cell">{{ product.name }}</td>
          <td class="description-cell">{{ product.description }}</td>
          <td>{{ product.price }}</td>
          <td>
            <span v-if="product.isActive" class="status available">Available</span>
            <span v-else class="status unavailable">Unavailable</span>
          </td>
          <td>
            <div class="actions">
              <button class="update-btn" @click="startEdit(product)">Update</button>
              <button
                :class="['toggle-btn', product.isActive ? 'disable-state' : 'activate-state']"
                @click="handleToggleAvailability(product)"
              >
                {{ product.isActive ? 'Disable' : 'Enable' }}
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.title {
  text-align: center;
  margin-bottom: 16px;
}
.toolbar {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 24px;
}
.add-btn {
  background: #3b82f6;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}
.orders-btn {
  background: #22c55e;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}
.users-btn {
  background: #8b5cf6;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
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
  vertical-align: top;
}
thead th {
  background: #111827;
  color: #fff;
  font-weight: 700;
}
tbody tr:nth-child(even) {
  background: #f9fafb;
}
.name-cell {
  color: #2563eb;
  font-weight: 600;
  max-width: 220px;
}
.description-cell {
  color: #374151;
  max-width: 420px;
}
.status {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}
.status.available {
  background: #dcfce7;
  color: #16a34a;
}
.status.unavailable {
  background: #fee2e2;
  color: #dc2626;
}
.actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: fit-content;
}
.update-btn {
  background: #3b82f6;
  color: #fff;
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}
.toggle-btn {
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}
.toggle-btn.disable-state {
  background: #ef4444;
  color: #fff;
}
.toggle-btn.activate-state {
  background: #22c55e;
  color: #fff;
}
.error {
  color: #ef4444;
}
</style>
