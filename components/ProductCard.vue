<template>
  <Card class="my-4 shadow-none">
    <template #header>
      <NuxtLink :to="`/product/${product.id}`">
        <div class="square-img-wrapper bg-black-alpha-10 overflow-hidden">
          <img
            alt="user header"
            :src="product.thumbnail"
            class="min-w-full max-w-full flex-shrink-0"
          />
        </div>
      </NuxtLink>
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
