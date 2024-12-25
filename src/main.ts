import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import VueStarRating from 'vue-star-rating'

const pinia = createPinia()
const app = createApp(App)

app.component('star-rating', VueStarRating.default)

app.use(router).use(pinia).mount('#app')
