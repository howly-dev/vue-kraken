<template>
  <div class="surface-300 flex justify-content-center">
    <div class="max-w-24rem">
      <p class="text-4xl font-semibold text-center">
        Your shopping bag is empty
      </p>
      <p class="text-center">
        You don't have anything in your bag. <br />
        Let's change that, use the link below to start browsing our products.
      </p>
      <NuxtLink to="/">
        <Button class="w-full flex justify-content-center mb-7"
          >EXPLORE PRODUCTS</Button
        >
      </NuxtLink>
    </div>
  </div>
</template>
