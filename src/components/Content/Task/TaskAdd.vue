<template>
  <!-- <transition name="modal"> -->
    <div class="tmp-content-mask mx-auto">
      <!-- <div class="tmp-content-wrapper" > -->
        <div class='tmp-content'>
          <div class="header">
            <span class="header-title">{{componentTitle}}</span>
          </div>

          <div class="content">

            <!-- TITLE -->
            <div class="form-group">
              <input v-model='title' type="text" class="custom-modern" :class="titleClass" id="tsk_title" placeholder="Title" @click='refreshTitleError' @change="somethingChanged = true">
            </div>

            <!-- DESCRIPTION -->
            <div class="form-group">
              <!-- <label for="tsk_desc">Task description</label> -->
              <textarea v-model='description' class="form-control" id="tsk_desc" rows="3" placeholder="Describe the Task (optional)" @change="somethingChanged = true"></textarea>
            </div>

            <!-- DEADLINE -->
            <div class="form-group mb-0" id='deadline' title='Deadline'>
              <!-- <span class="calender-icon" @click='calendarIconClicked'> -->
                <i class="far fa-calendar-alt" @click='calendarIconClicked'></i>
              <!-- </span> -->
              <!-- <span class="calender-wrapper" > -->
                <flat-pickr ref='datepicker' v-model="deadline" :onValueUpdate="somethingChanged = true" :config="config" id='flatPickrId' class="deadline" placeholder="Pick a deadline (optional)"
                  name="date" @mouseover='mouseOverDeadline=1' @mouseleave='mouseOverDeadline=0'>
                </flat-pickr>

                <!-- <div class="hasError" v-if="!timeBeforeNow">
                  Please provide a valid state.
                </div> -->

                <div class="cleane-deadline-wrapper" v-if='mouseOverDeadline && deadline!=null && deadline.length>0 ' title='Clear date'
                  @click='deadline=null'>
                  <i class="fas fa-times-circle"></i>
                </div>
              <!-- </span> -->
            </div>
            <small v-if="!timeBeforeNow && edit === false" class="text-danger">Deadline can't be in the past.</small>

            <!-- ADDING WORKERS -->
            <div class="form-group mt-3" id='adding-worker'>
              <i class="fas fa-user"></i>
              <multiselect v-model="selectedUSers" @change="somethingChanged = true" class="task-modal-input" :custom-label="fullName" track-by="id" placeholder="Assign to..." open-direction="bottom" :options="projectUsers"
                :multiple="true" :searchable="true" :internal-search="true" :clear-on-select="true" :close-on-select="true"
                :limit="5" :limit-text="limitText" :max-height="600" :show-no-results="false" :hide-selected="true" :allow-empty="true">
              <!-- @search-change="searchUsers" -->
              </multiselect>
            </div>

            <!-- TAGS -->
            <div class="form-group" v-if="task">
              <span class='fas fa-tags' title='Tags'></span>


        <multiselect
          v-model="selectedTags"
          id="tags-component"
          class='task-modal-input'
          label="text"
          track-by="text"
          placeholder="Enter Tags"
          open-direction="bottom"
          :options="suggestedTags"
          :multiple="true"
          :searchable="true"
          :internal-search="false"
          :clear-on-select="true"
          :close-on-select="true"
          :max-height="600"
          :show-no-results="false"
          :hide-selected="true"
          :taggable="true"
          :allow-empty="true"
          @search-change="searchTags"
          @tag="addTag"
          @change="somethingChanged = true">
        </multiselect>
<!-- +ovo je bilo deo multiselcta/ -->
<!-- @close="multiselectOut" -->




            </div>

            <!-- PRIORITY -->
            <div v-show='task' class="form-group">
              <span class='fas fa-exclamation-circle' title='Priority'></span>
              <select v-model="selectedPriority" v-bind:class='selectedPriorityClass' class='task-modal-input' @change="somethingChanged = true">
                <!-- <option value=null>Priority: None</option> -->
                <option value='1'>Low</option>
                <option value='2'>Medium</option>
                <option value='3'>High</option>
              </select>
            </div>

            <!-- SUBMIT -->
            <div class="form-group button-wrapper float-right">
              <button @click='taskCancel' type="submit" class="btn btn-danger mr-1">
              <i class="fa fa-ban icon-sizes"></i>
              Cancel
              </button>
              <button @click='createTask' type="submit" class="btn btn-success" :disabled='blankTitle || waitNet'>
                <span v-show='edit'>
                  <span class='fa fa-edit'></span>
                  Edit</span>
                <span v-show='!edit'>
                  <span class='fa fa-plus-square'></span>
                  Create</span>
              </button>
            </div>
          </div>
        </div>
      <!-- </div> -->
    </div>
  <!-- </transition> -->
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
require("flatpickr/dist/themes/material_blue.css");

