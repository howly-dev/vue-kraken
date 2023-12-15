import { Cart, Region } from "@medusajs/medusa";
import { Ref } from "vue";
import { useAsyncData } from "#imports";

export function useShippingMethods(cart: Ref<Cart>) {
  const client = useMedusaClient();
  const { data } = useAsyncData(
    `shipping-options:${cart.value.id}`,
    () => client.shippingOptions.listCartOptions(cart.value.id as string),
    {
      transform: (data) => {
        setDefaultShippingMethod();
        return data.shipping_options;
      },
      default: () => [],
      watch: [cart],
    }
  );

  const shippingMethods = computed(() => {
    if (toValue(data) && toValue(cart)?.region) {
      return toValue(data)?.map((option) => ({
        value: option.id,
        label: option.name,
        price: formatAmount({
          amount: option.amount || 0,
          region: toValue(cart)?.region as Region,
        }),
      }));
    }

    return [];
  });

  const setDefaultShippingMethod = () => {
    selectedShippingMethod.value =
      toValue(cart).shipping_methods[0].shipping_option_id ?? null;
  };

  const updateShippingMethod = async (shippingMethodId: string) => {
    selectedShippingMethod.value = shippingMethodId;

    await client.carts.addShippingMethod(cart?.value?.id as string, {
      option_id: shippingMethodId,
    });
  };

  const selectedShippingMethod: Ref<null | string> = ref(null);

  return {
    shippingMethods,
    updateShippingMethod,
    selectedShippingMethod,
  };
}
