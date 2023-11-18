<template>
  <div class="container mt-7">
    <CartEmpty v-if="!lineItems.length" />
    <NuxtLayout name="checkout">
      <template #main>
        <CheckoutShippingForm />
        <CheckoutDeliveryForm />
        <CheckoutPaymentForm />
      </template>
      <template #sidebar>
        <CheckoutSummary :cart="cart" />
        <Button
          class="w-full flex justify-content-center mb-7"
          @click="() => {}"
          >Go to shipping</Button
        >
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useCartStore } from "~/store/cart";
import CheckoutSummary from "~/components/CheckoutSummary.vue";
import CheckoutDeliveryForm from "~/components/CheckoutDeliveryForm.vue";
import CheckoutPaymentForm from "~/components/CheckoutPaymentForm.vue";

const { cart, lineItems } = storeToRefs(useCartStore());
</script>
