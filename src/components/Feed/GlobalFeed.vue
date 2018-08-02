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
      // console.log('watcher');
      if(newVal){
        this.firstLoadData = true;
        this.readeFeeds();
        store.commit('setRefreshGlobalFeed', false );
      }
    },
  },
  methods: {
    readeFeeds() {
      // console.log('reade feeds');
      // console.log(this.notifCount);
      this.notificationToBeMarkde = this.notifCount;
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
          var length = response.data.data.length
          this.offset += length;

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
          // Seting up unseen messges
          console.log(this.notificationToBeMarkde);
          if(this.notificationToBeMarkde >= this.offset ){ // All messages should be marked
            // console.log('Sve su postavljene');
            for(var i=0; i<length; i++){
              response.data.data[i].unseen = 1;
            }
          }
          else if( this.notificationToBeMarkde > this.offset - length ){ // Just some messages should be marked
            // console.log('Neke su postavljene');
            for(var i=0; i<=this.notificationToBeMarkde%length && i<=length; i++){
              response.data.data[i].unseen = 1;
            }
          }
          // else
          //   console.log('Nista nije postavljeno');
          
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
      // console.log(a);
      // console.log('messages '+ this.messages.length);
      // console.log('response '+ responseLength);
      a = a[this.messages.length - responseLength-1];
      // console.log(a);
      a.scrollIntoView(false);
    }
  },
  destroyed() {
    // store.commit("notificationCount", 0);
    store.dispatch("getFeedCount");
    this.notificationToBeMarkde = 0;
  },
  // mounted(){
  //   console.log(this.notifCount);
  // }
};
</script>
