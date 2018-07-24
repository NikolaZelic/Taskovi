
<script>
import FeedElement from '@/components/Feed/FeedElement.vue';
import { api } from "@/api/index";
import { store } from "@/store/index";
import { mapState, mapGetters } from "vuex";

export default {
  mixins: [FeedElement],

  data() {
    return {
        global: true,
        offset: 0,
    };
  },

  computed: {

  },

  methods: {
    readeFeeds(){
        store.commit('clearFeed');
        this.offset = 0;
        store.dispatch("readeGloablFeeds", {
            offset: this.offset,
            type: this.searchType,
            searchingstring: this.searchText,
            fed_important: this.searchImportant,
        })
        .then(response => {
            this.offset += response.data.data.length;
            var time = 50;
            if(response.data.type=='files')
                time = 500;
            setTimeout( ()=>{
                var a = document.querySelectorAll(".selector");
                if(a===undefined||a===null||a.length==0)
                    return;
                if(a.length==0)
                    a = a[0];
                else{
                    a = a[a.length-1];
                }
                if(a!==undefined)
                    a.scrollIntoView(true);
            }, time );
            store.commit('addMessages', {
            'direction': 'up',
            'data': response.data.data
            });
        });
    },
    addUp(){
        if(this.messages==null||this.messages.length==0)
            return;
        store.dispatch("readeGloablFeeds", {
            offset: this.offset,
            type: this.searchType,
            searchingstring: this.searchText,
            fed_important: this.searchImportant,
        }).then(response => {
            var length = response.data.data.length;
            this.offset += length;
            if(length>0)
                setTimeout( ()=>{this.scrollToBegining();}, 50 );
            store.commit('addMessages', {
            'direction': 'up',
            'data': response.data.data
            });
        });
    },
    addDown(){
        return;
    },
  },

};
</script>
