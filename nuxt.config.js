import { numberFormats } from './configs/currency-format'
import { dateTimeFormats } from './configs/datetime-format'
import { restrictedRoutes } from './configs/restricted-routes'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // override public config if ssr mode
  privateRuntimeConfig: {},

  publicRuntimeConfig: {
    baseUrl: process.env.BASE_URL,
    brandName: 'Shoplex',
    supportMail: 'support@shoplex.com',
    gdb: process.env.GEO_DB,
  },

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
    { mode: 'client', src: '~/plugins/i18n.js' },
    { mode: 'client', src: '~/plugins/dayjs.js' },
    { mode: 'client', src: '~/plugins/debug.js' },
    { mode: 'client', src: '~/plugins/utils.js' },
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
    // https://axios.nuxtjs.org/setup
    '@nuxtjs/axios',
    // https://github.com/harlan-zw/nuxt-build-optimisations
    'nuxt-build-optimisations',
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

  generate: { dir: 'public' },

  vue: { config: { devtools: true } },

  axios: { retry: true },

  bootstrapVue: { css: false, bvCss: false, icons: false },

  buildOptimisations: {
    profile: process.env.NODE_ENV === 'development' ? 'risky' : 'experimental',
  },

  fontawesome: {
    component: 'fa',
    addCss: true,
    suffix: false,
    useLayers: false,
    useLayersText: false,
    icons: { brands: true, solid: true, regular: true },
    proIcons: { solid: true, light: true, regular: true, duotone: true },
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
        emulatorPort: process.env.NODE_ENV === 'development' ? 9099 : undefined,
      },
      firestore: {
        enablePersistence: { synchronizeTabs: true },
        emulatorPort: process.env.NODE_ENV === 'development' ? 8080 : undefined,
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

  i18n: {
    baseUrl: process.env.BASE_URL, // important for seo
    locales: [
      { code: 'en', iso: 'en-gb', file: 'en.json', name: 'English' },
      { code: 'ms', iso: 'ms-my', file: 'ms.json', name: 'Malay' },
      { code: 'zh', iso: 'zh-cn', file: 'zh.json', name: '简体中文' },
    ],
    lazy: true,
    langDir: '~/locales/',
    strategy: 'prefix',
    defaultLocale: 'en',
    detectBrowserLanguage: { alwaysRedirect: false, fallbackLocale: 'en', onlyOnRoot: true, useCookie: true },
    seo: false, // performance concern, enable lazily
    vuex: false,
    vueI18n: { fallbackLocale: 'en', dateTimeFormats, numberFormats },
  },

  robots: [{ UserAgent: '*', Disallow: restrictedRoutes }],

  sitemap: {
    hostname: process.env.BASE_URL,
    gzip: true,
    i18n: true,
    exclude: restrictedRoutes,
  },
}
