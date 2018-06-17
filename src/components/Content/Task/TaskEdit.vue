<script>
import ParenttaskAdd from "@/components/Content/Task/ParenttaskAdd";
import {
  api
} from "@/api/index";

export default {
  mixins: [ParenttaskAdd],
  data() {
    return {
      task: true,
    };
  },
  computed: {
    taskid(){
      return 24;
    }
  },
  created: function(){
    // Treba pozvati api i procitati podatke o tasku
    var response = api.selectTask(taskid);
    console.log(response);
  },
  methods: {
  },
};
</script>
