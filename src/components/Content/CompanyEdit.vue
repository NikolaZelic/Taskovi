<template>
<div>
  <div class="row add-section">
    <div class="col-md-8 offset-md-2 pad">

      <h4>Change company name:</h4>
      <div class="input-group mb-5">
        <input type="text" class="form-control" name="companyname" v-model="company" placeholder="Enter new company name">
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" @click="changeCompanyName()">Change</button>
        </div>
      </div>


      <h4>Add new user:</h4>
      <div class="input-group mb-5">
        <input type="text" class="form-control" placeholder="Enter user's email address" v-model="email">
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button" @click="addAdmin()">As admin</button>
          <button class="btn btn-outline-secondary" type="button" @click="addEmployees()">As employee</button>
        </div>
      </div>
      <div class="mb-5" v-if="notExistingAdmin">{{message}}</div>
      <div class="mb-5" v-if="notExistingEmployee">{{message}}</div>



      <!-- <br><br><br><br><br><br>

      <div class="text-center mb-3">
        <button type="button" class="btn btn-secondary" @click="add = !add">Add admin</button>
        <button type="button" class="btn btn-secondary" @click="addEmployee = !addEmployee">Add employee</button>
      </div> -->


      <!--
<br><br> -->


      <!-- <div class="input-group mb-3" v-if="add">
        <input type="text" class="form-control" name="email" v-model="email" placeholder="Enter admin's email">
        <div class="input-group-append">
          <button class="btn btn-outline-success" @click="addAdmin()">Add</button>
        </div>
      </div>
      <div class="mb-3" v-if="notExistingAdmin">{{message}}</div>

      <div class="input-group mb-3" v-if="addEmployee">
        <input type="text" class="form-control" name="emailEmployee" v-model="emailEmployee" placeholder="Enter employees's email">
        <div class="input-group-append">
          <button class="btn btn-outline-success" @click="addEmployees()">Add</button>
        </div>
      </div>
      <div class="mb-3" v-if="notExistingEmployee">{{message}}</div>

<br><br><br><br><br><br> -->


      <!-- <div class="mb-5 justify-content-center">
       <button type="button" class="btn btn-outline-success">Add new admin</button>
        <button type="button" class="btn btn-outline-success">Add new employee</button>


        <div v-if="!add" @click="add = !add" class="btn btn-outline-secondary"><i class="fas fa-user-plus"></i> Add new admin</div>
        <div class="input-group" v-else>
          <input type="text" class="form-control" name="email" v-model="email" placeholder="Enter admin's email">
          <div class="input-group-append">
            <button class="btn btn-outline-success" @click="addAdmin()">Add</button>
          </div>
        </div>
        <div v-if="notExistingAdmin">{{message}}</div>



        <div v-if="!addEmployee" @click="addEmployee = !addEmployee" class="btn btn-outline-secondary"><i class="fas fa-user-plus"></i> Add new employee</div>
        <div class="input-group" v-else>
          <input type="text" class="form-control" name="emailEmployee" v-model="emailEmployee" placeholder="Enter employees's email">
          <div class="input-group-append">
            <button class="btn btn-outline-success" @click="addEmployees()">Add</button>
          </div>
        </div>
        <div v-if="notExistingEmployee">{{message}}</div>




      </div> -->


      <h4>Company's admins:</h4>
      <ul class="list-group list-group-flush mb-5">
        <li class="list-group-item" v-for="admin in admins">
          {{ admin.usr_name }} {{ admin.usr_surname }}
          <span class="small"> --- {{ admin.usr_email }}</span>

          <!-- <span class="text-right" :id="admin.usr_id" @click='removeAdmin(admin.usr_id)'>
            <i class="fas fa-times text-danger"></i>
          </span> -->

        </li>
        <!-- <li class="list-group-item">
          <div v-if="!add" @click="add = !add"><i class="fas fa-user-plus"></i> Add new admin</div>
          <div class="input-group" v-else>
            <input type="text" class="form-control" name="email" v-model="email" placeholder="Enter user's email">
            <div class="input-group-append">
              <button class="btn btn-outline-success" @click="addAdmin()">Add</button>
            </div>
          </div>
        </li>
        <li v-if="notExistingAdmin" class="list-group-item">{{message}}</li> -->
      </ul>
<!-- {{admins}} -->

      <h4>Company's employees:</h4>
      <ul class="list-group list-group-flush mb-5">
        <li class="list-group-item" v-for="employee in employees">
          {{ employee.name }}
          <span class="small"> --- {{ employee.email }}</span>
        </li>

        <!-- <li class="list-group-item">
          <div v-if="!addEmployee" @click="addEmployee = !addEmployee"><i class="fas fa-user-plus"></i> Add new employee</div>
          <div class="input-group" v-else>
            <input type="text" class="form-control" name="emailEmployee" v-model="emailEmployee" placeholder="Enter user's email">
            <div class="input-group-append">
              <button class="btn btn-outline-success" @click="addEmployees()">Add</button>
            </div>
          </div>
        </li>
        <li v-if="notExistingEmployee" class="list-group-item">{{message}}</li> -->
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
      // emailEmployee: '',
      add: false,
      addEmployee: false,
      admins: [],
      addEmployee: false,
      employees: [],
      notExistingAdmin: false,
      notExistingEmployee: false,
      message: 'prazno',
      text: 'New...?'
    }
  },

  methods: {

    changeCompanyName() {
      axios.put('http://671n121.mars-t.mars-hosting.com/mngapi/users/companies/:comid/changename', {
        comid: 13,
        companyname: this.company,
        sid: window.localStorage.getItem('sid')
      })
    },

    removeAdmin(idAdmin) {
      axios.put('http://671n121.mars-t.mars-hosting.com/mngapi/companies/:comid/admins', {
        comid: 13,
        companyname: this.company,
        id: idAdmin,
        sid: window.localStorage.getItem('sid')
      })
    },

    addAdmin() {
      axios.post('http://671n121.mars-t.mars-hosting.com/mngapi/companies/:comid/admins', {
        comid: 13,
        email: this.email,
        sid: window.localStorage.getItem('sid')
      }).then(response => {
        if (response.data.status === 'ERR') {
          this.notExistingAdmin = true;
          this.message = response.data.message;
        } else {
          this.notExistingAdmin = false;
        }
        this.loadAdmins();
      })


    },

    addEmployees() {
      axios.post('http://671n121.mars-t.mars-hosting.com/mngapi/companies/:comid/users', {
        comid: 13,
        email: this.email,
        sid: window.localStorage.getItem('sid')
      }).then(response => {
        if (response.data.status === 'ERR') {
          this.notExistingEmployee = true;
          this.message = response.data.message;
        } else {
          this.notExistingEmployee = false;
        }
        this.loadEmployees();
      })


    },

    loadAdmins() {
      axios.get('http://671n121.mars-t.mars-hosting.com/mngapi/companies/:comid/admins', {
        params: {
          comid: 13,
          sid: window.localStorage.getItem('sid')
        }
      }).then(response => {
        this.admins = response.data.data;
        //console.log(response.data);
      })
    },

    loadEmployees() {
      axios.get('http://671n121.mars-t.mars-hosting.com/mngapi/companies/:comid/users', {
        params: {
          comid: 13,
          sid: window.localStorage.getItem('sid')
        }
      }).then(response => {
        this.employees = response.data.data;
        // console.log(this.employees);
        //console.log(response.data);
      })
    }

  },

  mounted() {



    this.loadAdmins();
    this.loadEmployees();

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.add-section {
  padding-top: 50px;
}
</style>
