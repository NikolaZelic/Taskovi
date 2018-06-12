<template>
<div>

  <h4>Adding company:</h4>

  <label for="companyname" class="mt-3">Company name</label>
  <input class="form-control" v-model.trim="$v.companyname.$model" placeholder="Enter the name of the company you're creating" id="companyname" />
  <small class="form-text text-danger" v-if="!$v.companyname.minLength">Company name must have at least {{$v.companyname.$params.minLength.min}} characters.</small>
  <small class="form-text text-danger" v-if="!$v.companyname.required">Field is required.</small>

  <label for="companydesc" class="mt-3">Description</label>
  <textarea class="form-control mb-3" id="companydesc" rows="3" v-model='companydesc' placeholder="Tell us a little something about your company..." spellcheck="false"></textarea>

  <button @click="addCompany()" class="btn btn-success">Add company</button>

</div>
</template>

<script>
import {api} from "@/api/index";
import {required,minLength} from 'vuelidate/lib/validators'

export default {

  data() {
    return {
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
        api.addCompany(this.companyname, this.companydesc, window.localStorage.getItem('sid'));
      }
    }
  }
}
</script>
