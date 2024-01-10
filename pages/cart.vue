<template>
  <div class="container mt-7">
    <CartEmpty v-if="isCartEmpty" />
    <NuxtLayout v-if="!isCartEmpty" name="checkout">
      <template #main>
        <p class="font-bold text-3xl">Shopping Bag</p>
        <hr />
        <div v-for="item in items" :key="item.id">
          <CartPreviewItem
            class="h-14rem"
            :line-item="item"
            @line-item:remove="removeLineItem(item.id)"
          />
        </div>
      </template>
      <template #sidebar>
        <CheckoutSummary :cart="cart" />
        <Button
          class="w-full flex justify-content-center mb-7"
          @click="router.push({ path: '/checkout' })"
          >Go to checkout</Button
        >
      </template>
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useCartStore } from "~/store/cart";
import useEnrichedLineItems from "~/composables/useEnrichLineItems";
import { toRef, useRouter } from "#imports";
import CheckoutSummary from "~/components/CheckoutSummary.vue";

const { lineItems, cartId, cart, isCartEmpty } = storeToRefs(useCartStore());
const router = useRouter();
const { removeLineItem } = useCartStore();
const items = useEnrichedLineItems(toRef(lineItems), cartId);
</script>
