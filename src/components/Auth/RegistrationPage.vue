<template>
  <div class="register">
    <input type="email" id="email" name="email" v-model='email' placeholder="Email">
    <input type="text" id="name" name="name" v-model='name' placeholder="Name">
    <input type="text" id="surname" name="surname" v-model='surname' placeholder="Surname">
    <input type="password" id="pass" name="pass" v-model='password' placeholder="Enter password" @blur="passConfirmation()">
    <input type="password" id="confirmpass" v-model='confirmpass' placeholder="Confirm password" @blur="passConfirmation()">
    <small v-if='!notConfirmed' id="confirmation" class="form-text text-danger">Your passwords do not match.</small>
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
      email: "",
      name: "",
      surname: "",
      confirmpass: "",
      password: "",
      notConfirmed: -1
    };
  },
  methods: {
    register() {
      api.register(
        this.email,
        this.password,
        this.name,
        this.surname,
        this.description
      );
    },
    switchComp() {
      this.$emit("clicked", true);
    },
    passConfirmation() {
      var notEmpty =
        this.password.length !== 0 && this.confirmpass.length !== 0;
      if (notEmpty && this.password === this.confirmpass) {
        this.notConfirmed = true;
      } else {
        this.notConfirmed = false;
      }
    }
  }
};
</script>

<style>
.top-padding {
  padding-top: 50px;
}
</style>
