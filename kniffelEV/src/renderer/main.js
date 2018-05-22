import 'vuetify/dist/vuetify.min.css'; // in src-folder
import Vue from 'vue'
import Vuetify from 'vuetify'; // need both, the css and this...for whatever dumb reason
import axios from 'axios'
import colors from 'vuetify/es5/util/colors'
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader



import App from './App'
import router from './router'
import store from './store'

Vue.use(Vuetify, {
  theme: {
    primary: colors.purple.base,
    secondary: colors.grey.darken1,
    accent: colors.shades.black,
    error: colors.red.accent3
  }
});

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>',
}).$mount('#app')
