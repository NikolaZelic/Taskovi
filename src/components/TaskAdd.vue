s<template>
<div>
  <!-- <div class="row task-add-section">
    <div class="col-md-8 offset-md-2 pad"> -->

      <h1 class="display-4">Adding task:</h1><br>

      <form>
        <div class="form-group">
          <label for="tsk_title">Task title</label>
          <input type="text" class="form-control" id="tsk_title" placeholder="Enter the name of the task you're creating">
        </div>

        <div class="form-group">
          <label for="tsk_desc">Task description</label>
          <textarea class="form-control" id="tsk_desc" rows="3" placeholder="The better your description is it will be easier for your colleagues two know what this is about and to help them complete this task of yours"></textarea>
        </div>

        <span>Who will work on this project?</span>
        <div class="form-group">
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="working" id="user" value="user" v-model="working">
            <label class="form-check-label" for="user">Single user</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="working" id="team" value="team" v-model="working">
            <label class="form-check-label" for="team">Whole team</label>
          </div>
        </div>

        <div v-if="working === 'user'">
          <label for="tsk_title">User working</label>
          <div class="form-group input-group">
            <input type="text" class="form-control" id="usr_working" placeholder="Search for user who will work on this task">
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="button">Search</button>
            </div>
          </div>

          <span>Do you want to limit this user to only see his task?</span>
          <div class="form-group">
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="restriction" id="restriction_yes" value="1">
              <label class="form-check-label" for="restriction_yes">Yes</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="restriction" id="restriction_no" value="0">
              <label class="form-check-label" for="restriction_no">No</label>
            </div>
          </div>
        </div>

        <div v-if="working === 'team'">
          <label for="tsk_title">Team working</label>
          <div class="form-group input-group">
            <input type="text" class="form-control" id="usr_working" placeholder="Search for team which will work on this task">
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="button">Search</button>
            </div>
          </div>
        </div>


        <div class="form-group">
          <label for="tsk_deadline">Deadline</label>
          <input type="datetime-local" class="form-control" id="tsk_deadline">
        </div>

        <span>Is this task's completion urgent?</span>
        <div class="form-group">
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="urgent" id="urgent_yes" value="1">
            <label class="form-check-label" for="urgent_yes">Yes</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="urgent" id="urgent_no" value="0">
            <label class="form-check-label" for="urgent_no">No</label>
          </div>
        </div>

        <div class="form-group">
          <button type="submit" class="btn btn-success">Add task</button>
        </div>

        <!-- <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
        </div>

        <div class="form-group form-check">
          <input type="checkbox" class="form-check-input" id="exampleCheck1">
          <label class="form-check-label" for="exampleCheck1">Check me out</label>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button> -->

      </form>



    </div>
  <!-- </div>
</div> -->
</template>

<script>
// import axios from 'axios'

export default {
  data() {
    return {
      working: ""
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.task-add-section {
  padding-top: 50px;
}
</style>
