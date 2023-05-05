<template>
  <Card class="my-4 shadow-none">
    <template #header>
      <div class="p-card-image bg-black-alpha-10 overflow-hidden">
        <img
          alt="user header"
          :src="product.thumbnail"
          class="min-w-full max-w-full flex-shrink-0"
        />
      </div>
    </template>
    <template #content>
      <div class="flex justify-content-between">
        <p>
          {{ product.title }}
        </p>
        <p>
          {{ product.price.calculated_price }}
        </p>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ProductPreviewType } from "~/types/global";

defineProps<{
  product: ProductPreviewType;
}>();
</script>
<style>
.p-card-image {
  height: 0;
  width: 100%;
  padding-bottom: 100%;
}
</style>
