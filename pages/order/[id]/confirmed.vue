<template>
  <div>
    <h1>Order Confirmed</h1>
    <p>Thank you for your order!</p>
    <div>{{ data }}</div>
  </div>
</template>
<script lang="ts" setup>
const route = useRoute();
const client = useMedusaClient();

const { data } = useAsyncData(
  `shipping-options:${route.params.id}`,
  () => client.orders.retrieve(route.params.id as string),
  {
    default: () => {},
  }
);
</script>
