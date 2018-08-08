<template>
  <div class="start">
    <div id='main'>
      <h1>
        <strong>Omni Tasker</strong>
      </h1>

      <template v-if='loginVisible'>
        <transition name="slide-to-left" mode="out-in">
          <div class="form-auth" :key='1'>


            <div class="login">
              <h2>Log in to your account</h2>
              <form class="login-form" novalidate>
                <div class="form-group">
                  <span class='fas fa-envelope'></span>
                  <input v-model="user.email" type="email" name='email' placeholder="Email address" class="form-control" required minlength="3"
                    id="email" />
                </div>

                <div class="form-group">
                  <span class='fas fa-lock'></span>
                  <input v-model="user.pass" type="password" name='pass' placeholder="Password" class="form-control" required minlength="3"
                    id="pass" />
                </div>
                <button @click.prevent="login" class='btn btn-primary' :disabled='!(isValidEmail && isValidPassword)'>login</button>
                <p class="message">Not registered?
                  <strong>
                    <a @click='loginVisible = !loginVisible'>Create an account</a>
                  </strong>
                </p>
              </form>
              <!-- REMOVE IN FINAL -->
              <div class="preset" v-if="href">
                <button v-for="p in presets" :key='p.email' @click.prevent="autologin(p)" class='btn btn-primary'>{{p.email}}</button>
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
              <vue-form :state="formstate">

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

                <button type="submit" class="btn btn-primary" @click.prevent='register' :disabled='registerDisabled'>Submit</button>

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

      <div id="creators" title='Created By: Nikola Zelic, Zeljko Milinkovic, Danilo Pusic, Milos Paunovic'></div>

    </div>
    <modal-error v-if="modalErrorActive" />
  </div>

</template>

<script>
import { api } from "@/api/index.js";
import { store } from "@/store/index.js";
import VueForm from "vue-form";
import ModalError from "@/components/Misc/ModalError";
import { mapState } from "vuex";
export default {
  mixins: [new VueForm({})],
  components: {
    ModalError
  },
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
        {
          email: "paun992@hotmail.com",
          pass: "123456"
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
      if (
        mail === undefined ||
        mail.length < 4 ||
        pass === undefined ||
        pass.length === 0
      )
        return;
      api
        .login(mail, pass)
        .then(r => {
          if (r.data.status !== "ERR" && r.data.login !== "failed") {
            let sid = r.data.sid;
            if (sid !== undefined || sid !== null) {
              store.commit("localStorage", {
                name: r.data.user.name,
                surname: r.data.user.surname,
                email: r.data.user.email,
                sid: sid
              });
              this.$router.push("/");
            }
          } else {
            store.commit("modalError", {
              message: "Login failed. Please check your username or password."
            });
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
            } else if (r.data.status === "ERR") {
              store.commit("modalError", {
                message: r.data.message
              });
            }
          })
          .catch(e => {
            store.commit("modalError", {
              message: "" + e
            });
          });
      }
    }
  },

  computed: {
    ...mapState({
      modalErrorActive: state => state.modalError.active
    }),
    isValidEmail() {
      let email = this.user.email;
      if (email === undefined || email === "") return false;
      let pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return email.match(pattern);
    },
    isValidPassword() {
      let pass = this.user.pass;
      return pass !== undefined && pass !== "";
    },
    href() {
      return window.location.href.startsWith("http://localhost:8080");
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
  /* justify-content: center; */
  display: flex;
  min-height: 100vh;
  /* background: linear-gradient(to bottom, #1e4bd4, #1a43c0); */
  /* background:
radial-gradient(black 15%, transparent 16%) 0 0,
radial-gradient(black 15%, transparent 16%) 8px 8px,
radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 0 1px,
radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 8px 9px;
background-color:#1e4bd4;
background-size:16px 16px; */

  /* background: linear-gradient(135deg, #4a68ff 25%, transparent 25%) -50px 0,
    linear-gradient(225deg, #4a68ff 25%, transparent 25%) -50px 0,
    linear-gradient(315deg, #4a68ff 25%, transparent 25%),
    linear-gradient(45deg, #4a68ff 25%, transparent 25%);
  background-size: 100px 100px;
  background-color: #3a55e0; */

  background-color: #2e5963;
  /* background-image: url("data:image/svg+xml,%3Csvg width='16' height='20' viewBox='0 0 16 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234697c5' fill-opacity='0.06' fill-rule='evenodd'%3E%3Cpath d='M8 0v20L0 10M16 0v10L8 0M16 10v10H8'/%3E%3C/g%3E%3C/svg%3E"); */

  /* background-image:  */

  background: url("https://www.answerunited.com/wp-content/uploads/2015/06/Call-Center-1.jpg");
  background-size: cover;
}

h1 {
  margin-bottom: 30px;
  color: #000;
}

h2 {
  margin-bottom: 25px;
  color: #1e4fe0;
}

#main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 60px;
}

#creators {
  position: absolute;
  background: var(--ac-color);
  height: 20px;
  width: 20px;
  opacity: 0.06;
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
  /* min-width: 430px; */
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
  color: #1e4fe0;
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

.btn-warning {
  background: linear-gradient(to left, #ffb610 0%, #eab337 99%);
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

@media screen and (min-width: 650px) {
  .form-auth {
    min-width: 400px;
  }
}
</style>
