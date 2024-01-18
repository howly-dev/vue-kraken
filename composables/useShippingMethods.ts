import { Cart, Region } from "@medusajs/medusa";
import { Ref, UnwrapRef } from "vue";
import { PricedShippingOption } from "@medusajs/medusa/dist/types/pricing";
import { useAsyncData } from "#imports";

export function useShippingMethods(
  cart: Ref<UnwrapRef<Cart>> | Ref<UnwrapRef<UnwrapRef<Cart>>>
) {
  const client = useMedusaClient();

  useAsyncData(
    `shipping-options:${cart.value.id}`,
    () => client.shippingOptions.listCartOptions(cart.value.id as string),
    {
      transform: (data) => {
        transformShippingMethods(data.shipping_options);
        setDefaultShippingMethod();
        return data.shipping_options;
      },
      default: () => [],
      watch: [cart],
    }
  );

  const transformShippingMethods = (data: PricedShippingOption[]) => {
    //  TODO: change so shipping methods is a computed property
    shippingMethods.value = data.map((option) => ({
      value: option.id,
      label: option.name,
      price: formatAmount({
        amount: option.amount || 0,
        region: toValue(cart)?.region as Region,
      }),
    }));
  };

  const shippingMethods: Ref<
    { value: string | undefined; label: string | undefined; price: string }[]
  > = ref([]);

  const setDefaultShippingMethod = () => {
    if (shippingMethods.value.length) {
      selectedShippingMethod.value = toValue(shippingMethods)[0].value ?? null;
    }
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
