<template>
  <div class="grid px-4">
    <div v-for="product in products" class="col-3">
        <ProductCard :product="product" />
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
