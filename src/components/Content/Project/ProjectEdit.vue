<script>
import { instance as axios } from "@/api/config.js";
import { store } from "@/store/index.js";
import ProjectMixin from "@/components/Content/Project/ProjectMixin";

export default {
  mixins: [ProjectMixin],
  data(){
    return {
      edit: true,
    }
  },
  watch: {
    projectID(val) {
      this.projectInfo();
    }
  },

  methods: {
    projectInfo() {
      for (var i = 0; i < this.currentTabData.length; i++) {
        var ctd = this.currentTabData[i];
        if (this.projectID === ctd.id) {
          this.project.name = ctd.title;
          this.project.description = ctd.pro_description;
          this.project.deadline = ctd.pro_deadline;
        }
      }
    },
   
  },
  mounted() {
    this.projectInfo();
  }
};
</script>
