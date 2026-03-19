export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/motion/nuxt',
  ],

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
      stripePublicKey: process.env.NUXT_PUBLIC_STRIPE_PUBLIC_KEY || '',
    },
  },

  app: {
    head: {
      title: 'SlotyBook — Prise de RDV en ligne',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Plateforme de prise de rendez-vous en ligne pour professionnels indépendants.' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap' },
      ],
    },
  },

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  tailwindcss: {
    configPath: '~/tailwind.config.ts',
    cssPath: '~/assets/css/main.css',
  },

  typescript: {
    strict: true,
  },
})
