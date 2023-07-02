<template>
  <Dialog
    v-model:visible="visible"
    header="Shopping Bag"
    :style="{ width: '35vw' }"
    position="topright"
    :modal="false"
    :draggable="false"
  >
    <div>
      <div v-for="item in items" :key="item.id">
        <CartPreviewItem
          :line-item="item"
          @line-item:remove="removeLineItem(item.id)"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from "primevue/dialog";
import { storeToRefs } from "pinia";
import { LineItem } from "@medusajs/medusa/dist/models/line-item";
import { useCartStore } from "../store/cart";
import CartPreviewItem from "~/components/CartPreviewItem";
import { computed, toRef } from "#imports";
import useEnrichedLineItems from "~/composables/useEnrichLineItems";

const props = defineProps<{
  isVisible: boolean;
}>();

const emit = defineEmits(["update:is-visible"]);

const visible = computed({
  get() {
    return props.isVisible;
  },
  set(newValue) {
    emit("update:is-visible", newValue);
  },
});

const { cartId, lineItems } = storeToRefs(useCartStore());
const { removeLineItem } = useCartStore();
const items = useEnrichedLineItems(toRef(lineItems) as LineItem[], cartId);
</script>
