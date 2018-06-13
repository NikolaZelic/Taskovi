<script>
import ParenttaskAdd from "@/components/Content/Task/ParenttaskAdd";

export default {
  mixins: [ParenttaskAdd],
  data() {
    return {
      task: true,
      selectedPriorety: null,

    };
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

      
    }
  },
};
</script>
