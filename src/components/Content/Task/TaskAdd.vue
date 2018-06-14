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
    parenttaskid(){
      return 24;
    }
  },
  methods: {
    createTask: function(){
      if( this.title == null || this.title.length == 0 ){
        return;
      }
      if( this.choosenWorker == null ){
        return;
      }

      var usrid = null;
      var teamid = null;
      if( this.teamSelect == 1 )
        teamid = this.choosenWorker.id;
      else
        usrid = this.choosenWorker.id;

      var tagarray = this.selectedTags.map( e => e.id );

      api.createTask(this.title, this.description, this.deadline, usrid, teamid, tagarray, this.selectedPriorety, this.parenttaskid)
      .then(result =>{
        console.log(result.data);
      });
    }
  },
};
</script>
