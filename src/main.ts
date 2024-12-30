import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
// import { DynamicScroller } from 'vue-virtual-scroller'

const pinia = createPinia()
const app = createApp(App)
// app.component('DynamicScroller', DynamicScroller)

app.use(router).use(pinia).mount('#app')
