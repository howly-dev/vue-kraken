<template>
  <div class="w-full flex gap-3 my-3">
    <div class="w-13rem flex align-items-center">
      <div class="square-img-wrapper bg-black-alpha-10 overflow-hidden">
        <img
          alt="user header"
          :src="lineItem.thumbnail"
          class="min-w-full max-w-full"
        />
      </div>
    </div>
    <div class="flex flex-column">
      <p class="font-medium">{{ lineItem.title }}</p>
      <div>
        <p
          v-for="variant in variants"
          :key="variant.optionName"
          class="m-0 text-500 text-sm"
        >
          {{ variant.optionName }} : {{ variant.option }}
        </p>
      </div>
      <p class="mt-auto mb-2 text-sm">Quantity: {{ lineItem.quantity }}</p>
    </div>
    <div
      class="flex flex-column align-items-end justify-content-between ml-auto"
    >
      <p class="mr-3">
        <CartPreviewItemPrice :item="lineItem" :region="cart.region" />
      </p>
      <Button
        class="cursor-pointer"
        label="Remove"
        plain
        text
        icon="pi pi-trash"
        size="small"
        @click="removeLineItem(lineItem.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { LineItem } from "@medusajs/medusa";
import Button from "primevue/button";
import { computed } from "#imports";
import CartPreviewItemPrice from "~/components/CartPreviewItemPrice.vue";
import { useCartStore } from "~/store/cart";

const { cart } = useCartStore();

const props = defineProps<{
  lineItem: Omit<LineItem, "beforeInsert">;
}>();

const emit = defineEmits(["lineItem:remove"]);

const variants = computed(() => {
  return props.lineItem.variant.options.map((option) => {
    return {
      optionName:
        props.lineItem.variant.product.options.find(
          (opt) => opt.id === option.option_id
        )?.title || "Option",
      option: option.value,
    };
  });
});

const removeLineItem = (id: string) => {
  emit("lineItem:remove", id);
};
</script>
