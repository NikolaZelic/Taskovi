import Vue from 'vue';
import Router from 'vue-router';
import Meta from 'vue-meta';
import MergedComp from '@/components/MergedComp';
import StartPage from '@/components/StartPage';
import GlobalFeed from "@/components/Feed/GlobalFeed.vue";
// REMOVE BELOW IN FINAL
import UserOptions from '@/components/Misc/UserOptions.vue';
import TaskAdd from '@/components/Content/Task/TaskAdd';
import StepAdd from '@/components/Content/Task/StepAdd';
// import TaskView2 from '@/components/Content/Task/TaskView2';

import TestForm from '@/components/TEST_COMPS/TestForm';


Vue.use(Router);
Vue.use(Meta);
export default new Router({
  routes: [{
      path: '/',
      name: 'MergedComp',
      component: MergedComp,
      children: [{
        path: 'user',
        name: 'UserOptions',
        components: {
          uo: UserOptions
        },
      }, {
        path: 'feeds',
        name: 'GlobalFeed',
        components: {
          gf: GlobalFeed
        }
      }, ]
    }, {
      path: '/auth',
      name: 'StartPage',
      component: StartPage
    }, {
      path: '/taskadd',
      component: TaskAdd
    }, {
      path: '/stepadd',
      component: StepAdd
    }, {
      path: '/testform',
      component: TestForm
    },
    {
      path: '*',
      component: StartPage
    }
  ],
  mode: 'history',
});
