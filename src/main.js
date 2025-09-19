import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import VueScrollTo from './directive/VueScrollTo';



const app = createApp(App);
app.use(VueScrollTo, {
  // container: ".section-container",
  root: 'sections',
  offsetTop: 40,
  a: 1,
  b: 2,
})
app.mount('#app');