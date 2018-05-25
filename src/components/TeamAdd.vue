<template>
<div>
  <!-- <div class="row task-add-section"> -->
    <!-- <div class="col-md-8 offset-md-2 pad"> -->

      <h1 class="display-4">Create team:</h1><br>

      <form>
        <div class="form-group">
          <label for="team_name">Team name</label>
          <input type="text" class="form-control" id="team_name" placeholder="Enter the name of the team you're creating">
        </div>

        <label for="pro_leader">Members</label>
        <div class="form-group input-group">
          <input type="text" class="form-control" id="members" placeholder="Search for users which will be this a part of this team">
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button">Search</button>
          </div>
        </div>

        <div class="form-group">
          <ul class="list-group list-group-flush">
            <li class="list-group-item"><img class="rounded-circle"  width='40' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_0vsuZqoaKVIUsjkshzBaVCI3MnbjpWE6U89CcfnBDAThVPFrJA"> Nikola Tesla</li>
            <li class="list-group-item"><img class="rounded-circle"  width='40' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1X8vC7CuE73-54q6KhtS61VyGRd7_ZmKZK7Rxyl9PZ8U6rj_pPQ"> Milutin Milankovic</li>
            <li class="list-group-item"><img class="rounded-circle"  width='40' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7xe3UC_yHpG9nFYfasqFHBHDWBoyr3B4UM80d9VId52f9i7O2_Q"> Milan Obrenovic</li>
          </ul>
        </div>

        <div class="form-group">
          <button type="submit" class="btn btn-success">Create team</button>
        </div>

      </form>



    <!-- </div> -->
  <!-- </div> -->
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
