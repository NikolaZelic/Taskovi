<template>
  <div class="contant">
    <div class="head">
      <a href="#" class="email">Prime@Primet.com</a>
    </div>
    <div class="tail">
      <div class="left-side">
        <img src="static\user.png" class="picture">
        </img>
        <a href="#" class="change-pic">Change Picture</a>

      </div>
      <div class="right-side">

      </div>
    </div>
  </div>

</template>


<script>
  import {store} from "@/store/index.js"

  export default{

  }

</script>



<style scoped>
  .contant{

    display: flex;
    flex-flow: column;
  }
  .head{
    margin: 10px;
    flex-basis: 100px;
  }
  .head .email{
    text-decoration: none;
    font-size: 20px;

  }

  .tail{
    margin: 10px;
    flex: 1;
    border: 1px solid #777;
    display: flex;
  }

  .tail .left-side{
    flex: 1;
    border: 1px solid #777;
    margin: 10px;
    display:flex;
    flex-flow: column;

  }
  .tail .right-side{
    flex: 3;
    border: 1px solid #777;
    margin: 10px;
  }

  .tail .left-side .picture{
    width:100%;
  }
  .tail .left-side .change-pic{
    background-color: #42cbf4;
    color:black;

    text-decoration: none;
    font-size: 16px;
    text-align: center;
    padding: 10px;
  }


</style>
