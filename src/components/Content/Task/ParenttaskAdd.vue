<template>
  <div class='tmp-content'>
      <div class="header">
        <h1 class="display-4">Creating Task</h1>
        <div class='exit-wrapper'>
          <i class="exit-position far fa-times-circle"></i>
          <div class="exit-text">ESC</div>
        </div>
      </div>

      <div class="content">
        <!-- TITLE -->
        <div class="form-group">
          <input v-model='title' type="text" class="form-control" id="tsk_title" placeholder="Title">
        </div>

        <!-- DESCRIPTION -->
        <div class="form-group">
          <!-- <label for="tsk_desc">Task description</label> -->
          <textarea v-model='description' class="form-control" id="tsk_desc" rows="3" placeholder="Describe the Task"></textarea>
        </div>

        <!-- DEADLINE -->
        <div class="form-group" id='deadline'>
          <span class="calender-icon" @click='calendarIconClicked' >
            <i class="far fa-calendar-alt"></i>
          </span>
          <span class="calender-wrapper">
            <flat-pickr
                ref='datepicker'
                v-model="deadline"
                :config="config"
                id = 'flatPickrId'
                class="deadline"
                placeholder="Pick Deadline (optional)"
                name="date">
            </flat-pickr>
          </span>
        </div>

        <!-- ADING WORKERS -->
        <div class="form-group">
          <i :class="personClass" @click='selectUser'></i>
          <i :class="teamClass" @click='selectTeam'></i>
          <vue-autosuggest
            id='auto-suggestion'
            ref="suggestionTag"
            :suggestions="[ { data: suggestedWorker } ]"
            :renderSuggestion="renderSuggestion"
            @click="clickHandler"
            :onSelected="onSelected"
            :inputProps= "inputProps"
            :getSuggestionValue = "getSuggestionValue"
          />
          </vue-autosuggest>
        </div>

        <!-- TAGS -->
        <div class="form-group">
          <multiselect v-model="selectedTags" id="tags-component" label="text" track-by="id" placeholder="Enter Tags"
            open-direction="bottom" :options="suggestedTags" :multiple="true" :searchable="true"
            :internal-search="false" :clear-on-select="true" :close-on-select="true" :limit="5"
            :limit-text="limitText" :max-height="600" :show-no-results="false" :hide-selected="true" @search-change="searchTags">
            <template slot="clear" slot-scope="props">
              <div class="multiselect__clear" v-if="selectedTags.length" @mousedown.prevent.stop="clearAll(props.search)"></div>
            </template><span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
          </multiselect>
        </div>

        <!-- TaskAdd.vue -->
        <div class="form-group">
          <select v-model="selectedPriorety" v-bind:class='selectedPrioretyClass' style='cursor: pointer' >
            <option disabled value=null>Select Priorety</option>
            <option value='1'>High</option>
            <option value='2'>Low</option>
            <option value='3'>Medium</option>
          </select>
        </div>

        <!-- SUBMIT -->
        <div class="form-group button-wrapper">
          <button @click='createTask' type="submit" class="btn btn-success">Create</button>
        </div>

        Ovde treba da je id projekta: {{ proId }}
      </div><!-- cotent -->

  </div>
</template>

<script>

import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import {
  VueAutosuggest
} from 'vue-autosuggest';
import Multiselect from "vue-multiselect";
import {store} from "@/store/index";
import {api} from "@/api/index";
import { mapState } from 'vuex';

var interval;
const flatpickr = require("flatpickr");

