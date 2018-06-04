<template>
<div>

    <!-- Changing company name -->
    <h4>Change company name:</h4>
    <div class="input-group mb-5">
      <input type="text" class="form-control" name="companyname" v-model="company" placeholder="Enter new company name">
      <div class="input-group-append">
        <button class="btn btn-outline-secondary" @click="changeCompanyName()">Change</button>
      </div>
    </div>

    <!-- Adding new admins/employees -->
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

    <!-- List of all company's admins -->
    <h4>Company's admins:</h4>
    <ul class="list-group list-group-flush mb-5">
      <li class="list-group-item" v-for="admin in admins">
        {{ admin.usr_name }} {{ admin.usr_surname }}
        <span class="small"> --- {{ admin.usr_email }}</span>
      </li>
    </ul>

    <!-- List of all company's employees -->
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
import axios from "axios";
import { store } from "@/store/index.js";
import { mapGetters } from "vuex";
import Multiselect from "vue-multiselect";

export default {
  components: {
    Multiselect
  },

  data() {
    return {
      company: "",
      email: "",
      admins: [],
      employees: [],
      notExistingAdmin: false,
      notExistingEmployee: false,
      message: "prazno"
    };
  },

  methods: {
    changeCompanyName() {
      axios.put(
        "http://671n121.mars-t.mars-hosting.com/mngapi/users/companies/:comid/changename",
        {
          comid: this.selectedCompanyID,
          companyname: this.company,
          sid: window.localStorage.getItem("sid")
        }
      );
    },

    removeAdmin(idAdmin) {
      axios.put(
        "http://671n121.mars-t.mars-hosting.com/mngapi/companies/:comid/admins",
        {
          comid: this.selectedCompanyID,
          companyname: this.company,
          id: idAdmin,
          sid: window.localStorage.getItem("sid")
        }
      );
    },

    addAdmin() {
      axios
        .post(
          "http://671n121.mars-t.mars-hosting.com/mngapi/companies/:comid/admins",
          {
            comid: this.selectedCompanyID,
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
          this.loadAdmins();
        });
    },

    addEmployees() {
      axios
        .post(
          "http://671n121.mars-t.mars-hosting.com/mngapi/companies/:comid/users",
          {
            comid: this.selectedCompanyID,
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
          this.loadEmployees();
        });
    },

    loadAdmins(comID) {
      axios
        .get(
          "http://671n121.mars-t.mars-hosting.com/mngapi/companies/:comid/admins",
          {
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
          "http://671n121.mars-t.mars-hosting.com/mngapi/companies/:comid/users",
          {
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
    })
  },

  mounted() {
    this.loadAdmins();
    this.loadEmployees();
  },

  watch: {
    selectedCompanyID: function(val, oldVal) {
      this.loadAdmins(val);
      this.loadEmployees(val);
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css">
<style scoped>
</style>
