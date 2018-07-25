<template>
  <div class="start">
    <div id='main'>
      <h1>
        <strong>Task Master</strong>
      </h1>

      <template v-if='loginVisible'>
        <transition name="slide-to-left" mode="out-in">
          <div class="form-auth" :key='1'>


            <div class="login">
              <h2>Log in to your account</h2>
              <form class="login-form" novalidate>
                <div class="form-group">
                  <span class='fas fa-envelope'></span>
                  <input v-model="user.email" type="email" name='email' placeholder="Email address" class="form-control" required minlength="3" id="email"/>
                </div>

                <div class="form-group">
                  <span class='fas fa-lock'></span>
                  <input v-model="user.pass" type="password" name='pass' placeholder="Password" class="form-control" required minlength="3" id="pass"/>
                </div>
                <button @click.prevent="login" class='btn btn-warning'>login</button>
                <p class="message">Not registered?
                  <strong>
                    <a @click='loginVisible = !loginVisible'>Create an account</a>
                  </strong>
                </p>
              </form>
              <!-- REMOVE IN FINAL -->
              <div class="preset" v-if="href">
                <button v-for="p in presets" :key='p.email' @click.prevent="autologin(p)" class='btn btn-warning'>{{p.email}}</button>
              </div>
            </div>

          </div>
        </transition>
      </template>

      <template v-if='!loginVisible'>
        <transition name="slide-to-right" mode="out-in">

          <div class="form-auth" :key='2'>
            <div class="register">
              <h2>Sign up for free</h2>
              <vue-form :state="formstate" @submit.prevent="onSubmit">

                <validate class="form-group">
                  <span class='fas fa-user'></span>
                  <input type="text" name="name" v-model='user.name' :class='fieldClassName(formstate.name)' class="form-control" placeholder="Name"
                    required>
                </validate>

                <validate class="form-group">
                  <span class='fas fa-user'></span>
                  <input type="text" name="surname" v-model='user.surname' :class='fieldClassName(formstate.surname)' class="form-control"
                    placeholder="Surname" required minlength="3">
                </validate>

                <validate class="form-group">
                  <span class='fas fa-envelope'></span>
                  <input type="email" name="email" v-model.lazy='user.email' :class='fieldClassName(formstate.email)' class="form-control"
                    placeholder="Email address" required>
                </validate>

                <validate class="form-group">
                  <span class='fas fa-lock'></span>
                  <input type="Password" name="pass" v-model='user.password' :class='fieldClassName(formstate.pass)' class="form-control" placeholder="Password"
                    required minlength="3">
                </validate>
                <validate class="form-group">
                  <span class='fas fa-lock'></span>
                  <input type="password" name="pass2" v-model='user.confirmpass' :class='fieldClassName(formstate.pass2)' class="form-control"
                    placeholder="Confirm password" required minlength="3">
                </validate>

                <button type="submit" class="btn btn-warning" @click.prevent='register' :disabled='registerDisabled'>Submit</button>

              </vue-form>
              <p class="message">Already have an account?
                <strong>
                  <a @click='loginVisible = !loginVisible'>Sign In</a>
                </strong>
              </p>
            </div>
          </div>
        </transition>
      </template>

      <div id="creators" title='Created By: Nikola Zelic, Zeljko Milinkovic, Danilo Pusic, Svetozar Davidovic, Milos Paunovic'></div>

    </div>
  </div>

</template>

