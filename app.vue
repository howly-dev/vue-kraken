<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
import { useCartStore } from "~/store/cart";

const { initCart } = useCartStore();

await initCart();
</script>
