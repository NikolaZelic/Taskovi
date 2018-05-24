<template>
<div class="start">
  <h1>Welcome to our Task Management App</h1>
  <div>
    <login></login>
    <button class="btn btn-warning" @click='signUp()'>Sign Up</button>
  </div>
  <login v-if="showSignIn" @close="showModal = false"></login>
</div>
</template>

<script>
import login from "@/components/Login";

export default {
  components: {
    login
  },
  data() {
    return {
      showSignIn: false
    }
  },
  methods: {
    signIn() {
      this.showSignIn = true;
    }
  },
  beforecreated: function() {
    var sid = window.localStorage.getItem('sid');
    if (sid !== undefined && sid !== null) {
      alert(sid);
    }
  },
}
</script>

<style scoped>
.start {
  text-align: center;
  /* background: url("~assets/StartPageWallpaper.jpg"); */
}

h1 {
  color: #fff
}
</style>
