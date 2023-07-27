<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
import { useCartStore } from "~/store/cart";
import { useRegionStore } from "~/store/region";

const { initCart } = useCartStore();
const { fetchRegions } = useRegionStore();

await initCart();
fetchRegions();
</script>
