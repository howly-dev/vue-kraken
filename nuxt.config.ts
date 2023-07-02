export default defineNuxtConfig({
  modules: ["nuxt-medusa", "@nuxtjs/eslint-module", "@pinia/nuxt"],
  css: [
    "@/assets/main.scss",
    "@/assets/theme.css",
    "primeicons/primeicons.css",
    "primeflex/primeflex.css",
  ],
  build: {
    transpile: ["primevue"],
  },
  ssr: false,
});
