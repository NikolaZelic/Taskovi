<template>
<div>

  <h4>Adding project:</h4>

  <label for="projectname" class="mt-3">Project name</label>
  <input type="text" class="form-control mb-3" id="projectname" name="projectname" v-model="projectName" placeholder="Enter project name">

  <label for="description">Description</label>
  <textarea class="form-control mb-3" id="description" rows="3" name="description" v-model='projectDescription' placeholder="Tell us a little something about your project..." spellcheck="false"></textarea>

  <multiselect v-model="value" :options="options" placeholder="Select one" label="title" track-by="id"></multiselect>
  <small class="form-text text-muted mb-3">It's not mandatory to choose company; projects can exist without one.</small>

  <button @click="addProject()" class="btn btn-success">Create project</button>


<br><br><br><br><br>

<!-- <multiselect  :options="users" placeholder="Search for user you want to add..." label="name"></multiselect> -->

</div>
</template>

<script>
import axios from "axios";
import Multiselect from "vue-multiselect";

export default {
  components: {
    Multiselect
  },

  data() {
    return {
      projectName: "",
      projectDescription: "",

      value: {
        title: "Which company this project will be a part of?",
        id: 0
      },
      options: [],
      users: []
    };
  },

  methods: {
    addProject() {
      axios.post("http://671n121.mars-t.mars-hosting.com/mngapi/companies/:comid/projects", {
        grpname: this.projectName,
        grpdesc: this.projectDescription,
        grporigin: this.value.id,
        sid: window.localStorage.sid
      });
    },

    getAdminCompanies() {
      axios
        .get("http://671n121.mars-t.mars-hosting.com/mngapi/users/companies", {
          params: {
            isadmin: true,
            sid: window.localStorage.sid
          }
        })
        .then(response => {
          this.options = response.data.data;
        });
    },

    getUsers() {
      axios
        .get("http://671n121.mars-t.mars-hosting.com/testUsers")
        .then(response => {
          this.users = response.data.Result;
        });
    }
  },

  mounted() {
    this.getAdminCompanies();
    this.getUsers();
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css">
</style><style scoped>
</style>
