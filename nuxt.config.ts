// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    css: [
        "@/assets/main.scss",
        'primevue/resources/themes/saga-blue/theme.css',
        'primevue/resources/primevue.css',
        'primeicons/primeicons.css',
        'primeflex/primeflex.css'
    ],
    build: {
        transpile: ['primevue']
    },
    modules: ['nuxt-medusa'],
    ssr: false
})
