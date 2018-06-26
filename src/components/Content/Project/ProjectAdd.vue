<script>
import { instance as axios } from "@/api/config.js";
import { store } from "@/store/index.js";
import ProjectMixin from "@/components/Content/Project/ProjectMixin";

export default {
  mixins: [ProjectMixin],
  data() {
    return {
      edit: false
    };
  }
};
</script>
