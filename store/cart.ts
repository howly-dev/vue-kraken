import { defineStore } from "pinia";
import {
  StoreCartsRes,
  StorePostCartsCartLineItemsReq,
} from "@medusajs/medusa";
import { get } from "lodash-es/lodash";
import { useCookie, useMedusaClient } from "#imports";
import { useRegionStore } from "~/store/region";

declare type Cart = StoreCartsRes["cart"];
interface CartState {
  cart?: Cart;
  cartId: string | null;
}
export const useCartStore = defineStore("cart", {
  state: (): CartState => ({
    cart: {} as Cart,
    cartId: null,
  }),
  actions: {
    async initCart() {
      const client = useMedusaClient();
      const cartId = useCookie("cart_id", { maxAge: 60 * 60 * 24 * 365 });
      const { syncRegion } = useRegionStore();

      if (!cartId.value) {
        // TODO Create with getRegionLocal, move to seperate create cart function
        const { cart } = await client.carts.create();
        cartId.value = cart.id;
      } else {
        const { cart }: { cart: Cart } = await client.carts.retrieve(
          cartId.value as string
        );
        this.cart = cart as any;
        // Argument type Cart is not assignable to parameter type Cart, for real?
        syncRegion(cart as any);
      }
    },
    setCart(cart: Cart) {
      const cartId = useCookie("cart_id", { maxAge: 60 * 60 * 24 * 365 });
      this.cart = cart as any;
      cartId.value = cart.id;
    },
    syncCart() {},
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
    cartId(state) {
      return state?.cart?.id;
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
