import { defineStore } from "pinia";
import {
  StoreCartsRes,
  StorePostCartsCartLineItemsReq,
} from "@medusajs/medusa";
import { get } from "lodash-es/lodash";
import { useCookie, useMedusaClient } from "#imports";

declare type Cart = StoreCartsRes["cart"];
interface CartState {
  cart?: Cart | null;
  cartId: string | null;
}
export const useCartStore = defineStore("cart", {
  state: (): CartState => ({
    cart: null,
    cartId: null,
  }),
  actions: {
    async initCart() {
      const client = useMedusaClient();
      const cartId = useCookie("cart_id", { maxAge: 60 * 60 * 24 * 365 });

      if (!cartId.value) {
        const { cart } = await client.carts.create();
        cartId.value = cart.id;
      } else {
        const { cart } = await client.carts.retrieve(cartId.value as string);
        this.cart = cart as any;
        this.cartId = cart.id;
      }
    },
    pay: () => {},
    startCheckout: () => {},
    completeCheckout: () => {},
    updateCart: () => {},
    addShippingMethod: () => {},
    async addLineItem(item: StorePostCartsCartLineItemsReq) {
      const client = useMedusaClient();
      const cartId = this.cartId;
      const { cart } = await client.carts.lineItems.create(
        cartId as string,
        item
      );

      if (cart) {
        this.cart = cart as any;
      }
    },
    async removeLineItem(itemId: string) {
      const client = useMedusaClient();
      const cartId = this.cartId;
      const { cart } = await client.carts.lineItems.delete(
        cartId as string,
        itemId
      );

      if (cart) {
        this.cart = cart as any;
      }
    },
  },
  getters: {
    lineItems(state) {
      return get(state, ["cart", "items"], []);
    },
  },
});

// setCart: (cart: Cart) => void;
// pay: ReturnType<typeof useSetPaymentSession>;
// createCart: ReturnType<typeof useCreateCart>;
// startCheckout: ReturnType<typeof useCreatePaymentSession>;
// completeCheckout: ReturnType<typeof useCompleteCart>;
// updateCart: ReturnType<typeof useUpdateCart>;
// addShippingMethod: ReturnType<typeof useAddShippingMethodToCart>;
// totalItems: number;

// {
//   variant_id: variantId,
//       quantity: quantity,
// },
