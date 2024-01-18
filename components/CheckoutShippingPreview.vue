<script setup lang="ts">
import Button from "primevue/button";
import { Address } from "@medusajs/medusa";

const props = defineProps<{
  shippingAddress: Address | undefined | null;
  email: string | undefined;
  modelValue: boolean;
}>();

defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="grid">
    <div class="col-12">
      {{
        `${props.shippingAddress?.first_name} ${props.shippingAddress?.last_name}`
      }}
    </div>
    <div class="col-12">
      {{
        `${props.shippingAddress?.address_1} ${props.shippingAddress?.address_2}`
      }}
    </div>
    <div class="col-12">
      {{
        `${props.shippingAddress?.postal_code}, ${props.shippingAddress?.city}`
      }}
    </div>

    <div class="col-12">
      {{
        `${props.shippingAddress?.province} ${props.shippingAddress?.country_code}`.toUpperCase()
      }}
    </div>
    <div class="col-12">
      {{ `${props.shippingAddress?.phone}` }}
    </div>
  </div>
  <Button class="my-4" @click="$emit('update:modelValue', true)">
    Edit delivery details
  </Button>
</template>
