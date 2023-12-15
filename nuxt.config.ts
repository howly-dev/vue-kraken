export default defineNuxtConfig({
  modules: ["nuxt-medusa", "@nuxtjs/eslint-module", "@pinia/nuxt"],
  css: [
    "@/assets/main.scss",
    "@/assets/theme.css",
    "primevue/resources/primevue.min.css",
    "primeicons/primeicons.css",
    "primeflex/primeflex.css",
  ],
  build: {
    transpile: ["primevue"],
  },
  ssr: false,
  vite: {
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    },
  },
});
