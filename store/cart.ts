import { defineStore } from "pinia";
import {
  StoreCartsRes,
  StorePostCartsCartLineItemsReq,
  StorePostCartsCartReq,
} from "@medusajs/medusa";
import { get } from "lodash-es";
import { toValue } from "vue";
import { AddressPayload } from "@medusajs/types";
import { PaymentSession } from "@medusajs/medusa/dist/models/payment-session";
import { LineItem } from "@medusajs/medusa/dist/models/line-item";
import { useCookie, useMedusaClient } from "#imports";
import { useRegionStore } from "~/store/region";

declare type Cart = StoreCartsRes["cart"];
interface CartState {
  cart: Cart;
}
export const useCartStore = defineStore("cart", {
  state: (): CartState => ({
    cart: {} as Cart,
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

        this.cart = cart;
        // Argument type Cart is not assignable to parameter type Cart, for real?
        syncRegion(cart);
      } else {
        const region = getRegionLocal();
        await this.createNewCart(region?.regionId);
      }
    },
    setCart(cart: Cart) {
      const cartId = useCookie("cart_id", { maxAge: 60 * 60 * 24 * 365 });
      this.cart = cart;
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
    async resetCart() {
      const { getRegionLocal } = useRegionStore();

      this.deleteCartLocal();
      const savedRegion = getRegionLocal();
      await this.createNewCart(savedRegion?.regionId);
    },
    deleteCartLocal() {
      const cartId = useCookie("cart_id", { maxAge: 60 * 60 * 24 * 365 });
      cartId.value = null;
    },
    getCartLocal() {
      const cartId = useCookie("cart_id", { maxAge: 60 * 60 * 24 * 365 });
      return toValue(cartId);
    },
    addShippingMethod: () => {},
    async addLineItem(item: StorePostCartsCartLineItemsReq) {
      const client = useMedusaClient();
      const cartId = this.cartId;
      const { cart } = await client.carts.lineItems.create(
        cartId as string,
        item
      );

      if (cart) {
        this.cart = cart;
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
        this.cart = cart;
      }
    },
    async setAddresses(data: AddressPayload, email: string) {
      const client = useMedusaClient();
      const payload: StorePostCartsCartReq = {
        email,
        shipping_address: { ...data },
      };

      const { cart } = await client.carts.update(
        this.cartId as string,
        payload
      );
      this.setCart(cart);
    },
    async initPaymentSession() {
      const client = useMedusaClient();
      if (
        this.cart?.id &&
        !this.cart.payment_sessions?.length &&
        this.cart?.items?.length
      ) {
        const { cart } = await client.carts.createPaymentSessions(
          this.cart?.id as string
        );

        if (!cart) {
          setTimeout(this.initPaymentSession, 500);
        } else {
          this.setCart(cart);
        }
      }
    },
    async setPaymentSession(providerId: string) {
      const client = useMedusaClient();

      if (this.cart) {
        const { cart } = await client.carts.setPaymentSession(
          this.cart.id as string,
          {
            provider_id: providerId,
          }
        );
        this.setCart(cart);
      }
    },
    async completeCart() {
      const client = useMedusaClient();
      const router = useRouter();
      const { data } = await client.carts.complete(this.cart.id as string);
      await this.resetCart();
      await router.push(`order/confirmed/${data.id}`);
    },
  },
  getters: {
    lineItems(state) {
      return get(state, ["cart", "items"], []) as LineItem[];
    },
    paymentSessions(state) {
      return get(state, ["cart", "payment_sessions"], []) as PaymentSession[];
    },
    cartId(state) {
      return state.cart.id ?? null;
    },
    readyToComplete(state) {
      // TODO add billing address condition
      return (
        !!state.cart &&
        !!state.cart.email &&
        !!state.cart.shipping_address &&
        !!state.cart.payment_session &&
        state.cart.shipping_methods?.length > 0
      );
    },
  },
});
