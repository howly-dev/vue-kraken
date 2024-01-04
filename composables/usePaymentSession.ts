import { Cart } from "@medusajs/medusa";
import { Ref } from "vue";

export const usePaymentSession = (cart: Readonly<Ref<Cart>>) => {
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
