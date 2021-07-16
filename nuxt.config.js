import { numberFormats } from './configs/currency-format'
import { dateTimeFormats } from './configs/datetime-format'
import { restrictedRoutes } from './configs/restricted-routes'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Shoplex',
    htmlAttrs: { lang: 'en' },
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
    { mode: 'client', src: '~/plugins/utils.js' },
    { mode: 'client', src: '~/plugins/firebase.js' },
    { mode: 'client', src: '~/plugins/vee-validate.js' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: {
    dirs: ['~/components', '~/components/app', '~/components/lib/bootstrap', '~/components/lib/vee-validate'],
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
    // https://firebase.nuxtjs.org/
    '@nuxtjs/firebase',
    // https://github.com/nuxt-community/fontawesome-module
    '@nuxtjs/fontawesome',
    // https://github.com/nuxt-community/robots-module
    '@nuxtjs/robots',
    // https://sitemap.nuxtjs.org
    '@nuxtjs/sitemap',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: false,
    transpile: ['vue-currency-input', 'vee-validate/dist/rules'],

    babel: {
      compact: true,
      presets() {
        return [['@nuxt/babel-preset-app', { corejs: { version: 3 } }]]
      },
    },
  },

  alias: {
    '@fortawesome/pro-solid-svg-icons': 'obit-fa-pro-solid',
    '@fortawesome/pro-light-svg-icons': 'obit-fa-pro-light',
    '@fortawesome/pro-regular-svg-icons': 'obit-fa-pro-regular',
    '@fortawesome/pro-duotone-svg-icons': 'obit-fa-pro-duotone',
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

  vue: { config: { devtools: true } },

  bootstrapVue: {
    css: false,
    bvCss: false,
    icons: false,
  },

  fontawesome: {
    component: 'fa',
    addCss: true,
    suffix: false,
    useLayers: false,
    useLayersText: false,
    icons: {
      brands: true,
      solid: true,
      regular: true,
    },
    proIcons: {
      solid: true,
      light: true,
      regular: true,
      duotone: true,
    },
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
    onLanguageSwitched: (oldLocale, newLocale) => this.$vee.switchLocale(newLocale),
    vueI18n: {
      fallbackLocale: 'en',
      dateTimeFormats,
      numberFormats,
    },
  },

  firebase: {
    config: {
      apiKey: 'AIzaSyBYAGLl-aHRpwHmfZ5KbVD0NUuT8WQ0Gzk',
      authDomain: 'ecommerce-30.firebaseapp.com',
      projectId: 'ecommerce-30',
      storageBucket: 'ecommerce-30.appspot.com',
      messagingSenderId: '64244192584',
      appId: '1:64244192584:web:e2585d4c643d405cb50f7d',
      measurementId: 'G-EZLVFKFMWD',
    },
    services: {
      auth: {
        persistence: 'session',
        initialize: {
          onAuthStateChangedAction: 'auth/onAuthStateChanged',
          subscribeManually: true,
        },
        ssr: false,
        emulatorPort: 9099,
        emulatorHost: 'http://localhost',
      },
      firestore: {
        enablePersistence: { synchronizeTabs: true },
        emulatorPort: 8080,
        emulatorHost: 'localhost',
      },
      functions: false,
      storage: false,
      database: false,
      messaging: false,
      performance: false,
      analytics: false,
      remoteConfig: false,
    },
    injectModule: true,
    terminateDatabasesAfterGenerate: false,
  },

  robots: [{ UserAgent: '*', Disallow: restrictedRoutes }],

  sitemap: {
    hostname: 'http://localhost:3000',
    gzip: true,
    i18n: true,
    exclude: restrictedRoutes,
  },
}
