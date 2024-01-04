<template>
  <div>
    <div class="text-gray-700">
      <div
        class="flex align-items-center justify-content-between text-base-regular text-gray-900 mb-2"
      >
        <span>Subtotal</span>
        <span>{{ getAmount(subtotal) }}</span>
      </div>
      <div class="flex flex-column row-gap-1">
        <div
          v-if="!!discountTotal"
          class="flex align-items-center justify-content-between"
        >
          <span>Discount</span>
          <span>- {{ getAmount(discountTotal) }}</span>
        </div>
        <div
          v-if="!!giftCardTotal"
          class="flex align-items-center justify-content-between"
        >
          <span>Gift card</span>
          <span>- {{ getAmount(giftCardTotal) }}</span>
        </div>
        <div class="flex align-items-center justify-content-between">
          <span>Shipping</span>
          <span>{{ getAmount(shippingTotal) }}</span>
        </div>
        <div class="flex align-items-center justify-content-between">
          <span>Taxes</span>
          <span>{{ getAmount(taxTotal) }}</span>
        </div>
      </div>
      <div class="border-dashed my-4" />
      <div class="flex align-items-center justify-content-between mb-2">
        <span>Total</span>
        <span>{{ getAmount(total) }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Cart } from "@medusajs/medusa";
import { UnwrapRef } from "vue";
import { formatAmount, FormatAmountParams } from "~/utils/format-price";
import { toRefs } from "#imports";

const props = defineProps<{
  cart: UnwrapRef<Cart> | UnwrapRef<UnwrapRef<Cart>>;
}>();

const {
  subtotal,
  discount_total: discountTotal,
  gift_card_total: giftCardTotal,
  tax_total: taxTotal,
  shipping_total: shippingTotal,
  total,
} = toRefs(props.cart);

const getAmount = (amount: number | null | undefined) => {
  return formatAmount({
    amount: amount || 0,
    region: props.cart.region,
    includeTaxes: false,
  } as FormatAmountParams);
};
</script>
