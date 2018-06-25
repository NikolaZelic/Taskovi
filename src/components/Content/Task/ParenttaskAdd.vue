<template>
  <transition name="modal">
    <div class="tmp-content-mask">
      <div class="tmp-content-wrapper">
        <div class='tmp-content'>
          <div class="header">
            <h1 class="display-4 disable-selection">Creating Task</h1>
            <div class='exit-wrapper'>
              <i class="exit-position far fa-times-circle" @click='closeModal'></i>
              <!-- <div class="exit-text">ESC</div> -->
            </div>
          </div>

          <div class="content">
            <!-- PROJECT -->
            <div v-show='!task' class="form-group" @click='refreshProjectError'>
              <vue-autosuggest ref='projectref' :suggestions="[ { data: suggestedProjects } ]" :renderSuggestion="renderProjectSuggestion"
                :inputProps="inputPropsProject" :getSuggestionValue="getSuggestionTeam" :onSelected="onProjectSelected" />
            </div>

            <!-- TITLE -->
            <div class="form-group">
              <input v-model='title' type="text" class="custom-modern" :class="titleClass" id="tsk_title" placeholder="Title" @click='refreshTitleError'>
            </div>

            <!-- DESCRIPTION -->
            <div class="form-group">
              <!-- <label for="tsk_desc">Task description</label> -->
              <textarea v-model='description' class="form-control" id="tsk_desc" rows="3" placeholder="Describe the Task"></textarea>
            </div>

            <!-- DEADLINE -->
            <div class="form-group" id='deadline'>
              <span class="calender-icon" @click='calendarIconClicked'>
                <i class="far fa-calendar-alt"></i>
              </span>
              <span class="calender-wrapper" @mouseover='mouseOverDeadline=1' @mouseleave='mouseOverDeadline=0'>
                <flat-pickr ref='datepicker' v-model="deadline" :config="config" id='flatPickrId' class="deadline" placeholder="Pick Deadline (optional)"
                  name="date">
                </flat-pickr>
                <div class="cleane-deadline-wrapper" v-if='mouseOverDeadline && deadline!=null && deadline.length>0 ' title='Clear date'
                  @click='deadline=null'>
                  <i class="fas fa-times-circle"></i>
                </div>
              </span>
            </div>

            <!-- ADING WORKERS -->
            <div class="form-group" id='adding-worker' @mouseover='mouseOverAddWorker=1' @mouseleave='mouseOverAddWorker=0'>
              <i :class="personClass" @click='selectUser'></i>
              <i :class="teamClass" @click='selectTeam'></i>
              <vue-autosuggest id='auto-suggestion' ref="suggestionTag" :suggestions="[ { data: suggestedWorker } ]" :renderSuggestion="renderSuggestion"
                @click="refreshWorkerError" :onSelected="onSelected" :inputProps="inputProps" :getSuggestionValue="getSuggestionValue"
              />
              <!-- Dodavanje sebe na task -->
              <div class="add-myself disable-selection" v-if='task && mouseOverAddWorker && teamSelect==0 && choosenWorker==null' @click='selectMe'>
                Just me
              </div>
            </div>

            <!-- TAGS -->
            <div class="form-group">
              <multiselect v-model="selectedTags" id="tags-component" label="text" track-by="id" placeholder="Enter Tags" open-direction="bottom"
                :options="suggestedTags" :multiple="true" :searchable="true" :internal-search="false" :clear-on-select="true"
                :close-on-select="true" :limit="5" :limit-text="limitText" :max-height="600" :show-no-results="false" :hide-selected="true"
                @search-change="searchTags">
                <template slot="clear" slot-scope="props">
                  <div class="multiselect__clear" v-if="selectedTags.length" @mousedown.prevent.stop="clearAll(props.search)"></div>
                </template>
                <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
              </multiselect>
            </div>

            <!-- TaskAdd.vue -->
            <div v-show='task' class="form-group">
              <select v-model="selectedPriorety" v-bind:class='selectedPrioretyClass' style='cursor: pointer'>
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
          </div>
          <!-- cotent -->

        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { VueAutosuggest } from "vue-autosuggest";
