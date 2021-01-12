import fs from 'fs'
export default {
  // server config
  server: {
    https: {
      key: fs.readFileSync('/etc/ssl/private/matchasigned.key'),
      cert: fs.readFileSync('/etc/ssl/certs/matchasigned.crt')
    }
  },
  ssr: false,
  serverMiddleware: [{handler:"redirect-ssl", redirectPort:8080}],
  // redirectPort: 8080,
  loading: false,
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Matcha',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    script: [
      {src: 'https://kit.fontawesome.com/58266b08e8.js', crossorigin: "anonymous"}
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      { rel: 'stylesheet', href:'https://fonts.googleapis.com/icon?family=Material+Icons'}
    ]
  },
  
  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '@/style/main.scss',
    '@style/main.css'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: ['~/plugins/snoast.js'],
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
    baseURL: process.env.BASE_URL,
    credentials: true
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
