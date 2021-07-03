export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'headless-dashboard',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/scss/main.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/utils.js', mode: 'client' },
    { src: '~/plugins/vee-validate.js', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: {
    dirs: ['~/components', '~/components/app', '~/components/lib/bootstrap'],
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://i18n.nuxtjs.org
    'nuxt-i18n',
    // https://bootstrap-vue.org/
    'bootstrap-vue/nuxt',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: false,
    transpile: ['vue-currency-input'],
  },

  router: {
    extendRoutes(routes, _resolve) {
      for (const route of routes) {
        const authPath = '/auth'
        if (route.path.includes(authPath)) {
          route.path = route.path.substring(authPath.length, route.path.length)
        }
      }
      return routes
    },
  },

  vue: {
    config: {
      devtools: true,
    },
  },

  bootstrapVue: {
    css: false,
    bvCss: false,
    icons: false,
  },

  i18n: {
    baseUrl: 'http://localhost:3000', // important for seo
    locales: [
      { code: 'en', iso: 'en-GB', file: 'en.json', name: 'English' },
      { code: 'ms', iso: 'ms-MY', file: 'ms.json', name: 'Malay' },
      { code: 'zh', iso: 'zh-CN', file: 'zh.json', name: '简体中文' },
    ],
    lazy: true,
    langDir: '~/locales/',
    strategy: 'prefix',
    defaultLocale: 'en',
    detectBrowserLanguage: {
      alwaysRedirect: true,
      fallbackLocale: 'en',
      onlyOnRoot: true,
      useCookie: true,
    },
    seo: false, // performance concern, enable lazily
    vuex: false,
    vueI18n: {
      fallbackLocale: 'en',
      dateTimeFormats: {
        en: {
          short: {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          },
          long: {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            hour: 'numeric',
            minute: 'numeric',
          },
        },
        ms: {
          short: {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          },
          long: {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            hour: 'numeric',
            minute: 'numeric',
          },
        },
        zh: {
          short: {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          },
          long: {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            hour: 'numeric',
            minute: 'numeric',
          },
        },
      },
      numberFormats: {
        en: {
          currency: {
            style: 'currency',
            currency: 'MYR',
            currencyDisplay: 'narrowSymbol',
          },
        },
        ms: {
          currency: {
            style: 'currency',
            currency: 'MYR',
            currencyDisplay: 'narrowSymbol',
          },
        },
        zh: {
          currency: {
            style: 'currency',
            currency: 'MYR',
            currencyDisplay: 'narrowSymbol',
          },
        },
      },
    },
  },
}
