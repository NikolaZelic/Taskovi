<template>
<div>
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
import {
  store
} from "@/store/index.js";
import {
  mapState
} from 'vuex';
import {
  mapGetters
} from 'vuex'

export default {
  computed: {
    ...mapState({
      getCompanyID: 'companyID',
      admins: state => state.modulecompany.admins,
      employees: state => state.modulecompany.employees,
      companyInfo: state => state.modulecompany.companyInfo,
    }),
    ...mapGetters([
      'selectedItemID',
    ]),
  },
  methods: {
    getCompanyInfo(compID) {
      store.dispatch('getCompanyInfo', {
        compID: compID,
      });
    },

    loadAdmins(compID) {
      store.dispatch('loadAdmins', {
        compID: compID,
      });
    },

    loadEmployees(compID) {
      store.dispatch('loadEmployees', {
        compID: compID,
      });
    },
  },

  mounted() {
    this.getCompanyInfo(this.selectedItemID);
    this.loadAdmins(this.selectedItemID);
    this.loadEmployees(this.selectedItemID);
  },

  watch: {
    selectedItemID(val, oldVal) {
      this.getCompanyInfo(val);
      this.loadAdmins(val);
      this.loadEmployees(val);
    }
  }
};
</script>

<style scoped>
h1 {
  text-align: left;
}
</style>
