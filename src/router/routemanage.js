import {
  store
} from "@/store/index.js";


export const routejs = {

  check() {
    let locat = window.location.pathname;
    if (locat.startsWith("/feeds")) {
      store.commit("showGlobalFeed", true);
    }
    if (locat.startsWith("/tasks/:taskID")) {
      // store.commit("showGlobalFeed", true);
    }
    // IMPROVE ROUTER
  }
};
