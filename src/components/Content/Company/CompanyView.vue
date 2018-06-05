<template>
<div >
    <!-- U slucaju da nije selektovana niti jedna konkretna kompanija prikazuje se ovo jer se ne salje axios zahtev -->
    <template v-if="selectedItemID === undefined">
      <h1>Select company first...</h1>
    </template>

    <!-- Ako je konretna kompanija selektovana onda se prikazuje ovo -->
    <template v-else>

    <!-- Osnovni podaci o kompaniji   -->
    <h1>{{companyInfo.title}}</h1>
    <span>{{companyInfo.description}}</span >

    <!-- Lista svih zaposlenih u kompaniji -->
    <h4 class="mt-5">Employees:</h4>
    <ul class="list-group list-group-flush mb-5">

      <!-- Lista admina -->
      <li class="list-group-item" v-for="admin in admins">
        {{ admin.usr_name }} {{ admin.usr_surname }} --- {{ admin.usr_email }}
        <span class="badge badge-secondary">Admin</span>
    </li>

    <!-- Lista zaposlenih koji nisu admini -->
    <li class="list-group-item" v-for="employee in employees">
      {{ employee.name }} --- {{ employee.email }}
    </li>

    </ul>

    <!-- <button type="button" class="btn btn-outline-secondary">Edit company</button> -->

  </template>
</div>
</template>

<script>
import axios from "axios";
import { store } from "@/store/index.js";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      companyInfo: [],
      admins: [],
      employees: []
    };
  },

  methods: {
    getCompanyInfo(compID) {
      axios
        .get("http://671n121.mars-t.mars-hosting.com/mngapi/companies/:comid", {
          params: {
            comid: compID,
            sid: window.localStorage.getItem("sid")
          }
        })
        .then(response => {
          this.companyInfo = response.data.data[0];
          // console.log(response.data.data[0]);
        });
    },

    loadAdmins(compID) {
      axios
        .get(
          "http://671n121.mars-t.mars-hosting.com/mngapi/companies/:comid/admins",
          {
            params: {
              comid: compID,
              sid: window.localStorage.getItem("sid")
            }
          }
        )
        .then(response => {
          this.admins = response.data.data;
        });
    },

    loadEmployees(compID) {
      axios
        .get(
          "http://671n121.mars-t.mars-hosting.com/mngapi/companies/:comid/users",
          {
            params: {
              comid: compID,
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
    // selectedCompanyID() {
    //   var a = store.getters.selectedItemID;
    //   if (a === undefined) return 0;
    //   else return a;
    // }

    ...mapGetters({
      selectedItemID: "selectedItemID"
    })
  },

  watch: {
    selectedItemID: function(val, oldVal) {
      this.getCompanyInfo(val);
      this.loadAdmins(val);
      this.loadEmployees(val);
    }
  }
};
</script>

<style scoped>
h1{
  text-align: left;
}
</style>
