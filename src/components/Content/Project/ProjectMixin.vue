<template>
  <div>
    <button class='btn btn-warning' @click='resetProjectView'>
      <span class='fas fa-arrow-left'></span> BACK</button>
    <div class='pro-edit'>
      <h4 v-if='edit'>Edit project:</h4>
      <h4 v-else>Adding project:</h4>

      <label for="name" class="mt-3">Project name</label>
      <input type="text" id="name" name="projectname" v-model="project.name" placeholder="Enter new project name" class="form-control mb-3">

      <label for="description">Description</label>
      <textarea id="description" rows="3" name="description" v-model='project.description' placeholder="Enter new project description..."
        class="form-control mb-3" spellcheck="false"></textarea>

      <label for="users">Users</label>
      <input type="text" id='users' v-model='project.users' placeholder="Enter email of people you want to add to the project"
        class="form-control mb-3">

      <label for="date">Deadline</label>
      <flat-pickr ref='datepicker' name="date" v-model="project.deadline" :config="config" id='flatPickrId' class="deadline form-control mb-3" placeholder="Pick a deadline (optional)">
      </flat-pickr>
      <!-- <input class="form-control mb-3" id="description" rows="3" name="description" v-model='project.deadline' placeholder="Enter new deadline..."
      /> -->

      <button v-if='edit' @click="projectEdit" class="btn btn-warning save">Save changes</button>
      <button v-else @click="projectCreate" class="btn btn-success save">Create project</button>
    </div>
  </div>
</template>

<script>
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { instance as axios } from "@/api/config.js";
import { store } from "@/store/index.js";
import { mapGetters } from "vuex";
import { mapState } from "vuex";
const flatpickr = require("flatpickr");
require("flatpickr/dist/themes/confetti.css");
export default {
  components: {
    flatPickr
  },
  data() {
    return {
      edit: true,
      project: {
        name: undefined,
        description: undefined,
        users: undefined,
        deadline: undefined
      },
      config: {
        wrap: true, // set wrap to true only when using 'input-group'
        // defaultDate: Date.now(),
        enableTime: true,
        time_24hr: true,
        dateFormat: "Y-m-d H:i:S",
        altFormat: "M	j, Y H:i",
        altInput: true
      }
    };
  },
  watch: {
    edit(val) {
      console.log(val);
      if (val === false) this.project.deadline = Date.now();
      // else{
        // this.project.deadline = 
      // }
    }
  },
  methods: {
    projectCreate() {
      axios
        .post("projects", this.project)
        .then(r => {
          if (r.data.status === "OK") {
            store.commit("modalStatus", {
              active: true,
              message:
                "Project '" +
                this.project.name +
                "' has been created succesfully"
            });
            store.dispatch("getUserProjects", {
              index: this.tabIndex
            });
          } else {
            store.commit("modalStatus", {
              active: true,
              ok: false,
              message: "Error: Couldn't create project '" + this.project.name
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    projectEdit() {
      axios
        .put("projects/:proid", {
          // Object.assign(project,)
          name: this.project.name,
          description: this.project.description,
          deadline: this.project.deadline,
          proid: store.getters.selectedItemID,
          sid: window.localStorage.sid
        })
        .then(r => {
          if (r.data.status === "OK") {
            store.commit("modalStatus", {
              active: true,
              message:
                "Project '" +
                this.project.name +
                "' has been edited succesfully"
            });
            store.dispatch("getUserProjects", {
              index: this.tabIndex
            });
          } else {
            store.commit("modalStatus", {
              active: true,
              ok: false,
              message:
                "Error: Couldn't edit project '" + this.project.name + "'"
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    resetProjectView() {
      store.commit("itemActionReset");
    }
  },
  computed: {
    ...mapGetters({
      projectID: "selectedItemID",
      // currentTabData: "currentTabData"
    }),
    ...mapState({
      tabIndex: "currentTabIndex"
    })
  }
};
</script>

<style scoped>
.pro-edit {
  display: flex;
  flex-direction: column;
}

/* .save {
  justify-content: right;
} */
</style>
