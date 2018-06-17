<template>
<div class="login">
  <div class="form">
    <form class="register-form">
      <input type="text" placeholder="name" />
      <input type="text" placeholder="surname" />
      <input type="password" placeholder="password" />
      <input type="text" placeholder="email address" />
      <button>create</button>
      <p class="message">Already registered?
        <a href="#">Sign In</a>
      </p>
    </form>
    <form class="login-form">
      <input v-model="email" type="email" placeholder="email" />
      <input v-model="password" type="password" placeholder="password" />
      <button @click.prevent="login">login</button>
      <p class="message">Not registered?
        <a href="#" @click='signUp()'>Create an account</a>
      </p>
    </form>
    <div class="preset">
      <button v-for="p in presets" @click.prevent="autologin(p)">{{p.l}}</button>
    </div>
  </div>
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
        l: 'email2@yahoo.com',
        p: 'pass111',
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
      // alert(this.email + ' '+ this.password);
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

<style lang="css" scoped>
.login-page {
  padding: 8% 0 0;
  margin: auto;
}

.form {
  margin: 40% auto 0;
  padding: 40px 40px 0px;
  max-width: 550px;
  text-align: center;
}

.form input {
  outline: 0;
  background: #f2f2f2;
  width: 100%;
  border: 0;
  margin: 0 0 15px;
  padding: 15px;
  box-sizing: border-box;
  /* font-size: 14px; */
}

.form button {
  text-transform: uppercase;
  outline: 0;
  background: #4caf50;
  width: 100%;
  border: 0;
  padding: 15px;
  color: #ffffff;
  /* font-size: 14px; */
  transition: all 0.3 ease;
  cursor: pointer;
}

.form button:hover,
.form button:active,
.form button:focus {
  background: #43a047;
}

.form .message {
  margin: 15px 0 0;
  color: #efefef;
}

.form .message a {
  color: #82ea86;
  text-decoration: none;
}

.form .register-form {
  display: none;
}

.container {
  position: relative;
  z-index: 1;
  max-width: 300px;
  margin: 0 auto;
}

.container:before,
.container:after {
  content: "";
  display: block;
  clear: both;
}

.container .info {
  margin: 50px auto;
  text-align: center;
}

.container .info h1 {
  margin: 0 0 15px;
  padding: 0;
  /* font-size: 36px; */
  font-weight: 300;
  color: #1a1a1a;
}

.container .info span {
  color: #4d4d4d;
  /* font-size: 12px; */
}

.container .info span a {
  color: #000000;
  text-decoration: none;
}

.container .info span .fa {
  color: #ef3b3a;
}
.preset button {
  line-height: 0px;
}
</style>
