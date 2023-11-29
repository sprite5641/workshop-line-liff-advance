<template>
  <form @submit.prevent="submitForm" class="container mt-4">
    <div class="mb-3">
      <label for="name" class="form-label">Name:</label>
      <input
        type="text"
        id="name"
        v-model.trim="form.name"
        class="form-control"
        @input="validateName"
      />
      <div v-if="nameError" class="error">
        {{ nameError }}
      </div>
    </div>

    <div class="mb-3">
      <label for="gender" class="form-label">Gender:</label>
      <select
        id="gender"
        v-model="form.gender"
        class="form-control"
        @change="validateGender"
      >
        <option value="" disabled>Select gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <div v-if="genderError" class="error">
        {{ genderError }}
      </div>
    </div>

    <button
      type="submit"
      class="btn btn-primary"
      :disabled="!form.name || !form.gender || submitting"
    >
      Register
    </button>
  </form>
</template>

<script>
import liff from "@line/liff";
import axios from "axios";
import router from "../router";
export default {
  data() {
    return {
      menu: [],
      form: {
        name: "",
        gender: "",
      },
      nameError: "",
      genderError: "",
      submitting: false,
      uid: "",
    };
  },

  beforeCreate() {
    liff.init({ liffId: import.meta.env.VITE_LIFF_ID }, function (data) {});
  },
  async mounted() {
    await this.checkLiffLogin();
  },
  methods: {
    validateName() {
      if (!this.form.name) {
        this.nameError = "Name is required!";
      } else {
        this.nameError = "";
      }
    },
    validateGender() {
      if (!this.form.gender) {
        this.genderError = "Gender is required!";
      } else {
        this.genderError = "";
      }
    },
    async checkLiffLogin() {
      await liff.ready.then(async () => {
        if (!liff.isLoggedIn()) {
          liff.login({ redirectUri: window.location });
        }
      });
    },
    async submitForm() {
      this.validateName();
      this.validateGender();

      this.submitting = true;
      const idToken = liff.getIDToken();

      axios({
        method: "post",
        url: "https://0f08-202-183-226-2.ngrok-free.app/myprojects-347817/asia-northeast1/workshop-register",
        headers: {
          Authorization: idToken,
          "Content-Type": "application/json",
        },
        data: {
          name: this.form.name,
          gender: this.form.gender,
          email: idToken.email,
          picture: idToken.picture,
        },
      })
        .then((response) => {
          router.push("/");
          this.submitting = false;
        })
        .catch((error) => {
          console.log(error);
          this.submitting = false;
        });
    },
  },
};
</script>

<style>
.error {
  color: red;
}
</style>