export default {
  components: {
    flatPickr,
    VueAutosuggest,
    Multiselect
  },

  data() {
    return {
      title: '',
      description: '',
      deadline: null,
      config: {
          wrap: true, // set wrap to true only when using 'input-group'
          altFormat: 'M	j, Y',
          altInput: true,
          dateFormat: 'Y-m-d',
          // locale: "Hindi", // locale for this instance only
        },
      teamSelect: 0,
      inputWorker: null,
      inputWorkerHaveChange: 0,
      choosenWorker: null,
      personClass: 'fas fa-user fas-selected',
      teamClass: 'fas fa-users',
      inputProps: {class:'autosuggest__input', onInputChange: this.onInputChange, placeholder:'Enter user'},
      selectedTags: [],
      inputTagHaveChange: 0,
      tagSearchStr: null,

      // proId: 14,  // Ovo treba da se prosledi komponenti prilikom kreiranja
      task:  false,
      selectedPrioretyClass: 'unselected form-control',
    }
  },

  computed: {
    suggestedWorker: function(){
      if( this.teamSelect == 1 )  // Selektovan tim
        return store.getters.getSuggestedTeams;
      else   // Selektovan korisnik
        return store.getters.getSuggestedUsers;
    },
    ...mapState({
      companyID: 'companyID',
      suggestedTags: state => state.modulework.suggestedTags,
      proId: state => state.sidebarItemSelection[1],
    }),
  },

  created: function(){
    interval = setInterval(() => {
      // Pozivanje sugestija za tagove
      if ( this.inputTagHaveChange == 1 && this.tagSearchStr != null && this.tagSearchStr.length > 0 ) {
        store.dispatch( 'suggestTags', {tagFor:'task', searchStr:this.tagSearchStr } );
        this.inputTagHaveChange = 0;
      }
      // Poziv sugestija za user tj. timove
      if( this.inputWorkerHaveChange == 1 && this.inputWorker != null && this.inputWorker.length > 0 ){
        if( this.teamSelect == 0 )
          this.suggestUsers();
        else
          this.suggestTeams();
        this.inputWorkerHaveChange = 0;
      }
      if( this.inputWorker != null && this.inputWorker.length == 0 ){
        store.dispatch('cleanSuggestions');
        store.dispatch('cleanSuggestedTeams');
      }
    }, 500);
  },

  destroy: function() {
    clearInterval(interval);
  },

  watch:{
    selectedTags: function(){
      store.dispatch('cleanSuggestedTags');
    },
    selectedPriorety: function(){
      if( this.selectedPrioretyClass != 'form-control' )
        this.selectedPrioretyClass = 'form-control';
    },
  },

  methods: {
    selectUser(){
      this.teamSelect = false;
      this.personClass = 'fas fa-user fas-selected';
      this.teamClass = 'fas fa-users';
      this.inputProps.placeholder = 'Enter User';
      this.$refs.suggestionTag.searchInput = null;
      this.choosenWorker = null;
      store.dispatch('cleanSuggestions');
      store.dispatch('cleanSuggestedTeams');
    },
    selectTeam (){
      this.teamSelect = true;
      this.personClass = 'fas fa-user';
      this.teamClass = 'fas fa-users fas-selected';
      this.inputProps.placeholder = 'Enter Team';
      this.$refs.suggestionTag.searchInput = null;
      this.choosenWorker = null;
      store.dispatch('cleanSuggestions');
      store.dispatch('cleanSuggestedTeams');
    },
// Metode u AutoSuggesion komponenti
    onInputChange: function(text, oldText){
      this.inputWorker = text;
      this.inputWorkerHaveChange = 1;
      this.choosenWorker = null;
      if( text != null && text.length == 0 ){
          store.dispatch('cleanSuggestions');
          store.dispatch('cleanSuggestedTeams');
      }
    },
    onSelected(item) {
      if( item == null || item == undefined )
        return;
      this.choosenWorker = item.item;
      this.inputWorker = null;
      store.dispatch('cleanSuggestions');
      store.dispatch('cleanSuggestedTeams');
    },
    clickHandler(item) {
    },
    renderSuggestion(suggestion){
      var str = this.inputWorker;
      var i = suggestion.item;
      if( this.teamSelect == 0 ){  // Selektovan je korisnik
        // Oznacavanje selektovanih slova
        return <div class='sugestija'>{this.oznaciIme(i.name, str)} {this.oznaciIme(i.surname, str)} {this.oznaciIme(i.email, str)}</div>;
      }
      else {  // Selektovana je kompanija
        // return <div class='sugestija'>{this.oznaciIme(i.name, str)}</div>;
        // var array = ['Pera', 'Mika', 'Laza'];
        // const items = array.map((item, index) => {
        //   return <li>{item}</li>
        // });
        // return <ul> {items} </ul>;
        var items = this.oznaciTim(i.name, str);
        return <div class='sugestija'>{items}</div>
      }
    },
    oznaciIme(ime, str){
      var reg = new RegExp(str, 'i');
      var m = ime.search(reg);
      if(  m !=-1 ){  // Ako uopste ima preklapanja
        var pre = ime.replace( new RegExp('(.*?)'+str+".*",'i'), '$1' );
        var oznaceno = ime.replace( new RegExp('.*?('+str+').*','i'), '$1' );
        var posle = ime.replace( new RegExp('.*?'+str+'(.*)','i'), '$1' );
        return <span class='rec'><span class='neoznacen'>{pre}</span><span class='oznacen'>{oznaceno}</span><span class='neoznacen'>{posle}</span></span>;
      }
      return <span class='rec'><span class='neoznacen'>{ime}</span></span>
    },
    oznaciTim(ime, str){
      var reg = new RegExp(str, 'i');
      var m = ime.search(reg);
      if(  m !=-1 ){  // Ako uopste ima preklapanja
        var array = ime.split(/\s+/);
        var items = array.map( (item, index) => {
          var a = item.trim();
          if( a.length > 0 )
            return this.oznaciIme(a, str);
        } );
        return items;
      }
      return <span class='rec'><span class='neoznacen'>{ime}</span></span>
    },
    calendarIconClicked(){
      // console.log(this.$refs.datepicker._data.fp.open);
      // console.log( flatpickr("#flatPickrId", {}) );
      this.$refs.datepicker._data.fp.open();
    },
    getSuggestionValue(item){
        var i = item.item;
        if( this.teamSelect == 0 ){  // Selektovan je korisnik
          return i.name + " " + i.surname + " " + i.email;
        }
        else {
          return i.name;
        }
    },
    suggestUsers(){
      // console.log('SUggest users');
      store.dispatch('refreshSuggestions', {searchText: this.inputWorker, comId:this.companyID} );
    },
    suggestTeams(){
      store.dispatch('suggestTeams', {searchStr: this.inputWorker, comId: this.companyID});
    },

// Metode za MultySelekt komponentu
    searchTags(str){
      // console.log('Input change');
      this.inputTagHaveChange = 1;
      this.tagSearchStr = str;
    },
    limitText (count) {
      return `and ${count} other countries`;
    },

// Kreiranje taska
    createTask(){
      // Provera ulaznih vrednosti
      if(this.title == null || this.title.length == 0){
        return;
      }

      var usrid = null;
      var teamid = null;
      if( this.choosenWorker != null ){
        if( this.teamSelect == 1 )
          teamid = this.choosenWorker.id;
        else
          usrid = this.choosenWorker.id;
      }

      var tagarray = this.selectedTags.map( e => e.id );

      api.createParenttask(this.proId, this.title, this.description, this.deadline, usrid, teamid, tagarray ).
      then( result => {
        console.log( result );
      } );
    },
  },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
.sugestija{

}
.rec{
  padding: 2px;
}
.neoznacen{

}
.oznacen{
  color: #cc6600;
}
.unselected{
  color: #6c757d !important;
}
.selected{
  color: #eee !important;
}
.tmp-content{
  position: fixed;
  /* z-index: 9998; */
  top: 0px;
  right: 0px;
  width: 40%;
  /* height: 80%; */
  background: #24262d;
  color: #eee;
  padding: 5px;
  /* background-color: rgba(0, 0, 0, .5); */
  /* display: table; */
  /* transition: opacity .3s ease; */
}

.task-add-section {
  padding-top: 50px;
}
.header{
  position: relative;
  margin: 20px;
}
.exit-wrapper{
  right: 0px;
  top: 0px;
  width: 100px;
  height: 100px;
  cursor: pointer;
}
.exit-text{
  position: absolute;
  top: 50px;
  right: 30px;
  font-size: 20px;
}
.exit-position{
  position: absolute;
  right: 20px;
  font-size: 50px;
}
.display-4{
  position: absolute;
  width: 100%;
  text-align: center;
}
.content{
  position: relative;
  padding: 20px;
  margin: 10px;
  border: 2px solid #cc6600;
  border-radius: 10px;
}
.calender-wrapper{
  position: absolute;
  left: 50px;
  right: 0px;
}
.calender-icon{
  position: absolute;
  width: 10%;
  left: 0px;
  cursor: pointer;
}
.fa-calendar-alt{
  font-size: 38px;
}
.form-control{
  display: inline;
  position: relative;
  background-color : #2e3038;
  color: #eee;
}
#tsk_deadline{
  width: 97%;
  cursor: pointer;
}
.fas{
  font-size: 25px;
  margin: 3px;
  padding: 3px;
  cursor: pointer;
}
.fas-selected{
  color: #cc6600;
  border-bottom: 2px solid #cc6600;
}
#auto-suggestion{
  position: absolute;
  display: inline-block;
  right: 21px;
  left: 110px;
}
.tags-wrapper{
  font-size: 18px;

}
.tag{
  background-color: #cc6600;
  border: 1px solid #cc6600;
  border-radius: 5px;
}
.tag-text{

}
.fa-times{
  font-size: 16px;
}
.button-wrapper{
  position: relative;
  height: 30px;
}
.btn-success{
  position: absolute;
  right: 0px;
  bottom: -13px;
}
</style>
<style media="screen">
.autosuggest__input, .autosuggest__input:focus {
  color: #eee;
  background-color : #2e3038;
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
  margin: 0;
  position: absolute;
  z-index: 10000001;
  width: 100%;
  background-color: #454854;
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
  color: #eee;
  font-size: 11px;
  margin-left: 0;
  padding: 15px 13px 5px;
  border-top: 1px solid #d3d3d3
}
.autosuggest__results .autosuggest__results_item.autosuggest__results_item-highlighted,
.autosuggest__results .autosuggest__results_item:active,
.autosuggest__results .autosuggest__results_item:focus,
.autosuggest__results .autosuggest__results_item:hover {
  background-color: #2e3038;
}

.tmp-content .calender-wrapper .flatpickr-input.form-control[readonly]{
    background: #2e3038;
}
.tmp-content .multiselect .multiselect__tags,
.tmp-content .multiselect .multiselect__single,
.tmp-content .multiselect #tags-component {
  background: #2e3038;
  /* color: #eee; */
}
.tmp-content .multiselect #tags-component:focus {
  color: #eee;
}
.tmp-content .multiselect .multiselect__tags,
.tmp-content .multiselect .multiselect__single,
.tmp-content .multiselect #tags-component::placeholder {
  color: #6c757d;
}
.tmp-content .multiselect .multiselect__option--highlight{
  background: #454854;
}
.tmp-content .multiselect .multiselect__option--highlight:hover{
  background: #2e3038;
}
.tmp-content .multiselect--active .multiselect__option--highlight::after,
.tmp-content .multiselect .multiselect__tag span,
.tmp-content .multiselect .multiselect__tag{
  background: #cc6600;
}
.tmp-content .deadline{
  color: #eee !important;
  display: inline !important;
}
.tmp-content #deadline{
  position: relative;
  height: 40px;
}
</style>
