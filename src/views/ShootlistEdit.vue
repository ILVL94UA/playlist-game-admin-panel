<template lang="html">
  <div>

    <v-layout class="py-3" row wrap>
      <v-flex xs6>
        <div class="display-1 mb-2">Promo settings</div>
      <v-divider/>
      <v-layout row align-start class="pt-4">
        <v-layout>
        <v-switch
            v-model="data.is_promo"
            label="Is promo only"
          />
          </v-layout>
          <v-layout>
            <v-text-field 
          v-if="data.is_promo"
            :label="'Search by code'"
            type="text" 
            outline
            @input="filterPromo"
          ></v-text-field>
        <v-select
        v-if="data.is_promo"
          label="Promos"
          v-model="data.id_promo"
          chips
          :items="promosFiltered"
          item-text="value"
          item-value="id_promo"
          solo
          multiple
        ></v-select>
        </v-layout>
        
      </v-layout>
      </v-flex>
      <v-flex>
        <small>PLAYED</small>
        <p>{{ data.played }}</p>
      </v-flex>
      <v-flex>
        <small>SKIPPED</small>
        <p>{{ data.skipped }}</p>
      </v-flex>
      <v-flex>
        <small>LIKED</small>
        <p>{{ data.liked }}</p>
      </v-flex>
      <v-flex>
        <small>CREATED</small>
        <p>{{ new Date(data.date * 1000) | dateFormat('DD.MM.YY') }}</p>
      </v-flex>
    </v-layout>

    <v-layout row class="pb-1 pt-3">
      <v-flex xs9>
        <v-layout align-start column justify-center fill-height>
          <h2>Shootlist game</h2>
          <v-switch
            v-model="data.show"
            label="VISIBLE"
          />
        </v-layout>
      </v-flex>
      <v-flex xs3>
        <v-layout align-center justify-end>
          <v-btn color="error" @click="dialog.delete = true" flat>DELETE</v-btn>
          <v-btn color="success" @click="save">SAVE</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-divider/>

    <v-form class="pt-4">
      <v-text-field
        label="Order index"
        outline
        v-model="data.order_index"
        type="number"
      ></v-text-field>
      <!--v-textarea
        label="Question(Female)"
        outline
        v-model="data.translation[0].data.content_fem"
      ></v-textarea-->
      <v-textarea
        label="Question(Male)"
        outline
        v-model="data.content_man"
        @input="nameInput"
      ></v-textarea>
      <div class="languages">
        <div v-if="lang.length>0 " class="display-1 mb-2">Translate</div>
        <template v-for="trans in data.translation" >
          <v-btn v-if="getLang(trans)!=='Hebrew'" text @click="openCategory(trans)" color="info">{{getLang(trans)}}</v-btn>
        </template>

      </div>
      <!-- <div class="display-1 mb-2">Category</div>
      <v-divider/>
      <v-radio-group required v-model="data.category">
        <v-radio
          v-for="item in categories"
          :label="item.name"
          :value="item.id"
        ></v-radio>
      </v-radio-group> -->
      <div class="display-1 mb-2">Shootlist categories</div>
      <v-divider/>
      <v-layout row align-start class="pt-4">
        <v-select
          label="In promo shootlist categories"
          v-model="data.category"
          chips
          :items="categories"
          item-text="name"
          item-value="id"
          solo
          multiple
        ></v-select>
        
      </v-layout>

      <!--div class="display-1 mb-2">For:</div>
      <v-divider/>
      <v-layout row align-start class="pt-4 mb-5">
        <v-radio-group v-model="data.for_type">
          <v-radio
            label="מעורב"
            value="1"
          ></v-radio>
          <v-radio
            label="ילדים"
            value="2"
          ></v-radio>
          <v-radio
            label="בוגרים"
            value="3"
          ></v-radio>
        </v-radio-group>
      </v-layout-->

      <div class="display-1 mb-2">
        Credit
        <v-icon @click="deleteAuthor">delete</v-icon>
      </div>
      <v-divider/>
      <v-layout row align-start class="pt-4">
        <v-text-field @input="searchUser" label="User name" v-model="user" type="text" solo></v-text-field>
        <v-select
          label="user"
          v-model="data.id_author"
          :items="users"
          item-text="name"
          item-value="id_user"
          solo
        ></v-select>
      </v-layout>
      <v-layout row align-start class="pt-4">
        <v-text-field @input="searchSchool" label="School" v-model="school" type="text" solo></v-text-field>
        <v-select
          label="School"
          v-model="data.id_school"
          :items="schools"
          item-text="name"
          item-value="id_school"
          solo
        ></v-select>
      </v-layout>
      <v-layout row align-start class="pt-4">
        <v-text-field label="City" v-model="data.city" type="text" solo></v-text-field>
      </v-layout>
    </v-form>


    <v-snackbar
      v-model="alert.update"
      right
      top
      :timeout="2000"
    >
      Updated.
      <v-btn
        color="pink"
        flat
        @click="alert.update = false"
      >
        Close
      </v-btn>
    </v-snackbar>

    <v-snackbar
      v-model="alert.delete"
      right
      top
      :timeout="2000"
    >
      Deleted.
      <v-btn
        color="pink"
        flat
        @click="alert.delete = false"
      >
        Close
      </v-btn>
    </v-snackbar>

    <v-dialog
      v-model="dialog.delete"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Delete ensurance
        </v-card-title>

        <v-card-text>
          Do you realy want to delete it?
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="default"
            flat
            @click="dialog.delete = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            flat
            @click="remove"
          >
            Yes, delete it
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-if="transLang"
      v-model="dialogTr"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Updating translate {{getLang(transLang)}}
        </v-card-title>

        <v-card-text>
           <!--v-text-field label="Question(Female)" v-model="transLang.data.content_fem" category="text"></v-text-field-->
          <v-text-field label="Question(Male)" v-model="transLang.data.content_man" category="text"></v-text-field>
              <v-layout justify-end>
          </v-layout>

          <v-btn @click="save"  color="success">
            update
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import CryptoJS from "crypto-js";
import { Base64 } from 'js-base64';
export default {
  data() {
    return {
      data: {
        answers: {
          right: 1,
          first: '',
          second: '',
          third: '',
        }
      },
      alert: {
        update: false,
        delete: false,
      },
      dialog: {
        delete: false,
      },
      lang: [],
      dialogTr: false,
      transLang: '',
      user: '',
      promos:[],
      users: [],
      school: '',
      schools: [],
      categories: [],
      promosFiltered:[]
    };
  },
  methods: {
    nameInput(e){
      console.log(e);
      this.data.translation[0].data.content_man = e;
    },
    openCategory (lang) {
      this.dialogTr = true;
      this.transLang = lang;
    },
    getLang(trans){
      console.log(trans);
      let item = this.lang.find(item=>{return item.lang_code === trans.langKey});
      return item ? item.lang_title : (trans.langKey==='heb'? 'Hebrew' : trans.langKey)
    },
    getCategory () {
      axios.get('/shootlist/categoryAdm').then(res => {
          this.categories = res.data.categories;
        });
    },
    deleteAuthor () {
      this.users = [];
      this.user = '';
      this.data.id_author = null;

      this.schools = [];
      this.school = '';
      this.data.id_school = null;

      this.data.city = null;
    },
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
    searchUser() {
      if(!this.user.length) return;
      axios.post('/user/search', this.encryptObject({
        name: this.user
      })).then(res => {
        let data = this.decryptData(res.data)
        this.users = data.map(n => {
          n.name = n.name + ' ' + n.surname;
          return n;
        });
        this.users.unshift({
          name: 'Empty',
          id_user: null,
        });
      });
    },
    sync() {
      axios.get('/shootlist/' + this.$route.params.id_shootlist + '/full').then(res => {
        this.data = res.data;
        if(res.data.author) {
          this.users.push({
            name: 'Empty',
            id_user: null,
          });
          this.users.push(res.data.author);
          this.user = res.data.author.name;
        }
        if(res.data.school_info) {
          this.schools.push({
            name: 'Empty',
            id_school: null,
          });
          this.schools.push(res.data.school_info);
          this.school = res.data.school_info.name;
        }

        this.getCategory();
      });
      axios.get('/lang').then(res => {
        this.lang = res.data;
      });
    },
    save() {
      axios.put('/shootlist/' + this.$route.params.id_shootlist, this.data).then(res => {
        this.alert.update = true;
        this.sync();
      });
      this.dialogTr = false;

    },
    remove() {
      axios.delete('/shootlist/' + this.$route.params.id_shootlist).then(res => {
        this.dialog.delete = false;
        this.alert.delete = true;
        this.$router.push('/shootlist');
      })
    },
    getPromoCodes() {
      axios.get('/admin/promo').then(res => {
        this.promos = res.data.sort((a, b) => a.value.toLowerCase() > b.value.toLowerCase() ? 1 : -1);
        this.promosFiltered = res.data.sort((a, b) => a.value.toLowerCase() > b.value.toLowerCase() ? 1 : -1);
      });
    },
    filterPromo(e){
      this.promosFiltered = this.promos.filter(x=>x.value.toLowerCase().includes(e.toLowerCase()));
    },
    searchSchool() {
      if(!this.school.length) return;
      axios.post('/school/search', {
        name: this.school,
      }).then(res => {
        this.schools = res.data;
        this.schools.unshift({
          name: 'Empty',
          id_school: null,
        });
      });
    },
  },
  created() {
    this.sync();
    this.getPromoCodes();
  }
}
</script>

<style lang="scss" scoped>

</style>