import Multiselect from "vue-multiselect";
import { store } from "@/store/index";
import { api } from "@/api/index";
import { mapState } from "vuex";
import { mapGetters } from "vuex";

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
      title: "",
      description: "",
      deadline: null,
      config: {
        wrap: true, // set wrap to true only when using 'input-group'
        altFormat: "M	j, Y",
        altInput: true,
        dateFormat: "Y-m-d"
        // locale: "Hindi", // locale for this instance only
      },
      teamSelect: 0,
      inputWorker: null,
      inputWorkerHaveChange: 0,
      choosenWorker: null,
      personClass: "fas fa-user fas-selected",
      teamClass: "fas fa-users",
      inputProps: {
        class: "autosuggest__input",
        onInputChange: this.onInputChange,
        placeholder: "Enter user"
      },
      selectedTags: [],
      inputTagHaveChange: 0,
      tagSearchStr: null,
      task: false,
      selectedPrioretyClass: "unselected form-control",
      suggestedProjets: [],
      inputPropsProject: {
        class: "autosuggest__input",
        onInputChange: this.onInputChangeProject,
        placeholder: "Enter Project"
      },
      selectedPriorety: null,
      projectSuggestionHaveChange: 0,
      mouseOverDeadline: 0,
      mouseOverAddWorker: 0,
      titleClass: "form-control"
    };
  },

  computed: {
    suggestedWorker: function() {
      if (this.teamSelect == 1)
        // Selektovan tim
        return store.getters.getSuggestedTeams; // Selektovan korisnik
      else return store.getters.getSuggestedUsers;
    },
    ...mapState({
      suggestedTags: state => state.modulework.suggestedTags,
      suggestedProjects: state => state.modulework.suggestedProjects,
      projectID: state => state.sidebarItemSelection[0]
    }),
    proId() {
      if (this.$refs.projectref._data.currentItem == null) return null;
      return this.$refs.projectref._data.currentItem.item.id;
    }
  },

  created: function() {
    // console.log(this.$refs.projectref);
    interval = setInterval(() => {
      // Ovo bi trebalo stalno da poziva kompany ID
      // Pozivanje sugestija za tagove
      if (
        this.inputTagHaveChange == 1 &&
        this.tagSearchStr != null &&
        this.tagSearchStr.length > 0
      ) {
        store.dispatch("suggestTags", {
          tagFor: "task",
          searchStr: this.tagSearchStr
        });
        this.inputTagHaveChange = 0;
      }

      // Poziv sugestija za user tj. timove
      if (
        this.inputWorkerHaveChange == 1 &&
        this.inputWorker != null &&
        this.inputWorker.length > 0
      ) {
        if (this.teamSelect == 0) this.suggestUsers();
        else this.suggestTeams();
        this.inputWorkerHaveChange = 0;
      }
      if (this.inputWorker != null && this.inputWorker.length == 0) {
        store.dispatch("cleanSuggestions");
        store.dispatch("cleanSuggestedTeams");
      }

      // Poziv sugestija za projekte
      if (this.$refs.projectref != undefined) {
        if (
          this.$refs.projectref._data.searchInput == null ||
          this.$refs.projectref._data.searchInput.length == 0
        ) {
          // store.dispatch('clleaneSuggestedProjects');
        } else if (this.projectSuggestionHaveChange == 1) {
          store.dispatch("suggestProjects", {
            searchStr: this.$refs.projectref._data.searchInput,
            comId: this.projectID
          });
          this.projectSuggestionHaveChange = 0;
        }
      }
    }, 500);
  },

  destroy: function() {
    clearInterval(interval);
  },

  watch: {
    selectedTags: function() {
      store.dispatch("cleanSuggestedTags");
    },
    selectedPriorety: function() {
      if (this.selectedPrioretyClass != "form-control")
        this.selectedPrioretyClass = "form-control";
    }
  },

  methods: {
    selectUser() {
      this.teamSelect = false;
      this.personClass = "fas fa-user fas-selected";
      this.teamClass = "fas fa-users";
      this.inputProps.placeholder = "Enter User";
      this.$refs.suggestionTag.searchInput = null;
      this.choosenWorker = null;
      store.dispatch("cleanSuggestions");
      store.dispatch("cleanSuggestedTeams");
    },
    selectTeam() {
      this.teamSelect = true;
      this.personClass = "fas fa-user";
      this.teamClass = "fas fa-users fas-selected";
      this.inputProps.placeholder = "Enter Team";
      this.$refs.suggestionTag.searchInput = null;
      this.choosenWorker = null;
      store.dispatch("cleanSuggestions");
      store.dispatch("cleanSuggestedTeams");
    },
    // Metode u AutoSuggesion komponenti
    onInputChange: function(text, oldText) {
      this.inputWorker = text;
      this.inputWorkerHaveChange = 1;
      if (this.choosenWorker != null) {
        if (this.choosenWorker.status === undefined) this.choosenWorker = null;
        else this.choosenWorker.status = undefined;
      }

      if (text != null && text.length == 0) {
        store.dispatch("cleanSuggestions");
        store.dispatch("cleanSuggestedTeams");
      }
    },
    onSelected(item) {
      if (item == null || item == undefined) return;
      this.choosenWorker = item.item;
      this.inputWorker = null;
      store.dispatch("cleanSuggestions");
      store.dispatch("cleanSuggestedTeams");
    },
    clickHandler(item) {},
    renderSuggestion(suggestion) {
      var str = this.inputWorker;
      var i = suggestion.item;
      if (this.teamSelect == 0) {
        // Selektovan je korisnik
        // Oznacavanje selektovanih slova
        return (
          <div class="sugestija">
            {" "}
            {this.oznaciIme(i.name, str)} {this.oznaciIme(i.surname, str)}{" "}
            {this.oznaciIme(i.email, str)}{" "}
          </div>
        );
      } else {
        // Selektovana je kompanija
        // return <div class='sugestija'>{this.oznaciIme(i.name, str)}</div>;
        // var array = ['Pera', 'Mika', 'Laza'];
        // const items = array.map((item, index) => {
        //   return <li>{item}</li>
        // });
        // return <ul> {items} </ul>;
        var items = this.oznaciTim(i.name, str);
        return <div class="sugestija"> {items} </div>;
      }
    },
    renderProjectSuggestion(suggestion) {
      return this.oznaciIme(
        suggestion.item.name,
        this.$refs.projectref._data.searchInput
      );
    },
    oznaciIme(ime, str) {
      if (ime === undefined || ime === null) return;
      var reg = new RegExp(str, "i");
      var m = ime.search(reg);
      if (m != -1) {
        // Ako uopste ima preklapanja
        var pre = ime.replace(new RegExp("(.*?)" + str + ".*", "i"), "$1");
        var oznaceno = ime.replace(new RegExp(".*?(" + str + ").*", "i"), "$1");
        var posle = ime.replace(new RegExp(".*?" + str + "(.*)", "i"), "$1");
        return (
          <span class="rec">
            {" "}
            <span class="neoznacen"> {pre} </span>{" "}
            <span class="oznacen"> {oznaceno} </span>{" "}
            <span class="neoznacen"> {posle} </span>{" "}
          </span>
        );
      }
      return (
        <span class="rec">
          {" "}
          <span class="neoznacen"> {ime} </span>{" "}
        </span>
      );
    },
    oznaciTim(ime, str) {
      var reg = new RegExp(str, "i");
      var m = ime.search(reg);
      if (m != -1) {
        // Ako uopste ima preklapanja
        var array = ime.split(/\s+/);
        var items = array.map((item, index) => {
          var a = item.trim();
          if (a.length > 0) return this.oznaciIme(a, str);
        });
        return items;
      }
      return (
        <span class="rec">
          {" "}
          <span class="neoznacen"> {ime} </span>{" "}
        </span>
      );
    },
    calendarIconClicked() {
      // console.log(this.$refs.datepicker._data.fp.open);
      // console.log( flatpickr("#flatPickrId", {}) );
      this.$refs.datepicker._data.fp.open();
    },
    getSuggestionValue(item) {
      var i = item.item;
      if (this.teamSelect == 0) {
        // Selektovan je korisnik
        return i.name + " " + i.surname + " " + i.email;
      } else {
        return this.getSuggestionTeam(item);
      }
    },
    getSuggestionTeam(item) {
      var i = item.item;
      return i.name;
    },
    suggestUsers() {
      // console.log('SUggest users');
      store.dispatch("refreshSuggestions", {
        searchText: this.inputWorker,
        comId: this.projectID
      });
    },
    suggestTeams() {
      store.dispatch("suggestTeams", {
        searchStr: this.inputWorker,
        comId: this.projectID
      });
    },

    // Metode za MultySelekt komponentu
    searchTags(str) {
      // console.log('Input change');
      this.inputTagHaveChange = 1;
      this.tagSearchStr = str;
    },
    limitText(count) {
      return `and ${count} other countries`;
    },

    // Kreiranje taska
    createTask() {
      this.refreshErrors();
      // Provera ulaznih vrednosti
      var stop = false;
      if (this.title == null || this.title.length == 0) {
        this.titleError();
        stop = true;
      }
      if (this.proId == null) {
        this.projectError();
        stop = true;
      }

      if (stop) return;

      var usrid = null;
      var teamid = null;
      if (this.choosenWorker != null) {
        if (this.teamSelect == 1) teamid = this.choosenWorker.id;
        else usrid = this.choosenWorker.id;
      }

      var tagarray = this.selectedTags.map(e => e.id);

      api
        .createParenttask(
          this.proId,
          this.title,
          this.description,
          this.deadline,
          usrid,
          teamid,
          tagarray,
          this.selectedPriorety
        )
        .then(result => {
          this.reportWritingToDB(result);
        });
    },
    reportWritingToDB(result) {
      console.log(result);
      var status = result.data.status;
      console.log("Statis: " + status);
      if (status === "OK") {
        store.commit("modalStatus", {
          active: true,
          message: "Task Successful Cretaed !!!"
        });
      } else {
        store.commit("modalStatus", {
          active: true,
          message: "Error! Task wasn't created."
        });
      }
    },
    onInputChangeProject(text, oldText) {
      if (text == null || text.length == 0) {
        store.dispatch("clleaneSuggestedProjects");
      }
      this.projectSuggestionHaveChange = 1;
    },
    selectMe() {
      // var choosenWorker = this.choosenWorker;
      api.getUserInfo().then(result => {
        var user = result.data;
        this.choosenWorker = user;
        this.$refs.suggestionTag.searchInput =
          user.name + " " + user.surname + " " + user.email;
      });
    },
    titleError() {
      this.titleClass = "form-control error-input";
    },
    refreshTitleError() {
      this.titleClass = "form-control";
    },
    projectError() {
      this.inputPropsProject.class = "autosuggest__input error-input66682";
    },
    refreshProjectError() {
      this.inputPropsProject.class = "autosuggest__input";
    },
    workerError() {
      this.inputProps.class = "autosuggest__input error-input66682";
    },
    refreshWorkerError() {
      this.inputProps.class = "autosuggest__input";
    },
    refreshErrors() {
      this.refreshProjectError();
      this.refreshTitleError();
    },
    onProjectSelected() {
      store.dispatch("clleaneSuggestedProjects");
    },
    closeModal() {
      store.commit("itemAddAllReset");
    }
  }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css">
