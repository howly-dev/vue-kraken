<template>
  <div class="w-full flex gap-3 my-3">
    <div class="w-4 flex align-items-center">
      <div class="square-img-wrapper bg-black-alpha-10 overflow-hidden">
        <img
          alt="user header"
          :src="lineItem.thumbnail"
          class="min-w-full max-w-full"
        />
      </div>
    </div>
    <div>
      <p class="font-medium">{{ lineItem.title }}</p>
      <div>
        <p
          v-for="variant in variants"
          :key="variant.optionName"
          class="m-0 text-500"
        >
          {{ variant.optionName }} : {{ variant.option }}
        </p>
      </div>
      <p class="mb-2">Quantity: {{ lineItem.quantity }}</p>
    </div>
    <div class="flex flex-column align-items-end justify-content-between">
      <p class="mr-3">{{ lineItem.total }}</p>
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

const props = defineProps<{
  lineItem: LineItem;
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
