<script>
import FeedElement from "@/components/Feed/FeedElement.vue";
import { api } from "@/api/index";
import { store } from "@/store/index";
import { mapState, mapGetters } from "vuex";

export default {
  mixins: [FeedElement],

  data() {
    return {
      global: true,
      offset: 0,
      dataFromBegining: 0,
      firstLoadData: true,
    };
  },

  computed: {
    ...mapState({
      refreshGlobalFeed: state => state.refreshGlobalFeed,
    }),
  },
  watch: {
    refreshGlobalFeed(newVal, old){
      // console.log('watcher');
      if(newVal){
        firstLoadData = true;
        this.readeFeeds();
        store.commit('setRefreshGlobalFeed', false );
      }
    },
  },
  methods: {
    readeFeeds() {
      // console.log('reade feeds');
      store.commit("clearFeed");
      this.offset = 0;
      store
        .dispatch("readeGloablFeeds", {
          offset: this.offset,
          type: this.searchType,
          searchingstring: this.searchText,
          fed_important: this.searchImportant
        })
        .then(response => {
          this.offset += response.data.data.length;
          store.commit("addMessages", {
            direction: "down",
            data: response.data.data
          });
          if(this.firstLoadData){
            this.firstLoadData = true;
            store.dispatch("getFeedCount");
          }
          var time = 50;
          if (response.data.type == "files") time = 500;
          setTimeout(() => {
            this.scrollTOTop();
          }, time);
        });
    },
    addDown() {
      // console.log('add down');
      if (this.messages == null || this.messages.length == 0) return;
      store
        .dispatch("readeGloablFeeds", {
          offset: this.offset,
          type: this.searchType,
          searchingstring: this.searchText,
          fed_important: this.searchImportant
        })
        .then(response => {
          var length = response.data.data.length;
          this.offset += length;
          store.commit("addMessages", {
            direction: "down",
            data: response.data.data
          });
          if (length > 0) {
            setTimeout(() => {
              this.scrollAfterDown(length);
            }, 5);
          }
        });
    },
    addUp() {
      return;
    },
    scrollAfterDown(responseLength) {
      var a = document.querySelectorAll(".selector");
      a = a[this.messages.length - responseLength];
      a.scrollIntoView(true);
    }
  },
  destroyed() {
    // store.commit("notificationCount", 0);
    store.dispatch("getFeedCount");
  }
};
</script>
