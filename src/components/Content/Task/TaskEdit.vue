<script>
import ParenttaskAdd from "@/components/Content/Task/ParenttaskAdd";
import {
  api
} from "@/api/index";
import {
  store
} from "@/store/index";

export default {
  mixins: [ParenttaskAdd],
  data() {
    return {
      task: true,
      haveChange: false,
    };
  },
  computed: {
    taskid(){
      return store.state.sidebarItemSelection[2];
    }
  },
  created: function(){
    // Treba pozvati api i procitati podatke o tasku
    var response = api.selectTask(taskid);
    console.log(response);
    var data = response.data.data;

    this.title = data.task-title;
    this.description =  data.task-description;
    this.deadline = data.deadline;
    if( data.user-working != null ){
      this.teamSelect = 0;  // Boolean koji govori da li je tim selektovan ili covek
      this.choosenWorker = data.user-working;
    }
    else{
      this.teamSelect = 1;  // Boolean koji govori da li je tim selektovan ili covek
      this.choosenWorker = data.group-working;
    }

    // Treba dodati
    // this.selectedTags = [];
    // this.selectedPriorety = null;

  },

  methods: {
  },
};
</script>
