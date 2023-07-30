<template>
  <div
    class="w-full h-5rem flex justify-content-between px-4 align-items-center border-bottom-1"
  >
    <div>HOWLY</div>
    <div class="flex">
      <div>ABOUT US</div>
      <div class="mx-4">COLLECTIONS</div>
      <div class="cursor-pointer mr-4" @click="toggleCart">
        CART
        <CartPreview v-model:is-visible="isCartVisible" />
      </div>
      <Dropdown
        v-model="selectedRegion"
        :options="regionOptions"
        option-value="country"
        option-label="label"
        placeholder="Select a Region"
        class="w-full md:w-14rem"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Dropdown from "primevue/dropdown";
import { storeToRefs } from "pinia";
import CartPreview from "~/components/CartPreview.vue";
import { computed, ref } from "#imports";
import { useRegionStore } from "~/store/region";

const { regionOptions, countryCode } = storeToRefs(useRegionStore());
const { setRegion } = useRegionStore();

const selectedRegion = computed({
  get() {
    return countryCode.value;
  },
  set(countryCode: string) {
    const option = regionOptions.value.find(
      ({ country }) => country === countryCode
    );
    setRegion(option.region, option.country);
  },
});

const isCartVisible = ref(false);

const toggleCart = () => {
  isCartVisible.value = !isCartVisible.value;
};
</script>
