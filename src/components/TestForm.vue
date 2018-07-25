<template>
<div class="container py-5">

  <vue-form :state="formstate" @submit.prevent="onSubmit">

    <validate auto-label class="form-group required-field" :class="fieldClassName(formstate.email)">
      <label>Email</label>
      <input type="email" name="email" class="form-control" required v-model.lazy="model.email">

      <field-messages auto-label name="email" show="$touched || $submitted" class="form-control-feedback">
        <div>Success!</div>
        <div slot="required">Email is a required field</div>
        <div slot="email">Email is invalid</div>
      </field-messages>

    </validate>

    <div class="py-2">
      <button class="btn btn-primary" type="submit">Submit</button>
    </div>
  </vue-form>

</div>
</template>

<script>
import {
  api
} from "@/api/index.js";
import {
  store
} from "@/store/index.js";
import VueForm from "vue-form";
export default {
  mixins: [new VueForm({
    inputClasses: {
      dirty: 'vf-dirty',
      pristine: 'vf-pristine',
      valid: 'is-valid',
      invalid: 'is-invalid',
      touched: 'vf-touched',
      untouched: 'vf-untouched',
      focused: 'vf-focused',
      submitted: 'vf-submitted',
      pending: 'vf-pending'
    }
  })],
  data() {
    return {
      formstate: {},
      model: {
        name: '',
        email: '',
        phone: '',
        department: null,
        comments: '',
        notValidated: '',
        agree: false
      },
      loginVisible: true,
      presets: [{
          email: "nzelic@ymail.com",
          pass: "123"
        },
        {
          email: "danilopusic@ymail.com",
          pass: "123"
        },
        {
          email: "dime@gmail.com",
          pass: "123"
        },
        {
          email: "zex@gmail.com",
          pass: "123"
        },
        // {
        //   email: "svetaprogramer@gmail.com",
        //   pass: "praksa1234"
        // },
        {
          email: "paun992@hotmail.com",
          pass: "pass123"
        }
      ],
      formstate: {},
      user: {}
    };
  },
  methods: {
    fieldClassName: function(field) {
      if (!field) {
        return '';
      }
      if ((field.$touched || field.$submitted) && field.$valid) {
        return 'has-success';
      }
      if ((field.$touched || field.$submitted) && field.$invalid) {
        return 'has-danger';
      }
    },
    onSubmit: function() {
      console.log(this.formstate.$valid);
    },

    autologin(p) {
      // REMOVE IN FINAL
      this.user = p;
      this.login();
    },
    login() {
      let mail = this.user.email;
      let pass = this.user.pass;
      if (mail === undefined || mail.length < 4) {
        alert("Email is not valid");
        //document.getElementById("email").style.color = "red";
        //this.user.email = "Email is not valid";
        return;
      }
      if (pass === undefined || pass.length < 2) {
        //document.getElementById("pass").style.color = "red";
        //this.user.pass = "Password cannot be less then two characters";
        alert("Password cannot be less then two characters");
        return;
      }
      api
        .login(mail, pass)
        .then(r => {
          if (r.data.login !== "failed") {
            let sid = r.data.sid;
            if (sid !== undefined || sid !== null) {
              console.log("aad");
              store.commit("localStorage", {
                name: r.data.user.name,
                surname: r.data.user.surname,
                email: r.data.user.email,
                sid: sid
              });
              this.$router.push("/");
            }
          } else {
            //document.getElementById("email").style.color = "red";
            //this.user.email = "Login failed. Please check your username or password.";
            alert("Login failed. Please check your username or password.");
          }
        })
        .catch(e => {
          store.commit("modalError", {
            message: "" + e
          });
        });
    },
    register() {
      let valid = this.formstate.$valid;
      if (valid) {
        api
          .register(this.user)
          .then(r => {
            if (r.data.registration === "Success") {
              this.loginVisible = true;
            }
          })
          .catch(e => {
            store.commit("modalError", {
              message: "" + e
            });
          });
      }
    },
    onSubmit() {
      // if (this.formstate.$invalid) {
      //   alert("invalid");
      //   // alert user and exit early
      //   return;
      // }
      // alert("submit");
      // // otherwise submit form
    }
  },
  computed: {
    passNotSame() {
      var undef =
        this.user.password === undefined || this.user.confirmpass === undefined;
      if (undef) return -1;
      var empty =
        this.user.password.length === 0 || this.user.confirmpass.length === 0;
      if (empty) return -1;
      return this.user.password !== this.user.confirmpass;
    },
    registerDisabled() {
      return this.passNotSame;
    }
  },
  beforeCreate() {
    // IF SID EXIST AND SEASON ACTIVE EXIST ROUTE TO MAINPAGE
    let sid = localStorage.sid;
    if (sid !== undefined && sid !== null) {
      api.sessionActive();
    }
  }
};
</script>

<style scoped>
.required-field>label::after {
  content: '*';
  color: red;
  margin-left: 0.25rem;
}

.vf-untouched{
  border: 1px solid #ced4da;
}
</style>
