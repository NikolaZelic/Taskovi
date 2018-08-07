import {
  store
} from "@/store/index.js";
import router from '@/router/index.js';

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
  },

  redirectToLoginPage(){
    // console.log('Redirected to login page');
    router.push("/auth");
  },

  checkSession(response){
    // message: "You are not logged in."
    // console.log(response);
    if( response.data.message === "You are not logged in." ){
      // console.log('Session run out');
      // console.log(response);
      this.redirectToLoginPage();
    }
    else if( response.data.status === "ERR" ){
      let message = response.data.message;
      if(message===undefined||message===null||message.length===0)
        message = "Error happen on server";
      store.commit("modalError", {  // Ovaj je
        message: '' + message,
      });
    }
    else{
      return response;
    }
  },
};
