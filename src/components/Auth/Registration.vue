<template>
<div class="top-padding">


    <div class="form-group">
      <label for="email">Email address</label>
      <input type="email" class="form-control" id="email" name="email" v-model='email' placeholder="name@example.com">
    </div>

    <div class="form-group">
      <label for="name">Name</label>
      <input type="text" class="form-control" id="name" name="name" v-model='name' placeholder="Enter your first name">
    </div>

    <div class="form-group">
      <label for="surname">Last name</label>
      <input type="text" class="form-control" id="surname" name="surname" v-model='surname' placeholder="Enter your last name">
    </div>

    <div class="form-group">
      <label for="pass">Password</label>
      <input type="password" class="form-control" id="pass" name="pass" v-model='password' placeholder="Enter password" @blur="passConfirmation()">
    </div>

    <div class="form-group">
      <label for="confirmpass">Confirm password</label>
      <input type="password" class="form-control" id="confirmpass" v-model='confirmpass' placeholder="Confirm password" @blur="passConfirmation()">
      <small v-if='!notConfirmed' id="confirmation" class="form-text text-danger">Your passwords do not match.</small>
    </div>

    <div class="form-group">
      <label for="description">Description</label>
      <textarea class="form-control" id="description" rows="3" name="description" v-model='description' placeholder="Tell us a little something about yourself..."></textarea>
    </div>
    <button class="btn btn-primary" @click='register()'>Register</button>

</div>
</template>

<script>
import {
  api
} from "@/api/index.js";

export default {
  name: "Registration",
  data() {
    return {
      email: "",
      name: "",
      surname: "",
      confirmpass: "",
      password: "",
      description: "",
      notConfirmed: -1
    };
  },
  methods: {
    register() {
      api.register(this.email, this.password, this.name, this.surname, this.description);
    },

    passConfirmation() {
      var notEmpty = this.password.length !== 0 && this.confirmpass.length !== 0;
      if (notEmpty && this.password === this.confirmpass) {
        this.notConfirmed = true
      } else {
        this.notConfirmed = false
      }
    }

  }
}
</script>

<style>
.top-padding {
  padding-top: 50px;
}
</style>
