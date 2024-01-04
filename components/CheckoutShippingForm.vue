<template>
  <div class="flex align-items-center">
    <Avatar
      label="1"
      class="mr-2"
      style="background-color: black; color: #ffffff"
      shape="circle"
    />
    <h1>Shipping Address</h1>
  </div>
  <div class="formgrid grid">
    <div class="field col-12">
      <InputText
        v-model="formData.email"
        type="text"
        placeholder="Email"
        class="w-full"
      />
    </div>
    <div class="field col-12">
      <InputText
        v-model="formData.first_name"
        type="text"
        placeholder="First Name"
        class="w-full"
      />
    </div>
    <div class="field col-12">
      <InputText
        v-model="formData.last_name"
        type="text"
        placeholder="Last Name"
        class="w-full"
      />
    </div>
    <div class="field col-12">
      <InputText
        v-model="formData.company"
        type="text"
        placeholder="Company"
        class="w-full"
      />
    </div>
    <div class="field col-12">
      <InputText
        v-model="formData.address_1"
        type="text"
        placeholder="Address"
        class="w-full"
      />
    </div>
    <div class="field col-4">
      <InputText
        v-model="formData.postal_code"
        type="text"
        placeholder="Postal Code"
        class="w-full"
      />
    </div>
    <div class="field col-8">
      <InputText
        v-model="formData.city"
        type="text"
        placeholder="City"
        class="w-full"
      />
    </div>
    <div class="field col-12">
      <InputText
        v-model="formData.country_code"
        type="text"
        placeholder="Country"
        class="w-full"
      />
    </div>
    <div class="field col-12">
      <InputText
        v-model="formData.province"
        type="text"
        placeholder="State / Province"
        class="w-full"
      />
    </div>
    <div class="field col-12">
      <InputText
        v-model="formData.phone"
        type="text"
        placeholder="Phone"
        class="w-full"
      />
    </div>
  </div>
  <Button class="my-4" @click="handleSubmit">Save</Button>
</template>
<script lang="ts" setup>
import InputText from "primevue/inputtext";
import Avatar from "primevue/avatar";
import { Cart } from "@medusajs/medusa";
import { UnwrapRef } from "vue";
import { reactive } from "#imports";
import { useCartStore } from "~/store/cart";

const props = defineProps<{
  cart: UnwrapRef<Cart> | UnwrapRef<UnwrapRef<Cart>> | undefined | null;
  modelValue: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const defaultFormData = () => ({
  email: props.cart?.email ?? "",
  company: props.cart?.shipping_address?.company ?? "",
  first_name: props.cart?.shipping_address?.first_name ?? "",
  last_name: props.cart?.shipping_address?.last_name ?? "",
  address_1: props.cart?.shipping_address?.address_1 ?? "",
  address_2: props.cart?.shipping_address?.address_2 ?? "",
  city: props.cart?.shipping_address?.city ?? "",
  country_code: props.cart?.shipping_address?.country_code ?? "",
  province: props.cart?.shipping_address?.province ?? "",
  postal_code: props.cart?.shipping_address?.postal_code ?? "",
  phone: props.cart?.shipping_address?.phone ?? "",
});

const formData = reactive(defaultFormData());

const handleSubmit = () => {
  const { email, ...addressPayload } = formData;
  setAddresses(addressPayload, email);
  emit("update:modelValue", false);
};

const { setAddresses } = useCartStore();
</script>
