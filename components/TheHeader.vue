<template>
  <div
    class="w-full h-5rem flex justify-content-between px-4 align-items-center border-bottom-1"
  >
    <div>HOWLY</div>
    <div class="flex">
      <div>ABOUT US</div>
      <div class="mx-4">COLLECTIONS</div>
      <div class="cursor-pointer" @click="toggleCart">
        CART
        <CartPreview v-model:is-visible="isCartVisible" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "#imports";
import CartPreview from "~/components/CartPreview.vue";

const isCartVisible = ref(false);

const toggleCart = () => {
  isCartVisible.value = !isCartVisible.value;
};
</script>

<style scoped></style>
