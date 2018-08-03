<template>
  <div id="drop-area" class="feed" :class='{darkTheme: darkTheme}' v-show="showFeeds">
    <input type="file" id="fileElem" onchange="handleFiles(this.files)" />

    <div id="text" class="displayNone">Drop to upload</div>

    <div class="search-inputs">
      <input @blur="textInputBlur" @keyup.enter='textInputBlur' v-model="searchText" type='text' placeholder="Search Feed" class='search' />
      <form class='form-search'>
        <b-form-radio-group class='radio-group' v-model="searchType" :options="radioFilter"></b-form-radio-group>
        <b-form-checkbox v-model="searchImportant">Important</b-form-checkbox>
      </form>
    </div>

    <div class='flex-chat-body'>
      <b-list-group v-if='!global&&timestamps.length>0'>
        <b-list-group-item v-for='(timestamp, index) in timestamps' :key='index' :active='timestamp.selected' @click='stepCicked(timestamp)'
          :title='timestamp.fed_time'>
          {{timestamp.fed_text}}
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
      <textarea v-model="feed" placeholder="New Message..." @keyup='processKeyUp'></textarea>
      <button class="btn btn-success send" v-on:click="writeMessageFeed">
        <span class="fas fa-paper-plane"></span>
      </button>
    </div>
    <b-alert variant="success" :show="haveNewMessage" class='message-notificaton'>
      <span @click='reload' style='display:flex'>You have a new message!</span>
    </b-alert>
    <b-modal ref='stepModal' id='creating-step' size="sm" @ok='createNewStep' @shown='clearStepCreateContent' title='Creating new step'>
      <table class='modal-table'>
        <tr v-if='selectedStep!=null'>
          <td>Time:</td>
          <td>
            {{$moment(selectedStep.fed_time).format('YYYY-MM-DD HH:mm')}}</td>
        </tr>
        <tr>
          <td>Title</td>
          <td>
            <input type='text' v-model='newStep' :class="{ 'step-err' : stepErr }" />
          </td>
        </tr>
      </table>
    </b-modal>

  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import FeedMessage from "./FeedMessage";
