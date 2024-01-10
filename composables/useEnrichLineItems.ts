import { ref, watchEffect, toValue, Ref, ComputedRef } from "vue";
import { StoreGetProductsParams, LineItem, Product } from "@medusajs/medusa";
import { omit } from "lodash-es";
import { useMedusaClient } from "#imports";

/**
 * A composable function that returns an array of enriched line items.
 * If you pass an array of line items, it will return those line items with enriched data.
 * Otherwise, it will return the line items from the current cart.
 */
const useEnrichedLineItems = (
  lineItems: ComputedRef<LineItem[]>,
  cartId: Ref<string>
) => {
  const client = useMedusaClient();
  const enrichedItems: Ref<Omit<LineItem, "beforeInsert">[]> = ref([]);
  const queryParams = ref({});

  watchEffect(async () => {
    queryParams.value = {
      id: toValue(lineItems).map((lineItem) => lineItem.variant.product_id),
      cart_id: toValue(cartId),
    };

    const { products } = toValue(lineItems).length
      ? await client.products.list(queryParams.value as StoreGetProductsParams)
      : { products: [] };

    enrichedItems.value = [];
    for (const item of toValue(lineItems)) {
      const product = toValue(products).find(
        (p) => p.id === item.variant.product_id
      );

      if (!product) {
        enrichedItems.value.push(item);
        return;
      }
      const variant = product.variants.find((v) => v.id === item.variant_id);

      if (!variant) {
        enrichedItems.value.push(item);
        return;
      }

      enrichedItems.value.push({
        ...item,
        // @ts-ignore
        variant: {
          ...variant,
          product: omit(product, "variants") as Product,
        },
      });
    }
  });

  return enrichedItems;
};

export default useEnrichedLineItems;
