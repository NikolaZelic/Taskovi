<template>
<div>
  <div class="row add-section">
    <div class="col-md-8 offset-md-2 pad">
      <h1 class="display-4">COMPNAME</h1><br>

      <h4>Employees:</h4>
      <ul class="list-group list-group-flush mb-5">
        <li class="list-group-item" v-for="admin in admins">
          {{ admin.usr_name }} {{ admin.usr_surname }}
        </li>
      </ul>

      <h4>Teams:</h4>
      <ul class="list-group list-group-flush mb-3">
        <li class="list-group-item" v-for="admin in admins">
          {{ admin.usr_name }} {{ admin.usr_surname }}
        </li>
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
      addEmployee: false,
      employees: [],
      notExisting: false,
      message: 'prazno',
      text: 'New...?'
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
        } else {
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
