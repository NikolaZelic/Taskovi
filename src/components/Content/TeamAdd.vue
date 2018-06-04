<template>
<div>
  <h1 class="display-4">Create team:</h1><br>

  <!-- IZBOR KOMPANIJE -->
  <select v-if='usersCompanies!==undefined && usersCompanies.length>1'  v-model="choosenCompany">
    <option value="" disabled selected>Choose company</option>
    <option v-for='company in usersCompanies' v-bind:value="company">{{ company.title }}</option>
  </select>
  <div class="" v-if='usersCompanies!==undefined && usersCompanies.length===1'>
    <span>Company: </span><span>{{ choosenCompany.title }}</span>
  </div>
  <!-- TEAM NAME -->
  <div class="form-group">
    <label for="team_name">Team name</label>
    <input v-model='teamName' type="text" class="form-control" id="team_name" placeholder="Enter the name of the team you're creating">
  </div>

  <!-- ADDING MEMBERS -->
  <label for="pro_leader">Members</label>
  <div class="form-group input-group">
      <vue-autosuggest
        ref="suggestionTag"
        :suggestions="[ { data: suggestions } ]"
        :renderSuggestion="renderSuggestion"
        @click="clickHandler" :onSelected="onSelected"
        :inputProps="{class:'autosuggest__input', onInputChange: this.onInputChange, placeholder:'Enter user'}"
        :getSuggestionValue = "getSuggestionValue"
      />
      </vue-autosuggest>
    <div class="input-group-append">
      <button @click='addUser()' class="btn btn-outline-secondary" type="button">Add</button>
    </div>
  </div>

  <!-- LIST OF ADDED MEMBERS -->
  <div class="form-group">
    <ul v-for='(member, i) in addedMembers' class="list-group list-group-flush">
      <!-- <li class="list-group-item"><img class="rounded-circle"  width='40' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_0vsuZqoaKVIUsjkshzBaVCI3MnbjpWE6U89CcfnBDAThVPFrJA"> Nikola Tesla</li>
            <li class="list-group-item"><img class="rounded-circle"  width='40' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1X8vC7CuE73-54q6KhtS61VyGRd7_ZmKZK7Rxyl9PZ8U6rj_pPQ"> Milutin Milankovic</li>
            <li class="list-group-item"><img class="rounded-circle"  width='40' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7xe3UC_yHpG9nFYfasqFHBHDWBoyr3B4UM80d9VId52f9i7O2_Q"> Milan Obrenovic</li> -->
      <li>
        <button type="button" @click='addedMembers.splice(i,1)'>Remove</button>
        <span class='member-data'>{{ member.name }}</span>
        <span class='member-data'>{{ member.surname }}</span>
        <span class='member-data'>{{ member.email }}</span>
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
import {
  store
} from "@/store/index.js";
import {
  VueAutosuggest
} from 'vue-autosuggest';
import axios from 'axios';

var interval;

