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
      task: true,
      haveChange: false,
      edit: true,
      componentTitle: "Edit Task",

      title: undefined,
      description: undefined,
      deadline: undefined,
      selectedTags: [],
      selectedPriorety: undefined
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
  // created: function() {
  //   var response = api.selectTask(this.taskID);
  //   console.log(response);
  //   var data = response.data.data;
  //
  //   this.title = data.task - title;
  //   this.description = data.task - description;
  //   this.deadline = data.deadline;
  //   if (data.user - working != null) {
  //     this.teamSelect = 0; // Boolean koji govori da li je tim selektovan ili covek
  //     this.choosenWorker = data.user - working;
  //   } else {
  //     this.teamSelect = 1; // Boolean koji govori da li je tim selektovan ili covek
  //     this.choosenWorker = data.group - working;
  //   }
  //
  //   // Treba dodati
  //   // this.selectedTags = [];
  //   // this.selectedPriorety = null;
  // },

  methods: {
    createTask() {
      axios
        .put("http://695u121.mars-t.mars-hosting.com/mngapi/tasks/:tasid", {
          sid: window.localStorage.sid,
          tasid: this.taskID,
          title: this.title,
          description: this.description,
          deadline: this.deadline,
          tagarray: JSON.stringify(this.tags),
          priority: this.selectedPriorety
        })
        .then(response => {
          if (response.data.status === "OK") {
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
          // store.dispatch("getTasks()", this.proId);
        });
    }
  }
};
</script>
