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
  <h4>Add new user:</h4>
  <div class="input-group mb-5">
    <input type="text" class="form-control" placeholder="Enter user's email address" v-model="useremail">
    <div class="input-group-append">
      <button class="btn btn-outline-secondary" type="button" @click="addAdmin()">As admin</button>
      <button class="btn btn-outline-secondary" type="button" @click="addMember()">As employee</button>
    </div>
  </div>
  <div class="mb-5" v-if="notExistingAdmin">{{message}}</div>
  <div class="mb-5" v-if="notExistingMember">{{message}}</div>

  <!-- List of team's admins -->
  <h4>Team's admins:</h4>
  <ul class="list-group list-group-flush mb-5">
    <li class="list-group-item" v-for="admin in admins">
      {{admin.usr_name}} {{admin.usr_surname}}<span class="small"> --- {{admin.usr_email}}</span>
    </li>
  </ul>

  <!-- List of team's employees -->
  <h4>Team's employees:</h4>
  <ul class="list-group list-group-flush mb-5">
    <li class="list-group-item" v-for="employee in employees">
      {{employee.name}}<span class="small"> --- {{employee.email}}</span>
    </li>
  </ul>

</div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      teamname: "",
      useremail: "",
      message: "",

      notExistingAdmin: false,
      notExistingMember: false,

      admins: [],
      members: []
    };
  },

  methods: {
    changeTeamName() {
      axios.put("LINKTOAPI", {
        teamid: 13, //treba ubaciti iz stora? neki teamID onog tima koja je odabran u side meniju
        teamname: this.teamname,
        sid: window.localStorage.getItem("sid")
      });
    },

    addAdmin() {
      axios
        .post("LINKTOAPI", {
          teamid: 13, //treba ubaciti iz stora? neki teamID onog tima koja je odabran u side meniju
          email: this.email,
          sid: window.localStorage.getItem("sid")
        })
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

    addMember() {
      axios
        .post("LINKTOAPI", {
          teamid: 13, //treba ubaciti iz stora? neki teamID onog tima koja je odabran u side meniju
          email: this.email,
          sid: window.localStorage.getItem("sid")
        })
        .then(response => {
          if (response.data.status === "ERR") {
            this.notExistingMember = true;
            this.message = response.data.message;
          } else {
            this.notExistingMember = false;
          }
          this.loadMembers();
        });
    },

    loadAdmins() {
      axios
        .get("LINKTOAPI", {
          params: {
            teamid: 13, //treba ubaciti iz stora? neki teamID onog tima koja je odabran u side meniju
            sid: window.localStorage.getItem("sid")
          }
        })
        .then(response => {
          this.admins = response.data.data;
        });
    },

    loadMembers() {
      axios
        .get("LINKTOAPI", {
          params: {
            teamid: 13, //treba ubaciti iz stora? neki teamID onog tima koja je odabran u side meniju
            sid: window.localStorage.getItem("sid")
          }
        })
        .then(response => {
          this.members = response.data.data;
        });
    }
  },

  mounted() {
    this.loadAdmins();
    this.loadMembers();
  }
};
</script>

<style scoped>
  .edit-team h4{
    color:#eee;
  }
</style>
