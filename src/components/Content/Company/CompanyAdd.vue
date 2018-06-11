<template>
<div>

  <h4>Adding company:</h4>

  <label for="companyname" class="mt-3">Company name</label>
  <!-- <input type="text" class="form-control mb-3" id="companyname" v-model="companyname" placeholder="Enter the name of the company you're creating"> -->


  <!-- <div class="form-group" :class="{ 'form-group--error': $v.companyname.$error }"> -->
    <input class="form-control" v-model.trim="$v.companyname.$model" placeholder="Enter the name of the company you're creating" id="companyname"/>
    <small class="form-text text-danger" v-if="!$v.companyname.minLength">Company name must have at least {{$v.companyname.$params.minLength.min}} characters.</small>
    <!-- <div class="error" v-if="!$v.companyname.required">Field is required</div> -->
    <small class="form-text text-danger" v-if="!$v.companyname.required">Field is required.</small>



  <!-- </div> -->



  <!-- <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small> -->



  <label for="companydesc" class="mt-3">Description</label>
  <textarea class="form-control mb-3" id="companydesc" rows="3" v-model='companydesc' placeholder="Tell us a little something about your company..." spellcheck="false"></textarea>

  <button @click="addCompany()" class="btn btn-success">Add company</button>


  <!-- <div> -->

    <!-- <div class="error" v-if="!name.required">Field is required</div> -->

  <!-- </div> -->



</div>
</template>

<script>
import axios from "axios";
import {
  required,
  minLength
} from 'vuelidate/lib/validators'

export default {

  data() {
    return {
      // name: '',
      companyname: undefined,
      companydesc: undefined
    };
  },

  validations: {
    companyname: {
      required,
      minLength: minLength(3)
    }
  },

  methods: {

    addCompany() {
      if (!this.$v.$invalid) {        
        axios.post('http://671n121.mars-t.mars-hosting.com/mngapi/companies', {
          companyname: this.companyname,
          companydesc: this.companydesc,
          sid: window.localStorage.getItem('sid')
        })
      }
    }

  }
}
</script>

<style scoped>
</style>
