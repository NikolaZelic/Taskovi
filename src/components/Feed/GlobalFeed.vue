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
      searchType: 'all',
      notificationToBeMarkde: 0,
    };
  },

  computed: {
    ...mapState({
      refreshGlobalFeed: state => state.refreshGlobalFeed,
      notifCount: "notificationCount",
    }),
  },
  watch: {
    refreshGlobalFeed(newVal, old){
      if(newVal){
        this.firstLoadData = true;
        this.readeFeeds();
        store.commit('setRefreshGlobalFeed', false );
      }
    },
  },
  methods: {
    readeFeeds() {
      // console.log("readeFeeds");
      this.loadingData = true;
      this.notificationToBeMarkde = this.notifCount;
      store.commit("clearFeed");
      this.offset = 0;
      let params = {
          offset: this.offset,
          type: this.searchType,
          searchingstring: this.searchText,
      };
      this.addImportantToParams(params);
      store
        .dispatch("readeGloablFeeds", params)
        .then(response => {
          this.loadingData = false;
          var length = response.data.data.length
          this.offset += length;

          store.commit("addMessages", {
            direction: "start",
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
      // console.log("addDown");
      this.loadingData = true;
      if (this.messages == null || this.messages.length == 0) return;
      let params = {
          offset: this.offset,
          type: this.searchType,
          searchingstring: this.searchText,
      };
      this.addImportantToParams(params);
      store
        .dispatch("readeGloablFeeds", params)
        .then(response => {
          var length = response.data.data.length;
          this.offset += length;
          this.loadingData = false;

          // Seting up unseen messges
          if(this.notificationToBeMarkde >= this.offset ){ // All messages should be marked
            for(var i=0; i<length; i++){
              response.data.data[i].unseen = 1;
            }
          }
          else if( this.notificationToBeMarkde > this.offset - length ){ // Just some messages should be marked
            for(var i=0; i<=this.notificationToBeMarkde%length && i<=length; i++){
              response.data.data[i].unseen = 1;
            }
          }
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
      a = a[this.messages.length - responseLength-1];
      a.scrollIntoView(false);
    }
  },
  destroyed() {
    store.dispatch("getFeedCount");
    this.notificationToBeMarkde = 0;
  },
};
</script>