export default {
  components: {
    flatPickr,
    VueAutosuggest,
    Multiselect
  },


  data() {
    return {
      projectUsers: [],
      // a: false,
      somethingChanged: false,
      title: "",
      description: "",
      deadline: null,
      config: {
        //wrap: true, // set wrap to true only when using 'input-group'
        defaultDate: null,
        enableTime: true,
        time_24hr: true,
        dateFormat: "Y-m-d H:i:S",
        altFormat: "M	j, Y H:i",
        altInput: true,
        minDate: "today"
        // altInputClass: "hasError"
      },
      teamSelect: 0,
      waitNet: false,
      inputWorker: null,
      inputWorkerHaveChange: 0,
      choosenWorker: null,
      inputProps: {
        class: "autosuggest__input",
        onInputChange: this.onInputChange,
        placeholder: "Enter user"
      },
      selectedTags: [],
      inputTagHaveChange: 0,
      tagSearchStr: null,
      task: true,
      edit: false,
      selectedPriorityClass: "unselected form-control",
      suggestedProjets: [],
      inputPropsProject: {
        class: "autosuggest__input",
        onInputChange: this.onInputChangeProject,
        placeholder: "Enter Project"
      },
      selectedPriority: null,
      projectSuggestionHaveChange: 0,
      mouseOverDeadline: 0,
      mouseOverAddWorker: 0,
      titleClass: "form-control",
      componentTitle: "Create Task",
      selectedUSers: []
    };
  },

  computed: {
    ...mapState({
      tabIndex: "currentTabIndex",
      suggestedWorker: state => store.getters.getSuggestedUsers,
      suggestedTags: state => state.modulework.suggestedTags,
      suggestedProjects: state => state.modulework.suggestedProjects,
      proId: state => state.sidebarItemSelection[0]
    }),

    timeBeforeNow(){
      if(this.timecritical < 0) return true;

      if(this.deadline !== null || this.deadline !== undefined){
        var now = this.parseTime(new Date());
        if(this.deadline < now) return false;
        return true;
      }
    },

    blankTitle() {
      return this.title.length === 0;
    },
    selectedProjectID() {
      var a = store.state.sidebarItemSelection[0];
      if (a === undefined) return 0;
      else return a;
    }
  },


    mounted(){
      this.somethingChanged = false
      this.getProjectUsers();
    },

  created: function() {
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
          searchStr: this.tagSearchStr,
          pro_id: this.proId
        });
        this.inputTagHaveChange = 0;
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
    selectedPriority: function() {
      if (this.selectedPriorityClass != "form-control")
        this.selectedPriorityClass = "form-control";
    }
  },

  methods: {

    getProjectUsers(){
      api.getProjectUsers(this.proId, localStorage.sid).then(response => {
        this.projectUsers =response.data.data;
        // console.log(response.data.data);
      })
    },

    fullName({ name, surname, email }) {
      return name + " " + surname + " (" + email + ")";
    },

    taskCancel() {
      if (this.somethingChanged === true) {

        const options = {title: 'Confirm?', okLabel: 'Stay on page', cancelLabel: 'Leave', size: 'sm'}
        this.$dialogs.confirm('Are you sure you want to leave? You might have unsaved changes!', options)
        .then(res => {
          if(res.ok === false) store.dispatch("itemActionReset");
        })
      } else store.dispatch("itemActionReset");
    },

    addTag(newTag) {
      const tag = {
        text: newTag
      };
      this.selectedTags.push(tag);
    },

    multiselectOut() {
      // Dodavanje novog taga
      var tag = this.tagSearchStr;

      if (
        this.suggestedTags.length > 0 ||
        tag == undefined ||
        tag == null ||
        tag.length == 0
      )
        return;

      for (var i in this.selectedTags)
        if (this.selectedTags[i].text == tag) return;
      this.selectedTags.push({
        text: tag
      });
    },
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
    // selectTeam() {
    //   this.teamSelect = true;
    //   this.personClass = "fas fa-user";
    //   this.teamClass = "fas fa-users fas-selected";
    //   this.inputProps.placeholder = "Enter Team";
    //   this.$refs.suggestionTag.searchInput = null;
    //   this.choosenWorker = null;
    //   store.dispatch("cleanSuggestions");
    //   store.dispatch("cleanSuggestedTeams");
    // },
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
      store.dispatch("refreshSuggestions", {
        searchText: this.inputWorker,
        pro_id: this.proId
      });
    },
    // suggestTeams() {
    //   store.dispatch("suggestTeams", {
    //     searchStr: this.inputWorker,
    //     comId: this.projectID
    //   });
    // },

    // Metode za MultySelekt komponentu
    searchTags(str) {
      this.inputTagHaveChange = 1;
      this.tagSearchStr = str;
    },
    limitText(count) {
      return `and ${count} other countries`;
    },

    // Kreiranje taska
    createTask() {
      this.waitNet = true;
      this.refreshErrors();
      // Provera ulaznih vrednosti
      if (this.title == null || this.title.length == 0) {
        this.titleError();
        return;
      }

      var tagarray = this.selectedTags.map(e => e.text);
      var userarray = this.selectedUSers.map(e => e.id);

      if (
        this.deadline !== "" ||
        this.deadline !== null ||
        this.deadline !== undefined
      ) {
        this.deadline = this.localToUTC(this.deadline);
      } else {
        this.deadline = undefined;
      }

      api
        .createTask(
          this.title,
          this.description,
          this.deadline,
          tagarray,
          userarray,
          this.selectedPriority,
          this.selectedProjectID
        )
        .then(result => {
          store.commit("itemActionReset");
          store.commit("resetTaskView");

          store.commit("incDirtyCounter");

          this.reportWritingToDB(result);
          this.waitNet = false;
        })
        .catch(e => {
          this.waitNet = false;
        });
    },

    reportWritingToDB(result) {
      var status = result.data.status;
      if (status === "OK") {
        store.commit("modalStatus", {
          ok: true,
          message: "Task '" + this.title + "' has been created successfully."
        });
      } else {
        store.commit("modalStatus", {
          ok: false,
          message: result.data.message //"Error! Task wasn't created."
        });
      }
    },

    onInputChangeProject(text, oldText) {
      if (text == null || text.length == 0) {
        store.dispatch("cleanSuggestedProjects");
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
      store.dispatch("cleanSuggestedProjects");
    },
    searchUsers(str) {
      if (str === undefined || str === null) return;
      if (str.length == 0) {
        store.dispatch("cleanSuggestions");
        return;
      }
      store.dispatch("refreshSuggestions", {
        searchText: str,
        pro_id: this.proId
      });
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

/* .autosuggest__input,
.autosuggest__input:focus {
  color: #eee;
  background-color: #2e3038;
} */

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
 {
  background: #f3f3f3;
}

.tmp-content .multiselect #tags-component:focus {
  color: #333;
}

.tmp-content .multiselect .multiselect__tags,
.tmp-content .multiselect .multiselect__single,
.tmp-content .multiselect #tags-component::placeholder {
  color: #444;
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
  background: var(--ac-color);
}

