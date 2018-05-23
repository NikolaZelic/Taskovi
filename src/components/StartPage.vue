<template>
  <div class="app">
      <h1>Welcome to our Menajment App</h1>
      <button @click='signIn()'>Sign In</button><br>
      <button @click=''>Sign Up</button>
      <login v-if="showSignIn" @close="showModal = false"></login>
  </div>
</template>

<script>
import login from "@/components/Login";

export default {
  components: {
    login
  },
  data () {
    return {
      showSignIn: false
    }
  },
  methods: {
    signIn() {
      this.showSignIn = true;
    }
  }
}
</script>

<style scoped>

</style>
