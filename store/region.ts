import { defineStore } from "pinia";
import { toValue } from "vue";
import { Cart, Region } from "@medusajs/medusa";
import { useCookie, useMedusaClient } from "#imports";
import { useCartStore } from "~/store/cart";

interface RegionState {
  countryCode: string | null;
  regions: Region[];
}

export const useRegionStore = defineStore("region", {
  state: (): RegionState => ({
    countryCode: null,
    regions: [],
  }),
  actions: {
    async fetchRegions() {
      const client = useMedusaClient();
      const { regions } = await client.regions.list();
      this.regions = regions as any;
    },
    async setRegion(regionId: string, countryCode: string) {
      const client = useMedusaClient();
      const { cartId, setCart } = useCartStore();
      const { cart } = await client.carts.update(cartId as string, {
        region_id: regionId,
      });
      setCart(cart);
      this.setRegionLocal(regionId, countryCode);
      this.countryCode = countryCode;
    },
    setRegionLocal(regionId: string, countryCode: string) {
      const region = useCookie("region", { maxAge: 60 * 60 * 24 * 365 });
      region.value = JSON.stringify({ regionId, countryCode });
    },
    getRegionLocal() {
      const region: Ref<{ regionId: string; countryCode: string }> = useCookie(
        "region",
        { maxAge: 60 * 60 * 24 * 365 }
      );
      return toValue(region) ?? null;
    },
    deleteRegionLocal() {
      const region = useCookie("region", { maxAge: 60 * 60 * 24 * 365 });
      region.value = null;
    },
    syncRegion(cart: Omit<Cart, "refundable_amount" | "refunded_total">) {
      const cartRegion = {
        regionId: cart.region.id,
        countryCode: cart.region.countries[0].iso_2,
      };

      // function retrieves the region data (regionId and countryCode) from local storage, if available.
      // If there is no previously stored region data, the function sets default values for regionId and
      // countryCode using the provided cart.
      const { regionId, countryCode } = this.getRegionLocal() || cartRegion;

      // The function compares the regionId obtained from local storage (or default) with the cart.region.id passed
      // as an argument to the syncRegion function. If they are not the same, it means that the cart's region
      // and the user's selected region are different, and an update is needed.
      if (regionId !== cart.region.id) {
        this.setRegion(cart.region.id, countryCode);
      }
      this.setRegionLocal(regionId, countryCode);
      this.countryCode = countryCode;
    },
  },
  getters: {
    regionOptions(state): { country: string; region: string; label: string }[] {
      return state.regions
        ?.map((r) => {
          return r.countries.map((c) => ({
            country: c.iso_2,
            region: r.id,
            label: c.display_name,
          }));
        })
        .flat();
    },
  },
});
