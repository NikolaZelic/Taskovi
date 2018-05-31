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
        :getSuggestionValue="getSuggestionValue"
        :renderSuggestion="renderSuggestion"
        @click="clickHandler" :onSelected="onSelected"
        :inputProps="{class:'autosuggest__input', onInputChange: this.onInputChange, placeholder:'Enter user'}"
      />
      </vue-autosuggest>
    <div class="input-group-append">
      <button class="btn btn-outline-secondary" type="button">Add</button>
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
        <button type="button" @click='addedMembers.splice(i,1)'>Remove</button>
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
} from "@/store/store.js";
import {
  VueAutosuggest
} from 'vue-autosuggest';

export default {

  components: {
    VueAutosuggest,
  },

  data() {
    return {
      teamName: "",
      userToAdd: {
        email: '',
        name: '',
        suranme: '',
      },
      addedMembers: [{
          email: 'pera@peric',
          name: 'Pera',
          surname: 'Peric'
        },
        {
          email: 'zika@zikic',
          name: 'Zika',
          surname: 'Zikic'
        },
      ],
      errorMsg: '', // Ovo treba podesiti na prazan string svaki put kada korisnik neto uradi, cisto kaku mu ne bi stalno stajao error na ekranu
      inputSelected: false,
    };
  },

  computed: {
    suggestions: function() {
      return [{
          name: 'Nikola',
          surname: "Zelic",
          email: "nzelic@ymail.com"
        },
        {
          name: 'Pera',
          surname: "Peric",
          email: "nzelic@ymail.com"
        },
        {
          name: 'Nikola',
          surname: "Zelic",
          email: "nzelic@ymail.com"
        }
      ];
    },

    suggestedNames: function() {
       return this.suggestions.map(el => el.name);
    },

    suggestedSurnames: function(){
       return this.suggestions.map( el => el.surname );
    },

    suggestedEmails: function(){
       return this.suggestions.map( el => el.email );
    },

  },

  methods: {
    createTeam: function() {
      if (this.addedMembers.length == 0) {
        this.errorMsg = "You have to add user(s) to team.";
        return;
      }
    },

    // Metode za AutoSuggest komponentu, hendleri
    onInputChange: function(text, oldText) {
        console.log('inpyt change');
    },

    onSelected: function(item) {
       console.log('Selected item: ');
       console.log(item);
    },

    clickHandler: function(item) {
       console.log('Item clicked: ' + item);
    },

    getSuggestionValue: function(suggestion){
       return suggestion.item.name;
    },

    renderSuggestion: function(suggestion){
       return suggestion.item.name;
    }
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
