import Vue from 'vue'
import Router from 'vue-router'
import Merged from '@/components/Merged'
import StartPage from '@/components/StartPage'

Vue.use(Router)
export default new Router({
  routes: [{
    path: '/',
    name: 'Merged',
    component: Merged
  }],
  mode: 'history',
})
