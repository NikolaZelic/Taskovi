import {
  store
} from "@/store/index.js";
import router from '@/router/index.js';

export const routejs = {

  check(dNum) {
    let locat = window.location.pathname;
    if (locat.startsWith("/feeds") && dNum === 1) {
      store.commit("showGlobalFeed", true);
    } else if (locat.startsWith("/tasks/") && dNum === 2) {
      let taskID = locat.replace('/tasks/', '');
      store.commit('taskLinked', true);
      store.commit("setTabIndex", 1);
      store.commit("setSidebarItemSelection", {
        tabIndex: 1,
        id: parseInt(taskID)
      });
    }
  },

  redirectToLoginPage() {
    router.push("/auth");
  },

  checkSession(response) {
    if (response.data.message === "You are not logged in.") {
      this.redirectToLoginPage();
    } else if (response.data.status === "ERR") {
      let message = response.data.message;
      if (message === undefined || message === null || message.length === 0)
        message = "Error happen on server";
      store.commit("modalError", {
        message: '' + message,
      });
    } else {
      return response;
    }
  },
};
