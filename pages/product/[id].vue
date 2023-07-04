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
        <template v-for="option in product?.options">
          <SelectButton
            v-model="variant"
            :options="option.values"
            option-label="value"
            option-value="id"
          />
        </template>
        <Button @click="addToCart">Add to cart</Button>
        <div>
          <TabView>
            <TabPanel header="PRODUCT INFORMATION">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </TabPanel>
            <TabPanel header="SHIPPING & RETURNS">
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae
                vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
                voluptas sit aspernatur aut odit aut fugit, sed quia
                consequuntur magni dolores eos qui ratione voluptatem sequi
                nesciunt. Consectetur, adipisci velit, sed quia non numquam eius
                modi.
              </p>
            </TabPanel>
          </TabView>

          <div class="card flex justify-content-center">
            <SelectButton
              v-model="value"
              :options="options"
              aria-labelledby="basic"
            />
          </div>
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
import { ref } from "vue";
import { computed, useAsyncData, useMedusaClient, useRoute } from "#imports";
import { useCartStore } from "~/store/cart";

const value = ref("off");
const options = ref(["Off", "On"]);

const client = useMedusaClient();

const route = useRoute();
const { addLineItem } = useCartStore();
const { data: product } = useAsyncData(
  `product-${route.params.id}`,
  () => client.products.retrieve(route.params?.id as string),
  {
    transform: (data) => {
      return data?.product;
    },
  }
);

const variant = ref(null);

const image = computed(() => product.value?.images[0].url || "");
const images = computed(() => product.value?.images);

const addToCart = () => {
  const item = {
    variant_id: product.value?.variants[0].id as string,
    quantity: 1,
  };
  addLineItem(item);
};
</script>