<script>
import { api } from "@/api/index.js";
import { store } from "@/store/index.js";
import VueForm from "vue-form";
export default {
  mixins: [new VueForm({})],
  data() {
    return {
      loginVisible: true,
      presets: [
        {
          email: "nzelic@ymail.com",
          pass: "123"
        },
        {
          email: "danilopusic@ymail.com",
          pass: "123"
        },
        {
          email: "dime@gmail.com",
          pass: "123"
        },
        {
          email: "zex@gmail.com",
          pass: "123"
        },
        // {
        //   email: "svetaprogramer@gmail.com",
        //   pass: "praksa1234"
        // },
        {
          email: "paun992@hotmail.com",
          pass: "pass123"
        }
      ],
      formstate: {},
      user: {}
    };
  },
  methods: {
    fieldClassName: function(field) {
      if (!field) {
        return "";
      }
      if ((field.$touched || field.$submitted) && field.$valid) {
        return "is-valid";
      }
      if ((field.$touched || field.$submitted) && field.$invalid) {
        return "is-invalid";
      }
    },
    autologin(p) {
      // REMOVE IN FINAL
      this.user = p;
      this.login();
    },
    login() {
      let mail = this.user.email;
      let pass = this.user.pass;
      if (mail === undefined || mail.length < 4) {
        alert("Email is not valid");
        //document.getElementById("email").style.color = "red";
        //this.user.email = "Email is not valid";
        return;
      }
      if (pass === undefined || pass.length < 2) {
        //document.getElementById("pass").style.color = "red";
        //this.user.pass = "Password cannot be less then two characters";
        alert("Password cannot be less then two characters");
        return;
      }
      api
        .login(mail, pass)
        .then(r => {
          if (r.data.login !== "failed") {
            let sid = r.data.sid;
            if (sid !== undefined || sid !== null) {
              console.log("aad");
              store.commit("localStorage", {
                name: r.data.user.name,
                surname: r.data.user.surname,
                email: r.data.user.email,
                sid: sid
              });
              this.$router.push("/");
            }
          } else {
            //document.getElementById("email").style.color = "red";
            //this.user.email = "Login failed. Please check your username or password.";
            alert("Login failed. Please check your username or password.");
          }
        })
        .catch(e => {
          store.commit("modalError", {
            message: "" + e
          });
        });
    },
    register() {
      let valid = this.formstate.$valid;
      if (valid) {
        api
          .register(this.user)
          .then(r => {
            if (r.data.registration === "Success") {
              this.loginVisible = true;
            }
          })
          .catch(e => {
            store.commit("modalError", {
              message: "" + e
            });
          });
      }
    },
    onSubmit() {
      // if (this.formstate.$invalid) {
      //   alert("invalid");
      //   // alert user and exit early
      //   return;
      // }
      // alert("submit");
      // // otherwise submit form
    }
  },


  computed: {
    href(){
      var loc = window.location.href;
      if(loc.startsWith("http://localhost:8080")){
        return true;
      }else{
        return false;
      }


    },

    passNotSame() {
      var undef =
        this.user.password === undefined || this.user.confirmpass === undefined;
      if (undef) return -1;
      var empty =
        this.user.password.length === 0 || this.user.confirmpass.length === 0;
      if (empty) return -1;
      return this.user.password !== this.user.confirmpass;
    },
    registerDisabled() {
      return this.passNotSame;
    }
  },
  beforeCreate() {
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
  justify-content: center;
  display: flex;
  height: 100vh;
  background: linear-gradient(to top, #f46b45, #eea849);
}

h1 {
  margin-bottom: 50px;
  color: #000b;
}

h2 {
  margin-bottom: 25px;
  color: #000b;
}

#main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#creators {
  position: absolute;
  background: var(--ac-bg-light-color);
  height: 30px;
  width: 30px;
  opacity: 0.2;
  border-radius: 5px;
  bottom: 5%;
  right: 5%;
}

/* LOGIN */

.preset button {
  line-height: 0px !important;
}

.preset > * {
  margin-bottom: 10px;
}

.form-group {
  display: flex;
  position: relative;
  align-items: center;
}

.form-auth {
  width: 90%;
  padding: 30px;
  max-width: 550px;
  min-width: 430px;
  background-color: #f7f7f2e0;
  border-radius: 5px;
}

.form-auth input {
  outline: 0;
  background: #f2f2f2;
  width: 100%;
  height: 50px;
  box-shadow: inset 0 3px 10px 0 #00000026;
}

.form-auth button {
  text-transform: uppercase;
  outline: 0;
  width: 100%;
  border: 0;
  padding: 15px;
  transition: all 0.4s;
  line-height: 1;
  cursor: pointer;
}

.form-auth button:hover,
.form-auth button:active,
.form-auth button:focus {
  box-shadow: 2px 5px 10px 0px rgba(51, 51, 51, 0.5);
}

.form-auth .message {
  margin: 15px 0 0;
  color: #111;
}

.form-auth .message a {
  color: #111;
  text-decoration: none;
  cursor: pointer;
}

.form-auth .register-form {
  display: none;
}

.form-group input {
  padding-left: 50px;
}

.form-group span {
  position: absolute;
  left: 15px;
}

.form-group span:after {
  content: "";
  position: absolute;
  right: -11px;
  top: -10px;
  bottom: -10px;
  width: 1px;
  opacity: 0.5;
  background-color: rgba(212, 212, 212, 0);
  background-image: linear-gradient(
    to top,
    rgba(212, 212, 212, 0) 0,
    #d4d4d4 30%,
    #d4d4d4 70%,
    rgba(212, 212, 212, 0) 100%
  );
}

/* Transition */

.slide-to-left-enter-active,
.slide-to-right-enter-active {
  transition: all 0.4s;
  /* margin-top: -100px; */
}

.slide-to-left-leave-active,
.slide-to-right-leave-active {
  transition: all 0.4s;
}

.slide-to-left-leave-to,
.slide-to-right-enter {
  opacity: 0;
  transform: translateX(200px);
}

.slide-to-left-enter,
.slide-to-right-leave-to {
  opacity: 0;
  transform: translateX(-200px);
}
</style>
