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
    <input type="text" class="form-control darkTheme" placeholder="Enter user's email address" v-model="email">
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

export default {

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
    };
  },

  validations: {
    companyname: {
      required,
      minLength: minLength(3)
    }
  },

  methods: {
    addCompany() {
      // if (!this.$v.$invalid) {
      api.addCompany(this.companyname, this.companydesc, window.localStorage.getItem('sid'));
      // }
    },

    addAdminLocal() {
      this.users.push({
        "name": this.email,
        "id": "zameniti",
        "isAdmin": true
      });
    },

    addEmployeesLocal() {
      this.users.push({
        "name": this.email,
        "id": "zameniti",
        "isAdmin": false
      });
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
}
</script>
