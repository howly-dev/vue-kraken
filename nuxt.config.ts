export default defineNuxtConfig({
  modules: ["nuxt-medusa", "@nuxtjs/eslint-module"],
  css: [
    "@/assets/main.scss",
    "primevue/resources/themes/saga-blue/theme.css",
    "primevue/resources/primevue.css",
    "primeicons/primeicons.css",
    "primeflex/primeflex.css",
  ],
  build: {
    transpile: ["primevue"],
  },
  ssr: false,
});
