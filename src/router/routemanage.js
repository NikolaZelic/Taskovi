import {
  store
} from "@/store/index.js";


export const routejs = {

  check() {
    let locat = window.location.pathname.substring(1);
    if (locat === "feeds") {
      store.commit("showGlobalFeed", true);
    }
    // IMPROVE ROUTER
  }
};
