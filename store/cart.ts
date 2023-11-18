import { defineStore } from "pinia";
import {
  StoreCartsRes,
  StorePostCartsCartLineItemsReq,
  StorePostCartsCartReq,
} from "@medusajs/medusa";
import { get } from "lodash-es";
import { toValue } from "vue";
import { AddressPayload } from "@medusajs/types";
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
      const { syncRegion, getRegionLocal, deleteRegionLocal } =
        useRegionStore();
      const cartId = this.getCartLocal();

      if (cartId) {
        const { cart }: { cart: Cart } = await client.carts.retrieve(
          cartId as string
        );

        if (!cart || cart.completed_at) {
          this.deleteCartLocal();
          deleteRegionLocal();
          await this.createNewCart();
          return;
        }

        this.cart = cart as any;
        // Argument type Cart is not assignable to parameter type Cart, for real?
        syncRegion(cart as any);
      } else {
        const region = getRegionLocal();
        await this.createNewCart(region?.regionId);
      }
    },
    setCart(cart: Cart) {
      const cartId = useCookie("cart_id", { maxAge: 60 * 60 * 24 * 365 });
      this.cart = cart as any;
      cartId.value = cart.id;
    },
    async createNewCart(regionId?: string) {
      const client = useMedusaClient();
      const { syncRegion } = useRegionStore();

      const { cart } = await client.carts.create({ region_id: regionId });

      this.setCart(cart);
      syncRegion(cart as any);

      return { cart };
    },
    deleteCartLocal() {
      const cartId = useCookie("cart_id", { maxAge: 60 * 60 * 24 * 365 });
      cartId.value = null;
    },
    getCartLocal() {
      const cartId = useCookie("cart_id", { maxAge: 60 * 60 * 24 * 365 });
      return toValue(cartId);
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
    /**
     * Method that sets the addresses and email on the cart.
     */
    async setAddresses(data: AddressPayload & { email?: string }) {
      delete data.email;
      const client = useMedusaClient();
      const payload: StorePostCartsCartReq = {
        shipping_address: { ...data },
      };

      const { cart } = await client.carts.update(this.cartId, payload);
      this.setCart(cart);
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
