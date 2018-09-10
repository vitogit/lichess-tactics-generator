import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource';

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.use(Buefy)
Vue.use(VueResource)

new Vue({
  el: '#app',
  render: h => h(App)
})
