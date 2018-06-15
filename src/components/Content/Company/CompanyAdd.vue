<template>
<div class="lightGrayText">

  <h4 class="yellowText">Adding company:</h4>

  <label for="companyname" class="yellowText mt-3">Company name</label>
  <input class="form-control darkTheme" placeholder="Enter the name of the company you're creating" id="companyname" />
  <!-- v-model.trim="$v.companyname.$model" -->
  <!-- <small class="form-text text-danger" v-if="!$v.companyname.minLength">Company name must have at least {{$v.companyname.$params.minLength.min}} characters.</small> -->
  <!-- <small class="form-text text-danger" v-if="!$v.companyname.required">Field is required.</small> -->

  <label for="companydesc" class="yellowText mt-3">Description</label>
  <textarea class="form-control darkTheme mb-3" id="companydesc" rows="3" v-model='companydesc' placeholder="Tell us a little something about your company..." spellcheck="false"></textarea>

  <h4 class="yellowText">Add new user:</h4>
  <div class="input-group">
    <!-- <input type="text" class="form-control darkTheme" placeholder="Enter user's email address" v-model="email"> -->
    <multiselect v-model="value"  class="form-control darkTheme" :options="options" placeholder="Select one" label="name" :custom-label="fullName" track-by="id" ref="userInput" @search-change='populateUserList' @select='clearUserInput'></multiselect>
    <div class="input-group-append">
      <button class="btn btn-outline-secondary yellowText" type="button" @click="addAdminLocal()">As admin</button>
      <button class="btn btn-outline-secondary yellowText" type="button" @click="addEmployeesLocal()">As employee</button>
    </div>

  </div>


  <h4 class="mt-5 yellowText">Company's admins:</h4>
  <ul class="list-group list-group-flush mb-5">
    <li class="list-group-item darkBackground" v-for="admin in adminUsers">
      {{ admin.name }}
    </li>
  </ul>

  <h4 class="yellowText">Company's employees:</h4>
  <ul class="list-group list-group-flush mb-5">
    <li class="list-group-item darkBackground" v-for="employee in employeeUsers">
      {{ employee.name }}
    </li>
  </ul>

  <button @click="addCompany()" class="btn btn-outline-secondary yellowText">Add company</button>



<br><br><br><br><br>
<!-- <multiselect v-model="value" :options="options" placeholder="Select one" label="name" :custom-label="fullName" track-by="id" ref="userInput" @search-change='populateUserList' @select='clearUserInput'></multiselect> -->
<br><br><br><br><br>





</div>
</template>

<script>
import {
  api
} from "@/api/index";
import {
  required,
  minLength
} from 'vuelidate/lib/validators'
import Multiselect from "vue-multiselect";
import axios from "axios";
var interval;

export default {
  components: {
    Multiselect
  },

  data() {
    return {
      companyname: '',
      companydesc: '',
      email: "",
      users: [],
      admins: [],
      employees: [],
      notExistingAdmin: false,
      notExistingEmployee: false,
      message: "prazno",


      value: [],
      options: [],
    };
  },

  validations: {
    companyname: {
      required,
      minLength: minLength(3)
    }
  },

  methods: {

        fullName({ name, surname, email }) {
          return name + ' ' + surname + ' --- ' + email
        },

    populateUserList(){

      // interval = setInterval(() => {

          // this.populateUserList();



      if(this.$refs.userInput.search !== ''){
        axios.get('http://671n121.mars-t.mars-hosting.com/mngapi/users', {
          params: {
            sid: window.localStorage.sid,
            searchstring: this.$refs.userInput.search
          }
        }).then(response => {
          this.options = response.data.data;
          // console.log(response.data.data)
      });
      // console.log();
}

    // }, 2500);


},

    clearUserInput(){
      this.options = [];
    },

    addCompany() {
      // if (!this.$v.$invalid) {
      api.addCompany(this.companyname, this.companydesc, window.localStorage.getItem('sid'));
      // }
    },

    addAdminLocal() {
      this.users.push({
        "name": this.value.name + ' ' + this.value.surname ,
        "id": this.value.id,
        "isAdmin": true
      });

      this.email = '';
    },

    addEmployeesLocal() {
      this.users.push({
        "name": this.value.name + ' ' + this.value.surname ,
        "id": this.value.id,
        "isAdmin": false
      });

      this.email = '';
    }
  },

  computed: {
    adminUsers: function() {
      return this.users.filter(function(u) {
        return u.isAdmin
      })
    },

    employeeUsers: function() {
      return this.users.filter(function(u) {
        return !u.isAdmin
      })
    }
  }

  // created: function() {
  // if (this.$refs.userInput.search !== '') {
  //   interval = setInterval(() => {
  //
  //       this.populateUserList();
  //     }, 2500);
  //   }
  // },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css">
