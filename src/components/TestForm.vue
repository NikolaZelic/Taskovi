<template>
  <b-form @submit="onSubmit" class="container mt-5">
    <b-form-group id="exampleInputGroup1"
                  label="Name"
                  label-for="exampleInput1">
      <b-form-input id="exampleInput1"
                    type="text"
                    v-model="form.name"
                    :state="!$v.form.name.$invalid"
                    aria-describedby="input1LiveFeedback"
                    placeholder="Enter name" />
      <b-form-invalid-feedback id="input1LiveFeedback">
        This is a required field and must be at least 3 characters
      </b-form-invalid-feedback>
    </b-form-group>
    <b-form-group id="exampleInputGroup2"
                  label="Food"
                  label-for="exampleInput2">
      <b-form-select id="exampleInput2"
                     :options="foods"
                     :state="!$v.form.food.$invalid"
                     v-model="form.food" />
      <b-form-invalid-feedback id="input2LiveFeedback">
        This is a required field
      </b-form-invalid-feedback>
    </b-form-group>
    <b-button type="submit"
              variant="primary"
              :disabled="$v.form.$invalid">
      Submit
    </b-button>
  </b-form>
</template>

<script>
  import { validationMixin } from "vuelidate"
  import { required, minLength } from "vuelidate/lib/validators"

  export default {
    name: "myForm",
    data() {
      return {
        foods: [
          "apple",
          "orange"
        ],
        form: {}
      }
    },
    mixins: [
      validationMixin
    ],
    validations: {
      form: {
        food: {
          required
        },
        name: {
          required,
          minLength: minLength(3)
        }
      }
    },
    methods: {
      onSubmit() {
        // form submit logic
      }
    }
  }
</script>

<!-- form-validation-1.vue -->
