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
import RegistrationPage from "@/components/Auth/RegistrationPage";
import {
  api
} from "@/api/index.js";
export default {
  components: {
    LoginPage,
    RegistrationPage
  },
  data() {
    return {
      signedIn: false,
      login: true,
    };
  },
  methods: {
    formSwitch(val){
      this.login = val;
    }
  },
  computed: {
    form() {
      return this.login ? 'login-page' : 'registration-page';
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

.start>* {
  width: 50%;
}

#side {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#main {
  background: #256b276e;
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

<style media="screen">
.form-auth {
  /* margin: 30% auto 0; */
  padding: 0 40px;
  max-width: 550px;
  /* text-align: center; */
}

.form-auth input {
  outline: 0;
  background: #f2f2f2;
  width: 100%;
  border: 0;
  border-radius: 15px;
  margin: 0 0 15px;
  padding: 15px;
  box-sizing: border-box;
  /* font-size: 14px; */
}

.form-auth button {
  text-transform: uppercase;
  outline: 0;
  background-color: #57b846;
  width: 100%;
  border: 0;
  padding: 15px;
  color: #ffffff;
  transition: all 0.4s;
  border-radius: 25px;
  box-shadow: 0 10px 30px 0px rgba(87, 184, 70, 0.5);
  cursor: pointer;
}

.form-auth button:hover,
.form-auth button:active,
.form-auth button:focus {
  background-color: #387322;
  box-shadow: 0 10px 30px 0px rgba(51, 51, 51, 0.5);
}

.form-auth .message {
  margin: 15px 0 0;
  color: #efefef;
}

.form-auth .message a {
  color: #82ea86;
  text-decoration: none;
}

.form-auth .register-form {
  display: none;
}
</style>
