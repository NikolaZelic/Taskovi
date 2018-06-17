<template>
<div>
  <div class="row add-section">
    <div class="col-md-8 offset-md-2 pad">

      <h4>Change company name:</h4>
      <div class="input-group mb-5">
        <input type="text" class="form-control" name="companyname" v-model="company" placeholder="Enter new company name">
        <div class="input-group-append">
          <button class="btn btn-outline-success" @click="changeCompanyName()">Change</button>
        </div>
      </div>

      <h4>Company's admins:</h4>
      <ul class="list-group list-group-flush mb-3">
        <li class="list-group-item" v-for="admin in admins">
          {{ admin.usr_name }} {{ admin.usr_surname }}
          <span class="small"> --- {{ admin.usr_email }}</span>
        </li>

        <li class="list-group-item">

          <div v-if="!add" @click="add = !add"><i class="fas fa-user-plus"></i> Add new admin</div>

          <div class="input-group" v-else>
            <input type="text" class="form-control" name="email" v-model="email" placeholder="Enter user's email">
            <div class="input-group-append">
              <button class="btn btn-outline-success" @click="addAdmin()">Add</button>
            </div>
          </div>

        </li>

        <li v-if="notExisting" class="list-group-item">{{message}}</li>

      </ul>




    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      company: '',
      email: '',
      add: false,
      admins: [],
      notExisting: false,
      message: 'prazno'
    }
  },

  methods: {

    changeCompanyName() {
      axios.put('http://671n121.mars-t.mars-hosting.com/mngapi/users/companies/:comid/changename', {
        comid: 31,
        companyname: this.company,
        sid: window.localStorage.getItem('sid')
      })
    },

    addAdmin() {
      axios.post('http://671n121.mars-t.mars-hosting.com/mngapi/users/companies/:comid/addadmin', {
        comid: 13,
        email: this.email,
        sid: window.localStorage.getItem('sid')
      }).then(response => {
        if (response.data.status === 'ERR') {
          this.notExisting = true;
          this.message = response.data.message;
        }

        else{
            this.notExisting = false;
        }
        this.loadAdmins();
      })


    },

    loadAdmins() {
      axios.get('http://671n121.mars-t.mars-hosting.com/mngapi/users/companies/:comid/admins', {
        params: {
          comid: 13,
          sid: window.localStorage.getItem('sid')
        }
      }).then(response => {
        this.admins = response.data.data;
        //console.log(response.data);
      })
    }

  },

  mounted() {



    this.loadAdmins();

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.add-section {
  padding-top: 50px;
}
</style>
