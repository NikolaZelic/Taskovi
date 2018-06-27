<template>
  <div>
    <button class='btn btn-warning' @click='resetProjectView'>
      <span class='fas fa-arrow-left'></span> BACK</button>
    <div class='pro-edit'>
      <h4 v-if='edit'>Edit project:</h4>
      <h4 v-else>Adding project:</h4>

      <label for="projectname" class="mt-3">Project name</label>
      <input type="text" class="form-control mb-3" id="projectname" name="projectname" v-model="project.name" placeholder="Project name">

      <label for="description">Description</label>
      <textarea class="form-control mb-3" id="description" rows="3" name="description" v-model='project.description' placeholder="Project description..."
        spellcheck="false"></textarea>

      <label for="description">Deadline</label>
      <input class="form-control mb-3" id="description" rows="3" name="description" v-model='project.deadline' placeholder="Time to complete project"
      />

      <button v-if='edit' @click="projectEdit" class="btn btn-warning save">
        <span class='fas fa-save'></span> Save changes</button>
      <button v-else @click="addProject" class="btn btn-success save">
        <span class='fas fa-plus-square'></span> Create project</button>
    </div>
  </div>
</template>

<script>
import { instance as axios } from "@/api/config.js";
import { store } from "@/store/index.js";
import { mapGetters } from "vuex";
import { mapState } from "vuex";
export default {
  data() {
    return {
      edit: true,
      project: {
        name: undefined,
        description: undefined,
        deadline: undefined
      }
    };
  },
  methods: {
    addProject() {
      axios
        .post("projects", {
          name: this.project.name,
          description: this.project.description,
          deadline: this.project.deadline,
          sid: window.localStorage.sid
        })
        .then(r => {
          if (r.data.status === "OK")
            store.dispatch("getUserProjects", {
              index: this.tabIndex
            });
        })
        .catch(e => {
          console.log(e);
        });
    },
    projectEdit() {
      axios
        .put("projects/:proid", {
          name: this.project.name,
          description: this.project.description,
          deadline: this.project.deadline,
          proid: store.getters.selectedItemID,
          sid: window.localStorage.sid
        })
        .then(r => {
          console.log(r.data.status);
          if (r.data.status === "OK")
            store.dispatch("getUserProjects", {
              index: this.tabIndex
            });
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
      currentTabData: "currentTabData"
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
