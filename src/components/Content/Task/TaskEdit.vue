<script>
import TaskAdd from "@/components/Content/Task/TaskAdd";
import { api } from "@/api/index";
import { store } from "@/store/index";
import { mapState, mapGetters } from "vuex";

export default {
  mixins: [TaskAdd],
  data() {
    return {
      task: true,
      haveChange: false,
      edit: true,
      componentTitle: "Edit Task"
    };
  },
  computed: {
    ...mapGetters({
      taskID: "selectedItemID",
      currentTabData: "currentTabData"
    })
  },
  created: function() {
    var response = api.selectTask(this.taskID);
    console.log(response);
    var data = response.data.data;

    this.title = data.task - title;
    this.description = data.task - description;
    this.deadline = data.deadline;
    if (data.user - working != null) {
      this.teamSelect = 0; // Boolean koji govori da li je tim selektovan ili covek
      this.choosenWorker = data.user - working;
    } else {
      this.teamSelect = 1; // Boolean koji govori da li je tim selektovan ili covek
      this.choosenWorker = data.group - working;
    }

    // Treba dodati
    // this.selectedTags = [];
    // this.selectedPriorety = null;
  },

  methods: {}
};
</script>
