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
        <div class="form-group">
          <!-- <label for="tsk_deadline">Deadline</label> -->
          <div class="calender-wrapper">
            <flat-pickr
                v-model="deadline"
                :config="config"
                id = 'id'
                class="deadline"
                placeholder="Pick Deadline (optional)"
                name="date">
            </flat-pickr>
          </div>
        </div>

        <!-- ADING WORKERS -->
        <div class="form-group">
          <i :class="personClass" @click='selectUser'></i>
          <i :class="teamClass" @click='selectTeam'></i>
          <vue-autosuggest
            id='auto-suggestion'
            ref="suggestionTag"
            :suggestions="[ { data: suggestions } ]"
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

          <!-- TESTIRANJE MULTYSELEKTA -->
          <multiselect v-model="selectedTags" id="ajax" label="text" track-by="id" placeholder="Select Tags"
            open-direction="bottom" :options="suggestedTags" :multiple="true" :searchable="true" :loading="isLoading"
            :internal-search="false" :clear-on-select="false" :close-on-select="false" :limit="5"
            :limit-text="limitText" :max-height="600" :show-no-results="false" :hide-selected="true" @search-change="asyncFind">
            <template slot="clear" slot-scope="props">
              <div class="multiselect__clear" v-if="selectedTags.length" @mousedown.prevent.stop="clearAll(props.search)"></div>
            </template><span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
          </multiselect>

        </div>

        <!-- SUBMIT -->
        <div class="form-group button-wrapper">
          <button type="submit" class="btn btn-success">Create</button>
        </div>

      </div>
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
      teamSelect: false,
      personClass: 'fas fa-user fas-selected',
      teamClass: 'fas fa-users',
      inputProps: {class:'autosuggest__input', onInputChange: this.onInputChange, placeholder:'Enter user'},
      // tags: [{id:1, text:'Front-end'}],
      selectedTags: [],
      isLoading: false,

    }
  },

  computed: {
    suggestions: function(){
      return ["Pera","Mika","Zika"];
    },
    inputWorker: function(){
      return this.$refs.suggestionTag.searchInput;
    },
    suggestedTags: function(){
      return store.getters.getSuggestedTags;
    }
  },

  created: function(){
    store.dispatch('suggestTags', {searchStr:'b', tagFor:'task'})
  },

  methods: {
    selectUser(){
      this.teamSelect = false;
      this.personClass = 'fas fa-user fas-selected';
      this.teamClass = 'fas fa-users';
      this.inputProps.placeholder = 'Enter User';
      this.$refs.suggestionTag.searchInput = null;
    },
    selectTeam (){
      this.teamSelect = true;
      this.personClass = 'fas fa-user';
      this.teamClass = 'fas fa-users fas-selected';
      this.inputProps.placeholder = 'Enter Team';
      this.$refs.suggestionTag.searchInput = null;
    },
// Metode u AutoSuggesion komponenti
    onInputChange: function(text, oldText){
    },
    onSelected(item) {
      if( item == null || item == undefined )
        return;
    },
    clickHandler(item) {
    },
    renderSuggestion(suggestion){
       var i = suggestion.item;
       return i;
    },
    getSuggestionValue(item){
        var i = item.item;
        // return i.name+' '+i.surname+' '+i.email;
        return i;
    },
// MEtode za MultySelekt komponentu
    asyncFind(query){
      console.log(query);
    },
    limitText (count) {
      return `and ${count} other countries`;
    }
  }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>

.tmp-content{
  position: fixed;
  /* z-index: 9998; */
  top: 0%;
  left: 0%;
  width: 80%;
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
  position: relative;
}
.form-control{
  display: inline;
  position: relative;
  background-color : #2e3038;
  color: #eee;
}
.deadline{
  background-color : #2e3038;
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
  right: 15px;
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
</style>
