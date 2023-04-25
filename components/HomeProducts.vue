<template>
  <div v-for="product in products">
      <div class="product-card" >
        {{ product.title }}
      </div>
  </div>
</template>
<script setup lang="ts">
import { Product } from "@medusajs/medusa";

defineProps<{
  products: Product[]
}>()
</script>
<style scoped></style>
