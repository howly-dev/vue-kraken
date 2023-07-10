<template>
  <div class="container mt-7">
    <div class="flex px-5">
      <div class="flex-column flex-1 align-items-center">
        <div class="square-img-wrapper bg-black-alpha-10 overflow-hidden">
          <img
            alt="user header"
            :src="image"
            class="min-w-full max-w-full flex-shrink-0"
          />
        </div>
        <Carousel
          :value="images"
          :num-visible="3"
          :num-scroll="3"
          :show-indicators="false"
          class="mt-3"
        >
          <template #item="slotProps">
            <img :src="slotProps.url" class="w-3 shadow-2" />
          </template>
        </Carousel>
      </div>
      <div class="flex-column flex-1 ml-7">
        <h1 class="text-4xl font-normal">{{ product?.title }}</h1>
        <p class="text-2xl font-light">{{ product?.description }}</p>
        <div class="my-6">
          <template v-for="option in product?.options" :key="option.id">
            <div>
              <label :for="'variant_' + option.title" class="text-sm">
                {{ option.title }}
              </label>
              <SelectButton
                :id="'variant_' + option.title"
                v-model="variant"
                class="mt-2"
                :options="option.values"
                option-label="value"
                option-value="variant_id"
              />
            </div>
          </template>
        </div>
        <p class="text-3xl mt-6 mb-5">
          <template v-if="selectedPrice">
            <template v-if="selectedPrice.priceType === 'sale'">
              <s class="text-color-secondary mr-4">{{
                selectedPrice.originalPrice
              }}</s>
              <span>{{ selectedPrice.calculatedPrice }}</span>
            </template>
            <template v-else>
              {{ selectedPrice.calculatedPrice }}
            </template>
          </template>
        </p>
        <Button
          class="w-full flex justify-content-center mb-7"
          :disabled="addToCartDisabled"
          @click="addToCart"
          >Add to cart</Button
        >
        <div>
          <TabView>
            <TabPanel header="PRODUCT INFORMATION">
              <div class="grid">
                <div class="col-6">
                  <span class="font-semibold">Material</span>
                  <p>{{ product?.material ? product.material : "-" }}</p>
                </div>
                <div class="col-6">
                  <span class="font-semibold">Country of origin</span>
                  <p>
                    {{ product?.origin_country ? product.origin_country : "-" }}
                  </p>
                </div>
                <div class="col-6">
                  <span class="font-semibold">Type</span>
                  <p>{{ product?.type ? product.type.value : "-" }}</p>
                </div>
                <div class="col-6">
                  <span class="font-semibold">Weight</span>
                  <p>{{ product?.weight ? `${product.weight} g` : "-" }}</p>
                </div>
                <div class="col-6">
                  <span class="font-semibold">Dimensions</span>
                  <p>
                    {{
                      product?.length && product?.width && product?.height
                        ? `${product.length}L x ${product.width}W x ${product.height}H`
                        : "-"
                    }}
                  </p>
                </div>
              </div>
            </TabPanel>
            <TabPanel header="SHIPPING & RETURNS">
              <div class="">
                <div>
                  <div>
                    <span class="font-semibold">Fast delivery</span>
                    <p>
                      Your package will arrive in 3-5 business days at your pick
                      up location or in the comfort of your home.
                    </p>
                  </div>
                </div>
                <div class="flex items-start gap-x-2">
                  <div>
                    <span class="font-semibold">Simple exchanges</span>
                    <p>
                      Is the fit not quite right? No worries - we&apos;ll
                      exchange your product for a new one.
                    </p>
                  </div>
                </div>
                <div>
                  <div>
                    <span class="font-semibold">Easy returns</span>
                    <p>
                      Just return your product and we&apos;ll refund your money.
                      No questions asked – we&apos;ll do our best to make sure
                      your return is hassle-free.
                    </p>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabView>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Carousel from "primevue/carousel";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import SelectButton from "primevue/selectbutton";
import { ref, toValue } from "vue";
import { storeToRefs } from "pinia";
import { computed, useAsyncData, useMedusaClient, useRoute } from "#imports";
import { useCartStore } from "~/store/cart";
import { useProductPrice } from "~/composables/useProductPrice";

const client = useMedusaClient();
const { addLineItem, cartId } = useCartStore();
const { cart } = storeToRefs(useCartStore());
const variant = ref(null);

const route = useRoute();
const { data: product } = useAsyncData(
  `product-${route.params.id}`,
  () => client.products.retrieve(`${route.params?.id}?cart_id=${cartId}`),
  {
    transform: (data) => {
      return data?.product;
    },
  }
);
const price = useProductPrice(product, variant, cart);
const selectedPrice = computed(() => {
  const { variantPrice, cheapestPrice } = price;
  return toValue(variantPrice) || toValue(cheapestPrice) || null;
});

const image = computed(() => product.value?.images?.[0].url || "");
const images = computed(() => product.value?.images);

const addToCartDisabled = computed(() => variant.value === null);

const addToCart = () => {
  const item = {
    variant_id: variant.value as string,
    quantity: 1,
  };
  addLineItem(item);
};
</script>
