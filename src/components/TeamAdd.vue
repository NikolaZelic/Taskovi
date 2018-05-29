<template>
<div>
      <h1 class="display-4">Create team:</h1><br>
        <!-- TEAM NAME -->
        <div class="form-group">
          <label for="team_name">Team name</label>
          <input v-model='teamName' type="text" class="form-control" id="team_name" placeholder="Enter the name of the team you're creating">
        </div>

        <!-- ADDING MEMBERS -->
        <label for="pro_leader">Members</label>
        <div class="form-group input-group">
          <input v-model='userToAdd.email' @focus='inputSelected=true' type="text" class="form-control" placeholder="Enter user email"/>
          <input v-model='userToAdd.name' type="text" class="form-control" id="members" placeholder="Enter user name"/>
          <input v-model='userToAdd.surname' type="text" class="form-control" id="members" placeholder="Enter user surname"/>
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button">Add</button>
          </div>
        </div>

        <!-- SUGGESTIONS -->
        <div v-show='inputSelected'  class="suggestions-content">
            <div v-for='(sug, i) in suggestions' class="suggestions-row">
              <span class='suggestion-data'>{{ sug.name }}</span>
              <span class='suggestion-data'>{{ sug.surname }}</span>
              <span class='suggestion-data'>{{ sug.email }}</span>
            </div>
        </div>

        <!-- LIST OF ADDED MEMBERS -->
        <div class="form-group">
          <ul v-for='(member, i) in addedMembers' class="list-group list-group-flush">
            <!-- <li class="list-group-item"><img class="rounded-circle"  width='40' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_0vsuZqoaKVIUsjkshzBaVCI3MnbjpWE6U89CcfnBDAThVPFrJA"> Nikola Tesla</li>
            <li class="list-group-item"><img class="rounded-circle"  width='40' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1X8vC7CuE73-54q6KhtS61VyGRd7_ZmKZK7Rxyl9PZ8U6rj_pPQ"> Milutin Milankovic</li>
            <li class="list-group-item"><img class="rounded-circle"  width='40' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7xe3UC_yHpG9nFYfasqFHBHDWBoyr3B4UM80d9VId52f9i7O2_Q"> Milan Obrenovic</li> -->
            <li>
              <span class='member-data'>{{ member.name }}</span>
              <span class='member-data'>{{ member.surname }}</span>
              <span class='member-data'>{{ member.email }}</span>
              <button type="button" @click='addedMembers.splice(i,1)' >Remove</button>
            </li>
          </ul>
        </div>

        <!-- CREATE TEAM -->
        <div class="form-group">
          <button @click='createTeam()' class="btn btn-success">Create team</button>
        </div>

        <!-- ERROR REORT -->
        <div v-show='errorMsg.length>0' class="error">
            <p>{{ errorMsg }}</p>
        </div>
</div>
</template>

<script>
import { store } from "@/store/store.js";

export default {
  data() {
    return {
      teamName: "",
      userToAdd: {
        email: '',
        name: '',
        suranme: '',
      },
      addedMembers: [
        {email:'pera@peric', name:'Pera', surname: 'Peric'},
        {email:'zika@zikic', name:'Zika', surname: 'Zikic'},
      ],
      errorMsg: '', // Ovo treba podesiti na prazan string svaki put kada korisnik neto uradi, cisto kaku mu ne bi stalno stajao error na ekranu
      inputSelected: false,
    };
  },

  computed: {
     suggestions: function(){
       return [
         {name:'Nikola', surname:"Zelic", email:"nzelic@ymail.com"},
         {name:'Pera', surname:"Peric", email:"nzelic@ymail.com"},
         {name:'Nikola', surname:"Zelic", email:"nzelic@ymail.com"}
        ];
     },
  },

  methods:{
    createTeam: function(){
        if( this.addedMembers.length==0 ){
           this.errorMsg = "You have to add user(s) to team.";
           return;
        }
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.task-add-section {
  padding-top: 50px;
}
.suggestions-content {
    position: absolute;
    background-color: #f1f1f1;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
}
.suggestions-row:hover {
   background-color: green;
}
</style>
