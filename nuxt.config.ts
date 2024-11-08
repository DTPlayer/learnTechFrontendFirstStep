// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: "fade", mode: "out-in" },
    head: {
      titleTemplate: "JobJuorney",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        {
          hid: "description",
          name: "description",
          content:
            "Ваш новый любимый менеджер задач уже здесь! Интуитивно понятный, чистый и современный менеджер задач, похожий на канбан.",
        },
        {
          name: "keywords",
          content: "Канбан, карточки, менеджер задач",
        },
      ],
    },
  },

  typescript: {
    shim: false,
  },

  ssr: false,

  modules: ["@pinia/nuxt", "@vueuse/nuxt", "@nuxt/ui"],
  compatibilityDate: "2024-10-29",
});