</style>
<style media="screen">
.error-input66682 {
  border-bottom: 3px solid #ff0000;
}

.autosuggest__input,
.autosuggest__input:focus {
  color: #eee;
  background-color: #2e3038;
}

#autosuggest__input.autosuggest__input-open {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.autosuggest__results-container {
  position: relative;
  width: 100%;
}

.autosuggest__results {
  margin: 0;
  position: absolute;
  z-index: 10000001;
  width: 100%;
  background-color: #454854;
  padding: 0;
}

.autosuggest__results ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.autosuggest__results .autosuggest__results_item {
  cursor: pointer;
  padding: 15px;
}

#autosuggest ul:first-child > .autosuggest__results_title {
  border-top: none;
}

.autosuggest__results .autosuggest__results_title {
  color: #eee;
  font-size: 11px;
  margin-left: 0;
  padding: 15px 13px 5px;
  border-top: 1px solid #d3d3d3;
}

.autosuggest__results
  .autosuggest__results_item.autosuggest__results_item-highlighted,
.autosuggest__results .autosuggest__results_item:active,
.autosuggest__results .autosuggest__results_item:focus,
.autosuggest__results .autosuggest__results_item:hover {
  background-color: #2e3038;
}

.tmp-content .calender-wrapper .flatpickr-input.form-control[readonly] {
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

.tmp-content .multiselect .multiselect__option--highlight {
  background: #454854;
}

.tmp-content .multiselect .multiselect__option--highlight:hover {
  background: #2e3038;
}

.tmp-content .multiselect--active .multiselect__option--highlight::after,
.tmp-content .multiselect .multiselect__tag span,
.tmp-content .multiselect .multiselect__tag {
  background: var(--ac-light-color);
}

.tmp-content .deadline {
  color: #eee !important;
  display: inline !important;
}

.tmp-content #deadline {
  position: relative;
  height: 40px;
}
</style>