.tmp-content .deadline {
  color: #222 !important;
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

.header {
  position: absolute;
  user-select: none;
  position: relative;
  width: 150px;
  bottom: 30px;
  text-align: center;
  color: var(--ac-color);
  font-size: 1rem;
  margin: 0 auto;
}

.header-title {
  border-bottom: 2px solid;
  padding: 0 10px 5px 10px;
}

#adding-worker {
  position: relative;
}

.add-myself {
  background: var(--ac-bg-light-color);
  border: 3px solid var(--ac-bg-light-color);
  color: black;
  border-radius: 5px;
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
  color: var(--ac-color-light);
}

.unselected {
  color: #6c757d !important;
}

.selected {
  color: #eee !important;
}

.tmp-content {
  position: relative;
}

.tmp-content-mask {
  width: 80%;
  margin: 0 auto;
}

.task-add-section {
  padding-top: 50px;
}

.task-modal-input {
  width: 520px;
  margin-left: auto;
  /* right: 0; */
}

/* .header {
  position: relative;
  height: 100px;
  padding: 20px 0 0;
  border-radius: 5px;
  color: black;
} */

.exit-text {
  position: absolute;
  top: 50px;
  right: 30px;
  font-size: 20px;
}

.exit-position {
  color: black !important;
  position: absolute;
  right: 20px;
  font-size: 30px;
}

.display-4 {
  position: absolute;
  width: 100%;
  text-align: center;
}

/* .content input {
  width: 300px;
} */

.autosuggest__results,
.autosuggest__results_item.autosuggest__results_item-highlighted,
.autosuggest__results .autosuggest__results_item:active,
.autosuggest__results .autosuggest__results_item:focus,
.autosuggest__results .autosuggest__results_item:hover,
.tmp-content .calender-wrapper .flatpickr-input.form-control[readonly],
.tmp-content .multiselect .multiselect__tags,
.tmp-content .multiselect .multiselect__single,
.tmp-content .multiselect #tags-component,
.form-control,
.form-control:disabled,
.form-control[readonly] {
  background-color: #fff !important;
  color: #111 !important;
}

.form-control {
  display: inline;
  position: relative;
}

#tsk_deadline {
  width: 97%;
  cursor: pointer;
}

#tsk_desc {
  height: 290px;
}

.content .fas,
.content .far {
  color: var(--ac-color);
  font-size: 25px;
  margin: 3px;
  padding: 3px;
  cursor: pointer;
  width: 50px;
}

.icon-sizes {
  /* font-size: 10px; */
  font-weight: 900;
  margin: 0;
  padding: 0;
}

div.form-group {
  display: flex;
}

#auto-suggestion,
.calender-wrapper {
  padding-left: 22px;
  width: 100%;
}

#auto-suggestion .form-control {
  text-indent: 30px;
}

.tags-wrapper {
  font-size: 18px;
}

.tag {
  background-color: var(--ac-bg-light-color);
  border: 1px solid var(--ac-bg-light-color);
  border-radius: 5px;
}

.tag-text {
}

.fa-times {
  font-size: 16px;
}

.button-wrapper {
  justify-content: right;
}

.modal-btn {
  margin-left: auto;
  width: 110px;
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

.multiselect__input {
  color: black;
}

.fas {
  width: 43px;
  margin: 0;
}

.task-modal-input {
  width: 100%;
}

.content select,
.content .tmp-content .deadline,
.content .multiselect {
  width: 100%;
}
</style>
