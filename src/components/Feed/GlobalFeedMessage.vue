
<script>
import FeedMessage from "./FeedMessage";
import { api } from "@/api/index";
import { store } from "@/store/index";
import { mapState, mapGetters } from "vuex";

export default {
  mixins: [FeedMessage],

  data() {
    return {
        global: true,
    };
  },

  computed: {
      
  },

  methods: {

  },

};
</script>
