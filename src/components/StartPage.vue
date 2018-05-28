<template>
<div class="start">
  <h1>Welcome to our Task Management App</h1>
  <div>
    <login-page/>
    <button class="btn btn-warning" @click='signUp()'>
       <span class="fas fa-sign-up-alt"></span> Sign Up
    </button>
  </div>
  <login v-if="showSignIn" @close="showModal = false"></login>
</div>
</template>

<script>
import LoginPage from "@/components/LoginPage";

export default {
  components: {
    LoginPage
  },
  data() {
    return {
      showSignIn: false
    };
  },
  methods: {
    signIn() {
      this.showSignIn = true;
    }
  },
  beforecreated() {
    var sid = window.localStorage.getItem("sid");
    if (sid !== undefined && sid !== null) {
      alert(sid);
    }
  }
};
</script>

<style scoped>
.start {
  text-align: center;
  background: #000 url(~@/assets/StartPageWallpaper.jpg);
}

h1 {
  color: #fff;
}
</style>
