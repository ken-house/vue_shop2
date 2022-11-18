import axios from 'axios'
import Vue from 'vue'
import App from './App.vue'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import './plugins/element.js'
import router from './router'
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:8081/api/v1/'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
