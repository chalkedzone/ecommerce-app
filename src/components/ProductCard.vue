<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  product: { type: Object, required: true }
})

const CHAR_LIMIT = 80
const expanded = ref(false)

const isTruncatable = computed(() => props.product.description.length > CHAR_LIMIT)

const displayedDescription = computed(() => {
  if (!isTruncatable.value || expanded.value) {
    return props.product.description
  }
  return props.product.description.slice(0, CHAR_LIMIT).trimEnd() + '...'
})

function toggleExpanded() {
  expanded.value = !expanded.value
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <h3 class="name">{{ product.name.toUpperCase() }}</h3>
      <p class="description">
        {{ displayedDescription }}
        <button v-if="isTruncatable" class="see-more-btn" @click="toggleExpanded">
          {{ expanded ? 'See Less' : 'See More' }}
        </button>
      </p>
    </div>
    <div class="card-footer">
      <span class="price">₱{{ product.price }}</span>
      <router-link class="details-btn" :to="{ name: 'product-details', params: { productId: product._id } }">
        Details
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  background: #fff;
  min-height: 220px;
}
.card-body {
  padding: 16px;
  flex: 1;
}
.name {
  color: #3b82f6;
  font-size: 1rem;
  margin: 0 0 10px;
}
.description {
  color: #4b5563;
  font-size: 0.9rem;
  line-height: 1.4;
}
.see-more-btn {
  background: none;
  border: none;
  padding: 0;
  margin-left: 4px;
  color: #3b82f6;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
}
.price {
  color: #f59e0b;
  font-weight: 700;
}
.details-btn {
  background: #3b82f6;
  color: #fff;
  text-decoration: none;
  padding: 8px 20px;
  border-radius: 4px;
  font-weight: 600;
}
</style>