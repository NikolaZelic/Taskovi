<template>
  <div class="feed" :class='{darkTheme: darkTheme}' v-show="showFeeds">
    <div class="search-inputs">
      <input @blur="textInputBlur" v-model="searchText" type='text' placeholder="Search Feed" class='search' />
      <form>
        <span class='radio-wrapper'>
          <input type="radio" id="all" value="all" checked v-model='searchType'>
          <label for="all">All</label>
          <input type="radio" id="messages" value="messages" v-model='searchType'>
          <label for="messages">Messages</label>
          <input type="radio" id="statuses" value="statuses" v-model='searchType'>
          <label for="statuses">Statuses</label>
          <input type="radio" id="files" value="files" v-model='searchType'>
          <label for="files">Files</label>
        </span>
        <input type="checkbox" id='important' v-model='searchImportant'>
        <label for="important">Important</label>
      </form>
    </div>

    <div class='flex-chat-body'>
      <b-list-group v-if='!global'>
        <b-list-group-item v-for='(step, index) in steps' :key='index' :active='step.selected' @click='stepCicked(step)' >
          {{step.tsk_title}}
        </b-list-group-item>
      </b-list-group>

      <div id="all-messages" @scroll="handleScroll" class="feed-back">
        <div id='all2' class="messages">
          <global-feed-message v-if='global' v-for="(mess,i) in messages" :key="i" :mess="mess" />
          <feed-message v-if='!global' v-for="(mess,i) in messages" :key="i" :mess="mess" />
        </div>
      </div>

    </div>
    <div class="progress" v-show="inProgress">
      <p>LOADING FILE {{uploadProgress}}</p>
      <div class="in-progress" :style="'width:'+uploadProgress+'%'"></div>
    </div>
    <div v-if='!global' class="input">
      <button class="btn attach " @click="uploadFile">
        <span class="fas fa-paperclip"></span>
      </button>
      <input type="file" id="file" @change="changeFile" style="display:none;" />
      <!-- ATTACHMENT SYMBOL &#x1f4ce; -->
      <!-- <div class='message-input'> -->
      <textarea v-model="feed" placeholder="New Message..." @keyup='processKeyUp'></textarea>
      <button class="btn btn-success send" v-on:click="writeMessageFeed">
        <span class="fas fa-paper-plane"></span>
      </button>
      <!-- </div> -->
    </div>
    <div class='message-notificaton' :class='{"notification-on": haveNewMessage }' @click='reload'>
      You have a new message
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import FeedMessage from "./FeedMessage";
import GlobalFeedMessage from "./GlobalFeedMessage";
import { store } from "@/store/index.js";
import { api } from "@/api/index.js";

