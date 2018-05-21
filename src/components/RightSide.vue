<template>
<div class="right">

  <div id="all" v-on:scroll="handleScroll()" class="feed-back">
    <button class="load" v-on:click="addUp">Loading new feeds...</button>
    <message v-for="(mess,i) in messages" :key="i" v-on:messCreate="scrollDown" :mess="mess"></message>
  </div>
  <div class="input">
    <textarea v-model="feed" placeholder="Text..." @keyup.13="writeMessageFeed"></textarea>


    <div class="submit">
      <button class="send" v-on:click="writeMessageFeed">Send</button>
      <button class="attac" @click="uploadFile">&#x1f4ce;</button>
      <input type="file" id="file" v-on:change="changeFile" style="display:none;"></input>
    </div>
  </div>

</div>
</template>
<script>
import axios from 'axios';
import Message from './Message';
export default {
  components: {
    'message': Message,

  },
  data: function() {
    return {
      messages: [],
      feed: "",//ovo je tekst koji jos nije poslat
      task_id: 1,
      my_fed_id: -1,//napravio sam ga privremeno, kasnije cu ga vuci sa servera
    }
  },
  methods: {
    scrollDown: function() {
      var mess = this.messages;
      document.getElementById("all").scrollTop = document.getElementById("all").scrollHeight;
    },
    writeMessageFeed: function() {
      if (this.feed.trim() === "") {
        this.feed = "";
        return;
      }
      var t = new Date();
      var date = t.getHours() + ":" + t.getMinutes() + "-" + t.getDay() + "-" + t.getMonth() + "-" + t.getFullYear();
      var text = this.feed;
      this.messages.push({//treba srediti kao kod attachmenta
        fed_text: text,
        fed_time: date,
        fed_id: this.my_fed_id,
        right: true
      });
      this.my_fed_id--;
      this.feed = "";
    },
    writeFileFeed(file){
      var t = new Date();
      var date = t.getHours() + ":" + t.getMinutes() + "-" + t.getDay() + "-" + t.getMonth() + "-" + t.getFullYear();
      var attach = {
        fed_type : 'attachment',
        fed_time: 'date'
      };
      attach.fed_id= this.my_fed_id;
      attach.right = true;
      attach.my = file;
      this.messages.push(attach);
      this.my_fed_id--;


    },
    uploadFile() {
      document.getElementById("file").click();
    },
    changeFile(e){
      this.writeFileFeed(e.target.files[0]);
    },
    addUp: function() {

      var d = this.messages[0].fed_time;
      var apiUrl = "http://671n121.mars-t.mars-hosting.com/mngapi/tasks/" + this.task_id + "/feeds"
      axios.get(apiUrl, {
          params: {
            fedid: this.messages[0].fed_id,
            pravac: "up"
          }
        })
        .then(res => {
          console.log(res.data.data);
          this.messages = res.data.data.concat(this.messages);
          document.getElementById("all").scrollTop = 22;

        })
        .catch();
    },
    handleScroll() {
      if (!document.getElementById("all").scrollTop) {

        this.addUp();

      }
    }
  },
  mounted: function() {
    var apiUrl = "http://671n121.mars-t.mars-hosting.com/mngapi/tasks/" + this.task_id + "/feeds";
    axios.get(apiUrl,{
      params: {
        fedid: 0,
        pravac: "start"
      }
    }).then((res) => {
      // console.log(res.data.data);
      this.messages = res.data.data;

    });
  }

}
</script>
<style scoped>
.right {
  border-radius: 4px;
  border: 2px solid #ccc;
  height: 100vh;
  width:500px;


  display: flex;
  flex-flow: column;
  justify-content: flex-start;

}

.feed-back {
  overflow-y: auto;
  word-wrap: break-word;
  max-height: 89vh;
}

.feed-back .load {
  margin: auto;
  display: block;
  border-radius: 8px;
}

.input {
  bottom: 0px;
  display: flex;
}

.input textarea {
  margin: 10px 5px;
  padding: 5px;
  flex: 1 0 200px;
  border: 2px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  font-size: 16px;
  resize: none;
}


.submit {
  display: flex;
  flex-flow: column;
}

.submit * {

  padding: 3px;
  margin: 10px 5px;
  border-radius: 4px;
  border: 2px solid #ccc;
  background-color: #f8f8f8;

}

.submit .send {
  flex: 0 0 40px;
  margin-bottom: 5px;
}

.submit .attac {
  margin-top: 5px;
}




.input button:hover {
  background-color: #c8c8c8;
}

.input button:active {
  background: linear-gradient(#f8f8f8, #c8c8c8 40%, #f8f8f8 90%)
}

</style>
