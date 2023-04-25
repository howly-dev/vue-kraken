<template>
  <HomeProducts :products="products" />
</template>

<script setup lang="ts">

import HomeProducts from "@/components/HomeProducts.vue"

const client = useMedusaClient();
const { products } = await client.products.list();
console.log(products)
</script>