export default {
  components: {
    FeedMessage,
    GlobalFeedMessage
  },
  data() {
    return {
      global: false,
      showFeeds: true,
      count: 0,
      countNumber: 10,
      fInterval: null,
      feed: "",
      uploadProgress: 50,
      inProgress: false,
      searchType: "all",
      searchText: "",
      searchImportant: false,
      dataFromBegining: 1,
      haveNewMessage: false,
      numOfMessages: null,
      loadingData: false,
      test: true,
      steps: []
    };
  },
  computed: {
    ...mapState({
      messages: state => state.modulefeed.messages,
      darkTheme: state => state.darkTheme,
      searchFeedsParams: state => state.modulefeed.searchFeedsParams
    }),
    ...mapGetters({
      taskid: "selectedItemID"
    }),
    searchOn() {
      if (this.searchType !== "all") return true;
      if (this.searchImportant) return true;
      if (this.searchText !== null && this.searchText.length > 0) return true;
      return false;
    }
  },
  watch: {
    taskid(val) {
      if (val === "") return;
      // if(this.taskid != -1){
      store.dispatch("readeFeeds", {
        taskid: this.taskid,
        fedid: 0,
        direction: "start"
      });
      // }
    },
    messages(newVal, oldVal) {
      this.countNumber = 1;
      this.count = 0;
    },
    searchType() {
      this.dataFromBegining = 1;
      this.haveNewMessage = false;
      this.readeFeeds();
    },
    searchImportant() {
      this.readeFeeds();
    },
    steps() {
      console.log("Steps changed");
    }
  },
  methods: {
    stepCicked(step){
      this.jumpToStepFeed(this.taskid, step.tsk_timecreated);
    },
    textInputBlur(){
      if(this.searchText==null||this.searchText.length==0)
        return;
      this.readeFeeds();
    },
    reload() {
      store.commit("clearFeed");
      this.refreshSearchParams();
      this.dataFromBegining = 1;
      this.haveNewMessage = false;
      this.readeFeeds();
      store.commit("setSearchFeedParams", null);
    },
    refreshSearchParams() {
      this.searchType = "all";
      this.searchText = "";
      this.searchImportant = false;
    },
    processKeyUp(event) {
      if (event.key == "Enter") {
        if (event.shiftKey) {
          this.feed += "\n";
        } else {
          this.writeMessageFeed();
        }
      }
    },
    readeFeeds() {
      store.commit("clearFeed");
      this.loadingData = true;
      store
        .dispatch("readeFeeds", {
          taskid: this.taskid,
          fedid: 0,
          direction: "start",
          type: this.searchType,
          searchingstring: this.searchText,
          fed_important: this.searchImportant
        })
        .then(() => {
          this.scrollToBegining();
          this.numOfMessages = this.messages.length;
          this.loadingData = false;
        })
        .catch(err => {
          this.loadingData = false;
        });
    },
    writeMessageFeed() {
      if (this.taskid === -1) return;
      var text = this.feed.trim();
      if (text === "") {
        this.feed = "";
        return;
      }
      store.dispatch("postMessage", {
        taskid: this.taskid,
        text: text
      });
      setTimeout(() => {
        var a = document.querySelectorAll(".selector");
        a = a[a.length - 1];
        a.scrollIntoView(true);
      }, 500);
      this.feed = "";
    },
    uploadFile() {
      if (this.taskid == -1) return -1;
      document.getElementById("file").click();
    },
    changeFile(e) {
      var f = e.target.files[0];
      store.dispatch("sendAttach", {
        type: "file",
        file: f,
        taskid: this.taskid
      });
    },
    addUp() {
      if (this.loadingData) return;
      if (this.taskid === -1) return;
      if (this.messages == null || this.messages.length == 0) return;
      this.loadingData = true;
      store
        .dispatch("readeFeeds", {
          taskid: this.taskid,
          fedid: this.messages[0].fed_id,
          direction: "up",
          type: this.searchType,
          searchingstring: this.searchText,
          fed_important: this.searchImportant
        })
        .then(response => {
          if (
            response.data.data !== undefined &&
            response.data.data.length > 0
          ) {
            this.scrollAfterUp(response.data.data.length);
          }
          this.loadingData = false;
        })
        .catch(err => {
          this.loadingData = false;
        });
    },
    newMessages() {
      if (this.loadingData) return;
      api
        .checkNewwMessages(this.taskid)
        .then(result => {
          this.loadingData = false;
          if (result.data.status != "OK") {
            return;
          }
          if (result.data.data > 0) {
            var e = document.getElementById("all-messages");
            if (
              parseInt(e.offsetHeight) + parseInt(e.scrollTop) ==
              parseInt(e.scrollHeight)
            ) {
              this.addDown();
            } else {
              this.haveNewMessage = true;
            }
          }
        })
        .catch(err => {
          this.loadingData = false;
        });
    },
    addDown() {
      if (this.loadingData) return;
      api
        .readeFeeds(
          this.taskid,
          this.messages[this.messages.length - 1].fed_id,
          "down"
        )
        .then(result => {
          this.loadingData = false;
          if (result.data.status != "OK") {
            return;
          }
          if (result.data.data.length > 0) {
            store.commit("addMessages", {
              direction: "down",
              data: result.data.data
            });
          }
        })
        .catch(err => {
          this.loadingData = false;
        });
    },
    handleScroll(e) {
      var messages = document.querySelectorAll(".selector");
      for (var i in messages) {
        var message = messages[i];
        if (this.isInViewport(message)) {
          var selectedMessage = this.messages[i];
          var time = selectedMessage.fed_time;
          this.selectStep(time);
          break;
        }
      }
      if (
        parseInt(!this.dataFromBegining && e.target.offsetHeight) +
          parseInt(e.target.scrollTop) ==
        parseInt(e.target.scrollHeight)
      ) {
        this.addDown();
        return;
      }
      if (e.target.scrollTop === 0) {
        this.addUp();
      }
    },
    selectStep(time) {
      this.deselectSteps();
      time = this.$moment(time);
      var length = this.steps.length;
      for (var i = 0; i < length; i++) {
        var stepTime = this.$moment(this.steps[i].tsk_timecreated);
        if (
          time >= stepTime &&
          (i + 1 >= length ||
            time < this.$moment(this.steps[i + 1].tsk_timecreated))
        ) {
          // taj step treba da se selektuje
          this.steps[i].selected = true;
          var steps = this.steps;
          this.steps = [];
          this.steps = steps;
          return;
        }
      }
    },
    deselectSteps() {
      for (var i in this.steps) {
        this.steps[i].selected = false;
      }
    },
    scrollTOTop() {
      var a = document.querySelectorAll(".selector");
      if (a === undefined || a === null || a.length == 0) return;
      a = a[0];
      if (a !== undefined) a.scrollIntoView(true);
    },
    scrollToBegining() {
      var a = document.querySelectorAll(".selector");
      if (a === undefined || a === null || a.length == 0) return;
      if (a.length == 0) a = a[0];
      else {
        a = a[a.length - 1];
      }
      if (a !== undefined) a.scrollIntoView(true);
    },
    scrollAfterUp(responseLength) {
      var a = document.querySelectorAll(".selector");
      a = a[responseLength];
      a.scrollIntoView(true);
    },
    jumpToStepFeed(tsk_id, stp_time_created) {
      api.searchStepFeeds(tsk_id, stp_time_created).then(result => {
        if (result.data.status != "OK") {
          alert("Faild to load data");
          return;
        }
        store.commit("addMessages", {
          direction: "start",
          data: result.data.data
        });
        setTimeout(() => {
          this.scrollTOTop();
        }, 5);
      });
    },
    readeSteps() {
      api.getTaskInfo(this.taskid).then(result => {
        if (result.data.status != "OK") {
          alert(
            "Error happen while trying to get steps info. Reload the page."
          );
          return;
        }
        this.steps = result.data.data;
        this.deselectSteps();
      });
    },
    isInViewport(el) {
      const rect = el.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      var wrapperTop = document.getElementById("all2").offsetTop + 50;
      const vertInView =
        rect.top <= windowHeight &&
        rect.top + rect.height >= 0 &&
        rect.top >= wrapperTop;
      return vertInView;
    }
  },
  mounted() {
    if (!this.global) {
      this.readeSteps();
    }
    if (this.searchFeedsParams === null) {
      this.readeFeeds();
    } else {
      this.dataFromBegining = 0;
      var tsk_id = this.searchFeedsParams.tsk_id;
      var stp_time_created = this.searchFeedsParams.stp_time_created;
      this.jumpToStepFeed(tsk_id, stp_time_created);
    }

    // ZX - POZIVA REFRESH NOTIFA
    store.dispatch("getFeedCount");

    //poziva api svaki put kada je count deljiv sa countNumber
    this.fInterval = setInterval(() => {
      if (
        this.count % this.countNumber == 0 &&
        this.taskid != -1 &&
        !this.searchOn
      ) {
        if (this.messages.length > 0) {
          this.newMessages();
        }
      }
      this.count++;
      if (this.count == 10) {
        this.countNumber = 5;
      } else if (this.count == 60) {
        this.countNumber = 30;
      }
    }, 1000);
  },
  destroyed() {
    clearInterval(this.fInterval);
    store.commit("clearFeed");
    store.commit("setSearchFeedParams", null);
    this.dataFromBegining = 1;
  }
};
</script>
<style scoped>
#all-messages{
  height: 500px;
}
.search-inputs {
  margin: 10px auto 0;
}

