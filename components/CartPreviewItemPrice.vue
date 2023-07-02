<template>
  <span>{{ price }}</span>
</template>

<script setup lang="ts">
// TODO need to add reduced price
import { LineItem } from "@medusajs/medusa";
import { formatAmount, RegionInfo } from "~/utils/format-price";

type LineItemPriceProps = {
  item: Omit<LineItem, "beforeInsert">;
  region: RegionInfo;
};

const props = defineProps<LineItemPriceProps>();

const price = formatAmount({
  amount: props.item.total,
  region: props.region,
  includeTaxes: false,
});
</script>
