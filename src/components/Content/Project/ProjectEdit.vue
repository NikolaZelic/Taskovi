<template>
  <div>
    <button class='btn btn-warning' @click='resetProjectView'>
      <span class='fas fa-arrow-left'></span> BACK</button>
    <div class='pro-edit'>
      <h4>Edit project:</h4>

      <label for="projectname" class="mt-3">Project name</label>
      <input type="text" class="form-control mb-3" id="projectname" name="projectname" v-model="project.name" placeholder="Enter new project name">

      <label for="description">Description</label>
      <textarea class="form-control mb-3" id="description" rows="3" name="description" v-model='project.description' placeholder="Enter new project description..."
        spellcheck="false"></textarea>

      <label for="description">Deadline</label>
      <input class="form-control mb-3" id="description" rows="3" name="description" v-model='project.deadline' placeholder="Enter new deadline..."
      />

      <button @click="projectEdit" class="btn btn-warning save">Save changes</button>
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
      project: {
        name: undefined,
        description: undefined,
        deadline: undefined
      }
    };
  },
  watch: {
    projectID(val) {
      this.projectInfo();
    }
  },

  methods: {
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
          console.log(r);
          store.dispatch("getUserProjects", {
            index: this.tabIndex
          });
        })
        .catch(e => {
          console.log(e);
        });
    },
    projectInfo() {
      for (var i = 0; i < this.currentTabData.length; i++) {
        var ctd = this.currentTabData[i];
        if (this.projectID === ctd.id) {
          this.project.name = ctd.title;
          this.project.description = ctd.pro_description;
          this.project.deadline = ctd.pro_deadline;
        }
      }
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
  },
  mounted() {
    this.projectInfo();
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
