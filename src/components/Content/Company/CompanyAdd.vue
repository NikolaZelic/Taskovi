<template>
<div>
      <h4>Adding company:</h4>
      <input type="text" class="form-control mb-3" id="com_name" name="companyname" v-model="company" placeholder="Enter the name of the company you're creating">
      <button @click="addCompany()" class="btn btn-success">Add company</button>      
</div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      company: ""
    };
  },

  methods: {
    getUserAccount() {
      return axios.get("http://671n121.mars-t.mars-hosting.com/mngapi/tasks/2");
    },

    getUserPermissions() {
      return axios.get("http://671n121.mars-t.mars-hosting.com/mngapi/tasks/1");
    },

    addCompany() {
      // axios.post('http://671n121.mars-t.mars-hosting.com/mngapi/companies', {
      //   companyname: this.company,
      //   sid: window.localStorage.getItem('sid')

      axios.all([getUserAccount(), getUserPermissions()]).then(
        axios.spread(function(acct, perms) {
          // Both requests are now complete
          console.log(acct, perms);
        })
      );
    }
    // .then(function (response) {
    //   console.log(response);
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });
  }
};
</script>

<style scoped>
.add-section {
  padding-top: 50px;
}
</style>
