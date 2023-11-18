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
        v-model="formData.country_code"
        type="text"
        placeholder="Phone"
        class="w-full"
      />
    </div>
  </div>
  <Button class="my-4" @click="handleSubmit"> Continue to delivery </Button>
</template>
<script lang="ts" setup>
import InputText from "primevue/inputtext";
import Avatar from "primevue/avatar";
import { reactive } from "#imports";
import { useCartStore } from "~/store/cart";

const defaultFormData = () => ({
  email: "",
  company: "",
  first_name: "",
  last_name: "",
  address_1: "",
  address_2: "",
  city: "",
  country_code: "",
  province: "",
  postal_code: "",
  phone: "",
});

const formData = reactive(defaultFormData());

const handleSubmit = () => {
  setAddresses(formData);
};

const { setAddresses } = useCartStore();
</script>