<style scoped>
.error-input {
  border-bottom: 3px solid #ff0000;
}

.disable-selection {
  -moz-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

#adding-worker {
  position: relative;
}

.add-myself {
  background: var(--ac-light-color);
  border: 3px solid var(--ac-light-color);
  color: black;
  border-radius: 15px;
  position: absolute;
  right: 3px;
  top: 6px;
  cursor: pointer;
}

.cleane-deadline-wrapper {
  position: absolute;
  right: 10px;
  top: 0px;
}

.sugestija {
}

.rec {
  padding: 2px;
}

.neoznacen {
}

.oznacen {
  color: var(--ac-light-color);
}

.unselected {
  color: #6c757d !important;
}

.selected {
  color: #eee !important;
}

.tmp-content {
  width: 600px;
  /* color: #eee; */
}

.tmp-content-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.tmp-content-wrapper {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}

.task-add-section {
  padding-top: 50px;
}

.header {
  position: relative;
  padding: 20px 0 0;
  border-radius: 15px 15px 0 0;
  background: var(--ac-color);
  color: black;
}

.exit-wrapper {
  right: 0px;
  top: 0px;
  width: 100px;
  height: 100px;
  cursor: pointer;
}

.exit-text {
  position: absolute;
  top: 50px;
  right: 30px;
  font-size: 20px;
}

