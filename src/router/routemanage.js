import {
  store
} from "@/store/index.js";
import router from '@/router/index.js';

export const routejs = {

  check() {
    let locat = window.location.pathname;
    // console.log(locat);
    if (locat.startsWith("/feeds")) {
      store.commit("showGlobalFeed", true);
    } 
    else if (locat.startsWith("/tasks/")) {
      let taskID = locat.replace('/tasks/', '');
      // console.log(taskID)
      store.commit('taskLinked',true);  
      
      
      store.commit("setTabIndex", 1);
      store.commit("setSidebarItemSelection", {
        tabIndex: 1,
        id: parseInt(taskID)
      });
    }
    // IMPROVE ROUTER
  },

  redirectToLoginPage() {
    // console.log('Redirected to login page');
    router.push("/auth");
  },

  checkSession(response) {
    // message: "You are not logged in."
    // console.log(response);
    if (response.data.message === "You are not logged in.") {
      // console.log('Session run out');
      // console.log(response);
      this.redirectToLoginPage();
    } else {
      return response;
    }
  },
};
