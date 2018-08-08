import Vue from 'vue';
import Router from 'vue-router';
import Meta from 'vue-meta';
import MergedComp from '@/components/MergedComp';
import StartPage from '@/components/StartPage';
import GlobalFeed from "@/components/Feed/GlobalFeed.vue";
// import SideBar from "@/components/Sidebar/SideBar";

Vue.use(Router);
Vue.use(Meta);
const router = new Router({
  routes: [{
      path: '/',
      name: 'MergedComp',
      component: MergedComp,
      children: [{
          path: 'feeds',
          name: 'GlobalFeed',
          components: {
            gf: GlobalFeed
          }
        },
        //  {
        //   path: 'tasks/:taskID',
        //   name: 'Tasks',
        //   component: SideBar
        // }
      ]
    }, {
      path: '/auth',
      name: 'StartPage',
      component: StartPage
    },
    {
      path: '*',
      component: MergedComp
    }
  ],
  mode: 'history',
});

export default router;
