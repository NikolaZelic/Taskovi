<template>
<div>

  <h4>Edit project:</h4>

  <label for="projectname" class="mt-3">Project name</label>
  <input type="text" class="form-control mb-3" id="projectname" name="projectname" v-model="projectName" placeholder="Enter new project name">

  <label for="description">Description</label>
  <textarea class="form-control mb-3" id="description" rows="3" name="description" v-model='projecDescription' placeholder="Enter new project description..." spellcheck="false"></textarea>

  <button @click="changeProject()" class="btn btn-success">Save changes</button>

</div>
</template>

<script>
import axios from "axios";
import { store } from "@/store/index.js";

export default {
  data() {
    return {
      projectName: undefined,
      projecDescription: undefined
    };
  },

  methods: {
    changeProject() {
      axios.put(
        "http://671n121.mars-t.mars-hosting.com/mngapi/projects/:proid",
        {
          grpname: this.projectName,
          grpdesc: this.projecDescription,
          proid: store.getters.selectedItemID,
          sid: window.localStorage.getItem("sid")
        }
      );
    }


  }
};
</script>

<style scoped>
</style>
