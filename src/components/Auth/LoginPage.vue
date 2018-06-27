<template>
  <div class="login">
    <form class="login-form was-validated" novalidate>
      <div class="form-group">
        <input v-model="user.email" type="email" name='email' placeholder="email" class="form-control" required minlength="3" />
      </div>
      <div class="form-group">
        <input v-model="user.pass" type="password" name='pass' placeholder="password" class="form-control" required minlength="3"
        />
      </div>
      <button @click.prevent="login" class='btn btn-success'>login</button>
      <p class="message">Not registered?
        <a @click='switchComp'>Create an account</a>
      </p>
    </form>
    <div class="preset">
      <button v-for="p in presets" :key='p.email' @click.prevent="autologin(p)" class='btn btn-success'>{{p.email}}</button>
    </div>
  </div>
</template>

<script>
import { api } from "@/api/index.js";
// import VueForm from "vue-form";
export default {
  name: "Login",
  // mixins: [
  //   new VueForm({
  //     inputClasses: {
  //       valid: "is-valid",
  //       invalid: "is-invalid"
  //     }
  //   })
  // ],
  data() {
    return {
      formstate: {},
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
          email: "email001@qqq.com",
          pass: "qqq"
        },
        {
          email: "email004@qqq.com",
          pass: "qqq"
        }
      ],
      user: {}
    };
  },
  methods: {
    autologin(p) {
      // REMOVE IN FINAL
      this.user = p;
      this.login();
    },
    switchComp() {
      this.$emit("clicked", false);
    },
    login() {
      let mail = this.user.email;
      let pass = this.user.pass;
      if (mail.length < 4) {
        alert("Email is not valid");
        return;
      }
      if (pass.length < 2) {
        alert("Password cannot be less then two characters");
        return;
      }
      api
        .login(mail, pass)
        .then(r => {
          let sid = r.data.sid;
          if (sid != undefined || sid != null) {
            // WRITE SID TO STORE
            window.localStorage.sid = sid;
            window.localStorage.name = r.data.name;
            window.localStorage.surname = r.data.surname;
            this.$router.push("/");
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
.preset button {
  line-height: 0px;
}
</style>
