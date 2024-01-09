<template>
  <div class="container mt-7">
    <CartEmpty v-if="!lineItems.length" />
    <NuxtLayout name="checkout">
      <template #main>
        <CheckoutShippingForm
          v-if="isAddressFormActive"
          v-model="isAddressFormActive"
          :cart="cart"
        />
        <CheckoutShippingPreview
          v-if="!isAddressFormActive"
          v-model="isAddressFormActive"
          :shipping-address="cart.shipping_address as Address"
          :email="cart?.email"
        />
        <CheckoutDeliveryForm
          :shipping-methods="shippingMethods"
          :model-value="selectedShippingMethod"
          @update:model-value="updateShippingMethod"
        />
        <CheckoutPaymentForm
          v-model="providerId"
          :payment-sessions="paymentSessions"
          @update:model-value="(id) => setPayment(id, setPaymentSession)"
        />
      </template>
      <template #sidebar>
        <CheckoutSummary :cart="cart" />
        <Button
          class="w-full flex justify-content-center mb-7"
          :disabled="readyToComplete === false"
          @click="completeCart"
          >Complete Order</Button
        >
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Address } from "@medusajs/medusa";
import { useCartStore } from "~/store/cart";
import { useShippingMethods } from "~/composables/useShippingMethods";
import { usePaymentSession } from "~/composables/usePaymentSession";

const { cart, lineItems, paymentSessions, readyToComplete } = storeToRefs(
  useCartStore()
);
const { initPaymentSession, setPaymentSession, completeCart } = useCartStore();
const isAddressFormActive = ref(cart?.value?.shipping_address === null);

initPaymentSession();

const { updateShippingMethod, shippingMethods, selectedShippingMethod } =
  useShippingMethods(cart);

const { setPayment, providerId } = usePaymentSession(cart);
</script>
