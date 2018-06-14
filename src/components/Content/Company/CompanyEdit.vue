<template>
<div class="lightGrayText">

  <h4 class="yellowText">Change company info:</h4>
  <label for="companyname" class="mt-3 yellowText">Company name</label>

  <input type="text" class="form-control mb-3 darkTheme" id="companyname" v-model="companyname"  v-bind:placeholder="namePlaceholder">
<!-- {{companyInfo.title}} -->
<!-- placeholder="Enter the name of the company you're creating" -->

  <label for="companydesc" class="yellowText">Description</label>
  <textarea class="form-control mb-3 darkTheme" id="companydesc" rows="3" v-model='companydesc' v-bind:placeholder="descriptionPlaceholder" spellcheck="false"></textarea>

  <button @click="changeCompanyInfo()" class="btn btn-outline-secondary mb-5 yellowText">Change company info</button>

  <h4 class="yellowText">Add new user:</h4>
  <div class="input-group">
    <input type="text" class="form-control darkTheme" placeholder="Enter user's email address" v-model="email">
    <div class="input-group-append">
      <button class="btn btn-outline-secondary yellowText" type="button" @click="addAdmin()">As admin</button>
      <button class="btn btn-outline-secondary yellowText" type="button" @click="addEmployees()">As employee</button>
    </div>

  </div>
  <div class="text-danger" v-if="notExistingAdmin">{{message}}</div>
  <div class="text-danger" v-if="notExistingEmployee">{{message}}</div>

  <h4 class="mt-5 yellowText">Company's admins:</h4>
  <ul class="list-group list-group-flush mb-5">
    <li class="list-group-item darkBackground" v-for="admin in admins">
      {{ admin.usr_name }} {{ admin.usr_surname }}
      <span class="small"> --- {{ admin.usr_email }}</span>
    </li>
  </ul>

  <h4 class="yellowText">Company's employees:</h4>
  <ul class="list-group list-group-flush mb-5">
    <li class="list-group-item darkBackground" v-for="employee in employees">
      {{ employee.name }}
      <span class="small"> --- {{ employee.email }}</span>
    </li>
  </ul>

  <!-- <multiselect v-model="value" :options="options" placeholder="Select one" :preserveSearch="true" label="name" :custom-label="nameWithLang" track-by="email" ref="inputField" @search-change="funkcija()"></multiselect> -->

  <!-- <br><br><br><br><br> -->

</div>
</template>

<script>
import axios from "axios";
import {
  api
} from "@/api/index";
import {
  store
} from "@/store/index.js";
import {
  mapGetters
} from "vuex";
import { mapState } from "vuex";

import Multiselect from "vue-multiselect";



export default {
  components: {
    Multiselect
  },

  data() {
    return {
      em: 'pocetak',
      companyname: undefined,
      companydesc: undefined,
      email: "",
      admins: [],
      employees: [],
      notExistingAdmin: false,
      notExistingEmployee: false,
      message: "prazno",

      value: {},
      options: [],
    };
  },

  methods: {
    getCompanyInfo(compID) {
      store.dispatch("getCompanyInfo", {
        compID: compID
      });
    },

    nameWithLang({
      name,
      surname,
      email
    }) {
      return name + ' ' + surname + ' --- ' + email
    },


    funkcija() {
      axios.get('http://671n121.mars-t.mars-hosting.com/mngapi/users', {
        params: {
          searchstring: this.$refs.inputField.search,
          sid: window.localStorage.sid,
        }
      }).then(response => {
        // console.log();
        if (response.data.data != undefined) {
          this.options = response.data.data;
        }
      });
    },

    pozivapija() {
      store.dispatch('refreshSuggestions', {
        searchText: '@',
        comId: this.$store.state.itemAction.edit
      }).then(response => {
        this.options = store.getters.getSuggestedUsers;
      });
      // console.log();
    },



    changeCompanyInfo() {
      api.changeCompanyInfo(this.companyname, this.companydesc, this.$store.state.itemAction.edit, window.localStorage.getItem("sid"));

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
      api.addAdmin(this.$store.state.itemAction.edit, this.email, window.localStorage.getItem("sid")).then(response => {
        console.log(window.localStorage.getItem("sid"));
        if (response.data.status === "ERR") {
          this.notExistingAdmin = true;
          this.message = response.data.message;
        } else {
          this.notExistingAdmin = false;
        }
        this.loadAdmins(this.$store.state.itemAction.edit);
      });
    },

    addEmployees() {
      api.addEmployee(this.$store.state.itemAction.edit, this.email, window.localStorage.getItem("sid")).then(response => {
        if (response.data.status === "ERR") {
          this.notExistingEmployee = true;
          this.message = response.data.message;
        } else {
          this.notExistingEmployee = false;
        }
        this.loadEmployees(this.$store.state.itemAction.edit);
      });
    },

    // NE BRISI!!!!
    // loadAdmins(compID) {
    //   store.dispatch("loadAdmins", {
    //     compID: compID
    //   });
    // },
    //
    // loadEmployees(compID) {
    //   store.dispatch("loadEmployees", {
    //     compID: compID
    //   });

    loadAdmins(comID) {
      api.loadAdmins(comID, window.localStorage.getItem("sid")).then(response => {
        this.admins = response.data.data;
      });
    },

    loadEmployees(comID) {
      api.loadEmployees(comID, window.localStorage.getItem("sid")).then(response => {
        this.employees = response.data.data;
      });
    }
  },

  computed: {
    namePlaceholder(){
      let name = this.companyInfo.title;
      if(name==null) return "Enter the name of the company you're creating";
      else return name;
    },

    descriptionPlaceholder(){
      let description = this.companyInfo.description;
      if(description==null) return "Tell us a little something about your company...";
      else return description;
    },

    ...mapState({
      companyInfo: state => state.modulecompany.companyInfo
    }),

    ...mapGetters({
      selectedCompanyID: "selectedItemID"
    }),

    editID() {
      return store.state.itemAction.edit;
    },

    // suggestions() {
    //   this.options = store.getters.getSuggestedUsers;
    // }
  },

  mounted() {
    this.getCompanyInfo(store.state.itemAction.edit);
    this.loadAdmins(store.state.itemAction.edit);
    this.loadEmployees(store.state.itemAction.edit);
  },

  watch: {
    editID: function(val, oldVal) {
      this.getCompanyInfo(val);
      this.loadAdmins(val);
      this.loadEmployees(val);
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
