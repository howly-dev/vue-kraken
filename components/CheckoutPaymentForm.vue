<template>
  <div class="flex align-items-center">
    <Avatar
      label="3"
      class="mr-2"
      style="background-color: black; color: #ffffff"
      shape="circle"
    />
    <h1>Payment</h1>
  </div>
  <div class="flex-column">
    <div
      v-for="session in paymentSessions"
      :key="session.provider_id"
      class="flex align-items-center my-3"
    >
      <RadioButton
        v-model="modelValue"
        :input-id="session.provider_id"
        name="dynamic"
        :value="session.provider_id"
      />
      <div class="ml-2">
        <div class="font-bold text-sm">
          {{ PaymentInfoMap[session.provider_id].title }}
        </div>
        <div>
          {{ PaymentInfoMap[session.provider_id].description }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Avatar from "primevue/avatar";
import { PaymentSession } from "@medusajs/medusa/dist/models/payment-session";
import RadioButton from "primevue/radiobutton";

defineProps<{
  paymentSessions: PaymentSession[];
  selectedPaymentSession: PaymentSession | null;
}>();

const PaymentInfoMap: Record<string, { title: string; description: string }> = {
  stripe: {
    title: "Credit card",
    description: "Secure payment with credit card",
  },
  "stripe-ideal": {
    title: "iDEAL",
    description: "Secure payment with iDEAL",
  },
  paypal: {
    title: "PayPal",
    description: "Secure payment with PayPal",
  },
  manual: {
    title: "Test payment",
    description: "Test payment using medusa-payment-manual",
  },
};

const modelValue = defineModel();
</script>
