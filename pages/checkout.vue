<template>
  <div class="container mt-7">
    <CartEmpty v-if="!lineItems.length" />
    <NuxtLayout name="checkout">
      <template #main>
        <CheckoutShippingForm v-if="cartEdit" v-model="cartEdit" :cart="cart" />
        <CheckoutShippingPreview
          v-if="!cartEdit"
          v-model="cartEdit"
          :shipping-address="cart?.shipping_address"
          :email="cart?.email"
        />
        <CheckoutDeliveryForm
          :shipping-methods="shippingMethods"
          :model-value="selectedShippingMethod"
          @update:model-value="updateShippingMethod"
        />
        <CheckoutPaymentForm
          v-model="paymentSession"
          :payment-sessions="paymentSessions"
          @update:model-value="setPaymentSession"
        />
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
import CheckoutShippingPreview from "~/components/CheckoutShippingPreview.vue";
import { useShippingMethods } from "~/composables/useShippingMethods";

const { cart, lineItems, paymentSessions } = storeToRefs(useCartStore());
const { initPaymentSession } = useCartStore();
const cartEdit = ref(cart?.value?.shipping_address === null);

// TODO Run when line items change ??
initPaymentSession();

const { updateShippingMethod, shippingMethods, selectedShippingMethod } =
  useShippingMethods(cart);

const paymentSession = ref(cart?.value?.payment_session?.provider_id);

const setPaymentSession = async (session: string) => {
  const client = useMedusaClient();

  if (cart) {
    await client.carts.setPaymentSession(cart.value.id, {
      provider_id: session,
    });

    paymentSession.value = session;
  }
};
</script>
