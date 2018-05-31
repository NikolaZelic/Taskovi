Skip to content

Search or jump to…

Pull requests
Issues
Marketplace
Explore
 @MilosPaunovic
Sign out
0
0 0 NikolaZelic/Taskovi
 Code  Issues 0  Pull requests 0  Projects 0  Wiki  Insights
Taskovi/src/components/Content/TeamAdd.vue
c74fec5  14 minutes ago
@NikolaZelic NikolaZelic Pre mergovanja sa Milosem

257 lines (219 sloc)  6.47 KB
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
      <vue-autosuggest
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

  <button @click='test' type="button" name="button">Test</button>
</div>
</template>

<script>
import {
  store
} from "@/store/index.js";
import {
  VueAutosuggest
} from 'vue-autosuggest';
import lodash from 'lodash';
import axios from 'axios';
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
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
      testbr: 1,
      inputText: null,
    };
  },
  computed: {
    suggestions: function() {
      return store.getters.getSuggestedUsers;
    },
  },
  methods: {
    test: function(){
      this.testbr++;
      source.cancel('Operation canceled by the user.');
    },
    pozivapija: function(){
      axios.get('http://671n121.mars-t.mars-hosting.com/mngapi/test',
      {
       cancelToken: source.token
      })
      .catch(function(thrown) {
       if (axios.isCancel(thrown)) {
         console.log('Request canceled', thrown.message);
       } else {
         console.log('Error');
       }
     }).then( result => {
       console.log(this.testbr);
     } );
    },
    addUser: function(){
       if(this.userToAdd===null){
         this.errorMsg = 'You have to enter user';
         return;
       }
       this.addedMembers.push(this.userToAdd);
       this.userToAdd = null;
    },
    createTeam: function() {
      if(this.teamName.length==0){
        this.errorMsg = "You have to enter team name";
        return;
      }
      if (this.addedMembers.length == 0) {
        this.errorMsg = "You have to add user(s) to team.";
        return;
      }
    },
    // Metode za AutoSuggest komponentu, hendleri
    poziv: function(text, oldText) {
        // this.userToAdd = null;  // Za slucaj da je bio selektovan, pa se predomislio
        // if( text===null ){
        //   this.inputText = null;
        //   return;
    },
    onInputChange: function(text, oldText){
    },
    onSelected: function(item) {
       this.userToAdd = item.item;
    },
    clickHandler: function(item) {
    },
    renderSuggestion: function(suggestion){
       var i = suggestion.item;
       return i.name+" "+i.surname+" "+i.email;
    },
    getSuggestionValue: function(item){
        var i = item.item;
        return i.name+' '+i.surname+' '+i.email;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
© 2018 GitHub, Inc.
Terms
Privacy
Security
Status
Help
Contact GitHub
API
Training
Shop
Blog
About
Press h to open a hovercard with more details.