import GlobalFeedMessage from "./GlobalFeedMessage";
import { store } from "@/store/index.js";
import { api } from "@/api/index.js";
import axios from "axios";

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
      countNumber: 1,
      fInterval: null,
      feed: "",
      uploadProgress: 50,
      inProgress: false,
      searchText: "",
      searchImportant: false,
      dataFromBegining: 1,
      numOfMessages: null,
      loadingData: false,
      test: true,
      steps: [],
      newStep: "",
      stepErr: false,
      haveNewMessage: false,
      firstLoad: true,
      searchType: "messages",
      radioFilter: [
        {
          text: "Messages",
          value: "messages"
        },
        {
          text: "Statuses",
          value: "statuses"
        },
        {
          text: "Files",
          value: "files"
        },
        {
          text: "All",
          value: "all"
        }
      ],
      timestamps: []
    };
  },
  computed: {
    ...mapState({
      // messages: state => state.modulefeed.messages,
      darkTheme: state => state.darkTheme,
      // searchFeedsParams: state => state.modulefeed.searchFeedsParams,
      selectedStep: state => state.modulefeed.selectedStep,
      pro_id: state => state.sidebarItemSelection[0]
    }),
    ...mapGetters({
      taskid: "selectedItemID"
    }),
    searchOn() {
      if (this.searchType !== "all") return true;
      if (this.searchImportant) return true;
      if (this.searchText !== null && this.searchText.length > 0) return true;
      return false;
    },
    messages() {
      return this.$store.state.modulefeed.messages.map(el => {
        return {
          fed_important: el.fed_important,
          fed_islabel: el.fed_islabel,
          taskID: el.taskID,
          fed_id: el.fed_id,
          unseen: el.unseen,
          usr_name: el.usr_name,
          usr_surname: el.usr_surname,
          fed_text: el.fed_text,
          fed_time: this.utcToLocalSeconds(el.fed_time),
          fed_type: el.fed_type,
          pro_id: el.pro_id,
          pro_name: el.pro_name,
          tsk_id: el.tsk_id,
          tsk_title: el.tsk_title,
          usrimg: el.usrimg,
        };
      });
    }
  },
  watch: {
    searchType() {
      this.dataFromBegining = 1;
      this.haveNewMessage = false;
      this.readeFeeds();
    },
    searchImportant() {
      this.readeFeeds();
    },
    newStep(newVal, old) {
      if (this.stepErr && newVal.length > 0) this.stepErr = false;
    },
    searchText(newVal, oldVal){
      // console.log(newVal);
      if( oldVal.length>0 && newVal.length==0 )
        this.readeFeeds();
    },
  },
  methods: {
    dragAndDrop() {
      if(this.global === false){

      var self = this;

      // ************************ Drag and drop ***************** //
      let dropArea = document.getElementById("drop-area");

      // Prevent default drag behaviors
      ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
      });

      // Highlight drop area when item is dragged over it
      ["dragenter", "dragover"].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
      });
      ["dragleave", "drop"].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
      });

      // Handle dropped files
      dropArea.addEventListener("drop", handleDrop, false);

      function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
      }

      function highlight(e) {
        dropArea.classList.add("highlight");
        document.getElementById("text").classList.add("displayBlock");
        document.getElementById("text").classList.remove("displayNone");
      }

      function unhighlight(e) {
        dropArea.classList.remove("highlight");
        document.getElementById("text").classList.remove("displayBlock");
        document.getElementById("text").classList.add("displayNone");
      }

      function handleDrop(e) {
        var dt = e.dataTransfer;
        var files = dt.files;

        handleFiles(files);
      }

      // let uploadProgress = []
      // let progressBar = document.getElementById('progress-bar')

      // function initializeProgress(numFiles) {
      //   progressBar.value = 0
      //   uploadProgress = []
      //
      //   for (let i = numFiles; i > 0; i--) {
      //     uploadProgress.push(0)
      //   }
      // }

      // function updateProgress(fileNumber, percent) {
      //   uploadProgress[fileNumber] = percent
      //   let total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length
      //   console.debug('update', fileNumber, percent, total)
      //   progressBar.value = total
      // }

      function handleFiles(files) {
        files = [...files];
        // initializeProgress(files.length)
        files.forEach(uploadFile);
        // files.forEach(previewFile)
      }

      // function previewFile(file) {
      //   let reader = new FileReader()
      //   reader.readAsDataURL(file)
      //   reader.onloadend = function() {
      //     let img = document.createElement('img')
      //     img.src = reader.result
      //     document.getElementById('gallery').appendChild(img)
      //   }
      // }

      function uploadFile(file, i) {
        // var task = store.state.sidebarItemSelection[1];
        // var url =
        //   "http://695u121.mars-t.mars-hosting.com/mngapi/tasks/" +
        //   task +
        //   "/feeds";
        var formData = new FormData();

        formData.append("file", file);
        formData.append("sid", localStorage.sid);
        formData.append("type", "file");

/*
        axios
          .post(url, formData, {
            headers: {
              "X-Requested-With": "XMLHttpRequest"
            }
          })
*/

          api.dragAndDropUpload(store.state.sidebarItemSelection[1], formData).then(response => {
            if (response.data.status === "OK") {
              store.commit("modalStatus", {
                ok: true,
                message: "Successfully sent attachment."
              });
              self.readeFeeds();
            } else {
              store.commit("modalStatus", {
                ok: false,
                message: "Something went wrong. Try again."
              });
            }
          });
      }
      }
    },
    changeSelectedTask() {
      store.commit("clearFeed");
      this.refreshSearchParams();
      this.dataFromBegining = 1;
      this.haveNewMessage = false;
      this.readeTimestemps();
      this.readeFeeds();
    },
    clearStepCreateContent() {
      this.newStep = "";
      this.stepErr = false;
    },
    createNewStep(evt) {
      evt.preventDefault();
      if (this.newStep.length == 0) {
        this.stepErr = true;
        return;
      }
      var time = this.selectedStep.fed_time;
      time = this.$moment(time).subtract(-1, "secounds");
      time.seconds(time.seconds() - 1);
      time = this.localToUTC(time);
      api
        .createTimestamps(this.taskid, time, this.newStep)
        .then(result => {
          // this.readeSteps();
          this.readeTimestemps();
          this.reload();
          store.commit("setSelectedStep", null);
        })
        .catch(() => {
          this.reload();
        });
      this.$refs.stepModal.hide();
    },
    stepCicked(step) {
      var time = step.fed_time;
      time = this.$moment(time);
      this.jumpToStepFeed(this.taskid, time.format("YYYY-MM-DD HH:mm:ss"));
    },
    textInputBlur() {
      if (this.searchText == null || this.searchText.length == 0) return;
      this.readeFeeds();
    },
    reload() {
      store.commit("clearFeed");
      this.refreshSearchParams();
      this.dataFromBegining = 1;
      this.haveNewMessage = false;
      this.readeFeeds();
    },
    refreshSearchParams() {
      this.searchType = "messages";
      this.searchText = "";
      this.searchImportant = false;
    },
    processKeyUp(event) {
      if (event.key == "Enter" && event.ctrlKey) {
        this.writeMessageFeed();
      }
    },
    readeTimestemps() {
      this.timestamps = [];
      api.readeTimestemps(this.taskid).then(result => {
        if (result.data.status != "OK") {
          alert("Eror happen while trying to get timestemps");
          return;
        }
        if (result.data.data !== undefined && result.data.data.length > 0) {
          this.timestamps = result.data.data;
          for (let i = 0; i < this.timestamps.length; i++) {
            this.timestamps[i].fed_time = this.utcToLocalSeconds(
              this.timestamps[i].fed_time
            );
          }
          this.deselectTimestemps();
        }
      });
    },
    readeFeeds() {
      // console.log('reade feeds');
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
          setTimeout( ()=>{
            this.scrollToBegining();
          }, 250 ) ;
          this.numOfMessages = this.messages.length;
          this.loadingData = false;
          if (this.firstLoad) {
            this.firstLoad = false;
            store.dispatch("getFeedCount");
          }
          // this.processStepSelection();
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
      api.postMessage(this.taskid, text).then(result => {
        if (result.data.status != "OK") {
          alert("Problem during sending the message");
          return;
        }
        if(this.searchType=='statuses'){
          this.searchType = 'messages';
          return;
        }
        if (this.messages.length > 0) this.addDown(true);
        else this.readeFeeds();
      });
      this.feed = "";
    },
    uploadFile() {
      if (this.taskid == -1) return -1;
      document.getElementById("file").click();
    },
    changeFile(e) {
      var f = e.target.files[0];
      api.sendAttach(this.taskid, f).then(r => {
        this.addDown(true);
      });
    },
    addUp() {
      if (this.loadingData) return;
      if (this.taskid === -1) return;
      if (this.messages == null || this.messages.length == 0) return;

      // Dodato zbog hedera za stepove
      var message = this.messages[0];

      this.loadingData = true;
      store
        .dispatch("readeFeeds", {
          taskid: this.taskid,
          fedid: message.fed_id,
          direction: "up",
          type: this.searchType,
          searchingstring: this.searchText,
          fed_important: this.searchImportant,
          fedtime: this.localToUTC(message.fed_time)
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
      // console.log('new messages');
      if (this.loadingData) return;
      api
        .checkNewwMessages(this.taskid)
        .then(result => {
          this.loadingData = false;
          if (result.data.status != "OK") {
            return;
          }
          if (result.data.data > 0) {
            this.countNumber = 1;
            this.count = 0;
            if(this.messages.length==0){
              this.readeFeeds();
              return;
            }
            var e = document.getElementById("all-messages");
            if (
              parseInt(e.offsetHeight) + parseInt(e.scrollTop) ==
              parseInt(e.scrollHeight)
            ) {
              this.addDown(true);
            } else {
              this.haveNewMessage = true;
            }
          }
        })
        .catch(err => {
          this.loadingData = false;
        });
    },
    addDown(scrollDown) {
      console.log('add down');
      if (this.loadingData) return;
      var message = this.messages[this.messages.length - 1];
      if (message === undefined || message === null) return;
      api
        .readeFeeds(
          this.taskid,
          message.fed_id,
          "down",
          undefined,
          undefined,
          undefined,
          this.localToUTC(message.fed_time)
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
            if (scrollDown === true) {
              setTimeout(() => {
                this.scrollToBegining();
              }, 50);
            }
          }
        })
        .catch(err => {
          this.loadingData = false;
        });
    },
    handleScroll(e) {
      if (!this.global) this.processStepSelection();
      if (
        parseInt(e.target.offsetHeight) +
          parseInt(e.target.scrollTop) ==
        parseInt(e.target.scrollHeight)
      ) {
        console.log("it's down now");
        this.addDown();
        return;
      }
      if (e.target.scrollTop === 0) {
        // console.log("it's on the top");
        this.addUp();
      }
    },
    processStepSelection() {
      if (this.timestamps == null || this.timestamps.length === 0) return;
      var messages = document.querySelectorAll(".selector");
      if (messages === undefined || messages === null || messages.length === 0)
        return;
      for (var i in messages) {
        var message = messages[i];
        if (this.isInViewport(message)) {
          // console.log(message);
          this.selectTimestemp(this.messages[i].fed_time);
          return;
        }
      }
    },
    selectTimestemp(time) {
      this.deselectTimestemps();
      time = this.$moment(time);
      var length = this.timestamps.length;
      for (var i = 0; i < length; i++) {
        var timestempTime = this.$moment(this.timestamps[i].fed_time);
        if (
          time >= timestempTime &&
          (i + 1 >= length ||
            time <= this.$moment(this.timestamps[i + 1].fed_time))
        ) {
          // taj step treba da se selektuje
          this.timestamps[i].selected = true;
          var timestamps = this.timestamps;
          this.timestamps = [];
          this.timestamps = timestamps;
          return;
        }
      }
    },
    deselectTimestemps() {
      for (var i in this.timestamps) {
        this.timestamps[i].selected = false;
      }
    },
    scrollTOTop() {
      // console.log('scroll to top');
      var a = document.querySelectorAll(".selector");
      if (a === undefined || a === null || a.length == 0) return;
      a = a[0];
      if (a !== undefined) a.scrollIntoView(true);
    },
    scrollToBegining() {
      // console.log('scrollTOBegining');
      var a = document.querySelectorAll(".selector");
      if (a === undefined || a === null || a.length == 0) return;
      if (a.length == 0) a = a[0];
      else {
        a = a[a.length - 1];
      }
      // console.log(a);
      if (a !== undefined) a.scrollIntoView(false);
    },
    scrollAfterUp(responseLength) {
      // console.log('scroll after up');
      var a = document.querySelectorAll(".selector");
      a = a[responseLength];
      a.scrollIntoView(true);
    },
    jumpToStepFeed(tsk_id, stp_time_created) {
      api
        .searchStepFeeds(tsk_id, stp_time_created, this.searchType)
        .then(result => {
          if (result.data.status != "OK") {
            alert("Failed to load data");
            return;
          }
          store.commit("addMessages", {
            direction: "start",
            data: result.data.data
          });
          this.scrollTOTop();
        });
    },
    isInViewport(el) {
      if (el == null) return;

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
    this.dragAndDrop();

    if (!this.global) {
      this.readeTimestemps();
    }
    this.readeFeeds();

    //poziva api svaki put kada je count deljiv sa countNumber
    if (this.global) return;
    this.fInterval = setInterval(() => {
      if (
        this.count % this.countNumber == 0 &&
        this.taskid != -1
        // && !this.searchOn
      ) {
        // if (this.messages.length > 0) {
        //   this.newMessages();
        // }
        this.newMessages();
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
    // store.commit("setSearchFeedParams", null);
    this.dataFromBegining = 1;
  }
};
</script>
<style scoped>
.step-err {
  border: 2px solid red;
}

.search-inputs {
  margin: 10px auto 0;
}

.message-notificaton {
  cursor: pointer;
  position: fixed;
  right: 30px;
  bottom: 50px;
}

.notification-on {
  display: block;
}

.search-inputs {
  margin: 10px 0 0;
  text-align: center;
}

.search-inputs * {
  padding: 5px;
}

.form-search {
  transform: scale(0.9);
}

.search-inputs input[type="text"] {
  max-width: 400px;
  width: 100%;
  border-radius: 5px;
}

.darkTheme .search {
  background-color: #232323 !important;
  border: 1px solid #d2d2d236;
  color: #eee;
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
  cursor: pointer;
  padding: 7px 15px;
}

.list-group-item:last-child {
  border: none;
}

.list-group-item:hover {
  background: #7777775c;
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
  background-color: var(--main-bg-color);
  color: var(--main-color);
}

.feed.darkTheme {
  background-color: var(--sec-bg-color);
  color: var(--sec-color);
}

.modal-body,
.modal-footer {
  background: #f4f4f4;
}

.modal-table {
  color: var(--main-color);
}

.modal-table input {
  border: none;
  border-bottom: 1px solid #7777;
  background: white !important;
  color: var(--main-color) !important;
  padding: 4px 10px;
}

.flex-chat-body {
  display: flex;
  margin-bottom: 10px;
  height: 0;
  flex: 1;
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
  width: 100%;
}

.feed-back .load {
  margin: auto;
  display: block;
  line-height: 0.5;
}

.input {
  bottom: 0px;
  display: flex;
  margin-bottom: 10px;
  position: relative;
}

.input textarea {
  color: black;
  padding: 5px 65px 5px;
  flex: 1;
  background-color: #fff;
  border-color: #8a888866;
  font-size: 16px;
  resize: none;
  border-radius: 5px;
  box-shadow: inset 0 1px 10px 0 #00000026;
  height: 60px;
  transition: height 0.2s;
  transition-timing-function: ease;
}

.input textarea:focus {
  height: 20vh;
}

.input .input button {
  position: relative;
  border-radius: 5px;
  width: 42px;
  height: 42px;
}

.input button:first-child {
  position: absolute;
  bottom: 10px;
  left: 15px;
  background: var(--ac-color);
  color: white;
}

.input button:last-child {
  position: absolute;
  bottom: 10px;
  right: 20px;
}

.input button:first-child:hover {
  box-shadow: 0 0 20px 1px rgba(19, 138, 255, 0.2);
}

.input button:last-child:hover {
  box-shadow: 0 0 20px 1px rgba(19, 255, 45, 0.2);
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
  flex: 1;
}

.modal-table td:first-child {
  color: #adadad;
}

.modal-table td {
  padding: 0 20px 10px 0;
}

.radio-group {
  display: inline;
}

/* Za drag&drop */

#drop-area.highlight {
  filter: brightness(20%);
  -moz-transition: all 1s;
  -webkit-transition: all 1s;
  transition: all 1s;
}

#fileElem {
  display: none;
}

#text {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 50px;
  color: red;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
}

.displayBlock {
  display: block;
}

.displayNone {
  display: none;
}
</style>
