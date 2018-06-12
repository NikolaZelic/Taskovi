<template>
<div class="all">
  <div class="head">
    <a href="#" class="name"><i class="fas fa-user"></i>{{fullname}}</a>
  </div>
  <div class="tail">
    <div class="left-side">
      <img src="static\user.png" class="picture">
      </img>
      <a href="#" class="change-pic">Change Picture</a>

    </div>
    <div class="right-side">
      <tabs>
        <tab name="Personal">
          <table>
            <tr><td>Name:</td><td><input type="text" :value="name" :disabled="editable"/></td></tr>
            <tr><td>Surname:</td><td><input type="text" :value="surname" :disabled="editable"/></td></tr>
            <tr><td>Age:</td><td><input type="text" value="999" :disabled="editable"/></td></tr>
            <tr><td>Phone number:</td><td><input type="text" value="06399999" :disabled="editable"/></td></tr>
            <tr class="edit"><td colspan="2"><button v-on:click="edit">{{editable?"Edit":"Save"}}</button></td></tr>
          </table>
          </tab>
          <tab name="Description">
            <textarea></textarea>
          </tab>
          <tab name="Responsibility">

          </tab>
          <tab name="Company">

          </tab>

      </tabs>
    </div>
  </div>
</div>
</template>


<script>
import { Tab ,Tabs } from "vue-tabs-component";
import {
  store
} from "@/store/index.js"

export default {
    components:{
      Tab,
      Tabs
    },
    data(){
      return {
        editable : true
      }
    },
    computed:{
      name(){
        return localStorage.name
      },
      surname(){
        return localStorage.surname
      },
      fullname(){
        return " "+this.name+ " "+ this.surname;
      }
    },
    methods:{
      edit(){
        if(this.editable){
          this.editable= false;
        }else{
          this.editable= true;
        }

      }
    }



}
</script>


<style scoped>
.all {

  display: flex;
  flex-flow: column;
}

.head {
  margin: 10px;
  flex-basis: 100px;
}

.head .name {
  text-decoration: none;
  font-size: 30px;

}

.tail {
  background: #f4f4f4;
  margin: 10px;
  flex: 1;
  border: 1px solid #777;
  border-radius: 2px;
  display: flex;
}

.tail .left-side {
  flex: 1;
  border: 1px solid #777;
  margin: 10px;
  display: flex;
  flex-flow: column;
  border-radius: 2px;
}

.tail .right-side {
  border-radius: 2px;
  background-color: white;
  flex: 3;
  border: 1px solid #777;
  margin: 10px;
  display: flex;
  flex-flow: column;
}
.tail .right-side table{
  border-radius: 2px;
  display: block;
  margin: 40px;
  font-size: 20px;



}
.tail .right-side tr, td{
  margin: 20px;
  border-collapse:collapse;
  border: 1px solid #aaa;

}
.tail .right-side table input{
  width: 100%;
  height: 100%;
  padding: 15px;

}
table .edit{
  text-align: right;
}
.tail .right-side tr td:first-child{
  padding:15px;
}
.tail .left-side .picture {
  width: 100%;
}

.tail .left-side .change-pic {
  background-color: #42cbf4;
  color: black;

  text-decoration: none;
  font-size: 16px;
  text-align: center;
  padding: 10px;
}

</style>
