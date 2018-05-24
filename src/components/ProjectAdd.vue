<template>
<div>
  <div class="row task-add-section">
    <div class="col-md-8 offset-md-2 pad">

      <h1 class="display-4">Adding project:</h1><br>

      <form>
        <div class="form-group">
          <label for="tsk_title">Project title</label>
          <input type="text" class="form-control" id="pro_title" placeholder="Enter the name of the project you're creating">
        </div>

        <label for="pro_leader">Project leader</label>
        <div class="form-group input-group">
          <input type="text" class="form-control" id="pro_leader" placeholder="Search for user who will be this project leader">
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button">Search</button>
          </div>
        </div>

        <div class="form-group">
          <button type="submit" class="btn btn-success">Add project</button>
        </div>



      </form>



    </div>
  </div>
</div>
</template>

<script>
// import axios from 'axios'

export default {
  data() {
    return {
      working: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.task-add-section {
  padding-top: 50px;
}
</style>
