import ReactivityTransform from '@vue-macros/reactivity-transform/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/image', '@nuxt/icon', '@nuxt/ui', 'nuxt-vuefire', "@vueuse/nuxt"],
  vite: {
    plugins: [
      ReactivityTransform()
    ]
  },
  vuefire: {
    config: {

      apiKey: "AIzaSyDrMuOiQqSu3zDDn7qAGDndhVZXkUCNvg0",

      authDomain: "espresso-brief.firebaseapp.com",

      projectId: "espresso-brief",

      storageBucket: "espresso-brief.appspot.com",

      messagingSenderId: "378681561139",

      appId: "1:378681561139:web:b597fdbab1523d4e645346"

    }
  }
})