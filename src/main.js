import './assets/main.css'

import { createApp } from 'vue'
import { createNotivue } from 'notivue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'notivue/notification.css' // Only needed if using built-in <Notification />
import 'notivue/animations.css' // Only needed if using default animations

const notivue = createNotivue(/* Options */)
const app = createApp(App)

app.use(router)
app.use(store)
app.use(notivue)

app.mount('#app')
