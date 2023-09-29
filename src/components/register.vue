<template>
    <form @submit.prevent="submitForm" class="container mt-4">
        <div class="mb-3">
            <label for="phone" class="form-label">Phone Number:</label>
            <input type="text" id="phone" v-model.trim="phoneNumber" class="form-control" @input="validatePhoneNumber" />
            <div v-if="phoneNumberError" class="invalid-feedback">
                {{ phoneNumberError }}
            </div>
        </div>
    
        <button type="submit" class="btn btn-primary">Register</button>
    </form>
</template>
  
<script>
import liff from "@line/liff";
export default {
    data() {
        return {
            menu: []
        }
    },

    beforeCreate() {
        liff.init({ liffId: import.meta.env.VITE_LIFF_ID }, function(data) {})
    },
    async mounted() {
        await this.checkLiffLogin()
    },
    methods: {
        async checkLiffLogin() {
            await liff.ready.then(async () => {
                if (!liff.isLoggedIn()) {
                    liff.login({ redirectUri: window.location })
                } else {
                    console.log("2");
                    await this.getProfile()
                }
            })
        },
        async getProfile() {
            console.log("getIDToken");
            const idToken = await liff.getIDToken();
            console.log(idToken); // print raw idToken object
        },


    },
};
</script>
  
<style>
.error {
    color: red;
}
</style>
  