export default {
  components: {
    VueAutosuggest,
  },
  data() {
    return {
      teamName: "",
      userToAdd: null,
      addedMembers: [],
      errorMsg: '', // Ovo treba podesiti na prazan string svaki put kada korisnik neto uradi, cisto kaku mu ne bi stalno stajao error na ekranu
      // inputText: '',
      haveChange: 0,
      choosenCompany: '',
    };
  },
  computed: {
    suggestions() {
      return store.getters.getSuggestedUsers;
    },

    usersCompanies(){
      // console.log('Computed za sugestije');
      var a = store.getters.getUsersCompanies;
      // Ukoliko pripada samo jednoj kompaniji automatski je selektovana
      if(a!==undefined){
        if(a.length===1){
          this.choosenCompany = a[0];
        }
      }
      return a;
    },

    inputText(){
      return this.$refs.suggestionTag.searchInput;
    }
  },

  watch: {
    choosenCompany: function(){
      this.addedMembers = [];
    },

    errorMsg: function(){
      if( this.errorMsg != '' )
        setTimeout( () =>{
            this.errorMsg = '';
          } , 3000);
    }
  },

  created(){
    // Citanje userovih kompanije ako vec nisu procitane
    if( this.usersCompanies===undefined ){
      store.dispatch('selectUsersCompanies');
    }

    interval = setInterval( ()=>{
      if( this.haveChange===1 && this.inputText.length>0 && this.choosenCompany.id!==undefined ){
        this.pozivapija();
        this.haveChange = 0;
      }
    }, 500);
  },

  destroy(){
    clearInterval(interval);
  },

  methods: {
    pozivapija(){
      store.dispatch('refreshSuggestions', { searchText: this.inputText, comId: this.choosenCompany.id });
    },

    addUser(){
       if(this.userToAdd===null){
         if( this.inputText != null && this.inputText.length > 0 ){
           this.errorMsg = 'Unknown user';
           return;
         }
         this.errorMsg = 'You have to enter user';
         return;
       }
       // Provera da li je user vec dodat
       var id = this.userToAdd.id;
       var duplikat = false;
       this.addedMembers.forEach( e => {
          if( e.id == id )
          {
            this.errorMsg = 'User is already added';
            this.userToAdd = null;
            store.dispatch('cleanSuggestions');
            duplikat = true;
            this.$refs.suggestionTag.searchInput = "";
          }
       });
       if( duplikat )
        return;
       this.addedMembers.push(this.userToAdd);
       this.userToAdd = null;
       store.dispatch('cleanSuggestions');
       this.$refs.suggestionTag.searchInput = "";
    },
    createTeam() {
      if(this.teamName.length==0){
        this.errorMsg = "You have to enter team name";
        return;
      }
      if (this.addedMembers.length == 0) {
        this.errorMsg = "You have to add user(s) to team.";
        return;
      }
      if( this.choosenCompany.id===undefined ){
        this.errorMsg = 'You have to choose company';
        return;
      }
    },
    // Metode za AutoSuggest komponentu, hendleri
    onInputChange(text, oldText){
      // this.inputText = text;
      if( text.length == 0 ){
        store.dispatch('cleanSuggestions');
        this.haveChange = 0;
        return;
      }
      this.haveChange = 1;
    },
    onSelected(item) {
      if( item == null || item == undefined )
        return;
       this.userToAdd = item.item;
    },
    clickHandler(item) {
    },
    renderSuggestion(suggestion){
       var i = suggestion.item;
       return i.name+" "+i.surname+" "+i.email;
    },
    getSuggestionValue(item){
        var i = item.item;
        return i.name+' '+i.surname+' '+i.email;
    }
  }
}
</script>

<style scoped>
.task-add-section {
  padding-top: 50px;
}
.error{
  color: red;
}
.suggestions-content {
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}
</style>
<style media="screen">
.autosuggest__input {
  outline: none;
  position: relative;
  display: block;
  font-family: monospace;
  font-size: 20px;
  border: 1px solid #616161;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box
}
#autosuggest__input.autosuggest__input-open {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0
}
.autosuggest__results-container {
  position: relative;
  width: 100%
}
.autosuggest__results {
  font-weight: 300;
  margin: 0;
  position: absolute;
  z-index: 10000001;
  width: 100%;
  border: 1px solid #e0e0e0;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  background: #fff;
  padding: 0
}
.autosuggest__results ul {
  list-style: none;
  padding-left: 0;
  margin: 0
}
.autosuggest__results .autosuggest__results_item {
  cursor: pointer;
  padding: 15px
}
#autosuggest ul:first-child>.autosuggest__results_title {
  border-top: none
}
.autosuggest__results .autosuggest__results_title {
  color: gray;
  font-size: 11px;
  margin-left: 0;
  padding: 15px 13px 5px;
  border-top: 1px solid #d3d3d3
}
.autosuggest__results .autosuggest__results_item.autosuggest__results_item-highlighted,
.autosuggest__results .autosuggest__results_item:active,
.autosuggest__results .autosuggest__results_item:focus,
.autosuggest__results .autosuggest__results_item:hover {
  background-color: #ddd
}
</style>
