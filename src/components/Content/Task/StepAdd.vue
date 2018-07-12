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
        // console.log('iz stepadd-a result ' + result.data.data.status)
        // console.log('before writing to DB in staepadd');
        this.reportWritingToDB(result);
        // console.log('after writing to DB in staepadd');
        // console.log('aaaa')
        store.commit("itemAddStep");
        // api.getTaskInfo(store.getters.selectedItemID);
      });
    },

    reportWritingToDB(result) {
      if (result.data.status === "OK") {
        store.commit("modalStatus", {
          active: true,
          ok: true,
          message: result.data.message
        });
      } else if(result.data.status === "ERR"){
        store.commit("modalStatus", {
          active: true,
          ok: false,
          message: result.data.message
        });
      }
    }

  },
};
</script>
<style>
  .multiselect__input{
    color: black;
  }
</style>