.message-notificaton {
  background-color: green;
  padding: 20px;
  position: fixed;
  right: 20px;
  bottom: 20px;
  height: 100px;
  width: 150px;
  display: none;
}

.notification-on {
  display: block;
}

.search-inputs {
  margin: 10px;
  text-align: center;
}

.search-inputs * {
  padding: 5px;
}

.search-inputs input[type="text"] {
  width: 400px;
  border-radius: 5px;
}

.darkTheme .search {
  background-color: #232323 !important;
  border: 1px solid #d2d2d236;
}

.search {
  background-color: #fff;
  border: 1px solid #d2d2d2b3;
}

.list-group {
  height: 100%;
  overflow-x: auto;
  border-right: 1px solid #8a888866;
}

.list-group-item {
  border: none;
}

.darkTheme .list-group-item {
  background: var(--dark);
}

.trans {
  flex: 0 0 30px;
}

.trans .btn {
  width: 100%;
  height: 100%;
}

.feed {
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
}

.flex-chat-body {
  display: flex;
  margin-bottom: 10px;
  flex: 1;
  /* max-height: 50%; */
  border: 1px solid #8a888866;
  border-radius: 5px;
  background: #fff;
}

.feed-back {
  overflow-y: auto;
  word-wrap: break-word;
  flex: 1;
  display: flex;
  background: #fff;
}

/* .darkTheme .feed-back,
.darkTheme .flex-chat-body {
  background: var(--sec-bg-color);
} */

.feed-back .load {
  margin: auto;
  display: block;
  line-height: 0.5;
}

.input {
  bottom: 0px;
  display: flex;
  align-items: center;
  position: relative;
}

/* .input > * {
  margin: 0 0 0 5px;
} */

.input textarea {
  color: black;
  padding: 5px 65px 5px;
  flex: 1;
  background-color: #fff;
  border-color: #8a888866;
  font-size: 16px;
  resize: none;
  border-radius: 5px;
}

.input button {
  position: relative;
  border-radius: 5px;
  width: 42px;
  height: 42px;
}

.input button:first-child {
  position: absolute;
  left: 15px;
  background: #5da6f5f0;
}

.input button:last-child {
  position: absolute;
  right: 15px;
}

.input button > span {
  font-size: 16px;
}

.message-input {
  position: relative;
}

.progress {
  margin: 0 auto;
  position: relative;
  width: 90%;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 5px;
}

.progress p {
  position: absolute;
  text-align: center;
  width: 100%;
  font-size: 12px;
}

.progress .in-progress {
  background-color: #0a0;
  height: 100%;
  width: 0;
}

.messages {
  /* max-height: 350px; */
  width: 96%;
}
</style>
