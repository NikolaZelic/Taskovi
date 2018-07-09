<script>
import TaskAdd from "@/components/Content/Task/TaskAdd";
import {
  api
} from "@/api/index";
import {store} from "@/store/index";

export default {
  mixins: [TaskAdd],
  data() {
    return {
      task: false,
      componentTitle: 'Creating Step',
      // proId: 146,

    };
  },
  computed: {
    taskid(){
      return store.state.sidebarItemSelection[1];
      // return 61;
    },

  },
  methods: {
    createTask: function(){
      this.refreshErrors();

      var stop = false;
      if( this.title == null || this.title.length == 0 ){
        stop = true;
        this.titleError();
      }

      if( stop )
        return;
      // console.log('Ovdeee');
      var tagarray = this.selectedTags.map( e => e.text );
      var userarray = this.selectedUSers.map( e => e.id );

      api.createStep(this.proId, this.taskid, this.title, this.description, this.deadline, this.selectedPriorety, userarray, tagarray)
      .then(result =>{
        this.reportWritingToDB(result);
        // console.log('aaaa')
        store.commit("itemAddStep");
        // api.getTaskInfo(store.getters.selectedItemID);
      });
    }
  },
};
</script>
