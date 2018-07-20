<script>
import TaskAdd from "@/components/Content/Task/TaskAdd";
import TaskView from "@/components/Content/Task/TaskView";
import { api } from "@/api/index";
import { store } from "@/store/index";
import { mapState, mapGetters } from "vuex";
import axios from "axios";

export default {
  mixins: [TaskAdd],
  data() {
    return {
      title: undefined,
      description: undefined,
      deadline: undefined,
      selectedPriorety: undefined,
      selectedTags: [],
      selectedUSers: [],
      task: true,
      haveChange: false,
      edit: true,
      componentTitle: "Edit Task",
      currentInfo: [],
      title: undefined,
      description: undefined,
      deadline: undefined
    };
  },
  computed: {
    ...mapGetters({
      taskID: "selectedItemID",
      currentTabData: "currentTabData"
    }),

    ...mapState({
      suggestedWorker: state => store.getters.getSuggestedUsers,
      suggestedTags: state => state.modulework.suggestedTags,
      suggestedProjects: state => state.modulework.suggestedProjects,
      proId: state => state.sidebarItemSelection[0]
    }),

    tags() {
      let nizTagova = [];

      for (var i = 0; i < this.selectedTags.length; i++) {
        nizTagova.push(this.selectedTags[i].text);
      }
      return nizTagova;
    }
  },

  methods: {
    createTask() {
      this.waitNet = true;
      var userarray = this.selectedUSers.map( e => e.id );

      axios
        .put("http://695u121.mars-t.mars-hosting.com/mngapi/tasks/:tasid", {
          sid: localStorage.sid,
          tasid: this.taskID,
          title: this.title,
          description: this.description,
          deadline: this.deadline,
          tagarray: JSON.stringify(this.tags),
          userarray: JSON.stringify(userarray),
          priority: this.selectedPriorety
        })
        .then(response => {
          if (response.data.status === "OK") {
            store.dispatch("getTasks", {
              index: 1,
              pro_id: this.proId
            });
            store.commit("modalStatus", {
              message: "Task has been edited succesfully"
            });
          } else {
            store.commit("modalStatus", {
              ok: false,
              message: "Error: Couldn't edit task"
            });
          }
          store.dispatch("itemActionReset");
          this.waitNet = false;
        })
        .catch(e => {
          this.waitNet = false;
        });
    },

    loadInfo() {
      axios
        .get("http://695u121.mars-t.mars-hosting.com/mngapi/tasks/:tasid", {
          params: {
            sid: localStorage.sid,
            tasid: store.state.itemAction.edit
          }
        })
        .then(response => {
          this.title = response.data.data[0].tsk_title;
          this.description = response.data.data[0].description;
          this.deadline = response.data.data[0].tsk_deadline;
          this.selectedPriorety = response.data.data[0].pri_id;
          this.selectedTags = response.data.data[0].tags;
          this.selectedUSers = response.data.data[0].usrworking;
        });
    }
  },

  mounted() {
    this.loadInfo();
  }
};
</script>
