
<script>
import FeedElement from '@/components/Feed/FeedElement.vue';
import { api } from "@/api/index";
import { store } from "@/store/index";
import { mapState, mapGetters } from "vuex";

export default {
  mixins: [FeedElement],

  data() {
    return {
    };
  },

  computed: {

  },

  methods: {

  },

  mounted() {
    store.dispatch("readeFeeds", {
    taskid: this.taskid,
    fedid: 0,
    direction: "start"
    }).then( ()=>{
      this.scrollToBegining();
    });

    // ZX - POZIVA REFRESH NOTIFA
    store.dispatch("getFeedCount");

    //poziva api svaki put kada je count deljiv sa countNumber
    this.fInterval = setInterval(() => {
      if (this.count % this.countNumber == 0 && this.taskid != -1 && !this.searchOn ) {
        var msg = this.messages;

        if (msg.length > 0) {
          store.dispatch("readeFeeds", {
            taskid: this.taskid,
            fedid: msg[msg.length - 1].fed_id,
            direction: "down"
          });
        } 
      }
      if (this.count++ >= 25) {
        this.countNumber = 10;
        this.count = 1;
      }
    }, 1000);
  }
};
</script>
