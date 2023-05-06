export default defineNuxtConfig({
  modules: ["nuxt-medusa", "@nuxtjs/eslint-module"],
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
