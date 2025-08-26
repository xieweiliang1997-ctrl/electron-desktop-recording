import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import directives from './directives'

import 'normalize.css'

createApp(App).use(router).use(directives).mount('#app')
