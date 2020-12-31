import fs from 'fs'

export default {
  // server config
  server: {
    port: 8080, // default: 3000
    host: '0.0.0.0', // default: localhost
    https: {
      key: fs.readFileSync('/etc/ssl/private/matchasigned.key'),
      cert: fs.readFileSync('/etc/ssl/certs/matchasigned.crt')
    }
  },
  ssr: false,
  serverMiddleware: ["redirect-ssl"],
  loading: false,
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Matcha',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
    ]
  },
  
  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '@/style/main.scss',
    '@style/main.css'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: ['~/plugins/snoast.js', '~/plugins/axios.js'
  ],
  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/buefy
    'nuxt-buefy',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: process.env.BASE_URL
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  },

  watchers: {
    webpack: {
      aggregateTimeout: 300,
      poll: 1000
    }
    }
}
