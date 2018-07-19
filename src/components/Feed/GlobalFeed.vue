
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
    readeFeeds(){
        store.commit('clearFeed');

        store.dispatch("readeGloablFeeds", {
            ofset: 0,
            type: this.searchType,
            searchingstring: this.searchText,
            fed_important: this.searchImportant,
            }).then( ()=>{
                this.scrollToBegining();
            }
        );
    },
    addUp(){

    },
    addDown(){

    },
  },

};
</script>
