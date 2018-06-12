<template>
<div>
  <h4>Adding company:</h4>

  <label for="companyname" class="mt-3">Company name</label>
  <input type="text" class="form-control mb-3" id="companyname" v-model="companyname" placeholder="Enter the name of the company you're creating">

  <label for="companydesc">Description</label>
  <textarea class="form-control mb-3" id="companydesc" rows="3" v-model='companydesc' placeholder="Tell us a little something about your company..." spellcheck="false"></textarea>

  <button @click="addCompany()" class="btn btn-success">Add company</button>
</div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      companyname: undefined,
      companydesc: undefined
    };
  },

  methods: {

    addCompany() {
      axios.post('http://671n121.mars-t.mars-hosting.com/mngapi/companies', {
        companyname: this.companyname,
        companydesc: this.companydesc,
        sid: window.localStorage.getItem('sid')
      })
    }

  }
}
</script>

<style scoped>
</style>
