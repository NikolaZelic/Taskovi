<template>
<div>

  <h4>Change company info:</h4>
  <label for="companyname" class="mt-3">Company name</label>
  <input type="text" class="form-control mb-3" id="companyname" v-model="companyname" placeholder="Enter the name of the company you're creating">

  <label for="companydesc">Description</label>
  <textarea class="form-control mb-3" id="companydesc" rows="3" v-model='companydesc' placeholder="Tell us a little something about your company..." spellcheck="false"></textarea>

  <button @click="changeCompanyInfo()" class="btn btn-outline-secondary mb-5">Change company info</button>

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

  <h4>Company's admins:</h4>
  <ul class="list-group list-group-flush mb-5">
    <li class="list-group-item" v-for="admin in admins">
      {{ admin.usr_name }} {{ admin.usr_surname }}
      <span class="small"> --- {{ admin.usr_email }}</span>
    </li>
  </ul>

  <h4>Company's employees:</h4>
  <ul class="list-group list-group-flush mb-5">
    <li class="list-group-item" v-for="employee in employees">
      {{ employee.name }}
      <span class="small"> --- {{ employee.email }}</span>
    </li>
  </ul>
</div>
</template>

<script>
import {api} from "@/api/index";
import {store} from "@/store/index.js";
import {mapGetters} from "vuex";

export default {
  data() {
    return {
      companyname: undefined,
      companydesc: undefined,
      email: "",
      admins: [],
      employees: [],
      notExistingAdmin: false,
      notExistingEmployee: false,
      message: "prazno"
    };
  },

  methods: {
    changeCompanyInfo() {


      
      axios.put(
        "http://671n121.mars-t.mars-hosting.com/mngapi/companies/:comid", {
          companyname: this.companyname,
          companydesc: this.companydesc,
          comid: this.$store.state.itemAction.edit,
          sid: window.localStorage.getItem("sid")
        }
      );
    },

    removeAdmin(idAdmin) {
      axios.put(
        "http://671n121.mars-t.mars-hosting.com/mngapi/companies/:comid/admins", {
          comid: this.selectedCompanyID,
          companyname: this.company,
          id: idAdmin,
          sid: window.localStorage.getItem("sid")
        }
      );
    },

    addAdmin() {
      axios.post(
          "http://671n121.mars-t.mars-hosting.com/mngapi/companies/:comid/admins", {
            comid: this.$store.state.itemAction.edit,
            email: this.email,
            sid: window.localStorage.getItem("sid")
          }
        )
        .then(response => {
          if (response.data.status === "ERR") {
            this.notExistingAdmin = true;
            this.message = response.data.message;
          } else {
            this.notExistingAdmin = false;
          }
          //this.loadAdmins();
        }).then(response => {
          this.loadAdmins(this.$store.state.itemAction.edit);
        });
    },

    addEmployees() {
      axios
        .post(
          "http://671n121.mars-t.mars-hosting.com/mngapi/companies/:comid/users", {
            comid: this.$store.state.itemAction.edit,
            email: this.email,
            sid: window.localStorage.getItem("sid")
          }
        )
        .then(response => {
          if (response.data.status === "ERR") {
            this.notExistingEmployee = true;
            this.message = response.data.message;
          } else {
            this.notExistingEmployee = false;
          }
        }).then(response => {
          this.loadEmployees(this.$store.state.itemAction.edit);
        });;
    },

    loadAdmins(comID) {
      axios
        .get(
          "http://671n121.mars-t.mars-hosting.com/mngapi/companies/:comid/admins", {
            params: {
              comid: comID,
              sid: window.localStorage.getItem("sid")
            }
          }
        )
        .then(response => {
          this.admins = response.data.data;
        });
    },

    loadEmployees(comID) {
      axios
        .get(
          "http://671n121.mars-t.mars-hosting.com/mngapi/companies/:comid/users", {
            params: {
              comid: comID,
              sid: window.localStorage.getItem("sid")
            }
          }
        )
        .then(response => {
          this.employees = response.data.data;
        });
    }
  },

  computed: {
    ...mapGetters({
      selectedCompanyID: "selectedItemID"
    }),

    editID() {
      return store.state.itemAction.edit;
    }
  },

  mounted() {
    this.loadAdmins(store.state.itemAction.edit);
    this.loadEmployees(store.state.itemAction.edit);
  },

  watch: {
    editID: function(val, oldVal) {
      this.loadAdmins(val);
      this.loadEmployees(val);
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
