// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    directives: directives,
    components: components,
    icons: { aliases, sets: { mdi } },
    theme: {
        defaultTheme: 'dark'
      }
});

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mount('#app')
