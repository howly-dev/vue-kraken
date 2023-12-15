<template>
  <div class="flex align-items-center">
    <Avatar
      label="2"
      class="mr-2"
      style="background-color: black; color: #ffffff"
      shape="circle"
    />
    <h1>Delivery</h1>
  </div>
  <div class="flex-column">
    <div
      v-for="method in shippingMethods"
      :key="method.value"
      class="flex align-items-center my-3"
    >
      <RadioButton
        v-model="modelValue"
        :input-id="method.value"
        name="dynamic"
        :value="method.value"
      />
      <label :for="method.value" class="ml-2">{{
        `${method.price} -- ${method.label}`
      }}</label>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Avatar from "primevue/avatar";
import RadioButton from "primevue/radiobutton";

type ShippingOption = {
  value: string;
  label: string;
  price: string;
};

defineProps<{
  shippingMethods: ShippingOption[];
}>();

const modelValue = defineModel();
</script>
