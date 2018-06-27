<template>
<div class="edit-team">

  <!-- Changing team's name -->
  <h4>Change team name:</h4>
  <div class="input-group mb-5">
    <input type="text" class="form-control" name="teamname" v-model="teamname" placeholder="Enter new team name">
    <div class="input-group-append">
      <button class="btn btn-outline-secondary" @click="changeCompanyName()">Change</button>
    </div>
  </div>

  <!-- Adding new team members -->
  <vue-autosuggest ref="suggestionTag" :suggestions="[ { data: suggestions } ]" :renderSuggestion="renderSuggestion" @click="clickHandler" :onSelected="onSelected" :inputProps="{class:'autosuggest__input', onInputChange: this.onInputChange, placeholder:'Enter user'}"
    :getSuggestionValue="getSuggestionValue" />

  <!-- List of team's admins -->
  <h4>Team's admins:</h4>
  <ul class="list-group list-group-flush mb-5">
    <li class="list-group-item" v-for="admin in admins" :key='admin'>
      {{admin.usr_name}} {{admin.usr_surname}}<span class="small"> --- {{admin.usr_email}}</span>
    </li>
  </ul>

  <!-- List of team's employees -->
  <h4>Team's employees:</h4>
  <ul class="list-group list-group-flush mb-5">
    <li class="list-group-item" v-for="employee in members" :key='employee'>
      {{employee.name}}<span class="small"> --- {{employee.email}}</span>
    </li>
  </ul>

</div>
</template>

<script>
import {VueAutosuggest} from 'vue-autosuggest';
import {store} from "@/store/index.js";
import {api} from '@/api/index.js';
export default {
  components:{
    VueAutosuggest
  },
  data() {
    return {
      teamId: store.state.itemAction.edit,
      teamname: "",
      useremail: "",
      message: "",

      interval:null,

      notExistingAdmin: false,
      notExistingMember: false,

      admins: [],
      members: []
    };
  },
  computed:{
    suggestions() {
      return store.getters.getSuggestedUsers;
    }
  },
  methods: {

    changeTeamName() {

    },

    addAdmin() {

    },

    addMember() {

    },
    loadTeam(){
      api.getTeam(this.teamId).then(response=>{
        this.teamname = response.data.data[0].title;
      })
    },
    loadAdmins() {

      api.getTeamAdmins(this.teamId).then(response=>{
        console.log(response);
        this.admins= response.data.data;
      })
    },

    loadMembers() {
      api.getTeamMembers(this.teamId).then(response=>{
        this.members=response.data.data;
      });
    }
  },

  mounted() {
    this.loadTeam();
    this.loadMembers();
    this.loadAdmins();
    // this.interval = setInterval(() => {
    //   if (this.haveChange === 1 && this.inputText.length > 0 && this.choosenCompany.id !== undefined) {
    //     this.pozivapija();
    //     this.haveChange = 0;
    //   }
    // }, 500);
  },
  destroy: function() {
    clearInterval(interval);
  },
};
</script>

<style scoped>
  .edit-team h4{
    color:#eee;
  }
</style>
