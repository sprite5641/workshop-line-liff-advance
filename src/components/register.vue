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
import axios from "axios"
export default {
    data() {
        return {
            menu: [],
            phoneNumber: ""
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
                }
            })
        },
        async submitForm() {
            const idToken = await liff.getIDToken();
            console.log("idToken", idToken);
            console.log("phoneNumber", this.phoneNumber);

            await axios({
                method: 'post',
                url: 'https://2a1a-202-183-226-2.ngrok-free.app/lab-line-thepnatee2/asia-northeast1/workshop-auth',
                headers: {
                    'Authorization' : idToken
                },
                data: {
                    phoneNumber:  this.phoneNumber,
                }
            })
        }


    },
};
</script>
  
<style>
.error {
    color: red;
}
</style>
  