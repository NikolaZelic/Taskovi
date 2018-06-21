<template>
  <div class="register">
    <vue-form :state="formstate" @submit.prevent="onSubmit">

      <validate class="form-group">
        <input type="text" name="name" v-model='user.name' class="form-control" placeholder="Name" required>

        <!-- <field-messages name="name">
          <div>Success!</div>
          <div slot="required">Name is a required field</div>
        </field-messages> -->
      </validate>

      <validate class="form-group">

        <input type="email" name="email" v-model.lazy='user.email' class="form-control" placeholder="Email" required>

        <!-- <field-messages name="email">
        <div slot="required">Email is a required field</div>
        <div slot="email">Email is not valid</div>
      </field-messages> -->
      </validate>

      <validate class="form-group">
        <input type="text" name="surname" v-model='user.surname' class="form-control" placeholder="Surname" required minlength="3">
      </validate>
      <validate class="form-group">
        <input type="password" name="pass" v-model='user.password' class="form-control" placeholder="Enter password" required minlength="3">
      </validate>
      <validate class="form-group">
        <input type="password" name="pass2" v-model='user.confirmpass' class="form-control" placeholder="Confirm password" required minlength="3">
      </validate>

      <button type="submit"  class="btn btn-success" @click.prevent='register' :disabled='registerDisabled'>Submit</button>

    </vue-form>

    <!-- <small v-if='passNotSame !== -1 && passNotSame' id="confirmation" class="form-text text-danger">Your passwords do not match.</small>
    <button class="btn btn-success" @click='register()' :disabled='registerDisabled'>Register</button> -->
    <p class="message">Already registered?
      <a @click='switchComp'>Sign In</a>
    </p>

  </div>
</template>

<script>
import { api } from "@/api/index.js";
import VueForm from "vue-form";

export default {
  name: "Registration",
  mixins: [
    new VueForm({
      inputClasses: {
        valid: "is-valid",
        invalid: "is-invalid"
      }
    })
  ],
  data() {
    return {
      formstate: {},
      user: {}
    };
  },
  methods: {
    register() {
      let valid = this.formstate.$valid;
      console.log(valid);
      if (valid) {
        api.register(this.user);
      }
    },
    switchComp() {
      this.$emit("clicked", true);
    },
    onSubmit: function() {
      if (this.formstate.$invalid) {
        alert("invalid");
        // alert user and exit early
        return;
      }
      alert("submitt");
      // otherwise submit form
    }
  },
  computed: {
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
  }
};
</script>
