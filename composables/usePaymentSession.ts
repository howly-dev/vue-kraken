import { Cart } from "@medusajs/medusa";
import { Ref, UnwrapRef } from "vue";

export const usePaymentSession = (
  cart: Ref<UnwrapRef<Cart>> | Ref<UnwrapRef<UnwrapRef<Cart>>>
) => {
  const providerId = ref(toValue(cart).payment_session?.provider_id ?? "");
  const setPayment = async (
    provider: string,
    setter: (id: string) => Promise<void>
  ) => {
    await setter(toValue(providerId));
    providerId.value = provider;
  };

  return { providerId, setPayment };
};
