<template lang="html">
  <div class="login-class">
    <v-form class="login-form" v-model="valid">
      <v-text-field
        v-model="email"
        label="E-mail"
        type="email"
        required
      ></v-text-field>

      <v-text-field
        v-model="pass"
        label="Password"
        required
        type="password"
      ></v-text-field>

      <v-btn
        :disabled="!valid"
        color="success"
        @click="login"
      >
        Validate
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import CryptoJS from "crypto-js";
import { Base64 } from 'js-base64';
export default {
  data() {
    return {
      email: '',
      pass: '',
      valid: false,
    };
  },
  methods: {
    encryptObject(data) {
      const key = CryptoJS.enc.Utf8.parse(process.env['VUE_APP_SECURE_KEY']);
      const iv = CryptoJS.lib.WordArray.random(16);
      const ivBase64 = CryptoJS.enc.Base64.stringify(iv);

      const objectToEncryptString = JSON.stringify(data);

      const encrypted = CryptoJS.AES.encrypt(objectToEncryptString, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        keySize: 256 / 8,
      });

      const encryptedObject = {
        iv: ivBase64,
        value: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
      };
      return encryptedObject;
    },
    decryptData(res){
      var key = process.env["VUE_APP_SECURE_KEY"];
      var encrypted = res.payload;
      var encrypted_json  = JSON.parse(Base64.decode(encrypted));
      var decrypted = CryptoJS.AES.decrypt(encrypted_json.value, CryptoJS.enc.Base64.parse(Base64.encode(key)),{
                        iv: CryptoJS.enc.Base64.parse(encrypted_json.iv),
                        mode: CryptoJS.mode.CBC
                      });
      let data = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
      
      return data;
    },
    login() {
      if(this.valid) {
        axios.post('/user/login', this.encryptObject({
          email: this.email,
          pass: this.pass,
        })).then(res => {
          let data = this.decryptData(res.data)
          axios.defaults.headers.common['Authorization'] = data.auth;
          this.$root.logged = true;
          this.$cookie.set('auth', data.auth);
          this.$router.push('/');
        }).catch(err=>{
          this.$notify({
            title: "שְׁגִיאָה",
            text: "אתה לא מנהל",
            type: "error",
            duration: 5000,
          });
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-class{
  .login-form{
    margin-top: 30vh;
    max-width: 300px;
    margin-right: auto;
    margin-left: auto;
    border: 1px solid black;
    padding: 20px;
    border-radius: 10px;
  }
}


</style>
