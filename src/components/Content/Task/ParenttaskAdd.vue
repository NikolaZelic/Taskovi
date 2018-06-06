<template>
  <div>
      <h1 class="display-4">Creating Task</h1><br>

        <div class="form-group">
          <label for="tsk_title">Task title</label>
          <input type="text" class="form-control" id="tsk_title" placeholder="Title">
        </div>

        <div class="form-group">
          <label for="tsk_desc">Task description</label>
          <textarea class="form-control" id="tsk_desc" rows="3" placeholder="The better your description is it will be easier for your colleagues two know what this is about and to help them complete this task of yours"></textarea>
        </div>

        <div class="form-group">
          <label for="tsk_deadline">Deadline</label>
          <input type="datetime-local" class="form-control" id="tsk_deadline">
        </div>

        <div class="form-group">
          <button type="submit" class="btn btn-success">Add task</button>
        </div>
    </div>
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

<style scoped>
.task-add-section {
  padding-top: 50px;
}
</style>
