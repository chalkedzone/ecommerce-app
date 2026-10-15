<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  product: { type: Object, required: true }
})

const CHAR_LIMIT = 90
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
  <div class="product-card">
    <img
      class="product-image"
      :src="`https://placehold.co/600x400/1f2937/ffffff?font=lora&text=${encodeURIComponent(product.name)}`"
      :alt="product.name"
    />
    <div class="product-body">
      <h3 class="name">{{ product.name }}</h3>
      <p class="description">
        {{ displayedDescription }}
        <button v-if="isTruncatable" class="see-more-btn" @click="toggleExpanded">
          {{ expanded ? 'See Less' : 'See More' }}
        </button>
      </p>
      <p class="price"><span class="price-label">Price:</span> ₱{{ product.price }}</p>
    </div>
    <div class="product-footer">
      <router-link
        class="details-btn"
        :to="{ name: 'product-details', params: { productId: product._id } }"
      >
        View Product
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  background: #fff;
  min-height: 100%;
}
.product-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}
.product-body {
  padding: 16px;
  flex: 1;
}
.name {
  color: #1f2937;
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 10px;
}
.description {
  color: #4b5563;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0 0 10px;
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
.price {
  margin: 0;
  font-weight: 700;
  color: #f59e0b;
}
.price-label {
  color: #4b5563;
  font-weight: 600;
}
.product-footer {
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
}
.details-btn {
  display: block;
  text-align: center;
  background: #3b82f6;
  color: #fff;
  text-decoration: none;
  padding: 9px 20px;
  border-radius: 4px;
  font-weight: 600;
}
</style>
