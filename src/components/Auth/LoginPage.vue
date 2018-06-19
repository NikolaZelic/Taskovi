<template>
<div class="login">
  <!-- <div class="form-auth"> -->
  <!-- <form class="register-form">
      <input type="text" placeholder="name" />
      <input type="text" placeholder="surname" />
      <input type="password" placeholder="password" />
      <input type="text" placeholder="email address" />
      <button>create</button>
      <p class="message">Already registered?
        <a href="#">Sign In</a>
      </p>
    </form> -->
  <form class="login-form">
    <input v-model="email" type="email" placeholder="email" />
    <input v-model="password" type="password" placeholder="password" />
    <button @click.prevent="login">login</button>
    <p class="message">Not registered?
      <a @click='switchComp'>Create an account</a>
    </p>
  </form>
  <div class="preset">
    <button v-for="p in presets" :key='p.l' @click.prevent="autologin(p)">{{p.l}}</button>
  </div>
  <!-- </div> -->
</div>
</template>

<script>
import {
  api
} from "@/api/index.js";
export default {
  name: "Login",
  data() {
    return {
      presets: [{
        l: 'email1@gmail.com',
        p: 'pass123',
      }, {
        l: 'admin2@gmail.com',
        p: 'admin222',
      }, {
        l: 'email2@yahoo.com',
        p: 'pass111',
      }, {
        l: 'email001@qqq.com',
        p: 'qqq',
      }, {
        l: 'email004@qqq.com',
        p: 'qqq',
      }, {
        l: 'email002@qqq.com',
        p: 'qqq',
      }],
      email: "",
      password: "",
    };
  },
  methods: {
    autologin(p) {
      this.email = p.l;
      this.password = p.p;
      this.login();
    },
    switchComp() {
      this.$emit('clicked', false);
    },
    login() {
      let mail = this.email;
      let pass = this.password;
      if (mail.length < 4) {
        alert('Email is not valid');
        return;
      }
      if (pass.length < 2) {
        alert('Password cannot be less then two characters');
        return;
      }
      api.login(mail, pass).then(r => {
          let sid = r.data.sid;
          if (sid != undefined || sid != null) {
            // WRITE SID TO STORE
            window.localStorage.sid = sid;
            window.localStorage.name = r.data.name;
            window.localStorage.surname = r.data.surname;
            this.$router.push('/');
          } else {
            alert(r.data.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style>
/* .login-page {
  padding: 8% 0 0;
  margin: auto;
} */

.preset button {
  line-height: 0px;
}
</style>
