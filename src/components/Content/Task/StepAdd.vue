<script>
import TaskAdd from "@/components/Content/Task/TaskAdd";
import { api } from "@/api/index";
import { store } from "@/store/index";

export default {
  mixins: [TaskAdd],
  data() {
    return {
      task: false,
      componentTitle: "Creating Step"
      // proId: 146,
    };
  },
  computed: {
    taskid() {
      return store.state.sidebarItemSelection[1];
    },

    blankTitle() {
      return this.title.length === 0;
    }
  },
  methods: {
    createTask: function() {
      this.waitNet = true;
      this.refreshErrors();

      var stop = false;
      if (this.title == null || this.title.length == 0) {
        stop = true;
        this.titleError();
      }

      if (stop) return;
      var tagarray = this.selectedTags.map(e => e.text);
      var userarray = this.selectedUSers.map(e => e.id);

      api
        .createStep(
          this.proId,
          this.taskid,
          this.title,
          this.description,
          this.deadline,
          this.selectedPriorety,
          userarray,
          tagarray
        )
        .then(result => {
          this.reportWritingToDB(result);
          store.commit("itemAddStep");
          this.waitNet = false;
        })
        .catch(e => {
          this.waitNet = false;
        });
    },

    reportWritingToDB(result) {
      if (result.data.status === "OK") {
        store.commit("modalStatus", {
          message: result.data.message
        });
      } else if (result.data.status === "ERR") {
        store.commit("modalStatus", {
          ok: false,
          message: result.data.message
        });
      }
    }
  }
};
</script>
<style scoped>
.multiselect__input {
  color: black;
}

.fas[data-v-1f68b3d0]{
  width: 43px;
  margin: 0;
}

.task-modal-input[data-v-1f68b3d0]{
  width: 100%;
  padding-left: 10px;
}

select.form-control:not([size]):not([multiple]){
  margin-left: 10px;
}
</style>
