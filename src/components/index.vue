<template>
  <div
    class="container mt-4 d-flex justify-content-center align-items-center vh-100"
  >
    <div v-if="!loading" class="text-left">
      <!-- For centering inner content -->
      <section id="profile md-3">
        <img
          id="pictureUrl"
          :src="img"
          class="mb-2 text-center"
          style="
            max-width: 100%;
            max-height: 50px;
            border-radius: 50%;
            margin: 0 auto;
          "
        />
        <!-- added max-width to ensure the image doesn't overflow the container -->
        <p id="name">ชื่อ: {{ name }}</p>
        <p id="email">email: {{ email }}</p>
        <p id="gender">เพศ: {{ gender }}</p>
      </section>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import liff from "@line/liff";
import router from "../router";
export default {
  data() {
    return {
      loading: false,
      name: "",
      email: "",
      gender: "",
      like: "",
      img: "",
    };
  },
  beforeCreate() {
    liff.init({ liffId: import.meta.env.VITE_LIFF_ID }, function (data) {});
  },
  async mounted() {
    this.loading = true;
    const queryString = decodeURIComponent(window.location.search).replace(
      "?liff.state=",
      ""
    );
    const params = new URLSearchParams(queryString);

    const uuid = params.get("uid");
    if (uuid) {
      this.uid = uuid;
    }
    await this.checkLiffLogin();
    this.loading = false;
  },
  methods: {
    async checkLiffLogin() {
      await liff.ready.then(async () => {
        if (!liff.isLoggedIn()) {
          liff.login({ redirectUri: window.location });
        } else {
          await this.getInfo();
        }
      });
    },

    async getInfo() {
      let idToken = "";
      let uid = "";
      if (!this.uid) {
        idToken = liff.getDecodedIDToken()
        uid = idToken.sub;
      } else {
        uid = this.uid;
      }

      const response = await axios({
        method: "post",
        url: `https://0f08-202-183-226-2.ngrok-free.app/myprojects-347817/asia-northeast1/workshop-info`,
        headers: {
          Authorization: `${idToken}`,
          "Content-Type": "application/json",
        },
        data: {
          uid: uid,
        },
      });

      if (response.data.userObject) {
        this.name = response.data.userObject.name;
        this.email = idToken.email;
        this.gender = response.data.userObject.gender;
        this.img = response.data.userObject.pictureUrl;
      } else {
        router.push("/register");
      }
    },
  },
};
</script>
