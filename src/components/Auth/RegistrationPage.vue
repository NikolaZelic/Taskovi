<template>
  <div class="register">
    <input type="email" id="email" name="email" v-model='user.email' placeholder="Email">
    <input type="text" id="name" name="name" v-model='user.name' placeholder="Name">
    <input type="text" id="surname" name="surname" v-model='user.surname' placeholder="Surname">
    <input type="password" id="pass" name="pass" v-model='user.password' placeholder="Enter password" @blur="passMatcher()">
    <input type="password" id="confirmpass" v-model='user.confirmpass' placeholder="Confirm password" @blur="passMatcher()">
    <small v-if='passMatcher !== -1 && passMatcher' id="confirmation" class="form-text text-danger">Your passwords do not match.</small>
    <button class="btn btn-primary" @click='register()'>Register</button>
    <p class="message">Already registered?
      <a @click='switchComp'>Sign In</a>
    </p>

  </div>
</template>

<script>
import { api } from "@/api/index.js";

export default {
  name: "Registration",
  data() {
    return {
      user: {
        email: "",
        name: "",
        surname: "",
        confirmpass: "",
        password: ""
      }
    };
  },
  methods: {
    register() {
      api.register(this.user);
    },
    switchComp() {
      this.$emit("clicked", true);
    },
  },
  computed: {
    passMatcher() {
      var empty = this.user.password.length === 0 || this.user.confirmpass.length === 0;
      if (empty) return -1;
      if (!empty && this.user.password === this.user.confirmpass) {
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>
