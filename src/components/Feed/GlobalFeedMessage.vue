
<script>
import FeedMessage from "./FeedMessage";
import { api } from "@/api/index";
import { store } from "@/store/index";
import { mapState, mapGetters } from "vuex";
import {
  baseURL as baseURL
} from '@/api/config.js';

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
    showFile() {
      return (
        baseURL+"tasks/" +
        this.mess.tsk_id +
        "/feeds/" +
        this.mess.fed_id +
        "?sid=" +
        localStorage.sid
      );
    },
  },

};
</script>
