// https://nuxt.com/docs/api/configuration/nuxt-config
import Material from '@primevue/themes/material';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@primevue/nuxt-module'],
  css: ['./assets/css/main.css'],
  primevue: {
    options: {
      theme: {
        preset: Material
      }
    }
  }
})