<template>
<div class="start">
  <div id='main'>
    <div class="form-auth">
      <component @clicked='formSwitch' :is='form'></component>
    </div>
  </div>
  <div id='side'>
    <div id='apptitle'>
      <h2>Welcome to our</h2>
      <h1>Task Management App</h1>
    </div>
    <div id="creators" title='Created By: Nikola Zelic, Zeljko Milinkovic, Danilo Pusic, Svetozar Davidovic, Milos Paunovic'></div>
  </div>
</div>
</template>

<script>
import LoginPage from "@/components/Auth/LoginPage";
// Nisam siguran sta je ovaj import tu. Zelic.
// import RegistrationPage from "@/components/Auth/RegistrationPage";
import { api } from "@/api/index.js";
export default {
  components: {
    LoginPage,
    // RegistrationPage
  },
  data() {
    return {
      signedIn: false,
      login: true
    };
  },
  methods: {
    formSwitch(val) {
      this.login = val;
    }
  },
  computed: {
    form() {
      return this.login ? "login-page" : "registration-page";
    }
  },
  created() {
    // IF SID EXIST AND SEASON ACTIVE EXIST ROUTE TO MAINPAGE
    let sid = localStorage.sid;
    if (sid !== undefined && sid !== null) {
      api.sessionActive();
    }
  }
};
</script>

<style scoped>
.start {
  text-align: center;
  display: flex;
  height: 100vh;
  background-size: 100%;
  background-repeat: no-repeat;
  background: #000 url(~@/assets/img/Start/StartPage.jpg);
}

h1,
h2 {
  color: #fff;
  background: #0007;
}

.start > * {
  width: 50%;
}

#side {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#main {
  background: #25881442;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* #apptitle {
  margin: 45% 0 0;
} */

#creators {
  position: absolute;
  background: #28a745;
  height: 30px;
  width: 30px;
  opacity: 0.2;
  border-radius: 50%;
  bottom: 5%;
  right: 5%;
}
</style>