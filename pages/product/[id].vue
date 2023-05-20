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
        <h1 class="text-4xl">{{ product?.title }}</h1>
        <p>{{ product?.description }}</p>
        <div>Select Size</div>
        <div>Select Color</div>
        <Button>Add to cart</Button>
        <div>
          <div>Information Component</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Carousel from "primevue/carousel";
import { computed, useAsyncData, useMedusaClient, useRoute } from "#imports";

const client = useMedusaClient();

const route = useRoute();
const { data: product } = useAsyncData(
  `product-${route.params.id}`,
  () => client.products.retrieve(route.params?.id as string),
  {
    transform: (data) => {
      console.log(data);
      return data?.product;
    },
  }
);

const image = computed(() => product.value?.images[0].url || "");
const images = computed(() => product.value?.images);
</script>
