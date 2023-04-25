<template>
  <div v-for="product in products">
    <Card class="my-4">
      <template #title>{{ product.title }}</template>
      <template #content>
        <p>
          {{ product.description }}
        </p>
      </template>
    </Card>
  </div>
</template>
<script setup lang="ts">
import { Product } from "@medusajs/medusa";

defineProps<{
  products: Product[]
}>()
</script>
<style scoped></style>
