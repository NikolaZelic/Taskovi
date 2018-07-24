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
      offset: 0
    };
  },

  computed: {},

  methods: {
    readeFeeds() {
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
            direction: "up",
            data: response.data.data
          });
          var time = 50;
          if (response.data.type == "files") 
            time = 500;
          setTimeout(() => {
            this.scrollToBegining();
          }, time);
        });
    },
    addUp() {
      if (this.messages == null || this.messages.length == 0) 
        return;
      store.dispatch("readeGloablFeeds", {
          offset: this.offset,
          type: this.searchType,
          searchingstring: this.searchText,
          fed_important: this.searchImportant
        })
        .then(response => {
          var length = response.data.data.length;
          this.offset += length;
          store.commit("addMessages", {
            direction: "up",
            data: response.data.data
          });
          if (length > 0){
            setTimeout(() => {
                this.scrollAfterUp(length);
            }, 5);
          }
        });
    },
    addDown() {
      return;
    }
  },

  destroyed() {
    store.commit("notificationCount", 0);
  }
};
</script>