.exit-position {
  position: absolute;
  right: 20px;
  font-size: 30px;
}

.display-4 {
  position: absolute;
  width: 100%;
  text-align: center;
}

.content {
  position: relative;
  padding: 20px;
  background: #24262d;
  border-radius: 0 0 15px 15px;
  padding: 15px;
}

.calender-wrapper {
  position: absolute;
  left: 50px;
  right: 0px;
}

.calender-icon {
  position: absolute;
  width: 10%;
  left: 0px;
  cursor: pointer;
}

.fa-calendar-alt {
  font-size: 38px;
}

.form-control {
  display: inline;
  position: relative;
  background-color: #2e3038;
  color: #eee;
}

#tsk_deadline {
  width: 97%;
  cursor: pointer;
}

.fas {
  font-size: 25px;
  margin: 3px;
  padding: 3px;
  cursor: pointer;
}

.fas-selected {
  color: var(--ac-light-color);
  border-bottom: 2px solid var(--ac-light-color);
}

#auto-suggestion {
  position: absolute;
  display: inline-block;
  right: 0px;
  left: 85px;
}

.tags-wrapper {
  font-size: 18px;
}

.tag {
  background-color: var(--ac-light-color);
  border: 1px solid var(--ac-light-color);
  border-radius: 5px;
}

.tag-text {
}

.fa-times {
  font-size: 16px;
}

.button-wrapper {
  position: relative;
  height: 30px;
}

.btn-success {
  position: absolute;
  right: 0px;
  bottom: -13px;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
