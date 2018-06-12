<template>
<div class="start">
  <div id='main'>
    <login-page/>
    <!-- <button class="btn btn-warning" @click='signUp()'>
        <span class="fas fa-sign-up-alt"></span> Sign Up
      </button> -->
    <!-- <login v-if="showSignIn" @close="showModal = false"></login> -->
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
import {
  api
} from "@/api/index.js";
export default {
  components: {
    LoginPage
  },
  data() {
    return {
      signedIn: false,
    };
  },
  methods: {
    // signIn() {
    //   this.showSignIn = true;
    // }
  },
  created() {
    // IF SID EXIST AND SEASON ACTIVE EXIST ROUTE TO MAINPAGE
    let sid = localStorage.sid;
    if (sid !== undefined && sid !== null) {
      api.sessionActive().then(r => {
        let statusOK = r.data.status === 'OK';
        if (statusOK) {
          console.log(r.data.name + ' ' + r.data.surname + ' ulogovan');
          window.localStorage.name = r.data.name;
          window.localStorage.surname = r.data.surname;
          this.$router.push('/');
        }
      })
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

#side {}

#main {
  background: #256b276e;
}

#apptitle {
  margin: 45% 0 0;
}

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
