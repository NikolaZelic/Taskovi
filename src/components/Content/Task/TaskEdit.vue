<template>
<div>

  <h4>Edit your task:</h4>

  <label for="tasktitle" class="mt-3">Task title</label>
  <input type="text" class="form-control mb-3" id="tasktitle" v-model="tasktitle" placeholder="Enter new title for your task">

  <label for="taskdesc">Description</label>
  <textarea class="form-control mb-3" id="taskdesc" rows="3" v-model='taskdesc' placeholder="Enter new description for your task..." spellcheck="false"></textarea>

  <label for="working">Who will work on this task?</label>
  <div id="working" class="mb-3">
    <label title="User">
      <input type="radio" name="working" v-model="working" value='user'>
      <span class="label-text">User</span>
    </label>

    <label title="Team" class="ml-3">
      <input type="radio" name="working" v-model="working" value='team'>
      <span class="label-text">Team</span>
    </label>
  </div>

  <div v-if="working === 'user'" class="mb-3">
    <multiselect v-model="value" :options="options" placeholder="Select user" track-by="id" @search-change="searchUserChange" :custom-label="showingUserResults"></multiselect>
  </div>

  <div v-if="working === 'team'" class="mb-3">
    <multiselect v-model="value" :options="options" placeholder="Select team" track-by="id" @search-change="searchTeamChange" label="name"></multiselect>
  </div>


  <label class="typo__label">Tags</label>
  <multiselect  class="mb-3" v-model="tagValue" tag-placeholder="Add this as new tag" placeholder="Search or add a tag" label="tag_text" track-by="tag_id" :options="tagOptions" :multiple="true" :taggable="true" @tag="addTag"></multiselect>

  <label class="typo__label">Priority</label>
  <multiselect class="mb-3" v-model="priorityValue" placeholder="Choose priority of this task" label="pri_text" track-by="pri_id" :options="priorityOptions"></multiselect>

  <label class="typo__label">Deadline:</label>
  <datetime type="datetime" v-model="deadline"></datetime>





  <!-- tsk_deadline tsk_urgent -->
</div>
</template>

<script>
import {store} from "@/store/index.js";
import axios from "axios";
import Multiselect from "vue-multiselect";
import { Datetime } from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css'


export default {
  components: {
    Multiselect,
    Datetime
  },

  data() {
    return {
      tasktitle: undefined,
      taskdesc: undefined,
      working: undefined,
      searchTerm: undefined,
      tags: [],
      deadline: undefined,

      priorityValue: [],
      priorityOptions: [],

      tagValue: [],
      tagOptions: [],


      // tagValue: undefined,
      // tagOptions: [],
      //
      value: undefined,
      options: []
    };
  },

  methods: {
    // addTag(newTag) {
    //   const tag = {
    //     name: newTag,
    //     code: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
    //   }
    //   this.tagOptions.push(tag)
    //   this.tagValue.push(tag)
    // },

    addTag(newTag) {
      const tag = {
        tag_text: newTag,
        tag_id: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
      }

      this.tagOptions.push(tag);
      this.tagValue.push(tag);

      axios.post("http://671n121.mars-t.mars-hosting.com/testTags", {tag_text: newTag});
      this.loadTags();
    },

    // addTagToDB(text) {
    //
    // },

    searchUserChange(term) {
      this.searchTerm = term;

      axios.get("http://671n121.mars-t.mars-hosting.com/mngapi/users", {
          params: {
            searchstring: this.searchTerm,
            sid: window.localStorage.getItem("sid")
          }
        })
        .then(response => {
          // if (response.data.data === undefined) {
          //   this.options = [];
          // } else {
          if (response.data.data !== undefined) {
            this.options = response.data.data;
          }
          // }
        });

    },

    searchTeamChange(term) {
      this.searchTerm = term;

      axios.get("http://671n121.mars-t.mars-hosting.com/mngapi/users", {
          params: {
            searchstring: this.searchTerm,
            sid: window.localStorage.getItem("sid")
          }
        })
        .then(response => {
          if (response.data.data !== undefined) {
            this.options = response.data.data;
          }
        });

    },

    showingUserResults({
      name,
      email,
      surname
    }) {
      return name + ' ' + surname + ' --- ' + email;
    },

    loadTags(){
      axios.get("http://671n121.mars-t.mars-hosting.com/testTags").then(response => {
// console.log(response.data.data[0].tag_text);
      // this.tagOptions = [{ name: response.data.data, code: 'js' }];
        //this.tagOptions = response.data.data;
        this.tagOptions = response.data.data;


      });
    },

    loadPriority(){
      axios.get("http://671n121.mars-t.mars-hosting.com/testPriority").then(response => {
        this.priorityOptions = response.data.data;
      });
    }
  },

  mounted(){
    this.loadTags();
    this.loadPriority();
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css">
</style><style scoped>
</style>
