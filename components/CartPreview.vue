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
      <div v-if="!items.length" class="my-4">Cart is empty</div>
      <Button
        class="w-full flex justify-content-center mb-7"
        @click="redirectToCart"
        >Go to checkout</Button
      >
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from "primevue/dialog";
import { storeToRefs } from "pinia";
import { LineItem } from "@medusajs/medusa/dist/models/line-item";
import { useCartStore } from "../store/cart";
import CartPreviewItem from "~/components/CartPreviewItem";
import { computed, toRef, useRouter } from "#imports";
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
const router = useRouter();
const { removeLineItem } = useCartStore();
const items = useEnrichedLineItems(toRef(lineItems) as LineItem[], cartId);

const redirectToCart = () => {
  visible.value = false;
  router.push({ path: "/cart" });
};
</script>
