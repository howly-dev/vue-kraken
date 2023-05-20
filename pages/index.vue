<template>
  <div>
    <HomeHero />
    <HomeProducts :products="products" />
  </div>
</template>

<script setup lang="ts">
import regions from "@/mocks/regions.json";
import transformProductPreview from "~/utils/transform-product-preview";
import { useAsyncData, useMedusaClient } from "#imports";
const client = useMedusaClient();

const { data: products } = useAsyncData(
  "products",
  () => client.products.list({ cart_id: "cart_01GZEGBFY8K4XAC168ABTFFQN1" }),
  {
    transform: (data) =>
      data.products.map((p) => transformProductPreview(p, regions[1])),
  }
);
</script>
