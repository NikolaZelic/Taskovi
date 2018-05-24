<template>
<div class="login-wrapper border border-light">
  <form class="form-signin" @submit.prevent="login">
    <div class="user-field">
      <i class="fas fa-user"></i>
      <input v-model="email" type="email" id="inputEmail" class="form-control dark-input" placeholder="Email address" required autofocus>
    </div>
    <div class="pass-field">
      <i class="fas fa-unlock-alt"></i>
      <input v-model="password" type="password" id="inputPassword" class="form-control dark-input" placeholder="Password" required>
    </div>
    <button class="btn btn-lg btn-primary btn-block" type="submit" @click='login()'>Sign in</button>
  </form>
</div>
</template>

<script>
import axios from 'axios';
import {
  api
} from '@/api/index.js';
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    login() {
      console.log('click');
      api.login(this.email, this.password);
    }
  }
}
</script>

<style lang="css" scoped>
body {
  background: #605B56;
}

.login-wrapper {
  width: 70%;
  margin: 12% auto;
}

.form-signin {
  max-width: 330px;
  padding: 10% 15px;
  margin: 0 auto;
}
.form-signin .form-signin-heading,
.form-signin .checkbox {
  margin-bottom: 10px;
}
.form-signin .checkbox {
  font-weight: normal;
}
.form-signin .form-control {
  position: relative;
  height: auto;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.dark-input{
  background: #222;
  color: white;
}

.dark-input::placeholder{
  color: white;
}

i{
  color: white;
  position: absolute;
    left: 10px;
    width: 24px!important;
    height: 24px;
    top: 8px;
    z-index: 5;
}
.user-field, .pass-field{
  position: relative;
}

input{
  margin: auto;
border-radius: 3px;
height: 40px;
background: #1d1d1d;
border: none;
padding-left: 10px;
font-size: 14px;
color: #fff;
text-decoration: none;
text-indent: 35px;
}

</style>
