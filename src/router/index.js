import Vue from 'vue';
import Router from 'vue-router';
import MergedComp from '@/components/MergedComp';
import StartPage from '@/components/StartPage';
// REMOVE BELOW IN FINAL
import UserOptions from '@/components/Misc/UserOptions.vue';
import TaskAdd from '@/components/Content/Task/TaskAdd';
import StepAdd from '@/components/Content/Task/StepAdd';
import StepView from '@/components/Content/Task/StepView';

Vue.use(Router);
export default new Router({
  routes: [{
    path: '/',
    name: 'MergedComp',
    component: MergedComp,
    children: [{
      path: 'user',
      name: 'UserOptions',
      component: UserOptions,
    }]
  }, {
    path: '/auth',
    name: 'StartPage',
    component: StartPage
  }, {
    path: '*',
    component: StartPage
  }, {
    path: '/taskadd',
    component: TaskAdd
  }, {
    path: '/stepadd',
    component: StepAdd
  },

  {
    path: '/stepview',
    component: StepView
  }


],
  mode: 'history',
});
