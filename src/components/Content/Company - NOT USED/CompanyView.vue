<template>
<div class="lightGrayText top_padding">
  <!-- U slucaju da nije selektovana niti jedna konkretna kompanija prikazuje se ovo jer se ne salje axios zahtev -->
  <template v-if="selectedItemID === undefined">
      <h1>Select company first...</h1>
    </template>

  <!-- Ako je konretna kompanija selektovana onda se prikazuje ovo -->
  <template v-else >

    <!-- Osnovni podaci o kompaniji   -->
    <h1>{{companyInfo.title}}</h1>
    <span class="yellowText">{{companyInfo.description}}</span >

    <!-- Lista svih zaposlenih u kompaniji -->
    <h4 class="mt-5 yellowText">Employees:</h4>
    <ul class="list-group list-group-flush mb-5">

      <!-- Lista admina -->
      <li class="list-group-item darkBackground" v-for="admin in admins" :key='admin'>
        {{ admin.usr_name }} {{ admin.usr_surname }} --- {{ admin.usr_email }}
        <span class="badge yellowText">Admin</span>
    </li>

    <!-- Lista zaposlenih koji nisu admini -->
    <li class="list-group-item darkBackground" v-for="employee in employees" :key='employee'>
      {{ employee.name }} --- {{ employee.email }}
    </li>

  </ul>


    <h4 class="mt-5 yellowText">Teams:</h4>
    <ul class="list-group list-group-flush mb-5">
      <!-- Lista timova -->
<<<<<<< HEAD:src/components/Content/Company/CompanyView.vue
      <li class="list-group-item darkBackground" v-for="team in teams">
=======
      <li class="list-group-item darkBackground" v-for="team in teams" :key='team'>
>>>>>>> 06b3b156f3ce51594a4d5dce49ba44413a4c6e88:src/components/Content/Company - NOT USED/CompanyView.vue
        {{ team.title }}<br /><span class="badge yellowText">Admin</span> {{ team.admin }}
      </li>

      </ul>
    <!-- <button type="button" class="btn btn-outline-secondary">Edit company</button> -->

  </template>
</div>
</template>

<script>
import axios from "axios";
import { store } from "@/store/index.js";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      teams: []
    }
  },

  computed: {
    ...mapState({
      getCompanyID: state => state.modulecompany.id,
      admins: state => state.modulecompany.admins,
      employees: state => state.modulecompany.employees,
      companyInfo: state => state.modulecompany.companyInfo
    }),
    ...mapGetters(["selectedItemID"])
  },
  methods: {
    getCompanyInfo(compID) {
      store.dispatch("getCompanyInfo", {
        compID: compID
      });
    },

    loadAdmins(compID) {
      store.dispatch("loadAdmins", {
        compID: compID
      });
    },

    loadEmployees(compID) {
      store.dispatch("loadEmployees", {
        compID: compID
      });
    },

    loadTeams(compID){
      axios.get("http://671n121.mars-t.mars-hosting.com/mngapi/companies/:comid/teams", {
        params: {
          comid: compID,
          sid: window.localStorage.sid
        }
      }).then(response => {
        this.teams = response.data.data;
      });
    }

  },

  mounted() {
    this.getCompanyInfo(this.selectedItemID);
    this.loadAdmins(this.selectedItemID);
    this.loadEmployees(this.selectedItemID);
    this.loadTeams(this.selectedItemID);
  },

  watch: {
    selectedItemID(val, oldVal) {
      this.getCompanyInfo(val);
      this.loadAdmins(val);
      this.loadEmployees(val);
      this.loadTeams(val);
    }
  }
};
</script>

<style scoped>
h1 {
  text-align: left;
}
</style>
